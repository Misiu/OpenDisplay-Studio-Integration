import type { ItemBounds } from "./types";

/**
 * Snapping while an element is moved, after lvgl.espboards.dev: the left, centre and right
 * edges (and the top, middle and bottom) of the moved box are pulled to the same lines of
 * its siblings and of its parent when they come close, and the lines it then shares are
 * drawn as guides. Pure, in display pixels.
 */

/** How close an edge or centre must come to a sibling's before it is pulled to it. */
export const SIBLING_THRESHOLD = 5;
/** How close to the centre lines and edges of the parent, which are stronger. */
export const PARENT_THRESHOLD = 8;
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
  source: "sibling" | "parent";
}

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
      for (const own of linesOf(moved, axis)) {
        const distance = Math.abs(line - own);
        if (distance <= threshold) {
          found.push({ offset: line - own, distance, source });
        }
      }
    }
  };
  targets.siblings.forEach((box) =>
    consider(box, SIBLING_THRESHOLD, "sibling")
  );
  consider(targets.parent, PARENT_THRESHOLD, "parent");
  return found.sort(compare)[0];
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
  targets: SnapTargets
): { dx: number; dy: number } => ({
  dx: bestCandidate(moved, targets, "x")?.offset ?? 0,
  dy: bestCandidate(moved, targets, "y")?.offset ?? 0,
});

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
        linesOf(other, axis).some((line) => Math.abs(line - own) < SAME_LINE)
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

const uniqueGuides = (guides: Guide[]): Guide[] =>
  guides.filter(
    (guide, index) =>
      guides.findIndex(
        (other) =>
          other.axis === guide.axis &&
          Math.abs(other.position - guide.position) < SAME_LINE
      ) === index
  );
