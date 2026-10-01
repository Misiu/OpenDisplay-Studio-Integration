import { itemBounds, translateItem } from "./geometry";
import { locate } from "./tree";
import type { Dashboard, ItemBounds, StudioItem } from "./types";

/** Whether an item may be moved: not locked, not pinned by an expression. */
export type Movable = (item: StudioItem) => boolean;

/**
 * Moves the selection by (dx, dy) display pixels. What moves may hang out of the working
 * area, as far as its own size beyond each edge, but not farther. Items that cannot move
 * stay put. Returns whether anything moved.
 */
export const nudgeItems = (
  dashboard: Dashboard,
  ids: string[],
  dx: number,
  dy: number,
  area: ItemBounds,
  movable: Movable
): boolean => {
  const moving = ids.flatMap((id) => {
    const found = locate(dashboard.items, id);
    return found && !found.item.locked && movable(found.item) ? [found] : [];
  });
  if (moving.length === 0) return false;
  const boxes = moving.map((found) => ({
    x: itemBounds(found.item).x + found.offset.x,
    y: itemBounds(found.item).y + found.offset.y,
    width: itemBounds(found.item).width,
    height: itemBounds(found.item).height,
  }));
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  const stepX = Math.min(
    Math.max(dx, area.x - (right - left) - left),
    area.x + area.width - left
  );
  const stepY = Math.min(
    Math.max(dy, area.y - (bottom - top) - top),
    area.y + area.height - top
  );
  if (stepX === 0 && stepY === 0) return false;
  for (const { item } of moving) translateItem(item, stepX, stepY);
  return true;
};
