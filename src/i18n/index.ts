// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "./i18next.d.ts"; // Load type augmentations

export const resources = {
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
        open: "Open menu",
        close: "Close menu",
      },
      actions: {
        changeLanguage: "Change language",
        toggleTheme: "Toggle theme",
      },

      // Language selection
      lang: {
        es: "Español",
        en: "English",
        ja: "日本語",
        select: "Select language",
      },

      // Theme
      theme: {
        light: "Switch to light theme",
        dark: "Switch to dark theme",
      },

      // Hero
      "hero.title": "Enhance your digital experience with expert frontend development",
      "hero.subtitle": "KinalTech is a team of independent frontend developers creating web and mobile experiences that elevate your digital products.",
      "hero.cta1": "Our Services",
      "hero.cta2": "Get In Touch",
      "hero.cta1_aria": "Navigate to services section",
      "hero.cta2_aria": "Navigate to contact section",
      "hero.imageAlt": "KinalTech team working on digital solutions",

      // Services
      "services.title": "Our Services",
      "services.lead": "We offer comprehensive frontend development solutions tailored to your business needs:",
      "services.blurb": "We offer comprehensive frontend development solutions tailored to your business needs:",
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
      "tech.html5": "HTML5",
      "tech.css": "CSS3",

      // About
      "about.sectionTitle": "About us",
      "about.sectionLead": "Discover who we are and the passionate team driving KinalTech forward.",
      "about.title": "About KinalTech",
      "about.p1":
        "KinalTech blends precision with imagination. We’re a frontend team that turns ideas into efficient, scalable, high-performance products.",
      "about.p2":
        "Details matter—architecture, accessibility, micro-interactions. We partner with startups and mid-market teams, matching their pace and outcomes.",
      "about.p3":
        "Beyond code, we craft experiences that run in harmony—clear, dependable, and built to keep evolving.",
      "about.cta": "Start Your Project",
      "about.cta_aria": "Start your project with KinalTech",
      "about.imageCaption": "",
      "about.imageAlt": "KinalTech team members",
      "about.team.title": "Our team:",
      "about.team.lead": "Meet the developers behind KinalTech and the minds that bring each project to life.",
      "about.team.dev1.name": "Gabriel",
      "about.team.dev2.name": "Mario Alberto",
      "about.team.dev1.role": "AI/Frontend developer..",
      "about.team.dev2.role": "Frontend developer.",
      "about.team.dev1.bio": "Machine learning specialist with several years of experience leading technical initiatives and managing development teams. Oversees a team of developers, implementing efficient pipelines, strong version-control practices, and collaborative workflows. His approach combines technical vision, solid organization, and an excellent ability to identify issues and propose effective solutions.",
      "about.team.dev2.bio": "Self-taught developer with experience in frontend web development. Focused on creating clear, accessible, and efficient user interfaces. His background in business allows him to better understand client needs and transform them into result-driven digital solutions.",

      // Contact
      "contact.title": "Contact",
      "contact.blurb": "Ready to elevate your business? Reach out for a quick, no-obligation consultation.",
      "contact.email.label": "Write to us",
      "contact.email.value": "Please use the form to get in touch — we’ll reply shortly.",
      "contact.location.label": "Location",
      "contact.location.value": "Kyoto, Japan",
      "contact.hours.label": "Business hours",
      "contact.hours.value": "Monday – Friday: 10AM – 7PM",

      // Form
      "form": {
        "send": "Send",
        "sending": "Sending…",
        "name": "Full Name",
        "email": "Email",
        "subject": "Subject",
        "message": "Message",
        "placeholder": {
          "name": "Your name",
          "email": "Your email",
          "subject": "Subject",
          "message": "Your message"
        },
        "error": {
          "name_full": "Please enter your full name.",
          "name_max": "Max 30 characters.",
          "email_invalid": "Please enter a valid email.",
          "subject_short": "Subject is too short.",
          "subject_max": "Max 160 characters.",
          "message_short": "Message should be at least 10 characters.",
          "message_max": "Max 300 characters.",
          "too_fast": "Please take a moment to complete the form.",
          "fix_fields": "Please fix the highlighted fields.",
          "server": "Server error. Please try again.",
          "network": "Network error. Please try again.",
          "captcha": "Captcha verification failed."
        },
        "success": "Thanks! We’ll get back to you shortly."
      },
      // Footer
      "footer.rights": "All rights reserved.",
      "footer.aria": "Site footer",
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
        open: "Abrir menú",
        close: "Cerrar menú",
      },
      actions: {
        changeLanguage: "Cambiar idioma",
        toggleTheme: "Alternar tema",
      },

      // Language selection
      lang: {
        es: "Español",
        en: "English",
        ja: "日本語",
        select: "Seleccionar idioma",
      },

      // Theme
      theme: {
        light: "Cambiar a tema claro",
        dark: "Cambiar a tema oscuro",
      },

      // Hero
      "hero.title":
        "Potencia tu experiencia digital con desarrollo frontend experto",
      "hero.subtitle":
        "KinalTech es un equipo de desarrolladores frontend independientes que crea experiencias web y móviles para impulsar tus productos digitales.",
      "hero.cta1": "Nuestros Servicios",
      "hero.cta2": "Contáctanos",
      "hero.cta1_aria": "Ir a la sección de servicios",
      "hero.cta2_aria": "Ir a la sección de contacto",
      "hero.imageAlt": "Equipo de KinalTech trabajando en soluciones digitales",

      // Services
      "services.title": "Nuestros Servicios",
      "services.lead": "Ofrecemos soluciones integrales de frontend adaptadas a las necesidades de tu negocio:",
      "services.blurb": "Ofrecemos soluciones integrales de frontend adaptadas a las necesidades de tu negocio:",
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
      "tech.html5": "HTML5",
      "tech.css": "CSS3",


      // About
      "about.sectionTitle": "Sobre nosotros",
      "about.sectionLead": "Descubre quiénes somos y el equipo apasionado que impulsa KinalTech.",
      "about.title": "Sobre KinalTech",
      "about.p1":
        "En KinalTech creemos que la precisión y la creatividad pueden convivir. Somos un equipo de desarrolladores frontend comprometidos con crear soluciones eficientes, escalables y de alto rendimiento que transforman la manera en que las personas interactúan con la tecnología.",
      "about.p2":
        "Nos apasiona el detalle: cada línea de código, cada animación y cada decisión visual cuentan. Trabajamos junto a startups, empresas medianas y proyectos en crecimiento, adaptando nuestras soluciones a sus metas y ritmo.",
      "about.p3":
        "Más que escribir código, construimos experiencias digitales que funcionan con la misma armonía que un sistema bien diseñado: claras, estables y en constante evolución.",
      "about.cta": "Inicia tu proyecto",
      "about.cta_aria": "Inicia tu proyecto con KinalTech",
      "about.imageCaption": "",
      "about.imageAlt": "Miembros del equipo de KinalTech",
      "about.team.title": "Nuestro equipo:",
      "about.team.lead": "Conoce a los desarrolladores detrás de KinalTech y a las mentes que dan vida a cada proyecto.",
      "about.team.dev1.name": "Gabriel",
      "about.team.dev2.name": "Mario Alberto",
      "about.team.dev1.role": "Desarrollador de IA y Frontend.",
      "about.team.dev2.role": "Desarrollador Frontend.",
      "about.team.dev1.bio": "Especialista en machine learning con varios años liderando iniciativas técnicas y gestionando equipos de desarrollo. Dirige un equipo de developers, implementando pipelines eficientes, buenas prácticas de control de versiones y flujos colaborativos. Su enfoque combina visión técnica, organización y una excelente capacidad para identificar errores y proponer soluciones.",
      "about.team.dev2.bio": "Desarrollador autodidacta con experiencia en desarrollo web frontend. Enfocado en crear interfaces claras, accesibles y eficientes. Su formación en negocios le permite comprender mejor las necesidades del cliente y transformarlas en soluciones digitales orientadas a resultados.",

      // Contact
      "contact.title": "Contacto",
      "contact.blurb": "¿Listo para impulsar tu negocio? Escríbenos para una consulta rápida, sin compromiso. ",
      "contact.email.label": "Escríbenos",
      "contact.email.value": "Por favor usa el formulario para contactarnos.\nEn breve te responderemos.",
      "contact.location.label": "Ubicación",
      "contact.location.value": "Kyoto, Japon",
      "contact.hours.label": "Horario",
      "contact.hours.value": "Lunes – Viernes: 10AM – 7PM ",

      // Form
      "form": {
        "send": "Enviar",
        "sending": "Enviando…",
        "name": "Nombre",
        "email": "Correo",
        "subject": "Asunto",
        "message": "Mensaje",
        "placeholder": {
          "name": "Tu nombre",
          "email": "Tu correo electrónico",
          "subject": "Asunto",
          "message": "Tu mensaje"
        },
        "error": {
          "name_full": "Por favor, escribe tu nombre completo.",
          "name_max": "Máximo 30 caracteres.",
          "email_invalid": "Por favor, introduce un correo válido.",
          "subject_short": "El asunto es demasiado corto.",
          "subject_max": "Máximo 160 caracteres.",
          "message_short": "El mensaje debe tener al menos 10 caracteres.",
          "message_max": "Máximo 300 caracteres.",
          "too_fast": "Tómate un momento para completar el formulario.",
          "fix_fields": "Por favor corrige los campos marcados.",
          "server": "Error del servidor. Intenta nuevamente.",
          "network": "Error de red. Verifica tu conexión.",
          "captcha": "Error al verificar el captcha."
        },
        "success": "¡Gracias! Te responderemos pronto."
      },
      // Footer
      "footer.rights": "Todos los derechos reservados.",
      "footer.aria": "Pie de página del sitio",
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

      // Language selection
      lang: {
        es: "Español",
        en: "English",
        ja: "日本語",
        select: "言語を選択",
      },

      // Theme
      theme: {
        light: "ライトテーマに切り替え",
        dark: "ダークテーマに切り替え",
      },

      // Hero
      "hero.title": "熟練したフロントエンド開発でデジタル体験を向上",
      "hero.subtitle": "KinalTechは、独立したフロントエンド開発者チームとして、Webやモバイルであなたのデジタル製品を引き立てる体験を創り出します。",
      "hero.cta1": "サービスを見る",
      "hero.cta2": "お問い合わせ",
      "hero.cta1_aria": "サービスセクションへ移動",
      "hero.cta2_aria": "お問い合わせセクションへ移動",
      "hero.imageAlt": "デジタルソリューションに取り組むKinalTechチーム",

      // Services
      "services.title": "提供サービス",
      "services.lead": "ビジネスに最適化したフロントエンド開発を提供",
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
      "tech.html5": "HTML5",
      "tech.css": "CSS3",

      // About
      "about.sectionTitle": "私たちについて",
      "about.sectionLead": "KinalTech を支える開発者たちと、各プロジェクトに命を吹き込むメンバーをご紹介します。",
      "about.title": "KinalTech について",
      "about.p1":
        "KinalTech は精度と創造性が共存できると信じています。私たちは効率的でスケーラブル、かつ高性能なソリューションを提供し、人々がテクノロジーと関わる方法を変えることを目指すフロントエンド開発チームです。",
      "about.p2":
        "細部へのこだわりが私たちの原動力です。コードの一行、アニメーション、デザインの決定、そのすべてに意味があります。スタートアップや中規模企業、成長中のプロジェクトと協力し、それぞれの目標とリズムに合わせて最適化します。",
      "about.p3":
        "単なるコード以上のものを作ります。明快で安定し、常に進化し続けるデジタル体験——それが私たちの目指す形です。",
      "about.cta": "プロジェクトを始める",
      "about.cta_aria": "KinalTechでプロジェクトを始める",
      "about.imageCaption": "",
      "about.imageAlt": "KinalTechチームメンバー",
      "about.team.title": "私たちのチーム:",
      "about.team.lead": "KinalTech を支える開発者たちと、各プロジェクトに命を吹き込むメンバーをご紹介します。",
      "about.team.dev1.name": "ガブリエル",
      "about.team.dev2.name": "マリオ アルベルト",
      "about.team.dev1.role": "AI／フロントエンド開発者。",
      "about.team.dev2.role": "フロントエンド開発者。",
      "about.team.dev1.bio": "機械学習のスペシャリストとして、複数年にわたり技術的な取り組みをリードし、開発チームをマネジメントしてきたエンジニア。開発者チームを指揮し、効率的なパイプライン、適切なバージョン管理、そして協調的なワークフローを構築・運用している。技術的な視点と組織力に加え、問題を的確に見極めて効果的な解決策を提案する優れた能力を持つ。",
      "about.team.dev2.bio": "独学でスキルを身につけ、フロントエンドWeb開発の経験を持つ開発者。分かりやすく、アクセシブルで、効率的なインターフェースの構築に注力している。ビジネス分野での知識を活かし、クライアントのニーズを深く理解し、それを成果につながるデジタルソリューションへと結び付けている。",

      // Contact
      "contact.title": "お問い合わせ",
      "contact.blurb": "ビジネスをさらに成長させませんか？お気軽にご相談ください。",
      "contact.email.label": "メールでのお問い合わせ",
      "contact.email.value": "フォームからご連絡ください。折り返しこちらからご返信いたします。",
      "contact.location.label": "所在地",
      "contact.location.value": "日本・京都",
      "contact.hours.label": "営業時間",
      "contact.hours.value": "月曜～金曜：10時〜19時",


      // Form
      "form": {
        "send": "送信",
        "sending": "送信中…",
        "name": "お名前",
        "email": "メール",
        "subject": "件名",
        "message": "メッセージ",
        "placeholder": {
          "name": "お名前",
          "email": "メールアドレス",
          "subject": "件名",
          "message": "メッセージ"
        },
        "error": {
          "name_full": "氏名を正しく入力してください。",
          "name_max": "30文字以内で入力してください。",
          "email_invalid": "有効なメールアドレスを入力してください。",
          "subject_short": "件名が短すぎます。",
          "subject_max": "160文字以内で入力してください。",
          "message_short": "メッセージは10文字以上入力してください。",
          "message_max": "300文字以内で入力してください。",
          "too_fast": "少し時間をかけてフォームを記入してください。",
          "fix_fields": "赤い項目を修正してください。",
          "server": "サーバーエラーが発生しました。もう一度お試しください。",
          "network": "ネットワークエラーが発生しました。接続を確認してください。",
          "captcha": "認証に失敗しました。"
        },
        "success": "ありがとうございます。追ってご連絡いたします。"
      },

      // Footer
      "footer.rights": "無断転載を禁じます。",
      "footer.aria": "サイトフッター",
    },
  },
} as const;

// Initial language: localStorage > browser language > default (en)
const storedLng =
  typeof globalThis.window !== "undefined" ? localStorage.getItem("lng") : null;
const browserLng =
  typeof navigator !== "undefined" ? navigator.language : "en";
const getInitialLanguage = (stored: string | null, browser: string): string => {
  if (stored === null) {
    if (browser.startsWith("es")) return "es";
    if (browser.startsWith("ja")) return "ja";
    return "en";
  }
  return stored;
};

const initialLng = getInitialLanguage(storedLng, browserLng);

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: initialLng,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  });
};
try { 
  document.documentElement.lang = initialLng; 
} catch {
  // Ignore error if document is not available
}

/** Persist language + set <html lang="..."> **/
i18n.on("languageChanged", (lng) => {
  try { 
    localStorage.setItem("lng", lng); 
  } catch {
    // Ignore error if localStorage is not available
  }
  document.documentElement.lang = lng;
});

export default i18n;
