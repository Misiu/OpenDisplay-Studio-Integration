import { parse } from "yaml";
import { strings } from "./strings";
import type { PaletteId } from "./types";

/**
 * The OpenDisplay palettes, read from the backend's `palettes.json`, the one file that
 * lists them. A color has an `id` to name it, a `value` a dashboard stores (what the
 * renderer resolves) and a `hex` to draw. The panel imports the file when it is built.
 */
export interface PaletteColor {
  id: string;
  value: string;
  hex: string;
}

interface PaletteData {
  schemes: string[];
  accent: string;
  colors: PaletteColor[];
}

const files = import.meta.glob(
  "../../custom_components/opendisplay_studio/palettes.json",
  { query: "?raw", import: "default", eager: true }
);

// JSON is YAML, so the YAML parser the panel already ships reads it.
const data = Object.values(files).map((text) =>
  parse(String(text))
)[0] as Record<PaletteId, PaletteData>;

export const PALETTE_IDS = Object.keys(data) as PaletteId[];

export const PALETTE_LABELS: Record<PaletteId, string> = strings.palettes;

/** The values a dashboard stores for the colors of each palette. */
export const PALETTE_COLORS: Record<PaletteId, string[]> = Object.fromEntries(
  PALETTE_IDS.map((id) => [id, data[id].colors.map((color) => color.value)])
) as Record<PaletteId, string[]>;

export const PALETTE_SWATCHES: Record<PaletteId, PaletteColor[]> =
  Object.fromEntries(PALETTE_IDS.map((id) => [id, data[id].colors])) as Record<
    PaletteId,
    PaletteColor[]
  >;

/** The OpenDisplay color schemes a palette is used for. */
export const paletteSchemes = (palette: PaletteId): string[] =>
  data[palette].schemes;

const ACCENT = "accent";

/** The color to draw for a stored value, whichever palette has it, or `undefined`. */
export const sourceColorHex = (value: string): string | undefined => {
  for (const id of PALETTE_IDS) {
    const found = data[id].colors.find(
      (color) => color.value === value || color.id === value
    );
    if (found) return found.hex;
  }
  return value.startsWith("#") ? value : undefined;
};

/** The color to draw for a stored value on a display, or `undefined` if it is not one. */
export const colorHex = (
  value: string,
  palette: PaletteId
): string | undefined => {
  const wanted = value === ACCENT ? data[palette].accent : value;
  return data[palette].colors.find(
    (color) => color.value === wanted || color.id === wanted
  )?.hex;
};

/** What to call a color: `Red`, `Gray 3`. */
export const colorLabel = (id: string): string => {
  if (id === ACCENT) return strings.colors.accent;
  const gray = /^gray(\d+)$/.exec(id);
  if (gray) return strings.colors.gray(Number(gray[1]));
  return strings.colors.names[id as keyof typeof strings.colors.names] ?? id;
};
