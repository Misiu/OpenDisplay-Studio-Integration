import { clamp, snap } from "./math";
import {
  alignIntrinsicBounds,
  resizeBounds,
  type ResizeHandle,
} from "./resize";
import type { Dashboard, ItemBounds, Primitive, StudioItem } from "./types";

type BoxPrimitive = Extract<
  Primitive,
  { x_start: number; y_start: number; x_end: number; y_end: number }
>;
export const isBoxPrimitive = (
  primitive: Primitive
): primitive is BoxPrimitive => "x_start" in primitive;

export const primitiveBounds = (primitive: Primitive): ItemBounds => {
  if (isBoxPrimitive(primitive)) {
    return {
      x: Math.min(primitive.x_start, primitive.x_end),
      y: Math.min(primitive.y_start, primitive.y_end),
      width: Math.abs(primitive.x_end - primitive.x_start) + 1,
      height: Math.abs(primitive.y_end - primitive.y_start) + 1,
    };
  }
  if (primitive.type === "circle") {
    return {
      x: primitive.x - primitive.radius,
      y: primitive.y - primitive.radius,
      width: primitive.radius * 2 + 1,
      height: primitive.radius * 2 + 1,
    };
  }
  if (primitive.type === "qrcode") {
    const size = (21 + primitive.border * 2) * primitive.boxsize;
    return { x: primitive.x, y: primitive.y, width: size, height: size };
  }
  if (primitive.type === "icon") {
    return {
      x: primitive.x,
      y: primitive.y,
      width: primitive.size,
      height: primitive.size,
    };
  }
  return {
    x: primitive.x,
    y: primitive.y,
    width: Math.max(
      primitive.size,
      Math.round(primitive.value.length * primitive.size * 0.62)
    ),
    height: Math.max(1, Math.round(primitive.size * 1.25)),
  };
};

/** Primitives whose size the backend measures: it depends on data and fonts. */
const isMeasured = (primitive: Primitive): boolean =>
  primitive.type === "text" || primitive.type === "qrcode";

/**
 * Where an item is drawn. Text and QR codes take their size from `measured`, what
 * the backend reports for the last render; until there is one, or for shapes whose
 * size follows from their fields, the panel works it out itself.
 */
export const itemBounds = (
  item: StudioItem,
  measured?: ItemBounds
): ItemBounds => {
  if (item.kind === "widget") {
    return item.frame;
  }
  const local = primitiveBounds(item.primitive);
  if (measured && isMeasured(item.primitive)) {
    return { ...local, width: measured.width, height: measured.height };
  }
  return local;
};

/** Modules along one side of a QR code including its quiet zone. */
const qrModuleCount = (
  primitive: Extract<Primitive, { type: "qrcode" }>,
  measured?: ItemBounds
): number =>
  measured
    ? Math.max(1, Math.round(measured.width / primitive.boxsize))
    : 21 + primitive.border * 2;

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
  const primitive = item.primitive;
  if (isBoxPrimitive(primitive)) {
    primitive.x_start += dx;
    primitive.x_end += dx;
    primitive.y_start += dy;
    primitive.y_end += dy;
  } else {
    primitive.x += dx;
    primitive.y += dy;
  }
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
};

interface ResizeItemOptions {
  snapEnabled: boolean;
  /** What the backend measured for this item, if it has rendered it. */
  measured?: ItemBounds;
  /** Smallest size a widget may take; comes from its definition. */
  minSize?: { width: number; height: number };
}

const DEFAULT_WIDGET_MIN_SIZE = { width: 60, height: 48 };

interface ResizeConstraints {
  minimumWidth: number;
  minimumHeight: number;
  intrinsicAspect: boolean;
}

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
  const primitive = item.primitive;
  if (primitive.type === "circle") {
    return { minimumWidth: 3, minimumHeight: 3, intrinsicAspect: true };
  }
  if (primitive.type === "qrcode") {
    const modules = qrModuleCount(primitive, measured);
    return {
      minimumWidth: modules,
      minimumHeight: modules,
      intrinsicAspect: true,
    };
  }
  if (primitive.type === "icon") {
    return { minimumWidth: 8, minimumHeight: 8, intrinsicAspect: true };
  }
  if (primitive.type === "text") {
    const minimum = textBoxAtSize(primitive, 6, measured);
    return {
      minimumWidth: minimum.width,
      minimumHeight: minimum.height,
      intrinsicAspect: true,
    };
  }
  if (primitive.type === "line") {
    return { minimumWidth: 1, minimumHeight: 1, intrinsicAspect: false };
  }
  return { minimumWidth: 2, minimumHeight: 2, intrinsicAspect: false };
};

