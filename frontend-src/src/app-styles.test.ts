import { describe, expect, it } from 'vitest'
import { appStyles } from './app-styles'

describe('editor selection styles', () => {
  it('uses a theme-aware red selection token instead of the display palette accent', () => {
    expect(appStyles.cssText).toContain('--odx-selection: var(--error-color, #db4437)')
    expect(appStyles.cssText).toMatch(/\.screen-region\.selected\s*{[^}]*var\(--odx-selection\)/s)
  })

  it('provides a visible keyboard focus indicator', () => {
    expect(appStyles.cssText).toMatch(/\.screen-region:focus-visible\s*{[^}]*var\(--odx-blue\)/s)
  })
})

describe('layout editor styles', () => {
  it('keeps regions translucent so the display background stays visible', () => {
    expect(appStyles.cssText).toMatch(
      /\.preview-overlay \.screen-region\.layout-region\s*{[^}]*var\(--screen-paper\) 50%/s,
    )
    expect(appStyles.cssText).toMatch(
      /\.merge-cell\s*{[^}]*var\(--screen-paper\) 50%/s,
    )
  })

  it('contains long media values inside the inspector', () => {
    expect(appStyles.cssText).toMatch(/\.inspector\s*{[^}]*min-width:\s*0[^}]*overflow-x:\s*hidden/s)
    expect(appStyles.cssText).toMatch(/\.background-media-form\s*{[^}]*overflow:\s*hidden/s)
  })

  it('supports a compact project rail without shrinking the canvas', () => {
    expect(appStyles.cssText).toMatch(
      /\.workspace\.rail-collapsed\s*{[^}]*grid-template-columns:\s*48px minmax\(480px,\s*1fr\) 328px/s,
    )
  })

  it('keeps the interactive merge grid bounded when preview variables are unavailable', () => {
    expect(appStyles.cssText).toMatch(
      /\.display-screen\.live-preview \.merge-layer\s*{[^}]*inset:\s*var\(--preview-gap,\s*clamp\([^}]*gap:\s*var\(--preview-gap,\s*clamp\(/s,
    )
  })
})
