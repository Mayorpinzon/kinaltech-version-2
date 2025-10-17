// src/components/atoms/Heading.tsx
import type { ReactNode, HTMLAttributes } from "react";

type HProps = HTMLAttributes<HTMLHeadingElement> & { children: ReactNode };
type PProps = HTMLAttributes<HTMLParagraphElement> & { children: ReactNode };

export function H1({ children, className = "", ...rest }: HProps) {
  return (
    <h1
      className={`text-5xl md:text-6xl font-bold tracking-tight ${className}`}
      {...rest}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = "", ...rest }: HProps) {
  return (
    <h2 className={`text-3xl font-bold ${className}`} {...rest}>
      {children}
    </h2>
  );
}

export function Lead({ children, className = "", ...rest }: PProps) {
  return (
    <p className={`text-muted text-lg ${className}`} {...rest}>
      {children}
    </p>
  );
}
