const MAX_STEPS = 100

/** Undo/redo stacks of document snapshots. Snapshots are copied on the way in and out. */
export class History<T> {
  private undoStack: T[] = []
  private redoStack: T[] = []

  get undoCount(): number { return this.undoStack.length }
  get redoCount(): number { return this.redoStack.length }

  /** Remember the state before a change; a new change invalidates redo. */
  record(before: T): void {
    this.undoStack.push(structuredClone(before))
    if (this.undoStack.length > MAX_STEPS) this.undoStack.shift()
    this.redoStack = []
  }

  /** Swap `current` for the previous state, or return undefined when there is none. */
  undo(current: T): T | undefined {
    const previous = this.undoStack.pop()
    if (previous === undefined) return undefined
    this.redoStack.push(structuredClone(current))
    return previous
  }

  redo(current: T): T | undefined {
    const next = this.redoStack.pop()
    if (next === undefined) return undefined
    this.undoStack.push(structuredClone(current))
    return next
  }

  clear(): void {
    this.undoStack = []
    this.redoStack = []
  }
}
