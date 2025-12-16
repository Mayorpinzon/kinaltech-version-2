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
// Using Zod's built-in email validation for better compatibility with valid but uncommon email formats
const ContactSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
    z
      .string()
      .max(160)
      .refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        { message: "Please enter a valid email." }
      )
  ),
  subject: z.string().min(2).max(160),
  message: z.string().min(10).max(300),
  // Optional metadata
  ts: z.number().optional(),
  company: z.string().optional(), // honeypot (should be empty)
  captcha: z.string().optional(), // Turnstile token
  lang: z.string().optional(), // i18n language code
});

type ContactPayload = z.infer<typeof ContactSchema>;

type Issue = { path: string; message: string; code?: string };
type ErrorBody = { 
  error: string; 
  errorCode?: string; // i18n key for frontend translation
  issues?: Issue[] 
};
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

// --- Response Helpers ---
function createErrorResponse(
  request: Request,
  status: number,
  error: string,
  errorCode?: string,
  issues?: Issue[],
  retryAfter?: number
): Response {
  const origin = request.headers.get("Origin");
  const headers = getCorsHeaders(origin);
  headers.set("Content-Type", "application/json");
  if (retryAfter !== undefined) {
    headers.set("Retry-After", String(retryAfter));
  }
  return new Response(
    JSON.stringify({ error, errorCode, issues } satisfies ErrorBody),
    { status, headers }
  );
}

function createSuccessResponse(request: Request): Response {
  const origin = request.headers.get("Origin");
  const headers = getCorsHeaders(origin);
  headers.set("Content-Type", "application/json");
  return new Response(
    JSON.stringify({ ok: true } satisfies SuccessBody),
    { status: 200, headers }
  );
}

// --- Validation Helpers ---
function validateRequestMethod(request: Request): Response | null {
  if (request.method !== "POST") {
    return createErrorResponse(request, 405, "Method not allowed");
  }
  const contentType = request.headers.get("Content-Type");
  if (!contentType?.includes("application/json")) {
    return createErrorResponse(request, 415, "Unsupported media type");
  }
  return null;
}

function parseAndValidateBody(
  payloadUnknown: unknown,
  request: Request
): { success: true; data: ContactPayload } | { success: false; response: Response } {
  const parsed = ContactSchema.safeParse(payloadUnknown);
  if (!parsed.success) {
    const issues: Issue[] = parsed.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    }));
    return {
      success: false,
      response: createErrorResponse(
        request,
        400,
        "Validation failed",
        "form.error.validation_failed",
        issues
      ),
    };
  }
  return { success: true, data: parsed.data };
}

function getClientIP(request: Request): string | undefined {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()
  );
}

function validateHoneypot(body: ContactPayload, request: Request, ip: string | undefined): Response | null {
  if (body.company && body.company.trim().length > 0) {
    console.warn(`[Rejected] Honeypot triggered - bot detected. IP: ${ip || "unknown"}, Email: ${body.email}`);
    // Return success to bot, but don't process
    return createSuccessResponse(request);
  }
  return null;
}

function validateSpeedCheck(body: ContactPayload, request: Request): Response | null {
  const now = Date.now();
  if (typeof body.ts === "number" && now - body.ts < RATE_LIMIT_CONFIG.MIN_REQUEST_INTERVAL_MS) {
    return createErrorResponse(
      request,
      429,
      "Too fast. Please try again.",
      "form.error.too_fast"
    );
  }
  return null;
}

async function validateRateLimitByIP(
  ip: string | undefined,
  rateLimitKV: KVNamespace | undefined,
  request: Request
): Promise<Response | null> {
  if (!rateLimitKV) {
    console.warn("[Rate Limit] RATE_LIMIT_KV not configured, skipping rate limit check");
    return null;
  }
  if (!ip) {
    console.warn("[Rate Limit] No IP address available, skipping rate limit check");
    return null;
  }

  console.log(`[Rate Limit] Checking rate limit for IP: ${ip}`);
  const ipRateLimit = await checkRateLimitByIP(ip, rateLimitKV);
  console.log(`[Rate Limit] IP rate limit result:`, {
    allowed: ipRateLimit.allowed,
    remaining: ipRateLimit.remaining,
    reason: ipRateLimit.reason,
  });

  if (!ipRateLimit.allowed) {
    const errorCode =
      ipRateLimit.reason === "per_minute"
        ? "form.error.rate_limit_ip_minute"
        : "form.error.rate_limit_ip_day";
    console.warn(`[Rejected] IP rate limit exceeded: ${ip} (${ipRateLimit.reason})`);
    const retryAfter = Math.max(0, ipRateLimit.resetAt - Math.floor(Date.now() / 1000));
    return createErrorResponse(
      request,
      429,
      "Rate limit exceeded",
      errorCode,
      undefined,
      retryAfter
    );
  }
  return null;
}

