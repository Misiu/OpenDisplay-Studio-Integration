import { describe, expect, it } from 'vitest'
import { getRuntimeWidgetDefinition, getWidgetDefinition } from './registry'

describe('runtime widget registry', () => {
  it.each(['sensor', 'weather'])('offers independent footer controls for %s', (id) => {
    const widget = getWidgetDefinition(id)

    expect(widget?.defaults.showEntityId).toBe(true)
    expect(widget?.defaults.showFooter).toBe(true)
    expect(widget?.options.find((option) => option.key === 'showEntityId')?.selector).toEqual({ boolean: {} })
    expect(widget?.options.find((option) => option.key === 'showFooter')?.selector).toEqual({ boolean: {} })
    expect(widget?.options.find((option) => option.key === 'showEntityId')?.label).toBe('Show entity ID')
    expect(widget?.options.find((option) => option.key === 'showFooter')?.label).toBe('Show footer')
  })

  it('creates a selectable definition for a backend-only widget package', () => {
    const widget = getRuntimeWidgetDefinition({
      id: 'air-quality',
      version: '0.5.0',
      name: 'Air Quality',
      description: 'Current air quality from a selected entity.',
      icon: 'mdi:air-filter',
      defaults: { entity: '', showIndex: true },
      fields: [
        {
          key: 'entity',
          label: 'Entity',
          selector: { entity: { filter: { domain: 'sensor' } } },
        },
      ],
      dataRequirements: [
        {
          key: 'entity',
          provider: 'sensor',
          configKey: 'entity',
          cardinality: 'one',
          optional: false,
        },
      ],
    })

    expect(widget.id).toBe('air-quality')
    expect(widget.version).toBe('0.5.0')
    expect(widget.defaults).toEqual({ entity: '', showIndex: true })
    expect(widget.options[0].selector).toEqual({
      entity: { filter: { domain: 'sensor' } },
    })
  })

  it('uses backend package metadata with a built-in visual fallback', () => {
    const widget = getRuntimeWidgetDefinition({
      id: 'weather',
      version: '0.5.1',
      name: 'Weather package',
      description: 'Updated without rebuilding the panel.',
      icon: 'mdi:weather-partly-cloudy',
      defaults: { weather: 'weather.home' },
      fields: [],
      dataRequirements: [],
    })

    expect(widget.version).toBe('0.5.1')
    expect(widget.name).toBe('Weather package')
    expect(widget.defaults).toEqual({ weather: 'weather.home' })
  })

  it.each(['section-title', 'hero-weather'])('registers the %s dashboard widget', (id) => {
    const widget = getWidgetDefinition(id)

    expect(widget).toBeDefined()
    expect(widget?.options.some((option) => option.selector && 'opendisplay_color' in option.selector)).toBe(true)
  })
})
