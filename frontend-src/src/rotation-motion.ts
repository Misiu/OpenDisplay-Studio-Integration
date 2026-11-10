/**
 * How a display turns in the preview: it first leans a little the wrong way, swings round
 * past where it ends up, and settles back. All in degrees and milliseconds.
 */
export const TURN_DURATION_MS = 860;
const LEAN_BACK_DEGREES = 6;
const OVERSHOOT_DEGREES = 9;

/** Where each part of the motion ends, as a share of the whole. */
const LEAN_ENDS = 0.13;
const SWING_ENDS = 0.76;

const easeOutSine = (progress: number): number =>
  Math.sin((Math.PI / 2) * progress);

const easeOutCubic = (progress: number): number => 1 - (1 - progress) ** 3;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/** The angle at `progress` (0 to 1) of a turn from `from` to `to`. */
export const turnAngleAt = (
  from: number,
  to: number,
  progress: number
): number => {
  const direction = Math.sign(to - from);
  if (direction === 0) return to;
  const time = clamp01(progress);
  if (time >= 1) return to;
  if (time < LEAN_ENDS) {
    const lean = easeOutSine(time / LEAN_ENDS);
    return from - direction * LEAN_BACK_DEGREES * lean;
  }
  if (time < SWING_ENDS) {
    const swing = easeOutCubic((time - LEAN_ENDS) / (SWING_ENDS - LEAN_ENDS));
    const start = from - direction * LEAN_BACK_DEGREES;
    const reach =
      to - from + direction * (LEAN_BACK_DEGREES + OVERSHOOT_DEGREES);
    return start + reach * swing;
  }
  const settle = easeOutCubic((time - SWING_ENDS) / (1 - SWING_ENDS));
  return to + direction * OVERSHOOT_DEGREES * (1 - settle);
};

/**
 * The turn that takes a display from one of the four rotations to another by the short way,
 * so going from 270° to 0° keeps turning forward. Half a turn goes the same way as a click on
 * the right arrow.
 */
export const shortestTurn = (fromAngle: number, toRotation: number): number => {
  const current = ((fromAngle % 360) + 360) % 360;
  const raw = ((toRotation - current + 540) % 360) - 180;
  return raw === -180 ? 180 : raw;
};
