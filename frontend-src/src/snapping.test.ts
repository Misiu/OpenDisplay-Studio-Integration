import { describe, expect, it } from "vitest";
import { alignmentGuides, snapAdjustment, type SnapTargets } from "./snapping";

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
