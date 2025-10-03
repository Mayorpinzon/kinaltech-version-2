//src/components/atoms/Container.tsx
import type { ReactNode } from 'react';

export default function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  // Un poco más de respiro lateral como en el template
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
