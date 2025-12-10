/// <reference types="@cloudflare/workers-types" />
// workers/contact/src/index.ts
// Cloudflare Worker for contact form submission

import { z } from "zod";
import {
  ALLOWED_ORIGINS,
  RATE_LIMIT_CONFIG,
  DISPOSABLE_EMAIL_DOMAINS,
  SPAM_KEYWORDS,
} from "./config";

// --- Environment Variables (set in Cloudflare Dashboard) ---
interface Env {
  TURNSTILE_SECRET: string;
  SENDGRID_API_KEY: string;
  SENDGRID_TO: string;
  SENDGRID_FROM: string;
  CONTACT_KV: KVNamespace; // Cloudflare KV namespace for storing messages
  RATE_LIMIT_KV: KVNamespace; // Cloudflare KV namespace for rate limiting
  // Optional: For Firestore fallback (if needed)
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_SERVICE_ACCOUNT?: string;
}

// --- Utilities ---

/** Safe control-chars remover */
function stripControlChars(value: string): string {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const code = value.codePointAt(i);
    // Keep only printable characters
    if (code !== undefined && code >= 32 && code !== 127) {
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

/** Check if email is from disposable domain */
function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
}

/** Check if message contains spam keywords */
function containsSpamKeywords(text: string): boolean {
  return SPAM_KEYWORDS.some((pattern) => pattern.test(text));
}

/** Rate limiting by IP address - checks both per-minute and per-day limits */
async function checkRateLimitByIP(
  ip: string,
  kv: KVNamespace
): Promise<{ allowed: boolean; remaining: number; resetAt: number; reason?: string }> {
  if (!ip) {
    console.warn("[Rate Limit] No IP address provided, skipping rate limit check");
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.IP_MAX_PER_MINUTE, resetAt: 0 };
  }

  const now = Math.floor(Date.now() / 1000);
  const minuteKey = `rate_limit:ip:minute:${ip}`;
  const dayKey = `rate_limit:ip:day:${ip}`;
  
  const minuteWindowStart = now - RATE_LIMIT_CONFIG.IP_WINDOW_MINUTE_SECONDS;
  const dayWindowStart = now - RATE_LIMIT_CONFIG.IP_WINDOW_DAY_SECONDS;
  
  console.log(`[Rate Limit] Checking IP rate limit for: ${ip}`);

  try {
    // Check per-minute limit
    const minuteData = await kv.get(minuteKey, "json");
    if (minuteData && typeof minuteData === "object" && "requests" in minuteData) {
      const minuteRequests = (minuteData as { requests: number[] }).requests.filter(
        (ts: number) => ts > minuteWindowStart
      );

      if (minuteRequests.length >= RATE_LIMIT_CONFIG.IP_MAX_PER_MINUTE) {
        const oldestRequest = Math.min(...minuteRequests);
        const resetAt = oldestRequest + RATE_LIMIT_CONFIG.IP_WINDOW_MINUTE_SECONDS;
        console.warn(`[Rate Limit] IP ${ip} exceeded per-minute limit: ${minuteRequests.length}/${RATE_LIMIT_CONFIG.IP_MAX_PER_MINUTE}`);
        return {
          allowed: false,
          remaining: 0,
          resetAt,
          reason: "per_minute",
        };
      }
    }

    // Check per-day limit
    const dayData = await kv.get(dayKey, "json");
    if (dayData && typeof dayData === "object" && "requests" in dayData) {
      const dayRequests = (dayData as { requests: number[] }).requests.filter(
        (ts: number) => ts > dayWindowStart
      );

      if (dayRequests.length >= RATE_LIMIT_CONFIG.IP_MAX_PER_DAY) {
        const oldestRequest = Math.min(...dayRequests);
        const resetAt = oldestRequest + RATE_LIMIT_CONFIG.IP_WINDOW_DAY_SECONDS;
        console.warn(`[Rate Limit] IP ${ip} exceeded per-day limit: ${dayRequests.length}/${RATE_LIMIT_CONFIG.IP_MAX_PER_DAY}`);
        return {
          allowed: false,
          remaining: 0,
          resetAt,
          reason: "per_day",
        };
      }
    }

    // Update counters
    const minuteDataToSave = minuteData && typeof minuteData === "object" && "requests" in minuteData
      ? (minuteData as { requests: number[] })
      : { requests: [] as number[] };
    const filteredMinuteRequests = minuteDataToSave.requests.filter((ts: number) => ts > minuteWindowStart);
    filteredMinuteRequests.push(now);

    const dayDataToSave = dayData && typeof dayData === "object" && "requests" in dayData
      ? (dayData as { requests: number[] })
      : { requests: [] as number[] };
    const filteredDayRequests = dayDataToSave.requests.filter((ts: number) => ts > dayWindowStart);
    filteredDayRequests.push(now);

    console.log(`[Rate Limit] Updating IP counters: minute=${filteredMinuteRequests.length}/${RATE_LIMIT_CONFIG.IP_MAX_PER_MINUTE}, day=${filteredDayRequests.length}/${RATE_LIMIT_CONFIG.IP_MAX_PER_DAY}`);

    await Promise.all([
      kv.put(minuteKey, JSON.stringify({ requests: filteredMinuteRequests }), {
        expirationTtl: RATE_LIMIT_CONFIG.IP_WINDOW_MINUTE_SECONDS,
      }),
      kv.put(dayKey, JSON.stringify({ requests: filteredDayRequests }), {
        expirationTtl: RATE_LIMIT_CONFIG.IP_WINDOW_DAY_SECONDS,
      }),
    ]);

    const remaining = Math.min(
      RATE_LIMIT_CONFIG.IP_MAX_PER_MINUTE - filteredMinuteRequests.length,
      RATE_LIMIT_CONFIG.IP_MAX_PER_DAY - filteredDayRequests.length
    );

    console.log(`[Rate Limit] IP rate limit updated successfully. Remaining: ${remaining}`);

    return {
      allowed: true,
      remaining,
      resetAt: now + RATE_LIMIT_CONFIG.IP_WINDOW_MINUTE_SECONDS,
    };
  } catch (err) {
    console.error("Rate limit KV read failed for IP:", ip, err);
    // On error, allow request but log
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.IP_MAX_PER_MINUTE, resetAt: 0 };
  }
}

