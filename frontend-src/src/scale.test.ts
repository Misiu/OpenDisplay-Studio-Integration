import { describe, expect, it } from "vitest";
import { scaleChildren } from "./scale";
import {
  circleItem,
  containerItem,
  primitiveDefinitions,
  primitiveItem,
  rectangleItem,
  textItem,
  widgetItem,
} from "./test-support";
import type { ContainerItem, StudioItem } from "./types";

const display = { width: 800, height: 480 };

const scale = (group: ContainerItem, sx: number, sy: number) =>
  scaleChildren(group, sx, sy, primitiveDefinitions, display);

const primitiveOf = (item: StudioItem | undefined): Record<string, unknown> =>
  item?.kind === "primitive" ? { ...item.primitive } : {};

describe("scaleChildren", () => {
  it("scales the coordinates of a box along their own axes", () => {
    const group = containerItem("g", [rectangleItem("r")], { grouped: true });

    scale(group, 2, 0.5);

    expect(primitiveOf(group.children[0])).toMatchObject({
      x_start: 40,
      x_end: 238,
      y_start: 15,
      y_end: 40,
    });
  });

  it("scales a point and the size that has no axis by the mean of the factors", () => {
    const group = containerItem("g", [circleItem("c")], { grouped: true });

    scale(group, 4, 1);

    expect(primitiveOf(group.children[0])).toMatchObject({
      x: 400,
      y: 100,
      radius: 40,
    });
  });

  it("scales a font size and an outline width, never to less than 1", () => {
    const text = textItem("t");
    const group = containerItem("g", [text, rectangleItem("r")], {
      grouped: true,
    });

    scale(group, 0.1, 0.1);

    expect(primitiveOf(group.children[0]).size).toBe(3);
    expect(primitiveOf(group.children[1]).width).toBe(1);
  });

  it("keeps an outline of zero at zero", () => {
    const flat = rectangleItem("r", { width: 0 });
    const group = containerItem("g", [flat], { grouped: true });

    scale(group, 0.5, 0.5);

    expect(primitiveOf(group.children[0]).width).toBe(0);
  });

  it("does not let rounding turn a box into a line", () => {
    const tiny = rectangleItem("r", {
      x_start: 10,
      x_end: 12,
      y_start: 10,
      y_end: 12,
    });
    const group = containerItem("g", [tiny], { grouped: true });

    scale(group, 0.1, 0.1);

    const scaled = primitiveOf(group.children[0]);
    expect(Number(scaled.x_end)).toBeGreaterThan(Number(scaled.x_start));
    expect(Number(scaled.y_end)).toBeGreaterThan(Number(scaled.y_start));
  });

  it("scales the frame and padding of a widget", () => {
    const widget = widgetItem("w");
    widget.frame = { x: 10, y: 20, width: 100, height: 60 };
    widget.layout.padding = 8;
    const group = containerItem("g", [widget], { grouped: true });

    scale(group, 2, 3);

    expect(widget.frame).toEqual({ x: 20, y: 60, width: 200, height: 180 });
    expect(widget.layout.padding).toBe(20);
  });

  it("scales a container inside the group with everything in it", () => {
    const inner = containerItem("inner", [textItem("t")], {
      x: 10,
      y: 10,
      width: 100,
      height: 50,
    });
    const group = containerItem("g", [inner], { grouped: true });

    scale(group, 2, 2);

    expect(inner).toMatchObject({ x: 20, y: 20, width: 200, height: 100 });
    expect(primitiveOf(inner.children[0])).toMatchObject({
      x: 20,
      y: 20,
      size: 64,
    });
  });

  it("is the identity at a factor of one", () => {
    const group = containerItem("g", [rectangleItem("r"), textItem("t")], {
      grouped: true,
    });
    const before = structuredClone(group);

    scale(group, 1, 1);

    expect(group).toEqual(before);
  });

  it("leaves a size at its limit when scaling would exceed it", () => {
    const qr = {
      ...textItem("q"),
      primitive: {
        type: "qrcode" as const,
        data: "x",
        x: 0,
        y: 0,
        boxsize: 10,
        border: 1,
        color: "black",
        bgcolor: "white",
      },
    };
    const group = containerItem("g", [qr], { grouped: true });

    scale(group, 5, 5);

    expect(primitiveOf(group.children[0]).boxsize).toBe(16);
    expect(primitiveOf(group.children[0]).border).toBe(1);
  });

  it("scales every point of a polygon along its own axes", () => {
    const polygon = primitiveItem("polygon", "p", {
      points: [
        [10, 10],
        [50, 10],
        [30, 40],
      ],
    });
    const group = containerItem("g", [polygon], { grouped: true });

    scale(group, 2, 3);

    expect(primitiveOf(group.children[0]).points).toEqual([
      [20, 30],
      [100, 30],
      [60, 120],
    ]);
  });

  it("scales the cell size and gaps of a pattern", () => {
    const pattern = primitiveItem("rectangle_pattern", "r", {
      x_start: 10,
      y_start: 10,
      x_size: 20,
      x_offset: 4,
    });
    const group = containerItem("g", [pattern], { grouped: true });

    scale(group, 2, 2);

    expect(primitiveOf(group.children[0])).toMatchObject({
      x_start: 20,
      x_size: 40,
      x_offset: 8,
    });
  });
});
