// src/components/atoms/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "solid" | "outline";
  /** Enables the animated conic border (see animations.css). */
  movingBorder?: boolean;
  /** Optional loading state: sets aria-busy and disables interactions. */
  loading?: boolean;
};

export function Button({
  children,
  className = "",
  variant = "solid",
  movingBorder = false,
  loading = false,
  type = "button",
  disabled,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;

  const base =
    "relative overflow-hidden inline-flex items-center justify-center md:text-lg gap-3 " +
    "rounded-full px-5 py-3 text-sm font-semibold trans-app active:scale-[.90] " +
    "focus:outline-none focus:ring-4 ring-primary " +
    "hover:-translate-y-0.5 hover:shadow-[0_15px_26px_rgba(var(--ring),.35)]";

  const solid =
    "text-white shadow-soft " +
    "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] " +
    "hover:shadow-lg";

  const outline = [
    "bg-[var(--button-bg)] text-white",
  ].join(" ");

  return (
    <button
      type={type}
      className={[
        base,
        variant === "solid" ? solid : outline,
        movingBorder ? "moving-border" : "",
        "btn-shadow-slow",
        className,
      ].join(" ")}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      {...rest}
    >
      {children}
    </button>
  );
}
