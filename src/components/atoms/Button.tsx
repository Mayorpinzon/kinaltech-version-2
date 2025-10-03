//src/components/atoms/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';


type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: 'solid' | 'outline' };
export default function Button({ children, className = '', variant = 'solid', ...rest }: Props) {
    const base = 'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900';
    const solid = 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg hover:shadow-xl focus-visible:ring-indigo-400';
    const outline = 'border border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:text-indigo-200 dark:border-indigo-500/40 dark:hover:bg-indigo-500/10 focus-visible:ring-indigo-300';
    return (
        <button className={`${base} ${variant === 'solid' ? solid : outline} ${className}`} {...rest}>{children}</button>
    );
}