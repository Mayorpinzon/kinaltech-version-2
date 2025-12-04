// src/components/molecules/Nav.tsx
import { useTranslation } from "react-i18next";
import { useSectionSpy } from "../../hooks/useSectionSpy";
import type { TranslationKey } from "../../i18n/types";

type Props = Readonly<{
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}>;

/** Centralized list of in-page sections for both nav variants */
const SECTIONS = [
  { id: "hero",     key: "nav.home",    href: "#hero" },
  { id: "services", key: "nav.services", href: "#services" },
  { id: "techs",    key: "nav.techs",   href: "#techs" },
  { id: "about",    key: "nav.about",   href: "#about" },
  { id: "contact",  key: "nav.contact", href: "#contact" },
] as const;

export function Nav({ variant, onNavigate }: Props) {
  const { t } = useTranslation();

  // Track which section is currently in view (used for visual + a11y state)
  const activeId = useSectionSpy({
    sectionIds: SECTIONS.map((s) => s.id),
    offsetTop: 80,
  });

  if (variant === "desktop") {
    return (
      // <nav> is a landmark; keep a readable label for screen readers
      <nav aria-label={t("nav.aria") ?? "Primary navigation"}>
        <ul className="flex items-center gap-6">
          {SECTIONS.map(({ id, key, href }) => {
            const active = activeId === id;
            return (
              <li key={id}>
                <a
                  href={href}
                  className={[
                    "text-sm font-semibold text-[--text] opacity-90 hover:opacity-100 transition-colors",
                    "nav-underline",
                    active ? "nav-active" : "",
                  ].join(" ")}
                  // Announce the current location to assistive tech
                  aria-current={active ? "page" : undefined}
                >
                  {t(key as TranslationKey)}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  // Mobile sheet version (bigger targets + focus ring)
  return (
    <nav aria-label={t("nav.aria") ?? "Primary navigation"}>
      <ul className="py-2">
        {SECTIONS.map(({ id, key, href }) => {
          const active = activeId === id;
          return (
            <li key={id}>
              <a
                href={href}
                onClick={onNavigate}
                className={[
                  "block px-4 py-3 text-center font-semibold",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] rounded-xl",
                  "hover:bg-[var(--surface-a-60)] active:bg-[var(--surface-a-60)]",
                  active ? "text-[var(--primary)]" : "text-[var(--primary-2)]",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {t(key as TranslationKey)}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
