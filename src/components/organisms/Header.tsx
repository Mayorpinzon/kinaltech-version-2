import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Nav } from "../molecules";
import { ThemeToggle, LangSelect, KinalTechLogo } from "../atoms";

export default function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Single source of truth for theme state
  const initialTheme = useMemo<"light" | "dark">(() => {
    if (typeof document === "undefined") return "light";
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored === "light" || stored === "dark") return stored;
    return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, []);

  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen to OS theme changes and update (only if user hasn't overridden)
  useEffect(() => {
    const mq = globalThis.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const onChange = (e: MediaQueryListEvent) => {
      // If user explicitly set a theme, we respect their choice; otherwise sync with OS
      const stored = localStorage.getItem("theme");
      if (!stored) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const handleThemeToggle = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
  };

  /* ============================
     Responsive + accessibility
     ============================ */

  // Close mobile panel when resizing to desktop
  useEffect(() => {
    const onResize = () => { if (globalThis.innerWidth >= 768) setOpen(false); };
    globalThis.addEventListener("resize", onResize);
    return () => globalThis.removeEventListener("resize", onResize);
  }, []);

  // Close on Escape + lock scroll when open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) {
      globalThis.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        globalThis.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close panel on outside click or touch (extra safety beyond overlay)
  useEffect(() => {
    if (!open) return;

    const onOutside = (e: MouseEvent | TouchEvent) => {
      const el = panelRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onOutside, { capture: true });
    document.addEventListener("touchstart", onOutside, { capture: true });
    return () => {
      document.removeEventListener("mousedown", onOutside, { capture: true });
      document.removeEventListener("touchstart", onOutside, { capture: true });
    };
  }, [open]);

  return (
    <>
      {/* Accessible skip link (keyboard users can jump directly to content) */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60
                   focus:bg-(--surface) focus:text-(--text)
                   focus:px-3 focus:py-2 focus:rounded-md focus:shadow-soft"
      >
        Skip to content
      </a>

      {/* Header landmark */}
      <header
        role="banner"
        className="
          site-header sticky top-0 z-50
          border-b border-(--border)
          bg-(--header-glass-base)
          backdrop-blur
          transition-[background,box-shadow,border-color] duration-300
          text-(--text)
        "
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Brand / Logo with home link */}
            <a
              href="#hero"
              rel="home"
              aria-label="KinalTech — Home"
              className="flex gap-2 font-semibold text-[--text]
                         focus:outline-none focus-visible:ring-2
                         focus-visible:ring-[--accent] rounded-md"
            >
              <KinalTechLogo className="h-8 w-auto sm:h-13" aria-hidden />
              <span className="sr-only">KinalTech</span>
            </a>

            {/* Centered desktop navigation */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden 
                            -translate-x-1/2 -translate-y-1/2 min-[960px]:block">
              <div className="pointer-events-auto">
                <Nav variant="desktop" />
              </div>
            </div>

            {/* Right-side actions (desktop only) */}
            <div className="hidden min-[960px]:flex items-center gap-3">
              <LangSelect variant="pill" />
              <ThemeToggle size="sm" theme={theme} onToggle={handleThemeToggle} />
            </div>

            {/* Mobile actions */}
            <div className="max-[959px]:flex hidden items-center gap-2.5">
              {/* Hide language selector on very narrow screens */}
              <div className="max-[380px]:hidden">
                <LangSelect size="sm" />
              </div>
              <ThemeToggle size="sm" theme={theme} onToggle={handleThemeToggle} />
              <button
                type="button"
                aria-label={
                  open
                    ? (t("nav.close") ?? "Close menu")
                    : (t("nav.open") ?? "Open menu")
                }
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center text-(--primary) justify-center 
                           rounded-xl h-9 w-9 border border-[--border] bg-[--surface] 
                           hover:bg-[--surface] focus:outline-none focus-visible:ring-2 
                           focus-visible:ring-[--accent]"
              >
                {open ? (
                  // Close (X) icon
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile overlay and sheet */}
        <div
          id="mobile-menu-overlay"
          hidden={!open}
          data-state={open ? "open" : "closed"}
          className="max-[959px]:fixed inset-0 z-40 bg-[rgba(0,0,0,.25)] backdrop-blur-sm"
          aria-hidden="true"
        >
          <div
            id="mobile-menu"
            aria-modal="true"
            aria-label="Mobile navigation"
            ref={panelRef}
            className="
              menu-panel absolute inset-x-2 top-16
              rounded-2xl border border-(--primary)
              bg-(--shell) backdrop-blur 
              shadow-xl
            "
          >
            {/* Top row inside the mobile menu */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-(--primary) min-h-[48px]">
              <a
                href="#hero"
                className="flex items-center gap-2 font-semibold text-[--text]
                           focus:outline-none focus-visible:ring-2
                           focus-visible:ring-[--accent] rounded-md"
              >
                <KinalTechLogo className="h-7 w-auto md:h-8" aria-hidden />
                <span className="sr-only">KinalTech</span>
              </a>
              <div className="flex items-center gap-2">
                <div className="min-[381px]:hidden">
                  <LangSelect size="sm" />
                </div>
                <ThemeToggle size="sm" theme={theme} onToggle={handleThemeToggle} />
                <button
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg 
                             border border-[--border] hover:bg-[--surface] 
                             focus:outline-none focus-visible:ring-2 
                             focus-visible:ring-[--accent] text-(--primary)"
                  onClick={() => setOpen(false)}
                  aria-label={t("nav.close") ?? "Close menu"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation links */}
            <Nav variant="mobile" onNavigate={() => setOpen(false)} />
          </div>
        </div>
      </header>
    </>
  );
}
