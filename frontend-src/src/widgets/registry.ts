import { calendarWidget } from './calendar/widget'
import { entityValueWidget } from './entity-value/widget'
import { textNoteWidget } from './text-note/widget'

export const WIDGETS = [
  calendarWidget,
  entityValueWidget,
  textNoteWidget,
]

export const getWidgetDefinition = (id: string) =>
  WIDGETS.find((widget) => widget.id === id)

export const widgetStyles = WIDGETS.map((widget) => widget.styles)
