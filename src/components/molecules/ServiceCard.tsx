// src/components/molecules/ServiceCard.tsx
import type { ReactNode } from "react";

export default function ServiceCard({
  icon,
  title,
  children,
  className = "",
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={[
        "rounded-app border border-[var(--border)] bg-card hover:shadow-lg",
        "p-10 sm:p-7 trans-app hover:border-[var(--primary)]",
        className,
      ].join(" ")}
      style={{
        // leve “depth” como en el template
        background: "linear-gradient(145deg, var(--card) 0%, var(--surface) 100%)",
        color: "var(--text)",
      }}
    >
      {/* Icono en pastilla con gradiente */}
      <div
        className="
          inline-grid h-12 w-12 place-items-center rounded-2xl
          text-[--white]
          bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]
          shadow-soft
      "
        aria-hidden
      >
        {/* el SVG que mandamos desde Services */}
        <div className="h-6 w-6">{icon}</div>
      </div>

      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted">{children}</p>
    </article>
  );
}
