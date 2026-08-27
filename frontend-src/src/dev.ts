import './index.css'
import './odx-app'
import type { HomeAssistant, ScreenProject } from './types'
import { createId } from './services/layout'

if (!customElements.get('ha-form')) {
  customElements.define('ha-form', class extends HTMLElement {
    connectedCallback(): void {
      this.innerHTML = '<label style="display:grid;gap:6px;font:500 12px system-ui">Home Assistant selector<input style="min-height:40px;border:1px solid #c5cdd2;border-radius:8px;padding:0 10px" value="sensor.kitchen_temperature" /></label>'
    }
  })
}

const now = new Date().toISOString()
const demoEntityHtml = (project: ScreenProject): string => {
  const gap = Math.max(3, Math.min(10, Math.round(Math.min(project.width, project.height) / 60)))
  const regions = project.regions.map((region) => {
    const entity = String(region.widget?.config.entity ?? '')
    const title = String(region.widget?.config.title ?? '') || 'Kitchen temperature'
    const content = region.widget?.type === 'entity-state'
      ? `<div class="item studio-entity studio-entity--square"><div class="content studio-entity__content"><svg class="studio-entity__icon" viewBox="0 0 24 24"><path d="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"></path></svg><span class="studio-entity__name">${title || entity}</span><span class="studio-entity__reading"><span class="studio-entity__value">21.4</span><span class="studio-entity__unit">°C</span></span></div></div>`
      : ''
    return `<section class="studio-region" style="grid-row:${region.row}/span ${region.rowSpan};grid-column:${region.column}/span ${region.columnSpan}">${content}</section>`
  }).join('')
  return `<main class="screen studio-screen"><style>.studio-screen{width:${project.width}px;height:${project.height}px;background:#fff}.studio-grid{display:grid;width:100%;height:100%;padding:${gap}px;gap:${gap}px;box-sizing:border-box}.studio-region{min-width:0;min-height:0;border:1px solid #111;container-type:size;overflow:hidden}.studio-entity,.studio-entity__content{width:100%;height:100%;box-sizing:border-box}.studio-entity__content{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:14px}.studio-entity__icon{width:52px;height:52px}.studio-entity__name{font-size:17px;font-weight:700}.studio-entity__reading{display:flex;align-items:baseline;gap:5px}.studio-entity__value{font-size:68px;line-height:.9}.studio-entity__unit{font-size:18px;font-weight:700}</style><div class="studio-grid" style="grid-template-columns:repeat(${project.grid.columns},minmax(0,1fr));grid-template-rows:repeat(${project.grid.rows},minmax(0,1fr))">${regions}</div></main>`
}

const demoPreviewImage = (project: ScreenProject): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${project.width}" height="${project.height}" viewBox="0 0 ${project.width} ${project.height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${demoEntityHtml(project)}</div></foreignObject></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

let projects: ScreenProject[] = [
  {
    id: '4a34c31e',
    schemaVersion: 1,
    name: 'Kitchen dashboard',
    status: 'ready',
    language: 'en',
    theme: 'light',
    fontFamily: 'default',
    textScale: 'regular',
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
          version: '0.5.0',
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
          version: '0.5.0',
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
          version: '0.5.0',
          config: { title: 'HOME', text: 'OpenDisplay Studio', align: 'center' },
        },
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
]

const hass: HomeAssistant = {
  language: 'en',
  async callWS<T>(message: Record<string, unknown>): Promise<T> {
    if (message.type === 'opendisplay_studio/bootstrap') {
      return { projects, widgets: [] } as T
    }
    if (message.type === 'opendisplay_studio/compose_preview') {
      return {
        imageUrl: demoPreviewImage(message.project as ScreenProject),
        timings: { data: 0.4, liquid: 0.7, compose: 1.6, renderer: 4.2, pipeline: 5.8 },
      } as T
    }
    if (message.type === 'opendisplay_studio/create_project') {
      const project = { ...(message.project as ScreenProject), id: createId() }
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
