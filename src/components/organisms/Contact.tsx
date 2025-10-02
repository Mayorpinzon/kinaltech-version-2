//src/components/organisms/Contact.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H2, Lead } from '../atoms/Heading';
import Button from '../atoms/Button';
import { useState } from 'react';


export function Contact() {
    const { t } = useTranslation();
    const [ok, setOk] = useState('');
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const name = String(fd.get('name') || '').trim();
        const email = String(fd.get('email') || '').trim();
        if (!name || !email) { setOk(''); return; }
        setOk(`${name}, te contactamos pronto a ${email}.`);
        e.currentTarget.reset();
    };
    return (
        <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-950/40">
            <Container>
                <div className="text-center max-w-2xl mx-auto">
                    <H2>{t('contact.title')}</H2>
                    <Lead>{t('contact.blurb')}</Lead>
                </div>
                <div className="mt-10 grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="rounded-xl border p-4">📧 hello@kinaltech.com</div>
                        <div className="rounded-xl border p-4">🌍 Global Remote</div>
                        <div className="rounded-xl border p-4">🕘 Mon–Fri: 9–18h</div>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="name">{t('form.name')}</label>
                            <input id="name" name="name" className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-slate-900/60" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="email">{t('form.email')}</label>
                            <input id="email" name="email" type="email" className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-slate-900/60" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="subject">{t('form.subject')}</label>
                            <input id="subject" name="subject" className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-slate-900/60" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="message">{t('form.message')}</label>
                            <textarea id="message" name="message" rows={4} className="w-full rounded-xl border px-3 py-2 bg-white/80 dark:bg-slate-900/60" />
                        </div>
                        <Button type="submit">{t('form.send')}</Button>
                        {ok && <p className="text-sm text-emerald-600">{ok}</p>}
                    </form>
                </div>
            </Container>
        </section>
    );
}