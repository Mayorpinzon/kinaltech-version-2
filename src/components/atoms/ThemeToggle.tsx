//src/components/atoms/ThemeToggle.tsx
import { useEffect, useState } from 'react';
export default function ThemeToggle() {
    const [mode, setMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('kinalTheme') as 'light' | 'dark') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    useEffect(() => { document.documentElement.classList.toggle('dark', mode === 'dark'); localStorage.setItem('kinalTheme', mode); }, [mode]);
    return (
        <button aria-label="Toggle theme" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} className="rounded-xl border px-3 py-2">
            {mode === 'dark' ? '☀️' : '🌙'}
        </button>
    );
}