// src/hooks/useTheme.ts
import { useState, useEffect } from "react";

/**
 * Shared hook for theme detection to avoid duplicate MutationObservers
 * Returns true if dark theme is active, false otherwise
 */
export function useTheme(): boolean {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return (
      document.documentElement.dataset.theme === "dark" ||
      document.body.classList.contains("dark")
    );
  });

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode =
        document.documentElement.dataset.theme === "dark" ||
        document.body.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    // Initial check
    checkTheme();

    // Observe changes to data-theme attribute and body class
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

