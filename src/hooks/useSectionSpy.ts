// src/hooks/useSectionSpy.ts
import { useEffect, useState, useRef, useCallback } from "react";

type Opts = {
  sectionIds?: string[];
  offsetTop?: number;
};

// Throttle delay in milliseconds for scroll events
const SCROLL_THROTTLE_MS = 100;
const RESIZE_THROTTLE_MS = 250;

export function useSectionSpy(opts: Opts = {}) {
  const { sectionIds, offsetTop = 80 } = opts;
  const [activeId, setActiveId] = useState<string>("");

  // Use refs to store stable values across renders
  const sectionsRef = useRef<HTMLElement[]>([]);
  const lastActiveIdRef = useRef<string>("");
  const scrollTimeoutRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  // Memoize the compute function to avoid recreating it
  const compute = useCallback(() => {
    if (!sectionsRef.current.length) return;

    const y = window.scrollY + offsetTop + 1;
    let current: HTMLElement | null = null;

    // Find the section that's currently in view
    for (const s of sectionsRef.current) {
      const top = s.offsetTop;
      if (top <= y) {
        current = s;
      } else {
        break;
      }
    }

    const newActiveId = current?.id ?? sectionsRef.current[0]?.id ?? "";

    // Only update state if the active section actually changed
    if (newActiveId !== lastActiveIdRef.current) {
      lastActiveIdRef.current = newActiveId;
      setActiveId(newActiveId);
    }
  }, [offsetTop]);

  useEffect(() => {
    // Get sections once on mount/update
    const sections = (sectionIds?.length
      ? sectionIds
      : Array.from(document.querySelectorAll<HTMLElement>("main > section[id]")).map(
          (s) => s.id
        )
    )
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) {
      sectionsRef.current = [];
      return;
    }

    sectionsRef.current = sections;

    // Initial computation
    compute();

    // Throttled scroll handler
    const onScroll = () => {
      if (scrollTimeoutRef.current !== null) return;

      scrollTimeoutRef.current = globalThis.setTimeout(() => {
        compute();
        scrollTimeoutRef.current = null;
      }, SCROLL_THROTTLE_MS);
    };

    // Throttled resize handler
    const onResize = () => {
      if (resizeTimeoutRef.current !== null) return;

      resizeTimeoutRef.current = globalThis.setTimeout(() => {
        compute();
        resizeTimeoutRef.current = null;
      }, RESIZE_THROTTLE_MS);
    };

    // Add event listeners with passive flag for better scroll performance
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    globalThis.addEventListener("resize", onResize, { passive: true });

    // Cleanup function
    return () => {
      globalThis.removeEventListener("scroll", onScroll);
      globalThis.removeEventListener("resize", onResize);

      // Clear any pending timeouts
      if (scrollTimeoutRef.current !== null) {
        globalThis.clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
      if (resizeTimeoutRef.current !== null) {
        globalThis.clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
    };
  }, [sectionIds, compute]);

  return activeId;
}
