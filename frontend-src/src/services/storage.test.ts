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
    expect(project.screenPadding).toBe(8)
    expect(project.regionGap).toBe(8)
  })

  it('creates a new display as the Seeed 7.5-inch DIY EE04 profile', () => {
    const project = createProject()

    expect(project.displayId).toBe('opendisplay-seeed-7-5-diy')
    expect(project.palette).toBe('bw')
    expect(project.width).toBe(800)
    expect(project.height).toBe(480)
    expect(project.grid).toEqual({ columns: 3, rows: 3 })
  })
})
