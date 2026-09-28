import { describe, expect, it } from 'vitest'
import { createPrimitive } from './primitives'
import type { Primitive } from './types'

const primitiveTypes: Primitive['type'][] = [
  'text',
  'rectangle',
  'line',
  'circle',
  'ellipse',
  'icon',
  'qrcode',
  'progress_bar',
]

describe('createPrimitive', () => {
  it.each(primitiveTypes)('preserves the selected %s type', type => {
    const primitive = createPrimitive(type, { x: 100, y: 100, displayWidth: 800, displayHeight: 480 })
    expect(primitive?.type).toBe(type)
  })

  it('rejects an unknown catalog type instead of silently creating a rectangle', () => {
    expect(createPrimitive('unknown', { x: 100, y: 100, displayWidth: 800, displayHeight: 480 })).toBeUndefined()
  })
})
