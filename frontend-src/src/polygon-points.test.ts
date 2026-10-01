import { describe, expect, it } from "vitest";
import {
  addPoint,
  canRemovePoint,
  MAXIMUM_POINTS,
  movePoint,
  pointsOf,
  removePoint,
  setPointCoordinate,
  type Point,
} from "./polygon-points";

const triangle: Point[] = [
  [0, 0],
  [100, 0],
  [50, 80],
];

describe("pointsOf", () => {
  it("keeps the pairs of numbers and drops anything else", () => {
    expect(pointsOf([[1, 2], [3], "x", [4, "5"], [6, 7]])).toEqual([
      [1, 2],
      [6, 7],
    ]);
    expect(pointsOf(undefined)).toEqual([]);
  });
});

describe("addPoint", () => {
  it("adds a point halfway along the edge that closes the polygon", () => {
    expect(addPoint(triangle)).toEqual([...triangle, [25, 40]]);
  });

  it("adds nothing beyond the most points the backend accepts", () => {
    const full: Point[] = Array.from({ length: MAXIMUM_POINTS }, () => [0, 0]);

    expect(addPoint(full)).toHaveLength(MAXIMUM_POINTS);
  });
});

describe("removePoint", () => {
  it("removes one point", () => {
    const square: Point[] = [...triangle, [0, 80]];

    expect(removePoint(square, 1)).toEqual([
      [0, 0],
      [50, 80],
      [0, 80],
    ]);
  });

  it("keeps the three points a polygon needs", () => {
    expect(canRemovePoint(triangle)).toBe(false);
    expect(removePoint(triangle, 0)).toEqual(triangle);
  });
});

describe("setPointCoordinate and movePoint", () => {
  it("change one point and leave the others", () => {
    expect(setPointCoordinate(triangle, 1, 0, 120)).toEqual([
      [0, 0],
      [120, 0],
      [50, 80],
    ]);
    expect(setPointCoordinate(triangle, 2, 1, 90)[2]).toEqual([50, 90]);
    expect(movePoint(triangle, 0, [5, 6])[0]).toEqual([5, 6]);
  });

  it("do not change the points they were given", () => {
    setPointCoordinate(triangle, 0, 0, 99);

    expect(triangle[0]).toEqual([0, 0]);
  });
});
