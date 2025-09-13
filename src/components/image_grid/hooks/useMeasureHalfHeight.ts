import { useEffect, useState } from "react";

/** Observes the track element and returns half the total scrollHeight (one copy of content). */
export function useMeasureHalfHeight(trackRef: React.RefObject<HTMLDivElement>) {
  const [halfHeight, setHalfHeight] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      // track contains two copies; one copy is half the total
      const h = track.scrollHeight / 2;
      setHalfHeight(h || 0);
    };

    // Initial measurement after paint
    const raf = requestAnimationFrame(measure);

    // Keep up with size/content changes
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [trackRef]);

  return { halfHeight };
}