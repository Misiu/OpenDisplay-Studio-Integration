import { anchorFraction } from "./anchor";
import { itemBounds, translateItem, workingArea } from "./geometry";
import { locate } from "./tree";
import type { Dashboard, ItemBounds } from "./types";

/**
 * "Align in Parent": put an element at one of nine places of the box it lives in, as the
 * 3 x 3 grid of the reference designer does. The first letter of a place is the column (left,
 * middle, right), the second the row (top, middle, bottom), the same as an anchor.
 */

/** The box an item is placed in, in the coordinates the item stores. */
const parentBox = (
  dashboard: Dashboard,
  itemId: string
): ItemBounds | undefined => {
  const found = locate(dashboard.items, itemId);
  if (!found) return undefined;
  const { parent } = found;
  if (parent) return { x: 0, y: 0, width: parent.width, height: parent.height };
  return workingArea(dashboard);
};

/**
 * Move an element to a place of its parent: a container, or the working area of the
 * display. `measured` is what the backend measured, which text and QR codes need to know
 * their size. A locked element stays where it is.
 */
export const alignInParent = (
  dashboard: Dashboard,
  itemId: string,
  place: string,
  measured?: ItemBounds
): void => {
  const found = locate(dashboard.items, itemId);
  const parent = parentBox(dashboard, itemId);
  if (!found || !parent || found.item.locked) return;
  const bounds = itemBounds(found.item, measured);
  const fraction = anchorFraction(place, "lt");
  const targetX = parent.x + (parent.width - bounds.width) * fraction.x;
  const targetY = parent.y + (parent.height - bounds.height) * fraction.y;
  translateItem(
    found.item,
    Math.round(targetX - bounds.x),
    Math.round(targetY - bounds.y)
  );
};
