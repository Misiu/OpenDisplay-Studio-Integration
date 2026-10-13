import { boundingBox, type Measure } from "./container-ops";
import { itemBounds, translateItem, workingArea } from "./geometry";
import { absoluteBox, locate } from "./tree";
import type { Dashboard, ItemBounds, StudioItem } from "./types";

/**
 * Aligning and spacing out a selection, as the Align panel of a vector editor does.
 *
 * `align` puts the edges or middles of the items on one line. `distribute` spaces the items
 * so the gaps between neighbours are equal. Both can work against the selection itself, or
 * against the box the items live in (a container, or the working area of the display).
 *
 * Every operation is planned first as a list of moves, which is what the editor needs to
 * know whether anything would change before it records an undo step.
 */

export type AlignEdge =
  "left" | "center" | "right" | "top" | "middle" | "bottom";

export type DistributeAxis = "horizontal" | "vertical";

/** What items are aligned to: the box around them, or the box each one lives in. */
export type AlignTarget = "selection" | "parent";

export interface ArrangeOptions {
  target: AlignTarget;
  /** What the backend measured for an item; text and QR codes need it to know their size. */
  measure: Measure;
  /** Whether an item may be moved: not pinned by an expression. */
  movable: (item: StudioItem) => boolean;
}

export interface Move {
  id: string;
  dx: number;
  dy: number;
}

type Axis = "x" | "y";

/** An item that takes part, with its box on the display and the box it lives in. */
interface Participant {
  id: string;
  box: ItemBounds;
  area: ItemBounds;
}

/** How many items an operation needs before it can change anything. */
export const MINIMUM_ITEMS = {
  align: { selection: 2, parent: 1 },
  distribute: { selection: 3, parent: 2 },
} as const;

const EDGES: Record<AlignEdge, { axis: Axis; fraction: number }> = {
  left: { axis: "x", fraction: 0 },
  center: { axis: "x", fraction: 0.5 },
  right: { axis: "x", fraction: 1 },
  top: { axis: "y", fraction: 0 },
  middle: { axis: "y", fraction: 0.5 },
  bottom: { axis: "y", fraction: 1 },
};

const startOf = (box: ItemBounds, axis: Axis): number =>
  axis === "x" ? box.x : box.y;

const sizeOf = (box: ItemBounds, axis: Axis): number =>
  axis === "x" ? box.width : box.height;

const endOf = (box: ItemBounds, axis: Axis): number =>
  startOf(box, axis) + sizeOf(box, axis);

const moveAlong = (id: string, axis: Axis, delta: number): Move => ({
  id,
  dx: axis === "x" ? delta : 0,
  dy: axis === "y" ? delta : 0,
});

/** The box an item lives in, on the display: its container, or the working area. */
const areaOf = (
  dashboard: Dashboard,
  location: NonNullable<ReturnType<typeof locate>>
): ItemBounds => {
  const { parent, offset } = location;
  if (!parent) return workingArea(dashboard);
  return {
    x: offset.x,
    y: offset.y,
    width: parent.width,
    height: parent.height,
  };
};

/**
 * The items that take part: each once, not locked, not pinned, and not inside another item
 * of the selection (which moves them along with it).
 */
const participants = (
  dashboard: Dashboard,
  ids: string[],
  options: ArrangeOptions
): Participant[] => {
  const chosen = new Set(ids);
  return [...chosen].flatMap((id) => {
    const found = locate(dashboard.items, id);
    if (!found || found.item.locked || !options.movable(found.item)) return [];
    if (hasChosenAncestor(dashboard, id, chosen)) return [];
    const local = itemBounds(found.item, options.measure(found.item));
    return [
      {
        id,
        box: absoluteBox(local, found.offset),
        area: areaOf(dashboard, found),
      },
    ];
  });
};

const hasChosenAncestor = (
  dashboard: Dashboard,
  id: string,
  chosen: Set<string>
): boolean => {
  let current = locate(dashboard.items, id)?.parent;
  while (current) {
    if (chosen.has(current.id)) return true;
    current = locate(dashboard.items, current.id)?.parent;
  }
  return false;
};

const nonZero = (moves: Move[]): Move[] =>
  moves.filter((move) => move.dx !== 0 || move.dy !== 0);

/** The moves that put one edge, or the middle, of every item on a line. */
export const planAlign = (
  dashboard: Dashboard,
  ids: string[],
  edge: AlignEdge,
  options: ArrangeOptions
): Move[] => {
  const items = participants(dashboard, ids, options);
  if (items.length < MINIMUM_ITEMS.align[options.target]) return [];
  const { axis, fraction } = EDGES[edge];
  const shared = boundingBox(items.map((item) => item.box));
  return nonZero(
    items.map((item) => {
      const area = options.target === "parent" ? item.area : shared;
      const free = sizeOf(area, axis) - sizeOf(item.box, axis);
      const wanted = startOf(area, axis) + free * fraction;
      return moveAlong(
        item.id,
        axis,
        Math.round(wanted - startOf(item.box, axis))
      );
    })
  );
};

/** The area a distribution spreads over: the one box the items live in, or the display's. */
const sharedArea = (dashboard: Dashboard, items: Participant[]): ItemBounds => {
  const [first, ...rest] = items.map((item) => item.area);
  const same = rest.every(
    (area) =>
      area.x === first.x &&
      area.y === first.y &&
      area.width === first.width &&
      area.height === first.height
  );
  return same ? first : workingArea(dashboard);
};

/**
 * The moves that make the gaps between neighbours equal. Against the selection the two
 * outermost items stay where they are and the ones between them are spaced out; against the
 * parent the first item goes to one edge of the box, the last to the other.
 */
export const planDistribute = (
  dashboard: Dashboard,
  ids: string[],
  direction: DistributeAxis,
  options: ArrangeOptions
): Move[] => {
  const items = participants(dashboard, ids, options);
  if (items.length < MINIMUM_ITEMS.distribute[options.target]) return [];
  const axis: Axis = direction === "horizontal" ? "x" : "y";
  const ordered = [...items].sort(
    (first, second) =>
      startOf(first.box, axis) - startOf(second.box, axis) ||
      endOf(first.box, axis) - endOf(second.box, axis)
  );
  const span =
    options.target === "parent"
      ? sharedArea(dashboard, items)
      : boundingBox(items.map((item) => item.box));
  const total = ordered.reduce((sum, item) => sum + sizeOf(item.box, axis), 0);
  const gap = (sizeOf(span, axis) - total) / (ordered.length - 1);
  let covered = 0;
  const moves = ordered.map((item, index) => {
    const wanted = Math.round(startOf(span, axis) + covered + gap * index);
    covered += sizeOf(item.box, axis);
    return moveAlong(item.id, axis, wanted - startOf(item.box, axis));
  });
  return nonZero(moves);
};

/** Carry out planned moves. */
export const applyMoves = (dashboard: Dashboard, moves: Move[]): void => {
  for (const move of moves) {
    const found = locate(dashboard.items, move.id);
    if (found) translateItem(found.item, move.dx, move.dy);
  }
};
