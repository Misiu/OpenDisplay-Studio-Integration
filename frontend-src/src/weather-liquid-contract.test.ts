import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { Liquid } from 'liquidjs'

const templateUrl = new URL(
  '../../custom_components/opendisplay_studio/widgets/weather/widget.liquid',
  import.meta.url,
)
const engine = new Liquid({
  dynamicPartials: true,
  strictFilters: true,
  strictVariables: true,
})

const englishLabels = {
  weather: 'Weather',
  temperature: 'Temperature',
  apparent_temperature: 'Apparent temperature',
  humidity: 'Humidity',
  right_now: 'Right now',
  low: 'Low',
  high: 'High',
  low_high: 'L/H',
  today: 'Today',
  tomorrow: 'Tomorrow',
  precipitation: 'Precipitation',
  details: 'Details',
  uv: 'UV',
  uv_low: 'Low',
  uv_moderate: 'Moderate',
  uv_high: 'High',
  uv_very_high: 'Very high',
  uv_extreme: 'Extreme',
  unavailable: 'Unavailable',
  choose_weather_entity: 'Choose a weather entity',
}

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
  labels: englishLabels,
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

  it('renders localized vocabulary supplied by Home Assistant', async () => {
    const html = await render({
      ...current,
      condition_label: 'deszczowo',
      labels: {
        ...englishLabels,
        weather: 'Pogoda',
        temperature: 'Temperatura',
        apparent_temperature: 'Odczuwalna temperatura',
        humidity: 'Wilgotność',
        right_now: 'Teraz',
      },
    })

    expect(html).toContain('deszczowo')
    expect(html).toContain('Temperatura')
    expect(html).toContain('Odczuwalna temperatura')
    expect(html).toContain('Wilgotność')
    expect(html).toContain('Teraz')
  })
})
