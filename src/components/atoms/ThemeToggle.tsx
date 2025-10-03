//src/components/atoms/ThemeToggle.tsx
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const stored = (localStorage.getItem("kinalTheme") as "light" | "dark" | null);
    const initial = stored ?? (prefersDark ? "dark" : "light");
    document.body.classList.toggle("dark", initial === "dark");
    setMode(initial);
  }, []);

  const toggle = () => {
    const next = mode === "dark" ? "light" : "dark";
    document.body.classList.toggle("dark", next === "dark");
    localStorage.setItem("kinalTheme", next);
    setMode(next);
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="rounded-app px-3 py-2 bg-card text-body shadow-soft trans-app hover:opacity-90 focus:outline-none focus:ring-4 ring-primary"
    >
      {mode === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
