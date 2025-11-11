// src/components/atoms/Container.tsx
import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type BaseProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

const Container = forwardRef<HTMLElement, BaseProps>(function Container(
  { as: Tag = "div", children, className = "", ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={`mx-auto w-full max-w-6xl px-6 md:px-8 ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default Container;
