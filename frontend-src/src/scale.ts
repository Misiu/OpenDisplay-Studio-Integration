import { isBoxPrimitive } from "./primitive-shape";
import { clamp } from "./math";
import { resolveLimit } from "./primitives";
import type {
  ContainerItem,
  PrimitiveDefinition,
  PrimitiveItem,
  StudioItem,
} from "./types";

/**
 * Scaling a group. A group's children store coordinates relative to its top-left corner,
 * so resizing the group by `sx` and `sy` scales every coordinate and every size inside
 * it by the same factors. Sizes with no direction of their own (a radius, a font size, an
 * outline width) follow the mean of the two.
 */

interface Display {
  width: number;
  height: number;
}

interface ScaleContext {
  sx: number;
  sy: number;
  definitions: PrimitiveDefinition[];
  display: Display;
}

/** The factor for a size that has no axis: the geometric mean of the two. */
const uniform = (context: ScaleContext): number =>
  Math.sqrt(context.sx * context.sy);

/** A scaled length, never below `minimum`. */
const scaled = (value: number, factor: number, minimum: number): number =>
  Math.max(minimum, Math.round(value * factor));

const scalePrimitive = (item: PrimitiveItem, context: ScaleContext): void => {
  const definition = context.definitions.find(
    (candidate) => candidate.type === item.primitive.type
  );
  const values: Record<string, unknown> = { ...item.primitive };
  for (const field of definition?.fields ?? []) {
    const value = values[field.key];
    if (field.shape === "points" && Array.isArray(value)) {
      values[field.key] = value.map(([x, y]) => [
        Math.round(x * context.sx),
        Math.round(y * context.sy),
      ]);
      continue;
    }
    if (typeof value !== "number") continue;
    if (field.shape === "coordinate") {
      values[field.key] = Math.round(
        value * (field.axis === "x" ? context.sx : context.sy)
      );
      continue;
    }
    if (field.shape === "number" && field.unit === "px") {
      const minimum = field.min === 0 && value === 0 ? 0 : 1;
      const maximum = resolveLimit(field.max, context.display, Infinity);
      values[field.key] = clamp(
        scaled(value, uniform(context), minimum),
        minimum,
        maximum
      );
    }
  }
  Object.assign(item.primitive, values);
  keepBoxOpen(item);
};

/** Rounding must not collapse a box or a line into nothing. */
const keepBoxOpen = (item: PrimitiveItem): void => {
  const primitive = item.primitive;
  if (!isBoxPrimitive(primitive)) return;
  if (primitive.type === "line") {
    if (
      primitive.x_start === primitive.x_end &&
      primitive.y_start === primitive.y_end
    ) {
      primitive.x_end += 1;
    }
    return;
  }
  if (primitive.x_end <= primitive.x_start) {
    primitive.x_end = primitive.x_start + 1;
  }
  if (primitive.y_end <= primitive.y_start) {
    primitive.y_end = primitive.y_start + 1;
  }
};

const scaleBox = (
  box: { x: number; y: number; width: number; height: number },
  context: ScaleContext
): void => {
  box.x = Math.round(box.x * context.sx);
  box.y = Math.round(box.y * context.sy);
  box.width = scaled(box.width, context.sx, 1);
  box.height = scaled(box.height, context.sy, 1);
};

const scaleOne = (item: StudioItem, context: ScaleContext): void => {
  if (item.kind === "primitive") {
    scalePrimitive(item, context);
    return;
  }
  if (item.kind === "widget") {
    scaleBox(item.frame, context);
    item.layout.padding = scaled(item.layout.padding, uniform(context), 0);
    return;
  }
  scaleBox(item, context);
  for (const child of item.children) scaleOne(child, context);
};

/**
 * Scales everything inside a group by `sx` and `sy`, in place. The group's own box is
 * not touched: the caller sets it from the size the group was dragged to.
 */
export const scaleChildren = (
  group: ContainerItem,
  sx: number,
  sy: number,
  definitions: PrimitiveDefinition[],
  display: Display
): void => {
  const context: ScaleContext = { sx, sy, definitions, display };
  for (const child of group.children) scaleOne(child, context);
};
