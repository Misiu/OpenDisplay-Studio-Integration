/**
 * The text of the input or select an event came from. This is the one place that
 * reads it from `event.target`, which the DOM types as a plain `EventTarget`.
 */
export const inputValue = (event: Event): string =>
  (event.target as HTMLInputElement | HTMLSelectElement).value;
