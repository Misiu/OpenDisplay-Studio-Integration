import type { FieldShape, PrimitiveField } from "./types";

/**
 * Some field values have no control of their own in `ha-form`: a list of points is
 * typed as lines of text, a set of flags is picked from a multiple select. A codec
 * turns the stored value into what the control shows and back.
 */
interface FieldCodec {
  toForm: (value: unknown) => unknown;
  /** The stored value, or `UNCHANGED` when what the user typed is not a value yet. */
  fromForm: (value: unknown) => unknown;
}

/** What `fromForm` returns for input that is not a value (yet): keep the old one. */
export const UNCHANGED = Symbol("unchanged");

const TRANSPARENT = "transparent";
const POINT_LINE = /^\s*(-?\d+)\s*[,;\s]\s*(-?\d+)\s*$/;

const isEmptyObject = (value: unknown): boolean =>
  typeof value === "object" &&
  value !== null &&
  Object.keys(value).length === 0;

/** Lines of "x, y" to points; a line that is not a pair makes the whole text invalid. */
const parsePoints = (value: unknown): unknown => {
  if (typeof value !== "string") return UNCHANGED;
  const lines = value.split("\n").filter((line) => line.trim() !== "");
  const points: [number, number][] = [];
  for (const line of lines) {
    const match = POINT_LINE.exec(line);
    if (!match) return UNCHANGED;
    points.push([Number(match[1]), Number(match[2])]);
  }
  return points;
};

const formatPoints = (value: unknown): string =>
  Array.isArray(value)
    ? value.map((point: unknown) => String(point).replace(",", ", ")).join("\n")
    : "";

const CODECS: Partial<Record<FieldShape, FieldCodec>> = {
  flags: {
    toForm: (value) =>
      typeof value === "string" && value !== "" ? value.split(",") : [],
    fromForm: (value) =>
      Array.isArray(value) && value.length > 0 ? value.join(",") : null,
  },
  points: { toForm: formatPoints, fromForm: parsePoints },
  icons: {
    toForm: (value) => (Array.isArray(value) ? value.join("\n") : ""),
    fromForm: (value) =>
      typeof value === "string"
        ? value
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line !== "")
        : UNCHANGED,
  },
  object: {
    toForm: (value) => value ?? {},
    fromForm: (value) => (isEmptyObject(value) ? null : value),
  },
};

/** An optional field with no value is shown empty and stored as `null`. */
const isUnset = (value: unknown): boolean =>
  value === undefined || value === "" || Number.isNaN(value);

export const valueForForm = (
  field: PrimitiveField,
  value: unknown
): unknown => {
  if (field.nullable && field.shape === "color" && value === null) {
    return TRANSPARENT;
  }
  if (value === null && field.optional && !CODECS[field.shape]) {
    return undefined;
  }
  return CODECS[field.shape]?.toForm(value) ?? value;
};

export const valueFromForm = (
  field: PrimitiveField,
  value: unknown
): unknown => {
  if (field.nullable && field.shape === "color" && value === TRANSPARENT) {
    return null;
  }
  const codec = CODECS[field.shape];
  if (codec) return codec.fromForm(value);
  return field.optional && isUnset(value) ? null : value;
};
