import type { Rotation } from "./types";

export interface Size {
  width: number;
  height: number;
}

/**
 * A display drawn for a picture: its housing and its screen as the device is built, before
 * it is turned. All sizes are in the units of the box it was fitted into.
 */
export interface DisplayShape {
  housing: Size;
  screen: Size;
  bezel: number;
}

const BEZEL_RATIO = 0.03;
const MIN_BEZEL = 2.5;
const MAX_BEZEL = 5;

const clamp = (value: number, low: number, high: number): number =>
  Math.min(high, Math.max(low, value));

const isSideways = (turn: Rotation): boolean => turn === 90 || turn === 270;

const asBuilt = (size: Size, turn: Rotation): Size =>
  isSideways(turn) ? { width: size.height, height: size.width } : size;

/**
 * The display as the device is built, as large as the box takes it. `display` is the
 * canvas of the dashboard, so a display turned a quarter is already taller than it is wide;
 * the device itself is wider, and turning it is what makes the canvas.
 */
export const displayShape = (
  display: Size & { rotation: Rotation },
  box: Size
): DisplayShape => {
  const built = asBuilt(display, display.rotation);
  const bezel = clamp(
    Math.min(box.width, box.height) * BEZEL_RATIO,
    MIN_BEZEL,
    MAX_BEZEL
  );
  const scale = Math.min(
    (box.width - 2 * bezel) / built.width,
    (box.height - 2 * bezel) / built.height
  );
  const screen = { width: built.width * scale, height: built.height * scale };
  return {
    housing: {
      width: screen.width + 2 * bezel,
      height: screen.height + 2 * bezel,
    },
    screen,
    bezel,
  };
};

const radians = (degrees: number): number => (degrees * Math.PI) / 180;

/** The size of the smallest upright box around a box turned by `degrees`. */
const turnedBounds = (size: Size, degrees: number): Size => {
  const cos = Math.abs(Math.cos(radians(degrees)));
  const sin = Math.abs(Math.sin(radians(degrees)));
  return {
    width: size.width * cos + size.height * sin,
    height: size.width * sin + size.height * cos,
  };
};

/**
 * How much a device turned by `degrees` is shrunk to stay inside the box: not at all when
 * it is level or upside down, and the most when it is halfway between.
 */
export const fitScale = (housing: Size, degrees: number, box: Size): number => {
  const bounds = turnedBounds(housing, degrees);
  return Math.min(1, box.width / bounds.width, box.height / bounds.height);
};

/**
 * The largest upright box that fits inside a screen turned by `degrees`. The picture on the
 * screen is drawn in it, so the content stays upright and inside the screen all the way
 * round: it is the screen's own size when level, and the screen turned on its side at 90°.
 */
export const inkView = (screen: Size, degrees: number): Size => {
  const cos = Math.abs(Math.cos(radians(degrees)));
  const sin = Math.abs(Math.sin(radians(degrees)));
  const bounds = turnedBounds(screen, degrees);
  const aspect = bounds.width / bounds.height;
  const width = Math.min(
    screen.width / (cos + sin / aspect),
    screen.height / (sin + cos / aspect)
  );
  return { width, height: width / aspect };
};
