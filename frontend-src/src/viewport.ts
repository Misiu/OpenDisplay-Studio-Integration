import { clamp } from "./math";

/**
 * Pan and zoom of the canvas stage. The canvas element is drawn from this and
 * reports changes to it.
 */
export interface Viewport {
  zoom: number;
  panX: number;
  panY: number;
}

export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 4;
const FIT_MARGIN = 96;
const FIT_MAX_ZOOM = 3;
const WHEEL_ZOOM_STEP = 0.1;

export const DEFAULT_VIEWPORT: Viewport = { zoom: 1, panX: 0, panY: 0 };

export const withZoom = (viewport: Viewport, zoom: number): Viewport => ({
  ...viewport,
  zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM),
});

/** Zoom so a display fits a stage with a margin, centred. */
export const fitViewport = (
  stage: { width: number; height: number },
  display: { width: number; height: number }
): Viewport => {
  const availableWidth = Math.max(100, stage.width - FIT_MARGIN);
  const availableHeight = Math.max(100, stage.height - FIT_MARGIN);
  return {
    zoom: clamp(
      Math.min(
        availableWidth / display.width,
        availableHeight / display.height
      ),
      MIN_ZOOM,
      FIT_MAX_ZOOM
    ),
    panX: 0,
    panY: 0,
  };
};

interface WheelInput {
  deltaY: number;
  shiftKey: boolean;
  altKey: boolean;
}

/** Wheel over the stage: Shift zooms, Alt pans sideways, plain wheel pans up and down. */
export const wheelViewport = (
  viewport: Viewport,
  wheel: WheelInput
): Viewport => {
  if (wheel.shiftKey) {
    return withZoom(
      viewport,
      viewport.zoom + (wheel.deltaY < 0 ? WHEEL_ZOOM_STEP : -WHEEL_ZOOM_STEP)
    );
  }
  if (wheel.altKey) return { ...viewport, panX: viewport.panX - wheel.deltaY };
  return { ...viewport, panY: viewport.panY - wheel.deltaY };
};
