//src/components/organisms/Services.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H2, Lead } from '../atoms/Heading';
import ServiceCard from '../molecules/ServiceCard';


export default function Services() {
    const { t } = useTranslation();
    return (
        <section id="services" className="py-20">
            <Container>
                <div className="text-center max-w-2xl mx-auto">
                    <H2>{t('services.title')}</H2>
                    <Lead>{t('services.blurb')}</Lead>
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <ServiceCard icon={<span>💻</span>} title={t('services.items.web.title')!}>{t('services.items.web.text')}</ServiceCard>
                    <ServiceCard icon={<span>📱</span>} title={t('services.items.mobile.title')!}>{t('services.items.mobile.text')}</ServiceCard>
                    <ServiceCard icon={<span>🎨</span>} title={t('services.items.ui.title')!}>{t('services.items.ui.text')}</ServiceCard>
                </div>
            </Container>
        </section>
    );
}