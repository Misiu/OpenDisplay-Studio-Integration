import { describe, expect, it } from 'vitest'
import { History } from './history'

describe('History', () => {
  it('undoes and redoes one recorded step at a time', () => {
    const history = new History<{ n: number }>()
    history.record({ n: 1 })
    expect(history.undoCount).toBe(1)
    const previous = history.undo({ n: 2 })
    expect(previous).toEqual({ n: 1 })
    expect(history.redoCount).toBe(1)
    expect(history.redo({ n: 1 })).toEqual({ n: 2 })
    expect(history.undoCount).toBe(1)
  })

  it('returns undefined when there is nothing to undo or redo', () => {
    const history = new History<number>()
    expect(history.undo(1)).toBeUndefined()
    expect(history.redo(1)).toBeUndefined()
  })

  it('drops the redo stack when a new step is recorded', () => {
    const history = new History<number>()
    history.record(1); history.undo(2)
    history.record(3)
    expect(history.redoCount).toBe(0)
  })

  it('stores copies, so later mutation does not rewrite history', () => {
    const history = new History<{ n: number }>()
    const value = { n: 1 }
    history.record(value); value.n = 99
    expect(history.undo({ n: 2 })).toEqual({ n: 1 })
  })

  it('keeps only the most recent hundred steps', () => {
    const history = new History<number>()
    for (let step = 0; step < 105; step++) history.record(step)
    expect(history.undoCount).toBe(100)
    expect(history.undo(0)).toBe(104)
  })

  it('clears both stacks', () => {
    const history = new History<number>()
    history.record(1); history.undo(2); history.clear()
    expect([history.undoCount, history.redoCount]).toEqual([0, 0])
  })
})
