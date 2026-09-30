/**
 * The text of the input or select an event came from. This is the one place that
 * reads it from `event.target`, which the DOM types as a plain `EventTarget`.
 */
export const inputValue = (event: Event): string =>
  (event.target as HTMLInputElement | HTMLSelectElement).value;

/** True while the user is typing in a field, where shortcuts must stay out of the way. */
export const isTypingTarget = (event: Event): boolean =>
  event
    .composedPath()
    .some(
      (target) =>
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") || target.isContentEditable)
    );

/** True on macOS and iOS, where shortcuts use ⌘ instead of Ctrl. */
export const isMacPlatform = (): boolean =>
  /Mac|iPhone|iPad/.test(navigator.platform);
