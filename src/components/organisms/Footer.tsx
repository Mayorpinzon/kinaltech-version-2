// src/components/organisms/Footer.tsx
import Container from "../atoms/Container";
import { useTranslation } from "react-i18next";
import { KinalTechLogo } from "../atoms/Icons";

export function Footer() {
  const { t } = useTranslation();
  const y = new Date().getFullYear();

  return (
    /* Footer landmark with accessible label */
    <footer
      role="contentinfo"
      aria-label={t("footer.aria") ?? "Site footer"}
      className="
        bg-surface text-sm text-muted
        border-t border-[var(--footerBorder,var(--border))]
        py-3
      "
    >
      <Container>
        <div className="flex flex-wrap items-center justify-center sm:justify-center gap-3">
          <a
            href="#hero"
            rel="home"
            aria-label="KinalTech — Home"
            className="inline-flex items-center gap-2"
          >
            <KinalTechLogo className="h-5 w-auto" aria-hidden />
            <span className="sr-only">KinalTech</span>
          </a>
          {/* Legal note (uses <time> for machine-readability) */}
          <p className="text-xs sm:text-sm">
            © <time dateTime={String(y)}>{y}</time> KinalTech · {t("footer.rights")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
