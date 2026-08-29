import { css, html } from 'lit'
import { mdiCalendarToday } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configText } from '../shared'

export const sectionTitleWidget: WidgetDefinition = {
  id: 'section-title',
  version: '0.1.0',
  name: 'Section Title',
  description: 'Localized weekday and date heading for a dashboard section.',
  icon: mdiCalendarToday,
  defaults: {
    source: 'current',
    weekdayColor: '#000000',
    dateColor: '#d22626',
  },
  options: [
    { key: 'weekdayColor', label: 'Weekday color', selector: { opendisplay_color: {} } },
    { key: 'dateColor', label: 'Date color', selector: { opendisplay_color: {} } },
  ],
  styles: css`
    .section-title-widget {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding: 8%;
      box-sizing: border-box;
      text-transform: uppercase;
    }

    .section-title-widget strong {
      color: var(--section-weekday);
      font-size: clamp(14px, 30cqh, 56px);
      line-height: 0.95;
    }

    .section-title-widget span {
      color: var(--section-date);
      font-size: clamp(11px, 21cqh, 36px);
      font-weight: 800;
      line-height: 1;
    }
  `,
  render: (config) => html`
    <div
      class="widget section-title-widget"
      style=${`--section-weekday:${configText(config, 'weekdayColor')};--section-date:${configText(config, 'dateColor')}`}
    >
      <strong>Monday</strong>
      <span>25 Aug 2025</span>
    </div>
  `,
}
