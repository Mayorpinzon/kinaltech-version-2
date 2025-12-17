//src/hooks/useScrolledAttr.ts
import { useEffect, useRef } from "react";

const SCROLL_THROTTLE_MS = 16; // ~60fps

export function useScrolledAttr(threshold = 4) {
  const timeoutRef = useRef<number | null>(null);
  const lastValueRef = useRef<boolean | null>(null);

  useEffect(() => {
    const updateScrolled = (scrolled: boolean) => {
      const r = document.documentElement;
      if (scrolled) {
        r.dataset.scrolled = "true";
      } else {
        delete r.dataset.scrolled;
      }
      lastValueRef.current = scrolled;
    };

    const onScroll = () => {
      if (timeoutRef.current !== null) return;

      timeoutRef.current = globalThis.setTimeout(() => {
        const s = window.scrollY > threshold;
        // Only update if value changed to avoid unnecessary DOM mutations
        if (lastValueRef.current !== s) {
          updateScrolled(s);
        }
        timeoutRef.current = null;
      }, SCROLL_THROTTLE_MS);
    };

    // Initial check
    const initialScrolled = window.scrollY > threshold;
    updateScrolled(initialScrolled);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutRef.current !== null) {
        globalThis.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [threshold]);
}