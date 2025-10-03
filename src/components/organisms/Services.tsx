//src/components/organisms/Services.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H2, Lead } from '../atoms/Heading';
import ServiceCard from '../molecules/ServiceCard';
import { useReveal } from '../../hooks/useReveal';

export default function Services() {
  const { t } = useTranslation();
  useReveal();

  return (
    <section
      id="services"
      className="py-24 bg-surface text-body scroll-mt-20"
    >
      <Container>
        <div className="text-center max-w-2xl mx-auto reveal">
          <H2>{t('services.title')}</H2>
          <Lead>{t('services.blurb')}</Lead>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard className="reveal" icon={<span>💻</span>} title={t('services.items.web.title')!}>
            {t('services.items.web.text')}
          </ServiceCard>
          <ServiceCard className="reveal" icon={<span>📱</span>} title={t('services.items.mobile.title')!}>
            {t('services.items.mobile.text')}
          </ServiceCard>
          <ServiceCard className="reveal" icon={<span>🎨</span>} title={t('services.items.ui.title')!}>
            {t('services.items.ui.text')}
          </ServiceCard>
        </div>
      </Container>
    </section>
  );
}
