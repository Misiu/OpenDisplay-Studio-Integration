const textOf = (value: unknown): string | undefined =>
  typeof value === "string" && value !== "" ? value : undefined;

/**
 * What to tell the user about a failure. Home Assistant rejects a WebSocket command with a
 * plain object `{ code, message }`, not an `Error`, so both shapes are read; the message the
 * backend wrote names the item and field, which is worth more than a general sentence.
 */
export const messageFrom = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return textOf(error.message) ?? fallback;
  if (typeof error === "object" && error !== null && "message" in error) {
    return textOf(error.message) ?? fallback;
  }
  return textOf(error) ?? fallback;
};
