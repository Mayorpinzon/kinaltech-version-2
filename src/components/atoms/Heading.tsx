// src/components/atoms/Heading.tsx
import { forwardRef, type ReactNode, type HTMLAttributes } from "react";

type HProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
  /** Visually hide the heading but keep it for AT (screen readers). */
  srOnly?: boolean;
};

type PProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
  /** Visually hide the paragraph but keep it for AT (screen readers). */
  srOnly?: boolean;
};

export const H1 = forwardRef<HTMLHeadingElement, HProps>(function H1(
  { children, className = "", srOnly = false, ...rest },
  ref
) {
  return (
    <h1
      ref={ref}
      className={[
        "text-5xl md:text-6xl font-bold tracking-tight",
        srOnly ? "sr-only" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </h1>
  );
});

export const H2 = forwardRef<HTMLHeadingElement, HProps>(function H2(
  { children, className = "", srOnly = false, ...rest },
  ref
) {
  return (
    <h2
      ref={ref}
      className={[
        "text-3xl font-bold",
        srOnly ? "sr-only" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </h2>
  );
});

export const Lead = forwardRef<HTMLParagraphElement, PProps>(function Lead(
  { children, className = "", srOnly = false, ...rest },
  ref
) {
  return (
    <p
      ref={ref}
      className={[ "text-muted text-lg", srOnly ? "sr-only" : "", className ].join(" ")}
      {...rest}
    >
      {children}
    </p>
  );
});
