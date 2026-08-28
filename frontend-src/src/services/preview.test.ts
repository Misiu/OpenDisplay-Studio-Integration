import { describe, expect, it } from 'vitest'
import { createProject } from './storage'
import { projectForPreview } from './preview'

describe('project preview projection', () => {
  it('renders only the display surface behind interactive layout regions', () => {
    const project = createProject('Layout', 'en')
    const preview = projectForPreview(project, true)

    expect(preview.regions).toEqual([])
    expect(project.regions).not.toEqual([])
    expect(preview.background).toBe(project.background)
  })

  it('keeps the complete project for the final widget preview', () => {
    const project = createProject('Widgets', 'en')

    expect(projectForPreview(project, false)).toBe(project)
  })
})
