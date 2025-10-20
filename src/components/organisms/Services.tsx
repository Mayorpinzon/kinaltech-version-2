// src/components/organisms/Services.tsx
import { useTranslation } from "react-i18next";
import Container from "../atoms/Container";
import { H2, Lead } from "../atoms/Heading";
import ServiceCard from "../molecules/ServiceCard";
import { useReveal } from "../../hooks/useReveal";
import { WebIcon, MobileIcon, UIUXIcon } from "../atoms/Icons";

export default function Services() {
  const { t } = useTranslation();
  useReveal(); // activa .reveal -> .show

  return (
    <section
      id="services"
      className="py-30 bg-[var(--surface)] text-body dark:text-white scroll-mt-20"
      aria-labelledby="services-title"
    >
      <Container>
        <div className="text-center mb-8 md:mb-12  ">
          <H2 id="services-title" className="inline-block relative ">
            {t("services.title")}
          </H2>
          <Lead className="max-w-3xl mx-auto mt-2">
            {t("services.lead") || t("services.blurb")}
          </Lead>
        </div>

        {/* grid 12→6→4 como el template */}
        <div className="grid grid-cols-12 gap-5 md:gap-6">
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <ServiceCard
              className="reveal"
              style={{ transitionDelay: "0ms" }}
              icon={<WebIcon />}
              title={t("services.items.web.title")!}
            >
              {t("services.items.web.text")}
            </ServiceCard>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <ServiceCard
              className="reveal"
              style={{ transitionDelay: "80ms" }}
              icon={<MobileIcon />}
              title={t("services.items.mobile.title")!}
            >
              {t("services.items.mobile.text")}
            </ServiceCard>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <ServiceCard
              className="reveal"
              style={{ transitionDelay: "160ms" }}
              icon={<UIUXIcon />}
              title={t("services.items.ui.title")!}
            >
              {t("services.items.ui.text")}
            </ServiceCard>
          </div>
        </div>
      </Container>
    </section>
  );
}
