import type { ScreenProject } from '../types'

export const projectForPreview = (
  project: ScreenProject,
  layoutMode: boolean,
): ScreenProject => layoutMode
  ? { ...project, regions: [] }
  : project
