import { describe, expect, it } from 'vitest'
import { createProject } from './storage'

describe('new project defaults', () => {
  it('pins a new display to the current Home Assistant language', () => {
    expect(createProject('Kuchnia', 'pl').language).toBe('pl')
  })

  it('keeps English as the standalone development fallback', () => {
    expect(createProject().language).toBe('en')
  })

  it('uses the same baseline display preferences as the renderer contract', () => {
    const project = createProject()

    expect(project.theme).toBe('light')
    expect(project.fontFamily).toBe('default')
    expect(project.textScale).toBe('regular')
  })
})
