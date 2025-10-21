//src/components/organisms/About.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H2} from '../atoms/Heading';
import Button from '../atoms/Button';
import { useReveal } from '../../hooks/useReveal';

export function About() {
  const { t } = useTranslation();
  useReveal();

  return (
    <section id="about" className="py-20 bg-surface text-base scroll-mt-20">
      <Container className="grid gap-10 md:grid-cols-2 items-center">
        <div className="text-[var(--text)] ">
          <H2>{t('about.title')}</H2>
          <p className="mt-3 text-[var(--text)]">{t('about.p1')}</p>
          <p className="mt-3 text-[var(--text)]">{t('about.p2')}</p>
          <p className="mt-2 text-[var(--text)]">{t('about.p3')}</p>
          <Button className="mt-6 bg-gradient-to-r from-[var(--primary)] 
            to-[var(--accent)] shadow-lg hover:shadow-xl hover:shadow-blue-600/20">{t('about.cta')}</Button>
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
