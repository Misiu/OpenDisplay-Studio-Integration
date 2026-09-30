import './index.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './odx-app'
import { createId } from './ids'
import type { HomeAssistant, Dashboard } from './types'

if (!customElements.get('ha-icon')) customElements.define('ha-icon', class extends HTMLElement {
  connectedCallback(): void { this.setAttribute('aria-hidden', 'true'); this.textContent = ({ 'mdi:thermometer': '♨', 'mdi:format-text': 'T', 'mdi:rectangle-outline': '□', 'mdi:vector-line': '╱', 'mdi:circle-outline': '○', 'mdi:ellipse-outline': '⬭', 'mdi:star-outline': '☆', 'mdi:qrcode': '▦', 'mdi:progress-helper': '◒', 'mdi:magnify': '⌕', 'mdi:plus': '+', 'mdi:plus-circle': '⊕', 'mdi:dots-horizontal': '⋯', 'mdi:pencil-outline': '✎', 'mdi:monitor-cog': '⚙', 'mdi:delete-outline': '×', 'mdi:monitor-edit': '▣', 'mdi:monitor': '▣', 'mdi:devices': '▦', 'mdi:tools': '⚒', 'mdi:code-tags': '</>', 'mdi:chevron-left': '‹', 'mdi:chevron-right': '›', 'mdi:content-copy': '⧉', 'mdi:check': '✓', 'mdi:alert-circle-outline': '!', 'mdi:close': '×', 'mdi:magnet': '∩', 'mdi:lock': '●', 'mdi:lock-open-variant-outline': '○', 'mdi:eye-outline': '◉', 'mdi:eye-off-outline': '⊘', 'mdi:drag-vertical': '⋮', 'mdi:undo': '↶', 'mdi:redo': '↷' } as Record<string, string>)[this.getAttribute('icon') ?? ''] ?? '•' }
  set icon(value: string) { this.setAttribute('icon', value); this.connectedCallback() }
})

if (!customElements.get('ha-button')) customElements.define('ha-button', class extends HTMLElement {
  connectedCallback(): void {
    const disabled = this.hasAttribute('disabled')
    this.setAttribute('role', 'button')
    this.setAttribute('aria-disabled', String(disabled))
    this.setAttribute('tabindex', disabled ? '-1' : '0')
    this.style.cssText = 'display:inline-flex;align-items:center;min-height:38px;padding:0 14px;border:1px solid #8a949b;border-radius:20px;background:#fff;cursor:pointer;font:500 14px Roboto,sans-serif'
    this.style.opacity = disabled ? '.5' : '1'
  }
  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value)
    this.setAttribute('aria-disabled', String(value))
    this.setAttribute('tabindex', value ? '-1' : '0')
    this.style.opacity = value ? '.5' : '1'
  }
})

if (!customElements.get('ha-alert')) customElements.define('ha-alert', class extends HTMLElement {
  connectedCallback(): void { this.style.cssText = 'display:block;margin:8px;padding:10px;border-radius:8px;background:#fff3cd;color:#5d4800' }
})

interface DemoFormSchema {
  name?: string
  label?: string
  type?: string
  title?: string
  expanded?: boolean
  disabled?: boolean
  selector?: Record<string, unknown>
  schema?: DemoFormSchema[]
}

