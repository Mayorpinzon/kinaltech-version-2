//src/components/organisms/Header.tsx
import React from "react";
import { Nav } from "../molecules/Nav";
import { ThemeToggle } from "../atoms/ThemeToggle";
import { LangSelect } from "../atoms/LangSelect";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header
      className="
  reveal fixed inset-x-0 top-0 z-50
  bg-[--surface-a-80]
  backdrop-blur
  supports-[backdrop-filter]:bg-[--surface-a-60]
  transition-shadow
"
      data-component="header"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <a
            href="#hero"
            className="group inline-flex items-center gap-2"
            aria-label={t("brand.name")}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[--accent] group-hover:scale-110 transition" />
            <span className="font-semibold tracking-tight text-[--text]">
              {t("brand.name")}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Nav />
            {/* Toolbar estilo “pill” */}
            <div className="flex items-center gap-1 rounded-2xl border border-[--border] bg-[--surface]/70 backdrop-blur px-1 py-1">
              <LangSelect variant="pill" />
              <ThemeToggle size="sm" />
            </div>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-2">
            <LangSelect size="sm" />
            <ThemeToggle size="sm" />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-xl border border-[--border] px-3 py-2 text-sm/none text-[--text] hover:bg-[--surface-2] focus:outline-none focus:ring-2 focus:ring-[--accent]"
      >
        <span className="sr-only">Menu</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[--border] bg-[--surface] shadow-xl ring-1 ring-black/5"
          role="dialog"
        >
          <div className="p-2">
            {/* Reutiliza Nav en modo móvil para cerrar al navegar */}
            <Nav onNavigate={() => setOpen(false)} variant="mobile" />
          </div>
        </div>
      )}
    </div>
  );
}
