// functions/src/index.ts
import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import { z } from "zod";

// Firebase Admin (Firestore)
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
if (!getApps().length) initializeApp();

/* CORS (dev) */
const corsHandler = cors({ origin: true });

/* Rate limit suave en memoria */
const BUCKET = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 60_000;
function hit(ip: string) {
  const now = Date.now();
  const arr = (BUCKET.get(ip) || []).filter(t => now - t < WINDOW_MS);
  arr.push(now);
  BUCKET.set(ip, arr);
  return arr.length;
}

/* Zod (sin captcha) */
const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  subject: z.string().min(2).max(160),
  message: z.string().min(10).max(5000),
  ts: z.number().optional(),
  company: z.string().optional(), // honeypot
});

export const contact = onRequest({ region: "us-central1" }, (req: any, res: any) => {
  corsHandler(req, res, async () => {
    if (req.method === "OPTIONS") { res.status(204).end(); return; }
    if (req.method !== "POST") { res.status(405).json({ error: "Method not allowed" }); return; }

    const ip = (req.headers["x-forwarded-for"] || req.ip || "unknown").toString();
    if (hit(ip) > LIMIT) { res.status(429).json({ error: "Too many requests. Please wait a moment." }); return; }

    const ctype = String(req.headers["content-type"] || "");
    if (!ctype.includes("application/json")) { res.status(415).json({ error: "Unsupported media type" }); return; }

    const parsed = ContactSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid payload",
        issues: parsed.error.issues.map(i => ({ path: i.path.join("."), message: i.message })),
      });
      return;
    }

    const { name, email, subject, message, ts, company } = parsed.data;

    // Honeypot
    if (company && company.trim()) { res.json({ ok: true, skipped: true }); return; }

    // Anti relleno rápido
    if (typeof ts === "number" && Number.isFinite(ts) && Date.now() - ts < 2500) {
      res.status(429).json({ error: "Too fast. Please review and resend." });
      return;
    }

    // Guardar en Firestore (emulador o prod)
    try {
      const db = getFirestore();
      await db.collection("contacts").add({
        name, email, subject, message,
        ip,
        createdAt: FieldValue.serverTimestamp(),
        meta: { via: "landing", tsClient: ts ?? null, skipped: !!company },
      });
    } catch {
      res.status(500).json({ error: "Failed to store message" });
      return;
    }

    res.json({ ok: true });
  });
});
