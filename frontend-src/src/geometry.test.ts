import { describe, expect, it } from "vitest";
import {
  constrainItem,
  itemBounds,
  resizeItem,
  snapToGrid,
  transformItem,
  translateItem,
  workingArea,
} from "./geometry";
import { clamp } from "./math";
import {
  circleItem,
  dashboardWith,
  primitiveItem,
  rectangleItem,
  textItem,
  widgetItem,
} from "./test-support";

describe("clamp and snapToGrid", () => {
  it("clamps into the range", () => {
    expect([clamp(-5, 0, 10), clamp(5, 0, 10), clamp(15, 0, 10)]).toEqual([
      0, 5, 10,
    ]);
  });

  it("snaps to the grid measured from the padding when enabled", () => {
    const dashboard = dashboardWith([], { padding: 3, snapSize: 10 });
    expect(snapToGrid(18, dashboard, true)).toBe(23);
    expect(snapToGrid(18.4, dashboard, false)).toBe(18);
  });
});

describe("workingArea", () => {
  it("is the display minus the padding on every side", () => {
    expect(workingArea(dashboardWith([], { padding: 10 }))).toEqual({
      x: 10,
      y: 10,
      width: 380,
      height: 280,
    });
  });
});

describe("itemBounds", () => {
  it("uses the inclusive pixel box of rectangles and the frame of widgets", () => {
    expect(itemBounds(rectangleItem())).toEqual({
      x: 20,
      y: 30,
      width: 100,
      height: 50,
    });
    expect(itemBounds(widgetItem())).toEqual({
      x: 10,
      y: 10,
      width: 200,
      height: 100,
    });
  });

  it("covers the whole circle, icon and QR code", () => {
    expect(itemBounds(circleItem())).toEqual({
      x: 80,
      y: 80,
      width: 41,
      height: 41,
    });
    expect(
      itemBounds(primitiveItem("icon", "i", { x: 5, y: 6, size: 24 }))
    ).toEqual({ x: 5, y: 6, width: 24, height: 24 });
    expect(
      itemBounds(primitiveItem("qrcode", "q", { x: 0, y: 0, boxsize: 3 }))
    ).toEqual({ x: 0, y: 0, width: 69, height: 69 });
  });
});

describe("translateItem", () => {
  it("moves widgets, box primitives, circles and text by the same offset", () => {
    const widget = widgetItem();
    translateItem(widget, 5, -3);
    expect(itemBounds(widget)).toMatchObject({ x: 15, y: 7 });
    const rectangle = rectangleItem();
    translateItem(rectangle, 10, 10);
    expect(itemBounds(rectangle)).toEqual({
      x: 30,
      y: 40,
      width: 100,
      height: 50,
    });
    const circle = circleItem();
    translateItem(circle, -20, 0);
    expect(itemBounds(circle)).toMatchObject({ x: 60, y: 80 });
    const text = textItem();
    translateItem(text, 1, 2);
    expect(itemBounds(text)).toMatchObject({ x: 11, y: 12 });
  });
});

describe("constrainItem", () => {
  it("pulls an item back into the working area", () => {
    const dashboard = dashboardWith([], { padding: 10 });
    const rectangle = rectangleItem("r", {
      x_start: -50,
      x_end: 49,
      y_start: 290,
      y_end: 339,
    });
    constrainItem(rectangle, dashboard);
    expect(itemBounds(rectangle)).toEqual({
      x: 10,
      y: 240,
      width: 100,
      height: 50,
    });
  });

  it("shrinks a widget that is larger than the working area", () => {
    const widget = widgetItem();
    widget.frame = { x: 0, y: 0, width: 900, height: 900 };
    constrainItem(widget, dashboardWith());
    expect(widget.frame).toMatchObject({ width: 400, height: 300 });
  });
});

describe("resizeItem", () => {
  const resize = (
    item: ReturnType<typeof rectangleItem>,
    handle: Parameters<typeof resizeItem>[1],
    dx: number,
    dy: number,
    shift = false
  ) => {
    resizeItem(item, handle, dx, dy, shift, dashboardWith(), {
      snapEnabled: false,
    });
    return itemBounds(item);
  };

  it("grows a rectangle from its south-east handle", () => {
    expect(resize(rectangleItem(), "se", 10, 5)).toEqual({
      x: 20,
      y: 30,
      width: 110,
      height: 55,
    });
  });

  it("keeps the circle centred and round when resized", () => {
    const circle = circleItem();
    resizeItem(circle, "se", 20, 20, false, dashboardWith(), {
      snapEnabled: false,
    });
    const bounds = itemBounds(circle);
    expect(bounds.width).toBe(bounds.height);
    expect(bounds.width).toBeGreaterThan(41);
  });

  it("never shrinks a widget below its minimum size", () => {
    const widget = widgetItem();
    resizeItem(widget, "se", -500, -500, false, dashboardWith(), {
      snapEnabled: false,
      minSize: { width: 60, height: 48 },
    });
    expect(widget.frame).toMatchObject({ width: 60, height: 48 });
  });
});

