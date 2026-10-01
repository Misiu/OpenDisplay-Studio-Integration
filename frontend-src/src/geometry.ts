import { clamp, snap } from "./math";
import { resizeBounds, type ResizeHandle } from "./resize";
import {
  isResizable,
  primitiveConstraints,
  resizePrimitive,
  type ResizeConstraints,
} from "./primitive-resize";
import {
  isMeasured,
  primitiveBounds,
  translatePrimitive,
} from "./primitive-shape";
import { scaleChildren } from "./scale";
import type {
  Dashboard,
  ItemBounds,
  PrimitiveDefinition,
  StudioItem,
} from "./types";

/**
 * Where an item is drawn. Text and QR codes take their size from `measured`, what the
 * backend reports for the last render; until there is one, or for shapes whose size
 * follows from their fields, the panel works it out itself.
 */
export const itemBounds = (
  item: StudioItem,
  measured?: ItemBounds
): ItemBounds => {
  if (item.kind === "widget") {
    return item.frame;
  }
  if (item.kind === "container") {
    return { x: item.x, y: item.y, width: item.width, height: item.height };
  }
  return primitiveBounds(
    item.primitive,
    isMeasured(item.primitive) ? measured : undefined
  );
};

/** The editable area: the display minus its padding on every side. */
export const workingArea = (dashboard: Dashboard): ItemBounds => {
  const padding = dashboard.display.padding;
  return {
    x: padding,
    y: padding,
    width: dashboard.display.width - padding * 2,
    height: dashboard.display.height - padding * 2,
  };
};

export const snapToGrid = (
  value: number,
  dashboard: Dashboard,
  enabled: boolean
): number =>
  enabled
    ? snap(value, dashboard.display.snapSize, dashboard.display.padding)
    : Math.round(value);

export const translateItem = (
  item: StudioItem,
  dx: number,
  dy: number
): void => {
  if (item.kind === "widget") {
    item.frame.x += dx;
    item.frame.y += dy;
    return;
  }
  if (item.kind === "container") {
    item.x += dx;
    item.y += dy;
    return;
  }
  translatePrimitive(item.primitive, dx, dy);
};

/** Move an item back inside the working area; widgets larger than it are shrunk. */
export const constrainItem = (
  item: StudioItem,
  dashboard: Dashboard,
  measured?: ItemBounds
): void => {
  const area = workingArea(dashboard);
  const bounds = itemBounds(item, measured);
  const dx =
    clamp(
      bounds.x,
      area.x,
      Math.max(area.x, area.x + area.width - bounds.width)
    ) - bounds.x;
  const dy =
    clamp(
      bounds.y,
      area.y,
      Math.max(area.y, area.y + area.height - bounds.height)
    ) - bounds.y;
  translateItem(item, dx, dy);
  if (item.kind === "widget") {
    item.frame.width = Math.min(item.frame.width, area.width);
    item.frame.height = Math.min(item.frame.height, area.height);
  }
  if (item.kind === "container") {
    item.width = Math.min(item.width, area.width);
    item.height = Math.min(item.height, area.height);
  }
};

/**
 * Where the start of an item `size` long may lie along a side of the working area: from
 * its whole length before the edge to the far edge, so it can leave the display entirely
 * on either side. ODL has no clipping and the renderer draws what is in view.
 */
export const outwardRange = (
  start: number,
  length: number,
  size: number
): [number, number] => [start - size, start + length];

/**
 * Where an item may be resized: the working area, widened to hold an item that already
 * hangs out of it. Text hangs out when its anchor is changed, and resizing or moving it
 * must not snap it back in at the first touch.
 */
const reachableArea = (area: ItemBounds, bounds: ItemBounds): ItemBounds => {
  const left = Math.min(area.x, bounds.x);
  const top = Math.min(area.y, bounds.y);
  const right = Math.max(area.x + area.width, bounds.x + bounds.width);
  const bottom = Math.max(area.y + area.height, bounds.y + bounds.height);
  return { x: left, y: top, width: right - left, height: bottom - top };
};

export interface ResizeItemOptions {
  /**
   * Where the origin of the container the item is in lies on the display. The item's
   * coordinates are relative to it, while snapping and limits work on the display.
   */
  offset?: { x: number; y: number };
  snapEnabled: boolean;
  /** What the backend measured for this item, if it has rendered it. */
  measured?: ItemBounds;
  /** The primitive definitions, which say how each field scales inside a group. */
  definitions?: PrimitiveDefinition[];
  /** Smallest size a widget may take; comes from its definition. */
  minSize?: { width: number; height: number };
}

