import { VISIBLE_KEY } from "./expressions";
import { isBoxPrimitive } from "./geometry";
import { definitionFor } from "./item-fields";
import { RESIZE_HANDLES, type ResizeHandle } from "./resize";
import type { PrimitiveDefinition, PrimitiveItem, StudioItem } from "./types";

/** What an item's expressions stop the user from doing with the mouse. */
export interface ItemLocks {
  /** The expression-driven fields that pin the item: moving it would overwrite them. */
  position: string[];
  /** Handles whose drag would overwrite an expression-driven field. */
  handles: ResizeHandle[];
}

const FREE: ItemLocks = { position: [], handles: [] };

type Axis = "x" | "y";

/** The field a west/east or north/south handle writes; a flipped box swaps its ends. */
const edgeKey = (
  item: PrimitiveItem,
  axis: Axis,
  edge: "start" | "end"
): string => {
  const primitive = item.primitive;
  if (!isBoxPrimitive(primitive)) return axis;
  const flipped =
    axis === "x"
      ? primitive.x_start > primitive.x_end
      : primitive.y_start > primitive.y_end;
  const first = edge === "start" ? !flipped : flipped;
  return `${axis}_${first ? "start" : "end"}`;
};

const handleKeys = (item: PrimitiveItem, handle: ResizeHandle): string[] => [
  ...(handle.includes("w") ? [edgeKey(item, "x", "start")] : []),
  ...(handle.includes("e") ? [edgeKey(item, "x", "end")] : []),
  ...(handle.includes("n") ? [edgeKey(item, "y", "start")] : []),
  ...(handle.includes("s") ? [edgeKey(item, "y", "end")] : []),
];

const primitiveLocks = (
  item: PrimitiveItem,
  definition: PrimitiveDefinition
): ItemLocks => {
  const expressed = new Set(Object.keys(item.expressions ?? {}));
  expressed.delete(VISIBLE_KEY);
  const layout = definition.fields.filter(
    (field) => field.section === "layout" && expressed.has(field.key)
  );
  const position = layout
    .filter((field) => field.shape === "coordinate")
    .map((field) => field.key);
  if (definition.geometry === "point") {
    // A point has one size field (size, radius, module size); every handle writes it.
    const sized = layout.some((field) => field.shape !== "coordinate");
    return { position, handles: sized ? [...RESIZE_HANDLES] : [] };
  }
  return {
    position,
    handles: RESIZE_HANDLES.filter((handle) =>
      handleKeys(item, handle).some((key) => expressed.has(key))
    ),
  };
};

/**
 * What the mouse may not do to an item because a field is driven by an expression.
 * Position pins block moving; a size field blocks only the handles that would write it.
 * Fields outside the geometry, such as a colour or a progress value, lock nothing.
 */
export const itemLocks = (
  item: StudioItem,
  definitions: PrimitiveDefinition[]
): ItemLocks => {
  if (item.kind !== "primitive") return FREE;
  const definition = definitionFor(item, definitions);
  return definition ? primitiveLocks(item, definition) : FREE;
};
