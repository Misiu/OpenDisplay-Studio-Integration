import { describe, expect, it } from 'vitest'
import {
  backgroundMediaForForm,
  clampBackgroundScale,
  createDisplayBackground,
} from './background'

describe('display background contract', () => {
  it('creates a centered fit background from a Home Assistant media value', () => {
    const media = {
      media_content_id: 'media-source://media_source/local/backgrounds/mountains.png',
      media_content_type: 'image/png',
    }

    expect(createDisplayBackground(media)).toEqual({
      media,
      mode: 'contain',
      anchor: 'center',
      scale: 100,
    })
  })

  it.each([
    [0, 1],
    [50, 50],
    [400, 400],
    [401, 400],
    [50.6, 51],
    [Number.NaN, 100],
  ])('clamps manual scale %s to %s', (value, expected) => {
    expect(clampBackgroundScale(value)).toBe(expected)
  })

  it('uses a short stable title instead of exposing an uploaded image URI', () => {
    expect(backgroundMediaForForm({
      media_content_id: 'media-source://image_upload/6409a8cc-aaaa-bbbb-cccc-1234567890ab',
      media_content_type: 'image/png',
    }).metadata?.title).toBe('Home Assistant image')
  })

  it('preserves the title returned by the Home Assistant media browser', () => {
    expect(backgroundMediaForForm({
      media_content_id: 'media-source://media_source/local/backgrounds/mountains.png',
      media_content_type: 'image/png',
      metadata: { title: 'Misty mountains' },
    }).metadata?.title).toBe('Misty mountains')
  })
})
