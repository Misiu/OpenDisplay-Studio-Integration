import { describe, expect, it } from "vitest";
import {
  itemBounds,
  resizeItem,
  transformItem,
  translateItem,
} from "./geometry";
import { reanchored, remeasured } from "./primitive-shape";
import { dashboardWith, primitiveItem } from "./test-support";

const dashboard = dashboardWith([], { width: 800, height: 480 });

const bounds = (type: Parameters<typeof primitiveItem>[0], values = {}) =>
  itemBounds(primitiveItem(type, "item", values));

describe("the box of each primitive", () => {
  it("covers an arc by the circle it is cut from", () => {
    expect(bounds("arc", { x: 100, y: 80, radius: 30 })).toEqual({
      x: 70,
      y: 50,
      width: 61,
      height: 61,
    });
  });

  it("covers a polygon by its points", () => {
    expect(
      bounds("polygon", {
        points: [
          [10, 20],
          [50, 25],
          [30, 70],
        ],
      })
    ).toEqual({ x: 10, y: 20, width: 41, height: 51 });
  });

  it("covers every cell of a pattern, each drawn one pixel larger than its size", () => {
    expect(
      bounds("rectangle_pattern", {
        x_start: 20,
        y_start: 30,
        x_size: 40,
        y_size: 20,
        x_offset: 10,
        y_offset: 6,
        x_repeat: 4,
        y_repeat: 3,
      })
    ).toEqual({ x: 20, y: 30, width: 191, height: 73 });
  });

  it("covers an image by its size", () => {
    expect(bounds("dlimg", { x: 5, y: 6, xsize: 120, ysize: 90 })).toEqual({
      x: 5,
      y: 6,
      width: 120,
      height: 90,
    });
  });

  it("covers a row of icons, a quarter of their size apart unless told otherwise", () => {
    const row = { x: 10, y: 10, size: 40, icons: ["a", "b", "c"] };

    expect(bounds("icon_sequence", row)).toMatchObject({
      x: 10,
      width: 40 + 2 * 50,
      height: 40,
    });
    expect(bounds("icon_sequence", { ...row, spacing: 0 })).toMatchObject({
      width: 120,
    });
  });

  it("grows a sequence to the left or upwards from its first icon", () => {
    const left = bounds("icon_sequence", {
      x: 200,
      y: 100,
      size: 40,
      spacing: 10,
      direction: "left",
      icons: ["a", "b", "c"],
    });

    expect(left).toEqual({ x: 100, y: 100, width: 140, height: 40 });
  });

  it("places text around its anchor point", () => {
    const anchored = (anchor: string) =>
      bounds("text", { x: 100, y: 100, size: 20, value: "Hi", anchor });
    const topLeft = anchored("lt");
    const centre = anchored("mm");

    expect(topLeft).toMatchObject({ x: 100, y: 100 });
    expect(Math.abs(centre.x + centre.width / 2 - 100)).toBeLessThanOrEqual(1);
    expect(Math.abs(centre.y + centre.height / 2 - 100)).toBeLessThanOrEqual(1);
    expect(anchored("rb").x + anchored("rb").width).toBe(100);
  });

  it("wraps text at its width", () => {
    const wide = bounds("text", { size: 20, value: "A long sentence here" });
    const wrapped = bounds("text", {
      size: 20,
      value: "A long sentence here",
      max_width: 60,
    });

    expect(wrapped.width).toBe(60);
    expect(wide.width).toBeGreaterThan(60);
  });

  it("puts the first line of a multiline text on its anchor and the rest below", () => {
    const box = bounds("multiline", {
      x: 50,
      y: 100,
      size: 20,
      offset_y: 30,
      value: "One|Two|Three",
      anchor: "lt",
    });

    expect(box).toMatchObject({ x: 50, y: 100 });
    expect(box.height).toBeGreaterThan(60);
  });
});

