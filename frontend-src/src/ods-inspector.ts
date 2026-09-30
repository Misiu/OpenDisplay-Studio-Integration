import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { DISPLAY_PROFILES, isPaletteId, PALETTE_COLORS, PALETTE_LABELS, profileById } from './display-profiles'
import { emit, type OdsEvent } from './events'
import { layoutFields, primitiveAppearanceSchema, type LayoutField } from './item-fields'
import { itemIcon, itemName } from './item-labels'
import { clamp } from './math'
import { trackPointerGesture } from './pointer-gesture'
import { baseStyles, chromeStyles } from './studio-styles'
import type { ComposePreviewResponse, Dashboard, HaFormSchema, HomeAssistant, PaletteId, PrimitiveItem, StudioItem, WidgetDefinition, WidgetItem } from './types'
import './ods-property-field'
import './ods-structure'

const MIN_WIDTH = 286
const MAX_WIDTH = 560
type DisplayKey = 'width' | 'height' | 'padding' | 'snapSize'

/** The right panel: the layer list and the properties of the selected item, or of the dashboard. */
@customElement('ods-inspector')
export class OdsInspector extends LitElement {
  static styles = [baseStyles, chromeStyles, css`
    :host { display: contents; }
    .panel { position: relative; min-width: 0; min-height: 0; background: var(--studio-surface); }
    .inspector { min-width: 0; border-left: 1px solid var(--studio-border); display: flex; flex-direction: column; overflow: hidden; overflow-anchor: none; }
    .panel-rail { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 12px; padding: 10px 6px; }
    .right-rail { border-left: 1px solid var(--studio-border); }
    .rail-label { writing-mode: vertical-rl; color: var(--studio-muted); font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .panel-resizer { position: absolute; left: -4px; top: 0; bottom: 0; width: 8px; cursor: ew-resize; z-index: 6; }
    .panel-resizer:hover { background: color-mix(in srgb, var(--studio-accent) 30%, transparent); }
    .properties { min-height: 0; flex: 1 1 auto; overflow: auto; overflow-anchor: none; overscroll-behavior: contain; }
    .inspector-title { min-height: 58px; display: grid; grid-template-columns: 30px minmax(0,1fr); align-items: center; gap: 7px; padding: 8px 12px; border-bottom: 1px solid var(--studio-border); }
    .inspector-title > ha-icon { color: var(--studio-accent); }
    .inspector-title h2 { margin: 0; font-size: 15px; }
    .inspector-title p { margin: 3px 0 0; color: var(--studio-muted); font-size: 10px; }
    .inspector-section { border-bottom: 1px solid var(--studio-border); }
    .inspector-section > summary { padding: 12px 14px; cursor: pointer; list-style-position: inside; color: var(--studio-muted); font: 700 10px var(--code-font-family, monospace); letter-spacing: .09em; text-transform: uppercase; }
    .section-body { padding: 2px 14px 14px; }
    .field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .stack-field { display: grid; gap: 5px; min-width: 0; color: var(--studio-muted); font-size: 10px; }
    .stack-field select { width: 100%; min-width: 0; height: 36px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 7px; background: var(--secondary-background-color, #f3f5f6); color: var(--studio-text); }
    .section-body > ods-property-field { margin-top: 10px; }
    .field-grid + .field-grid, .field-grid + .stack-field, .stack-field + .field-grid { margin-top: 10px; }
    .field-help { color: var(--studio-muted); font-size: 10px; line-height: 1.45; }
    .danger-zone { padding: 12px 14px; border-bottom: 1px solid var(--studio-border); color: var(--error-color, #db4437); }
    .metrics { display: grid; grid-template-columns: 1fr auto; gap: 5px 12px; font: 10px var(--code-font-family, monospace); }
    .metrics strong { text-align: right; }
    .locked-notice { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 8px 12px; padding: 7px 9px; border: 1px solid color-mix(in srgb, var(--warning-color, #ffa600) 45%, var(--studio-border)); border-radius: 7px; background: color-mix(in srgb, var(--warning-color, #ffa600) 10%, var(--studio-surface)); font-size: 11px; }
    .locked-notice span { display: inline-flex; align-items: center; gap: 6px; }
    .locked-notice ha-icon { width: 15px; height: 15px; --mdc-icon-size: 15px; }
    .locked-notice button { min-height: 26px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 6px; color: var(--primary-text-color); background: var(--studio-surface); font-size: 11px; font-weight: 700; cursor: pointer; }
    @media (max-width: 900px) { .inspector, .panel-rail { display: none; } }
  `]

