import { describe, expect, it } from "vitest";
import {
  DEFAULT_VIEWPORT,
  fitViewport,
  MAX_ZOOM,
  MIN_ZOOM,
  wheelViewport,
  withZoom,
} from "./viewport";

describe("withZoom", () => {
  it("keeps the pan and clamps the zoom into range", () => {
    const viewport = { zoom: 1, panX: 10, panY: -5 };
    expect(withZoom(viewport, 2)).toEqual({ zoom: 2, panX: 10, panY: -5 });
    expect(withZoom(viewport, 99).zoom).toBe(MAX_ZOOM);
    expect(withZoom(viewport, 0).zoom).toBe(MIN_ZOOM);
  });
});

describe("fitViewport", () => {
  it("scales the display to the stage minus a margin and centres it", () => {
    expect(
      fitViewport({ width: 896, height: 596 }, { width: 800, height: 500 })
    ).toEqual({ zoom: 1, panX: 0, panY: 0 });
  });

  it("never zooms in past 3x or out past the minimum", () => {
    expect(
      fitViewport({ width: 4000, height: 4000 }, { width: 64, height: 64 }).zoom
    ).toBe(3);
    expect(
      fitViewport({ width: 200, height: 200 }, { width: 4096, height: 4096 })
        .zoom
    ).toBe(MIN_ZOOM);
  });

  it("copes with a stage smaller than the margin", () => {
    expect(
      fitViewport({ width: 10, height: 10 }, { width: 100, height: 100 }).zoom
    ).toBe(1);
  });
});

describe("wheelViewport", () => {
  it("pans vertically with the plain wheel, horizontally with Alt", () => {
    expect(
      wheelViewport(DEFAULT_VIEWPORT, {
        deltaY: 30,
        shiftKey: false,
        altKey: false,
      })
    ).toEqual({ zoom: 1, panX: 0, panY: -30 });
    expect(
      wheelViewport(DEFAULT_VIEWPORT, {
        deltaY: 30,
        shiftKey: false,
        altKey: true,
      })
    ).toEqual({ zoom: 1, panX: -30, panY: 0 });
  });

  it("zooms in steps with Shift and stays within the zoom range", () => {
    expect(
      wheelViewport(DEFAULT_VIEWPORT, {
        deltaY: -1,
        shiftKey: true,
        altKey: false,
      }).zoom
    ).toBeCloseTo(1.1);
    expect(
      wheelViewport(DEFAULT_VIEWPORT, {
        deltaY: 1,
        shiftKey: true,
        altKey: false,
      }).zoom
    ).toBeCloseTo(0.9);
    expect(
      wheelViewport(
        { ...DEFAULT_VIEWPORT, zoom: MAX_ZOOM },
        { deltaY: -1, shiftKey: true, altKey: false }
      ).zoom
    ).toBe(MAX_ZOOM);
  });
});
