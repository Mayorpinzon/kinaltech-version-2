//src/components/atoms/Heading.tsx
import type { ReactNode } from 'react';

type Props = { children: ReactNode; className?: string };

export function H1({ children, className = '' }: Props) {
  return (
    <h1 className={`text-5xl md:text-6xl font-bold tracking-tight ${className}`}>
      {children}
    </h1>
  );
}

export function H2({ children, className = '' }: Props) {
  return <h2 className={`text-3xl font-bold ${className}`}>{children}</h2>;
}

export function Lead({ children, className = '' }: Props) {
  return <p className={`text-muted text-lg ${className}`}>{children}</p>;
}
