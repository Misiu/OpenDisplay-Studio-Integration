import type {
  DebugGridPrimitive,
  ItemBounds,
  Primitive,
  PrimitiveItem,
  StudioItem,
} from "./types";

/** A position in pixels, on the display or on the screen. */
export interface Position {
  x: number;
  y: number;
}

/** The field a turn is stored in. */
export const ROTATION_KEY = "rotation";

/** Shift snaps the turn to multiples of this many degrees. */
export const SNAP_DEGREES = 15;

const HALF_TURN = 180;
const FULL_TURN = 360;

/** The pivot the backend reported for an item, with the box it measured at the time. */
export interface ReportedPivot {
  pivot: Position;
  box: ItemBounds;
}

/** A primitive the renderer can turn: every one but the debug grid. */
export type TurnablePrimitive = Exclude<Primitive, DebugGridPrimitive>;

export const isTurnable = (
  primitive: Primitive
): primitive is TurnablePrimitive => primitive.type !== "debug_grid";

/** How far an item is turned clockwise, in degrees; 0 for one that is not. */
export const rotationOf = (item: StudioItem): number => {
  if (item.kind !== "primitive" || !isTurnable(item.primitive)) return 0;
  return item.primitive.rotation ?? 0;
};

const centerOf = (box: ItemBounds): Position => ({
  x: box.x + box.width / 2,
  y: box.y + box.height / 2,
});

/**
 * The point an item turns about. The renderer turns an element about the middle of what
 * it drew, which is not always the middle of its box (a line of text has room above
 * and below its letters); the backend reports where that is. The report is a little
 * old once the item has moved, so only its distance from the box's middle is kept.
 */
export const pivotOf = (
  box: ItemBounds,
  reported?: ReportedPivot
): Position => {
  const center = centerOf(box);
  if (!reported) return center;
  const reportedCenter = centerOf(reported.box);
  return {
    x: center.x + reported.pivot.x - reportedCenter.x,
    y: center.y + reported.pivot.y - reportedCenter.y,
  };
};

/** Where the pivot lies inside the box, in percent, for a CSS `transform-origin`. */
export const originPercent = (box: ItemBounds, pivot: Position): Position => ({
  x: box.width > 0 ? ((pivot.x - box.x) / box.width) * 100 : 50,
  y: box.height > 0 ? ((pivot.y - box.y) / box.height) * 100 : 50,
});

/** An angle in degrees brought to -180 … 180, which is how a turn is stored. */
export const wrapDegrees = (degrees: number): number => {
  const wrapped =
    ((((degrees + HALF_TURN) % FULL_TURN) + FULL_TURN) % FULL_TURN) - HALF_TURN;
  return wrapped === -HALF_TURN ? HALF_TURN : wrapped;
};

const angleTo = (from: Position, to: Position): number =>
  (Math.atan2(to.y - from.y, to.x - from.x) * HALF_TURN) / Math.PI;

/**
 * The turn an item gets when the pointer that took hold at `grabbed` is at `pointer`,
 * both on screen, about the pivot on screen. Whole degrees; with `snap`, multiples of
 * `SNAP_DEGREES`.
 */
export const turnByPointer = (
  startRotation: number,
  pivot: Position,
  grabbed: Position,
  pointer: Position,
  snap: boolean
): number => {
  const raw = startRotation + angleTo(pivot, pointer) - angleTo(pivot, grabbed);
  const turned = snap
    ? Math.round(raw / SNAP_DEGREES) * SNAP_DEGREES
    : Math.round(raw);
  return wrapDegrees(turned);
};

/** A turn as it is stored: no turn at all is `null`, so the renderer is not told one. */
export const storedRotation = (degrees: number): number | null =>
  degrees === 0 ? null : degrees;

/** The item turned to `degrees`. */
export const withRotation = (
  item: PrimitiveItem,
  degrees: number
): PrimitiveItem => {
  if (!isTurnable(item.primitive)) return item;
  return {
    ...item,
    primitive: { ...item.primitive, rotation: storedRotation(degrees) },
  };
};
