import { css, html } from 'lit'
import type { BootstrapResponse, WidgetDefinition } from '../types'
import { calendarWidget } from './calendar/widget'
import { sensorWidget } from './sensor/widget'
import { textNoteWidget } from './text-note/widget'
import { weatherWidget } from './weather/widget'
import { heroWeatherWidget } from './hero-weather/widget'
import { sectionTitleWidget } from './section-title/widget'

export const WIDGETS = [
  calendarWidget,
  heroWeatherWidget,
  sectionTitleWidget,
  sensorWidget,
  textNoteWidget,
  weatherWidget,
]

export const getWidgetDefinition = (id: string) =>
  WIDGETS.find((widget) => widget.id === id)

export const getRuntimeWidgetDefinition = (
  backend: BootstrapResponse['widgets'][number],
): WidgetDefinition => {
  const local = getWidgetDefinition(backend.id)
  if (!local) return {
    id: backend.id,
    version: backend.version,
    name: backend.name,
    description: backend.description,
    icon: backend.icon,
    defaults: backend.defaults,
    options: backend.fields,
    styles: css``,
    render: () => html`
      <div class="empty-region-copy">
        <ha-icon .icon=${backend.icon}></ha-icon>
        <strong>${backend.name}</strong>
        <span>Loading exact preview…</span>
      </div>
    `,
  }
  return {
    ...local,
    version: backend.version,
    name: backend.name,
    description: backend.description,
    defaults: backend.defaults,
    options: backend.fields,
  }
}

export const widgetStyles = WIDGETS.map((widget) => widget.styles)