function validateDisposableEmail(body: ContactPayload, request: Request): Response | null {
  if (isDisposableEmail(body.email)) {
    console.warn(`[Rejected] Disposable email detected: ${body.email}`);
    return createErrorResponse(
      request,
      400,
      "Disposable email addresses are not allowed.",
      "form.error.disposable_email",
      [
        {
          path: "email",
          message: "Please use a valid email address.",
          code: "form.error.disposable_email",
        },
      ]
    );
  }
  return null;
}

async function validateRateLimitByEmail(
  email: string,
  rateLimitKV: KVNamespace | undefined,
  request: Request
): Promise<Response | null> {
  if (!rateLimitKV) {
    console.warn("[Rate Limit] RATE_LIMIT_KV not configured, skipping email rate limit check");
    return null;
  }

  console.log(`[Rate Limit] Checking rate limit for email: ${email}`);
  const emailRateLimit = await checkRateLimitByEmail(email, rateLimitKV);
  console.log(`[Rate Limit] Email rate limit result:`, {
    allowed: emailRateLimit.allowed,
    remaining: emailRateLimit.remaining,
    reason: emailRateLimit.reason,
  });

  if (!emailRateLimit.allowed) {
    const errorCode =
      emailRateLimit.reason === "per_hour"
        ? "form.error.rate_limit_email_hour"
        : "form.error.rate_limit_email_day";
    console.warn(`[Rejected] Email rate limit exceeded: ${email} (${emailRateLimit.reason})`);
    const retryAfter = Math.max(0, emailRateLimit.resetAt - Math.floor(Date.now() / 1000));
    return createErrorResponse(
      request,
      429,
      "Rate limit exceeded",
      errorCode,
      undefined,
      retryAfter
    );
  }
  return null;
}

async function validateTurnstile(
  token: string,
  ip: string | undefined,
  secret: string | undefined,
  request: Request
): Promise<Response | null> {
  if (!secret) {
    return null;
  }

  const ok = await verifyTurnstile(token, ip, secret);
  if (!ok) {
    console.warn(`[Rejected] Turnstile verification failed for IP: ${ip || "unknown"}`);
    return createErrorResponse(
      request,
      403,
      "Captcha verification failed",
      "form.error.captcha",
      [{ path: "captcha", message: "Invalid or missing token", code: "form.error.captcha" }]
    );
  }
  return null;
}

function validateSpamKeywords(body: ContactPayload, request: Request): Response | null {
  const fullText = `${body.subject} ${body.message}`.toLowerCase();
  if (containsSpamKeywords(fullText)) {
    console.warn(`[Rejected] Spam keywords detected for email: ${body.email}`);
    return createErrorResponse(
      request,
      400,
      "Message contains prohibited content.",
      "form.error.spam_keywords"
    );
  }
  return null;
}

// --- Main Handler ---
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    const corsResponse = handleCors(request);
    if (corsResponse) return corsResponse;

    // Validate request method and content type
    const methodError = validateRequestMethod(request);
    if (methodError) return methodError;

    try {
      // Parse and validate body
      const payloadUnknown: unknown = await request.json();
      const parseResult = parseAndValidateBody(payloadUnknown, request);
      if (!parseResult.success) {
        return parseResult.response;
      }

      const body: ContactPayload = parseResult.data;
      const ip = getClientIP(request);

      // Run all validations
      const honeypotError = validateHoneypot(body, request, ip);
      if (honeypotError) return honeypotError;

      const speedError = validateSpeedCheck(body, request);
      if (speedError) return speedError;

      const ipRateLimitError = await validateRateLimitByIP(ip, env.RATE_LIMIT_KV, request);
      if (ipRateLimitError) return ipRateLimitError;

      const disposableEmailError = validateDisposableEmail(body, request);
      if (disposableEmailError) return disposableEmailError;

      const emailRateLimitError = await validateRateLimitByEmail(body.email, env.RATE_LIMIT_KV, request);
      if (emailRateLimitError) return emailRateLimitError;

      const turnstileError = await validateTurnstile(body.captcha ?? "", ip, env.TURNSTILE_SECRET, request);
      if (turnstileError) return turnstileError;

      const spamError = validateSpamKeywords(body, request);
      if (spamError) return spamError;

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

      return createSuccessResponse(request);
    } catch (e) {
      console.error("Contact handler failed:", e);
      return createErrorResponse(
        request,
        500,
        "Server error. Please try again later.",
        "form.error.server"
      );
    }
  },
};