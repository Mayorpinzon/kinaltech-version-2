// src/App.tsx
import "./i18n";
import { Home } from "./components/pages";
import { useScrolledAttr } from "./hooks/useScrolledAttr";

export default function App() {
  // Adds [data-scrolled] on body when header passes threshold (used for glass styling)
  useScrolledAttr();
  return <Home />; // Page already provides proper <main>/<section> landmarks
}
