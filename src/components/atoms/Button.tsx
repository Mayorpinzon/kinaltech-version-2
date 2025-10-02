//src/components/atoms/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';


type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: 'solid'|'outline' };
export default function Button({ children, className = '', variant='solid', ...rest }: Props){
const base = 'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[.98] focus:outline-none focus:ring';
const solid = 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-400';
const outline = 'border border-indigo-300 text-indigo-700 hover:bg-indigo-50 focus:ring-indigo-200';
return (
<button className={`${base} ${variant==='solid'?solid:outline} ${className}`} {...rest}>{children}</button>
);
}