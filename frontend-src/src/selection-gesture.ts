import { boundingBox } from "./container-ops";
import {
  itemBounds,
  transformItem,
  translateItem,
  workingArea,
  type ResizeItemOptions,
} from "./geometry";
import { remeasured } from "./primitive-shape";
import type { ResizeHandle } from "./resize";
import {
  absoluteBox,
  containerBox,
  intersects,
  isContainer,
  locate,
  withOffsets,
  type Offset,
} from "./tree";
import {
  alignmentGuides,
  draggedEdge,
  resizeSnapAdjustment,
  snapAdjustment,
  spacingMarks,
  type Guide,
  type SnapTargets,
  type SpacingMark,
  type StickyState,
} from "./snapping";
import type { Dashboard, ItemBounds, StudioItem } from "./types";

/**
 * What the backend measured for an item. `absolute` marks a box whose place, not only
 * whose size, is the backend's: an element positioned by an expression is where the
 * expression put it, which the panel cannot work out from the stored literal.
 */
export interface MeasuredBox extends ItemBounds {
  absolute?: boolean;
}

/** What the backend measured for an item, if it has rendered it. */
export type MeasuredBounds = (item: StudioItem) => MeasuredBox | undefined;

/** The box of an item on the display, from its fields or, where it is driven, the backend's. */
export const displayBoxOf = (
  item: StudioItem,
  offset: Offset,
  measured?: MeasuredBox
): ItemBounds => {
  if (measured?.absolute) {
    return {
      x: measured.x,
      y: measured.y,
      width: measured.width,
      height: measured.height,
    };
  }
  return absoluteBox(itemBounds(item, measured), offset);
};

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

/** The box around the targets as they were when the drag began, on the display. */
const targetsBox = (targets: MoveTarget[]): ItemBounds =>
  boundingBox(
    targets.map((target) =>
      absoluteBox(itemBounds(target.original, target.measured), target.offset)
    )
  );

export interface SnappedResize {
  item: StudioItem;
  /** The lines the dragged edges now share with siblings and the parent. */
  guides: Guide[];
}

/** The box of `item` on the display; text and codes take the size they were measured at. */
const resizedBox = (
  original: StudioItem,
  item: StudioItem,
  measured: ItemBounds | undefined,
  offset: Offset
): ItemBounds => {
  const size =
    measured && original.kind === "primitive" && item.kind === "primitive"
      ? remeasured(original.primitive, item.primitive, measured)
      : measured;
  return absoluteBox(itemBounds(item, size), offset);
};

/**
 * `original` resized by dragging `handle` by (dx, dy). With `targets`, the dragged edges
 * are pulled onto the lines of the siblings and the parent when they come close, and the
 * lines they then share are returned as guides. Without them it is the plain resize.
 */
export const resizeWithSnapping = (
  original: StudioItem,
  handle: ResizeHandle,
  shiftKey: boolean,
  delta: { dx: number; dy: number },
  dashboard: Dashboard,
  options: ResizeItemOptions,
  targets?: SnapTargets
): SnappedResize => {
  const offset = options.offset ?? { x: 0, y: 0 };
  const run = (dx: number, dy: number, snapEnabled: boolean): StudioItem =>
    transformItem(
      original,
      { mode: "resize", handle, shiftKey },
      dx,
      dy,
      dashboard,
      { ...options, snapEnabled }
    );
  const boxOf = (item: StudioItem): ItemBounds =>
    resizedBox(original, item, options.measured, offset);
  const first = run(delta.dx, delta.dy, options.snapEnabled);
  if (!targets || !options.snapEnabled) return { item: first, guides: [] };
  const firstBox = boxOf(first);
  const pull = resizeSnapAdjustment(firstBox, handle, targets);
  if (pull.dx === 0 && pull.dy === 0) {
    return { item: first, guides: alignmentGuides(firstBox, targets) };
  }
  // The grid has already rounded the edges; ask for them where they are, plus the pull,
  // and without the grid so it does not round the pull away.
  const startBox = boxOf(original);
  const moved = (axis: "x" | "y"): number =>
    (draggedEdge(firstBox, handle, axis) ?? 0) -
    (draggedEdge(startBox, handle, axis) ?? 0);
  const pulled = run(moved("x") + pull.dx, moved("y") + pull.dy, false);
  return { item: pulled, guides: alignmentGuides(boxOf(pulled), targets) };
};

