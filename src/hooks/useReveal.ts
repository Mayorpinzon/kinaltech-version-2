// src/hooks/useReveal.ts
import { useEffect } from "react";

export function useReveal(selector = ".reveal") {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target); // una sola vez
        }
      });
    }, { threshold: 0.1 });

    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [selector]);
}
