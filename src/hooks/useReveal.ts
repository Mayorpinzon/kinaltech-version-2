// src/hooks/useReveal.ts
import { useEffect, useRef } from "react";

 // Default selector for reveal elements
const DEFAULT_SELECTOR = ".reveal";
const REVEAL_THRESHOLD = 0.1;

export function useReveal(selector: string = DEFAULT_SELECTOR) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElementsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    // Cleanup previous observer if selector changed
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
      observedElementsRef.current.clear();
    }

    // Query elements once
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!els.length) return;

    // Filter out elements that are already revealed to prevent redundant work
    const elementsToObserve = els.filter((el) => !el.classList.contains("show"));

    if (!elementsToObserve.length) return;

    // Create IntersectionObserver with optimized options
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;

            // Add show class to trigger animation
            target.classList.add("show");

            // Stop observing this element (one-time reveal)
            io.unobserve(target);
            observedElementsRef.current.delete(target);
          }
        });
      },
      {
        threshold: REVEAL_THRESHOLD,
        // Use rootMargin for better performance on mobile
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observerRef.current = io;

    // Capture the current set reference for cleanup
    const currentObservedSet = observedElementsRef.current;

    // Observe all elements that need revealing
    elementsToObserve.forEach((el) => {
      io.observe(el);
      currentObservedSet.add(el);
    });

    // Cleanup function (runs on unmount or selector change)
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      // Use the captured set reference instead of the ref's current value
      currentObservedSet.clear();
    };
  }, [selector]);
}
