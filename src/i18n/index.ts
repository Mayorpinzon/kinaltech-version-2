// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Header / Nav
      brand: { name: "KinalTech" },
      nav: {
        aria: "Primary navigation",
        home: "Home",
        services: "Services",
        techs: "Technologies",
        about: "About",
        contact: "Contact",
      },
      actions: {
        changeLanguage: "Change language",
        toggleTheme: "Toggle theme",
      },

      // Hero
      "hero.title": "Enhance your digital experience with expert frontend development",
      "hero.subtitle": "KinalTech is a team of independent frontend developers creating web and mobile experiences that elevate your digital products.",
      "hero.cta1": "Our Services",
      "hero.cta2": "Get In Touch",

      // Services
      "services.title": "Our Services",
      "services.lead": "We offer comprehensive frontend development solutions tailored to your business needs",
      "services.items.web.title": "Web Development",
      "services.items.web.text":
        "Responsive, accessible websites with React/Next/Vue.",
      "services.items.mobile.title": "Mobile Apps",
      "services.items.mobile.text":
        "Cross-platform with React Native and Flutter.",
      "services.items.ui.title": "UI/UX Implementation",
      "services.items.ui.text":
        "From design to production with robust design systems.",
      "services.items.ia.title": "AI Integration",
      "services.items.ia.text": "We implement AI models to streamline processes and deliver more intuitive user experiences.",
      "services.items.phi.title": "Agile Workflows",
      "services.items.phi.text": "We embrace methodologies such as Agile and Scrum to adapt to each project and enhance collaboration.",


      // Techs
      "techs.title": "Technologies We Work With",
      "techs.blurb": "A modern stack that powers our solutions",
      "tech.react": "React.js",
      "tech.next": "Next.js",
      "tech.vue": "Vue.js",
      "tech.rn": "React Native",
      "tech.flutter": "Flutter",
      "tech.mysql": "MySQL",
      "tech.graphql": "GraphQL",
      "tech.redux": "Redux",
      "tech.nodeJs": "NodeJS",
      "tech.javaScript": "JavaScript",
      "tech.typeScript": "TypeScript",
      "tech.python": "Python",
      "tech.angular": "Angular.js",

      // About
      "about.title": "About KinalTech",
      "about.p1":
        "KinalTech blends precision with imagination. We’re a frontend team that turns ideas into efficient, scalable, high-performance products.",
      "about.p2":
        "Details matter—architecture, accessibility, micro-interactions. We partner with startups and mid-market teams, matching their pace and outcomes.",
      "about.p3":
        "Beyond code, we craft experiences that run in harmony—clear, dependable, and built to keep evolving.",
      "about.cta": "Start Your Project",

      // Contact
      "contact.title": "Get In Touch",
      "contact.blurb":
        "Ready to start? Reach out for a quick consultation",

      // Form
      "form.name": "Full Name",
      "form.email": "Email",
      "form.subject": "Subject",
      "form.message": "Message",
      "form.send": "Send",

      // Footer
      "footer.rights": "All rights reserved.",
    },
  },

  es: {
    translation: {
      // Header / Nav
      brand: { name: "KinalTech" },
      nav: {
        aria: "Navegación principal",
        home: "Inicio",
        services: "Servicios",
        techs: "Tecnologías",
        about: "Nosotros",
        contact: "Contacto",
      },
      actions: {
        changeLanguage: "Cambiar idioma",
        toggleTheme: "Alternar tema",
      },

      // Hero
      "hero.title":
        "Potencia tu experiencia digital con desarrollo frontend experto",
      "hero.subtitle":
        "KinalTech es un equipo de desarrolladores frontend independientes que crea experiencias web y móviles para impulsar tus productos digitales.",
      "hero.cta1": "Nuestros Servicios",
      "hero.cta2": "Contáctanos",

      // Services
      "services.title": "Nuestros Servicios",
      "services.lead": "Ofrecemos soluciones integrales de frontend adaptadas a las necesidades de tu negocio",
      "services.items.web.title": "Desarrollo Web",
      "services.items.web.text":
        "Sitios responsivos y accesibles con React/Next/Vue.",
      "services.items.mobile.title": "Apps Móviles",
      "services.items.mobile.text":
        "Multiplataforma con React Native y Flutter.",
      "services.items.ui.title": "Implementación UI/UX",
      "services.items.ui.text":
        "Del diseño a producción con design systems robustos.",
      "services.items.ia.title": "Integración de IA",
      "services.items.ia.text": "Aplicamos modelos de inteligencia artificial para optimizar procesos y ofrecer experiencias más intuitivas.",
      "services.items.phi.title": "Filosofías de trabajo ágiles",
      "services.items.phi.text": "Adoptamos metodologías como Agile y Scrum para adaptarnos a cada proyecto y mejorar la colaboración.",



      // Techs
      "techs.title": "Tecnologías que usamos",
      "techs.blurb": "Stack moderno que impulsa nuestras soluciones",
      "tech.react": "React.js",
      "tech.next": "Next.js",
      "tech.vue": "Vue.js",
      "tech.rn": "React Native",
      "tech.flutter": "Flutter",
      "tech.mysql": "MySQL",
      "tech.graphql": "GraphQL",
      "tech.redux": "Redux",
      "tech.nodeJs": "NodeJS",
      "tech.javaScript": "JavaScript",
      "tech.typeScript": "TypeScript",
      "tech.python": "Python",
      "tech.angular": "Angular.js",

      // About
      "about.title": "Sobre KinalTech",
      "about.p1":
        "En KinalTech creemos que la precisión y la creatividad pueden convivir. Somos un equipo de desarrolladores frontend comprometidos con crear soluciones eficientes, escalables y de alto rendimiento que transforman la manera en que las personas interactúan con la tecnología.",
      "about.p2":
        "Nos apasiona el detalle: cada línea de código, cada animación y cada decisión visual cuentan. Trabajamos junto a startups, empresas medianas y proyectos en crecimiento, adaptando nuestras soluciones a sus metas y ritmo.",
      "about.p3":
        "Más que escribir código, construimos experiencias digitales que funcionan con la misma armonía que un sistema bien diseñado: claras, estables y en constante evolución.",
      "about.cta": "Inicia tu proyecto",
      // Contact
      "contact.title": "Contacto",
      "contact.blurb":
        "¿Listo para empezar? Escríbenos para una consulta rápida",

      // Form
      "form.name": "Nombre",
      "form.email": "Correo",
      "form.subject": "Asunto",
      "form.message": "Mensaje",
      "form.send": "Enviar",

      // Footer
      "footer.rights": "Todos los derechos reservados.",
    },
  },

  ja: {
    translation: {
      // Header / Nav
      brand: { name: "KinalTech" },
      nav: {
        aria: "メインナビゲーション",
        home: "ホーム",
        services: "サービス",
        techs: "技術",
        about: "私たちについて",
        contact: "お問い合わせ",
      },
      actions: {
        changeLanguage: "言語を変更",
        toggleTheme: "テーマを切替",
      },

      // Hero
      "hero.title": "熟練したフロントエンド開発でデジタル体験を向上",
      "hero.subtitle": "KinalTechは、独立したフロントエンド開発者チームとして、Webやモバイルであなたのデジタル製品を引き立てる体験を創り出します。",
      "hero.cta1": "サービスを見る",
      "hero.cta2": "お問い合わせ",

      // Services
      "services.title": "提供サービス",
      "services.lead": "ビジネスに最適化したフロントエンド開発を提供",
      "services.items.web.title": "Web 開発",
      "services.items.web.text":
        "React/Next/Vue によるレスポンシブでアクセシブルなサイト。",
      "services.items.mobile.title": "モバイルアプリ",
      "services.items.mobile.text":
        "React Native / Flutter によるクロスプラットフォーム。",
      "services.items.ui.title": "UI/UX 実装",
      "services.items.ui.text":
        "デザインを実装しデザインシステムで運用。",
      "services.items.ia.title": "AI統合",
      "services.items.ia.text": "人工知能モデルを導入し、業務プロセスを最適化して、より直感的なユーザー体験を実現します。",
      "services.items.phi.title": "アジャイル型ワークフロー",
      "services.items.phi.text": "AgileやScrumなどの手法を採用し、各プロジェクトに柔軟に対応しながらチームの連携を高めます。",



      // Techs
      "techs.title": "対応技術",
      "techs.blurb": "私たちの開発を支えるモダンなスタック",
      "tech.react": "React.js",
      "tech.next": "Next.js",
      "tech.vue": "Vue.js",
      "tech.rn": "React Native",
      "tech.flutter": "Flutter",
      "tech.mysql": "MySQL",
      "tech.graphql": "GraphQL",
      "tech.redux": "Redux",
      "tech.nodeJs": "NodeJS",
      "tech.javaScript": "JavaScript",
      "tech.typeScript": "TypeScript",
      "tech.python": "Python",
      "tech.angular": "Angular.js",

      // About
      "about.title": "KinalTech について",
      "about.p1":
        "KinalTech は精度と創造性が共存できると信じています。私たちは効率的でスケーラブル、かつ高性能なソリューションを提供し、人々がテクノロジーと関わる方法を変えることを目指すフロントエンド開発チームです。",
      "about.p2":
        "細部へのこだわりが私たちの原動力です。コードの一行、アニメーション、デザインの決定、そのすべてに意味があります。スタートアップや中規模企業、成長中のプロジェクトと協力し、それぞれの目標とリズムに合わせて最適化します。",
      "about.p3":
        "単なるコード以上のものを作ります。明快で安定し、常に進化し続けるデジタル体験——それが私たちの目指す形です。",
      "about.cta": "プロジェクトを始める",

      // Contact
      "contact.title": "お問い合わせ",
      "contact.blurb": "まずはお気軽にご相談ください",

      // Form
      "form.name": "お名前",
      "form.email": "メール",
      "form.subject": "件名",
      "form.message": "メッセージ",
      "form.send": "送信",

      // Footer
      "footer.rights": "無断転載を禁じます。",
    },
  },
} as const;

// Idioma inicial: localStorage > navegador
const storedLng =
  typeof window !== "undefined" ? localStorage.getItem("lng") : null;
const browserLng =
  typeof navigator !== "undefined" ? navigator.language : "en";
const initialLng = storedLng
  ? storedLng
  : browserLng.startsWith("es")
    ? "es"
    : browserLng.startsWith("ja")
      ? "ja"
      : "en";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: initialLng,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  });
};
// Setear idioma inicial en <html lang="...">
try { document.documentElement.lang = initialLng; } catch { }

/** Persist language + set <html lang="..."> **/
i18n.on("languageChanged", (lng) => {
  try { localStorage.setItem("lng", lng); } catch { }
  document.documentElement.lang = lng;
});

export default i18n;
