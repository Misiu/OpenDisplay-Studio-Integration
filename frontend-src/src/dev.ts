import './index.css'
import './odx-app'
import type { HomeAssistant, ScreenProject } from './types'

if (!customElements.get('ha-form')) {
  customElements.define('ha-form', class extends HTMLElement {
    connectedCallback(): void {
      this.innerHTML = '<label style="display:grid;gap:6px;font:500 12px system-ui">Home Assistant selector<input style="min-height:40px;border:1px solid #c5cdd2;border-radius:8px;padding:0 10px" value="sensor.kitchen_temperature" /></label>'
    }
  })
}

const now = new Date().toISOString()
let projects: ScreenProject[] = [
  {
    id: '4a34c31e',
    schemaVersion: 1,
    name: 'Kitchen dashboard',
    status: 'ready',
    displayId: 'opendisplay-e1001',
    width: 800,
    height: 480,
    orientation: 'landscape',
    palette: 'bw',
    grid: { columns: 3, rows: 2 },
    regions: [
      {
        id: 'temperature',
        label: 'A',
        row: 1,
        column: 1,
        rowSpan: 1,
        columnSpan: 1,
        widget: {
          type: 'entity-state',
          version: 1,
          config: { entity: 'sensor.kitchen_temperature', title: 'Kitchen', layout: 'large', showUnit: true },
        },
      },
      {
        id: 'calendar',
        label: 'B',
        row: 1,
        column: 2,
        rowSpan: 1,
        columnSpan: 2,
        widget: {
          type: 'calendar',
          version: 1,
          config: { calendar: 'calendar.family', title: 'Upcoming', days: 7, showLocation: true },
        },
      },
      {
        id: 'note',
        label: 'C',
        row: 2,
        column: 1,
        rowSpan: 1,
        columnSpan: 3,
        widget: {
          type: 'text',
          version: 1,
          config: { title: 'HOME', text: 'OpenDisplay Studio', align: 'center' },
        },
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
]

const hass: HomeAssistant = {
  async callWS<T>(message: Record<string, unknown>): Promise<T> {
    if (message.type === 'opendisplay_studio/bootstrap') {
      return { projects, widgets: [] } as T
    }
    if (message.type === 'opendisplay_studio/create_project') {
      const project = { ...(message.project as ScreenProject), id: crypto.randomUUID() }
      projects = [...projects, project]
      return { project } as T
    }
    if (message.type === 'opendisplay_studio/update_project') {
      const project = structuredClone(message.project as ScreenProject)
      projects = projects.map((item) => item.id === project.id ? project : item)
      return { project } as T
    }
    if (message.type === 'opendisplay_studio/delete_project') {
      projects = projects.filter((item) => item.id !== message.project_id)
      return {} as T
    }
    throw new Error(`Unsupported command: ${String(message.type)}`)
  },
}

const panel = document.querySelector('opendisplay-studio-panel') as HTMLElement & { hass: HomeAssistant }
panel.hass = hass
