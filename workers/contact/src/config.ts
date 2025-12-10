// workers/contact/src/config.ts
// Configuration constants for contact form worker

// --- CORS Configuration ---
export const ALLOWED_ORIGINS = new Set<string>([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://kinaltech-dev.web.app",
]);

// --- Rate Limiting Configuration ---
export const RATE_LIMIT_CONFIG = {
  // Per IP: max 3 requests per minute, max 10 per day
  IP_MAX_PER_MINUTE: 3,
  IP_WINDOW_MINUTE_SECONDS: 60, // 1 minute
  IP_MAX_PER_DAY: 10,
  IP_WINDOW_DAY_SECONDS: 24 * 60 * 60, // 24 hours

  // Per Email: max 3 requests per hour, max 10 per day
  EMAIL_MAX_PER_HOUR: 3,
  EMAIL_WINDOW_HOUR_SECONDS: 60 * 60, // 1 hour
  EMAIL_MAX_PER_DAY: 10,
  EMAIL_WINDOW_DAY_SECONDS: 24 * 60 * 60, // 24 hours

  // Global: max 1 request per 2 seconds (anti-speed)
  MIN_REQUEST_INTERVAL_MS: 2000,
};

// --- Disposable Email Domains ---
// Comprehensive list of known disposable/temporary email providers
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // 10minutemail variants
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  // Temp mail variants
  "tempmail.com",
  "tempmail.org",
  "tempmail.io",
  "tempmail.co",
  "tempmail.us",
  "tempmail.ws",
  "temp-mail.org",
  "temp-mail.io",
  "temp-mail.com",
  "temp-mail.net",
  "temp-mail.ru",
  "temp-mail.us",
  "temp-mail.ws",
  "tmpmail.org",
  "tmpmail.net",
  "tmpmail.ru",
  "tmpmail.us",
  "tmpmail.ws",
  "tmpmailer.com",
  // Guerrilla mail
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.biz",
  "guerrillamail.info",
  // Mailinator
  "mailinator.com",
  "mailinator.net",
  "mailinator.org",
  // Throwaway variants
  "throwaway.email",
  "throwawaymail.com",
  "throwawaymail.net",
  "throwawaymail.org",
  // Yopmail
  "yopmail.com",
  "yopmail.net",
  "yopmail.org",
  // Other common providers
  "getnada.com",
  "mohmal.com",
  "fakeinbox.com",
  "fakemail.net",
  "fakemail.com",
  "fakemailgenerator.com",
  "maildrop.cc",
  "mintemail.com",
  "mytemp.email",
  "sharklasers.com",
  "spamgourmet.com",
  "trashmail.com",
  "trashmail.net",
  "mail-temp.com",
  "emailondeck.com",
  "getairmail.com",
  "inboxkitten.com",
  "meltmail.com",
  "mox.do",
  "nada.email",
  "spamhole.com",
  "tempr.email",
  "tempinbox.co.uk",
  "tempinbox.com",
  "tempinbox.xyz",
  "tempail.com",
  "tempalias.com",
  "tempe-mail.com",
  "tmail.ws",
]);

// --- Spam Keywords (simple detection) ---
export const SPAM_KEYWORDS = [
  /\b(viagra|cialis|poker|casino|lottery|winner|prize|free money)\b/i,
  /\b(click here|buy now|limited time|act now|urgent)\b/i,
  /\b(nigerian prince|inheritance|lottery winner)\b/i,
];

