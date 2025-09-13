import { useRef } from "react";
import type { ResumeMode } from "./useTransformScroller";

interface Options {
  persistKey?: string;
  throttleMs?: number;
  resumeMode?: ResumeMode;
  layoutSignature?: string;
}

/** Handles localStorage save/restore of the transform offset modulo one copy (halfHeight). */
export function usePersistOffset({
  persistKey,
  throttleMs = 500,
//   resumeMode = "continue",
  layoutSignature,
}: Options) {
  const restoredOnce = useRef(false);
  const lastSaveAt = useRef(0);

  const normalizeIntoLoop = (raw: number, half: number) => {
    if (half <= 0) return 0;
    let y = raw % half; // JS keeps sign
    if (y > 0) y -= half; // keep in (-half, 0]
    return y;
    // if your loop uses [0, half) instead, you can adjust to return y >= 0 ? y : y + half;
  };

  const load = () => {
    if (!persistKey) return null;
    try {
      const raw = localStorage.getItem(persistKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as {
        v: number;
        offsetModulo: number;
        ts: number;
        sig?: string;
      };
      if (parsed?.v !== 1) return null;
      if (layoutSignature && parsed.sig && parsed.sig !== layoutSignature) return null;
      return parsed;
    } catch {
      return null;
    }
  };

  const save = (offset: number, half: number) => {
    if (!persistKey || half <= 0) return;
    const payload = {
      v: 1,
      offsetModulo: normalizeIntoLoop(offset, half),
      ts: Date.now(),
      sig: layoutSignature,
    };
    try {
      localStorage.setItem(persistKey, JSON.stringify(payload));
    } catch {
      // ignore quota errors
    }
  };

  const maybeSave = (offset: number, half: number) => {
    if (!persistKey) return;
    const now = performance.now();
    if (now - lastSaveAt.current >= throttleMs) {
      lastSaveAt.current = now;
      save(offset, half);
    }
  };

//   // Save on tab hide/unload
//   useEffect(() => {
//     if (!persistKey) return;
//     const onHide = () => { /* best-effort */ };
//     const onUnload = () => { /* best-effort */ };
//     // We'll rely on the facade to call saveNow() when needed; here we just attach no-ops to avoid surprises.
//     return () => {
//       // no listeners to remove (kept minimal)
//     };
//   }, [persistKey]);

  const restoreIfNeeded = (half: number, setOffset: (v: number | ((y: number) => number)) => void) => {
    if (restoredOnce.current || !persistKey || half <= 0) return;
    const s = load();
    if (s) {
      const mapped = normalizeIntoLoop(s.offsetModulo, half);
      setOffset(mapped);
      // If caller wants to pause after restore, it should control paused state externally.
      // (In the current design, hover/focus controls pause; resumeMode is informational.)
    }
    restoredOnce.current = true;
  };

  const saveNow = (offset: number, half: number) => {
    save(offset, half);
  };

  return {
    restoreIfNeeded,
    maybeSave,
    saveNow,
    normalizeIntoLoop,
  };
}