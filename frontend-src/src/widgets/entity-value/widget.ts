import { html } from 'lit'
import { mdiHomeThermometerOutline, mdiThermometer } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configText, renderIcon } from '../shared'
import { entityValueStyles } from './styles'

export const entityValueWidget: WidgetDefinition = {
  id: 'entity-state',
  version: 1,
  name: 'Entity State',
  description: 'A prominent value from a single entity.',
  icon: mdiHomeThermometerOutline,
  styles: entityValueStyles,
  defaults: {
    entity: '',
    title: '',
    layout: 'large',
    showUnit: true,
  },
  options: [
    { key: 'entity', label: 'Entity', type: 'entity' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'layout', label: 'Layout', type: 'select', options: [{ label: 'Large value', value: 'large' }, { label: 'Compact', value: 'compact' }] },
    { key: 'showUnit', label: 'Show unit', type: 'toggle' },
  ],
  render: (config) => html`
    <div class="widget entity-widget">
      ${renderIcon(mdiThermometer, 'Entity state')}
      <span class="entity-label">${configText(config, 'title') || configText(config, 'entity') || 'Choose an entity'}</span>
      <strong class="entity-value">—</strong>
    </div>
  `,
}
