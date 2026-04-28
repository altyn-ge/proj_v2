import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { useMeasureHalfHeight } from "./useMeasureHalfHeight";
import { useTransformLoop } from "./useTransformLoop";
import { usePersistOffset } from "./usePersistOffset";

export type ResumeMode = "pause" | "continue";

export interface UseTransformScrollerOptions {
  viewportRef: MutableRefObject<HTMLDivElement | null>;
  speedPps?: number;
  persistKey?: string;
  persistThrottleMs?: number;
  resumeMode?: ResumeMode;
  layoutSignature?: string;
}

export function useTransformScroller({
  viewportRef,
  speedPps = 1000,
  persistKey,
  persistThrottleMs = 500,
  resumeMode = "continue",
  layoutSignature,
}: UseTransformScrollerOptions) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const { halfHeight } = useMeasureHalfHeight(trackRef);

  const {
    restoreIfNeeded,
    maybeSave,
    saveNow,
    normalizeIntoLoop,
  } = usePersistOffset({
    persistKey,
    throttleMs: persistThrottleMs,
    resumeMode,
    layoutSignature,
  });

  const { offsetRef, setOffset } = useTransformLoop({
    trackRef,
    speedPps,
    halfHeight,
    paused: isPaused,
    onFrame: () => {
      maybeSave(offsetRef.current, halfHeight);
    },
  });

  // Keyboard shortcut: Shift+S toggles pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key.toLowerCase() === "s" && e.shiftKey) {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Manual scroll via mouse wheel when paused
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setOffset(y => {
      let next = y - e.deltaY;
      if (halfHeight > 0) {
        while (next <= -halfHeight) next += halfHeight;
        while (next > 0) next -= halfHeight;
      }
      return next;
    });
  }, [halfHeight, setOffset]);

  useEffect(() => {
    if (!isPaused) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [isPaused, viewportRef, handleWheel]);

  useEffect(() => {
    if (!trackRef.current || halfHeight <= 0) return;
    restoreIfNeeded(halfHeight, setOffset);
    setOffset((y) => normalizeIntoLoop(y, halfHeight));
    saveNow(offsetRef.current, halfHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [halfHeight]);

  return { trackRef, isPaused };
}