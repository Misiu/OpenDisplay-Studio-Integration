import { clamp } from "./math";

/**
 * Pan and zoom of the canvas stage, after the reference designer. The canvas is drawn from
 * this and reports changes to it. The canvas sits in the middle of the stage; a display
 * point `d` (from the centre of the display) is on screen at `pan + zoom * d` from the
 * centre of the stage, so a point of the stage can be kept fixed while zooming.
 */
export interface Viewport {
  zoom: number;
  panX: number;
  panY: number;
}

export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 5;
const FIT_SHARE = 0.95;
const FIT_MARGIN = 32;
const BUTTON_ZOOM_FACTOR = 1.2;

export const DEFAULT_VIEWPORT: Viewport = { zoom: 1, panX: 0, panY: 0 };

export const withZoom = (viewport: Viewport, zoom: number): Viewport => ({
  ...viewport,
  zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM),
});

/** A point of the stage, measured from the centre of the stage. */
export interface StagePoint {
  x: number;
  y: number;
}

/** Zoom by `factor` and keep the display point under `point` where it is on screen. */
export const zoomAt = (
  viewport: Viewport,
  factor: number,
  point: StagePoint
): Viewport => {
  const zoom = clamp(viewport.zoom * factor, MIN_ZOOM, MAX_ZOOM);
  const applied = zoom / viewport.zoom;
  return {
    zoom,
    panX: point.x - applied * (point.x - viewport.panX),
    panY: point.y - applied * (point.y - viewport.panY),
  };
};

/** The `+` and `-` buttons: one step of 1.2 times, around the centre of the stage. */
export const zoomStep = (viewport: Viewport, direction: 1 | -1): Viewport =>
  zoomAt(
    viewport,
    direction === 1 ? BUTTON_ZOOM_FACTOR : 1 / BUTTON_ZOOM_FACTOR,
    { x: 0, y: 0 }
  );

export const panBy = (
  viewport: Viewport,
  dx: number,
  dy: number
): Viewport => ({
  ...viewport,
  panX: viewport.panX + dx,
  panY: viewport.panY + dy,
});

interface Size {
  width: number;
  height: number;
}

/** Zoom so the display fills 95 % of the stage less a margin, centred. */
export const fitViewport = (stage: Size, display: Size): Viewport => ({
  zoom: clamp(
    FIT_SHARE *
      Math.min(
        (stage.width - FIT_MARGIN) / display.width,
        (stage.height - FIT_MARGIN) / display.height
      ),
    MIN_ZOOM,
    MAX_ZOOM
  ),
  panX: 0,
  panY: 0,
});

const sameView = (first: Viewport, second: Viewport): boolean =>
  Math.abs(first.zoom - second.zoom) < 0.005 &&
  Math.abs(first.panX - second.panX) < 1 &&
  Math.abs(first.panY - second.panY) < 1;

/** `Fit`: fit the display, or go back to 100 % when it is already fitted. */
export const toggleFit = (
  viewport: Viewport,
  stage: Size,
  display: Size
): Viewport => {
  const fitted = fitViewport(stage, display);
  return sameView(viewport, fitted) ? DEFAULT_VIEWPORT : fitted;
};

const LINE_HEIGHT = 16;
const PAGE_HEIGHT = 800;

/** Wheel deltas in pixels, whatever unit the browser reported them in. */
const wheelPixels = (delta: number, mode: number): number => {
  if (mode === 1) return delta * LINE_HEIGHT;
  if (mode === 2) return delta * PAGE_HEIGHT;
  return delta;
};

export interface WheelInput {
  deltaX: number;
  deltaY: number;
  deltaMode?: number;
  ctrlKey: boolean;
  metaKey: boolean;
}

const WHEEL_ZOOM_RATE = 0.0032;
const WHEEL_REFERENCE = 120;
const WHEEL_BOOST_LIMIT = 1.2;

/** The factor one wheel event zooms by: exponential, faster for a harder turn. */
export const wheelZoomFactor = (deltaY: number): number =>
  Math.exp(
    -deltaY *
      WHEEL_ZOOM_RATE *
      (1 + Math.min(WHEEL_BOOST_LIMIT, Math.abs(deltaY) / WHEEL_REFERENCE))
  );

/**
 * The wheel over the stage: it pans, and with `Ctrl` or `Cmd` it zooms toward `point`.
 * With `Pan` off the wheel always zooms.
 */
export const wheelViewport = (
  viewport: Viewport,
  wheel: WheelInput,
  point: StagePoint,
  panMode = true
): Viewport => {
  const deltaY = wheelPixels(wheel.deltaY, wheel.deltaMode ?? 0);
  if (wheel.ctrlKey || wheel.metaKey || !panMode) {
    return zoomAt(viewport, wheelZoomFactor(deltaY), point);
  }
  const deltaX = wheelPixels(wheel.deltaX, wheel.deltaMode ?? 0);
  return panBy(viewport, -deltaX, -deltaY);
};
