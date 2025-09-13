import { useEffect, useRef } from "react";

interface Options {
  root: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Observes an <img> relative to a custom root (the viewport div),
 * and swaps data-src -> src when it intersects.
 */
export function useIntersectionLazyImg({ root, rootMargin = "200px 0px", threshold = 0.01 }: Options) {
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;
            const dataSrc = target.getAttribute("data-src");
            if (dataSrc && target.src !== dataSrc) {
              target.src = dataSrc;
            }
            obs.unobserve(target);
          }
        }
      },
      { root: root ?? undefined, rootMargin, threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [root, rootMargin, threshold]);

  const setLoadedOnLoad = () => { /* placeholder: hook consumer may track state */ };

  return { imgRef, setLoadedOnLoad } as const;
}