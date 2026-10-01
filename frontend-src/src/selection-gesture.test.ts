import { describe, expect, it } from "vitest";
import {
  boxBetween,
  marqueeSelection,
  moveSelection,
  snapTargetsFor,
  moveTargets,
  selectionBox,
} from "./selection-gesture";
import {
  circleItem,
  containerItem,
  dashboardWith,
  rectangleItem,
  textItem,
} from "./test-support";
import { locate } from "./tree";
import type { StudioItem } from "./types";

const nothingMeasured = () => undefined;

const rectangleLeft = (item: StudioItem | undefined): number | undefined => {
  if (item?.kind !== "primitive" || !("x_start" in item.primitive)) {
    return undefined;
  }
  return item.primitive.x_start;
};

describe("moveSelection", () => {
  it("moves one item by the distance dragged, snapped to the grid", () => {
    const dashboard = dashboardWith([rectangleItem("box")], { snapSize: 10 });
    const targets = moveTargets(dashboard, ["box"], nothingMeasured);

    const [moved] = moveSelection(targets, "box", 33, 0, dashboard, true);

    expect(rectangleLeft(moved)).toBe(50);
  });

  it("moves every selected item by the same distance as the main one", () => {
    const dashboard = dashboardWith([rectangleItem("a"), circleItem("b")], {
      snapSize: 10,
    });
    const targets = moveTargets(dashboard, ["a", "b"], nothingMeasured);

    const moved = moveSelection(targets, "a", 33, 0, dashboard, true);

    const circle = moved[1];
    expect(rectangleLeft(moved[0])).toBe(50);
    expect(
      circle?.kind === "primitive" && "x" in circle.primitive
        ? circle.primitive.x
        : undefined
    ).toBe(130);
  });

  it("stops the main item one length outside the working area, and the others with it", () => {
    const dashboard = dashboardWith([rectangleItem("a"), rectangleItem("b")]);
    const targets = moveTargets(dashboard, ["a", "b"], nothingMeasured);

    const moved = moveSelection(targets, "a", -500, 0, dashboard, false);

    expect(rectangleLeft(moved[0])).toBe(-100);
    expect(rectangleLeft(moved[1])).toBe(-100);
  });

  it("leaves a locked item where it is while the rest move", () => {
    const dashboard = dashboardWith([
      rectangleItem("a"),
      { ...rectangleItem("b"), locked: true },
    ]);
    const targets = moveTargets(dashboard, ["a", "b"], nothingMeasured);

    const moved = moveSelection(targets, "a", 10, 0, dashboard, false);

    expect(rectangleLeft(moved[0])).toBe(30);
    expect(rectangleLeft(moved[1])).toBe(20);
  });

  it("moves an item inside a container in the container's own coordinates", () => {
    const dashboard = dashboardWith([
      containerItem("box", [rectangleItem("inside")], { x: 100, y: 50 }),
    ]);
    const targets = moveTargets(dashboard, ["inside"], nothingMeasured);

    const [moved] = moveSelection(targets, "inside", 15, 0, dashboard, false);

    expect(rectangleLeft(moved)).toBe(35);
  });

  it("moves a container without touching its children", () => {
    const dashboard = dashboardWith([
      containerItem("box", [rectangleItem("inside")], { x: 100, y: 50 }),
    ]);
    const targets = moveTargets(dashboard, ["box"], nothingMeasured);

    const [moved] = moveSelection(targets, "box", 20, 10, dashboard, false);

    expect(moved).toMatchObject({ x: 120, y: 60 });
    expect(
      moved?.kind === "container" && rectangleLeft(moved.children[0])
    ).toBe(20);
  });

  it("does nothing when the main item is not among the targets", () => {
    const dashboard = dashboardWith([rectangleItem("a")]);
    const targets = moveTargets(dashboard, ["a"], nothingMeasured);

    expect(moveSelection(targets, "missing", 5, 5, dashboard, false)).toEqual(
      []
    );
  });
});

describe("selectionBox", () => {
  it("is one box around the selected items on the display", () => {
    const dashboard = dashboardWith([
      textItem("free"),
      containerItem("box", [rectangleItem("inside")], { x: 100, y: 50 }),
    ]);

    const box = selectionBox(dashboard, ["inside", "box"], nothingMeasured);

    expect(box).toEqual({ x: 100, y: 50, width: 200, height: 120 });
  });

  it("is undefined when nothing is selected", () => {
    expect(selectionBox(dashboardWith(), [], nothingMeasured)).toBeUndefined();
  });
});

describe("marqueeSelection", () => {
  const dashboard = () =>
    dashboardWith([
      rectangleItem("a"),
      circleItem("b"),
      containerItem("box", [textItem("inside")], { x: 200, y: 200 }),
    ]);

  it("selects what the marquee touches, groups and containers as one item", () => {
    const ids = marqueeSelection(
      dashboard(),
      { x: 90, y: 60, width: 130, height: 160 },
      undefined,
      nothingMeasured
    );

    expect(ids).toEqual(["a", "b", "box"]);
  });

  it("does not select what the marquee misses", () => {
    const ids = marqueeSelection(
      dashboard(),
      { x: 300, y: 0, width: 20, height: 20 },
      undefined,
      nothingMeasured
    );

    expect(ids).toEqual([]);
  });

  it("does not select an item that is hidden", () => {
    const hidden = dashboardWith([{ ...rectangleItem("a"), hidden: true }]);

    expect(
      marqueeSelection(
        hidden,
        { x: 0, y: 0, width: 400, height: 300 },
        undefined,
        nothingMeasured
      )
    ).toEqual([]);
  });

  it("works on the children of the group that was entered", () => {
    const grouped = dashboardWith([
      rectangleItem("outside"),
      containerItem("group", [textItem("one"), textItem("two")], {
        x: 100,
        y: 100,
        grouped: true,
      }),
    ]);

    const ids = marqueeSelection(
      grouped,
      { x: 0, y: 0, width: 400, height: 300 },
      "group",
      nothingMeasured
    );

    expect(ids).toEqual(["one", "two"]);
    expect(locate(grouped.items, "one")?.parent?.id).toBe("group");
  });
});

describe("boxBetween", () => {
  it("is the same box whichever way it was dragged", () => {
    const expected = { x: 10, y: 20, width: 30, height: 40 };

    expect(boxBetween({ x: 10, y: 20 }, { x: 40, y: 60 })).toEqual(expected);
    expect(boxBetween({ x: 40, y: 60 }, { x: 10, y: 20 })).toEqual(expected);
  });
});

describe("snapping a circle to the centre of the canvas", () => {
  it("leaves whole-pixel coordinates, which the backend accepts", () => {
    const dashboard = dashboardWith([circleItem("c")], {
      width: 480,
      height: 800,
    });
    const targets = moveTargets(dashboard, ["c"], () => undefined);
    const snap = snapTargetsFor(dashboard, ["c"], "c", () => undefined);

    // The circle starts centred on (100, 100); drag its centre to about the canvas centre.
    const items = moveSelection(targets, "c", 139, 301, dashboard, true, snap);

    const circle = items[0];
    if (circle.kind !== "primitive" || circle.primitive.type !== "circle") {
      throw new Error("Expected a circle");
    }
    expect(Number.isInteger(circle.primitive.x)).toBe(true);
    expect(Number.isInteger(circle.primitive.y)).toBe(true);
    expect(Math.abs(circle.primitive.x - 240)).toBeLessThanOrEqual(1);
    expect(Math.abs(circle.primitive.y - 400)).toBeLessThanOrEqual(1);
  });
});
