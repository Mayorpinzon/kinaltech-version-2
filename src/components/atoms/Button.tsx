//src/components/atoms/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'solid' | 'outline';
  movingBorder?: boolean; // ← nuevo
};

export default function Button({
  children,
  className = '',
  variant = 'solid',
  movingBorder = false,
  ...rest
}: Props) {
  const base =
    // añadimos relative + overflow-hidden (no molesta si no hay borde animado)
    'relative overflow-hidden inline-flex items-center justify-center md:text-lg gap-3 ' +
    'rounded-full px-5 py-3 text-sm font-semibold trans-app active:scale-[.90] ' +
    'focus:outline-none focus:ring-4 ring-primary ' +
    'hover:-translate-y-0.5 hover:shadow-[0_15px_26px_rgba(var(--ring),.35)]';

  const solid =
    'text-white shadow-soft ' +
    'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] ' +
    'hover:-translate-y-0.5 hover:shadow-lg';

  // si movingBorder, quitamos el borde visible para no duplicar
  const outline = (movingBorder
      ? 'border-2 border-transparent'
      : 'border-2 border-[var(--primary)]'
    ) +
    ' bg-transparent text-[var(--primary)] ' +
    'hover:bg-[var(--primary)] hover:text-white ' +
    'shadow-lg';

  return (
    <button
      className={[
        base,
        variant === 'solid' ? solid : outline,
        movingBorder ? 'moving-border' : '', // ← activa el borde animado
        'btn-shadow-slow',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
