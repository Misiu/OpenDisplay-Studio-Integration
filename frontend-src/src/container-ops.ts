import { defaultItemName } from "./item-names";
import { createId } from "./ids";
import { itemBounds, translateItem } from "./geometry";
import {
  allItems,
  ancestors,
  commonParent,
  inDrawingOrder,
  isContainer,
  locate,
  moveItem,
} from "./tree";
import type {
  ContainerBackground,
  ContainerItem,
  Dashboard,
  ItemBounds,
  StudioItem,
} from "./types";

export const CONTAINER_TYPE = "container";
export const DEFAULT_CONTAINER_SIZE = 100;

export const defaultBackground = (): ContainerBackground => ({
  fill: "white",
  outline: "black",
  width: 1,
  radius: 0,
});

/** A plain container centred on (x, y) with the default look: white, black outline. */
export const createContainerItem = (
  dashboard: Dashboard,
  x: number,
  y: number
): ContainerItem => ({
  id: createId(),
  name: defaultItemName(allItems(dashboard.items), CONTAINER_TYPE),
  kind: "container",
  locked: false,
  hidden: false,
  x: Math.round(x - DEFAULT_CONTAINER_SIZE / 2),
  y: Math.round(y - DEFAULT_CONTAINER_SIZE / 2),
  width: DEFAULT_CONTAINER_SIZE,
  height: DEFAULT_CONTAINER_SIZE,
  grouped: false,
  background: defaultBackground(),
  children: [],
});

/** The box that contains every box given. */
export const boundingBox = (boxes: ItemBounds[]): ItemBounds => {
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
};

/** What the backend measured for an item, if it has rendered it. */
export type Measure = (item: StudioItem) => ItemBounds | undefined;

/** Whether `Make group` applies: items of one parent, or one plain container. */
export const canGroup = (dashboard: Dashboard, ids: string[]): boolean => {
  if (!commonParent(dashboard.items, ids)) return false;
  const [only] = ids;
  const item = only ? locate(dashboard.items, only)?.item : undefined;
  if (ids.length === 1 && item && isContainer(item)) return !item.grouped;
  return ids.every((id) => !locate(dashboard.items, id)?.item.locked);
};

export const canUngroup = (dashboard: Dashboard, id: string): boolean => {
  const item = locate(dashboard.items, id)?.item;
  return item !== undefined && isContainer(item) && item.grouped;
};

/**
 * Makes a group. Several items of one parent are wrapped in a new group the size of
 * their bounding box, placed where the topmost of them was; each keeps its place on
 * screen. A single plain container just loses its background and becomes a group.
 * Returns the id of the group, or undefined when nothing could be grouped.
 */
export const groupItems = (
  dashboard: Dashboard,
  ids: string[],
  measure: Measure = () => undefined
): string | undefined => {
  if (!canGroup(dashboard, ids)) return undefined;
  const [only] = ids;
  const single = only ? locate(dashboard.items, only)?.item : undefined;
  if (ids.length === 1 && single && isContainer(single)) {
    single.grouped = true;
    single.background = null;
    return single.id;
  }
  const ordered = inDrawingOrder(dashboard.items, ids);
  const members = ordered.flatMap(
    (id) => locate(dashboard.items, id)?.item ?? []
  );
  const box = boundingBox(
    members.map((item) => itemBounds(item, measure(item)))
  );
  const first = locate(dashboard.items, ordered[0] ?? "");
  const last = locate(dashboard.items, ordered[ordered.length - 1] ?? "");
  if (!first || !last) return undefined;
  const siblings = first.siblings;
  const index = last.index - (members.length - 1);
  const group: ContainerItem = {
    id: createId(),
    name: defaultItemName(allItems(dashboard.items), CONTAINER_TYPE),
    kind: "container",
    locked: false,
    hidden: false,
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    grouped: true,
    background: null,
    children: members,
  };
  for (const member of members) {
    const at = siblings.indexOf(member);
    siblings.splice(at, 1);
    translateItem(member, -box.x, -box.y);
  }
  siblings.splice(index, 0, group);
  return group.id;
};

/**
 * Dissolves a group: its children move to the group's parent, at the group's place and
 * in the same order, and stay where they are on screen. Returns their ids.
 */
export const ungroupItem = (dashboard: Dashboard, id: string): string[] => {
  const found = locate(dashboard.items, id);
  if (!found || !isContainer(found.item) || !found.item.grouped) return [];
  const group = found.item;
  for (const child of group.children) translateItem(child, group.x, group.y);
  found.siblings.splice(found.index, 1, ...group.children);
  return group.children.map((child) => child.id);
};

/** Adds `dx`/`dy` to the coordinates an item stores. */
const shift = translateItem;

/**
 * Puts a new item, whose coordinates are display coordinates, into a container (the top
 * level when `parentId` is undefined) as its last child and keeps it where it is on screen.
 */
export const insertOnDisplay = (
  dashboard: Dashboard,
  item: StudioItem,
  parentId: string | undefined
): void => {
  const found = parentId ? locate(dashboard.items, parentId) : undefined;
  if (!found || !isContainer(found.item)) {
    dashboard.items.push(item);
    return;
  }
  shift(
    item,
    -(found.offset.x + found.item.x),
    -(found.offset.y + found.item.y)
  );
  found.item.children.push(item);
};

/**
 * Moves an item to the container it was dropped on (the top level for undefined),
 * keeping it where it is on screen. Dropped into a container it becomes the last child;
 * taken out of one, it goes directly above the container it was taken out of.
 */
export const reparentByDrop = (
  dashboard: Dashboard,
  id: string,
  parentId: string | undefined
): void => {
  const from = locate(dashboard.items, id);
  if (!from || from.parent?.id === parentId) return;
  const leaving =
    parentId === undefined
      ? topLevelAncestor(dashboard, id)
      : ancestorChildOf(dashboard, id, parentId);
  moveItem(dashboard, id, parentId, shift);
  if (!leaving) return;
  const placed = locate(dashboard.items, id);
  const anchor = locate(dashboard.items, leaving.id);
  if (!placed || !anchor || placed.siblings !== anchor.siblings) return;
  placed.siblings.splice(placed.index, 1);
  const at = locate(dashboard.items, leaving.id);
  at?.siblings.splice((at?.index ?? 0) + 1, 0, placed.item);
};

/** The item at the top level that contains `id`, when `id` is inside a container. */
const topLevelAncestor = (
  dashboard: Dashboard,
  id: string
): StudioItem | undefined => {
  const chain = ancestors(dashboard.items, id);
  return chain[chain.length - 1];
};

/** The direct child of `parentId` that `id` is inside, if `parentId` is above it. */
const ancestorChildOf = (
  dashboard: Dashboard,
  id: string,
  parentId: string
): StudioItem | undefined => {
  const chain = ancestors(dashboard.items, id);
  const index = chain.findIndex((container) => container.id === parentId);
  return index > 0 ? chain[index - 1] : undefined;
};

/** Sets the background of a plain container; a group has none and is left alone. */
export const setContainerBackground = (
  dashboard: Dashboard,
  id: string,
  background: ContainerBackground | null
): void => {
  const item = locate(dashboard.items, id)?.item;
  if (item && isContainer(item) && !item.grouped && !item.locked) {
    item.background = background;
  }
};
