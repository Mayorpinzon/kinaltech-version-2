/// <reference types="@cloudflare/workers-types" />
// workers/contact/src/index.ts
// Cloudflare Worker for contact form submission

import { z } from "zod";
import { EmailMessage } from "cloudflare:email";

declare global {
  interface SendEmail {
    send(message: EmailMessage): Promise<void>;
  }
}

// --- Environment Variables (set in Cloudflare Dashboard) ---
interface Env {
  TURNSTILE_SECRET: string;
  SEND_EMAIL: SendEmail; // Cloudflare Workers Email binding
  CONTACT_KV: KVNamespace; // Cloudflare KV namespace for storing messages
  // Optional: For Firestore fallback (if needed)
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_SERVICE_ACCOUNT?: string;
}

// --- CORS Configuration ---
const ALLOWED_ORIGINS = new Set<string>([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://kinaltech-dev.web.app",
]);

// --- Utilities ---

/** Safe control-chars remover */
function stripControlChars(value: string): string {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // Keep only printable characters
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

/** Build CORS headers */
function getCorsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  } else {
    // In development, allow all origins (remove in production)
    headers.set("Access-Control-Allow-Origin", "*");
  }
  
  headers.set("Vary", "Origin");
  headers.set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Authorization");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Max-Age", "86400");
  
  return headers;
}

/** Handle CORS preflight */
function handleCors(request: Request): Response | null {
  if (request.method === "OPTIONS") {
    const origin = request.headers.get("Origin");
    const headers = getCorsHeaders(origin);
    return new Response(null, { status: 204, headers });
  }
  return null;
}

// --- Validation Schema (matches frontend) ---
const ContactSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().email().max(160),
  subject: z.string().min(2).max(160),
  message: z.string().min(10).max(300),
  // Optional metadata
  ts: z.number().optional(),
  company: z.string().optional(), // honeypot (should be empty)
  captcha: z.string().optional(), // Turnstile token
  lang: z.string().optional(), // i18n language code
});

type ContactPayload = z.infer<typeof ContactSchema>;

type Issue = { path: string; message: string };
type ErrorBody = { error: string; issues?: Issue[] };
type SuccessBody = { ok: boolean };

