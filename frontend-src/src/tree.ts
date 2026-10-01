import type { ContainerItem, Dashboard, ItemBounds, StudioItem } from "./types";

/**
 * The item tree of a dashboard. Sibling order is drawing order: the first item is drawn
 * first, the last is on top. A container's children store coordinates relative to its
 * top-left corner, so anything that needs where an item really is adds the offsets of
 * the containers above it.
 */

export interface Offset {
  x: number;
  y: number;
}

const ORIGIN: Offset = { x: 0, y: 0 };

export const isContainer = (item: StudioItem): item is ContainerItem =>
  item.kind === "container";

export const isGroup = (item: StudioItem): item is ContainerItem =>
  item.kind === "container" && item.grouped;

/** Where an item sits in the tree. */
export interface Location {
  item: StudioItem;
  /** The container it is in; undefined for a top-level item. */
  parent?: ContainerItem;
  /** The list it is in and its place there. */
  siblings: StudioItem[];
  index: number;
  /** The absolute position of the origin its coordinates are relative to. */
  offset: Offset;
}

const search = (
  items: StudioItem[],
  id: string,
  parent: ContainerItem | undefined,
  offset: Offset
): Location | undefined => {
  for (const [index, item] of items.entries()) {
    if (item.id === id) return { item, parent, siblings: items, index, offset };
    if (isContainer(item)) {
      const inside = search(item.children, id, item, {
        x: offset.x + item.x,
        y: offset.y + item.y,
      });
      if (inside) return inside;
    }
  }
  return undefined;
};

export const locate = (items: StudioItem[], id: string): Location | undefined =>
  search(items, id, undefined, ORIGIN);

export const findItem = (
  items: StudioItem[],
  id: string
): StudioItem | undefined => locate(items, id)?.item;

/** Every item, each container before its children: the order things are drawn in. */
export const allItems = (items: StudioItem[]): StudioItem[] =>
  items.flatMap((item) =>
    isContainer(item) ? [item, ...allItems(item.children)] : [item]
  );

export const countItems = (items: StudioItem[]): number =>
  allItems(items).length;

/** The containers above an item, nearest first. */
export const ancestors = (items: StudioItem[], id: string): ContainerItem[] => {
  const found: ContainerItem[] = [];
  let current = locate(items, id)?.parent;
  while (current) {
    found.push(current);
    current = locate(items, current.id)?.parent;
  }
  return found;
};

/** Whether `id` is `ancestorId` or lies anywhere below it. */
export const isWithin = (
  items: StudioItem[],
  id: string,
  ancestorId: string
): boolean =>
  id === ancestorId ||
  ancestors(items, id).some((ancestor) => ancestor.id === ancestorId);

/** An item's box in display pixels, given the offset of the container it is in. */
export const absoluteBox = (local: ItemBounds, offset: Offset): ItemBounds => ({
  ...local,
  x: local.x + offset.x,
  y: local.y + offset.y,
});

export const contains = (box: ItemBounds, x: number, y: number): boolean =>
  x >= box.x && x < box.x + box.width && y >= box.y && y < box.y + box.height;

export const intersects = (first: ItemBounds, second: ItemBounds): boolean =>
  first.x < second.x + second.width &&
  second.x < first.x + first.width &&
  first.y < second.y + second.height &&
  second.y < first.y + first.height;

/** Adds `dx`/`dy` to the coordinates an item stores. */
export type Translate = (item: StudioItem, dx: number, dy: number) => void;

/**
 * Takes an item out of where it is and puts it into `parentId` (or the top level with
 * `undefined`) at `index` (the end by default), keeping it where it is on screen:
 * its coordinates are converted between the two containers' origins.
 */
export const moveItem = (
  dashboard: Dashboard,
  id: string,
  parentId: string | undefined,
  translate: Translate,
  index?: number
): void => {
  const from = locate(dashboard.items, id);
  if (!from) return;
  if (parentId !== undefined && isWithin(dashboard.items, parentId, id)) return;
  from.siblings.splice(from.index, 1);
  const found =
    parentId === undefined ? undefined : locate(dashboard.items, parentId);
  const target = found && isContainer(found.item) ? found.item : undefined;
  const origin =
    found && target
      ? { x: found.offset.x + target.x, y: found.offset.y + target.y }
      : ORIGIN;
  const list = target ? target.children : dashboard.items;
  translate(from.item, from.offset.x - origin.x, from.offset.y - origin.y);
  list.splice(index ?? list.length, 0, from.item);
};