/**
 * What the moved items snap to: the visible siblings of the main item and the box they
 * live in, a container or the working area, all on the display.
 */
export const snapTargetsFor = (
  dashboard: Dashboard,
  movingIds: string[],
  primaryId: string,
  measure: MeasuredBounds
): SnapTargets | undefined => {
  const primary = locate(dashboard.items, primaryId);
  if (!primary) return undefined;
  const parentId = primary.parent?.id;
  const siblings = withOffsets(dashboard.items)
    .filter((placed) => placed.parent?.id === parentId)
    .filter((placed) => !placed.item.hidden)
    .filter((placed) => !movingIds.includes(placed.item.id))
    .flatMap((placed) => {
      const box = isContainer(placed.item)
        ? containerBox(placed)
        : absoluteBox(
            itemBounds(placed.item, measure(placed.item)),
            placed.offset
          );
      return box ? [box] : [];
    });
  const parent = primary.parent
    ? parentBox(dashboard, primary.parent.id)
    : workingArea(dashboard);
  return parent ? { siblings, parent } : undefined;
};

const parentBox = (
  dashboard: Dashboard,
  id: string
): ItemBounds | undefined => {
  const found = locate(dashboard.items, id);
  return found && isContainer(found.item)
    ? absoluteBox(itemBounds(found.item), found.offset)
    : undefined;
};

/**
 * The selection `dx`/`dy` display pixels into a drag. The main item snaps to the grid
 * and stays in the working area; every other item moves by exactly as much as it did,
 * so a selection keeps its shape. With `snap`, the selection is pulled to the lines of its
 * siblings and parent that come within reach, which takes the place of the grid there.
 */
export const moveSelection = (
  targets: MoveTarget[],
  primaryId: string,
  dx: number,
  dy: number,
  dashboard: Dashboard,
  snapEnabled: boolean,
  snap?: SnapTargets,
  sticky?: StickyState
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
  let actualX = after.x - before.x;
  let actualY = after.y - before.y;
  if (snap && snapEnabled && !primary.original.locked) {
    const box = targetsBox(targets);
    const pull = snapAdjustment(
      { ...box, x: box.x + dx, y: box.y + dy },
      snap,
      sticky
    );
    if (pull.dx !== 0) actualX = dx + pull.dx;
    if (pull.dy !== 0) actualY = dy + pull.dy;
  }
  return targets.map((target) => {
    if (
      target.original.id === primaryId &&
      actualX === after.x - before.x &&
      actualY === after.y - before.y
    ) {
      return moved;
    }
    const copy = structuredClone(target.original);
    if (!copy.locked) translateItem(copy, actualX, actualY);
    return copy;
  });
};

/** The guides for the lines the moved items share with their siblings and parent. */
export const movedGuides = (
  targets: MoveTarget[],
  moved: StudioItem[],
  snap: SnapTargets
): Guide[] => {
  const boxes = targets.flatMap((target) => {
    const item = moved.find((entry) => entry.id === target.original.id);
    return item
      ? [absoluteBox(itemBounds(item, target.measured), target.offset)]
      : [];
  });
  return boxes.length > 0 ? alignmentGuides(boundingBox(boxes), snap) : [];
};

/** The badges for the equal gaps between the moved items and their siblings. */
export const movedSpacing = (
  targets: MoveTarget[],
  moved: StudioItem[],
  snap: SnapTargets
): SpacingMark[] => {
  const boxes = targets.flatMap((target) => {
    const item = moved.find((entry) => entry.id === target.original.id);
    return item
      ? [absoluteBox(itemBounds(item, target.measured), target.offset)]
      : [];
  });
  return boxes.length > 0
    ? spacingMarks(boundingBox(boxes), snap.siblings)
    : [];
};

/** The box of an item on the display. */
export const displayBox = (
  dashboard: Dashboard,
  id: string,
  measure: MeasuredBounds
): ItemBounds | undefined => {
  const found = locate(dashboard.items, id);
  if (!found) return undefined;
  return displayBoxOf(found.item, found.offset, measure(found.item));
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
        : displayBoxOf(placed.item, placed.offset, measure(placed.item));
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
