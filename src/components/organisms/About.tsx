// src/components/organisms/About.tsx
import { useTranslation } from "react-i18next";
import { Container, H2, Lead, Button } from "../atoms";
import { useReveal } from "../../hooks/useReveal";
import type { TranslationKey } from "../../i18n/types";

type TeamMember = {
  id: string;
  avatar: string;
  nameKey: TranslationKey;
  roleKey: TranslationKey;
  bioKey: TranslationKey;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "dev1",
    avatar: "/KinalGabAzul.png",
    nameKey: "about.team.dev1.name" as TranslationKey,
    roleKey: "about.team.dev1.role" as TranslationKey,
    bioKey: "about.team.dev1.bio" as TranslationKey,
  },
  {
    id: "dev2",
    avatar: "/KinalMarConverse.png",
    nameKey: "about.team.dev2.name" as TranslationKey,
    roleKey: "about.team.dev2.role" as TranslationKey,
    bioKey: "about.team.dev2.bio" as TranslationKey,
  },
];

export default function About() {
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
      <Container className="max-w-2xl mx-auto text-[var(--text)] text-center mb-20 reveal">
        <H2>{t("about.sectionTitle")}</H2>
        <Lead className="mt-3">
          {t(
            "about.sectionLead",
          )}
        </Lead>
      </Container>

      {/* Bloque 1: KinalTech overview */}
      <Container className="grid gap-10 md:grid-cols-2 items-center mb-28">
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
            movingBorder
            aria-label={t("about.cta_aria", { defaultValue: t("about.cta") })}
            onClick={() =>
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-5 shadow-lg hover:shadow-xl hover:shadow-blue-600/20 rainbow-border-round"
          >
            {t("about.cta")}
          </Button>
        </div>

        {/* Visual column */}
        <figure className="reveal rounded-app overflow-hidden shadow-soft aspect-video bg-card h-full max-w-full">
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
          {caption && <figcaption className="sr-only">{caption}</figcaption>}
        </figure>
      </Container>

      {/* Bloque 2: Team / Developers */}
      <Container className="mt-16">
        <div className="max-w-3xl mx-auto text-center reveal">
          <H2 className="text-[var(--text)] " id="about-team-title">{t("about.team.title", "About us")}</H2>
          <Lead className="mt-3">
            {t(
              "about.team.lead"
            )}
          </Lead>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-1 lg:grid-cols-2">
          {TEAM_MEMBERS.map((member) => (
            <article
              key={member.id}
              className="reveal flex flex-col items-center text-center rounded-app border border-[var(--border)] bg-card/60 px-6 py-7 shadow-soft backdrop-blur-sm  shadow-lg hover:border-[var(--primary)] hover:shadow-md
        transition-colors glow-pulse"
            >
              <div className="h-40 w-25 rounded-full overflow-hidden border border-[var(--primary)] bg-[var(--surface)] shadow-soft mb-4">
                <img
                  src={member.avatar}
                  alt={t(member.nameKey)}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="text-base font-semibold text-[var(--text)] text-aline-justify">
                {t(member.nameKey)}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-[var(--muted)]">
                {t(member.roleKey)}
              </p>
              <p className="mt-3 text-sm text-[var(--muted)]" style={{ textAlign: "justify" }}>
                {t(member.bioKey)}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

