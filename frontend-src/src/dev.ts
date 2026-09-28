import './index.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './odx-app'
import { createId } from './ids'
import type { HomeAssistant, ScreenProject } from './types'

if (!customElements.get('ha-icon')) customElements.define('ha-icon', class extends HTMLElement {
  connectedCallback(): void { this.textContent = ({ 'mdi:thermometer': '♨', 'mdi:format-text': 'T', 'mdi:rectangle-outline': '□', 'mdi:vector-line': '╱', 'mdi:circle-outline': '○', 'mdi:ellipse-outline': '⬭', 'mdi:star-outline': '☆', 'mdi:qrcode': '▦', 'mdi:progress-helper': '◒', 'mdi:magnify': '⌕', 'mdi:plus': '+', 'mdi:plus-circle': '⊕', 'mdi:delete-outline': '×', 'mdi:monitor-edit': '▣', 'mdi:monitor': '▣', 'mdi:chevron-left': '‹', 'mdi:chevron-right': '›', 'mdi:content-copy': '⧉', 'mdi:check': '✓', 'mdi:alert-circle-outline': '!', 'mdi:close': '×', 'mdi:magnet': '∩', 'mdi:lock': '●', 'mdi:lock-open-variant-outline': '○', 'mdi:eye-outline': '◉', 'mdi:eye-off-outline': '⊘', 'mdi:drag-vertical': '⋮', 'mdi:undo': '↶', 'mdi:redo': '↷' } as Record<string, string>)[this.getAttribute('icon') ?? ''] ?? '•' }
  set icon(value: string) { this.setAttribute('icon', value); this.connectedCallback() }
})

if (!customElements.get('ha-button')) customElements.define('ha-button', class extends HTMLElement {
  connectedCallback(): void { this.style.cssText = 'display:inline-flex;align-items:center;min-height:38px;padding:0 14px;border:1px solid #8a949b;border-radius:20px;background:#fff;cursor:pointer;font:500 14px Roboto,sans-serif' }
  set disabled(value: boolean) { this.toggleAttribute('disabled', value); this.style.opacity = value ? '.5' : '1' }
})

if (!customElements.get('ha-alert')) customElements.define('ha-alert', class extends HTMLElement {
  connectedCallback(): void { this.style.cssText = 'display:block;margin:8px;padding:10px;border-radius:8px;background:#fff3cd;color:#5d4800' }
})

if (!customElements.get('ha-form')) customElements.define('ha-form', class DemoForm extends HTMLElement {
  private formData: Record<string, unknown> = {}
  private formSchema: Array<{ name: string; label: string; selector: Record<string, unknown> }> = []
  set hass(_value: unknown) {}
  set computeLabel(_value: unknown) {}
  set data(value: Record<string, unknown>) { this.formData = value; this.draw() }
  set schema(value: Array<{ name: string; label: string; selector: Record<string, unknown> }>) { this.formSchema = value; this.draw() }
  connectedCallback(): void { this.draw() }
  private draw(): void {
    if (!this.isConnected || !this.formSchema.length) return
    const fragment = document.createDocumentFragment()
    for (const field of this.formSchema) {
      const label = document.createElement('label')
      label.style.cssText = 'display:grid;gap:5px;margin:0 0 12px;font:500 12px Roboto,sans-serif'
      label.append(field.label)
      const input = document.createElement('input')
      input.style.cssText = 'height:38px;padding:0 9px;border:1px solid #aab2b8;border-radius:8px'
      const isBoolean = 'boolean' in field.selector
      input.type = isBoolean ? 'checkbox' : ('number' in field.selector ? 'number' : 'text')
      if (isBoolean) input.checked = Boolean(this.formData[field.name])
      else input.value = String(this.formData[field.name] ?? '')
      input.addEventListener('change', () => {
        const value = isBoolean ? input.checked : input.type === 'number' ? Number(input.value) : input.value
        this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: { value: { ...this.formData, [field.name]: value } } }))
      })
      label.append(input); fragment.append(label)
    }
    this.replaceChildren(fragment)
  }
})

const now = '2026-09-24T12:00:00+00:00'
const demoProject: ScreenProject = {
  id: 'demo', schemaVersion: 3, name: 'Kitchen display', status: 'draft', language: 'en',
  display: { profileId: 'solum-7-5', width: 800, height: 480, palette: 'bwr', background: 'white', padding: 20, snapSize: 5 },
  items: [{
    id: 'temperature', kind: 'widget', locked: false, hidden: false,
    widget: { type: 'temperature', version: '1.0.0', config: { entity: 'sensor.kitchen_temperature', title: 'Kitchen', showIcon: true, showName: true, showUnit: true, accent: 'black' } },
    frame: { x: 40, y: 40, width: 320, height: 180 },
    layout: { padding: 0 },
  }], createdAt: now, updatedAt: now,
}

