import { describe, expect, it } from "vitest";
import {
  isTurnable,
  originPercent,
  pivotOf,
  rotationOf,
  storedRotation,
  turnByPointer,
  withRotation,
  wrapDegrees,
} from "./rotation";
import type { PrimitiveItem, StudioItem } from "./types";

const textItem = (rotation?: number | null): PrimitiveItem => ({
  id: "t",
  kind: "primitive",
  name: "text_1",
  locked: false,
  hidden: false,
  primitive: {
    type: "text",
    value: "Hi",
    x: 10,
    y: 10,
    size: 20,
    color: "black",
    anchor: null,
    max_width: null,
    truncate: false,
    font: "",
    align: "left",
    spacing: 0,
    stroke_width: 0,
    stroke_fill: "white",
    parse_colors: false,
    ...(rotation === undefined ? {} : { rotation }),
  },
});

describe("rotationOf", () => {
  it("is 0 for a primitive stored before rotation existed", () => {
    expect(rotationOf(textItem())).toBe(0);
  });

  it("is 0 for a primitive with no rotation", () => {
    expect(rotationOf(textItem(null))).toBe(0);
  });

  it("is the stored degrees", () => {
    expect(rotationOf(textItem(-30))).toBe(-30);
  });

  it("is 0 for an item that is not a primitive", () => {
    const container: StudioItem = {
      id: "c",
      kind: "container",
      name: "container_1",
      locked: false,
      hidden: false,
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      grouped: true,
      background: null,
      children: [],
    };

    expect(rotationOf(container)).toBe(0);
  });
});

describe("isTurnable", () => {
  it("is true for a text and false for the debug grid", () => {
    expect(isTurnable(textItem().primitive)).toBe(true);
    expect(
      isTurnable({
        type: "debug_grid",
        spacing: 50,
        line_color: "black",
        dashed: false,
        dash_length: 4,
        space_length: 4,
        show_labels: true,
        label_step: null,
        label_color: "black",
        label_font_size: 10,
        font: "",
      })
    ).toBe(false);
  });
});

describe("wrapDegrees", () => {
  it.each([
    [0, 0],
    [90, 90],
    [180, 180],
    [-180, 180],
    [181, -179],
    [270, -90],
    [-270, 90],
    [360, 0],
    [725, 5],
  ])("brings %d to %d", (degrees, wrapped) => {
    expect(wrapDegrees(degrees)).toBe(wrapped);
  });
});

describe("storedRotation", () => {
  it("stores no turn as null, so the renderer is not told one", () => {
    expect(storedRotation(0)).toBeNull();
    expect(storedRotation(15)).toBe(15);
  });
});

describe("withRotation", () => {
  it("turns the item without changing the one it was made from", () => {
    const item = textItem();

    const turned = withRotation(item, 45);

    expect(rotationOf(turned)).toBe(45);
    expect(rotationOf(item)).toBe(0);
  });

  it("turns it back to null at 0", () => {
    expect(rotationOf(withRotation(textItem(45), 0))).toBe(0);
    expect(withRotation(textItem(45), 0).primitive).toMatchObject({
      rotation: null,
    });
  });
});

describe("turnByPointer", () => {
  const pivot = { x: 100, y: 100 };

  it("turns clockwise as the pointer goes round clockwise", () => {
    const grabbed = { x: 100, y: 0 };
    const quarterRound = { x: 200, y: 100 };

    expect(turnByPointer(0, pivot, grabbed, quarterRound, false)).toBe(90);
  });

  it("turns anticlockwise as the pointer goes round the other way", () => {
    const grabbed = { x: 100, y: 0 };
    const quarterBack = { x: 0, y: 100 };

    expect(turnByPointer(0, pivot, grabbed, quarterBack, false)).toBe(-90);
  });

  it("starts from the turn the item has, without a jump when it is taken", () => {
    const grabbed = { x: 130, y: 20 };

    expect(turnByPointer(40, pivot, grabbed, grabbed, false)).toBe(40);
  });

  it("does not depend on how far from the pivot the pointer is", () => {
    const near = turnByPointer(
      0,
      pivot,
      { x: 100, y: 90 },
      { x: 110, y: 100 },
      false
    );
    const far = turnByPointer(
      0,
      pivot,
      { x: 100, y: -300 },
      { x: 500, y: 100 },
      false
    );

    expect(near).toBe(far);
  });

  it("snaps to steps of 15 degrees with Shift", () => {
    const grabbed = { x: 100, y: 0 };
    const about20 = {
      x: 100 + 100 * Math.sin((20 * Math.PI) / 180),
      y: 100 - 100 * Math.cos((20 * Math.PI) / 180),
    };

    expect(turnByPointer(0, pivot, grabbed, about20, true)).toBe(15);
    expect(turnByPointer(0, pivot, grabbed, about20, false)).toBe(20);
  });

  it("keeps the turn within a half turn either way", () => {
    const grabbed = { x: 100, y: 0 };
    const nearlyRound = { x: 90, y: 0 };

    expect(
      Math.abs(turnByPointer(170, pivot, grabbed, nearlyRound, false))
    ).toBeLessThanOrEqual(180);
  });
});

describe("pivotOf", () => {
  const box = { x: 100, y: 50, width: 80, height: 40 };

  it("is the middle of the box when the backend reported nothing", () => {
    expect(pivotOf(box)).toEqual({ x: 140, y: 70 });
  });

  it("is where the backend reported it", () => {
    expect(pivotOf(box, { pivot: { x: 140, y: 76 }, box })).toEqual({
      x: 140,
      y: 76,
    });
  });

  it("follows the box once the item has moved since the report", () => {
    const reported = { pivot: { x: 140, y: 76 }, box };
    const moved = { ...box, x: 130, y: 60 };

    expect(pivotOf(moved, reported)).toEqual({ x: 170, y: 86 });
  });
});

describe("originPercent", () => {
  it("is 50% 50% for the middle of the box", () => {
    const box = { x: 10, y: 20, width: 100, height: 40 };

    expect(originPercent(box, { x: 60, y: 40 })).toEqual({ x: 50, y: 50 });
  });

  it("can lie outside the box", () => {
    const box = { x: 0, y: 0, width: 100, height: 100 };

    expect(originPercent(box, { x: -50, y: 150 })).toEqual({ x: -50, y: 150 });
  });

  it("is the middle for a box with no size", () => {
    expect(
      originPercent({ x: 5, y: 5, width: 0, height: 0 }, { x: 5, y: 5 })
    ).toEqual({
      x: 50,
      y: 50,
    });
  });
});
