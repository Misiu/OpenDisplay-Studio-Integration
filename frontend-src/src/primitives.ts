import { clamp } from "./math";
import type {
  FieldLimit,
  Primitive,
  PrimitiveDefinition,
  PrimitiveField,
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

/** A field limit as a number for a display of the given size. */
export const resolveLimit = (
  limit: FieldLimit | undefined,
  display: DisplaySize,
  fallback: number
): number => {
  if (limit === "display_width") {
    return display.width;
  }
  if (limit === "display_height") {
    return display.height;
  }
  if (limit === "display_shorter_side") {
    return Math.min(display.width, display.height);
  }
  return limit ?? fallback;
};

/** What a new item starts with for one field, before it is placed on the display. */
const startingValue = (
  field: PrimitiveField,
  display: DisplaySize
): string | number | boolean | null => {
  if (field.default === undefined) {
    return field.nullable ? null : 0;
  }
  if (field.shape !== "number" || typeof field.default !== "number") {
    return field.default;
  }
  return clamp(
    field.default,
    resolveLimit(field.min, display, Number.NEGATIVE_INFINITY),
    resolveLimit(field.max, display, Number.POSITIVE_INFINITY)
  );
};

/** Put a point, box or line where the item is dropped, inside the display. */
const place = (
  definition: PrimitiveDefinition,
  values: Record<string, unknown>,
  context: PrimitiveFactoryContext
): void => {
  const { x, y, displayWidth, displayHeight } = context;
  if (definition.geometry === "point") {
    values.x = x;
    values.y = y;
    return;
  }
  const extent = definition.extent ?? { x: 0, y: 0 };
  values.x_start = x;
  values.y_start = y;
  values.x_end = Math.min(displayWidth - 1, x + extent.x);
  values.y_end = Math.min(displayHeight - 1, y + extent.y);
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
