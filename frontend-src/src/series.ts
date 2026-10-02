import type { PrimitiveField } from "./types";

/** One line of a history plot: the entity and how it is drawn. */
export type Series = Record<string, unknown>;

/** The key of the field that names the entity of a series. */
export const ENTITY_KEY = "entity";

/** Whether a list field holds series: its entries have an entity to pick. */
export const isSeriesField = (field: PrimitiveField): boolean =>
  field.shape === "objects" &&
  (field.nested ?? []).some((child) => child.shape === "entity");

const isRecord = (value: unknown): value is Series =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const seriesOf = (value: unknown): Series[] =>
  Array.isArray(value) ? value.filter(isRecord) : [];

/** A new series of the defaults of the field, drawing `entity`. */
export const newSeries = (field: PrimitiveField, entity = ""): Series => {
  const defaults = (field.nested ?? []).flatMap((child) =>
    child.default === undefined ? [] : [[child.key, child.default]]
  );
  return { ...Object.fromEntries(defaults), [ENTITY_KEY]: entity };
};

export const canAddSeries = (field: PrimitiveField, list: Series[]): boolean =>
  list.length < (typeof field.max === "number" ? field.max : list.length + 1);

export const canRemoveSeries = (
  field: PrimitiveField,
  list: Series[]
): boolean => list.length > (typeof field.min === "number" ? field.min : 1);

export const withSeriesValues = (
  list: Series[],
  index: number,
  values: Series
): Series[] =>
  list.map((series, at) => (at === index ? { ...series, ...values } : series));

export const withoutSeries = (list: Series[], index: number): Series[] =>
  list.filter((_, at) => at !== index);