const preview = (project: ScreenProject): string => {
  const { width, height } = project.display
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${project.display.background}"/><rect x="8" y="8" width="388" height="149" rx="3" fill="white" stroke="black"/><circle cx="42" cy="94" r="10" fill="black"/><rect x="38" y="45" width="8" height="50" rx="4" fill="black"/><text x="225" y="52" text-anchor="middle" font-family="Roboto" font-size="22">${project.items.length ? 'Kitchen' : ''}</text><text x="225" y="116" text-anchor="middle" font-family="Roboto" font-size="58">21.4 °C</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const itemBounds = (project: ScreenProject): Record<string, { x: number; y: number; width: number; height: number }> => {
  const result: Record<string, { x: number; y: number; width: number; height: number }> = {}
  for (const item of project.items) {
    if (item.kind === 'widget') {
      result[item.id] = { ...item.frame }
    } else {
      const primitive = item.primitive
      if ('x_start' in primitive) result[item.id] = { x: Math.min(primitive.x_start, primitive.x_end), y: Math.min(primitive.y_start, primitive.y_end), width: Math.abs(primitive.x_end - primitive.x_start) + 1, height: Math.abs(primitive.y_end - primitive.y_start) + 1 }
      else if (primitive.type === 'circle') result[item.id] = { x: primitive.x - primitive.radius, y: primitive.y - primitive.radius, width: primitive.radius * 2 + 1, height: primitive.radius * 2 + 1 }
      else if (primitive.type === 'qrcode') { const size = (21 + primitive.border * 2) * primitive.boxsize; result[item.id] = { x: primitive.x, y: primitive.y, width: size, height: size } }
      else if (primitive.type === 'icon') result[item.id] = { x: primitive.x, y: primitive.y, width: primitive.size, height: primitive.size }
      else result[item.id] = { x: primitive.x, y: primitive.y, width: Math.max(primitive.size, primitive.value.length * primitive.size * .62), height: primitive.size * 1.25 }
    }
  }
  return result
}

let projects = [structuredClone(demoProject)]
const calls: Array<Record<string, unknown>> = []
const hass: HomeAssistant = {
  language: 'en',
  states: { 'sensor.kitchen_temperature': { state: '21.4', attributes: { friendly_name: 'Kitchen temperature', unit_of_measurement: '°C' } } },
  async callWS<T>(message: Record<string, unknown>): Promise<T> {
    calls.push(structuredClone(message))
    if (message.type === 'opendisplay_studio/bootstrap') {
      await new Promise(resolve => window.setTimeout(resolve, 60))
      return {
      version: '3.0.6',
      projects,
      widgets: [{
        id: 'temperature', version: '1.0.0', name: 'Temperature', description: 'Current value of a Home Assistant temperature entity.', icon: 'mdi:thermometer',
        defaults: { entity: '', title: '', showIcon: true, showName: true, showUnit: true, accent: 'black' },
        fields: [{ key: 'entity', label: 'Temperature entity', selector: { entity: {} } }, { key: 'title', label: 'Title', selector: { text: {} } }],
        layout: { defaultSize: { width: 280, height: 160 }, minSize: { width: 120, height: 80 } }, dataRequirements: [],
      }],
      primitives: [
        { id: 'text', name: 'Text', description: 'Pixel-positioned text', icon: 'mdi:format-text' },
        { id: 'rectangle', name: 'Rectangle', description: 'Filled or outlined rectangle', icon: 'mdi:rectangle-outline' },
        { id: 'line', name: 'Line', description: 'Solid or dashed line between two points', icon: 'mdi:vector-line' },
        { id: 'circle', name: 'Circle', description: 'Filled or outlined circle', icon: 'mdi:circle-outline' },
        { id: 'ellipse', name: 'Ellipse', description: 'Filled or outlined ellipse', icon: 'mdi:ellipse-outline' },
        { id: 'icon', name: 'Icon', description: 'Material Design icon from the bundled ODL font', icon: 'mdi:star-outline' },
        { id: 'qrcode', name: 'QR code', description: 'Locally generated QR code', icon: 'mdi:qrcode' },
        { id: 'progress_bar', name: 'Progress bar', description: 'Directional progress indicator', icon: 'mdi:progress-helper' },
      ],
      } as T
    }
    if (message.type === 'opendisplay_studio/compose_preview') {
      const project = message.project as ScreenProject
      const yaml = project.items.map(item => item.kind === 'primitive' ? `- type: ${item.primitive.type}` : '- type: rectangle\n- type: icon\n- type: text').join('\n')
      return { imageUrl: preview(project), yaml, itemBounds: itemBounds(project), warnings: [], timings: { queue: .1, data: .2, compile: .3, render: 7.4, encode: 1.2, pipeline: 9.2 } } as T
    }
    if (message.type === 'opendisplay_studio/create_project') {
      const project = { ...(message.project as ScreenProject), id: createId(), createdAt: now, updatedAt: now }
      projects = [...projects, project]; return { project } as T
    }
    if (message.type === 'opendisplay_studio/update_project') {
      const project = structuredClone(message.project as ScreenProject)
      projects = projects.map(item => item.id === project.id ? project : item); return { project } as T
    }
    if (message.type === 'opendisplay_studio/delete_project') {
      projects = projects.filter(item => item.id !== message.project_id); return {} as T
    }
    throw new Error(`Unsupported command ${String(message.type)}`)
  },
}

const panel = document.querySelector('opendisplay-studio-panel') as HTMLElement & { hass: HomeAssistant }

const cloneData = <T>(value: T): T => structuredClone(value)
let hassRevision = 0
const assignFreshHass = (): void => {
  hassRevision += 1
  panel.hass = { ...hass, states: cloneData(hass.states), language: hass.language }
}

declare global {
  interface Window {
    __ODX_E2E__: {
      calls: () => Array<Record<string, unknown>>
      projects: () => ScreenProject[]
      replaceHass: () => void
      hassRevision: () => number
    }
  }
}
window.__ODX_E2E__ = {
  calls: () => cloneData(calls),
  projects: () => cloneData(projects),
  replaceHass: assignFreshHass,
  hassRevision: () => hassRevision,
}

// Home Assistant assigns `hass` after the custom panel has connected and then
// replaces the object on every state update. Reproduce that lifecycle here.
window.setTimeout(assignFreshHass, 10)
window.setTimeout(assignFreshHass, 25)
