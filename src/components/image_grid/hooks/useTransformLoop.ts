import { useCallback, useEffect, useRef } from "react";

interface UseTransformLoopOptions {
  trackRef: React.RefObject<HTMLDivElement>;
  speedPps: number;
  halfHeight: number;
  onFrame?: () => void; // called after transform applied
}

/** Core rAF loop: moves the track upward and snaps every halfHeight for a seamless loop. */
export function useTransformLoop({
  trackRef,
  speedPps,
  halfHeight,
  onFrame,
}: UseTransformLoopOptions) {
  const offsetRef = useRef(0); // negative while moving up
  const lastRef = useRef(performance.now());
  const rafRef = useRef<number | null>(null);

  const apply = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(0, ${offsetRef.current}px, 0)`;
  },[]);

  const setOffset = (v: number | ((y: number) => number)) => {
    offsetRef.current = typeof v === "function" ? (v as (y: number) => number)(offsetRef.current) : v;
    apply();
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tick = (now: number) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;

      if (halfHeight > 0) {
        offsetRef.current -= speedPps * dt;
        if (offsetRef.current <= -halfHeight) {
          offsetRef.current += halfHeight;
        }
        apply();
        onFrame?.();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [trackRef, speedPps, halfHeight, onFrame, apply]);

  return { offsetRef, setOffset };
}