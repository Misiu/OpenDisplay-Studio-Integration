import type { StudioItem } from "./types";

/** The catalog type an item was made from: the widget id or the primitive type. */
export const itemType = (item: StudioItem): string =>
  item.kind === "widget" ? item.widget.type : item.primitive.type;

/**
 * The default name of a new item: `<type>_<n>`, numbered per type. It skips a
 * number when an existing item already uses that name, as the backend does.
 */
export const defaultItemName = (items: StudioItem[], type: string): string => {
  const taken = new Set(items.map((item) => item.name));
  const sameType = items.filter((item) => itemType(item) === type).length;
  let number = sameType + 1;
  while (taken.has(`${type}_${number}`)) number += 1;
  return `${type}_${number}`;
};
