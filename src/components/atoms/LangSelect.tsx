//src/components/atoms/LangSelect.tsx

import React from "react";
import { useTranslation } from "react-i18next";

type Props = { size?: "sm" | "md"; variant?: "default" | "pill" };

export function LangSelect({ size = "md", variant = "default" }: Props) {
  const { i18n, t } = useTranslation();

  const value = i18n.language.startsWith("es")
    ? "es"
    : i18n.language.startsWith("ja")
    ? "ja"
    : "en";

  const base = size === "sm" ? "h-9 text-xs px-2" : "h-10 text-sm px-3";

  const cls =
    variant === "pill"
      ? `${base} appearance-none bg-transparent text-[--text] focus:outline-none`
      : `${base} rounded-xl border border-[--border] bg-[--surface] text-[--text] focus:outline-none focus:ring-2 focus:ring-[--accent]`;

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    try {
      localStorage.setItem("lng", lang);
    } catch {}
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      {variant === "pill" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden
          className="text-[--text-muted]"
        >
          <path
            d="M12 2a10 10 0 100 20 10 10 0 000-20Zm0 0s4 3.5 4 10-4 10-4 10M12 2s-4 3.5-4 10 4 10 4 10M2 12h20"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      )}

      <label htmlFor="lang" className="sr-only">
        {t("actions.changeLanguage")}
      </label>

      <select id="lang" value={value} onChange={onChange} className={cls}>
        <option value="es">Español</option>
        <option value="en">English</option>
        <option value="ja">日本語</option>
      </select>

      {variant === "pill" && (
        <svg
          className="pointer-events-none absolute right-1"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            d="M7 10l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </div>
  );
}
