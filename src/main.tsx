// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

(function bootstrap() {
  try {
    const savedTheme = localStorage.getItem("theme");
    const theme = savedTheme ?? "dark";   // 👈 default SIEMPRE dark

    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle("dark", theme === "dark");

    const normalize = (lng: string | null | undefined) => {
      const v = (lng || "").toLowerCase();
      if (v.startsWith("es")) return "es";
      if (v.startsWith("ja")) return "ja";
      return "en";
    };
    const cached = localStorage.getItem("i18nextLng");
    const navLang = Array.isArray(navigator.languages)
      ? navigator.languages[0]
      : navigator.language;
    const lang = normalize(cached || navLang || "en");
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
