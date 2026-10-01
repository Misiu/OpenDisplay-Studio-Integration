import type { ItemBounds } from "./types";

/**
 * Pillow text anchors. The first letter says where along the width the anchor point sits
 * on the text (left, middle, right), the second where along the height (ascender or top,
 * middle, baseline, bottom or descender). The backend measures text exactly; the panel
 * only needs these fractions to place a box it already has the size of.
 */
const HORIZONTAL: Record<string, number> = { l: 0, m: 0.5, r: 1 };

/** The baseline sits about here between the top of the text and its bottom. */
const BASELINE = 0.8;
const VERTICAL: Record<string, number> = {
  a: 0,
  t: 0,
  m: 0.5,
  s: BASELINE,
  b: 1,
  d: 1,
};

export interface AnchorFraction {
  x: number;
  y: number;
}

/**
 * How far along its own width and height the anchor point lies. An unset or unknown
 * anchor falls back to `fallback`, the anchor the renderer uses in that case.
 */
export const anchorFraction = (
  anchor: string | null | undefined,
  fallback: string
): AnchorFraction => {
  const letters = anchor && anchor.length === 2 ? anchor : fallback;
  return {
    x: HORIZONTAL[letters[0]] ?? 0,
    y: VERTICAL[letters[1]] ?? 0,
  };
};

/** The box of a block of `width` by `height` drawn with its anchor point at (x, y). */
export const anchoredBox = (
  x: number,
  y: number,
  size: { width: number; height: number },
  fraction: AnchorFraction
): ItemBounds => ({
  x: Math.round(x - size.width * fraction.x),
  y: Math.round(y - size.height * fraction.y),
  width: size.width,
  height: size.height,
});
