// functions/src/index.ts
import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import { z } from "zod";

import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
if (!getApps().length) initializeApp();

// ===== CORS: dev abierto, prod restringido =====
const allowedProdOrigins = ["https://tu-dominio.com"]; // TODO: ajusta cuando se publique
const corsHandler = cors({
  origin: process.env.NODE_ENV === "production" ? allowedProdOrigins : true,
});

// ===== Rate limit en memoria (dev/emu) =====
const BUCKET = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 60_000;
function hit(ip: string) {
  const now = Date.now();
  const arr = (BUCKET.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  BUCKET.set(ip, arr);
  return arr.length;
}

// ===== Sanitizado básico =====
const CTRL = /[\u0000-\u001F\u007F]/g;      // control chars
const TAGS = /<[^>]*>/g;                     // HTML tags
const URLS = /(https?:\/\/|www\.)\S+/gi;     // URLs
function clean(s: string, max = 5000) {
  return s.replace(TAGS, "").replace(CTRL, "").replace(/\s+/g, " ").trim().slice(0, max);
}

// ===== Esquema Zod (captcha opcional en parseo) =====
// Lo exigimos solo en producción más abajo.
const ContactSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().email().max(160),
  subject: z.string().min(2).max(160),
  message: z.string().min(10).max(300),
  ts: z.number().optional(),
  company: z.string().optional(),          // honeypot
  captcha: z.string().min(10).optional(),  // Turnstile token (solo prod)
});

export const contact = onRequest(
  {
    region: "us-central1",
    // En prod, Functions inyectará el secreto como env var:
    // configúralo con: firebase functions:secrets:set TURNSTILE_SECRET
    secrets: ["TURNSTILE_SECRET"],
  },
  (req: any, res: any) => {
    corsHandler(req, res, async () => {
      // Preflight
      if (req.method === "OPTIONS") { res.status(204).end(); return; }
      if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

      // Tamaño defensivo
      const len = Number(req.headers["content-length"] || 0);
      if (len > 20_000) { res.status(413).json({ error: "Payload too large" }); return; }

      // Id cliente
      const ip = (req.headers["x-forwarded-for"] || req.ip || "unknown").toString();
      const userAgent = String(req.headers["user-agent"] || "unknown");

      // Rate limit suave
      if (hit(ip) > LIMIT) {
        console.info("[429] rate-limit", { ip, userAgent });
        res.status(429).json({ error: "Too many requests. Please wait a moment." });
        return;
      }

      // JSON requerido
      const ctype = String(req.headers["content-type"] || "");
      if (!ctype.includes("application/json")) { res.status(415).json({ error: "Unsupported media type" }); return; }

      // Validación base
      const parsed = ContactSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        res.status(400).json({
          error: "Invalid payload",
          issues: parsed.error.issues.map(i => ({ path: i.path.join("."), message: i.message })),
        });
        return;
      }

      const { name, email, subject, message, ts, company, captcha } = parsed.data;

      // Honeypot
      if (company && company.trim()) {
        console.info("[honeypot] skipped", { ip, userAgent });
        res.json({ ok: true, skipped: true });
        return;
      }

      // Anti-speed (2.5s)
      if (typeof ts === "number" && Number.isFinite(ts) && Date.now() - ts < 2500) {
        res.status(429).json({ error: "Too fast. Please review and resend." });
        return;
      }

      // ===== Verificación Turnstile SOLO en producción =====
      const isProd = process.env.NODE_ENV === "production";
      if (isProd) {
        if (!captcha) {
          res.status(400).json({ error: "Captcha required" });
          return;
        }
        const secret = process.env.TURNSTILE_SECRET || "";
        if (!secret) {
          console.error("[500] TURNSTILE_SECRET missing");
          res.status(500).json({ error: "Captcha secret not configured" });
          return;
        }
        try {
          const vr = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ secret, response: captcha }),
          });
          const verify: any = await vr.json().catch(() => ({}));
          if (!verify?.success) {
            res.status(400).json({ error: "Captcha verification failed" });
            return;
          }
        } catch (e) {
          console.error("[502] Turnstile verify error", (e as Error).message);
          res.status(502).json({ error: "Captcha service unavailable" });
          return;
        }
      }

      // Sanitizado antes de guardar
      const safe = {
        name: clean(name, 30),
        email: email.toLowerCase().trim().slice(0, 160),
        subject: clean(subject, 160),
        message: clean(message, 300).replace(URLS, "[link removed]"),
      };

      // Guardar en Firestore
      try {
        const db = getFirestore();
        await db.collection("contacts").add({
          ...safe,
          createdAt: FieldValue.serverTimestamp(),
          ip,
          userAgent,
          meta: { via: "landing", tsClient: ts ?? null, skipped: !!company },
        });
      } catch (e) {
        console.error("[500] store error", (e as Error).message);
        res.status(500).json({ error: "Failed to store message" });
        return;
      }

      res.json({ ok: true });
    });
  }
);
