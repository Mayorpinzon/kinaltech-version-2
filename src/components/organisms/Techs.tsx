//src/components/organisms/Techs.tsx
import { useTranslation } from 'react-i18next';
import Container from '../atoms/Container';
import { H2, Lead } from '../atoms/Heading';


export function Techs() {
    const { t } = useTranslation();
    const items = ['React.js', 'Next.js', 'Vue.js', 'React Native', 'Flutter', 'MySQL', 'GraphQL', 'Redux'];
    return (
        <section id="technologies" className="py-20 bg-slate-50 dark:bg-slate-950/40">
            <Container>
                <div className="text-center max-w-2xl mx-auto">
                    <H2>{t('tech.title')}</H2>
                    <Lead>{t('tech.blurb')}</Lead>
                </div>
                <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {items.map(x => (
                        <div key={x} className="rounded-xl border bg-white/70 px-4 py-6 text-center shadow-sm dark:bg-slate-900/60">{x}</div>
                    ))}
                </div>
            </Container>
        </section>
    );
}