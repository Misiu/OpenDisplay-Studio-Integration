import type { ResizeHandle } from "./resize";
import type { ItemBounds } from "./types";

/**
 * Snapping while an element is moved, after the reference designer: the left, centre and right
 * edges (and the top, middle and bottom) of the moved box are pulled to the same lines of
 * its siblings and of its parent when they come close, and the lines it then shares are
 * drawn as guides. Pure, in display pixels.
 */

/** How close an edge or centre must come to a sibling's before it is pulled to it. */
export const SIBLING_THRESHOLD = 5;
/** How close to the centre lines and edges of the parent, which are stronger. */
export const PARENT_THRESHOLD = 8;
/** How close the moved box has to come to the middle of the gap between two siblings. */
export const SPACING_THRESHOLD = 8;
/** Two gaps count as equal, and get their badges, when they differ by no more than this. */
export const EQUAL_GAP_TOLERANCE = 3;
/** A box held by a line of its parent stays held until it is this far from it. */
export const STICKY_RELEASE = 12;
/** A parent line wins a tie with a sibling line when it is no more than this farther. */
const PARENT_PREFERENCE = 2;

export type Axis = "x" | "y";

/** A line the moved box shares with something else. */
export interface Guide {
  axis: Axis;
  /** Where the line is: an x for a vertical line, a y for a horizontal one. */
  position: number;
  /** Where the line starts and ends along the other axis. */
  from: number;
  to: number;
}

export interface SnapTargets {
  /** The visible siblings of the moved items. */
  siblings: ItemBounds[];
  /** The box the items live in: a container, or the working area. */
  parent: ItemBounds;
}

interface Candidate {
  /** How far the moved box has to move to sit on the line. */
  offset: number;
  distance: number;
  source: "sibling" | "parent" | "spacing";
  /** For a line of the parent: which line of the moved box (0 start, 1 middle, 2 end) and where. */
  own?: number;
  line?: number;
}

/**
 * What an axis is held by, per gesture: the line of the parent the box was pulled to, which
 * it keeps until the pointer takes it `STICKY_RELEASE` pixels away. Filled in by
 * `snapAdjustment`.
 */
export type StickyState = Partial<Record<Axis, { own: number; line: number }>>;

const start = (box: ItemBounds, axis: Axis): number =>
  axis === "x" ? box.x : box.y;

const length = (box: ItemBounds, axis: Axis): number =>
  axis === "x" ? box.width : box.height;

/** The three lines of a box along an axis: its start, its middle and its end. */
export const linesOf = (box: ItemBounds, axis: Axis): number[] => {
  const first = start(box, axis);
  const size = length(box, axis);
  return [first, first + size / 2, first + size];
};

/** The best pull along one axis: the closest line within reach, parents preferred. */
const bestCandidate = (
  moved: ItemBounds,
  targets: SnapTargets,
  axis: Axis
): Candidate | undefined => {
  const found: Candidate[] = [];
  const consider = (
    box: ItemBounds,
    threshold: number,
    source: Candidate["source"]
  ) => {
    for (const line of linesOf(box, axis)) {
      linesOf(moved, axis).forEach((own, index) => {
        const distance = Math.abs(line - own);
        if (distance <= threshold) {
          found.push({
            offset: Math.round(line - own),
            distance,
            source,
            own: index,
            line,
          });
        }
      });
    }
  };
  targets.siblings.forEach((box) =>
    consider(box, SIBLING_THRESHOLD, "sibling")
  );
  consider(targets.parent, PARENT_THRESHOLD, "parent");
  found.push(...spacingCandidates(moved, targets.siblings, axis));
  return found.sort(compare)[0];
};

/** Whether two boxes share some of their extent along `axis`. */
const overlaps = (first: ItemBounds, second: ItemBounds, axis: Axis): boolean =>
  start(first, axis) < start(second, axis) + length(second, axis) &&
  start(second, axis) < start(first, axis) + length(first, axis);

/**
 * Where the moved box would sit with the same gap on both sides: between two siblings,
 * one before it and one after it along the axis, that both lie in its row (or column).
 */
