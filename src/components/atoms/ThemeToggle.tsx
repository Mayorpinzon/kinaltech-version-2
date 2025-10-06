//src/components/atoms/ThemeToggle.tsx

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

  const [theme, setTheme] = React.useState<string>(initial);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  const sizeCls = size === "sm" ? "h-9 w-9" : "h-10 w-10";

  return (
    <button
      type="button"
      aria-pressed={theme === "dark"}
      aria-label={t("actions.toggleTheme")}
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className={`grid place-items-center rounded-xl border border-[--border] ${sizeCls} text-[--text] hover:bg-[--surface-2] focus:outline-none focus:ring-2 focus:ring-[--accent]`}
    >
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </button>
  );
}
