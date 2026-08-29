import { css, html } from 'lit'
import { mdiWeatherPartlyCloudy } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configText } from '../shared'

export const heroWeatherWidget: WidgetDefinition = {
  id: 'hero-weather',
  version: '0.1.0',
  name: 'Hero Weather',
  description: 'Large current temperature, condition, and today’s minimum and maximum.',
  icon: mdiWeatherPartlyCloudy,
  defaults: {
    weather: '',
    primaryColor: '#000000',
    accentColor: '#d22626',
  },
  options: [
    {
      key: 'weather',
      label: 'Weather entity',
      required: true,
      selector: { entity: { filter: { domain: 'weather' } } },
    },
    { key: 'primaryColor', label: 'Primary color', selector: { opendisplay_color: {} } },
    { key: 'accentColor', label: 'Accent color', selector: { opendisplay_color: {} } },
  ],
  styles: css`
    .hero-weather-widget {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 6%;
      padding: 6%;
      box-sizing: border-box;
      color: var(--hero-primary);
      text-align: center;
    }

    .hero-weather-current {
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-weather-current strong {
      font-size: clamp(44px, 48cqh, 170px);
      line-height: 0.82;
      letter-spacing: -0.055em;
    }

    .hero-weather-current span {
      margin-top: 4%;
      font-size: clamp(12px, 11cqh, 34px);
      font-weight: 800;
      text-transform: uppercase;
    }

    .hero-weather-range {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      font-size: clamp(14px, 14cqh, 40px);
      font-weight: 800;
      white-space: nowrap;
    }

    .hero-weather-range .high { color: var(--hero-accent); }
  `,
  render: (config) => html`
    <div
      class="widget hero-weather-widget"
      style=${`--hero-primary:${configText(config, 'primaryColor')};--hero-accent:${configText(config, 'accentColor')}`}
    >
      <div class="hero-weather-current"><strong>23°</strong><span>Partly cloudy</span></div>
      <div class="hero-weather-range"><span class="high">↑ 27°</span><span>↓ 16°</span></div>
    </div>
  `,
}
