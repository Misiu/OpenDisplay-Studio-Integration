import { html } from 'lit'
import { mdiGauge } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configText, renderIcon } from '../shared'
import { sensorStyles } from './styles'

export const sensorWidget: WidgetDefinition = {
  id: 'sensor',
  version: '0.6.1',
  name: 'Sensor',
  description: 'Current value of a selected Home Assistant sensor.',
  icon: mdiGauge,
  styles: sensorStyles,
  defaults: {
    entity: '',
    showEntityId: true,
    showFooter: true,
  },
  options: [
    {
      key: 'entity',
      label: 'Sensor entity',
      required: true,
      selector: { entity: { filter: { domain: 'sensor' } } },
    },
    { key: 'showEntityId', label: 'Show entity ID', selector: { boolean: {} } },
    { key: 'showFooter', label: 'Show footer', selector: { boolean: {} } },
  ],
  render: (config) => html`
    <div class="widget sensor-widget">
      <span class="sensor-name">${configText(config, 'entity') || 'Choose a sensor'}</span>
      <div class="sensor-reading">
        ${renderIcon(mdiGauge, 'Sensor')}
        <strong>Live data</strong>
      </div>
    </div>
  `,
}
