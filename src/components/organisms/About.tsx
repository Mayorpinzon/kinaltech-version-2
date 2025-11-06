//src/components/organisms/About.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H2 } from '../atoms/Heading';
import Button from '../atoms/Button';
import { useReveal } from '../../hooks/useReveal';

export function About() {
  const { t } = useTranslation();
  useReveal();

  return (
    <section id="about" className="py-24 md:py-28bg-surface text-base scroll-mt-20" >
      <Container className="grid gap-10 md:grid-cols-2 items-center">
        <div className="text-[var(--text)] ">
          <H2>{t('about.title')}</H2>
          <p className="mt-3 text-[var(--muted)]">{t('about.p1')}</p>
          <p className="mt-3 text-[var(--muted)]">{t('about.p2')}</p>
          <p className="mt-2 text-[var(--muted)]">{t('about.p3')}</p>
          <Button variant='outline' onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className=" mt-5 shadow-lg text-white border-none hover:shadow-xl hover:shadow-blue-600/20 rainbow-border-round" >
            {t("about.cta")}
          </Button>
        </div>
        <div className="reveal rounded-app overflow-hidden shadow-soft aspect-video bg-card h-full">
          <img
            className="w-full h-full object-cover"
            src="/AboutStructure.JPG"
            alt="Team"
          />
        </div>
      </Container>
    </section>
  );
}