const spacingCandidates = (
  moved: ItemBounds,
  siblings: ItemBounds[],
  axis: Axis
): Candidate[] => {
  const across: Axis = axis === "x" ? "y" : "x";
  const neighbours = siblings.filter((box) => overlaps(box, moved, across));
  const found: Candidate[] = [];
  for (const before of neighbours) {
    for (const after of neighbours) {
      const room =
        start(after, axis) -
        (start(before, axis) + length(before, axis)) -
        length(moved, axis);
      if (room < 0) continue;
      const ideal = start(before, axis) + length(before, axis) + room / 2;
      const distance = Math.abs(ideal - start(moved, axis));
      if (distance <= SPACING_THRESHOLD) {
        found.push({
          offset: Math.round(ideal - start(moved, axis)),
          distance,
          source: "spacing",
        });
      }
    }
  }
  return found;
};

const rank = (candidate: Candidate): number =>
  candidate.distance - (candidate.source === "parent" ? PARENT_PREFERENCE : 0);

/** The nearer line first; on a tie the parent's. */
const compare = (first: Candidate, second: Candidate): number =>
  rank(first) - rank(second) ||
  Number(second.source === "parent") - Number(first.source === "parent");

/**
 * How far to move `moved` so it sits on the nearest line, per axis; zero where nothing is
 * within reach. The result is added to the position the pointer asked for.
 */
export const snapAdjustment = (
  moved: ItemBounds,
  targets: SnapTargets,
  sticky?: StickyState
): { dx: number; dy: number } => ({
  dx: adjustAxis(moved, targets, "x", sticky),
  dy: adjustAxis(moved, targets, "y", sticky),
});

/**
 * The pull along one axis. A box that was pulled to a line of the parent keeps to it while
 * it is within `STICKY_RELEASE` of it, unless something nearer comes within reach.
 */
const adjustAxis = (
  moved: ItemBounds,
  targets: SnapTargets,
  axis: Axis,
  sticky?: StickyState
): number => {
  const best = bestCandidate(moved, targets, axis);
  const held = sticky?.[axis];
  if (held) {
    const own = linesOf(moved, axis)[held.own];
    const distance = Math.abs(held.line - own);
    if (distance <= STICKY_RELEASE && (!best || best.distance >= distance)) {
      return Math.round(held.line - own);
    }
  }
  if (sticky) {
    if (
      best?.source === "parent" &&
      best.own !== undefined &&
      best.line !== undefined
    ) {
      sticky[axis] = { own: best.own, line: best.line };
    } else {
      delete sticky[axis];
    }
  }
  return best?.offset ?? 0;
};

/** The lines of `targets` an edge can be pulled to, with how close it has to be. */
const edgeCandidates = (
  edge: number,
  targets: SnapTargets,
  axis: Axis
): Candidate[] => {
  const found: Candidate[] = [];
  const consider = (
    box: ItemBounds,
    threshold: number,
    source: Candidate["source"]
  ) => {
    for (const line of linesOf(box, axis)) {
      const distance = Math.abs(line - edge);
      if (distance <= threshold) {
        found.push({ offset: Math.round(line - edge), distance, source });
      }
    }
  };
  targets.siblings.forEach((box) =>
    consider(box, SIBLING_THRESHOLD, "sibling")
  );
  consider(targets.parent, PARENT_THRESHOLD, "parent");
  return found;
};

/** The position of the edge `handle` drags along an axis, or undefined when it drags none. */
export const draggedEdge = (
  box: ItemBounds,
  handle: ResizeHandle,
  axis: Axis
): number | undefined => {
  const [low, high] = axis === "x" ? ["w", "e"] : ["n", "s"];
  if (handle.includes(low)) return start(box, axis);
  if (handle.includes(high)) return start(box, axis) + length(box, axis);
  return undefined;
};

/**
 * How far to add to the pointer's movement while `handle` resizes `box`, so the edges being
 * dragged sit on a line of a sibling or of the parent. Only the dragged edges are pulled,
 * and only along the axes the handle moves.
 */
