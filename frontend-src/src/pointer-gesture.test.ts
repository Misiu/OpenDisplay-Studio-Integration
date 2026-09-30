import { describe, expect, it } from 'vitest'
import { trackPointerGesture, type GestureTarget } from './pointer-gesture'

class FakeTarget implements GestureTarget {
  private readonly listeners = new Map<string, Set<(event: never) => void>>()
  addEventListener(type: string, listener: (event: never) => void): void {
    const set = this.listeners.get(type) ?? new Set(); set.add(listener); this.listeners.set(type, set)
  }
  removeEventListener(type: string, listener: (event: never) => void): void { this.listeners.get(type)?.delete(listener) }
  emit(type: string, clientX = 0, clientY = 0): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) listener({ clientX, clientY } as never)
  }
  get listenerCount(): number { return [...this.listeners.values()].reduce((total, set) => total + set.size, 0) }
}

const pointer = (x: number, y: number) => ({ clientX: x, clientY: y })

describe('trackPointerGesture', () => {
  it('ignores movement below the threshold and activates once beyond it', () => {
    const target = new FakeTarget(); const log: string[] = []
    trackPointerGesture({ origin: pointer(0, 0), threshold: 4, target, onActivate: () => log.push('activate'), onMove: () => log.push('move') })
    target.emit('pointermove', 2, 2)
    expect(log).toEqual([])
    target.emit('pointermove', 5, 0); target.emit('pointermove', 6, 0)
    expect(log).toEqual(['activate', 'move', 'move'])
  })

  it('reports whether the gesture activated when the pointer is released', () => {
    const target = new FakeTarget(); const ends: boolean[] = []
    trackPointerGesture({ origin: pointer(0, 0), threshold: 4, target, onEnd: (_event, activated) => ends.push(activated) })
    target.emit('pointerup')
    trackPointerGesture({ origin: pointer(0, 0), threshold: 4, target, onEnd: (_event, activated) => ends.push(activated) })
    target.emit('pointermove', 10, 0); target.emit('pointerup')
    expect(ends).toEqual([false, true])
  })

  it('removes every listener when the gesture ends or is cancelled', () => {
    const target = new FakeTarget()
    trackPointerGesture({ origin: pointer(0, 0), target })
    expect(target.listenerCount).toBeGreaterThan(0)
    target.emit('pointerup')
    expect(target.listenerCount).toBe(0)
    let cancelled = false
    trackPointerGesture({ origin: pointer(0, 0), target, onCancel: () => { cancelled = true } })
    target.emit('pointercancel')
    expect(cancelled).toBe(true)
    expect(target.listenerCount).toBe(0)
  })

  it('can be disposed from outside without calling the end handler', () => {
    const target = new FakeTarget(); let ended = false
    const dispose = trackPointerGesture({ origin: pointer(0, 0), target, onEnd: () => { ended = true } })
    dispose()
    target.emit('pointerup')
    expect(ended).toBe(false)
    expect(target.listenerCount).toBe(0)
  })

  it('activates immediately when no threshold is given', () => {
    const target = new FakeTarget(); let moves = 0
    trackPointerGesture({ origin: pointer(0, 0), target, onMove: () => { moves++ } })
    target.emit('pointermove', 1, 0)
    expect(moves).toBe(1)
  })
})
