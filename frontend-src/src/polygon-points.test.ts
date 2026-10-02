import { describe, expect, it } from "vitest";
import {
  addPoint,
  editablePoints,
  insertPoint,
  midpoint,
  withEditablePoints,
  canRemovePoint,
  MAXIMUM_POINTS,
  movePoint,
  pointsOf,
  removePoint,
  setPointCoordinate,
  type Point,
} from "./polygon-points";
import { circleItem } from "./test-support";

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

describe("insertPoint and midpoint", () => {
  it("puts a point after the one given, the closing edge included", () => {
    expect(insertPoint(triangle, 0, [50, 0])).toEqual([
      [0, 0],
      [50, 0],
      [100, 0],
      [50, 80],
    ]);
    expect(insertPoint(triangle, 2, [25, 40])[3]).toEqual([25, 40]);
  });

  it("finds the middle of an edge on whole pixels", () => {
    expect(midpoint([0, 0], [101, 51])).toEqual([51, 26]);
  });
});

describe("editablePoints and withEditablePoints", () => {
  const line = {
    type: "line" as const,
    x_start: 10,
    y_start: 20,
    x_end: 110,
    y_end: 70,
    fill: "black",
    width: 1,
    dashed: false,
    dash_length: 5,
    space_length: 3,
  };

  it("give a line its two ends and write them back to its fields", () => {
    expect(editablePoints(line)).toEqual([
      [10, 20],
      [110, 70],
    ]);
    expect(
      withEditablePoints(line, [
        [1, 2],
        [3, 4],
      ])
    ).toMatchObject({ x_start: 1, y_start: 2, x_end: 3, y_end: 4 });
  });

  it("give a polygon its corners and a circle nothing", () => {
    const polygon = {
      type: "polygon" as const,
      points: triangle,
      fill: null,
      outline: "black",
    };
    expect(editablePoints(polygon)).toEqual(triangle);
    expect(editablePoints(circleItem("c").primitive)).toBeUndefined();
  });
});
