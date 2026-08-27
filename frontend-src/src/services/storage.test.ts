import { describe, expect, it } from 'vitest'
import { createProject } from './storage'

describe('project language', () => {
  it('pins a new display to the current Home Assistant language', () => {
    expect(createProject('Kuchnia', 'pl').language).toBe('pl')
  })

  it('keeps English as the standalone development fallback', () => {
    expect(createProject().language).toBe('en')
  })
})