export const resizeSnapAdjustment = (
  box: ItemBounds,
  handle: ResizeHandle,
  targets: SnapTargets
): { dx: number; dy: number } => {
  const pull = (axis: Axis): number => {
    const edge = draggedEdge(box, handle, axis);
    if (edge === undefined) return 0;
    return edgeCandidates(edge, targets, axis).sort(compare)[0]?.offset ?? 0;
  };
  return { dx: pull("x"), dy: pull("y") };
};

/** Whole pixels only, so a centre of an odd-sized box is the pixel nearest to it. */
const SAME_LINE = 0.5;

/** The guides for every line `box` shares with a sibling or its parent. */
export const alignmentGuides = (
  box: ItemBounds,
  targets: SnapTargets
): Guide[] => {
  const guides: Guide[] = [];
  const others = [...targets.siblings, targets.parent];
  for (const axis of ["x", "y"] as const) {
    const across: Axis = axis === "x" ? "y" : "x";
    for (const own of linesOf(box, axis)) {
      const sharing = others.filter((other) =>
        linesOf(other, axis).some((line) => Math.abs(line - own) <= SAME_LINE)
      );
      if (sharing.length === 0) continue;
      const spans = [box, ...sharing].map((entry) => [
        start(entry, across),
        start(entry, across) + length(entry, across),
      ]);
      guides.push({
        axis,
        position: own,
        from: Math.min(...spans.map(([from]) => from)),
        to: Math.max(...spans.map(([, to]) => to)),
      });
    }
  }
  return uniqueGuides(guides);
};

/** The gap between two siblings the moved box sits between, drawn with its size. */
export interface SpacingMark {
  axis: Axis;
  /** Where the gap starts and ends along the axis. */
  from: number;
  to: number;
  /** Where to draw it across the axis: the middle of the moved box. */
  across: number;
}

/** The nearest sibling on each side of `box` along `axis`, among those in its row or column. */
const neighbourSides = (
  box: ItemBounds,
  siblings: ItemBounds[],
  axis: Axis
): { before?: ItemBounds; after?: ItemBounds } => {
  const across: Axis = axis === "x" ? "y" : "x";
  const row = siblings.filter((other) => overlaps(other, box, across));
  const end = (other: ItemBounds): number =>
    start(other, axis) + length(other, axis);
  const before = row
    .filter((other) => end(other) <= start(box, axis))
    .sort((first, second) => end(second) - end(first))[0];
  const after = row
    .filter(
      (other) => start(other, axis) >= start(box, axis) + length(box, axis)
    )
    .sort((first, second) => start(first, axis) - start(second, axis))[0];
  return { before, after };
};

/**
 * The two gaps on either side of `box` along each axis, when they are equal within
 * `EQUAL_GAP_TOLERANCE`: what the spacing badges show.
 */
export const spacingMarks = (
  box: ItemBounds,
  siblings: ItemBounds[]
): SpacingMark[] => {
  const marks: SpacingMark[] = [];
  for (const axis of ["x", "y"] as const) {
    const { before, after } = neighbourSides(box, siblings, axis);
    if (!before || !after) continue;
    const beforeEnd = start(before, axis) + length(before, axis);
    const afterStart = start(after, axis);
    const first = start(box, axis) - beforeEnd;
    const second = afterStart - (start(box, axis) + length(box, axis));
    if (Math.abs(first - second) > EQUAL_GAP_TOLERANCE) continue;
    const across: Axis = axis === "x" ? "y" : "x";
    const middle = start(box, across) + length(box, across) / 2;
    marks.push(
      { axis, from: beforeEnd, to: start(box, axis), across: middle },
      {
        axis,
        from: start(box, axis) + length(box, axis),
        to: afterStart,
        across: middle,
      }
    );
  }
  return marks;
};

const uniqueGuides = (guides: Guide[]): Guide[] =>
  guides.filter(
    (guide, index) =>
      guides.findIndex(
        (other) =>
          other.axis === guide.axis &&
          Math.abs(other.position - guide.position) <= SAME_LINE
      ) === index
  );
