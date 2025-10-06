// src/App.tsx
// src/App.tsx
import "./i18n";
import Home from "./components/pages/Home";
import { useScrolledAttr } from "./hooks/useScrolledAttr";

export default function App() {
  useScrolledAttr(); 
  return <Home />;
}
