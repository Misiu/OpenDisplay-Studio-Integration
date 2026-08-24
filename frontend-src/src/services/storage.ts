import type { ScreenProject } from '../types'
import { createId, createRegions, gridForOrientation } from './layout'
import { getDisplayProfile } from '../data/display-profiles'

const DEFAULT_DISPLAY = 'solum-newton-pro-5-8'

export const createProject = (name = 'Kitchen display'): ScreenProject => {
  const display = getDisplayProfile(DEFAULT_DISPLAY)
  const orientation = 'landscape' as const
  const grid = gridForOrientation(display, orientation)
  const now = new Date().toISOString()
  return {
    id: createId(),
    schemaVersion: 1,
    name,
    status: 'draft',
    displayId: display.id,
    orientation,
    palette: display.defaultPalette,
    width: display.nativeWidth,
    height: display.nativeHeight,
    grid,
    regions: createRegions(grid),
    createdAt: now,
    updatedAt: now,
  }
}

// Home Assistant's versioned Store is authoritative in Stage 3. This module only
// creates new in-memory drafts before they are sent through the WebSocket API.
