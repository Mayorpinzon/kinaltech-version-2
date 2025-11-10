//src/components/organisms/Footer.tsx
import Container from '../atoms/Container';
import { useTranslation } from 'react-i18next';
import { KinalTechLogo } from "../atoms/Icons";;

export function Footer() {
  const { t } = useTranslation();
  const y = new Date().getFullYear();

  return (
    <footer className=" border-1 border-[var(--footerBorder)] py-3 text-center text-sm text-muted bg-surface" >
      <Container>
        <KinalTechLogo className="inline h-5 w-auto ml-2 align-middle pr-3" aria-hidden />
        © {y} KinalTech · {t('footer.rights')}

      </Container>
    </footer>
  );
}
