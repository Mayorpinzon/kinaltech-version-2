//src/components/organisms/Footer.tsx
import Container from '../atoms/Container';
import { useTranslation } from 'react-i18next';
export function Footer() {
    const { t } = useTranslation();
    const y = new Date().getFullYear();
    return (
        <footer className="border-t py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <Container>
                © {y} KinalTech · {t('footer.rights')}
            </Container>
        </footer>
    );
}