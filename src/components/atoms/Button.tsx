//src/components/atoms/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: 'solid' | 'outline';
};

export default function Button({
    children,
    className = '',
    variant = 'solid',
    ...rest
}: Props) {
    const base =
        'inline-flex items-center justify-center md:text-lg gap-3 rounded-full px-5 py-3 text-sm font-semibold trans-app active:scale-[.90] ' +
        'focus:outline-none focus:ring-4 ring-primary ' +
        'hover:-translate-y-0.5 hover:shadow-[0_15px_26px_rgba(var(--ring),.35)]';


    const solid =
        'text-white shadow-soft ' +
        'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] ' +
        'hover:-translate-y-0.5 hover:shadow-lg';

    const outline =
        'bg-transparent border-2 border-[var(--primary)] text-[var(--primary)] ' +
        'hover:bg-[var(--primary)] hover:text-white ' +
        'shadow-lg';


    return (
        <button
            className={`${base} ${variant === 'solid' ? solid : outline} btn-shadow-slow ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}
