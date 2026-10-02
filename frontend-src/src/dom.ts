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

/** Saves `text` as a file the browser downloads. */
export const downloadFile = (
  fileName: string,
  text: string,
  type = "application/json"
): void => {
  const address = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = address;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(address);
};

/** Opens the browser's file chooser; resolves with the file, or `undefined` if none is chosen. */
export const chooseFile = (accept: string): Promise<File | undefined> =>
  new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.addEventListener("change", () => resolve(input.files?.[0]));
    input.addEventListener("cancel", () => resolve(undefined));
    input.click();
  });
