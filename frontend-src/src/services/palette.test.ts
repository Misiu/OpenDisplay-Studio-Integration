import { describe, expect, it } from 'vitest'
import { paletteColors, resolvePaletteColor } from './palette'

describe('display palette colors', () => {
  it.each([
    ['bw', 2],
    ['bwr', 3],
    ['bwry', 4],
    ['spectra6', 6],
    ['gray16', 16],
  ] as const)('exposes exactly the colors supported by %s', (palette, count) => {
    expect(paletteColors(palette)).toHaveLength(count)
  })

  it('falls back to black when an accent is unavailable', () => {
    expect(resolvePaletteColor('bw', '#d22626')).toBe('#000000')
    expect(resolvePaletteColor('bwry', '#d22626')).toBe('#d22626')
  })
})
