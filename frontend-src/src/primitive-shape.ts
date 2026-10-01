import { anchorFraction, anchoredBox } from "./anchor";
import type { ItemBounds, Primitive } from "./types";

/** A primitive given by two opposite corners. */
export type CornerPrimitive = Extract<
  Primitive,
  { x_start: number; y_start: number; x_end: number; y_end: number }
>;
export const isBoxPrimitive = (
  primitive: Primitive
): primitive is CornerPrimitive => "x_end" in primitive;

/** The modules along one side of a QR code before its quiet zone is added. */
const DEFAULT_QR_MODULES = 21;

/** The renderer's own defaults for where text is drawn from. */
const TEXT_ANCHOR = "lt";
const MULTILINE_ANCHOR = "lm";
const ICON_ANCHOR = "la";

/** How wide and tall text of a font size looks, until the backend has measured it. */
const GLYPH_WIDTH = 0.62;
const LINE_HEIGHT = 1.25;

interface Size {
  width: number;
  height: number;
}

/** Primitives whose size the backend measures: it depends on data and fonts. */
export const isMeasured = (primitive: Primitive): boolean =>
  ["text", "multiline", "qrcode", "debug_grid"].includes(primitive.type);

const estimatedText = (value: string, size: number): Size => {
  const lines = value.split("\n");
  const longest = Math.max(...lines.map((line) => line.length));
  return {
    width: Math.max(size, Math.round(longest * size * GLYPH_WIDTH)),
    height: Math.max(1, Math.round(lines.length * size * LINE_HEIGHT)),
  };
};

const textBounds = (
  primitive: Extract<Primitive, { type: "text" }>,
  measured?: ItemBounds
): ItemBounds => {
  const estimated = estimatedText(primitive.value, primitive.size);
  const size = measured ?? {
    width: primitive.max_width
      ? Math.min(estimated.width, primitive.max_width)
      : estimated.width,
    height: estimated.height,
  };
  return anchoredBox(
    primitive.x,
    primitive.y,
    size,
    anchorFraction(primitive.anchor, TEXT_ANCHOR)
  );
};

/**
 * The box round every line of a multiline text. Its lines are `offset_y` apart, so the
 * first line's box sits at the anchor and the rest extend below it.
 */
const multilineBounds = (
  primitive: Extract<Primitive, { type: "multiline" }>,
  measured?: ItemBounds
): ItemBounds => {
  const lines = primitive.value.replaceAll("\n", "").split(primitive.delimiter);
  const gaps = (lines.length - 1) * primitive.offset_y;
  const longest = Math.max(...lines.map((line) => line.length));
  const size = measured ?? {
    width: Math.max(
      primitive.size,
      Math.round(longest * primitive.size * GLYPH_WIDTH)
    ),
    height: Math.round(primitive.size * LINE_HEIGHT) + gaps,
  };
  const fraction = anchorFraction(primitive.anchor, MULTILINE_ANCHOR);
  const lineHeight = size.height - gaps;
  return {
    x: Math.round(primitive.x - size.width * fraction.x),
    y: Math.round(primitive.y - lineHeight * fraction.y),
    width: size.width,
    height: size.height,
  };
};

const iconBounds = (
  primitive: Extract<Primitive, { type: "icon" }>
): ItemBounds =>
  anchoredBox(
    primitive.x,
    primitive.y,
    { width: primitive.size, height: primitive.size },
    anchorFraction(primitive.anchor, ICON_ANCHOR)
  );

/** The gap between two icons of a sequence: a quarter of their size unless it is set. */
export const iconSequenceStep = (
  primitive: Extract<Primitive, { type: "icon_sequence" }>
): number =>
  primitive.size + (primitive.spacing ?? Math.floor(primitive.size / 4));

const DIRECTIONS = {
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
  up: { x: 0, y: -1 },
};

const iconSequenceBounds = (
  primitive: Extract<Primitive, { type: "icon_sequence" }>
): ItemBounds => {
  const direction = DIRECTIONS[primitive.direction];
  const step = iconSequenceStep(primitive);
  const fraction = anchorFraction(primitive.anchor, ICON_ANCHOR);
  const size = { width: primitive.size, height: primitive.size };
  const first = anchoredBox(primitive.x, primitive.y, size, fraction);
  const last = anchoredBox(
    primitive.x + direction.x * step * (primitive.icons.length - 1),
    primitive.y + direction.y * step * (primitive.icons.length - 1),
    size,
    fraction
  );
  const left = Math.min(first.x, last.x);
  const top = Math.min(first.y, last.y);
  return {
    x: left,
    y: top,
    width: Math.max(first.x, last.x) + primitive.size - left,
    height: Math.max(first.y, last.y) + primitive.size - top,
  };
};

const cornerBounds = (primitive: CornerPrimitive): ItemBounds => ({
  x: Math.min(primitive.x_start, primitive.x_end),
  y: Math.min(primitive.y_start, primitive.y_end),
  width: Math.abs(primitive.x_end - primitive.x_start) + 1,
  height: Math.abs(primitive.y_end - primitive.y_start) + 1,
});

