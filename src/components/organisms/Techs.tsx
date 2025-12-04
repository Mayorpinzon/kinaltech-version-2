// src/components/organisms/Techs.tsx
import { useTranslation } from "react-i18next";
import { Container, H2, Lead } from "../atoms";
import { useReveal } from "../../hooks/useReveal";
import { useState, type ComponentType, type SVGProps } from "react";
import type { TranslationKey } from "../../i18n/types";
import {
  ReactIcon, NextIcon, VueIcon, RNIcon,
  FlutterIcon, MySQLIcon, GraphQLIcon, ReduxIcon, NodeBadgeIcon,
  JavaScriptBrandIcon, TypeScriptBrandIcon, AngularIcon, PythonIcon,
  HTML5Icon, CSS3Icon
} from "../atoms";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type Tech = {
  id: string;
  nameKey: TranslationKey;
  color: string;
  Icon: IconComponent;
};

const TECHS: Tech[] = [
  { id: "react", nameKey: "tech.react" as TranslationKey, color: "#61DAFB", Icon: ReactIcon },
  { id: "next", nameKey: "tech.next" as TranslationKey, color: "#FFFFFF", Icon: NextIcon },
  { id: "vue", nameKey: "tech.vue" as TranslationKey, color: "#42B883", Icon: VueIcon },
  { id: "rn", nameKey: "tech.rn" as TranslationKey, color: "#61DAFB", Icon: RNIcon },
  { id: "flutter", nameKey: "tech.flutter" as TranslationKey, color: "#55C0F9", Icon: FlutterIcon },
  { id: "mysql", nameKey: "tech.mysql" as TranslationKey, color: "#4479A1", Icon: MySQLIcon },
  { id: "graphql", nameKey: "tech.graphql" as TranslationKey, color: "#E535AB", Icon: GraphQLIcon },
  { id: "redux", nameKey: "tech.redux" as TranslationKey, color: "#764ABC", Icon: ReduxIcon },
  { id: "nodeJs", nameKey: "tech.nodeJs" as TranslationKey, color: "#83CD29", Icon: NodeBadgeIcon },
  { id: "javaScript", nameKey: "tech.javaScript" as TranslationKey, color: "#000000", Icon: JavaScriptBrandIcon },
  { id: "typeScript", nameKey: "tech.typeScript" as TranslationKey, color: "#000000", Icon: TypeScriptBrandIcon },
  { id: "python", nameKey: "tech.python" as TranslationKey, color: "#ffffff", Icon: PythonIcon },
  { id: "angular", nameKey: "tech.angular" as TranslationKey, color: "#ffffff", Icon: AngularIcon },
  { id: "html5", nameKey: "tech.html5" as TranslationKey, color: "#ffffff", Icon: HTML5Icon },
  { id: "css", nameKey: "tech.css" as TranslationKey, color: "#ffffff", Icon: CSS3Icon },
];

function Chip({ tech }: { tech: Tech }) {
  const { t } = useTranslation();
  const { Icon, color, nameKey } = tech;

  return (
    <li
      className="
        inline-flex items-center gap-4 rounded-full px-5 h-15 mx-2
        border border-[var(--border)]
        bg-[--surface] text-[--text] font-medium
        transition-colors shrink-0"
    >
      <span className="grid place-items-center h-5 w-5" style={{ color }} aria-hidden>
        <Icon />
      </span>
      <span className="text-sm">{t(nameKey)}</span>
    </li>
  );
}

function Card({ tech }: { tech: Tech }) {
  const { t } = useTranslation();
  const { Icon, color, nameKey } = tech;

  return (
    <article
      className="
        rounded-[16px] border border-[var(--border)] bg-card p-6 text-center
        shadow-soft hover:border-[var(--primary)] hover:shadow-md
        transition-colors glow-pulse
      "
    >
      <div className="mx-auto mb-2 grid h-8 w-10 place-items-center" style={{ color }} aria-hidden>
        <div className="h-8 w-8">
          <Icon />
        </div>
      </div>
      <h4 className="mt-1 font-semibold text-[--text]">{t(nameKey)}</h4>
    </article>
  );
}

function Techs() {
  const { t } = useTranslation();
  useReveal();

  const [/*active*/, /*setActive*/] = useState<string>(TECHS[0].id);

  return (
    <section id="techs" className="py-24 md:py-28 bg-surface text-body scroll-mt-20 bg-grad-1">
      <Container>
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto reveal">
          <H2>{t("techs.title")}</H2>
          <Lead className="mt-3">{t("techs.blurb")}</Lead>
        </div>
        {/* Carrusel / pasarela superior (usa animations.css) */}
        <div className="mt-7 overflow-hidden mask-edges reveal  " aria-hidden="true">
          {/* Pista duplicada para loop continuo. Claves únicas con índice. */}
          <div className="inline-flex h-17 items-center gap-4 animate-slide">
            {[...TECHS, ...TECHS].map((tech, i) => (
              <Chip key={`${tech.id}-${i}`} tech={tech} />
            ))}
          </div>
        </div>

        {/* Grid de cards inferior */}
        <div
          className=" mt-9 grid gap-6 reveal [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))] "
        >
          {TECHS.map((t) => (
            <Card key={t.id} tech={t} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Techs;
