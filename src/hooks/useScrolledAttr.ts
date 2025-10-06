//src/hooks/useScrolledAttr.ts
import { useEffect } from "react";
export function useScrolledAttr(threshold = 4) {
    useEffect(() => {
        const onScroll = () => {
            const s = window.scrollY > threshold;
            const r = document.documentElement;
            if (s) r.setAttribute("data-scrolled", "true");
            else r.removeAttribute("data-scrolled");
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [threshold]);
}