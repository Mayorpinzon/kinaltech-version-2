// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

/**
 * Boot before paint:
 * - Theme from localStorage or OS preference
 * - <html lang> from i18next cache or navigator (normalized to en/es/ja)
 * This avoids FOUC + ensures correct language for crawlers/AT.
 */
(function bootstrap() {
  try {
    // Theme
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle("dark", theme === "dark"); // compatibility with tokens.css

    // Language (read i18next persisted key when available)
    const normalize = (lng: string | null | undefined) => {
      const v = (lng || "").toLowerCase();
      if (v.startsWith("es")) return "es";
      if (v.startsWith("ja")) return "ja";
      return "en";
    };
    const cached = localStorage.getItem("i18nextLng");
    const navLang = Array.isArray(navigator.languages) ? navigator.languages[0] : navigator.language;
    const lang = normalize(cached || navLang || "en");
    // Only set if not already set by server/static HTML
    if (!document.documentElement.lang) document.documentElement.lang = lang;
  } catch {
    /* no-op */
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
