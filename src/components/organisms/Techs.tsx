//src/components/organisms/Techs.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H2, Lead } from '../atoms/Heading';
import { useReveal } from '../../hooks/useReveal';

export function Techs() {
  const { t } = useTranslation();
  useReveal();

  const items = ['React.js','Next.js','Vue.js','React Native','Flutter','MySQL','GraphQL','Redux'];

  return (
    <section id="technologies" className="py-20 bg-shell text-body">
      <Container>
        <div className="text-center max-w-2xl mx-auto reveal">
          <H2>{t('tech.title')}</H2>
          <Lead>{t('tech.blurb')}</Lead>
        </div>

        {/* Marquee */}
        <div
          className="mt-10 overflow-hidden reveal
                     [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <div className="flex gap-4 w-[200%] animate-slide">
            {[...items, ...items].map((x, i) => (
              <span
                key={`${x}-${i}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-app bg-card border border-white/10 shadow-soft hover-rise"
              >
                {x}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
