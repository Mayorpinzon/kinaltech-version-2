// src/components/molecules/Nav.tsx
import { useTranslation } from "react-i18next";
import { useSectionSpy } from "../../hooks/useSectionSpy";

const SECTIONS = [
  { id: "hero",     key: "nav.home" },
  { id: "services", key: "nav.services" },
  { id: "techs",    key: "nav.techs" },
  { id: "about",    key: "nav.about" },
  { id: "contact",  key: "nav.contact" },
] as const;

type Props = {
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
};

export function Nav({ onNavigate, variant = "desktop" }: Props) {
  const { t } = useTranslation();
  const activeId = useSectionSpy({
    sectionIds: SECTIONS.map((s) => s.id),
    offsetTop: 80,
  });

  const listCls =
    variant === "desktop" ? "flex items-center gap-6" : "flex flex-col gap-1";

  const itemCls =
    variant === "desktop"
      ? "relative text-sm font-medium text-[--text-muted] hover:text-[--text] transition-colors"
      : "relative w-full rounded-xl px-3 py-2 text-[--text] hover:bg-[--surface-2] text-sm";

  return (
    <nav aria-label={t("nav.aria") ?? "Primary"} className="reveal">
      <ul className={listCls}>
        {SECTIONS.map(({ id, key }) => {
          const active = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={onNavigate}
                data-active={active}
                aria-current={active ? "page" : undefined}
                className={itemCls}
              >
                <span className="relative inline-block pb-1">
                  {t(key)}
                  <span
                    aria-hidden
                    data-active={active}
                    className="absolute left-0 bottom-0 h-0.5 w-full origin-left scale-x-0 bg-[--accent] transition-transform duration-300 data-[active=true]:scale-x-100"
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
