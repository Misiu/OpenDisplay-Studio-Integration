import { clamp } from "./math";
import {
  isBoxPrimitive,
  primitiveBounds,
  translatePrimitive,
  type CornerPrimitive,
} from "./primitive-shape";
import { alignIntrinsicBounds, type ResizeHandle } from "./resize";
import type { ItemBounds, Primitive } from "./types";

/** What limits dragging a resize handle of a primitive. */
export interface ResizeConstraints {
  minimumWidth: number;
  minimumHeight: number;
  /** The shape keeps its proportions: only its one size field changes. */
  intrinsicAspect: boolean;
}

interface ResizeContext {
  /** The box the handle drag asks for. */
  requested: ItemBounds;
  /** The box before the drag. */
  before: ItemBounds;
  /** The handle, moved to the corner an intrinsic shape resizes from. */
  handle: ResizeHandle;
  /** What the backend measured for the primitive, if it has rendered it. */
  measured?: ItemBounds;
  displayWidth: number;
  displayHeight: number;
}

const MIN_TEXT_SIZE = 6;
const MAX_TEXT_SIZE = 256;
const MIN_ICON_SIZE = 8;

/** Modules along one side of a QR code including its quiet zone. */
const qrModuleCount = (
  primitive: Extract<Primitive, { type: "qrcode" }>,
  measured?: ItemBounds
): number =>
  measured
    ? Math.max(1, Math.round(measured.width / primitive.boxsize))
    : 21 + primitive.border * 2;

type TextLike = Extract<Primitive, { type: "text" | "multiline" }>;

/** The text block at another font size: scaled from the measurement when there is one. */
const textBoxAtSize = (
  primitive: TextLike,
  size: number,
  measured?: ItemBounds
): ItemBounds => {
  const scale = size / primitive.size;
  const current = primitiveBounds(primitive, measured);
  return {
    x: current.x,
    y: current.y,
    width: Math.max(1, Math.round(current.width * scale)),
    height: Math.max(1, Math.round(current.height * scale)),
  };
};

export const primitiveConstraints = (
  primitive: Primitive,
  measured?: ItemBounds
): ResizeConstraints => {
  switch (primitive.type) {
    case "circle":
    case "arc":
      return { minimumWidth: 3, minimumHeight: 3, intrinsicAspect: true };
    case "qrcode": {
      const modules = qrModuleCount(primitive, measured);
      return {
        minimumWidth: modules,
        minimumHeight: modules,
        intrinsicAspect: true,
      };
    }
    case "icon":
    case "icon_sequence":
      return {
        minimumWidth: MIN_ICON_SIZE,
        minimumHeight: MIN_ICON_SIZE,
        intrinsicAspect: true,
      };
    case "text":
    case "multiline": {
      const minimum = textBoxAtSize(primitive, MIN_TEXT_SIZE, measured);
      return {
        minimumWidth: minimum.width,
        minimumHeight: minimum.height,
        intrinsicAspect: true,
      };
    }
    case "line":
    case "dlimg":
      return { minimumWidth: 1, minimumHeight: 1, intrinsicAspect: false };
    default:
      return { minimumWidth: 2, minimumHeight: 2, intrinsicAspect: false };
  }
};

/** Whether the primitive has handles at all: a debug grid covers the display. */
export const isResizable = (primitive: Primitive): boolean =>
  primitive.type !== "debug_grid";

const resizeCorners = (
  primitive: CornerPrimitive,
  { requested }: ResizeContext,
  displayWidth: number
): void => {
  const right = requested.x + requested.width - 1;
  const bottom = requested.y + requested.height - 1;
  if (primitive.type !== "line") {
    primitive.x_start = requested.x;
    primitive.y_start = requested.y;
    primitive.x_end = right;
    primitive.y_end = bottom;
    return;
  }
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
    primitive.x_end = Math.min(displayWidth - 1, primitive.x_start + 1);
  }
};

const resizeRadial = (
  primitive: Extract<Primitive, { type: "circle" | "arc" }>,
  { requested, handle }: ResizeContext
): void => {
  const radius = Math.max(
    1,
    Math.floor((Math.min(requested.width, requested.height) - 1) / 2)
  );
  const diameter = radius * 2 + 1;
  const aligned = alignIntrinsicBounds(requested, diameter, diameter, handle);
  primitive.x = aligned.x + radius;
  primitive.y = aligned.y + radius;
  primitive.radius = radius;
};

