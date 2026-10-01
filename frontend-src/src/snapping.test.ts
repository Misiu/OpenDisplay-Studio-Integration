import { describe, expect, it } from "vitest";
import {
  alignmentGuides,
  resizeSnapAdjustment,
  snapAdjustment,
  spacingMarks,
  type SnapTargets,
  type StickyState,
} from "./snapping";

const box = (x: number, y: number, width: number, height: number) => ({
  x,
  y,
  width,
  height,
});

const parent = box(0, 0, 800, 480);
const alone: SnapTargets = { siblings: [], parent };

describe("snapAdjustment", () => {
  it("pulls an edge to the same edge of a sibling that is within five pixels", () => {
    const targets = { siblings: [box(100, 300, 80, 40)], parent };

    expect(snapAdjustment(box(103, 50, 60, 30), targets)).toEqual({
      dx: -3,
      dy: 0,
    });
    expect(snapAdjustment(box(108, 50, 100, 30), targets).dx).toBe(0);
  });

  it("pulls a centre to the centre of a sibling, and an edge to a different edge", () => {
    const targets = { siblings: [box(200, 300, 100, 40)], parent };

    // centre 250 against the sibling's centre 250
    expect(snapAdjustment(box(222, 50, 60, 30), targets).dx).toBe(-2);
    // right edge 300 against the sibling's right edge 300
    expect(snapAdjustment(box(243, 50, 60, 30), targets).dx).toBe(-3);
  });

  it("works along the vertical axis the same way", () => {
    const targets = { siblings: [box(10, 200, 50, 40)], parent };

    expect(snapAdjustment(box(400, 203, 50, 40), targets)).toEqual({
      dx: 0,
      dy: -3,
    });
  });

  it("pulls the centre of the box to the centre lines of the parent within eight pixels", () => {
    expect(snapAdjustment(box(366, 100, 60, 30), alone)).toEqual({
      dx: 4,
      dy: 0,
    });
    expect(snapAdjustment(box(300, 205, 60, 30), alone)).toEqual({
      dx: 0,
      dy: 5,
    });
  });

  it("prefers the line of the parent when a sibling's is no closer than two pixels more", () => {
    const targets = { siblings: [box(404, 300, 10, 10)], parent };

    // The box's centre is 3 from the parent's centre line (400) and 1 from the sibling's edge.
    expect(snapAdjustment(box(373, 50, 60, 30), targets).dx).toBe(-3);
  });

  it("does nothing when no line is within reach", () => {
    const targets = { siblings: [box(100, 300, 80, 40)], parent };

    expect(snapAdjustment(box(500, 50, 60, 30), targets)).toEqual({
      dx: 0,
      dy: 0,
    });
  });
});

describe("alignmentGuides", () => {
  it("draws a vertical line through the centres two boxes share, along both", () => {
    const targets = { siblings: [box(350, 300, 100, 40)], parent };

    const guides = alignmentGuides(box(370, 50, 60, 30), targets);

    expect(guides).toContainEqual({
      axis: "x",
      position: 400,
      from: 0,
      to: 480,
    });
  });

  it("draws a guide per shared line, and none for lines nothing shares", () => {
    const targets = { siblings: [box(100, 300, 80, 40)], parent };

    const guides = alignmentGuides(box(100, 50, 60, 30), targets);

    expect(guides.filter((guide) => guide.axis === "x")).toEqual([
      { axis: "x", position: 100, from: 50, to: 340 },
    ]);
  });

  it("is empty when nothing lines up", () => {
    expect(alignmentGuides(box(21, 33, 17, 9), alone)).toEqual([]);
  });
});

describe("the pull", () => {
  it("is a whole number of pixels, even to the centre of an odd-sized box", () => {
    // A circle 81 px wide near the centre of a canvas 480 px wide: its centre is at 238.5.
    const parent = box(0, 0, 480, 800);
    const pull = snapAdjustment(box(198, 355, 81, 81), {
      siblings: [],
      parent,
    });

    expect(Number.isInteger(pull.dx)).toBe(true);
    expect(Number.isInteger(pull.dy)).toBe(true);
    expect(Math.abs(198 + pull.dx + 40.5 - 240)).toBeLessThanOrEqual(0.5);
  });

  it("still draws a guide for the pixel it settled on", () => {
    const parent = box(0, 0, 480, 800);
    const moved = box(200, 355, 81, 81); // centre 240.5, half a pixel off the centre line

    expect(alignmentGuides(moved, { siblings: [], parent })).toContainEqual(
      expect.objectContaining({ axis: "x", position: 240.5 })
    );
  });
});

