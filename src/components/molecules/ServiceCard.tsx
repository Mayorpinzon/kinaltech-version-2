//src/components/molecules/ServiceCard.tsx
import type { ReactNode } from 'react';
export default function ServiceCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
    return (
        <article className="rounded-2xl border p-6 shadow-sm hover:shadow-md transition bg-white/60 dark:bg-slate-900/60">
            <div className="text-2xl">{icon}</div>
            <h3 className="mt-3 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{children}</p>
        </article>
    );
}