/** Rate limiting by email address - checks both per-hour and per-day limits */
async function checkRateLimitByEmail(
  email: string,
  kv: KVNamespace
): Promise<{ allowed: boolean; remaining: number; resetAt: number; reason?: string }> {
  if (!email) {
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.EMAIL_MAX_PER_HOUR, resetAt: 0 };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const now = Math.floor(Date.now() / 1000);
  const hourKey = `rate_limit:email:hour:${normalizedEmail}`;
  const dayKey = `rate_limit:email:day:${normalizedEmail}`;
  
  const hourWindowStart = now - RATE_LIMIT_CONFIG.EMAIL_WINDOW_HOUR_SECONDS;
  const dayWindowStart = now - RATE_LIMIT_CONFIG.EMAIL_WINDOW_DAY_SECONDS;

  try {
    // Check per-hour limit
    const hourData = await kv.get(hourKey, "json");
    if (hourData && typeof hourData === "object" && "requests" in hourData) {
      const hourRequests = (hourData as { requests: number[] }).requests.filter(
        (ts: number) => ts > hourWindowStart
      );

      if (hourRequests.length >= RATE_LIMIT_CONFIG.EMAIL_MAX_PER_HOUR) {
        const oldestRequest = Math.min(...hourRequests);
        const resetAt = oldestRequest + RATE_LIMIT_CONFIG.EMAIL_WINDOW_HOUR_SECONDS;
        console.warn(`[Rate Limit] Email ${normalizedEmail} exceeded per-hour limit: ${hourRequests.length}/${RATE_LIMIT_CONFIG.EMAIL_MAX_PER_HOUR}`);
        return {
          allowed: false,
          remaining: 0,
          resetAt,
          reason: "per_hour",
        };
      }
    }

    // Check per-day limit
    const dayData = await kv.get(dayKey, "json");
    if (dayData && typeof dayData === "object" && "requests" in dayData) {
      const dayRequests = (dayData as { requests: number[] }).requests.filter(
        (ts: number) => ts > dayWindowStart
      );

      if (dayRequests.length >= RATE_LIMIT_CONFIG.EMAIL_MAX_PER_DAY) {
        const oldestRequest = Math.min(...dayRequests);
        const resetAt = oldestRequest + RATE_LIMIT_CONFIG.EMAIL_WINDOW_DAY_SECONDS;
        console.warn(`[Rate Limit] Email ${normalizedEmail} exceeded per-day limit: ${dayRequests.length}/${RATE_LIMIT_CONFIG.EMAIL_MAX_PER_DAY}`);
        return {
          allowed: false,
          remaining: 0,
          resetAt,
          reason: "per_day",
        };
      }
    }

    // Update counters
    const hourDataToSave = hourData && typeof hourData === "object" && "requests" in hourData
      ? (hourData as { requests: number[] })
      : { requests: [] as number[] };
    const filteredHourRequests = hourDataToSave.requests.filter((ts: number) => ts > hourWindowStart);
    filteredHourRequests.push(now);

    const dayDataToSave = dayData && typeof dayData === "object" && "requests" in dayData
      ? (dayData as { requests: number[] })
      : { requests: [] as number[] };
    const filteredDayRequests = dayDataToSave.requests.filter((ts: number) => ts > dayWindowStart);
    filteredDayRequests.push(now);

    console.log(`[Rate Limit] Updating email counters: hour=${filteredHourRequests.length}/${RATE_LIMIT_CONFIG.EMAIL_MAX_PER_HOUR}, day=${filteredDayRequests.length}/${RATE_LIMIT_CONFIG.EMAIL_MAX_PER_DAY}`);

    await Promise.all([
      kv.put(hourKey, JSON.stringify({ requests: filteredHourRequests }), {
        expirationTtl: RATE_LIMIT_CONFIG.EMAIL_WINDOW_HOUR_SECONDS,
      }),
      kv.put(dayKey, JSON.stringify({ requests: filteredDayRequests }), {
        expirationTtl: RATE_LIMIT_CONFIG.EMAIL_WINDOW_DAY_SECONDS,
      }),
    ]);

    const remaining = Math.min(
      RATE_LIMIT_CONFIG.EMAIL_MAX_PER_HOUR - filteredHourRequests.length,
      RATE_LIMIT_CONFIG.EMAIL_MAX_PER_DAY - filteredDayRequests.length
    );

    console.log(`[Rate Limit] Email rate limit updated successfully. Remaining: ${remaining}`);

    return {
      allowed: true,
      remaining,
      resetAt: now + RATE_LIMIT_CONFIG.EMAIL_WINDOW_HOUR_SECONDS,
    };
  } catch (err) {
    console.error("Rate limit KV read failed for email:", normalizedEmail, err);
    // On error, allow request but log
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.EMAIL_MAX_PER_HOUR, resetAt: 0 };
  }
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
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email."
    )
    .max(160),
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

    const data: { success?: boolean } = await resp.json();
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
  const key = `contact:${Date.now()}:${crypto.randomUUID()}`;
  const value = JSON.stringify({
    ...clean,
    lang: lang || "en",
    createdAt: new Date().toISOString(),
  });

  await kv.put(key, value, {
    expirationTtl: 60 * 60 * 24 * 365, // 1 year
  });
}

