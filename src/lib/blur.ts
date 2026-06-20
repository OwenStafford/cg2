import { BLUR_BY_IMAGE } from "./blur-data";

// Cream-colored fallback blur placeholder for product images.
export const BLUR_CREAM =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNlY2RkYmUiLz48L3N2Zz4=";

// Per-image tiny blur-up preview (falls back to the cream placeholder).
export function blurFor(imageUrl: string): string {
  const file = imageUrl.split("/").pop() ?? "";
  return BLUR_BY_IMAGE[file] ?? BLUR_CREAM;
}