// --- Turnstile Verification ---
async function verifyTurnstile(
  token: string,
  ip: string | undefined,
  secret: string
): Promise<boolean> {
  if (!secret || !token) {
    return false;
  }

  try {
    const formData = new URLSearchParams({
      secret,
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    });

    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    const data = (await resp.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

// --- Persistence: Save to Cloudflare KV ---
async function saveContactToKV(
  clean: ContactPayload,
  kv: KVNamespace,
  lang?: string
): Promise<void> {
  const key = `contact:${Date.now()}:${Math.random().toString(36).substring(7)}`;
  const value = JSON.stringify({
    ...clean,
    lang: lang || "en",
    createdAt: new Date().toISOString(),
  });

  await kv.put(key, value, {
    expirationTtl: 60 * 60 * 24 * 365, // 1 year
  });
}

// --- Email: Send via Cloudflare Workers Email ---
async function sendContactEmail(
  clean: ContactPayload,
  sendEmail: SendEmail
): Promise<void> {
  if (!sendEmail) {
    console.warn("SEND_EMAIL binding not available. Skipping email send.");
    return;
  }

  const safeName = sanitizeText(clean.name, 60) || "No name";
  const safeSubject = sanitizeText(clean.subject, 160) || "New contact form message (no subject)";
  const preview = sanitizeText(clean.message, 200);


  // IMPORTANT: Both from and to addresses must be verified in Cloudflare Email Routing
  const fromEmail = "no-reply@notify.kinaltech.com";
  const toEmail = "kinaltech-info-box@kinaltech.com";
  
  const plainText =
    `You have received a new contact form submission:\n\n` +
    `Name: ${safeName}\n` +
    `Email: ${clean.email}\n` +
    `Subject: ${safeSubject}\n\n` +
    `Message:\n${clean.message}\n\n`;

  const htmlContent =
    `<p>You have received a new contact form submission:</p>` +
    `<p><strong>Name:</strong> ${safeName}</p>` +
    `<p><strong>Email:</strong> ${clean.email}</p>` +
    `<p><strong>Subject:</strong> ${safeSubject}</p>` +
    `<p><strong>Message:</strong></p>` +
    `<pre style="white-space:pre-wrap;font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">${clean.message}</pre>` +
    `<hr />` +
    `<p>Preview:</p>` +
    `<p>${preview}</p>`;

  // Create MIME message - simplified format
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  const mimeMessage = [
    `Message-ID: <${Date.now()}-${Math.random().toString(36).substring(2, 9)}@notify.kinaltech.com>`,
    `Date: ${new Date().toUTCString()}`,
    `From: Contact Form <${fromEmail}>`,
    `To: ${toEmail}`,
    `Reply-To: ${clean.name} <${clean.email}>`,
    `Subject: New contact form message: ${safeSubject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    plainText,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlContent,
    ``,
    `--${boundary}--`,
  ].join("\r\n");

  const message = new EmailMessage(fromEmail, toEmail, mimeMessage);

  try {
    await sendEmail.send(message);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Email send error details:", {
      from: fromEmail,
      to: toEmail,
      error: errorMessage,
    });
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
}

// --- Main Handler ---
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    // Only allow POST
    if (request.method !== "POST") {
      const origin = request.headers.get("Origin");
      const headers = getCorsHeaders(origin);
      headers.set("Content-Type", "application/json");
      return new Response(
        JSON.stringify({ error: "Method not allowed" } satisfies ErrorBody),
        { status: 405, headers }
      );
    }

    // Ensure JSON content type
    const contentType = request.headers.get("Content-Type");
    if (!contentType || !contentType.includes("application/json")) {
      const origin = request.headers.get("Origin");
      const headers = getCorsHeaders(origin);
      headers.set("Content-Type", "application/json");
      return new Response(
        JSON.stringify({ error: "Unsupported media type" } satisfies ErrorBody),
        { status: 415, headers }
      );
    }

    try {
      // Parse and validate body
      const payloadUnknown: unknown = await request.json();

      const parsed = ContactSchema.safeParse(payloadUnknown);
      if (!parsed.success) {
        const issues: Issue[] = parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        }));

        const origin = request.headers.get("Origin");
        const headers = getCorsHeaders(origin);
        headers.set("Content-Type", "application/json");

        return new Response(
          JSON.stringify({
            error: "Validation failed",
            issues,
          } satisfies ErrorBody),
          { status: 400, headers }
        );
      }

      const body: ContactPayload = parsed.data;

      // Honeypot check
      if (body.company && body.company.trim().length > 0) {
        const origin = request.headers.get("Origin");
        const headers = getCorsHeaders(origin);
        headers.set("Content-Type", "application/json");
        return new Response(
          JSON.stringify({ ok: true } satisfies SuccessBody),
          { status: 200, headers }
        );
      }

      // Basic anti-speed check
      const now = Date.now();
      if (typeof body.ts === "number" && now - body.ts < 1200) {
        const origin = request.headers.get("Origin");
        const headers = getCorsHeaders(origin);
        headers.set("Content-Type", "application/json");
        return new Response(
          JSON.stringify({
            error: "Too fast. Please try again.",
          } satisfies ErrorBody),
          { status: 429, headers }
        );
      }

      // Verify Turnstile (if secret available)
      const ip =
        request.headers.get("CF-Connecting-IP") ||
        request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim();
      const token = body.captcha ?? "";

      if (env.TURNSTILE_SECRET) {
        const ok = await verifyTurnstile(token, ip, env.TURNSTILE_SECRET);
        if (!ok) {
          const origin = request.headers.get("Origin");
          const headers = getCorsHeaders(origin);
          headers.set("Content-Type", "application/json");
          return new Response(
            JSON.stringify({
              error: "Captcha verification failed",
              issues: [{ path: "captcha", message: "Invalid or missing token" }],
            } satisfies ErrorBody),
            { status: 403, headers }
          );
        }
      }

      // Sanitize text fields
      const clean: ContactPayload = {
        ...body,
        name: sanitizeText(body.name, 60),
        subject: sanitizeText(body.subject, 180),
        message: sanitizeText(body.message, 1000),
      };

      // Process in parallel: save to KV and send email
      await Promise.all([
        saveContactToKV(clean, env.CONTACT_KV, body.lang),
        sendContactEmail(clean, env.SEND_EMAIL).catch(
          (err) => {
            console.error("Email send failed:", err);
          }
        ),
      ]);

      // Success response
      const origin = request.headers.get("Origin");
      const headers = getCorsHeaders(origin);
      headers.set("Content-Type", "application/json");
      return new Response(
        JSON.stringify({ ok: true } satisfies SuccessBody),
        { status: 200, headers }
      );
    } catch (e) {
      console.error("Contact handler failed:", e);

      const origin = request.headers.get("Origin");
      const headers = getCorsHeaders(origin);
      headers.set("Content-Type", "application/json");
      return new Response(
        JSON.stringify({
          error: "Server error. Please try again later.",
        } satisfies ErrorBody),
        { status: 500, headers }
      );
    }
  },
};

