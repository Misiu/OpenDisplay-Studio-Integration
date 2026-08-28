import type {
  BackgroundAnchor,
  BackgroundMode,
  DisplayBackground,
  MediaSelectorValue,
} from '../types'

export const BACKGROUND_MODES: ReadonlyArray<{ value: BackgroundMode, label: string }> = [
  { value: 'stretch', label: 'Stretch' },
  { value: 'contain', label: 'Fit' },
  { value: 'cover', label: 'Cover' },
  { value: 'manual', label: 'Manual' },
]

export const BACKGROUND_ANCHORS: ReadonlyArray<{ value: BackgroundAnchor, label: string }> = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-center', label: 'Top center' },
  { value: 'top-right', label: 'Top right' },
  { value: 'center-left', label: 'Center left' },
  { value: 'center', label: 'Center' },
  { value: 'center-right', label: 'Center right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-center', label: 'Bottom center' },
  { value: 'bottom-right', label: 'Bottom right' },
]

export const createDisplayBackground = (media: MediaSelectorValue): DisplayBackground => ({
  media,
  mode: 'contain',
  anchor: 'center',
  scale: 100,
})

const mediaTitle = (media: MediaSelectorValue): string => {
  if (media.metadata?.title) return media.metadata.title
  if (media.media_content_id.startsWith('media-source://image_upload/')) return 'Home Assistant image'
  const segment = media.media_content_id.split('/').at(-1)
  if (!segment) return 'Background image'
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}

export const backgroundMediaForForm = (media: MediaSelectorValue): MediaSelectorValue => ({
  ...media,
  metadata: {
    ...media.metadata,
    title: mediaTitle(media),
  },
})

export const clampBackgroundScale = (value: number): number => {
  if (!Number.isFinite(value)) return 100
  return Math.max(1, Math.min(400, Math.round(value)))
}
