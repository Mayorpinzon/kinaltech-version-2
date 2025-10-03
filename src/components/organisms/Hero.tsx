//src/components/organisms/Hero.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H1, Lead } from '../atoms/Heading';
import Button from '../atoms/Button';
import { useReveal } from '../../hooks/useReveal';

export default function Hero() {
  const { t } = useTranslation();
  useReveal();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-grad-1 text-base py-24 md:py-32 reveal"
    >
      {/* Blobs flotando */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--accent)]/20 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-3xl animate-float [animation-delay:2s]" />

      <Container className="relative grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <H1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            {t('hero.title')}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
              KinalTech
            </span>
          </H1>
          <Lead className="block mt-6 text-lg max-w-xl">
            {t('hero.subtitle')}
          </Lead>
          <div className="mt-8 flex gap-4">
            {/* tu botón gradiente */}
            <Button className="rounded-app bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
              {t('hero.cta1')}
            </Button>
            <Button variant="outline">
              {t('hero.cta2')}
            </Button>
          </div>
        </div>

        <div className="md:col-span-6 rounded-app overflow-hidden shadow-soft aspect-video bg-surface trans-app">
          <img className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80"
            alt="Frontend" />
        </div>
      </Container>
    </section>
  );
}
