# KinalTech React App

This project is a **React 19 + Vite + TypeScript** application using **TailwindCSS v4** with an atomic design approach (atoms, molecules, organisms).  
It replicates a professional frontend template with animations, i18n support (English, Spanish, Japanese), theme toggle (light/dark), and responsive design.

---

## 🚀 Features

- ⚛️ React 19 + Vite
- 🌀 TailwindCSS v4 with custom tokens (`--primary`, `--accent`, `--surface`, etc.)
- 🌐 i18n (react-i18next) with English, Spanish, Japanese translations
- 🌙 Theme toggle (light/dark) with persistence
- 🎨 Atomic design system (atoms, molecules, organisms)
- ✨ Reveal animations and hover effects
- 📱 Responsive layout

---

## 📦 Requirements

Make sure you have installed:

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- npm, yarn, or pnpm (choose your preferred package manager)

---

## 🛠 Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd <your-repo-folder>
npm install
# or
yarn install
# or
pnpm install
```

---

## ▶️ Development

Run the development server with hot reload:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🏗 Build for Production

To create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🧹 Linting

Check code with ESLint:

```bash
npm run lint
```

---

## 📂 Project Structure

```
src/
 ├── atoms/        # Small reusable UI components (Button, Heading, etc.)
 ├── molecules/    # Compositions of atoms (Nav, ServiceCard, etc.)
 ├── organisms/    # Larger sections (Hero, Services, About, Contact, Footer)
 ├── templates/    # Page templates (HomeTemplate)
 ├── pages/        # Page-level components (Home)
 ├── hooks/        # Custom hooks (useReveal, useSectionSpy, etc.)
 ├── styles/       # Global styles (tokens.css, animations.css)
```

---

## 🌍 Internationalization (i18n)

- English, Spanish, Japanese translations included in `locales/` folder.  
- Use `LangSelect` component in the header to switch languages.

---

## 🌗 Theming

- Theme toggle managed by `ThemeToggle` atom.  
- Uses CSS custom properties with light/dark schemes.

---

## 🤝 Contributing

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m 'Add some feature'`)  
4. Push to the branch (`git push origin feature/YourFeature`)  
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## Procedure to run emulators:

- Edit .env.local:

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=kinaltech-dev
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_FUNCTIONS_BASE=http://127.0.0.1:5001/kinaltech-dev/us-central1

- The .env.local is ignored by Git. Only .env.example is versioned.
- Install the CLI (once) and select the right project locally.
npm i -g firebase-tools
firebase login
firebase use --add

- Prepare Cloud Functions (TypeScript):
- From the project root:
cd functions
npm install
npm run build         # compiles to functions/lib
cd ..

Tip: during development you can keep a watcher running:
cd functions && npm run watch

- Start emulators and the web app:
Open two terminals at the project root:

A) Firebase Functions Emulator:
firebase emulators:start --only functions
B) Vite dev server:
npm run dev

- Health check
Open in your browser:
http://127.0.0.1:5001/kinaltech-dev/us-central1/health

- Expected:

{ "ok": true, "service": "functions", "env": "emulator" }