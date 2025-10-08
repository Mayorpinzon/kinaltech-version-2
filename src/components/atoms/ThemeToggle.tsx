// src/components/atoms/ThemeToggle.tsx
import React from "react";
import { useTranslation } from "react-i18next";

type Props = { size?: "sm" | "md" };

export function ThemeToggle({ size = "md" }: Props) {
  const { t } = useTranslation();

  const initial = React.useMemo(() => {
    if (typeof document === "undefined") return "light";
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, []);

  const [theme, setTheme] = React.useState<"light" | "dark">(initial as "light" | "dark");

  React.useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const btnBase =
    "inline-grid place-items-center rounded-2xl border border-2 border-[var(--primary)] text-blue-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent]";
  const btnSize = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const btnHover = "hover:bg-[var(--primary)] hover:text-white shadow-lg hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(var(--ring),.35)] bg-transparent";

  return (
    <button
      type="button"
      aria-label={
        theme === "dark"
          ? (t("theme.light") ?? "Switch to light theme")
          : (t("theme.dark") ?? "Switch to dark theme")
      }
      className={`${btnBase} ${btnSize} ${btnHover}`}
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
    >
      {theme === "dark" ? (
        /* sol */
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ) : (
        /* luna */
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
