// src/components/organisms/About.tsx
import { useTranslation } from "react-i18next";
import Container from "../atoms/Container";
import { H2 } from "../atoms/Heading";
import Button from "../atoms/Button";
import { useReveal } from "../../hooks/useReveal";

export function About() {
  const { t } = useTranslation();
  useReveal();

  // Optional caption; empty string if not provided in i18n
  const caption = t("about.imageCaption", { defaultValue: "" });

  return (
    <section
      id="about"
      className="py-24 md:py-28 bg-surface text-base scroll-mt-20"
      aria-labelledby="about-title"
      aria-describedby="about-desc"
    >
      <Container className="grid gap-10 md:grid-cols-2 items-center">
        {/* Text column */}
        <div className="text-[var(--text)]">
          {/* Section heading used as label for the landmark */}
          <H2 id="about-title">{t("about.title")}</H2>

          {/* First paragraph doubles as section description for AT/SEO */}
          <p id="about-desc" className="mt-3 text-[var(--muted)]">
            {t("about.p1")}
          </p>
          <p className="mt-3 text-[var(--muted)]">{t("about.p2")}</p>
          <p className="mt-2 text-[var(--muted)]">{t("about.p3")}</p>

          {/* Clear action; aria-label falls back to button text if *_aria is missing */}
          <Button
            variant="outline"
            aria-label={t("about.cta_aria", { defaultValue: t("about.cta") })}
            onClick={() =>
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-5 shadow-lg text-white border-none hover:shadow-xl hover:shadow-blue-600/20 rainbow-border-round"
          >
            {t("about.cta")}
          </Button>
        </div>

        {/* Visual column */}
        <figure className="reveal rounded-app overflow-hidden shadow-soft aspect-video bg-card h-full">
          <img
            className="w-full h-full object-cover"
            src="/AboutStructure.JPG"
            alt={t("about.imageAlt")}
            decoding="async"
            loading="lazy"
            fetchPriority="low"
            width={1280}
            height={720}
          />
          {caption && (
            <figcaption className="sr-only">{caption}</figcaption>
          )}
        </figure>
      </Container>
    </section>
  );
}
