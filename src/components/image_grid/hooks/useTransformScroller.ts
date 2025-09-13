import { MutableRefObject, useEffect, useRef } from "react";
import { useMeasureHalfHeight } from "./useMeasureHalfHeight";
import { useTransformLoop } from "./useTransformLoop";
import { usePersistOffset } from "./usePersistOffset";

export type ResumeMode = "pause" | "continue";

export interface UseTransformScrollerOptions {
  viewportRef: MutableRefObject<HTMLDivElement | null>;
  speedPps?: number;
  persistKey?: string;            // enable persistence if provided
  persistThrottleMs?: number;     // default 500ms
  resumeMode?: ResumeMode;        // "continue" (default) or "pause" after restore
  layoutSignature?: string;       // hash/descriptor of layout+content; mismatch => ignore saved state
}

export function useTransformScroller({
  speedPps = 1000,
  persistKey,
  persistThrottleMs = 500,
  resumeMode = "continue",
  layoutSignature,
}: UseTransformScrollerOptions) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  // 1) Measure content height (one copy = halfHeight)
  const { halfHeight } = useMeasureHalfHeight(trackRef);

  // 3) Persistence plugin (restore + throttled save)
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

  // 4) Core transform loop
  const { offsetRef, setOffset } = useTransformLoop({
    trackRef,
    speedPps,
    halfHeight,
    onFrame: () => {
      // Throttle saving during animation frames
      maybeSave(offsetRef.current, halfHeight);
    },
  });

  // 5) When halfHeight changes (resize/content updates), re-normalize offset
  useEffect(() => {
    if (!trackRef.current || halfHeight <= 0) return;
    // Try to restore from storage exactly once (no-op after first success)
    restoreIfNeeded(halfHeight, setOffset);
    // Ensure current offset is valid for the new halfHeight
    setOffset((y) => normalizeIntoLoop(y, halfHeight));
    // Save immediately after adopting new geometry
    saveNow(offsetRef.current, halfHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [halfHeight]);

  return { trackRef };
}