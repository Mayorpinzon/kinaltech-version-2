import { useTranslation } from "react-i18next";
import { Container, H2, Lead } from "../atoms";
import { ServiceCard } from "../molecules";
import { useReveal } from "../../hooks/useReveal";
import {
  WebIcon,
  MobileIcon,
  UIUXIcon,
  IA_Icon,
  TeamworkIcon,
} from "../atoms";

export default function Services() {
  const { t } = useTranslation();
  useReveal(); // triggers .reveal → .show animation on scroll

  // List of services (for semantic mapping and maintainability)
  const services = [
    {
      id: "web",
      icon: <WebIcon aria-hidden="true" />,
      title: t("services.items.web.title"),
      text: t("services.items.web.text"),
      delay: "0ms",
    },
    {
      id: "mobile",
      icon: <MobileIcon aria-hidden="true" />,
      title: t("services.items.mobile.title"),
      text: t("services.items.mobile.text"),
      delay: "160ms",
    },
    {
      id: "uiux",
      icon: <UIUXIcon aria-hidden="true" />,
      title: t("services.items.ui.title"),
      text: t("services.items.ui.text"),
      delay: "180ms",
    },
    {
      id: "ia",
      icon: <IA_Icon aria-hidden="true" />,
      title: t("services.items.ia.title"),
      text: t("services.items.ia.text"),
      delay: "200ms",
    },
    {
      id: "phi",
      icon: <TeamworkIcon aria-hidden="true" />,
      title: t("services.items.phi.title"),
      text: t("services.items.phi.text"),
      delay: "220ms",
    },
  ];

  return (
    <section
      id="services"
      className="py-25 md:py-28 bg-[var(--surface)] text-body dark:text-white scroll-mt-20"
      aria-labelledby="services-title"
      aria-describedby="services-desc"
    >
      <Container>
        {/* Section heading with accessible context */}
        <div className="text-center mb-8 md:mb-12">
          <H2 id="services-title" className="inline-block relative">
            {t("services.title")}
          </H2>
          <Lead id="services-desc" className="max-w-3xl mx-auto mt-2">
            {t("services.lead") || t("services.blurb")}
          </Lead>
        </div>

        {/* Semantic list for better SEO and screen reader navigation */}
        <ul
          className="grid grid-cols-12 gap-5 md:gap-6"
          role="list"
          aria-label={t("services.title")}
        >
          {services.map(({ id, icon, title, text, delay }) => (
            <li
              key={id}
              className="col-span-12 sm:col-span-6 lg:col-span-4"
              aria-labelledby={`service-${id}-title`}
            >
              <ServiceCard
                className="reveal"
                style={{ transitionDelay: delay }}
                icon={icon}
                title={<span id={`service-${id}-title`}>{title}</span>}
              >
                {text}
              </ServiceCard>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
