import type { ScreenProject } from '../types'
import { createId, createRegions, gridForOrientation } from './layout'
import { DEFAULT_DISPLAY_PROFILE_ID, getDisplayProfile } from '../data/display-profiles'

export const createProject = (name = 'Kitchen display', language = 'en'): ScreenProject => {
  const display = getDisplayProfile(DEFAULT_DISPLAY_PROFILE_ID)
  const orientation = 'landscape' as const
  const grid = gridForOrientation(display, orientation)
  const now = new Date().toISOString()
  return {
    id: createId(),
    schemaVersion: 1,
    name,
    status: 'draft',
    language,
    theme: 'light',
    fontFamily: 'default',
    textScale: 'regular',
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
