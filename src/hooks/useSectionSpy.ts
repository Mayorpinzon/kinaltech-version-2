// src/hooks/useSectionSpy.ts
import { useEffect, useState } from "react";

type Opts = {
  sectionIds?: string[];
  offsetTop?: number; 
};

export function useSectionSpy(opts: Opts = {}) {
  const { sectionIds, offsetTop = 80 } = opts;
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const sections = (sectionIds?.length
      ? sectionIds
      : Array.from(document.querySelectorAll<HTMLElement>("main > section[id]")).map(
          (s) => s.id
        )
    )
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    let ticking = false;

    const compute = () => {
      ticking = false;
      const y = window.scrollY + offsetTop + 1;
      let current: HTMLElement | null = null;

      for (const s of sections) {
        const top = s.offsetTop;
        if (top <= y) current = s;
        else break;
      }
      setActiveId(current?.id ?? sections[0].id);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    // inicial y suscripción
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionIds, offsetTop]);

  return activeId;
}