// --- Email: Send via SendGrid ---
async function sendContactEmail(
  clean: ContactPayload,
  apiKey: string,
  to: string,
  from: string
): Promise<void> {
  if (!apiKey || !to || !from) {
    console.warn("Email config incomplete. Skipping email send.");
    return;
  }

  const recipients = to.split(",").map((e) => e.trim()).filter(Boolean);

  if (!recipients.length) {
    console.warn("CONTACT_TO is empty after parsing. Skipping email send.");
    return;
  }

  const safeName = sanitizeText(clean.name, 60) || "No name";
  const safeSubject = sanitizeText(clean.subject, 160) || "New contact form message (no subject)";
  const preview = sanitizeText(clean.message, 200);

  const emailData = {
    personalizations: recipients.map((email) => ({ to: [{ email }] })),
    from: { email: from },
    subject: `New contact form message: ${safeSubject}`,
    content: [
      {
        type: "text/plain",
        value:
          `You have received a new contact form submission:\n\n` +
          `Name: ${safeName}\n` +
          `Email: ${clean.email}\n` +
          `Subject: ${safeSubject}\n\n` +
          `Message:\n${clean.message}\n\n`,
      },
      {
        type: "text/html",
        value:
          `<p>You have received a new contact form submission:</p>` +
          `<p><strong>Name:</strong> ${safeName}</p>` +
          `<p><strong>Email:</strong> ${clean.email}</p>` +
          `<p><strong>Subject:</strong> ${safeSubject}</p>` +
          `<p><strong>Message:</strong></p>` +
          `<pre style="white-space:pre-wrap;font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">${clean.message}</pre>` +
          `<hr />` +
          `<p>Preview:</p>` +
          `<p>${preview}</p>`,
      },
    ],
  };

  const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(emailData),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`SendGrid API error: ${resp.status} - ${errorText}`);
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
    if (!contentType?.includes("application/json")) {
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

      // Get IP address (used throughout validation)
      const ip =
        request.headers.get("CF-Connecting-IP") ||
        request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim();

      // Honeypot check
      if (body.company && body.company.trim().length > 0) {
        console.warn(`[Rejected] Honeypot triggered - bot detected. IP: ${ip || "unknown"}, Email: ${body.email}`);
        
        const origin = request.headers.get("Origin");
        const headers = getCorsHeaders(origin);
        headers.set("Content-Type", "application/json");
        // Return success to bot, but don't process
        return new Response(
          JSON.stringify({ ok: true } satisfies SuccessBody),
          { status: 200, headers }
        );
      }

      // Basic anti-speed check
      const now = Date.now();
      if (typeof body.ts === "number" && now - body.ts < RATE_LIMIT_CONFIG.MIN_REQUEST_INTERVAL_MS) {
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

      // Rate limiting by IP
      if (!env.RATE_LIMIT_KV) {
        console.warn("[Rate Limit] RATE_LIMIT_KV not configured, skipping rate limit check");
      } else if (!ip) {
        console.warn("[Rate Limit] No IP address available, skipping rate limit check");
      } else {
        console.log(`[Rate Limit] Checking rate limit for IP: ${ip}`);
        const ipRateLimit = await checkRateLimitByIP(ip, env.RATE_LIMIT_KV);
        console.log(`[Rate Limit] IP rate limit result:`, { allowed: ipRateLimit.allowed, remaining: ipRateLimit.remaining, reason: ipRateLimit.reason });
        
        if (!ipRateLimit.allowed) {
          const errorMessage =
            ipRateLimit.reason === "per_minute"
              ? "Too many requests from this IP address. Maximum 3 submissions per minute allowed. Please try again later."
              : "Too many requests from this IP address. Maximum 10 submissions per day allowed. Please try again later.";
          
          console.warn(`[Rejected] IP rate limit exceeded: ${ip} (${ipRateLimit.reason})`);
          
          const origin = request.headers.get("Origin");
          const headers = getCorsHeaders(origin);
          headers.set("Content-Type", "application/json");
          headers.set("Retry-After", String(Math.max(0, ipRateLimit.resetAt - Math.floor(Date.now() / 1000))));
          return new Response(
            JSON.stringify({
              error: errorMessage,
            } satisfies ErrorBody),
            { status: 429, headers }
          );
        }
      }

      // Check disposable email domains (before rate limiting by email to save resources)
      if (isDisposableEmail(body.email)) {
        console.warn(`[Rejected] Disposable email detected: ${body.email}`);
        
        const origin = request.headers.get("Origin");
        const headers = getCorsHeaders(origin);
        headers.set("Content-Type", "application/json");
        return new Response(
          JSON.stringify({
            error: "Disposable email addresses are not allowed.",
            issues: [{ path: "email", message: "Please use a valid email address." }],
          } satisfies ErrorBody),
          { status: 400, headers }
        );
      }

      // Rate limiting by email
      if (!env.RATE_LIMIT_KV) {
        console.warn("[Rate Limit] RATE_LIMIT_KV not configured, skipping email rate limit check");
      } else {
        console.log(`[Rate Limit] Checking rate limit for email: ${body.email}`);
        const emailRateLimit = await checkRateLimitByEmail(body.email, env.RATE_LIMIT_KV);
        console.log(`[Rate Limit] Email rate limit result:`, { allowed: emailRateLimit.allowed, remaining: emailRateLimit.remaining, reason: emailRateLimit.reason });
        
        if (!emailRateLimit.allowed) {
          const errorMessage =
            emailRateLimit.reason === "per_hour"
              ? "Too many requests from this email address. Maximum 3 submissions per hour allowed. Please try again later."
              : "Too many requests from this email address. Maximum 10 submissions per day allowed. Please try again later.";
          
          console.warn(`[Rejected] Email rate limit exceeded: ${body.email} (${emailRateLimit.reason})`);
          
          const origin = request.headers.get("Origin");
          const headers = getCorsHeaders(origin);
          headers.set("Content-Type", "application/json");
          headers.set("Retry-After", String(Math.max(0, emailRateLimit.resetAt - Math.floor(Date.now() / 1000))));
          return new Response(
            JSON.stringify({
              error: errorMessage,
            } satisfies ErrorBody),
            { status: 429, headers }
          );
        }
      }

      // Verify Turnstile (if secret available)
      const token = body.captcha ?? "";

      if (env.TURNSTILE_SECRET) {
        const ok = await verifyTurnstile(token, ip, env.TURNSTILE_SECRET);
        if (!ok) {
          console.warn(`[Rejected] Turnstile verification failed for IP: ${ip || "unknown"}`);
          
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

      // Spam keyword detection
      const fullText = `${body.subject} ${body.message}`.toLowerCase();
      if (containsSpamKeywords(fullText)) {
        console.warn(`[Rejected] Spam keywords detected for email: ${body.email}`);
        
        const origin = request.headers.get("Origin");
        const headers = getCorsHeaders(origin);
        headers.set("Content-Type", "application/json");
        return new Response(
          JSON.stringify({
            error: "Message contains prohibited content.",
          } satisfies ErrorBody),
          { status: 400, headers }
        );
      }

      // Sanitize text fields
      const clean: ContactPayload = {
        ...body,
        name: sanitizeText(body.name, 60),
        subject: sanitizeText(body.subject, 180),
        message: sanitizeText(body.message, 1000),
      };

      // All checks passed - process submission
      console.log(`[Accepted] Valid submission from IP: ${ip || "unknown"}, Email: ${body.email}`);

      // Process in parallel: save to KV and send email
      await Promise.all([
        saveContactToKV(clean, env.CONTACT_KV, body.lang),
        sendContactEmail(clean, env.SENDGRID_API_KEY, env.SENDGRID_TO, env.SENDGRID_FROM).catch(
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