const DEFAULT_WIDGET_MIN_SIZE = { width: 60, height: 48 };

const resizeConstraints = (
  item: StudioItem,
  minSize: { width: number; height: number },
  measured?: ItemBounds
): ResizeConstraints => {
  if (item.kind === "widget") {
    return {
      minimumWidth: minSize.width,
      minimumHeight: minSize.height,
      intrinsicAspect: false,
    };
  }
  if (item.kind === "container") {
    return { minimumWidth: 8, minimumHeight: 8, intrinsicAspect: false };
  }
  return primitiveConstraints(item.primitive, measured);
};

const INTRINSIC_HANDLE: Partial<Record<ResizeHandle, ResizeHandle>> = {
  n: "ne",
  e: "se",
  s: "se",
  w: "sw",
};

/**
 * Resize an item in place from one handle; `dx` and `dy` are display pixels
 * since the gesture began.
 */
export const resizeItem = (
  item: StudioItem,
  handle: ResizeHandle,
  dx: number,
  dy: number,
  shiftKey: boolean,
  dashboard: Dashboard,
  options: ResizeItemOptions
): void => {
  const before = itemBounds(item, options.measured);
  const { minimumWidth, minimumHeight, intrinsicAspect } = resizeConstraints(
    item,
    options.minSize ?? DEFAULT_WIDGET_MIN_SIZE,
    options.measured
  );
  const geometryHandle: ResizeHandle = intrinsicAspect
    ? (INTRINSIC_HANDLE[handle] ?? handle)
    : handle;
  const requested = resizeBounds({
    bounds: before,
    handle: geometryHandle,
    deltaX: dx,
    deltaY: dy,
    minimumWidth,
    minimumHeight,
    area: reachableArea(workingArea(dashboard), before),
    preserveAspect: shiftKey || intrinsicAspect,
    snapSize: dashboard.display.snapSize,
    snapEnabled: options.snapEnabled,
  });

  if (item.kind === "widget") {
    item.frame = requested;
    return;
  }
  if (item.kind === "container") {
    Object.assign(item, {
      x: requested.x,
      y: requested.y,
      width: requested.width,
      height: requested.height,
    });
    if (item.grouped) {
      scaleChildren(
        item,
        requested.width / Math.max(1, before.width),
        requested.height / Math.max(1, before.height),
        options.definitions ?? [],
        dashboard.display
      );
    }
    return;
  }

  if (!isResizable(item.primitive)) return;
  resizePrimitive(item.primitive, {
    requested,
    before,
    handle: geometryHandle,
    measured: options.measured,
    displayWidth: dashboard.display.width,
    displayHeight: dashboard.display.height,
  });
};

/** What a pointer gesture does to the item under it. */
export type ItemGesture =
  | { mode: "move" }
  | { mode: "resize"; handle: ResizeHandle; shiftKey: boolean };

/**
 * The item as it looks `dx`/`dy` display pixels into a gesture that started on `original`.
 * Locked items come back unchanged. Moves snap to the grid and stay inside the working area.
 */
export const transformItem = (
  original: StudioItem,
  gesture: ItemGesture,
  dx: number,
  dy: number,
  dashboard: Dashboard,
  options: ResizeItemOptions
): StudioItem => {
  const item = structuredClone(original);
  if (item.locked) return item;
  const offset = options.offset ?? { x: 0, y: 0 };
  translateItem(item, offset.x, offset.y);
  applyGesture(item, gesture, dx, dy, dashboard, options);
  translateItem(item, -offset.x, -offset.y);
  return item;
};

const applyGesture = (
  item: StudioItem,
  gesture: ItemGesture,
  dx: number,
  dy: number,
  dashboard: Dashboard,
  options: ResizeItemOptions
): void => {
  if (gesture.mode === "resize") {
    resizeItem(
      item,
      gesture.handle,
      dx,
      dy,
      gesture.shiftKey,
      dashboard,
      options
    );
    return;
  }
  const before = itemBounds(item, options.measured);
  const area = workingArea(dashboard);
  const nextX = clamp(
    snapToGrid(before.x + dx, dashboard, options.snapEnabled),
    ...outwardRange(area.x, area.width, before.width)
  );
  const nextY = clamp(
    snapToGrid(before.y + dy, dashboard, options.snapEnabled),
    ...outwardRange(area.y, area.height, before.height)
  );
  translateItem(item, nextX - before.x, nextY - before.y);
};
