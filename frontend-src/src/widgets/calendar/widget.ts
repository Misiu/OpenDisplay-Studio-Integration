import { html } from 'lit'
import { mdiCalendarMonthOutline } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configNumber, configText, renderIcon } from '../shared'
import { calendarStyles } from './styles'

export const calendarWidget: WidgetDefinition = {
  id: 'calendar',
  version: '0.5.0',
  name: 'Calendar',
  description: 'An agenda from one or more calendar entities.',
  icon: mdiCalendarMonthOutline,
  styles: calendarStyles,
  defaults: {
    calendar: '',
    title: 'Upcoming events',
    days: 5,
    showLocation: true,
    showDescription: false,
    time24h: true,
  },
  options: [
    { key: 'calendar', label: 'Calendar', type: 'calendar' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'days', label: 'Day range', type: 'number', min: 1, max: 31, step: 1 },
    { key: 'showLocation', label: 'Show location', type: 'toggle' },
    { key: 'showDescription', label: 'Show description', type: 'toggle' },
    { key: 'time24h', label: '24-hour time', type: 'toggle' },
  ],
  render: (config, context) => {
    const count = context.compact ? 2 : 4
    const events = [
      ['TODAY', '09:30', 'Team stand-up'],
      ['TODAY', '14:00', 'Project review'],
      ['THU', '18:15', 'Training'],
      ['FRI', '08:00', 'Dentist'],
      ['SAT', '12:30', 'Family lunch'],
    ].slice(0, count)
    return html`
      <div class="widget calendar-widget ${context.compact ? 'compact' : ''}">
        <div class="widget-heading">
          <span>${renderIcon(mdiCalendarMonthOutline)}</span>
          <strong>${configText(config, 'title')}</strong>
          <span class="widget-kicker">${configNumber(config, 'days')} days</span>
        </div>
        <div class="event-list">
          ${events.map(
            ([day, time, title]) => html`
              <div class="event-row">
                <span class="event-day">${day}</span>
                <span class="event-time">${time}</span>
                <strong>${title}</strong>
              </div>
            `,
          )}
        </div>
      </div>
    `
  },
}
