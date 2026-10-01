import { boundingBox } from "./container-ops";
import { itemBounds, translateItem } from "./geometry";
import { createId } from "./ids";
import { defaultItemName, itemType } from "./item-names";
import {
  absoluteBox,
  allItems,
  ancestors,
  inDrawingOrder,
  isContainer,
  locate,
  type Offset,
} from "./tree";
import type { Dashboard, ItemBounds, StudioItem } from "./types";

/** How far a pasted or duplicated copy is moved from the original, in pixels. */
export const COPY_OFFSET = 8;

/**
 * Elements taken with Copy or Cut: deep copies whose coordinates are display
 * coordinates, so they land in the same place whatever container they are pasted into.
 */
export interface ClipboardData {
  items: StudioItem[];
}

/** The selected items that are not inside another selected item, in drawing order. */
const topmost = (dashboard: Dashboard, ids: string[]): string[] =>
  inDrawingOrder(dashboard.items, ids).filter(
    (id) =>
      !ancestors(dashboard.items, id).some((container) =>
        ids.includes(container.id)
      )
  );

/** Copies the selection, with everything inside each element. */
export const copyItems = (
  dashboard: Dashboard,
  ids: string[]
): ClipboardData => ({
  items: topmost(dashboard, ids).flatMap((id) => {
    const found = locate(dashboard.items, id);
    if (!found) return [];
    const copy = structuredClone(found.item);
    translateItem(copy, found.offset.x, found.offset.y);
    return [copy];
  }),
});

/** Gives an element, and everything in it, new ids and the next default names. */
const renew = (item: StudioItem, pool: StudioItem[]): void => {
  item.id = createId();
  item.name = defaultItemName(pool, itemType(item));
  pool.push(item);
  if (isContainer(item)) {
    for (const child of item.children) renew(child, pool);
  }
};

/** Where a paste goes: into a container, or next to an element, or at the top level. */
export interface PasteTarget {
  parentId?: string;
  /** Put the copies directly above this element. */
  afterId?: string;
}

/**
 * Where to paste, given the selection: into the selected container, else next to the
 * selected element in its container, else at the top level. A group is not pasted into;
 * that needs it entered.
 */
export const pasteTarget = (
  dashboard: Dashboard,
  selection: string[]
): PasteTarget => {
  const mainId = selection.at(-1);
  const found = mainId ? locate(dashboard.items, mainId) : undefined;
  if (!found) return {};
  if (found.item.kind === "container" && !found.item.grouped) {
    return { parentId: found.item.id };
  }
  return { parentId: found.parent?.id, afterId: found.item.id };
};

const originOf = (
  dashboard: Dashboard,
  parentId: string | undefined
): Offset => {
  const found = parentId ? locate(dashboard.items, parentId) : undefined;
  if (!found || !isContainer(found.item)) return { x: 0, y: 0 };
  return { x: found.offset.x + found.item.x, y: found.offset.y + found.item.y };
};

/** The box around everything on the clipboard, on the display. */
export const clipboardBox = (data: ClipboardData): ItemBounds | undefined =>
  data.items.length > 0
    ? boundingBox(data.items.map((item) => itemBounds(item)))
    : undefined;

/**
 * Pastes the clipboard. The copies are moved by `delta` (or so that their box starts at
 * `anchor`), get new ids and names, and are selected by the caller from the returned ids.
 */
export const pasteItems = (
  dashboard: Dashboard,
  data: ClipboardData,
  target: PasteTarget,
  placement: { delta: Offset } | { anchor: Offset }
): string[] => {
  const box = clipboardBox(data);
  if (!box) return [];
  const delta =
    "anchor" in placement
      ? { x: placement.anchor.x - box.x, y: placement.anchor.y - box.y }
      : placement.delta;
  const origin = originOf(dashboard, target.parentId);
  const pool = allItems(dashboard.items);
  const parent = target.parentId
    ? locate(dashboard.items, target.parentId)?.item
    : undefined;
  const list =
    parent && isContainer(parent) ? parent.children : dashboard.items;
  const after = target.afterId
    ? list.findIndex((item) => item.id === target.afterId)
    : -1;
  let at = after >= 0 ? after + 1 : list.length;
  return data.items.map((source) => {
    const copy = structuredClone(source);
    translateItem(copy, delta.x - origin.x, delta.y - origin.y);
    renew(copy, pool);
    list.splice(at, 0, copy);
    at += 1;
    return copy.id;
  });
};

/**
 * Duplicates the selection: each copy goes directly above its original, in the same
 * container, moved by `COPY_OFFSET`. Returns the ids of the copies.
 */
export const duplicateItems = (
  dashboard: Dashboard,
  ids: string[]
): string[] => {
  const pool = allItems(dashboard.items);
  return topmost(dashboard, ids).flatMap((id) => {
    const found = locate(dashboard.items, id);
    if (!found) return [];
    const copy = structuredClone(found.item);
    translateItem(copy, COPY_OFFSET, COPY_OFFSET);
    renew(copy, pool);
    found.siblings.splice(found.siblings.indexOf(found.item) + 1, 0, copy);
    return [copy.id];
  });
};

/** The box of an element on the display, for placing a paste at the pointer. */
export const displayBoxOf = (
  dashboard: Dashboard,
  id: string
): ItemBounds | undefined => {
  const found = locate(dashboard.items, id);
  return found ? absoluteBox(itemBounds(found.item), found.offset) : undefined;
};
