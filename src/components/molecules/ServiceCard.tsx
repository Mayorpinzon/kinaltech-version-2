//src/components/molecules/ServiceCard.tsx
// ServiceCard.tsx
import type { ReactNode } from 'react';

export default function ServiceCard({
  icon,
  title,
  children,
  className = '',
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-app p-6 shadow-soft trans-app
                  border border-white/10 hover:-translate-y-0.5
                  hover:shadow-[0_12px_26px_rgba(var(--ring),.25)] ${className}`}
      style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
    >
      <div className="text-3xl text-[var(--primary)] mb-3">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted">{children}</p>
    </article>
  );
}
