// src/components/organisms/Techs.tsx
import { useTranslation } from "react-i18next";
import Container from "../atoms/Container";
import { H2, Lead } from "../atoms/Heading";
import { useReveal } from "../../hooks/useReveal";
import { useState, type ComponentType } from "react";

import {
  ReactIcon, NextIcon, VueIcon, RNIcon,
  FlutterIcon, MySQLIcon, GraphQLIcon, ReduxIcon, NodeBadgeIcon, 
  JavaScriptBrandIcon, TypeScriptBrandIcon 
} from "../atoms/Icons";

type Tech = {
  id: string;
  nameKey: string;
  color: string;              
  Icon: ComponentType<any>;   
};

const TECHS: Tech[] = [
  { id: "react",   nameKey: "tech.react",   color: "#61DAFB", Icon: ReactIcon },
  { id: "next",    nameKey: "tech.next",    color: "#FFFFFF", Icon: NextIcon },
  { id: "vue",     nameKey: "tech.vue",     color: "#42B883", Icon: VueIcon },
  { id: "rn",      nameKey: "tech.rn",      color: "#61DAFB", Icon: RNIcon },
  { id: "flutter", nameKey: "tech.flutter", color: "#55C0F9", Icon: FlutterIcon },
  { id: "mysql",   nameKey: "tech.mysql",   color: "#4479A1", Icon: MySQLIcon },
  { id: "graphql", nameKey: "tech.graphql", color: "#E535AB", Icon: GraphQLIcon },
  { id: "redux",   nameKey: "tech.redux",   color: "#764ABC", Icon: ReduxIcon },
  { id: "nodeJs",  nameKey: "tech.nodeJs",  color: "#83CD29", Icon: NodeBadgeIcon },
  { id: "javaScript",  nameKey: "tech.javaScript", color:"000000", Icon: JavaScriptBrandIcon },
  { id: "typeScript",  nameKey: "tech.typeScript", color:"000000", Icon: TypeScriptBrandIcon },
];

function Chip({ tech }: { tech: Tech }) {
  const { t } = useTranslation();
  const { Icon, color, nameKey } = tech;

  return (
    <span
      role="listitem"
      className="
        inline-flex items-center gap-4 rounded-full px-5 h-15 mx-2
        border border-[var(--border)]
        bg-[--surface] text-[--text] font-medium
        shadow-soft transition-colors
        shrink-0
      "
    >
      <span className="grid place-items-center h-5 w-5" style={{ color }} aria-hidden>
        <Icon />
      </span>
      <span className="text-sm">{t(nameKey)}</span>
    </span>
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
        transition-colors
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
    <section id="techs" className="py-24 bg-surface text-body scroll-mt-20">
      <Container>
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto reveal">
          <H2>{t("techs.title")}</H2>
          <Lead className="mt-3">{t("techs.blurb")}</Lead>
        </div>
        {/* Carrusel / pasarela superior (usa animations.css) */}
        <div className="mt-7 overflow-hidden mask-edges reveal" aria-hidden="true">
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
export { Techs };
