/**
 * Robust filename/url encoder for unsafe characters while preserving "/" path separators.
 */
export function encodePath(path: string) {
  return path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}