/** Removes an item and everything in it. */
export const removeFromTree = (dashboard: Dashboard, id: string): void => {
  const from = locate(dashboard.items, id);
  if (from) from.siblings.splice(from.index, 1);
};

/** Puts a new item into a container (or the top level) at `index`, the end by default. */
export const insertItem = (
  dashboard: Dashboard,
  item: StudioItem,
  parentId: string | undefined,
  index?: number
): void => {
  const target =
    parentId === undefined ? undefined : locate(dashboard.items, parentId);
  const list =
    target && isContainer(target.item) ? target.item.children : dashboard.items;
  list.splice(index ?? list.length, 0, item);
};

/**
 * Whether the items can be wrapped into one group: at least one, all in the same list.
 * Returns that list's parent id (undefined for the top level), or `false`.
 */
export const commonParent = (
  items: StudioItem[],
  ids: string[]
): { parentId: string | undefined } | false => {
  const locations = ids.map((id) => locate(items, id));
  if (locations.length === 0 || locations.some((location) => !location)) {
    return false;
  }
  const parents = new Set(locations.map((location) => location?.parent?.id));
  if (parents.size !== 1) return false;
  return { parentId: locations[0]?.parent?.id };
};

/** The ids in the order they are drawn, whatever order they were selected in. */
export const inDrawingOrder = (
  items: StudioItem[],
  ids: string[]
): string[] => {
  const wanted = new Set(ids);
  return allItems(items)
    .filter((item) => wanted.has(item.id))
    .map((item) => item.id);
};

/** The item to select when the user clicks on `id`: its outermost group, unless entered. */
export const selectionTarget = (
  items: StudioItem[],
  id: string,
  enteredGroupId: string | undefined
): string => {
  const chain = [...ancestors(items, id)].reverse();
  const entered = enteredGroupId
    ? new Set([
        enteredGroupId,
        ...ancestors(items, enteredGroupId).map((container) => container.id),
      ])
    : new Set<string>();
  const outermost = chain.find(
    (container) => container.grouped && !entered.has(container.id)
  );
  return outermost?.id ?? id;
};

/**
 * Puts an item next to another: `before` above it and `after` below it in the layer
 * list, which shows the top item first. The item is re-parented if the target is in
 * another container, and stays where it is on screen. Does nothing if the target is
 * inside the item.
 */
export const moveRelative = (
  dashboard: Dashboard,
  id: string,
  targetId: string,
  edge: "before" | "after",
  translate: Translate
): void => {
  if (id === targetId || isWithin(dashboard.items, targetId, id)) return;
  const from = locate(dashboard.items, id);
  if (!from || !locate(dashboard.items, targetId)) return;
  from.siblings.splice(from.index, 1);
  const target = locate(dashboard.items, targetId);
  if (!target) return;
  // A location's offset is already the origin of the list the item is in.
  const origin = target.offset;
  translate(from.item, from.offset.x - origin.x, from.offset.y - origin.y);
  target.siblings.splice(
    edge === "before" ? target.index + 1 : target.index,
    0,
    from.item
  );
};

/** An item with the origin its coordinates are relative to, and the container above it. */
export interface Placed {
  item: StudioItem;
  offset: Offset;
  parent?: ContainerItem;
  depth: number;
}

/** Every item in drawing order with its offset: what the canvas overlay is built from. */
export const withOffsets = (
  items: StudioItem[],
  offset: Offset = ORIGIN,
  parent?: ContainerItem,
  depth = 0
): Placed[] =>
  items.flatMap((item) => {
    const placed: Placed = { item, offset, parent, depth };
    if (!isContainer(item)) return [placed];
    return [
      placed,
      ...withOffsets(
        item.children,
        { x: offset.x + item.x, y: offset.y + item.y },
        item,
        depth + 1
      ),
    ];
  });

