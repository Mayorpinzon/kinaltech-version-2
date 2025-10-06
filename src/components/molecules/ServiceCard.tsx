//src/components/molecules/ServiceCard.tsx
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
      className={`rounded-app p-6 shadow-soft trans-app hover-rise
                  border border-[var(--border)] bg-[var(--card)] ${className}`}
      style={{
        background:
          'linear-gradient(145deg, var(--card) 0%, var(--surface) 100%)',
        color: 'var(--text)',
      }}
    >
      <div className="text-3xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent mb-3">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted">{children}</p>
    </article>
  );
}
