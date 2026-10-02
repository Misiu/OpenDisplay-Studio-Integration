import { clamp } from "./math";
import type {
  FieldLimit,
  Primitive,
  PrimitiveDefinition,
  PrimitiveField,
  PrimitiveValue,
} from "./types";

interface DisplaySize {
  width: number;
  height: number;
}

interface PrimitiveFactoryContext {
  x: number;
  y: number;
  displayWidth: number;
  displayHeight: number;
}

/** The most an element may measure along a side: as far as it may reach beyond the display. */
export const sizeLimit = (extent: number): number => 2 * extent;

/** A field limit as a number for a display of the given size, scaled by `scale`. */
const limitFor = (
  limit: FieldLimit | undefined,
  display: DisplaySize,
  fallback: number,
  scale: (extent: number) => number
): number => {
  if (limit === "display_width") return scale(display.width);
  if (limit === "display_height") return scale(display.height);
  if (limit === "display_shorter_side") {
    return scale(Math.min(display.width, display.height));
  }
  return limit ?? fallback;
};

/** A field limit as a number for a display of the given size: the most a value may be. */
export const resolveLimit = (
  limit: FieldLimit | undefined,
  display: DisplaySize,
  fallback: number
): number => limitFor(limit, display, fallback, sizeLimit);

/** The same limit as the display itself, which is how big a new element starts at most. */
const startingLimit = (
  limit: FieldLimit | undefined,
  display: DisplaySize,
  fallback: number
): number => limitFor(limit, display, fallback, (extent) => extent);

/** What a new item starts with for one field, before it is placed on the display. */
const startingValue = (
  field: PrimitiveField,
  display: DisplaySize
): PrimitiveValue => {
  if (field.default === undefined) {
    return field.nullable || field.optional ? null : 0;
  }
  if (field.shape !== "number" || typeof field.default !== "number") {
    return structuredClone(field.default);
  }
  return clamp(
    field.default,
    startingLimit(field.min, display, Number.NEGATIVE_INFINITY),
    startingLimit(field.max, display, Number.POSITIVE_INFINITY)
  );
};

/** Move the points of a polygon so its first point lies at (x, y). */
const placePoints = (points: unknown, x: number, y: number): void => {
  if (!Array.isArray(points)) return;
  const [first] = points;
  const [originX, originY] = Array.isArray(first) ? first : [0, 0];
  points.forEach((point, index) => {
    if (!Array.isArray(point)) return;
    points[index] = [x + point[0] - originX, y + point[1] - originY];
  });
};

/** Put a new primitive where the item is dropped, inside the display. */
const place = (
  definition: PrimitiveDefinition,
  values: Record<string, unknown>,
  context: PrimitiveFactoryContext
): void => {
  const { x, y, displayWidth, displayHeight } = context;
  switch (definition.geometry) {
    case "canvas":
      return;
    case "pattern":
      values.x_start = x;
      values.y_start = y;
      return;
    case "points":
      placePoints(values.points, x, y);
      return;
    case "box":
    case "line": {
      const extent = definition.extent ?? { x: 0, y: 0 };
      values.x_start = x;
      values.y_start = y;
      values.x_end = Math.min(displayWidth - 1, x + extent.x);
      values.y_end = Math.min(displayHeight - 1, y + extent.y);
      return;
    }
    default:
      values.x = x;
      values.y = y;
  }
};

/**
 * Build the primitive a definition describes, with every field at its default,
 * placed at the given point. `undefined` when there is no definition, so an
 * unknown catalog entry never turns into some other element.
 */
export const createPrimitive = (
  definition: PrimitiveDefinition | undefined,
  context: PrimitiveFactoryContext
): Primitive | undefined => {
  if (!definition) {
    return undefined;
  }
  const display = {
    width: context.displayWidth,
    height: context.displayHeight,
  };
  const values: Record<string, unknown> = { type: definition.type };
  for (const field of definition.fields) {
    values[field.key] = startingValue(field, display);
  }
  place(definition, values, context);
  // The definitions are the schema; this is the one place their data becomes a typed primitive.
  return values as unknown as Primitive;
};