describe("transformItem", () => {
  const options = { snapEnabled: true };

  it("moves an item snapped to the grid and leaves the original untouched", () => {
    const original = rectangleItem();
    const moved = transformItem(
      original,
      { mode: "move" },
      13,
      7,
      dashboardWith(),
      options
    );
    expect(itemBounds(moved)).toMatchObject({
      x: 35,
      y: 35,
      width: 100,
      height: 50,
    });
    expect(itemBounds(original).x).toBe(20);
  });

  it("moves an item out of the working area by its own size at most", () => {
    const moved = transformItem(
      rectangleItem(),
      { mode: "move" },
      9999,
      -9999,
      dashboardWith(),
      options
    );
    expect(itemBounds(moved)).toMatchObject({ x: 400, y: -50 });
  });

  it("moves by whole pixels when snapping is off", () => {
    const moved = transformItem(
      rectangleItem(),
      { mode: "move" },
      13,
      7,
      dashboardWith(),
      { snapEnabled: false }
    );
    expect(itemBounds(moved)).toMatchObject({ x: 33, y: 37 });
  });

  it("returns a locked item as it was", () => {
    const locked = rectangleItem();
    locked.locked = true;
    expect(
      transformItem(locked, { mode: "move" }, 50, 50, dashboardWith(), options)
    ).toEqual(locked);
  });

  it("resizes from a handle", () => {
    const resized = transformItem(
      rectangleItem(),
      { mode: "resize", handle: "se", shiftKey: false },
      10,
      5,
      dashboardWith(),
      { snapEnabled: false }
    );
    expect(itemBounds(resized)).toMatchObject({ width: 110, height: 55 });
  });
});

describe("measured bounds", () => {
  const qr = (): PrimitiveItem => ({
    id: "qr",
    kind: "primitive",
    locked: false,
    hidden: false,
    primitive: {
      type: "qrcode",
      data: "https://example.org/a/longer/address",
      x: 40,
      y: 40,
      boxsize: 3,
      border: 1,
      color: "black",
      bgcolor: "white",
    },
  });
  // 25 modules of data plus a quiet zone of 1 on each side, at 3 px per module.
  const measuredQr = { x: 40, y: 40, width: 81, height: 81 };

  it("takes the size of text and QR codes from the measurement", () => {
    expect(itemBounds(qr(), measuredQr)).toEqual(measuredQr);
    expect(
      itemBounds(textItem(), { x: 10, y: 10, width: 77, height: 46 })
    ).toEqual({
      x: 10,
      y: 10,
      width: 77,
      height: 46,
    });
  });

  it("keeps the live position while the measured size is from the last render", () => {
    const item = qr();
    translateItem(item, 25, 5);
    expect(itemBounds(item, measuredQr)).toEqual({
      x: 65,
      y: 45,
      width: 81,
      height: 81,
    });
  });

  it("does not let a measurement change a shape whose size follows from its fields", () => {
    const rectangle = rectangleItem();
    expect(
      itemBounds(rectangle, { x: 0, y: 0, width: 999, height: 999 })
    ).toEqual(itemBounds(rectangle));
  });

  it("falls back to its own estimate until the backend has measured", () => {
    expect(itemBounds(qr()).width).toBe(69);
  });

  it("resizes a QR code by its real module count, not by 21 modules", () => {
    const resized = qr();
    resizeItem(resized, "se", 81, 81, false, dashboardWith(), {
      snapEnabled: false,
      measured: measuredQr,
    });
    // 162 px over 27 modules (25 + quiet zone) is 6 px per module, not 162 / 23.
    expect(resized.primitive).toMatchObject({ boxsize: 6 });
  });

  it("never shrinks a QR code below one pixel per module", () => {
    const resized = qr();
    resizeItem(resized, "se", -500, -500, false, dashboardWith(), {
      snapEnabled: false,
      measured: measuredQr,
    });
    expect(resized.primitive).toMatchObject({ boxsize: 1 });
  });

  it("scales the font size of text from its measured box", () => {
    const text = textItem();
    resizeItem(text, "se", 40, 40, false, dashboardWith(), {
      snapEnabled: false,
      measured: { x: 10, y: 10, width: 80, height: 46 },
    });
    // The pull is 86 / 46 in height and the aspect ratio is kept: 32 px grows to about 60 px.
    expect(text.primitive).toMatchObject({ size: 60 });
  });

  it("moves an item up to the far edge of the display, whatever its measured size", () => {
    const moved = transformItem(
      qr(),
      { mode: "move" },
      9999,
      0,
      dashboardWith(),
      { snapEnabled: false, measured: measuredQr }
    );
    expect(itemBounds(moved, measuredQr).x).toBe(400);
  });
});
