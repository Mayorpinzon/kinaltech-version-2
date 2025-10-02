//src/components/organisms/Hero.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H1, Lead } from '../atoms/Heading';
import Button from '../atoms/Button';


export default function Hero() {
    const { t } = useTranslation();
    return (
        <section id="home" className="relative py-20 bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950">
            <Container className="grid items-center gap-10 md:grid-cols-2">
                <div>
                    <H1>{t('hero.title')}</H1>
                    <Lead className="block mt-4">{t('hero.subtitle')}</Lead>
                    <div className="mt-8 flex gap-3">
                        <Button>{t('hero.cta1')}</Button>
                        <Button variant='outline'>{t('hero.cta2')}</Button>
                    </div>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-xl aspect-video bg-slate-200">
                    {/* Replace with your image */}
                    <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80" alt="Frontend" />
                </div>
            </Container>
        </section>
    );
}