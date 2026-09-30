/** The key of the expression that shows or hides an item. */
export const VISIBLE_KEY = "visible";

/**
 * A value is an expression when it is a string holding a Jinja delimiter. The same
 * rule is `is_expression` in the backend's `validation.py`; expressions are stored
 * and shown exactly as typed.
 */
export const isExpressionValue = (value: unknown): value is string =>
  typeof value === "string" && (value.includes("{{") || value.includes("{%"));

const BACKSLASH = String.fromCharCode(92);

/** A Jinja string literal: backslashes and single quotes are escaped. */
const quote = (text: string): string => {
  const escaped = text
    .replaceAll(BACKSLASH, BACKSLASH + BACKSLASH)
    .replaceAll("'", `${BACKSLASH}'`);
  return `'${escaped}'`;
};

/**
 * The expression a field starts with when the user switches it to expression mode:
 * one that yields its current value, so nothing changes until they edit it.
 */
export const seedExpression = (literal: unknown): string => {
  if (typeof literal === "string") return `{{ ${quote(literal)} }}`;
  if (typeof literal === "boolean") return `{{ ${literal} }}`;
  if (typeof literal === "number") return `{{ ${literal} }}`;
  return "{{ none }}";
};
