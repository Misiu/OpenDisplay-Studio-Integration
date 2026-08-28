import './index.css'
import './odx-app'
import type { HomeAssistant, ScreenProject } from './types'
import { createId } from './services/layout'

if (!customElements.get('ha-form')) {
  customElements.define('ha-form', class DemoHaForm extends HTMLElement {
    private formData: Record<string, unknown> = {}
    private formSchema: Array<{ name: string, label?: string, selector?: Record<string, unknown> }> = []
    private labelResolver?: (schema: { name: string, label?: string }) => string

    set data(value: Record<string, unknown>) {
      this.formData = value
      this.renderForm()
    }

    set schema(value: Array<{ name: string, label?: string, selector?: Record<string, unknown> }>) {
      this.formSchema = value
      this.renderForm()
    }

    set computeLabel(value: (schema: { name: string, label?: string }) => string) {
      this.labelResolver = value
      this.renderForm()
    }

    connectedCallback(): void {
      this.renderForm()
    }

    private renderForm(): void {
      if (!this.isConnected || this.formSchema.length === 0) return
      const field = this.formSchema[0]
      const label = document.createElement('label')
      const labelText = document.createElement('span')
      const input = document.createElement('input')
      const isBoolean = Boolean(field.selector && 'boolean' in field.selector)
      const isMedia = Boolean(field.selector && 'media' in field.selector)
      const currentValue = this.formData[field.name]

      label.style.cssText = 'display:grid;gap:6px;font:500 12px system-ui'
      labelText.textContent = this.labelResolver?.(field) ?? field.label ?? field.name
      input.style.cssText = 'min-height:40px;border:1px solid #c5cdd2;border-radius:8px;padding:0 10px'
      input.type = isBoolean ? 'checkbox' : 'text'
      if (isBoolean) input.checked = Boolean(currentValue)
      else if (isMedia && currentValue && typeof currentValue === 'object') {
        input.value = String((currentValue as Record<string, unknown>).media_content_id ?? '')
      } else input.value = String(currentValue ?? '')
      input.addEventListener(isMedia ? 'input' : 'change', () => {
        const value = isBoolean
          ? input.checked
          : isMedia && input.value
            ? { media_content_id: input.value, media_content_type: 'image/png' }
            : input.value
        this.dispatchEvent(new CustomEvent('value-changed', {
          bubbles: true,
          composed: true,
          detail: { value: { ...this.formData, [field.name]: value } },
        }))
      })
      label.append(labelText, input)
      this.replaceChildren(label)
    }
  })
}

const now = new Date().toISOString()
const demoEntityHtml = (project: ScreenProject): string => {
  const gap = Math.max(3, Math.min(10, Math.round(Math.min(project.width, project.height) / 60)))
  const background = project.background
    ? '<div class="demo-background" aria-hidden="true"></div>'
    : ''
  const regions = project.regions.map((region) => {
    const entity = String(region.widget?.config.entity ?? '')
    const content = region.widget?.type === 'sensor'
      ? `<div class="item demo-sensor"><strong>Kitchen temperature</strong><div class="demo-sensor__reading"><span>♨</span><span class="demo-sensor__value">21.4</span><span>°C</span></div><footer><span>${entity}</span><time>08:15</time></footer></div>`
      : ''
    return `<section class="studio-region" style="grid-row:${region.row}/span ${region.rowSpan};grid-column:${region.column}/span ${region.columnSpan}">${content}</section>`
  }).join('')
  return `<main class="screen studio-screen"><style>.studio-screen{position:relative;width:${project.width}px;height:${project.height}px;background:#fff;overflow:hidden}.demo-background{position:absolute;inset:0;background:linear-gradient(155deg,transparent 0 40%,#aeb8ae 40% 42%,transparent 42%),linear-gradient(25deg,#dfe8df 0 35%,#77917c 35% 60%,#304b38 60% 100%)}.studio-grid{position:relative;display:grid;width:100%;height:100%;padding:${gap}px;gap:${gap}px;box-sizing:border-box}.studio-region{min-width:0;min-height:0;border:1px solid #111;container-type:size;overflow:hidden}.demo-sensor{display:grid;width:100%;height:100%;grid-template-rows:auto 1fr auto;box-sizing:border-box;padding:12px}.demo-sensor__reading{display:flex;align-items:center;justify-content:center;gap:18px}.demo-sensor__value{font-size:68px}.demo-sensor footer{display:flex;justify-content:space-between;padding:4px 6px;background:#ddd;font-size:11px}</style>${background}<div class="studio-grid" style="grid-template-columns:repeat(${project.grid.columns},minmax(0,1fr));grid-template-rows:repeat(${project.grid.rows},minmax(0,1fr))">${regions}</div></main>`
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
          type: 'sensor',
          version: '0.6.0',
          config: { entity: 'sensor.kitchen_temperature' },
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
