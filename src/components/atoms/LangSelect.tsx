// src/components/atoms/LangSelect.tsx
import React from "react";
import { useTranslation } from "react-i18next";

type Props = Readonly<{
  size?: "sm" | "md";
  variant?: "default" | "pill";
}>;

export function LangSelect({ size = "md" }: Props) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  // Normaliza cualquier variante (en-US, es-MX, ja-JP) a en/es/ja
  const normalize = (lng?: string) => {
    const v = (lng || "en").toLowerCase();
    if (v.startsWith("es")) return "es";
    if (v.startsWith("ja")) return "ja";
    return "en";
  };
  const current = normalize(i18n.language || i18n.resolvedLanguage);

  const label = {
    es: t("lang.es", "Español"),
    en: t("lang.en", "English"),
    ja: t("lang.ja", "日本語"),
  } as const;

  // Cierre con Escape y click-outside
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
  // Combo de estilos original:
  const btnBg =
    "inline-flex items-center justify-center rounded-app px-5 py-3 text-sm font-semibold trans-app active:scale-[.90] focus:outline-none focus:ring-4 ring-primary hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(var(--ring),.35)] bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white shadow-lg";

  const change = async (code: "en" | "es" | "ja") => {
    setOpen(false);
    await i18n.changeLanguage(code);
    // Persistencia + <html lang> las maneja el listener en src/i18n/index.ts
  };

  return (
    <div className="relative" data-langselect-root>
      <button
        type="button"
        className={`${btnBase} ${btnBg} ${btnSize} max-[420px]:px-2 max-[420px]:w-10 max-[420px]:justify-center`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Change language: ${label[current]}`}
        onClick={() => setOpen((v) => !v)}
      >
        {/* icono globo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 256 256"
          aria-hidden
          className="opacity-80"
          focusable="false"
        >
          <g transform="translate(1.4066 1.4066) scale(2.81 2.81)" fill="currentColor">
            <path d="M53.242 51.242V2c0-1.104-.896-2-2-2H2C.896 0 0 .896 0 2v49.242c0 1.104.896 2 2 2h49.242c1.105 0 2-.895 2-2zM49.242 49.242H4V4h45.242v45.242z" />
            <path d="M88 36.758H63.239c-1.104 0-2 .896-2 2s.896 2 2 2H86V86H40.758V63.239c0-1.104-.896-2-2-2s-2 .896-2 2V88c0 1.104.896 2 2 2H88c1.104 0 2-.896 2-2V38.758c0-1.105-.896-2-2-2z" />
            <path d="M52.925 80.292c1.042.357 2.183-.193 2.543-1.238l3.286-9.518h9.249l3.286 9.518c.286.828 1.062 1.349 1.891 1.349.217 0 .437-.036.652-.11 1.045-.36 1.599-1.499 1.238-2.543L65.27 49.364c-.278-.807-1.038-1.348-1.891-1.348s-1.612.541-1.891 1.348l-9.802 28.385c-.36 1.044.194 2.183 1.239 2.543zM63.379 56.144l3.243 9.393h-6.487l3.244-9.393z" />
            <path d="M11.688 17.687h19.687c-1.585 3.389-3.846 6.76-6.407 9.9-1.755-2.337-3.26-4.72-4.233-6.908-.45-1.01-1.633-1.464-2.64-1.014-1.009.449-1.463 1.631-1.014 2.64 1.209 2.716 3.074 5.61 5.213 8.374-2.704 2.95-5.565 5.599-8.194 7.729-.858.695-.991 1.955-.295 2.813.395.488.973.741 1.555.741.442 0 .887-.146 1.258-.446 2.638-2.137 5.5-4.78 8.239-7.731 2.684 3.06 5.547 5.782 7.992 7.66.363.279.792.414 1.217.414.6 0 1.194-.269 1.587-.782.673-.876.508-2.131-.368-2.804-2.393-1.838-5.191-4.539-7.761-7.52 3.397-4.072 6.384-8.562 8.216-13.067h7.039c1.104 0 2-.896 2-2s-.896-2-2-2h-15.1v-2.798c0-1.104-.896-2-2-2s-2 .896-2 2v2.798H11.688c-1.104 0-2 .896-2 2s.896 2 2 2z" />
            <path d="M59.316 10.537c-.016.038-.023.079-.037.118-.029.084-.06.166-.077.255-.026.129-.04.262-.04.395s.014.266.04.395c.018.088.049.171.077.255.014.039.021.08.037.118.038.091.088.176.138.259.016.027.028.058.046.084.073.109.156.211.249.303l5.234 5.234a1.999 1.999 0 0 0 2.828-2.828l-1.821-1.821H76.653v15.656c0 1.104.896 2 2 2s2-.896 2-2V11.306c0-1.104-.896-2-2-2H65.99l1.821-1.821a1.999 1.999 0 1 0-2.828-2.828l-5.234 5.233a2.46 2.46 0 0 0-.433.647z" />
            <path d="M30.685 79.459c.027-.065.042-.133.062-.2.017-.058.039-.113.051-.173.051-.258.051-.525 0-.783-.012-.06-.034-.115-.051-.173-.02-.067-.035-.135-.062-.2-.028-.069-.067-.131-.103-.196-.027-.049-.049-.101-.081-.148-.074-.11-.157-.213-.251-.307l-5.234-5.234a1.999 1.999 0 1 0-2.828 2.828l1.821 1.821H13.306V61.038c0-1.104-.896-2-2-2s-2 .896-2 2v17.656c0 1.104.896 2 2 2H24.01l-1.821 1.821a1.999 1.999 0 1 0 2.828 2.828l5.234-5.234c.094-.093.177-.196.251-.307.032-.047.053-.099.081-.148.036-.065.075-.127.103-.196z" />
          </g>
        </svg>

        <span className="font-medium max-[450px]:hidden">{label[current]}</span>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""} max-[420px]:hidden`}
        >
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 min-w-36 overflow-hidden rounded-2xl 
          border border-(--border) bg-(--primary) shadow-xl text-white transition-colors"
        >
          <select
            value={current}
            onChange={(e) => change(e.target.value as "en" | "es" | "ja")}
            className="sr-only"
            aria-label={t("lang.select", "Select language")}
          >
            {(["es", "en", "ja"] as const).map((code) => (
              <option key={code} value={code}>
                {label[code]}
              </option>
            ))}
          </select>
          <div className="py-1">
            {(["es", "en", "ja"] as const).map((code) => (
              <button
                key={code}
                className="flex w-full items-center justify-between px-4 py-2 
                text-left text-sm data-[active=true]:font-semibold text-white
                hover:bg-blue-400 transition-colors"
                data-active={current === code}
                onClick={() => change(code)}
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
      )}
    </div>
  );
}
