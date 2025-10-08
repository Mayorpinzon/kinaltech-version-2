//src/components/organisms/Contact.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H2, Lead } from '../atoms/Heading';
import Button from '../atoms/Button';
import { useState } from 'react';
import { useReveal } from '../../hooks/useReveal';

export function Contact() {
  const { t } = useTranslation();
  const [ok, setOk] = useState('');
  useReveal();

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
    <section id="contact" className="py-20 bg-shell scroll-mt-20">
      <Container>
        <div className="text-center max-w-2xl mx-auto reveal">
          <H2>{t('contact.title')}</H2>
          <Lead>{t('contact.blurb')}</Lead>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-4 reveal">
            <div className="rounded-app border p-4 bg-card">📧 hello@kinaltech.com</div>
            <div className="rounded-app border p-4 bg-card">🌍 Global Remote</div>
            <div className="rounded-app border p-4 bg-card">🕘 Mon–Fri: 9–18h</div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4 reveal">
            {['name','email','subject','message'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1" htmlFor={field}>
                  {t(`form.${field}`)}
                </label>
                {field === 'message' ? (
                  <textarea id={field} name={field} rows={4}
                    className="w-full rounded-app border px-3 py-2 bg-surface shadow-soft"/>
                ) : (
                  <input id={field} name={field} type={field==='email'?'email':'text'}
                    className="w-full rounded-app border px-3 py-2 bg-surface shadow-soft"/>
                )}
              </div>
            ))}
            <Button type="submit">{t('form.send')}</Button>
            {ok && <p className="text-sm text-emerald-600">{ok}</p>}
          </form>
        </div>
      </Container>
    </section>
  );
}