if (!customElements.get('ha-form')) customElements.define('ha-form', class DemoForm extends HTMLElement {
  private formData: Record<string, unknown> = {}
  private formSchema: DemoFormSchema[] = []
  private labelFor?: (entry: DemoFormSchema) => string
  private openSections = new Set<string>()
  set hass(_value: unknown) {}
  set computeLabel(value: ((entry: DemoFormSchema) => string) | undefined) { this.labelFor = value; this.draw() }
  set data(value: Record<string, unknown>) { this.formData = value; this.draw() }
  set schema(value: DemoFormSchema[]) { this.formSchema = value; this.draw() }
  connectedCallback(): void { this.draw() }
  private draw(): void {
    if (!this.isConnected) return
    const fragment = document.createDocumentFragment()
    this.renderFields(this.formSchema, fragment)
    this.replaceChildren(fragment)
  }
  private renderFields(schema: DemoFormSchema[], target: DocumentFragment | HTMLElement): void {
    for (const entry of schema) {
      if (entry.type === 'grid' && entry.schema) {
        const grid = document.createElement('div')
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px'
        this.renderFields(entry.schema, grid)
        target.append(grid)
      } else if (entry.type === 'expandable' && entry.schema) {
        const details = document.createElement('details')
        const key = entry.name ?? entry.title ?? entry.label ?? 'advanced'
        details.open = Boolean(entry.expanded) || this.openSections.has(key)
        details.style.cssText = 'margin:4px 0 10px;border-top:1px solid #d8dde0;padding-top:10px'
        const summary = document.createElement('summary')
        summary.textContent = entry.title ?? entry.label ?? this.labelFor?.(entry) ?? entry.name ?? 'Advanced'
        summary.style.cssText = 'cursor:pointer;font:500 12px Roboto,sans-serif'
        details.append(summary)
        const content = document.createElement('div')
        content.style.cssText = 'padding-top:12px'
        this.renderFields(entry.schema, content)
        details.append(content)
        details.addEventListener('toggle', () => details.open ? this.openSections.add(key) : this.openSections.delete(key))
        target.append(details)
      } else if (entry.name && entry.selector) {
        target.append(this.renderField(entry))
      }
    }
  }
  private renderField(field: DemoFormSchema): HTMLLabelElement {
    const name = field.name!
    const selector = field.selector!
    const fieldLabel = field.label ?? this.labelFor?.(field) ?? name
    const label = document.createElement('label')
    label.style.cssText = 'display:grid;gap:5px;margin:0 0 12px;font:500 12px Roboto,sans-serif'
    label.append(fieldLabel)
    const selectConfig = selector.select as { options?: Array<string | { value: string; label?: string }> } | undefined
    if (selectConfig) {
      const select = document.createElement('select')
      select.style.cssText = 'height:38px;padding:0 9px;border:1px solid #aab2b8;border-radius:8px'
      select.setAttribute('aria-label', fieldLabel)
      select.disabled = Boolean(field.disabled)
      for (const entry of selectConfig.options ?? []) {
        const option = document.createElement('option')
        option.value = typeof entry === 'string' ? entry : entry.value
        option.textContent = typeof entry === 'string' ? entry : (entry.label ?? entry.value)
        select.append(option)
      }
      select.value = String(this.formData[name] ?? '')
      select.addEventListener('change', () => this.updateValue(name, select.value))
      label.append(select)
      return label
    }
    const input = document.createElement('input')
    input.style.cssText = 'height:38px;padding:0 9px;border:1px solid #aab2b8;border-radius:8px'
    input.setAttribute('aria-label', fieldLabel)
    const isBoolean = 'boolean' in selector
    const numberConfig = selector.number as { min?: number; max?: number; step?: number } | undefined
    input.type = isBoolean ? 'checkbox' : (numberConfig ? 'number' : 'text')
    input.disabled = Boolean(field.disabled)
    if (numberConfig) {
      if (numberConfig.min !== undefined) input.min = String(numberConfig.min)
      if (numberConfig.max !== undefined) input.max = String(numberConfig.max)
      if (numberConfig.step !== undefined) input.step = String(numberConfig.step)
    }
    if (isBoolean) input.checked = Boolean(this.formData[name])
    else input.value = String(this.formData[name] ?? '')
    input.addEventListener(isBoolean ? 'change' : 'input', () => this.updateValue(name, isBoolean ? input.checked : input.type === 'number' ? Number(input.value) : input.value))
    label.append(input)
    return label
  }
  private updateValue(name: string, value: unknown): void {
    this.formData = { ...this.formData, [name]: value }
    this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: { value: this.formData } }))
  }
})

if (!customElements.get('ha-dialog')) customElements.define('ha-dialog', class extends HTMLElement {
  static get observedAttributes(): string[] { return ['header-title', 'heading', 'open'] }
  connectedCallback(): void { this.sync() }
  attributeChangedCallback(): void { this.sync() }
  set heading(value: string) { this.setAttribute('heading', value) }
  get heading(): string { return this.getAttribute('heading') ?? '' }
  set open(value: boolean) { this.toggleAttribute('open', value); this.sync() }
  get open(): boolean { return this.hasAttribute('open') }
  private sync(): void {
    this.setAttribute('role', 'dialog')
    this.setAttribute('aria-modal', 'true')
    const label = this.getAttribute('header-title') || this.heading
    if (label) this.setAttribute('aria-label', label)
    this.hidden = !this.open
    this.style.cssText = 'position:fixed;inset:50% auto auto 50%;z-index:1000;display:block;width:min(560px,calc(100vw - 40px));max-height:calc(100vh - 40px);overflow:auto;transform:translate(-50%,-50%);border-radius:14px;background:#fff;box-shadow:0 24px 80px rgba(0,0,0,.35)'
  }
})

