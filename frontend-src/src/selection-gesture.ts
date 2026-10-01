import { boundingBox } from "./container-ops";
import { itemBounds, transformItem, translateItem } from "./geometry";
import {
  absoluteBox,
  containerBox,
  intersects,
  isContainer,
  locate,
  withOffsets,
  type Offset,
} from "./tree";
import type { Dashboard, ItemBounds, StudioItem } from "./types";

/** What the backend measured for an item, if it has rendered it. */
export type MeasuredBounds = (item: StudioItem) => ItemBounds | undefined;

/** One item taking part in a drag, as it was when the drag began. */
export interface MoveTarget {
  original: StudioItem;
  /** Where the origin of the container it is in lies on the display. */
  offset: Offset;
  measured?: ItemBounds;
}

/** The targets of a drag: each selected item with where it sits. */
export const moveTargets = (
  dashboard: Dashboard,
  ids: string[],
  measure: MeasuredBounds
): MoveTarget[] =>
  ids.flatMap((id) => {
    const found = locate(dashboard.items, id);
    if (!found) return [];
    return [
      {
        original: structuredClone(found.item),
        offset: found.offset,
        measured: measure(found.item),
      },
    ];
  });

/**
 * The selection `dx`/`dy` display pixels into a drag. The main item snaps to the grid
 * and stays in the working area; every other item moves by exactly as much as it did,
 * so a selection keeps its shape.
 */
export const moveSelection = (
  targets: MoveTarget[],
  primaryId: string,
  dx: number,
  dy: number,
  dashboard: Dashboard,
  snapEnabled: boolean
): StudioItem[] => {
  const primary = targets.find((target) => target.original.id === primaryId);
  if (!primary) return [];
  const moved = transformItem(
    primary.original,
    { mode: "move" },
    dx,
    dy,
    dashboard,
    { snapEnabled, offset: primary.offset, measured: primary.measured }
  );
  const before = itemBounds(primary.original, primary.measured);
  const after = itemBounds(moved, primary.measured);
  const actualX = after.x - before.x;
  const actualY = after.y - before.y;
  return targets.map((target) => {
    if (target.original.id === primaryId) return moved;
    const copy = structuredClone(target.original);
    if (!copy.locked) translateItem(copy, actualX, actualY);
    return copy;
  });
};

/** The box of an item on the display. */
export const displayBox = (
  dashboard: Dashboard,
  id: string,
  measure: MeasuredBounds
): ItemBounds | undefined => {
  const found = locate(dashboard.items, id);
  if (!found) return undefined;
  return absoluteBox(itemBounds(found.item, measure(found.item)), found.offset);
};

/** One box around all the items, on the display. */
export const selectionBox = (
  dashboard: Dashboard,
  ids: string[],
  measure: MeasuredBounds
): ItemBounds | undefined => {
  const boxes = ids.flatMap((id) => displayBox(dashboard, id, measure) ?? []);
  return boxes.length > 0 ? boundingBox(boxes) : undefined;
};

/**
 * The items a marquee touches at the level being edited: the top level, or the children
 * of the group that was entered. A group or container counts as one item.
 */
export const marqueeSelection = (
  dashboard: Dashboard,
  marquee: ItemBounds,
  enteredGroupId: string | undefined,
  measure: MeasuredBounds
): string[] => {
  const entered = enteredGroupId
    ? locate(dashboard.items, enteredGroupId)?.item
    : undefined;
  const level = entered && isContainer(entered) ? entered.id : undefined;
  return withOffsets(dashboard.items)
    .filter((placed) => (placed.parent?.id ?? undefined) === level)
    .filter((placed) => !placed.item.hidden)
    .filter((placed) => {
      const box = isContainer(placed.item)
        ? containerBox(placed)
        : absoluteBox(
            itemBounds(placed.item, measure(placed.item)),
            placed.offset
          );
      return box !== undefined && intersects(box, marquee);
    })
    .map((placed) => placed.item.id);
};

/** The box between two display points, whichever way it was dragged. */
export const boxBetween = (
  from: { x: number; y: number },
  to: { x: number; y: number }
): ItemBounds => ({
  x: Math.min(from.x, to.x),
  y: Math.min(from.y, to.y),
  width: Math.abs(to.x - from.x),
  height: Math.abs(to.y - from.y),
});
