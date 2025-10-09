// src/components/organisms/Services.tsx
import { useTranslation } from "react-i18next";
import Container from "../atoms/Container";
import { H2, Lead } from "../atoms/Heading";
import ServiceCard from "../molecules/ServiceCard";
import { useReveal } from "../../hooks/useReveal";
import { WebIcon, MobileIcon, UIUXIcon } from "../atoms/Icons";

export default function Services() {
  const { t } = useTranslation();
  useReveal();

  return (
    <section id="services" className="py-30 bg-surface text-body
     dark:text-white scroll-mt-20">
      <Container>
        <div className="text-center max-w-2xl mx-auto reveal">
          <H2>{t("services.title")}</H2>
          <Lead className="mt-3">{t("services.lead")}</Lead>
        </div>

        <div className="mt-12 grid gap-6 sm:gap-7 md:grid-cols-3">
          <ServiceCard className="reveal" icon={<WebIcon />} title={t("services.items.web.title")!}>
            {t("services.items.web.text")}
          </ServiceCard>

          <ServiceCard className="reveal" icon={<MobileIcon />} title={t("services.items.mobile.title")!}>
            {t("services.items.mobile.text")}
          </ServiceCard>

          <ServiceCard className="reveal" icon={<UIUXIcon />} title={t("services.items.ui.title")!}>
            {t("services.items.ui.text")}
          </ServiceCard>
        </div>
      </Container>
    </section>
  );
}