if (!customElements.get('ha-dialog-footer')) customElements.define('ha-dialog-footer', class extends HTMLElement {
  connectedCallback(): void { this.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid #d8dde0' }
})

const now = '2026-09-24T12:00:00+00:00'
const demoDashboard: Dashboard = {
  id: 'demo', schemaVersion: 1, name: 'Kitchen display', status: 'draft', language: 'en',
  display: { profileId: 'solum-7-5', width: 800, height: 480, palette: 'bwr', background: 'white', padding: 20, snapSize: 5 },
  items: [{
    id: 'temperature', kind: 'widget', locked: false, hidden: false,
    widget: { type: 'temperature', version: '1.0.0', config: { entity: 'sensor.kitchen_temperature', title: 'Kitchen', showIcon: true, showName: true, showUnit: true, accent: 'black' } },
    frame: { x: 40, y: 40, width: 320, height: 180 },
    layout: { padding: 0 },
  }], createdAt: now, updatedAt: now,
}

const hallwayDashboard: Dashboard = {
  id: 'hallway', schemaVersion: 1, name: 'Hallway overview', status: 'ready', language: 'en',
  display: { profileId: 'custom', width: 1280, height: 800, palette: 'spectra6', background: 'white', padding: 0, snapSize: 5 },
  items: [], createdAt: '2026-09-20T08:00:00+00:00', updatedAt: '2026-09-23T16:30:00+00:00',
}

const officeDashboard: Dashboard = {
  id: 'office', schemaVersion: 1, name: 'Office status', status: 'draft', language: 'en',
  display: { profileId: 'custom', width: 320, height: 240, palette: 'bw', background: 'white', padding: 0, snapSize: 5 },
  items: [], createdAt: '2026-09-18T10:00:00+00:00', updatedAt: '2026-09-22T09:15:00+00:00',
}

const preview = (dashboard: Dashboard): string => {
  const { width, height } = dashboard.display
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${dashboard.display.background}"/><rect x="8" y="8" width="388" height="149" rx="3" fill="white" stroke="black"/><circle cx="42" cy="94" r="10" fill="black"/><rect x="38" y="45" width="8" height="50" rx="4" fill="black"/><text x="225" y="52" text-anchor="middle" font-family="Roboto" font-size="22">${dashboard.items.length ? 'Kitchen' : ''}</text><text x="225" y="116" text-anchor="middle" font-family="Roboto" font-size="58">21.4 °C</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const itemBounds = (dashboard: Dashboard): Record<string, { x: number; y: number; width: number; height: number }> => {
  const result: Record<string, { x: number; y: number; width: number; height: number }> = {}
  for (const item of dashboard.items) {
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

let dashboards = [demoDashboard, hallwayDashboard, officeDashboard].map(dashboard => structuredClone(dashboard))
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
      dashboards,
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
      const dashboard = message.dashboard as Dashboard
      const yaml = dashboard.items.map(item => item.kind === 'primitive' ? `- type: ${item.primitive.type}` : '- type: rectangle\n- type: icon\n- type: text').join('\n')
      return { imageUrl: preview(dashboard), yaml, itemBounds: itemBounds(dashboard), warnings: [], timings: { queue: .1, data: .2, compile: .3, render: 7.4, encode: 1.2, pipeline: 9.2 } } as T
    }
    if (message.type === 'opendisplay_studio/create_dashboard') {
      const dashboard = { ...(message.dashboard as Dashboard), id: createId(), createdAt: now, updatedAt: now }
      dashboards = [...dashboards, dashboard]; return { dashboard } as T
    }
    if (message.type === 'opendisplay_studio/update_dashboard') {
      const dashboard = structuredClone(message.dashboard as Dashboard)
      dashboards = dashboards.map(item => item.id === dashboard.id ? dashboard : item); return { dashboard } as T
    }
    if (message.type === 'opendisplay_studio/delete_dashboard') {
      dashboards = dashboards.filter(item => item.id !== message.dashboard_id); return {} as T
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
      dashboards: () => Dashboard[]
      replaceHass: () => void
      hassRevision: () => number
    }
  }
}
window.__ODX_E2E__ = {
  calls: () => cloneData(calls),
  dashboards: () => cloneData(dashboards),
  replaceHass: assignFreshHass,
  hassRevision: () => hassRevision,
}

// Home Assistant assigns `hass` after the custom panel has connected and then
// replaces the object on every state update. Reproduce that lifecycle here.
window.setTimeout(assignFreshHass, 10)
window.setTimeout(assignFreshHass, 25)
