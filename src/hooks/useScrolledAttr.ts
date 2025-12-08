//src/hooks/useScrolledAttr.ts
import { useEffect } from "react";
export function useScrolledAttr(threshold = 4) {
    useEffect(() => {
        const onScroll = () => {
            const s = window.scrollY > threshold;
            const r = document.documentElement;
            if (s) r.dataset.scrolled = "true";
            else delete r.dataset.scrolled;
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [threshold]);
}