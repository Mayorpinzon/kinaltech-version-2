// src/components/atoms/LangSelect.tsx
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  size?: "sm" | "md";
  variant?: "default" | "pill";
};

export function LangSelect({ size = "md" }: Props) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  const current = i18n.language.startsWith("es")
    ? "es"
    : i18n.language.startsWith("ja")
      ? "ja"
      : "en";

  const label = {
    es: t("lang.es", "Español"),
    en: t("lang.en", "English"),
    ja: t("lang.ja", "日本語"),
  } as const;

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest?.("[data-langselect-root]")) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const btnBase =
    "inline-flex items-center gap-2 rounded-2xl border border-[--border] text-[--text] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] transition-colors";
  const btnSize = size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 text-sm";
  const btnBg = "inline-flex items-center justify-center rounded-app px-5 py-3 text-sm font-semibold trans-app active:scale-[.90] focus:outline-none focus:ring-4 ring-primary hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(var(--ring),.35)] bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white shadow-lg";
  return (
    <div className="relative" data-langselect-root>
      <button
        type="button"
        className={`${btnBase} ${btnBg} ${btnSize}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {/* icono globo */}
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="opacity-80">
          <path
            d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0c2.7 0 5 4 5 9s-2.3 9-5 9-5-4-5-9 2.3-9 5-9zm-8 9h16M12 3v18"
            fill="none" stroke="currentColor" strokeWidth="1.2"
          />
        </svg>
        <span>{label[current]}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        role="listbox"
        aria-label={t("lang.select", "Select language")}
        hidden={!open}
        className="absolute right-0 min-w-[10rem] overflow-hidden rounded-2xl 
        border border-[var(--border)] bg-[var(--primary)] shadow-xl text-[var(--text)]  "
      >
        {(["es", "en", "ja"] as const).map(code => (
          <button
            key={code}
            role="option"
            aria-selected={current === code}
            className="flex w-full items-center justify-between px-4 py-2 
            text-left text-sm data-[active=true]:font-semibold
             hover:bg-blue-400 hover:text-white transition-colors"
            data-active={current === code}
            onClick={() => {
              i18n.changeLanguage(code);
              setOpen(false);
            }}
          >
            <span>{label[code]}</span>
            {current === code ? (
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path d="M5 12l4 4 10-10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
