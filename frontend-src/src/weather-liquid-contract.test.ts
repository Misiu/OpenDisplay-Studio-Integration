import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { Liquid } from 'liquidjs'

const templateUrl = new URL(
  '../../custom_components/opendisplay_studio/widget_templates/weather.liquid',
  import.meta.url,
)
const engine = new Liquid({
  dynamicPartials: true,
  strictFilters: true,
  strictVariables: true,
})

const current = {
  entity_id: 'weather.home',
  name: 'Home',
  condition: 'rainy',
  condition_label: 'Rain',
  icon: 'https://trmnl.com/images/plugins/weather/wi-rain.svg',
  temperature: 12,
  temperature_unit: '°C',
  apparent_temperature: 9,
  humidity: 88,
  updated_at: '18:02',
}

const render = async (
  weather: Record<string, unknown>,
  showForecast = true,
): Promise<string> => {
  const template = await readFile(templateUrl, 'utf8')
  return engine.parseAndRender(template, {
    config: {
      showHumidity: true,
      showFeelsLike: true,
      showForecast,
    },
    data: { weather },
    region: { shape: 'square' },
  })
}

describe('Weather LiquidJS contract', () => {
  it('renders current conditions when forecast is absent', async () => {
    const html = await render(current)

    expect(html).toContain('12°')
    expect(html).toContain('Rain')
    expect(html).toContain('18:02')
  })

  it('renders with an empty forecast or forecast disabled', async () => {
    await expect(render({ ...current, forecast: [] })).resolves.toContain('12°')
    await expect(render(current, false)).resolves.toContain('12°')
  })
})