describe("resizeSnapAdjustment", () => {
  const sibling = { siblings: [box(300, 300, 100, 40)], parent };

  it("pulls the dragged right edge to a line of a sibling within reach", () => {
    // The right edge is at 253; the sibling's left edge is at 300, its centre at 350.
    expect(resizeSnapAdjustment(box(200, 50, 53, 30), "e", sibling)).toEqual({
      dx: 0,
      dy: 0,
    });
    expect(resizeSnapAdjustment(box(200, 50, 98, 30), "e", sibling)).toEqual({
      dx: 2,
      dy: 0,
    });
  });

  it("pulls the dragged left edge, and only that one", () => {
    // Left edge 297 is 3 from the sibling's 300; the right edge 400 is on a line too.
    expect(resizeSnapAdjustment(box(297, 50, 103, 30), "w", sibling)).toEqual({
      dx: 3,
      dy: 0,
    });
  });

  it("pulls both dragged edges of a corner, each along its own axis", () => {
    const targets = { siblings: [box(300, 300, 100, 40)], parent };

    expect(resizeSnapAdjustment(box(200, 200, 98, 98), "se", targets)).toEqual({
      dx: 2,
      dy: 2,
    });
  });

  it("pulls an edge to the edge of the parent, and leaves the edges not dragged alone", () => {
    // The top edge is 6 from the parent's top, the left edge 3 from its left: only north moves.
    expect(resizeSnapAdjustment(box(3, 6, 60, 60), "n", alone)).toEqual({
      dx: 0,
      dy: -6,
    });
  });
});

describe("snapAdjustment held by the parent", () => {
  it("keeps a box on an edge of the parent until the pointer is twelve pixels away", () => {
    const sticky: StickyState = {};

    // 6 from the left edge: pulled onto it, and remembered.
    expect(snapAdjustment(box(6, 100, 50, 30), alone, sticky).dx).toBe(-6);
    // 11 away: beyond the eight of a fresh pull, but still held.
    expect(snapAdjustment(box(11, 100, 50, 30), alone, sticky).dx).toBe(-11);
    // 13 away: let go.
    expect(snapAdjustment(box(13, 100, 50, 30), alone, sticky).dx).toBe(0);
    // And once let go it does not come back from 11, which is out of reach.
    expect(snapAdjustment(box(11, 100, 50, 30), alone, sticky).dx).toBe(0);
  });

  it("does not hold anything without a state to remember it in", () => {
    expect(snapAdjustment(box(6, 100, 50, 30), alone).dx).toBe(-6);
    expect(snapAdjustment(box(11, 100, 50, 30), alone).dx).toBe(0);
  });

  it("lets go of the parent for a line that is nearer", () => {
    const sticky: StickyState = {};
    const targets = { siblings: [box(206, 300, 40, 40)], parent };
    snapAdjustment(box(6, 100, 50, 30), targets, sticky);

    // 10 from the parent's edge, but 1 from the sibling's left edge.
    expect(snapAdjustment(box(205, 100, 50, 30), targets, sticky).dx).toBe(1);
  });
});

describe("equal spacing", () => {
  const row = {
    siblings: [box(0, 100, 100, 40), box(300, 100, 100, 40)],
    parent: box(0, 0, 800, 480),
  };

  it("pulls a box to the middle of the gap between two siblings of its row", () => {
    // The room between them is 200 wide; a 60 wide box sits best at x 170.
    expect(snapAdjustment(box(165, 100, 60, 40), row).dx).toBe(5);
    expect(snapAdjustment(box(176, 100, 60, 40), row).dx).toBe(-6);
    expect(snapAdjustment(box(185, 100, 60, 40), row).dx).toBe(0);
  });

  it("ignores siblings that are not in its row", () => {
    expect(snapAdjustment(box(165, 300, 60, 40), row).dx).toBe(0);
  });
});

describe("spacingMarks", () => {
  const siblings = [box(0, 100, 100, 40), box(300, 100, 100, 40)];

  it("shows both gaps when they are equal within three pixels", () => {
    expect(spacingMarks(box(170, 100, 60, 40), siblings)).toEqual([
      { axis: "x", from: 100, to: 170, across: 120 },
      { axis: "x", from: 230, to: 300, across: 120 },
    ]);
    expect(spacingMarks(box(171, 100, 60, 40), siblings)).toHaveLength(2);
  });

  it("shows nothing when the gaps differ by more", () => {
    expect(spacingMarks(box(180, 100, 60, 40), siblings)).toEqual([]);
  });

  it("shows nothing without a sibling on both sides", () => {
    expect(spacingMarks(box(170, 100, 60, 40), [siblings[0]])).toEqual([]);
  });
});
