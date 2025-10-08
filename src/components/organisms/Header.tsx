// src/components/organisms/Header.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Nav } from "../molecules/Nav";
import { ThemeToggle } from "../atoms/ThemeToggle";
import { LangSelect } from "../atoms/LangSelect";

export default function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Cerrar panel móvil si cambiamos a desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className="
        site-header sticky top-0 z-50
        border-b border-[color:var(--border)]
        bg-[color:var(--header-glass-base)]
        backdrop-blur
        transition-[background,box-shadow,border-color] duration-300
        text-[var(--text)]
      "
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand (izquierda) */}
          <a
            href="#hero"
            className="flex items-center gap-2 font-semibold text-[--text] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] rounded-md"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-grad-1 text-white text-xs font-bold">KT</span>
            <span className="font-bold text-2xl" >KinalTech</span>
          </a>

          {/* Nav centrado (solo desktop) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="pointer-events-auto">
              <Nav variant="desktop" />
            </div>
          </div>

          {/* Acciones (derecha) */}
          <div className="hidden md:flex items-center gap-3">
            <LangSelect variant="pill" />
            <ThemeToggle size="sm" />
          </div>

          {/* Acciones móviles */}
          <div className="md:hidden flex items-center gap-2">
            <LangSelect size="sm" />
            <ThemeToggle size="sm" />
            <button
              type="button"
              aria-label={open ? (t("nav.close") ?? "Close menu") : (t("nav.open") ?? "Open menu")}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(v => !v)}
              className="inline-flex items-center justify-center rounded-xl h-9 w-9 border border-[--border] bg-[--surface] hover:bg-[--surface] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent]"
            >
              {!open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay móvil */}
      <div
        id="mobile-menu"
        hidden={!open}
        data-state={open ? "open" : "closed"}
        className="md:hidden fixed inset-0 z-40 bg-[color:rgba(0,0,0,.25)] backdrop-blur-sm"
        onClick={() => setOpen(false)}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-[--surface] border-l border-[--border] shadow-xl p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-base font-semibold text-[--text]">{t("nav.menu") ?? "Menu"}</span>
            <button
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-[--border] hover:bg-[--surface] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent]"
              onClick={() => setOpen(false)}
              aria-label={t("nav.close") ?? "Close menu"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          <Nav variant="mobile" onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}
