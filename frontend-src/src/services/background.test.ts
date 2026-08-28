import { describe, expect, it } from 'vitest'
import { clampBackgroundScale, createDisplayBackground } from './background'

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
})
