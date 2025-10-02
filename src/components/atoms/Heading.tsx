//src/components/atoms/Heading.tsx
import type { ReactNode } from 'react';


type Props = { children: ReactNode; className?: string };
export function H1({ children, className = '' }: Props) {
    return <h1 className={`text-4xl/tight md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white ${className}`}>{children}</h1>;
}
export function H2({ children, className = '' }: Props) {
    return <h2 className={`text-3xl font-bold text-slate-900 dark:text-white ${className}`}>{children}</h2>;
}
export function Lead({ children, className = '' }: Props) {
    return <p className={`text-slate-600 dark:text-slate-300 text-lg ${className}`}>{children}</p>;
}