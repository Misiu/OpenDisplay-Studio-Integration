import { html } from 'lit'
import { mdiWeatherPartlyCloudy } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configText, renderIcon } from '../shared'
import { weatherStyles } from './styles'

export const weatherWidget: WidgetDefinition = {
  id: 'weather',
  version: '0.6.1',
  name: 'Weather',
  description: 'Current conditions and a daily Home Assistant forecast.',
  icon: mdiWeatherPartlyCloudy,
  styles: weatherStyles,
  defaults: {
    weather: '',
    showHumidity: true,
    showFeelsLike: true,
    showForecast: true,
    showEntityId: true,
    showFooter: true,
  },
  options: [
    {
      key: 'weather',
      label: 'Weather entity',
      required: true,
      selector: { entity: { filter: { domain: 'weather' } } },
    },
    { key: 'showHumidity', label: 'Show humidity', selector: { boolean: {} } },
    { key: 'showFeelsLike', label: 'Show feels like', selector: { boolean: {} } },
    { key: 'showForecast', label: 'Show forecast', selector: { boolean: {} } },
    { key: 'showEntityId', label: 'Show entity ID', selector: { boolean: {} } },
    { key: 'showFooter', label: 'Show footer', selector: { boolean: {} } },
  ],
  render: (config) => html`
    <div class="widget weather-widget-placeholder">
      ${renderIcon(mdiWeatherPartlyCloudy, 'Weather')}
      <strong>Weather</strong>
      <span>${configText(config, 'weather') || 'Choose a weather entity'}</span>
    </div>
  `,
}