describe("moving a primitive", () => {
  it("moves every point of a polygon", () => {
    const polygon = primitiveItem("polygon", "p", {
      points: [
        [0, 0],
        [10, 0],
        [5, 8],
      ],
    });

    translateItem(polygon, 7, 3);

    expect(polygon.primitive).toMatchObject({
      points: [
        [7, 3],
        [17, 3],
        [12, 11],
      ],
    });
  });

  it("moves a pattern by its origin and leaves a debug grid where it is", () => {
    const pattern = primitiveItem("rectangle_pattern", "r", {
      x_start: 10,
      y_start: 10,
    });
    const grid = primitiveItem("debug_grid", "g");

    translateItem(pattern, 5, 6);
    translateItem(grid, 5, 6);

    expect(pattern.primitive).toMatchObject({ x_start: 15, y_start: 16 });
    expect(grid.primitive).not.toHaveProperty("x");
  });
});

describe("resizing a primitive", () => {
  const options = { snapEnabled: false };

  it("stretches a polygon with its box", () => {
    const polygon = primitiveItem("polygon", "p", {
      points: [
        [100, 100],
        [200, 100],
        [150, 200],
      ],
    });

    resizeItem(polygon, "se", 100, 100, false, dashboard, options);

    expect(polygon.primitive).toMatchObject({
      points: [
        [100, 100],
        [300, 100],
        [200, 300],
      ],
    });
  });

  it("resizes an image to the box", () => {
    const image = primitiveItem("dlimg", "i", {
      x: 100,
      y: 100,
      xsize: 100,
      ysize: 50,
    });

    resizeItem(image, "se", 60, 30, false, dashboard, options);

    expect(image.primitive).toMatchObject({ xsize: 160, ysize: 80 });
  });

  it("changes the radius of an arc, keeping its centre inside the box", () => {
    const arc = primitiveItem("arc", "a", { x: 200, y: 200, radius: 40 });

    resizeItem(arc, "se", 20, 20, false, dashboard, options);

    expect(arc.primitive).toMatchObject({ radius: 50 });
  });

  it("fits a pattern's cells to the box, keeping its gaps and counts", () => {
    const pattern = primitiveItem("rectangle_pattern", "r", {
      x_start: 100,
      y_start: 100,
      x_size: 30,
      y_size: 20,
      x_offset: 10,
      y_offset: 10,
      x_repeat: 3,
      y_repeat: 2,
    });

    resizeItem(pattern, "se", 60, 40, false, dashboard, options);

    expect(pattern.primitive).toMatchObject({ x_size: 50, y_size: 40 });
    expect(pattern.primitive).toMatchObject({ x_repeat: 3, y_repeat: 2 });
  });

  it("scales the size and gap of an icon sequence together", () => {
    const row = primitiveItem("icon_sequence", "s", {
      x: 100,
      y: 100,
      size: 40,
      spacing: 20,
      icons: ["a", "b"],
    });

    resizeItem(row, "se", 100, 0, false, dashboard, options);

    expect(row.primitive).toMatchObject({ size: 80, spacing: 40 });
  });

  it("has no handles to change for a debug grid", () => {
    const grid = primitiveItem("debug_grid", "g", { spacing: 20 });

    resizeItem(grid, "se", 100, 100, false, dashboard, options);

    expect(grid.primitive).toMatchObject({ spacing: 20 });
  });

  it("keeps the anchor point of text where it is while its size changes", () => {
    const text = primitiveItem("text", "t", {
      x: 300,
      y: 200,
      size: 20,
      value: "Centred",
      anchor: "mm",
    });
    const before = itemBounds(text);

    resizeItem(text, "se", before.width, 0, false, dashboard, options);

    const after = itemBounds(text);
    expect(text.primitive).toMatchObject({ size: 40 });
    expect(after.width).toBeGreaterThan(before.width);
    expect(after.x).toBe(before.x);
  });
});

