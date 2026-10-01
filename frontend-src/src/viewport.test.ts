import { describe, expect, it } from "vitest";
import {
  DEFAULT_VIEWPORT,
  fitViewport,
  MAX_ZOOM,
  MIN_ZOOM,
  panBy,
  toggleFit,
  wheelViewport,
  wheelZoomFactor,
  withZoom,
  zoomAt,
  zoomStep,
} from "./viewport";

const centre = { x: 0, y: 0 };
const plain = { deltaX: 0, deltaY: 0, ctrlKey: false, metaKey: false };

/** Where a display point (from the centre of the display) is on screen. */
const onScreen = (
  viewport: { zoom: number; panX: number; panY: number },
  point: { x: number; y: number }
) => ({
  x: viewport.panX + viewport.zoom * point.x,
  y: viewport.panY + viewport.zoom * point.y,
});

describe("withZoom", () => {
  it("keeps the pan and clamps the zoom into range", () => {
    const viewport = { zoom: 1, panX: 10, panY: -5 };
    expect(withZoom(viewport, 2)).toEqual({ zoom: 2, panX: 10, panY: -5 });
    expect(withZoom(viewport, 99).zoom).toBe(MAX_ZOOM);
    expect(withZoom(viewport, 0).zoom).toBe(MIN_ZOOM);
  });

  it("reaches 5 times and 0.25 times", () => {
    expect(MAX_ZOOM).toBe(5);
    expect(MIN_ZOOM).toBe(0.25);
  });
});

describe("zoomAt", () => {
  it("keeps the point under the cursor where it is on screen", () => {
    const viewport = { zoom: 1, panX: 30, panY: -20 };
    const cursor = { x: 140, y: 60 };
    // The display point that is under the cursor before the zoom.
    const under = {
      x: (cursor.x - viewport.panX) / viewport.zoom,
      y: (cursor.y - viewport.panY) / viewport.zoom,
    };

    const zoomed = zoomAt(viewport, 2, cursor);

    expect(zoomed.zoom).toBe(2);
    expect(onScreen(zoomed, under).x).toBeCloseTo(cursor.x);
    expect(onScreen(zoomed, under).y).toBeCloseTo(cursor.y);
  });

  it("zooms around the centre when the cursor is there, without panning", () => {
    expect(zoomAt(DEFAULT_VIEWPORT, 2, centre)).toEqual({
      zoom: 2,
      panX: 0,
      panY: 0,
    });
  });

  it("does not move the view once the zoom has reached its limit", () => {
    const limit = { zoom: MAX_ZOOM, panX: 12, panY: 7 };

    expect(zoomAt(limit, 3, { x: 100, y: 100 })).toEqual(limit);
  });
});

describe("zoomStep", () => {
  it("zooms by 1.2 times around the centre of the stage", () => {
    expect(zoomStep(DEFAULT_VIEWPORT, 1).zoom).toBeCloseTo(1.2);
    expect(zoomStep(DEFAULT_VIEWPORT, -1).zoom).toBeCloseTo(1 / 1.2);
  });
});

describe("panBy", () => {
  it("moves the view and keeps the zoom", () => {
    expect(panBy({ zoom: 2, panX: 1, panY: 2 }, 10, -4)).toEqual({
      zoom: 2,
      panX: 11,
      panY: -2,
    });
  });
});

describe("fitViewport", () => {
  it("fits 95 % of the stage less a margin of 32 px, centred", () => {
    const fitted = fitViewport(
      { width: 832, height: 532 },
      { width: 800, height: 480 }
    );

    expect(fitted.zoom).toBeCloseTo(0.95 * Math.min(800 / 800, 500 / 480));
    expect([fitted.panX, fitted.panY]).toEqual([0, 0]);
  });

  it("never zooms in past the maximum or out past the minimum", () => {
    expect(
      fitViewport({ width: 9000, height: 9000 }, { width: 64, height: 64 }).zoom
    ).toBe(MAX_ZOOM);
    expect(
      fitViewport({ width: 200, height: 200 }, { width: 4096, height: 4096 })
        .zoom
    ).toBe(MIN_ZOOM);
  });
});

describe("toggleFit", () => {
  const stage = { width: 900, height: 600 };
  const display = { width: 800, height: 480 };

  it("fits, and goes back to 100 % when pressed again", () => {
    const fitted = toggleFit(DEFAULT_VIEWPORT, stage, display);
    expect(fitted).toEqual(fitViewport(stage, display));

    expect(toggleFit(fitted, stage, display)).toEqual(DEFAULT_VIEWPORT);
  });

  it("fits again from any other view", () => {
    const panned = { zoom: 2, panX: 40, panY: 0 };

    expect(toggleFit(panned, stage, display)).toEqual(
      fitViewport(stage, display)
    );
  });
});

describe("wheelViewport", () => {
  it("pans with the plain wheel, in both directions", () => {
    expect(
      wheelViewport(
        DEFAULT_VIEWPORT,
        { ...plain, deltaX: 20, deltaY: 30 },
        centre
      )
    ).toEqual({ zoom: 1, panX: -20, panY: -30 });
  });

  it("zooms toward the cursor with Ctrl or Cmd, in and out", () => {
    const cursor = { x: 200, y: 100 };

    const zoomedIn = wheelViewport(
      DEFAULT_VIEWPORT,
      { ...plain, deltaY: -120, ctrlKey: true },
      cursor
    );
    const zoomedOut = wheelViewport(
      DEFAULT_VIEWPORT,
      { ...plain, deltaY: 120, metaKey: true },
      cursor
    );

    expect(zoomedIn.zoom).toBeGreaterThan(1);
    expect(zoomedOut.zoom).toBeLessThan(1);
    expect(zoomedIn.panX).toBeLessThan(0);
  });

  it("zooms with the plain wheel when Pan is off", () => {
    const zoomed = wheelViewport(
      DEFAULT_VIEWPORT,
      { ...plain, deltaY: -100 },
      centre,
      false
    );

    expect(zoomed.zoom).toBeGreaterThan(1);
  });

  it("counts lines of a wheel in pixels", () => {
    const lines = wheelViewport(
      DEFAULT_VIEWPORT,
      { ...plain, deltaY: 3, deltaMode: 1 },
      centre
    );

    expect(lines.panY).toBe(-48);
  });

  it("zooms by an exponential step, harder for a harder turn, and out as far as in", () => {
    const small = wheelZoomFactor(-30);
    const hard = wheelZoomFactor(-240);

    expect(small).toBeGreaterThan(1);
    expect(Math.log(hard)).toBeGreaterThan(8 * Math.log(small));
    expect(wheelZoomFactor(60) * wheelZoomFactor(-60)).toBeCloseTo(1);
  });
});
