//src/components/organisms/About.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H2, Lead } from '../atoms/Heading';
import Button from '../atoms/Button';
import { useReveal } from '../../hooks/useReveal';

export function About() {
  const { t } = useTranslation();
  useReveal();

  return (
    <section id="about" className="py-20 bg-surface text-base">
      <Container className="grid gap-10 md:grid-cols-2 items-center">
        <div className="reveal">
          <H2>{t('about.title')}</H2>
          <Lead>{t('about.p1')}</Lead>
          <p className="mt-3 text-muted">{t('about.p2')}</p>
          <p className="mt-2 text-muted">{t('about.p3')}</p>
          <Button className="mt-6">{t('about.cta')}</Button>
        </div>
        <div className="reveal rounded-app overflow-hidden shadow-soft aspect-video bg-card">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
            alt="Team"
          />
        </div>
      </Container>
    </section>
  );
}
