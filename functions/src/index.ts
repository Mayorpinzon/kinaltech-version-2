// functions/src/index.ts
import * as functions from "firebase-functions";
import type { Request, Response } from "express";
import { z } from "zod";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

// --- Runtime config (Spark-friendly) -----------------------------------------
// Set these with: firebase functions:config:set ...
const runtimeConfig = functions.config();

const TURNSTILE_SECRET: string = runtimeConfig.turnstile?.secret ?? "";
const SENDGRID_API_KEY: string = runtimeConfig.sendgrid?.key ?? "";
const CONTACT_TO: string = runtimeConfig.contact?.to ?? "";
const CONTACT_FROM: string = runtimeConfig.contact?.from ?? "";

// Allowed origins for CORS (adjust to your domains or keep '*' during testing)
const ALLOWED_ORIGINS = new Set<string>([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  // "https://your-domain.com",
]);

// --- Firebase Admin (Firestore) ----------------------------------------------
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// --- SendGrid setup ----------------------------------------------------------
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  functions.logger.warn("SENDGRID_API_KEY is not set; emails will not be sent.");
}

// --- Utilities ---------------------------------------------------------------

/** Safe control-chars remover (fixes no-control-regex) */
function stripControlChars(value: string): string {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // Deja solo caracteres imprimibles
    if (code >= 32 && code !== 127) {
      out += value[i];
    } else {
      out += " ";
    }
  }
  return out;
}

/** Minimal sanitizer for text inputs */
function sanitizeText(s: unknown, max = 500): string {
  if (typeof s !== "string") return "";
  return stripControlChars(s).slice(0, max);
}

/** Build a simple CORS response; returns true if preflight was handled */
function applyCors(req: Request, res: Response): boolean {
  const origin = req.headers.origin ?? "";
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // During dev, you can relax this to '*' if needed:
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

// --- Schema ------------------------------------------------------------------

/** Keep in sync with the frontend Contact form */
const ContactSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().email().max(160),
  subject: z.string().min(2).max(160),
  message: z.string().min(10).max(300),
  // optional metadata:
  ts: z.number().optional(),
  company: z.string().optional(), // honeypot (should be empty)
  captcha: z.string().optional(), // Turnstile token
});
type ContactPayload = z.infer<typeof ContactSchema>;

type Issue = { path: string; message: string };
type ErrorBody = { error: string; issues?: Issue[] };

// --- Turnstile verification --------------------------------------------------

async function verifyTurnstile(token: string, ip: string | undefined): Promise<boolean> {
  if (!TURNSTILE_SECRET) {
    // In dev, skip verification but stay explicit
    return false; // set to true to bypass in dev if needed
  }
  try {
    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    });
    const data = (await resp.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

// --- Persistence + Email helpers --------------------------------------------

async function saveContactToFirestore(clean: ContactPayload): Promise<void> {
  const doc = {
    ...clean,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection("contactMessages").add(doc);
}

async function sendContactEmail(clean: ContactPayload): Promise<void> {
  if (!SENDGRID_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    functions.logger.warn(
      "Email config incomplete (SENDGRID_API_KEY / contact.to / contact.from). Skipping email send."
    );
    return;
  }

  const recipients = CONTACT_TO.split(",").map((e) => e.trim()).filter(Boolean);

  if (!recipients.length) {
    functions.logger.warn("CONTACT_TO is empty after parsing. Skipping email send.");
    return;
  }

  const safeName = sanitizeText(clean.name, 60) || "No name";
  const safeSubject =
    sanitizeText(clean.subject, 160) || "New contact form message (no subject)";
  const preview = sanitizeText(clean.message, 200);

  const msg = {
    to: recipients,
    from: CONTACT_FROM,
    subject: `New contact form message: ${safeSubject}`,
    text:
      `You have received a new contact form submission:\n\n` +
      `Name: ${safeName}\n` +
      `Email: ${clean.email}\n` +
      `Subject: ${safeSubject}\n\n` +
      `Message:\n${clean.message}\n\n`,
    html:
      `<p>You have received a new contact form submission:</p>` +
      `<p><strong>Name:</strong> ${safeName}</p>` +
      `<p><strong>Email:</strong> ${clean.email}</p>` +
      `<p><strong>Subject:</strong> ${safeSubject}</p>` +
      `<p><strong>Message:</strong></p>` +
      `<pre style="white-space:pre-wrap;font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">${clean.message}</pre>` +
      `<hr />` +
      `<p>Preview:</p>` +
      `<p>${preview}</p>`,
  };

  await sgMail.send(msg);
}

// --- Main handler ------------------------------------------------------------

export const contact = functions.https.onRequest(async (req: Request, res: Response) => {
  if (applyCors(req, res)) return; // handled preflight

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" } satisfies ErrorBody);
    return;
  }

  // Ensure JSON body
  if (!req.is("application/json")) {
    res.status(415).json({ error: "Unsupported media type" } satisfies ErrorBody);
    return;
  }

  // Parse body as unknown, then validate with Zod (no 'any')
  const payloadUnknown: unknown = req.body;

  const parsed = ContactSchema.safeParse(payloadUnknown);
  if (!parsed.success) {
    const issues: Issue[] = parsed.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    res.status(400).json({
      error: "Validation failed",
      issues,
    } satisfies ErrorBody);
    return;
  }

  const body: ContactPayload = parsed.data;

  // Honeypot check
  if (body.company && body.company.trim().length > 0) {
    // Pretend success, don't process further
    res.status(200).json({ ok: true });
    return;
  }

  // Basic anti-speed (client also does this, but we re-guard)
  const now = Date.now();
  if (typeof body.ts === "number" && now - body.ts < 1200) {
    res.status(429).json({
      error: "Too fast. Please try again.",
    } satisfies ErrorBody);
    return;
  }

  // Verify Turnstile (if secret available)
  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim();
  const token = body.captcha ?? "";

  if (TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(token, ip);
    if (!ok) {
      res.status(403).json({
        error: "Captcha verification failed",
        issues: [{ path: "captcha", message: "Invalid or missing token" }],
      } satisfies ErrorBody);
      return;
    }
  }

  // Sanitize text fields before any downstream use (email is kept raw for delivery)
  const clean: ContactPayload = {
    ...body,
    name: sanitizeText(body.name, 60),
    subject: sanitizeText(body.subject, 180),
    message: sanitizeText(body.message, 1000),
  };
  console.log("contact payload", {
    name: clean.name,
    email: clean.email,
    subject: clean.subject,
    msgLen: clean.message.length,
  });

  try {
    await Promise.all([
      saveContactToFirestore(clean),
      sendContactEmail(clean),
    ]);
  } catch (e) {
    functions.logger.error("contact handler failed", e);

    res.status(500).json({
      error: "Server error. Please try again later.",
    } satisfies ErrorBody);
    return;
  }

  res.status(200).json({ ok: true });
});
