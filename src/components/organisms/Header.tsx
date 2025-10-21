// src/components/organisms/Header.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Nav } from "../molecules/Nav";
import { ThemeToggle } from "../atoms/ThemeToggle";
import { LangSelect } from "../atoms/LangSelect";
import { KinalTechLogo } from "../atoms/Icons";

export default function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Cerrar panel si cambiamos a desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Esc para cerrar + bloqueo de scroll en body
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) {
      window.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

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
            <a
              href="#hero"
              className="flex items-center gap-2 font-semibold text-[--text] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] rounded-md"
            >
              {/* Logo a color, escalable por alto */}
              <KinalTechLogo className="h-7 w-auto md:h-8" aria-hidden />
              <span className="sr-only">KinalTech</span>
            </a>
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
          <div className="md:hidden flex items-center gap-2.5">
            {/* En anchuras MUY chicas ocultamos el selector en la barra para desahogar */}
            <div className="max-[380px]:hidden">
              <LangSelect size="sm" />
            </div  >
            <ThemeToggle size="sm" />
            <button
              type="button"
              aria-label={open ? (t("nav.close") ?? "Close menu") : (t("nav.open") ?? "Open menu")}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(v => !v)}
              className="inline-flex items-center text-[var(--primary)] justify-center rounded-xl h-9 w-9 border border-[--border] bg-[--surface] hover:bg-[--surface] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent]"
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

      {/* Overlay + sheet móvil */}
      <div
        id="mobile-menu"
        hidden={!open}
        data-state={open ? "open" : "closed"}
        className="md:hidden fixed inset-0 z-40 bg-[color:rgba(0,0,0,.25)] backdrop-blur-sm  "
        onClick={() => setOpen(false)}
      >
        {/* Sheet: cuelga del header, ancho completo */}
        <div
          role="dialog"
          aria-modal="true"
          className="
            menu-panel absolute inset-x-2 top-16
            rounded-2xl border border-[var(--primary)]
            bg-[var(--shell)] backdrop-blur 
            shadow-xl
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hilera de controles (solo aparece si ocultamos la versión de la barra) */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--primary)] min-h-[48px]">
            <a
              href="#hero"
              className="flex items-center gap-2 font-semibold text-[--text] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] rounded-md"
            >
              <KinalTechLogo className="h-7 w-auto md:h-8" aria-hidden />
              <span className="sr-only">KinalTech</span>
            </a>
            <div className="flex items-center gap-2 ">
              <div className="min-[381px]:hidden">
                <LangSelect size="sm" />
              </div>
              <ThemeToggle size="sm" />
              <button
                className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-[--border] hover:bg-[--surface] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] text-[var(--primary)] "
                onClick={() => setOpen(false)}
                aria-label={t("nav.close") ?? "Close menu"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Items */}
          <Nav variant="mobile" onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}