const radialBounds = (
  primitive: Extract<Primitive, { type: "circle" | "arc" }>
): ItemBounds => ({
  x: primitive.x - primitive.radius,
  y: primitive.y - primitive.radius,
  width: primitive.radius * 2 + 1,
  height: primitive.radius * 2 + 1,
});

/** A pattern draws each cell one pixel larger than its size. */
const patternBounds = (
  primitive: Extract<Primitive, { type: "rectangle_pattern" }>
): ItemBounds => ({
  x: primitive.x_start,
  y: primitive.y_start,
  width:
    (primitive.x_repeat - 1) * (primitive.x_size + primitive.x_offset) +
    primitive.x_size +
    1,
  height:
    (primitive.y_repeat - 1) * (primitive.y_size + primitive.y_offset) +
    primitive.y_size +
    1,
});

const polygonBounds = (
  primitive: Extract<Primitive, { type: "polygon" }>
): ItemBounds => {
  const xs = primitive.points.map(([x]) => x);
  const ys = primitive.points.map(([, y]) => y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return {
    x: left,
    y: top,
    width: Math.max(...xs) - left + 1,
    height: Math.max(...ys) - top + 1,
  };
};

const qrBounds = (
  primitive: Extract<Primitive, { type: "qrcode" }>,
  measured?: ItemBounds
): ItemBounds => {
  const side =
    measured?.width ??
    (DEFAULT_QR_MODULES + primitive.border * 2) * primitive.boxsize;
  return { x: primitive.x, y: primitive.y, width: side, height: side };
};

const scaledBounds = (measured: ItemBounds, factor: number): ItemBounds => ({
  ...measured,
  width: Math.max(1, Math.round(measured.width * factor)),
  height: Math.max(1, Math.round(measured.height * factor)),
});

/**
 * What the backend measured for `composed`, brought up to date for `current`, the same
 * primitive after edits the backend has not rendered yet (a resize in progress, a new
 * font size). Text grows with its size and a QR code with its module size and quiet
 * zone; anything else keeps its measurement.
 */
export const remeasured = (
  composed: Primitive,
  current: Primitive,
  measured: ItemBounds
): ItemBounds => {
  if (
    (composed.type === "text" || composed.type === "multiline") &&
    current.type === composed.type
  ) {
    return scaledBounds(measured, current.size / composed.size);
  }
  if (composed.type === "qrcode" && current.type === "qrcode") {
    const modules = measured.width / composed.boxsize - 2 * composed.border;
    const side = (modules + 2 * current.border) * current.boxsize;
    return { ...measured, width: side, height: side };
  }
  return measured;
};

/**
 * The pixels a primitive occupies, from its fields. Text and QR codes take their size
 * from `measured`, what the backend reports for the last render, when there is one.
 */
export const primitiveBounds = (
  primitive: Primitive,
  measured?: ItemBounds
): ItemBounds => {
  switch (primitive.type) {
    case "text":
      return textBounds(primitive, measured);
    case "multiline":
      return multilineBounds(primitive, measured);
    case "rectangle":
    case "ellipse":
    case "line":
    case "progress_bar":
    case "plot":
      return cornerBounds(primitive);
    case "rectangle_pattern":
      return patternBounds(primitive);
    case "polygon":
      return polygonBounds(primitive);
    case "circle":
    case "arc":
      return radialBounds(primitive);
    case "icon":
      return iconBounds(primitive);
    case "icon_sequence":
      return iconSequenceBounds(primitive);
    case "qrcode":
      return qrBounds(primitive, measured);
    case "dlimg":
      return {
        x: primitive.x,
        y: primitive.y,
        width: primitive.xsize,
        height: primitive.ysize,
      };
    case "debug_grid":
      return {
        x: 0,
        y: 0,
        width: measured?.width ?? 1,
        height: measured?.height ?? 1,
      };
  }
};

/**
 * Give a primitive another anchor without moving what is drawn: its coordinates are those
 * of the anchor point, so they move by how far the anchor point moved within the box.
 */
export const reanchored = (
  primitive: Primitive,
  anchor: string,
  measured?: ItemBounds
): void => {
  if (!("anchor" in primitive) || !("x" in primitive)) return;
  const before = primitiveBounds(primitive, measured);
  primitive.anchor = anchor;
  const after = primitiveBounds(primitive, measured);
  translatePrimitive(primitive, before.x - after.x, before.y - after.y);
};

/** Move a primitive by (dx, dy). A debug grid covers the display and has no position. */
export const translatePrimitive = (
  primitive: Primitive,
  dx: number,
  dy: number
): void => {
  if (isBoxPrimitive(primitive)) {
    primitive.x_start += dx;
    primitive.x_end += dx;
    primitive.y_start += dy;
    primitive.y_end += dy;
    return;
  }
  switch (primitive.type) {
    case "rectangle_pattern":
      primitive.x_start += dx;
      primitive.y_start += dy;
      return;
    case "polygon":
      primitive.points = primitive.points.map(([x, y]) => [x + dx, y + dy]);
      return;
    case "debug_grid":
      return;
    default:
      primitive.x += dx;
      primitive.y += dy;
  }
};
