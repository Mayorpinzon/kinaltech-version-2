// src/lib/env.ts
// Centralized environment variable validation

function requireEnv(key: string, description?: string): string {
  const value = import.meta.env[key];

  if (!value || value.trim() === "") {
    const desc = description ? ` (${description})` : "";
    throw new Error(
      `Missing required environment variable: ${key}${desc}\n` +
        `Please check your .env file and ensure ${key} is set.\n` +
        `This error occurs at build time to prevent runtime failures.`
    );
  }

  return value;
}

function optionalEnv(key: string): string | undefined {
  const value = import.meta.env[key];
  return value && value.trim() !== "" ? value : undefined;
}

export const ENV = {
  // Firebase Configuration (Required)
  FIREBASE_API_KEY: requireEnv(
    "VITE_FIREBASE_API_KEY",
    "Firebase API Key"
  ),
  FIREBASE_AUTH_DOMAIN: requireEnv(
    "VITE_FIREBASE_AUTH_DOMAIN",
    "Firebase Auth Domain"
  ),
  FIREBASE_PROJECT_ID: requireEnv(
    "VITE_FIREBASE_PROJECT_ID",
    "Firebase Project ID"
  ),
  FIREBASE_STORAGE_BUCKET: requireEnv(
    "VITE_FIREBASE_STORAGE_BUCKET",
    "Firebase Storage Bucket"
  ),
  FIREBASE_MESSAGING_SENDER_ID: requireEnv(
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "Firebase Messaging Sender ID"
  ),
  FIREBASE_APP_ID: requireEnv("VITE_FIREBASE_APP_ID", "Firebase App ID"),

  // Turnstile (Optional - only needed if using captcha)
  TURNSTILE_SITEKEY: optionalEnv("VITE_TURNSTILE_SITEKEY"),

  // Contact API URL (Cloudflare Worker endpoint)
  CONTACT_API_URL: requireEnv(
    "VITE_CONTACT_API_URL",
    "Contact form API endpoint (Cloudflare Worker)"
  ),
} as const;

export type Env = typeof ENV;

