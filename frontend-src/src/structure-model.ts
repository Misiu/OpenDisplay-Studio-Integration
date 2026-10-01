import { itemType } from "./item-names";
import { allItems, ancestors, isContainer } from "./tree";
import type { StudioItem } from "./types";

/** One line of the layer tree. */
export interface Row {
  item: StudioItem;
  /** How deep the row is nested; a top-level item has depth 0. */
  depth: number;
}

const matches = (item: StudioItem, query: string): boolean =>
  `${item.name} ${itemType(item)}`.toLocaleLowerCase().includes(query);

/** The ids to show while searching: what matches, and everything above what matches. */
const idsForSearch = (items: StudioItem[], query: string): Set<string> => {
  const shown = new Set<string>();
  for (const item of allItems(items)) {
    if (!matches(item, query)) continue;
    shown.add(item.id);
    for (const container of ancestors(items, item.id)) shown.add(container.id);
  }
  return shown;
};

const rowsOf = (
  items: StudioItem[],
  depth: number,
  collapsed: Set<string>,
  shown: Set<string> | undefined
): Row[] =>
  [...items].reverse().flatMap((item) => {
    if (shown && !shown.has(item.id)) return [];
    const row: Row = { item, depth };
    if (!isContainer(item)) return [row];
    // A search opens every container that holds a match.
    const open = shown ? true : !collapsed.has(item.id);
    return open
      ? [row, ...rowsOf(item.children, depth + 1, collapsed, shown)]
      : [row];
  });

/**
 * The rows the tree shows, top item first (the layer list shows what is drawn last on
 * top): each container followed by its children unless it is collapsed. A search keeps
 * the rows that match and the containers above them, all open.
 */
export const visibleRows = (
  items: StudioItem[],
  collapsed: Set<string>,
  search = ""
): Row[] => {
  const query = search.trim().toLocaleLowerCase();
  const shown = query ? idsForSearch(items, query) : undefined;
  return rowsOf(items, 0, collapsed, shown);
};

export type DropZone = "before" | "after" | "inside";

/**
 * Where a row is dropped on, by how far down the pointer is in it: the upper quarter is
 * before it (above it in the list), the lower quarter after it, and the middle half of a
 * container is inside it. On an element that cannot hold others the halves decide.
 */
export const dropZone = (fraction: number, holdsItems: boolean): DropZone => {
  if (holdsItems && fraction >= 0.25 && fraction <= 0.75) return "inside";
  return fraction < 0.5 ? "before" : "after";
};

/** The row above or below the selected one, or the first row when nothing is selected. */
export const neighbour = (
  rows: Row[],
  selectedId: string,
  step: 1 | -1
): Row | undefined => {
  const index = rows.findIndex((row) => row.item.id === selectedId);
  if (index < 0) return rows[0];
  return rows[Math.min(rows.length - 1, Math.max(0, index + step))];
};
