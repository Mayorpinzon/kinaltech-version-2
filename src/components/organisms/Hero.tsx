// src/components/organisms/Hero.tsx
import { useTranslation } from "react-i18next";
import Container from "../atoms/Container";
import { H1, Lead } from "../atoms/Heading";
import Button from "../atoms/Button";
import { useReveal } from "../../hooks/useReveal";
import { useEffect, useState } from "react";

export default function Hero() {
  const { t } = useTranslation();
  useReveal();

  // Respeta reduce-motion: si el usuario lo tiene activo, no auto-reproducimos.
  const [canAutoplay, setCanAutoplay] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setCanAutoplay(!mq?.matches);
    update();
    mq?.addEventListener("change", update);
    return () => mq?.removeEventListener("change", update);
  }, []);

  return (
    <section id="hero" className="relative isolate overflow-hidden min-h-[72vh] py-24 md:py-32 ">
      {/* Background video (full-bleed) */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black">
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
            {/* Fallback mínimo si el navegador no soporta video */}
            <img src="/hero-poster.jpg" alt="kinaltech" className="h-full w-full object-cover" />
          </video>

          {/* Overlay para legibilidad del texto */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-br from-black/40 via-black/25 to-transparent" />
        </div>
      </div>

      <Container className="relative z-20 grid items-center gap-15 md:grid-cols-12 ">
        <div className="md:col-span-7">
          <H1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white">
            {t("hero.title")}{" "}
          </H1>
          <Lead className="block mt-6 text-lg max-w-xl" style={{ color: '#94a3b8' }}>
            {t("hero.subtitle")}
          </Lead>

          <div className="mt-10 h-15 flex gap-4">
            <Button className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] shadow-lg hover:shadow-xl hover:shadow-blue-600/20">
              {t("hero.cta1")}
            </Button>
            <Button variant="outline">
              {t("hero.cta2")}
            </Button>
          </div>
        </div>

        {/* Si quieres conservar una imagen/ilustración a la derecha, deja este bloque; 
            si no, puedes eliminarlo para un hero 100% texto sobre video. */}
        <div className="md:col-span-5 rounded-app overflow-hidden shadow-soft md:block hidden border-shadow-lg">
          <img
            className="w-full h-full object-cover"
            src="/hero-poster.jpg"
            alt="Frontend"
          />
        </div>
      </Container>
    </section>
  );
}