/** The text block at another font size: scaled from the measurement when there is one. */
const textBoxAtSize = (
  primitive: Extract<Primitive, { type: "text" }>,
  size: number,
  measured?: ItemBounds
): ItemBounds => {
  if (!measured) {
    return primitiveBounds({ ...primitive, size });
  }
  const scale = size / primitive.size;
  return {
    x: primitive.x,
    y: primitive.y,
    width: Math.max(1, Math.round(measured.width * scale)),
    height: Math.max(1, Math.round(measured.height * scale)),
  };
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
    area: workingArea(dashboard),
    preserveAspect: shiftKey || intrinsicAspect,
    snapSize: dashboard.display.snapSize,
    snapEnabled: options.snapEnabled,
  });

  if (item.kind === "widget") {
    item.frame = requested;
    return;
  }

  const primitive = item.primitive;
  if (isBoxPrimitive(primitive)) {
    const right = requested.x + requested.width - 1;
    const bottom = requested.y + requested.height - 1;
    if (primitive.type === "line") {
      const leftToRight = primitive.x_start <= primitive.x_end;
      const topToBottom = primitive.y_start <= primitive.y_end;
      primitive.x_start = leftToRight ? requested.x : right;
      primitive.x_end = leftToRight ? right : requested.x;
      primitive.y_start = topToBottom ? requested.y : bottom;
      primitive.y_end = topToBottom ? bottom : requested.y;
      if (
        primitive.x_start === primitive.x_end &&
        primitive.y_start === primitive.y_end
      ) {
        primitive.x_end = Math.min(
          dashboard.display.width - 1,
          primitive.x_start + 1
        );
      }
    } else {
      primitive.x_start = requested.x;
      primitive.y_start = requested.y;
      primitive.x_end = right;
      primitive.y_end = bottom;
    }
    return;
  }

  if (primitive.type === "circle") {
    const radius = Math.max(
      1,
      Math.floor((Math.min(requested.width, requested.height) - 1) / 2)
    );
    const diameter = radius * 2 + 1;
    const aligned = alignIntrinsicBounds(
      requested,
      diameter,
      diameter,
      geometryHandle
    );
    primitive.x = aligned.x + radius;
    primitive.y = aligned.y + radius;
    primitive.radius = radius;
    return;
  }

  if (primitive.type === "qrcode") {
    const modules = qrModuleCount(primitive, options.measured);
    primitive.boxsize = clamp(
      Math.floor(Math.min(requested.width, requested.height) / modules),
      1,
      16
    );
    const size = modules * primitive.boxsize;
    const aligned = alignIntrinsicBounds(requested, size, size, geometryHandle);
    primitive.x = aligned.x;
    primitive.y = aligned.y;
    return;
  }

  if (primitive.type === "icon") {
    primitive.size = clamp(
      Math.floor(Math.min(requested.width, requested.height)),
      8,
      256
    );
    const aligned = alignIntrinsicBounds(
      requested,
      primitive.size,
      primitive.size,
      geometryHandle
    );
    primitive.x = aligned.x;
    primitive.y = aligned.y;
    return;
  }

  const previousSize = primitive.size;
  primitive.size = clamp(
    Math.round((previousSize * requested.width) / Math.max(1, before.width)),
    6,
    256
  );
  const actual = options.measured
    ? textBoxAtSize(
        { ...primitive, size: previousSize },
        primitive.size,
        options.measured
      )
    : primitiveBounds(primitive);
  const aligned = alignIntrinsicBounds(
    requested,
    actual.width,
    actual.height,
    geometryHandle
  );
  primitive.x = aligned.x;
  primitive.y = aligned.y;
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
    return item;
  }
  const area = workingArea(dashboard);
  const before = itemBounds(item, options.measured);
  const nextX = clamp(
    snapToGrid(before.x + dx, dashboard, options.snapEnabled),
    area.x,
    Math.max(area.x, area.x + area.width - before.width)
  );
  const nextY = clamp(
    snapToGrid(before.y + dy, dashboard, options.snapEnabled),
    area.y,
    Math.max(area.y, area.y + area.height - before.height)
  );
  translateItem(item, nextX - before.x, nextY - before.y);
  return item;
};
