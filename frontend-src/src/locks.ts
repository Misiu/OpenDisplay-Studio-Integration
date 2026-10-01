import { VISIBLE_KEY } from "./expressions";
import { isBoxPrimitive } from "./primitive-shape";
import { definitionFor } from "./item-fields";
import { RESIZE_HANDLES, type ResizeHandle } from "./resize";
import { allItems, isContainer } from "./tree";
import type {
  ContainerItem,
  PrimitiveDefinition,
  PrimitiveItem,
  StudioItem,
} from "./types";

/** What an item's expressions stop the user from doing with the mouse. */
export interface ItemLocks {
  /** The expression-driven fields that pin the item: moving it would overwrite them. */
  position: string[];
  /** Handles whose drag would overwrite an expression-driven field. */
  handles: ResizeHandle[];
  /** Elements in a group whose position or size an expression drives, so it cannot be scaled. */
  scalingBlockedBy: string[];
}

const FREE: ItemLocks = { position: [], handles: [], scalingBlockedBy: [] };

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

const isCornerGeometry = (definition: PrimitiveDefinition): boolean =>
  definition.geometry === "box" || definition.geometry === "line";

const primitiveLocks = (
  item: PrimitiveItem,
  definition: PrimitiveDefinition
): ItemLocks => {
  const expressed = new Set(Object.keys(item.expressions ?? {}));
  expressed.delete(VISIBLE_KEY);
  const layout = definition.fields.filter(
    (field) => field.section === "layout" && expressed.has(field.key)
  );
  // The points of a polygon are its position: a template for them pins it.
  const pinned = definition.fields.filter(
    (field) => field.shape === "points" && expressed.has(field.key)
  );
  const position = [
    ...layout.filter((field) => field.shape === "coordinate"),
    ...pinned,
  ].map((field) => field.key);
  if (!isCornerGeometry(definition)) {
    // Every other shape has size fields (a size, a radius, a module size) that any handle writes.
    const sized = layout.some((field) => field.shape !== "coordinate");
    const scaled = sized || pinned.length > 0;
    return {
      position,
      handles: scaled ? [...RESIZE_HANDLES] : [],
      scalingBlockedBy: [],
    };
  }
  return {
    position,
    handles: RESIZE_HANDLES.filter((handle) =>
      handleKeys(item, handle).some((key) => expressed.has(key))
    ),
    scalingBlockedBy: [],
  };
};

/** Whether an element's position or size is driven by an expression. */
const drivesGeometry = (
  item: StudioItem,
  definitions: PrimitiveDefinition[]
): boolean => {
  const locks = itemLocks(item, definitions);
  return locks.position.length > 0 || locks.handles.length > 0;
};

/**
 * A group is scaled by resizing it, which rewrites every position and size in it: an
 * expression-driven one would be overwritten, so the group cannot be resized.
 */
const groupLocks = (
  group: ContainerItem,
  definitions: PrimitiveDefinition[]
): ItemLocks => {
  const blockers = allItems(group.children).filter(
    (item) => !isContainer(item) && drivesGeometry(item, definitions)
  );
  return {
    position: [],
    handles: blockers.length > 0 ? [...RESIZE_HANDLES] : [],
    scalingBlockedBy: blockers.map((item) => item.name),
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
  if (item.kind === "container") {
    return item.grouped ? groupLocks(item, definitions) : FREE;
  }
  if (item.kind !== "primitive") return FREE;
  const definition = definitionFor(item, definitions);
  return definition ? primitiveLocks(item, definition) : FREE;
};
