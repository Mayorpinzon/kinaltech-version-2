// src/components/organisms/Hero.tsx
import { useTranslation } from "react-i18next";
import { Container, H1, Lead, Button } from "../atoms";
import { useReveal } from "../../hooks/useReveal";
import { useEffect, useState } from "react";

export default function Hero() {
  const { t } = useTranslation();
  useReveal();

  // Respect user prefers-reduced-motion: disable autoplay if set
  const [canAutoplay, setCanAutoplay] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setCanAutoplay(!mq?.matches);
    update();
    mq?.addEventListener?.("change", update);
    return () => mq?.removeEventListener?.("change", update);
  }, []);

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden min-h-[72vh] py-24 md:py-32"
      aria-labelledby="hero-title"
      aria-describedby="hero-desc"
    >
      {/* Decorative background video (no reading by AT) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black">
        <div className="absolute w-full h-full">
          <video
            className="h-full w-full object-cover blur-sm brightness-70"
            src="/KinalDesck.mp4"
            poster="/hero-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay={canAutoplay}
          >
            {/* Minimal fallback */}
            <img src="/hero-poster.jpg" alt="" className="h-full w-full object-cover" />
          </video>

          {/* Contrast overlay for text legibility */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-br from-black/40 via-black/25 to-transparent" />
        </div>
      </div>

      <Container className="relative z-20 grid items-center gap-15 md:grid-cols-12">
        <div className="md:col-span-7">
          <H1 id="hero-title" className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white">
            {t("hero.title")}
          </H1>

          <Lead id="hero-desc" className="block mt-6 text-lg max-w-xl" style={{ color: "#94a3b8" }}>
            {t("hero.subtitle")}
          </Lead>

          <div className="mt-10 h-15 flex gap-4">
            <Button
              variant="outline"
              movingBorder
              aria-label={t("hero.cta1_aria") || t("hero.cta1")}
              onClick={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })}
              className="shadow-lg hover:shadow-xl hover:shadow-blue-600/20 rainbow-border-round"
            >
              {t("hero.cta1")}
            </Button>

            <Button
              variant="outline"
              movingBorder
              aria-label={t("hero.cta2_aria") || t("hero.cta2")}
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="shadow-lg hover:shadow-xl hover:shadow-blue-600/20 rainbow-border-round"
            >
              {t("hero.cta2")}
            </Button>
          </div>
        </div>

        {/* Optional right visual (kept for design); provide alt via i18n */}
        <div className="md:col-span-5 rounded-app overflow-hidden shadow-soft md:block hidden border-shadow-lg">
          <picture>
            <img
              className="w-full h-full object-cover"
              src="/hero-poster.jpg"
              alt={t("hero.imageAlt")}
              decoding="async"
              fetchPriority="low"
              loading="lazy"
              width={1280}
              height={960}
            />
          </picture>
        </div>
      </Container>
    </section>
  );
}