const resizeQrCode = (
  primitive: Extract<Primitive, { type: "qrcode" }>,
  { requested, handle, measured }: ResizeContext
): void => {
  const modules = qrModuleCount(primitive, measured);
  primitive.boxsize = clamp(
    Math.floor(Math.min(requested.width, requested.height) / modules),
    1,
    16
  );
  const size = modules * primitive.boxsize;
  const aligned = alignIntrinsicBounds(requested, size, size, handle);
  primitive.x = aligned.x;
  primitive.y = aligned.y;
};

/** Move the primitive so the box it now occupies has the corner of `aligned`. */
const moveBoxTo = (
  primitive: Primitive,
  box: ItemBounds,
  aligned: ItemBounds
): void => translatePrimitive(primitive, aligned.x - box.x, aligned.y - box.y);

const resizeIcon = (
  primitive: Extract<Primitive, { type: "icon" | "icon_sequence" }>,
  { requested, before, handle }: ResizeContext
): void => {
  const previous = primitive.size;
  const ratio =
    primitive.type === "icon"
      ? Math.min(requested.width, requested.height) / Math.max(1, previous)
      : requested.width / Math.max(1, before.width);
  primitive.size = clamp(Math.round(previous * ratio), MIN_ICON_SIZE, 256);
  if (primitive.type === "icon_sequence" && primitive.spacing !== null) {
    primitive.spacing = Math.round(
      (primitive.spacing * primitive.size) / previous
    );
  }
  const box = primitiveBounds(primitive);
  const aligned = alignIntrinsicBounds(
    requested,
    box.width,
    box.height,
    handle
  );
  moveBoxTo(primitive, box, aligned);
};

const resizeText = (
  primitive: TextLike,
  { requested, before, handle, measured }: ResizeContext
): void => {
  const previous = primitive.size;
  const size = clamp(
    Math.round((previous * requested.width) / Math.max(1, before.width)),
    MIN_TEXT_SIZE,
    MAX_TEXT_SIZE
  );
  const scaledBox = textBoxAtSize(primitive, size, measured);
  primitive.size = size;
  if (primitive.type === "multiline") {
    primitive.offset_y = Math.max(
      1,
      Math.round((primitive.offset_y * size) / previous)
    );
  }
  const box = primitiveBounds(primitive, scaledBox);
  const aligned = alignIntrinsicBounds(
    requested,
    box.width,
    box.height,
    handle
  );
  moveBoxTo(primitive, box, aligned);
};

/** The cell size that makes `count` cells with `gap` between them fill `extent`. */
const cellSize = (extent: number, count: number, gap: number): number =>
  Math.max(1, Math.floor((extent - 1 - (count - 1) * gap) / count));

const resizePattern = (
  primitive: Extract<Primitive, { type: "rectangle_pattern" }>,
  { requested }: ResizeContext
): void => {
  primitive.x_start = requested.x;
  primitive.y_start = requested.y;
  primitive.x_size = cellSize(
    requested.width,
    primitive.x_repeat,
    primitive.x_offset
  );
  primitive.y_size = cellSize(
    requested.height,
    primitive.y_repeat,
    primitive.y_offset
  );
};

/** Stretch every point from the old box to the new one. */
const resizePolygon = (
  primitive: Extract<Primitive, { type: "polygon" }>,
  { requested, before }: ResizeContext
): void => {
  const scaleX = (requested.width - 1) / Math.max(1, before.width - 1);
  const scaleY = (requested.height - 1) / Math.max(1, before.height - 1);
  primitive.points = primitive.points.map(([x, y]) => [
    Math.round(requested.x + (x - before.x) * scaleX),
    Math.round(requested.y + (y - before.y) * scaleY),
  ]);
};

/** Resize a primitive in place to the box `context.requested` asks for. */
export const resizePrimitive = (
  primitive: Primitive,
  context: ResizeContext
): void => {
  if (isBoxPrimitive(primitive)) {
    resizeCorners(primitive, context, context.displayWidth);
    return;
  }
  switch (primitive.type) {
    case "circle":
    case "arc":
      resizeRadial(primitive, context);
      return;
    case "qrcode":
      resizeQrCode(primitive, context);
      return;
    case "icon":
    case "icon_sequence":
      resizeIcon(primitive, context);
      return;
    case "text":
    case "multiline":
      resizeText(primitive, context);
      return;
    case "rectangle_pattern":
      resizePattern(primitive, context);
      return;
    case "polygon":
      resizePolygon(primitive, context);
      return;
    case "dlimg":
      primitive.x = context.requested.x;
      primitive.y = context.requested.y;
      primitive.xsize = context.requested.width;
      primitive.ysize = context.requested.height;
      return;
    case "debug_grid":
      return;
  }
};
