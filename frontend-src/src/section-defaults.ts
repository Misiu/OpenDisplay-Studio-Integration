/** A field of an inspector section, as far as its default is concerned. */
export interface DefaultedField {
  key: string;
  default?: unknown;
}

const sameValue = (first: unknown, second: unknown): boolean =>
  JSON.stringify(first ?? null) === JSON.stringify(second ?? null);

/**
 * The fields of a section that no longer have their default: another value, or an expression
 * that computes it. An unset optional field is at its default.
 */
export const changedFields = <Field extends DefaultedField>(
  fields: Field[],
  values: Record<string, unknown>,
  expressions: Record<string, string> = {}
): Field[] =>
  fields.filter(
    (field) =>
      field.key in expressions || !sameValue(values[field.key], field.default)
  );

/** What the changed fields go back to: their default, or unset when they have none. */
export const defaultValues = (
  fields: DefaultedField[]
): Record<string, unknown> =>
  Object.fromEntries(fields.map((field) => [field.key, field.default ?? null]));
