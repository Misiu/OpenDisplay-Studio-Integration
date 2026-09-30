export const clamp = (
  value: number,
  minimum: number,
  maximum: number
): number => Math.max(minimum, Math.min(maximum, value));

/** Round `value` to the nearest multiple of `size`, counted from `origin`. */
export const snap = (value: number, size: number, origin = 0): number =>
  origin + Math.round((value - origin) / size) * size;
