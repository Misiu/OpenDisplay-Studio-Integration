import { clamp, snap } from "./math";
import type { ItemBounds } from "./types";

export const RESIZE_HANDLES = [
  "nw",
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w",
] as const;

export type ResizeHandle = (typeof RESIZE_HANDLES)[number];

interface ResizeBoundsOptions {
  bounds: ItemBounds;
  handle: ResizeHandle;
  deltaX: number;
  deltaY: number;
  minimumWidth: number;
  minimumHeight: number;
  area: ItemBounds;
  preserveAspect: boolean;
  snapSize: number;
  snapEnabled: boolean;
}

const hasHorizontalEdge = (handle: ResizeHandle): boolean =>
  handle.includes("e") || handle.includes("w");

const hasVerticalEdge = (handle: ResizeHandle): boolean =>
  handle.includes("n") || handle.includes("s");

const snapped = (
  value: number,
  size: number,
  origin: number,
  enabled: boolean
): number => (enabled ? snap(value, size, origin) : Math.round(value));

interface ExtentLimits {
  /** The handle sits on the start side (west or north), so the end edge stays fixed. */
  startHandle: boolean;
  /** The handle sits on the end side (east or south), so the start edge stays fixed. */
  endHandle: boolean;
  originalStart: number;
  originalEnd: number;
  originalCenter: number;
  areaStart: number;
  areaEnd: number;
}

/** The largest size along one axis that still fits in the area. */
const maximumExtent = (limits: ExtentLimits): number => {
  if (limits.startHandle) {
    return limits.originalEnd - limits.areaStart;
  }
  if (limits.endHandle) {
    return limits.areaEnd - limits.originalStart;
  }
  const room = Math.min(
    limits.originalCenter - limits.areaStart,
    limits.areaEnd - limits.originalCenter
  );
  return Math.max(1, room * 2);
};

/** Where an item of `size` starts so it keeps the same fixed edge as the requested bounds. */
const alignedStart = (
  startHandle: boolean,
  endHandle: boolean,
  start: number,
  requestedSize: number,
  size: number
): number => {
  if (startHandle) {
    return start + requestedSize - size;
  }
  if (endHandle) {
    return start;
  }
  return start + (requestedSize - size) / 2;
};

/**
 * Resize one exclusive-edge rectangle from a directional handle.
 *
 * The edge opposite the active handle remains fixed. Side handles keep the
 * perpendicular center fixed when aspect ratio locking is enabled.
 */
export const resizeBounds = ({
  bounds,
  handle,
  deltaX,
  deltaY,
  minimumWidth,
  minimumHeight,
  area,
  preserveAspect,
  snapSize,
  snapEnabled,
}: ResizeBoundsOptions): ItemBounds => {
  const areaRight = area.x + area.width;
  const areaBottom = area.y + area.height;
  const originalLeft = bounds.x;
  const originalTop = bounds.y;
  const originalRight = bounds.x + bounds.width;
  const originalBottom = bounds.y + bounds.height;
  const originalCenterX = originalLeft + bounds.width / 2;
  const originalCenterY = originalTop + bounds.height / 2;

  let left = originalLeft;
  let top = originalTop;
  let right = originalRight;
  let bottom = originalBottom;

  if (handle.includes("w")) {
    left = snapped(originalLeft + deltaX, snapSize, area.x, snapEnabled);
  }
  if (handle.includes("e")) {
    right = snapped(originalRight + deltaX, snapSize, area.x, snapEnabled);
  }
  if (handle.includes("n")) {
    top = snapped(originalTop + deltaY, snapSize, area.y, snapEnabled);
  }
  if (handle.includes("s")) {
    bottom = snapped(originalBottom + deltaY, snapSize, area.y, snapEnabled);
  }

  if (handle.includes("w")) {
    left = clamp(left, area.x, originalRight - minimumWidth);
  }
  if (handle.includes("e")) {
    right = clamp(right, originalLeft + minimumWidth, areaRight);
  }
  if (handle.includes("n")) {
    top = clamp(top, area.y, originalBottom - minimumHeight);
  }
  if (handle.includes("s")) {
    bottom = clamp(bottom, originalTop + minimumHeight, areaBottom);
  }

  if (!preserveAspect) {
    return {
      x: Math.round(left),
      y: Math.round(top),
      width: Math.round(right - left),
      height: Math.round(bottom - top),
    };
  }

  const aspect = bounds.width / Math.max(1, bounds.height);
  const candidateWidth = Math.max(minimumWidth, right - left);
  const candidateHeight = Math.max(minimumHeight, bottom - top);
  const horizontalChange =
    Math.abs(candidateWidth - bounds.width) / Math.max(1, bounds.width);
  const verticalChange =
    Math.abs(candidateHeight - bounds.height) / Math.max(1, bounds.height);

  let width: number;
  let height: number;
  if (
    hasHorizontalEdge(handle) &&
    (!hasVerticalEdge(handle) || horizontalChange >= verticalChange)
  ) {
    width = candidateWidth;
    height = width / aspect;
  } else {
    height = candidateHeight;
    width = height * aspect;
  }

  const maximumWidth = maximumExtent({
    startHandle: handle.includes("w"),
    endHandle: handle.includes("e"),
    originalStart: originalLeft,
    originalEnd: originalRight,
    originalCenter: originalCenterX,
    areaStart: area.x,
    areaEnd: areaRight,
  });
  const maximumHeight = maximumExtent({
    startHandle: handle.includes("n"),
    endHandle: handle.includes("s"),
    originalStart: originalTop,
    originalEnd: originalBottom,
    originalCenter: originalCenterY,
    areaStart: area.y,
    areaEnd: areaBottom,
  });
  const minimumScale = Math.max(
    minimumWidth / Math.max(1, bounds.width),
    minimumHeight / Math.max(1, bounds.height)
  );
  const maximumScale = Math.min(
    maximumWidth / Math.max(1, bounds.width),
    maximumHeight / Math.max(1, bounds.height)
  );
  const requestedScale = Math.max(
    width / Math.max(1, bounds.width),
    height / Math.max(1, bounds.height)
  );
  const scale = clamp(
    requestedScale,
    Math.min(minimumScale, maximumScale),
    maximumScale
  );
  width = Math.max(1, Math.round(bounds.width * scale));
  height = Math.max(1, Math.round(bounds.height * scale));

  if (handle.includes("w")) left = originalRight - width;
  else if (handle.includes("e")) left = originalLeft;
  else left = originalCenterX - width / 2;

  if (handle.includes("n")) top = originalBottom - height;
  else if (handle.includes("s")) top = originalTop;
  else top = originalCenterY - height / 2;

  left = clamp(Math.round(left), area.x, areaRight - width);
  top = clamp(Math.round(top), area.y, areaBottom - height);
  return { x: left, y: top, width, height };
};

/** Align a quantized intrinsic-size item to the same fixed edges as its requested bounds. */
export const alignIntrinsicBounds = (
  requested: ItemBounds,
  width: number,
  height: number,
  handle: ResizeHandle
): ItemBounds => {
  const x = alignedStart(
    handle.includes("w"),
    handle.includes("e"),
    requested.x,
    requested.width,
    width
  );
  const y = alignedStart(
    handle.includes("n"),
    handle.includes("s"),
    requested.y,
    requested.height,
    height
  );
  return { x: Math.round(x), y: Math.round(y), width, height };
};
