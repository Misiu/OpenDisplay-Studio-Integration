import { describe, expect, it } from "vitest";
import {
  alignIntrinsicBounds,
  RESIZE_HANDLES,
  resizeBounds,
  type ResizeHandle,
} from "./resize";
import type { ItemBounds } from "./types";

const bounds: ItemBounds = { x: 100, y: 80, width: 200, height: 100 };
const area: ItemBounds = { x: 0, y: 0, width: 500, height: 400 };

const resize = (
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number,
  preserveAspect = false
) =>
  resizeBounds({
    bounds,
    handle,
    deltaX,
    deltaY,
    minimumWidth: 10,
    minimumHeight: 10,
    area,
    preserveAspect,
    snapSize: 5,
    snapEnabled: false,
  });

describe("resizeBounds", () => {
  it("exposes all eight directional handles", () => {
    expect(RESIZE_HANDLES).toEqual([
      "nw",
      "n",
      "ne",
      "e",
      "se",
      "s",
      "sw",
      "w",
    ]);
  });

  it.each([
    ["nw", -20, -10, { x: 80, y: 70, width: 220, height: 110 }],
    ["n", 0, -10, { x: 100, y: 70, width: 200, height: 110 }],
    ["ne", 20, -10, { x: 100, y: 70, width: 220, height: 110 }],
    ["e", 20, 0, { x: 100, y: 80, width: 220, height: 100 }],
    ["se", 20, 10, { x: 100, y: 80, width: 220, height: 110 }],
    ["s", 0, 10, { x: 100, y: 80, width: 200, height: 110 }],
    ["sw", -20, 10, { x: 80, y: 80, width: 220, height: 110 }],
    ["w", -20, 0, { x: 80, y: 80, width: 220, height: 100 }],
  ] as const)(
    "moves only the %s handle edges",
    (handle, deltaX, deltaY, expected) => {
      expect(resize(handle, deltaX, deltaY)).toEqual(expected);
    }
  );

  it("keeps the opposite corner fixed while preserving aspect ratio", () => {
    expect(resize("se", 100, 10, true)).toEqual({
      x: 100,
      y: 80,
      width: 300,
      height: 150,
    });
    expect(resize("nw", -100, -10, true)).toEqual({
      x: 0,
      y: 30,
      width: 300,
      height: 150,
    });
  });

  it("keeps the perpendicular center fixed for an aspect-locked side handle", () => {
    expect(resize("w", -40, 0, true)).toEqual({
      x: 60,
      y: 70,
      width: 240,
      height: 120,
    });
    expect(resize("s", 0, 40, true)).toEqual({
      x: 60,
      y: 80,
      width: 280,
      height: 140,
    });
  });

  it("snaps the active edge relative to the working area", () => {
    const resized = resizeBounds({
      bounds: { x: 22, y: 22, width: 100, height: 60 },
      handle: "se",
      deltaX: 17,
      deltaY: 13,
      minimumWidth: 10,
      minimumHeight: 10,
      area: { x: 20, y: 20, width: 300, height: 200 },
      preserveAspect: false,
      snapSize: 5,
      snapEnabled: true,
    });
    expect(resized).toEqual({ x: 22, y: 22, width: 118, height: 73 });
    expect(resized.x + resized.width).toBe(140);
    expect(resized.y + resized.height).toBe(95);
  });

  it("clamps active edges to the working area and minimum size", () => {
    expect(resize("nw", -500, -500)).toEqual({
      x: 0,
      y: 0,
      width: 300,
      height: 180,
    });
    expect(resize("se", -500, -500)).toEqual({
      x: 100,
      y: 80,
      width: 10,
      height: 10,
    });
  });
});

describe("alignIntrinsicBounds", () => {
  it("keeps the correct opposite edges fixed after intrinsic size quantization", () => {
    const requested = { x: 80, y: 70, width: 220, height: 110 };
    expect(alignIntrinsicBounds(requested, 101, 101, "nw")).toEqual({
      x: 199,
      y: 79,
      width: 101,
      height: 101,
    });
    expect(alignIntrinsicBounds(requested, 101, 101, "se")).toEqual({
      x: 80,
      y: 70,
      width: 101,
      height: 101,
    });
    expect(alignIntrinsicBounds(requested, 101, 101, "e")).toEqual({
      x: 80,
      y: 75,
      width: 101,
      height: 101,
    });
  });
});
