// src/components/atoms/ThemeToggle.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { ANIMATION_DURATIONS } from "../../constants/animations";

type Props = Readonly<{
  size?: "sm" | "md";
  theme: "light" | "dark";
  onToggle: (nextTheme: "light" | "dark") => void;
}>;

export function ThemeToggle({ size = "md", theme, onToggle }: Props) {
  const { t } = useTranslation();
  const [anim, setAnim] = React.useState(false);

  // Trigger a short transform animation when toggling (unless reduced motion)
  const playAnim = React.useCallback(() => {
    const reduce = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;
    setAnim(true);
    globalThis.setTimeout(() => setAnim(false), ANIMATION_DURATIONS.THEME_TOGGLE);
  }, []);

  const btnBase =
    "inline-grid place-items-center rounded-2xl border-2 border-[var(--primary)] text-blue-500 " +
    "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent]";
  const btnSize = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const btnHover =
    "bg-transparent hover:bg-[var(--primary)] hover:text-white shadow-lg " +
    "hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(var(--ring),.35)]";
  const iconWrap =
    "transition-transform duration-300 will-change-transform " +
    (anim ? "rotate-180 scale-90" : "rotate-0 scale-100");

  const nextLabel =
    theme === "dark"
      ? (t("theme.light") ?? "Switch to light theme")
      : (t("theme.dark") ?? "Switch to dark theme");

  const handleClick = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    onToggle(nextTheme);
    playAnim();
  };

  return (
    <button
      type="button"
      aria-label={nextLabel}
      aria-pressed={theme === "dark"} // pressed = dark mode ON
      className={`${btnBase} ${btnSize} ${btnHover}`}
      onClick={handleClick}
    >
      <span className={iconWrap} aria-hidden>
        {theme === "dark" ? (
          // Sun icon
          <svg width="18" height="18" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path
              d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        ) : (
          // Moon icon
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 109.8 9.8z" fill="currentColor" />
          </svg>
        )}
      </span>
    </button>
  );
}
