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
