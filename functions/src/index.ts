// functions/src/index.ts
import { onRequest } from "firebase-functions/v2/https";
import cors from "cors";
import { z } from "zod";

/* -------------------------------------------
   CORS abierto solo para desarrollo en emulador
---------------------------------------------- */
const corsHandler = cors({ origin: true });

/* -------------------------------------------
   Validación con zod
---------------------------------------------- */
const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  subject: z.string().min(2).max(160),
  message: z.string().min(10).max(5000),
  ts: z.number().optional(),      // timestamp del cliente
  company: z.string().optional(), // honeypot
});

/* -------------------------------------------
   Cloud Function principal
---------------------------------------------- */
export const contact = onRequest({ region: "us-central1" }, (req: any, res: any) => {
  corsHandler(req, res, async () => {
    // 1) Preflight CORS
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    // 2) Solo permitimos POST
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    // 3) Verificamos que el body sea JSON
    const ctype = String(req.headers["content-type"] || "");
    if (!ctype.includes("application/json")) {
      res.status(415).json({ error: "Unsupported media type" });
      return;
    }

    // 4) Validamos con zod
    const parsed = ContactSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid payload",
        issues: parsed.error.issues.map(i => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    const { name, email, subject, message, ts, company } = parsed.data;

    // 5) Honeypot: si 'company' viene lleno, no procesamos nada
    if (company && company.trim()) {
      res.json({ ok: true, skipped: true });
      return;
    }

    // 6) Anti relleno ultra rápido (protege contra bots)
    if (typeof ts === "number" && Number.isFinite(ts)) {
      const elapsed = Date.now() - ts;
      if (elapsed < 2500) {
        res.status(429).json({ error: "Too fast. Please review and resend." });
        return;
      }
    }

    // 7) Simulación de trabajo real
    await new Promise(r => setTimeout(r, 150));

    // 8) Respuesta exitosa
    res.json({ ok: true, received: { name, email, subject, message } });
  });
});