  @property({ attribute: false }) public hass?: HomeAssistant
  @property({ attribute: false }) public dashboard!: Dashboard
  @property({ attribute: false }) public widgets: WidgetDefinition[] = []
  @property({ attribute: false }) public preview?: ComposePreviewResponse
  @property() public selectedItemId = ''
  @property({ type: Boolean }) public collapsed = false
  @property({ type: Number }) public width = 350

  @query('.properties') private propertiesPanel?: HTMLElement
  private stopGesture?: () => void

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('selectedItemId') && this.propertiesPanel) this.propertiesPanel.scrollTop = 0
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.stopGesture?.()
  }

  private startResize(event: PointerEvent): void {
    event.preventDefault()
    const startX = event.clientX; const startWidth = this.width
    this.stopGesture = trackPointerGesture({ origin: event, onMove: move => emit(this, 'inspector-resize', { width: clamp(startWidth + startX - move.clientX, MIN_WIDTH, MAX_WIDTH) }) })
  }

  private numberFrom(event: OdsEvent<'field-change'>): number | undefined {
    const value = Math.round(Number(event.detail.value))
    return Number.isFinite(value) ? value : undefined
  }
  private itemNumberChanged(event: OdsEvent<'field-change'>): void {
    event.stopPropagation()
    const value = this.numberFrom(event)
    if (value !== undefined) emit(this, 'item-number-change', { key: event.detail.key, value })
  }
  private displayNumberChanged(key: DisplayKey, event: OdsEvent<'field-change'>): void {
    event.stopPropagation()
    const value = this.numberFrom(event)
    if (value !== undefined) emit(this, 'display-number-change', { key, value })
  }

  private renderField(field: LayoutField, disabled: boolean): TemplateResult {
    return html`<ods-property-field .label=${field.label} .fieldKey=${field.key} .value=${field.value} .min=${field.min} .max=${field.max} .disabled=${disabled} @field-change=${this.itemNumberChanged}></ods-property-field>`
  }
  private renderDisplayField(label: string, value: number, key: DisplayKey, min: number, max: number): TemplateResult {
    return html`<ods-property-field .label=${label} .fieldKey=${key} .value=${value} .min=${min} .max=${max} @field-change=${(event: OdsEvent<'field-change'>) => this.displayNumberChanged(key, event)}></ods-property-field>`
  }
  private renderHeader(title: string, subtitle: string, icon: string): TemplateResult {
    return html`<div class="inspector-title"><ha-icon .icon=${icon}></ha-icon><div><h2>${title}</h2><p>${subtitle}</p></div></div>`
  }
  private renderMetrics(): TemplateResult | typeof nothing {
    const preview = this.preview
    if (!preview) return nothing
    const { timings } = preview
    const rows: Array<[string, number]> = [['Queue', timings.queue], ['Data', timings.data], ['Compile', timings.compile], ['Render', timings.render], ['Encode', timings.encode], ['Total', timings.pipeline]]
    return html`${preview.warnings.map(warning => html`<ha-alert class="warning" alert-type="warning">${warning}</ha-alert>`)}<details class="inspector-section telemetry"><summary>Render diagnostics</summary><div class="section-body metrics">${rows.map(([label, value]) => html`<span>${label}</span><strong>${value.toFixed(1)} ms</strong>`)}</div></details>`
  }

  private paletteChanged(event: Event): void {
    const value = (event.target as HTMLSelectElement).value
    if (isPaletteId(value)) emit(this, 'palette-change', { palette: value })
  }

  private renderDashboardInspector(): TemplateResult {
    const dashboard = this.dashboard; const profile = profileById(dashboard.display.profileId)
    const palettes: PaletteId[] = profile.id === 'custom' ? Object.keys(PALETTE_LABELS).filter(isPaletteId) : profile.palettes
    return html`${this.renderHeader('Dashboard', 'Display and canvas settings', 'mdi:monitor')}<details class="inspector-section" open><summary>Display</summary><div class="section-body"><label class="stack-field">Display type<select @change=${(event: Event) => emit(this, 'profile-change', { profileId: (event.target as HTMLSelectElement).value })}>${DISPLAY_PROFILES.map(entry => html`<option value=${entry.id} ?selected=${entry.id === dashboard.display.profileId}>${entry.manufacturer} · ${entry.name}</option>`)}</select></label><div class="field-grid">${this.renderDisplayField('Width', dashboard.display.width, 'width', 64, 4096)}${this.renderDisplayField('Height', dashboard.display.height, 'height', 64, 4096)}</div><div class="field-grid"><label class="stack-field">Palette<select @change=${this.paletteChanged}>${palettes.map(palette => html`<option value=${palette} ?selected=${palette === dashboard.display.palette}>${PALETTE_LABELS[palette]}</option>`)}</select></label><label class="stack-field">Background<select @change=${(event: Event) => emit(this, 'background-change', { color: (event.target as HTMLSelectElement).value })}>${PALETTE_COLORS[dashboard.display.palette].map(color => html`<option value=${color} ?selected=${color === dashboard.display.background}>${color[0].toUpperCase()}${color.slice(1)}</option>`)}</select></label></div></div></details><details class="inspector-section" open><summary>Working area</summary><div class="section-body"><div class="field-grid">${this.renderDisplayField('Outer padding', dashboard.display.padding, 'padding', 0, 1024)}${this.renderDisplayField('Snap size', dashboard.display.snapSize, 'snapSize', 1, 256)}</div><p class="field-help">Padding defines the editable safe area. Snap aligns movement and resizing to pixel increments.</p></div></details><div class="danger-zone"><ha-button appearance="plain" @click=${() => emit(this, 'dashboard-delete-request')}><ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>Delete dashboard</ha-button></div>${this.renderMetrics()}`
  }

  private renderItemInspector(item: StudioItem): TemplateResult {
    const definition = item.kind === 'widget' ? this.widgets.find(widget => widget.id === item.widget.type) : undefined
    const subtitle = `${item.kind === 'widget' ? 'Widget' : 'ODL primitive'} · ${item.locked ? 'position locked' : 'editable'}`
    const { grid, extra } = layoutFields(item, this.dashboard)
    return html`${this.renderHeader(itemName(item, this.widgets), subtitle, itemIcon(item, this.widgets))}${item.locked ? html`<div class="locked-notice"><span><ha-icon icon="mdi:lock"></ha-icon>Position is locked</span><button type="button" aria-label="Unlock element position" @click=${() => emit(this, 'item-flag-toggle', { itemId: item.id, flag: 'locked' })}>Unlock</button></div>` : nothing}<details class="inspector-section" open><summary>Layout</summary><div class="section-body"><div class="field-grid">${grid.map(field => this.renderField(field, item.locked))}</div>${extra.map(field => this.renderField(field, item.locked))}</div></details>${item.kind === 'widget' ? this.renderWidgetSettings(item, definition) : this.renderAppearance(item)}<div class="danger-zone"><ha-button appearance="plain" @click=${() => emit(this, 'item-delete-request', { itemId: item.id })}><ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>Remove element</ha-button></div>${this.renderMetrics()}`
  }

  private renderWidgetSettings(item: WidgetItem, definition: WidgetDefinition | undefined): TemplateResult {
    const schema = definition?.fields.map(field => ({ name: field.key, label: field.label, required: field.required, selector: field.selector })) ?? []
    return html`<details class="inspector-section" open><summary>Widget settings</summary><div class="section-body"><ha-form .hass=${this.hass} .data=${item.widget.config} .schema=${schema} .computeLabel=${(entry: HaFormSchema) => entry.label} @value-changed=${(event: CustomEvent<{ value: Record<string, unknown> }>) => emit(this, 'widget-config-change', { value: event.detail.value })}></ha-form></div></details>`
  }

  private renderAppearance(item: PrimitiveItem): TemplateResult {
    const data = 'fill' in item.primitive ? { ...item.primitive, fill: item.primitive.fill ?? 'transparent' } : item.primitive
    return html`<details class="inspector-section" open><summary>Appearance</summary><div class="section-body"><ha-form .hass=${this.hass} .data=${data} .schema=${primitiveAppearanceSchema(item, this.dashboard.display.palette)} .computeLabel=${(entry: HaFormSchema) => entry.label} @value-changed=${(event: CustomEvent<{ value: Record<string, unknown> }>) => emit(this, 'primitive-change', { value: event.detail.value })}></ha-form></div></details>`
  }

  protected render(): TemplateResult {
    if (this.collapsed) return html`<aside class="panel panel-rail right-rail"><button class="icon-button" title="Expand inspector" aria-label="Expand inspector" @click=${() => emit(this, 'inspector-collapse', { collapsed: false })}><ha-icon icon="mdi:chevron-left"></ha-icon></button><span class="rail-label">Layers</span></aside>`
    const item = this.dashboard.items.find(candidate => candidate.id === this.selectedItemId)
    return html`<aside class="panel inspector"><div class="panel-resizer" role="separator" aria-orientation="vertical" aria-label="Resize inspector" @pointerdown=${this.startResize}></div><ods-structure .items=${this.dashboard.items} .widgets=${this.widgets} .selectedItemId=${this.selectedItemId}></ods-structure><section class="properties">${item ? this.renderItemInspector(item) : this.renderDashboardInspector()}</section></aside>`
  }
}

declare global { interface HTMLElementTagNameMap { 'ods-inspector': OdsInspector } }
