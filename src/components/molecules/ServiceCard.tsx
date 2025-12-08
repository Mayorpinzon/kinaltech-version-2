// src/components/molecules/ServiceCard.tsx
import type { ReactNode, CSSProperties } from "react";

export function ServiceCard({
  icon,
  title,
  children,
  className = "",
  style,
}: Readonly<{
  icon: ReactNode;
  title: ReactNode;                 
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}>) {
  return (
    <article
      className={[
        // base visuals (match template)
        "relative overflow-hidden",
        "rounded-[var(--radius)]",
        "border border-[color-mix(in_srgb,var(--muted)_28%,transparent)]",
        "bg-[var(--surface)]",
        "p-7",
        // elevation + hover feedback
        "glow-pulse",
        "transition-transform duration-200",
        "focus-within:-translate-y-1.5 focus-within:[box-shadow:0_18px_40px_rgba(2,6,23,.15)]",
        "hover:border-[var(--primary)]",
        className,
      ].join(" ")}
      style={style}
    >
      {/* Decorative icon (visual only) */}
      <div
        className={[
          "w-[66px] h-[66px] rounded-[18px]",
          "grid place-items-center",
          "text-white",
          "mb-4",
          "bg-[conic-gradient(from_180deg,var(--primary),var(--accent))]",
          "[box-shadow:0_10px_22px_rgba(var(--ring),.35)]",
        ].join(" ")}
        aria-hidden
      >
        <div className="h-8 w-8">{icon}</div>
      </div>

      {/* Title and body copy */}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted">{children}</p>
    </article>
  );
}
