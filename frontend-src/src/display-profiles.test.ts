import { describe, expect, it } from 'vitest'
import { DISPLAY_PROFILES, PALETTE_COLORS, profileById } from './display-profiles'

describe('display profiles', () => {
  it('offers a useful predefined display library plus a custom profile', () => {
    expect(DISPLAY_PROFILES.length).toBeGreaterThanOrEqual(20)
    expect(DISPLAY_PROFILES.at(-1)?.id).toBe('custom')
    expect(profileById('solum-7-5')).toMatchObject({ width: 800, height: 480 })
    expect(profileById('eink-spectra6-7-3')).toMatchObject({ width: 800, height: 480, defaultPalette: 'spectra6' })
  })

  it('defines the complete Spectra 6 color set', () => {
    expect(PALETTE_COLORS.spectra6).toEqual(['black', 'white', 'red', 'yellow', 'blue', 'green'])
  })

  it('defines valid dimensions and a supported default palette', () => {
    for (const profile of DISPLAY_PROFILES) {
      expect(profile.width).toBeGreaterThan(0)
      expect(profile.height).toBeGreaterThan(0)
      expect(profile.palettes).toContain(profile.defaultPalette)
    }
  })

  it('falls back to the first known display profile', () => {
    expect(profileById('missing')).toBe(DISPLAY_PROFILES[0])
    expect(profileById(null)).toBe(DISPLAY_PROFILES[0])
  })
})
