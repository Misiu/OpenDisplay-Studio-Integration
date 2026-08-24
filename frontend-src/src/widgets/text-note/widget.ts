import { html } from 'lit'
import { mdiFormatText } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configText } from '../shared'
import { textNoteStyles } from './styles'

export const textNoteWidget: WidgetDefinition = {
  id: 'text',
  version: 1,
  name: 'Text',
  description: 'A simple message or heading.',
  icon: mdiFormatText,
  styles: textNoteStyles,
  defaults: {
    title: '',
    text: 'Text',
    align: 'left',
  },
  options: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'text', label: 'Content', type: 'text' },
    {
      key: 'align',
      label: 'Alignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
  render: (config) => html`
    <div class="widget note-widget align-${configText(config, 'align')}">
      <span class="note-eyebrow">${configText(config, 'title')}</span>
      <strong>${configText(config, 'text')}</strong>
    </div>
  `,
}
