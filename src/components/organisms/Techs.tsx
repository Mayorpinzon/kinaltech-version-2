// src/components/organisms/Techs.tsx
import { useTranslation } from "react-i18next";
import { Container, H2, Lead } from "../atoms";
import { useReveal } from "../../hooks/useReveal";
import { useState, useEffect, type ComponentType, type SVGProps } from "react";
import type { TranslationKey } from "../../i18n/types";
import {
  ReactIcon, NextIcon, VueIcon, RNIcon,
  FlutterIcon, MySQLIcon, GraphQLIcon, ReduxIcon, NodeBadgeIcon,
  JavaScriptBrandIcon, TypeScriptBrandIcon, AngularIcon, PythonIcon,
  HTML5Icon, CSS3Icon,
  GitIcon,
  GitHubIcon,
  JiraIcon,
  SlackIcon,
  BacklogIcon,
  NotionIcon,
  FigmaIcon,
  AdobeXDIcon,
  GatherIcon,
  MetalifeIcon,
  ZoomIcon,
  GoogleMeetsIcon,
  TeamsIcon,
  AsanaIcon,
} from "../atoms";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type Tech = {
  id: string;
  nameKey: TranslationKey;
  color: string;
  darkColor?: string;
  Icon: IconComponent;
};

const TECHS: Tech[] = [
  { id: "react", nameKey: "tech.react" as TranslationKey, color: "#61DAFB", Icon: ReactIcon },
  { id: "next", nameKey: "tech.next" as TranslationKey, color: "#FFFFFF", darkColor: "#000000", Icon: NextIcon },
  { id: "vue", nameKey: "tech.vue" as TranslationKey, color: "#42B883", Icon: VueIcon },
  { id: "rn", nameKey: "tech.rn" as TranslationKey, color: "#61DAFB", Icon: RNIcon },
  { id: "flutter", nameKey: "tech.flutter" as TranslationKey, color: "#55C0F9", Icon: FlutterIcon },
  { id: "mysql", nameKey: "tech.mysql" as TranslationKey, color: "#4479A1", Icon: MySQLIcon },
  { id: "graphql", nameKey: "tech.graphql" as TranslationKey, color: "#E535AB", Icon: GraphQLIcon },
  { id: "redux", nameKey: "tech.redux" as TranslationKey, color: "#764ABC", Icon: ReduxIcon },
  { id: "nodeJs", nameKey: "tech.nodeJs" as TranslationKey, color: "#83CD29", Icon: NodeBadgeIcon },
  { id: "javaScript", nameKey: "tech.javaScript" as TranslationKey, color: "#000000", darkColor: "#F7DF1E", Icon: JavaScriptBrandIcon },
  { id: "typeScript", nameKey: "tech.typeScript" as TranslationKey, color: "#000000", darkColor: "#3178C6", Icon: TypeScriptBrandIcon },
  { id: "python", nameKey: "tech.python" as TranslationKey, color: "#ffffff", darkColor: "#3776AB", Icon: PythonIcon },
  { id: "angular", nameKey: "tech.angular" as TranslationKey, color: "#ffffff", darkColor: "#DD0031", Icon: AngularIcon },
  { id: "html5", nameKey: "tech.html5" as TranslationKey, color: "#ffffff", darkColor: "#E34F26", Icon: HTML5Icon },
  { id: "css", nameKey: "tech.css" as TranslationKey, color: "#ffffff", darkColor: "#1572B6", Icon: CSS3Icon },
];

const EVERYDAY_TOOLS: Tech[] = [
  { id: "git", nameKey: "tools.git" as TranslationKey, color: "#F05032", Icon: GitIcon },
  { id: "github", nameKey: "tools.github" as TranslationKey, color: "#181717", darkColor: "#E5E7EB", Icon: GitHubIcon },
  { id: "jira", nameKey: "tools.jira" as TranslationKey, color: "#0052CC", Icon: JiraIcon },
  { id: "slack", nameKey: "tools.slack" as TranslationKey, color: "#4A154B", Icon: SlackIcon },
  { id: "backlog", nameKey: "tools.backlog" as TranslationKey, color: "#00A9E0", Icon: BacklogIcon },
  { id: "notion", nameKey: "tools.notion" as TranslationKey, color: "#000000", darkColor: "#E5E7EB", Icon: NotionIcon },
  { id: "figma", nameKey: "tools.figma" as TranslationKey, color: "#F24E1E", Icon: FigmaIcon },
  { id: "adobeXd", nameKey: "tools.adobeXd" as TranslationKey, color: "#FF61F6", Icon: AdobeXDIcon },
  { id: "gather", nameKey: "tools.gather" as TranslationKey, color: "#00A9E0", Icon: GatherIcon },
  { id: "metalife", nameKey: "tools.metalife" as TranslationKey, color: "#000000", darkColor: "#E5E7EB", Icon: MetalifeIcon },
  { id: "zoom", nameKey: "tools.zoom" as TranslationKey, color: "#2D8CFF", Icon: ZoomIcon },
  { id: "googleMeets", nameKey: "tools.googleMeets" as TranslationKey, color: "#00832D", Icon: GoogleMeetsIcon },
  { id: "teams", nameKey: "tools.teams" as TranslationKey, color: "#6264A7", Icon: TeamsIcon },
  { id: "asana", nameKey: "tools.asana" as TranslationKey, color: "#F06A6A", Icon: AsanaIcon },
];

function Chip({ tech }: { tech: Tech }) {
  const { t } = useTranslation();
  const { Icon, color, darkColor, nameKey } = tech;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark" ||
        document.body.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const iconColor = isDark && darkColor ? darkColor : color;

  return (
    <span
      role="listitem"
      className="
        inline-flex items-center gap-4 rounded-full px-5 h-15 mx-2
        border border-[var(--border)]
        bg-[--surface] text-[--text] font-medium
        transition-colors shrink-0"
    >
      <span className="grid place-items-center h-5 w-5" style={{ color: iconColor }} aria-hidden>
        <Icon />
      </span>
      <span className="text-sm">{t(nameKey)}</span>
    </span>
  );
}

function Card({ tech }: { tech: Tech }) {
  const { t } = useTranslation();
  const { Icon, color, darkColor, nameKey } = tech;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark" ||
        document.body.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const iconColor = isDark && darkColor ? darkColor : color;

  return (
    <article
      className="
        rounded-[16px] border border-[var(--border)] bg-card p-6 text-center
        shadow-soft hover:border-[var(--primary)] hover:shadow-md
        transition-colors glow-pulse
      "
    >
      <div className="mx-auto mb-2 grid h-8 w-10 place-items-center" style={{ color: iconColor }} aria-hidden>
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

        {/* Everyday Tools Section */}
        <div className="mt-16 text-center max-w-3xl mx-auto reveal">
          <H2 className="break-words hyphens-auto">{t("tools.title")}</H2>
        </div>
        {/* Everyday Tools Carousel */}
        <div className="mt-7 overflow-hidden mask-edges reveal" aria-label={t("tools.title")}>
          {/* Pista duplicada para loop continuo. Claves únicas con índice. */}
          <div className="inline-flex h-17 items-center gap-4 animate-slide">
            {[...EVERYDAY_TOOLS, ...EVERYDAY_TOOLS].map((tool, i) => (
              <Chip key={`${tool.id}-${i}`} tech={tool} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Techs;