describe("the measurement of a primitive that was edited since it was rendered", () => {
  const measuredAt20 = { x: 0, y: 0, width: 100, height: 25 };

  it("grows text with its font size", () => {
    const composed = primitiveItem("text", "t", { size: 20 }).primitive;
    const edited = primitiveItem("text", "t", { size: 40 }).primitive;

    expect(remeasured(composed, edited, measuredAt20)).toMatchObject({
      width: 200,
      height: 50,
    });
  });

  it("shows a text that is being resized at its new size, around its anchor", () => {
    const original = primitiveItem("text", "t", {
      x: 300,
      y: 200,
      size: 20,
      value: "Centred",
      anchor: "mm",
    });
    const board = dashboardWith([], { width: 800, height: 480 });
    const resized = structuredClone(original);
    resizeItem(resized, "se", 100, 0, false, board, {
      snapEnabled: false,
      measured: measuredAt20,
    });

    const size = resized.primitive.type === "text" ? resized.primitive.size : 0;
    const shown = itemBounds(
      resized,
      remeasured(original.primitive, resized.primitive, measuredAt20)
    );

    expect(size).toBe(40);
    expect(shown.width).toBe(200);
    expect(shown.x + shown.width / 2).toBeCloseTo(
      resized.primitive.type === "text" ? resized.primitive.x : 0,
      0
    );
  });

  it("resizes a QR code by its module size and quiet zone", () => {
    const composed = primitiveItem("qrcode", "q", {
      boxsize: 3,
      border: 1,
    }).primitive;
    const edited = primitiveItem("qrcode", "q", {
      boxsize: 5,
      border: 4,
    }).primitive;

    // 21 modules and a quiet zone of one: 69 px. With a zone of four and 5 px modules: 145.
    expect(
      remeasured(composed, edited, { x: 0, y: 0, width: 69, height: 69 })
    ).toMatchObject({ width: 145, height: 145 });
  });

  it("leaves what does not depend on the edit alone", () => {
    const rectangle = primitiveItem("rectangle", "r").primitive;

    expect(remeasured(rectangle, rectangle, measuredAt20)).toBe(measuredAt20);
  });
});

describe("an item that hangs out of the canvas", () => {
  const options = { snapEnabled: false };
  const measured = { x: 0, y: 0, width: 70, height: 45 };

  it("keeps its far corner where it is when resized from the near one", () => {
    const board = dashboardWith([], { width: 800, height: 480 });
    const text = primitiveItem("text", "t", {
      x: 21,
      y: 40,
      anchor: "mm",
      value: "Text",
    });
    const before = itemBounds(text, measured);

    resizeItem(text, "se", 57, 38, false, board, { ...options, measured });

    const after = itemBounds(text, { ...measured, width: 131, height: 84 });
    expect(before.x).toBeLessThan(0);
    expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(1);
  });

  it("is not pulled back into the canvas by its first move", () => {
    const board = dashboardWith([], { width: 800, height: 480 });
    const text = primitiveItem("text", "t", {
      x: 21,
      y: 40,
      anchor: "mm",
      value: "Text",
    });
    const before = itemBounds(text, measured);

    const moved = transformItem(text, { mode: "move" }, 3, 0, board, {
      ...options,
      measured,
    });

    expect(itemBounds(moved, measured).x).toBe(before.x + 3);
  });
});

describe("changing the anchor of an element", () => {
  const measured = { x: 0, y: 0, width: 100, height: 40 };

  it("keeps the box where it is drawn, moving the point its coordinates name", () => {
    const text = primitiveItem("text", "t", {
      x: 300,
      y: 200,
      anchor: "lt",
      value: "Label",
    });
    const before = itemBounds(text, measured);

    reanchored(text.primitive, "mm", measured);

    expect(itemBounds(text, measured)).toEqual(before);
    expect(text.primitive).toMatchObject({ anchor: "mm", x: 350, y: 220 });
  });

  it("works for every pair of the nine anchors", () => {
    const anchors = ["lt", "mt", "rt", "lm", "mm", "rm", "lb", "mb", "rb"];
    for (const from of anchors) {
      for (const to of anchors) {
        const icon = primitiveItem("icon", "i", {
          x: 300,
          y: 200,
          size: 48,
          anchor: from,
        });
        const before = itemBounds(icon);

        reanchored(icon.primitive, to);

        expect(itemBounds(icon), `${from} to ${to}`).toEqual(before);
      }
    }
  });

  it("leaves a primitive without an anchor alone", () => {
    const circle = primitiveItem("circle", "c", { x: 100, y: 100 });

    reanchored(circle.primitive, "mm");

    expect(circle.primitive).toMatchObject({ x: 100, y: 100 });
  });
});
