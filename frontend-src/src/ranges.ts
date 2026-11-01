import type { PaletteId, PrimitiveField, WidgetRange } from "./types";
import { PALETTE_COLORS } from "./palettes";

/** The most ranges a field takes when its selector gives no limit; the backend's too. */
const DEFAULT_MAX_RANGES = 12;

/**
 * The colors a new range is given, in the order they are tried: those that read as a scale
 * from fine to bad. A display that lacks one is given the next it has.
 */
const SCALE_COLORS = ["green", "yellow", "orange", "red", "blue", "black"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** The ranges a stored value holds; anything that is not a range is left out. */
export const rangesOf = (value: unknown): WidgetRange[] =>
  Array.isArray(value)
    ? value.filter(isRecord).map((entry) => ({
        from: typeof entry.from === "number" ? entry.from : null,
        color: typeof entry.color === "string" ? entry.color : "black",
      }))
    : [];

/**
 * The color for a range added to `list`: the first of a scale from green to red that the
 * palette has and no range uses yet, else the first color it has that none uses, white included.
 */
export const nextColor = (palette: PaletteId, list: WidgetRange[]): string => {
  const available = PALETTE_COLORS[palette];
  const used = new Set(list.map((range) => range.color));
  const fresh = (color: string): boolean =>
    available.includes(color) && !used.has(color);
  const preferred = SCALE_COLORS.find(fresh);
  if (preferred) return preferred;
  return available.find((color) => !used.has(color)) ?? available[0] ?? "black";
};

/**
 * A range added to the list. The first one starts at the lowest value; the others wait
 * for a start to be typed, and do nothing until it is.
 */
export const newRange = (
  palette: PaletteId,
  list: WidgetRange[]
): WidgetRange => ({
  from: null,
  color: nextColor(palette, list),
});

export const canAddRange = (
  field: PrimitiveField,
  list: WidgetRange[]
): boolean =>
  list.length <
  (typeof field.max === "number" ? field.max : DEFAULT_MAX_RANGES);

export const withRangeValues = (
  list: WidgetRange[],
  index: number,
  values: Partial<WidgetRange>
): WidgetRange[] =>
  list.map((range, at) => (at === index ? { ...range, ...values } : range));

export const withoutRange = (
  list: WidgetRange[],
  index: number
): WidgetRange[] => list.filter((_, at) => at !== index);

/** Whether a range does something yet: only the first may have no start. */
export const isIdle = (list: WidgetRange[], index: number): boolean =>
  list[index].from === null &&
  list.findIndex((range) => range.from === null) !== index;
