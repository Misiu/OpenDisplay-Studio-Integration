import type { ItemBounds } from './types'

export const RESIZE_HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const

export type ResizeHandle = typeof RESIZE_HANDLES[number]

interface ResizeBoundsOptions {
  bounds: ItemBounds
  handle: ResizeHandle
  deltaX: number
  deltaY: number
  minimumWidth: number
  minimumHeight: number
  area: ItemBounds
  preserveAspect: boolean
  snapSize: number
  snapEnabled: boolean
}

const clamp = (value: number, minimum: number, maximum: number): number => Math.max(minimum, Math.min(maximum, value))

const snap = (value: number, size: number, origin: number): number => origin + Math.round((value - origin) / size) * size

const hasHorizontalEdge = (handle: ResizeHandle): boolean => handle.includes('e') || handle.includes('w')

const hasVerticalEdge = (handle: ResizeHandle): boolean => handle.includes('n') || handle.includes('s')

const snapped = (value: number, size: number, origin: number, enabled: boolean): number => enabled ? snap(value, size, origin) : Math.round(value)

/**
 * Resize one exclusive-edge rectangle from a directional handle.
 *
 * The edge opposite the active handle remains fixed. Side handles keep the
 * perpendicular center fixed when aspect ratio locking is enabled.
 */
export const resizeBounds = ({
  bounds,
  handle,
  deltaX,
  deltaY,
  minimumWidth,
  minimumHeight,
  area,
  preserveAspect,
  snapSize,
  snapEnabled,
}: ResizeBoundsOptions): ItemBounds => {
  const areaRight = area.x + area.width
  const areaBottom = area.y + area.height
  const originalLeft = bounds.x
  const originalTop = bounds.y
  const originalRight = bounds.x + bounds.width
  const originalBottom = bounds.y + bounds.height
  const originalCenterX = originalLeft + bounds.width / 2
  const originalCenterY = originalTop + bounds.height / 2

  let left = originalLeft
  let top = originalTop
  let right = originalRight
  let bottom = originalBottom

  if (handle.includes('w')) left = snapped(originalLeft + deltaX, snapSize, area.x, snapEnabled)
  if (handle.includes('e')) right = snapped(originalRight + deltaX, snapSize, area.x, snapEnabled)
  if (handle.includes('n')) top = snapped(originalTop + deltaY, snapSize, area.y, snapEnabled)
  if (handle.includes('s')) bottom = snapped(originalBottom + deltaY, snapSize, area.y, snapEnabled)

  if (handle.includes('w')) left = clamp(left, area.x, originalRight - minimumWidth)
  if (handle.includes('e')) right = clamp(right, originalLeft + minimumWidth, areaRight)
  if (handle.includes('n')) top = clamp(top, area.y, originalBottom - minimumHeight)
  if (handle.includes('s')) bottom = clamp(bottom, originalTop + minimumHeight, areaBottom)

  if (!preserveAspect) {
    return {
      x: Math.round(left),
      y: Math.round(top),
      width: Math.round(right - left),
      height: Math.round(bottom - top),
    }
  }

  const aspect = bounds.width / Math.max(1, bounds.height)
  const candidateWidth = Math.max(minimumWidth, right - left)
  const candidateHeight = Math.max(minimumHeight, bottom - top)
  const horizontalChange = Math.abs(candidateWidth - bounds.width) / Math.max(1, bounds.width)
  const verticalChange = Math.abs(candidateHeight - bounds.height) / Math.max(1, bounds.height)

  let width: number
  let height: number
  if (hasHorizontalEdge(handle) && (!hasVerticalEdge(handle) || horizontalChange >= verticalChange)) {
    width = candidateWidth
    height = width / aspect
  } else {
    height = candidateHeight
    width = height * aspect
  }

  const maximumWidth = handle.includes('w')
    ? originalRight - area.x
    : handle.includes('e')
      ? areaRight - originalLeft
      : Math.max(1, Math.min(originalCenterX - area.x, areaRight - originalCenterX) * 2)
  const maximumHeight = handle.includes('n')
    ? originalBottom - area.y
    : handle.includes('s')
      ? areaBottom - originalTop
      : Math.max(1, Math.min(originalCenterY - area.y, areaBottom - originalCenterY) * 2)
  const minimumScale = Math.max(minimumWidth / Math.max(1, bounds.width), minimumHeight / Math.max(1, bounds.height))
  const maximumScale = Math.min(maximumWidth / Math.max(1, bounds.width), maximumHeight / Math.max(1, bounds.height))
  const requestedScale = Math.max(width / Math.max(1, bounds.width), height / Math.max(1, bounds.height))
  const scale = clamp(requestedScale, Math.min(minimumScale, maximumScale), maximumScale)
  width = Math.max(1, Math.round(bounds.width * scale))
  height = Math.max(1, Math.round(bounds.height * scale))

  if (handle.includes('w')) left = originalRight - width
  else if (handle.includes('e')) left = originalLeft
  else left = originalCenterX - width / 2

  if (handle.includes('n')) top = originalBottom - height
  else if (handle.includes('s')) top = originalTop
  else top = originalCenterY - height / 2

  left = clamp(Math.round(left), area.x, areaRight - width)
  top = clamp(Math.round(top), area.y, areaBottom - height)
  return { x: left, y: top, width, height }
}

/** Align a quantized intrinsic-size item to the same fixed edges as its requested bounds. */
export const alignIntrinsicBounds = (
  requested: ItemBounds,
  width: number,
  height: number,
  handle: ResizeHandle,
): ItemBounds => {
  const x = handle.includes('w')
    ? requested.x + requested.width - width
    : handle.includes('e')
      ? requested.x
      : requested.x + (requested.width - width) / 2
  const y = handle.includes('n')
    ? requested.y + requested.height - height
    : handle.includes('s')
      ? requested.y
      : requested.y + (requested.height - height) / 2
  return { x: Math.round(x), y: Math.round(y), width, height }
}
