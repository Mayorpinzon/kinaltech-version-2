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
      "hero.title":
        "Transform Your Digital Experience with Expert Frontend Development",
      "hero.subtitle":
        "KinalTech is a team of independent frontend developers delivering high-impact web and mobile experiences.",
      "hero.cta1": "Our Services",
      "hero.cta2": "Get In Touch",

      // Services
      "services.title": "Our Services",
      "services.blurb":
        "Comprehensive frontend development solutions tailored to your business needs",
      "services.items.web.title": "Web Development",
      "services.items.web.text":
        "Responsive, accessible websites with React/Next/Vue.",
      "services.items.mobile.title": "Mobile Apps",
      "services.items.mobile.text":
        "Cross-platform with React Native and Flutter.",
      "services.items.ui.title": "UI/UX Implementation",
      "services.items.ui.text":
        "From design to production with robust design systems.",
      "services.lead": "We offer comprehensive frontend development solutions tailored to your business needs",

      // Techs
      "tech.title": "Technologies We Work With",
      "tech.blurb": "A modern stack that powers our solutions",

      // About
      "about.title": "About KinalTech",
      "about.p1":
        "We craft exceptional digital experiences as an independent frontend team.",
      "about.p2":
        "We blend technical excellence with strategic thinking to drive outcomes.",
      "about.p3":
        "We specialize in modern frontend technologies for performance and maintainability.",
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
        "Transforma tu experiencia digital con desarrollo frontend experto",
      "hero.subtitle":
        "KinalTech es un equipo de desarrolladores frontend independientes que crea experiencias web y móviles de alto impacto.",
      "hero.cta1": "Nuestros Servicios",
      "hero.cta2": "Contáctanos",

      // Services
      "services.title": "Nuestros Servicios",
      "services.blurb":
        "Soluciones integrales de frontend adaptadas a las necesidades de tu negocio",
      "services.items.web.title": "Desarrollo Web",
      "services.items.web.text":
        "Sitios responsivos y accesibles con React/Next/Vue.",
      "services.items.mobile.title": "Apps Móviles",
      "services.items.mobile.text":
        "Multiplataforma con React Native y Flutter.",
      "services.items.ui.title": "Implementación UI/UX",
      "services.items.ui.text":
        "Del diseño a producción con design systems robustos.",
      "services.lead": "Ofrecemos soluciones integrales de frontend adaptadas a las necesidades de tu negocio",
             

      // Techs
      "tech.title": "Tecnologías que usamos",
      "tech.blurb": "Stack moderno que impulsa nuestras soluciones",

      // About
      "about.title": "Sobre KinalTech",
      "about.p1":
        "Creamos experiencias digitales sobresalientes como equipo frontend independiente.",
      "about.p2":
        "Combinamos excelencia técnica con estrategia para resultados de negocio.",
      "about.p3":
        "Especialistas en tecnologías modernas para rendimiento y mantenibilidad.",
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
      "hero.title": "熟練のフロントエンド開発でデジタル体験を変革",
      "hero.subtitle":
        "KinalTech は独立系フロントエンド開発者のチームです。高品質な Web / モバイル体験を提供します。",
      "hero.cta1": "サービスを見る",
      "hero.cta2": "お問い合わせ",

      // Services
      "services.title": "提供サービス",
      "services.blurb": "ビジネスに最適化したフロントエンド開発を提供",
      "services.items.web.title": "Web 開発",
      "services.items.web.text":
        "React/Next/Vue によるレスポンシブでアクセシブルなサイト。",
      "services.items.mobile.title": "モバイルアプリ",
      "services.items.mobile.text":
        "React Native / Flutter によるクロスプラットフォーム。",
      "services.items.ui.title": "UI/UX 実装",
      "services.items.ui.text":
        "デザインを実装しデザインシステムで運用。",
      "services.lead": "ビジネスに最適化したフロントエンド開発を提供",

      // Techs
      "tech.title": "対応技術",
      "tech.blurb": "私たちの開発を支えるモダンなスタック",

      // About
      "about.title": "KinalTech について",
      "about.p1":
        "独立系フロントエンドチームとして優れたデジタル体験を創出します。",
      "about.p2": "技術と戦略を両立しビジネス成果を実現。",
      "about.p3":
        "最新技術で高性能・保守性を備えた実装を提供します。",
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
}

export default i18n;