/** A container's box on the display. */
export const containerBox = (placed: Placed): ItemBounds | undefined =>
  isContainer(placed.item)
    ? {
        x: placed.offset.x + placed.item.x,
        y: placed.offset.y + placed.item.y,
        width: placed.item.width,
        height: placed.item.height,
      }
    : undefined;

/**
 * The container an item dropped at (x, y) would go into: the deepest, topmost one under
 * the point. Not the items being dragged or anything inside them, not a locked or hidden
 * container, and not a group unless it is entered.
 */
export const containerAt = (
  items: StudioItem[],
  x: number,
  y: number,
  dragged: string[],
  enteredGroupId: string | undefined
): ContainerItem | undefined => {
  const entered = new Set(
    enteredGroupId
      ? [enteredGroupId, ...ancestors(items, enteredGroupId).map((c) => c.id)]
      : []
  );
  const candidates = withOffsets(items).filter((placed) => {
    const box = containerBox(placed);
    if (!box || !isContainer(placed.item)) return false;
    if (placed.item.hidden || placed.item.locked) return false;
    if (placed.item.grouped && !entered.has(placed.item.id)) return false;
    if (dragged.some((id) => isWithin(items, placed.item.id, id))) return false;
    return contains(box, x, y);
  });
  const found = candidates[candidates.length - 1]?.item;
  return found && isContainer(found) ? found : undefined;
};

/** Puts an item back in the place of the one with the same id. */
export const replaceItem = (dashboard: Dashboard, item: StudioItem): void => {
  const found = locate(dashboard.items, item.id);
  if (found) found.siblings[found.index] = item;
};

/** Ids of the items, in the order they sit in their lists, that are in `wanted`. */
const inList = (siblings: StudioItem[], wanted: Set<string>): StudioItem[] =>
  siblings.filter((item) => wanted.has(item.id));

/** The lists the given items sit in, each once. */
const listsOf = (dashboard: Dashboard, ids: string[]): Set<StudioItem[]> =>
  new Set(
    ids.flatMap((id) => {
      const siblings = locate(dashboard.items, id)?.siblings;
      return siblings ? [siblings] : [];
    })
  );

/** Moves every selected item to the top of its list: drawn last, so in front. */
export const bringToFront = (dashboard: Dashboard, ids: string[]): void => {
  const wanted = new Set(ids);
  const lists = listsOf(dashboard, ids);
  for (const siblings of lists) reorder(siblings, wanted, "end");
};

/** Moves every selected item to the bottom of its list: drawn first, so at the back. */
export const sendToBack = (dashboard: Dashboard, ids: string[]): void => {
  const wanted = new Set(ids);
  const lists = listsOf(dashboard, ids);
  for (const siblings of lists) reorder(siblings, wanted, "start");
};

const reorder = (
  siblings: StudioItem[],
  wanted: Set<string>,
  end: "start" | "end"
): void => {
  const chosen = inList(siblings, wanted);
  const rest = siblings.filter((item) => !wanted.has(item.id));
  siblings.splice(
    0,
    siblings.length,
    ...(end === "end" ? [...rest, ...chosen] : [...chosen, ...rest])
  );
};

/**
 * Moves each selected item one place up (toward the top of the layer list, drawn later)
 * or down, swapping with its neighbour unless that neighbour is selected as well.
 */
export const stepItems = (
  dashboard: Dashboard,
  ids: string[],
  direction: "up" | "down"
): void => {
  const wanted = new Set(ids);
  const lists = listsOf(dashboard, ids);
  for (const siblings of lists) {
    const order =
      direction === "up"
        ? siblings.map((_, index) => siblings.length - 1 - index)
        : siblings.map((_, index) => index);
    for (const index of order) {
      const item = siblings[index];
      const next = siblings[index + (direction === "up" ? 1 : -1)];
      if (item && next && wanted.has(item.id) && !wanted.has(next.id)) {
        siblings[index] = next;
        siblings[index + (direction === "up" ? 1 : -1)] = item;
      }
    }
  }
};
