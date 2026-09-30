export interface GestureTarget {
  addEventListener(type: string, listener: (event: PointerEvent) => void): void;
  removeEventListener(
    type: string,
    listener: (event: PointerEvent) => void
  ): void;
}

interface GesturePoint {
  clientX: number;
  clientY: number;
}

interface PointerGestureOptions {
  /** Where the pointer went down; movement is measured from here. */
  origin: GesturePoint;
  /** Distance in px before the gesture counts as started; 0 starts on the first move. */
  threshold?: number;
  /** Listener host, `window` by default. */
  target?: GestureTarget;
  /** Called once, on the first move past the threshold. */
  onActivate?: (event: PointerEvent) => void;
  /** Called on every move once activated. */
  onMove?: (event: PointerEvent) => void;
  /** Called when the pointer is released, whether or not the gesture activated. */
  onEnd?: (event: PointerEvent, activated: boolean) => void;
  onCancel?: () => void;
}

/**
 * Track one pointer gesture on `window`: threshold, move, release, cancel. Every
 * listener is removed when the gesture ends; the returned function ends it early
 * without calling any handler.
 */
export const trackPointerGesture = (
  options: PointerGestureOptions
): (() => void) => {
  const {
    origin,
    threshold = 0,
    target = window,
    onActivate,
    onMove,
    onEnd,
    onCancel,
  } = options;
  let activated = false;
  const dispose = (): void => {
    target.removeEventListener("pointermove", handleMove);
    target.removeEventListener("pointerup", handleUp);
    target.removeEventListener("pointercancel", handleCancel);
  };
  const handleMove = (event: PointerEvent): void => {
    if (!activated) {
      if (
        Math.hypot(
          event.clientX - origin.clientX,
          event.clientY - origin.clientY
        ) < threshold
      ) {
        return;
      }
      activated = true;
      onActivate?.(event);
    }
    onMove?.(event);
  };
  const handleUp = (event: PointerEvent): void => {
    dispose();
    onEnd?.(event, activated);
  };
  const handleCancel = (): void => {
    dispose();
    onCancel?.();
  };
  target.addEventListener("pointermove", handleMove);
  target.addEventListener("pointerup", handleUp);
  target.addEventListener("pointercancel", handleCancel);
  return dispose;
};
