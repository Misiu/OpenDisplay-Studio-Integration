import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { catalogCascadePosition, applyProfile, createPrimitiveItem, createWidgetItem, moveLayer, removeItem, setBackground, setDisplayNumber, setItemNumber, setPalette, setWidgetConfig, toggleItemState, updatePrimitiveFields } from './dashboard-ops'
import { copyName, dashboardFromForm, dashboardIsValid, freshDashboard } from './dashboards'
import { profileById } from './display-profiles'
import { type DashboardDialog, type EditorView, type OdsEvent } from './events'
import { snapToGrid, workingArea } from './geometry'
import { History } from './history'
import { itemName } from './item-labels'
import { clamp } from './math'
import { baseStyles, chromeStyles } from './studio-styles'
import { DEFAULT_VIEWPORT, type Viewport } from './viewport'
import type { BootstrapResponse, ComposePreviewResponse, Dashboard, HomeAssistant, PrimitiveDefinition, StudioItem, WidgetConfig, WidgetDefinition } from './types'
import type { OdsCanvas } from './ods-canvas'
import './ods-canvas'
import './ods-code-view'
import './ods-gallery'
import './ods-header'
import './ods-inspector'
import './ods-library'
import './ods-new-dashboard-dialog'

const PREVIEW_DELAY_MS = 220
const messageFrom = (error: unknown, fallback: string): string => error instanceof Error && error.message ? error.message : typeof error === 'string' && error ? error : fallback

/**
 * The panel shell. It owns the dashboards, the open dashboard, the selection and the history;
 * every child element reports intent through events and this element applies it.
 */
@customElement('ods-app')
export class OdsApp extends LitElement {
  static styles = [baseStyles, chromeStyles, css`
    :host {
      --studio-accent: var(--primary-color, #03a9f4);
      --studio-accent-soft: color-mix(in srgb, var(--studio-accent) 14%, transparent);
      --studio-border: var(--divider-color, #d5dadd);
      --studio-surface: var(--card-background-color, #fff);
      --studio-text: var(--primary-text-color, #202124);
      --studio-muted: var(--secondary-text-color, #68727a);
      display: block; width: 100%; height: 100vh; height: 100dvh; max-height: 100vh; max-height: 100dvh; min-height: 0; color: var(--studio-text); background: var(--primary-background-color, #f5f7f8); font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif); overflow: hidden; overflow-anchor: none; contain: size layout paint;
    }
    .shell { height: 100%; max-height: 100%; min-height: 0; display: flex; flex-direction: column; overflow: hidden; overflow-anchor: none; }
    .layout { flex: 1; min-height: 0; display: grid; grid-template-columns: var(--toolbox-width) minmax(0, 1fr) var(--inspector-width); overflow: hidden; }
    .dashboard-empty { position: relative; height: 100%; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--studio-accent) 12%, transparent), transparent 42%), var(--primary-background-color, #f5f7f8); }
    .dialog-scrim { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgba(8, 15, 24, .62); backdrop-filter: blur(3px); }
    .dialog { width: min(560px, 100%); max-height: calc(100vh - 40px); overflow: auto; border-radius: 14px; background: var(--studio-surface); box-shadow: 0 24px 80px rgba(0,0,0,.35); }
    .dialog > header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 12px; }
    .dialog h2 { margin: 3px 0 0; font-size: 21px; }
    .confirm-dialog { width: min(430px, 100%); }
    .confirm-dialog > p { margin: 0; padding: 4px 20px 18px; color: var(--studio-muted); font-size: 13px; line-height: 1.5; }
    .confirm-dialog .confirm-delete { color: var(--error-color, #db4437); }
    .dialog footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--studio-border); }
    @media (max-width: 900px) { .layout { grid-template-columns: minmax(0, 1fr) !important; } }
  `]

  @property({ attribute: false }) public hass?: HomeAssistant

  @state() private dashboards: Dashboard[] = []
  @state() private view: EditorView = 'dashboards'
  @state() private widgets: WidgetDefinition[] = []
  @state() private primitives: PrimitiveDefinition[] = []
  @state() private current?: Dashboard
  @state() private selectedItemId = ''
  @state() private preview?: ComposePreviewResponse
  @state() private loading = true
  @state() private saving = false
  @state() private dirty = false
  @state() private error = ''
  @state() private draggingCatalog = false
  @state() private undoCount = 0
  @state() private redoCount = 0
  @state() private pendingDeleteItemId = ''
  @state() private leftCollapsed = false
  @state() private rightCollapsed = false
  @state() private inspectorWidth = 350
  @state() private snapEnabled = true
  @state() private viewport: Viewport = DEFAULT_VIEWPORT
  @state() private newDashboardOpen = false
  @state() private newDashboard = freshDashboard('en')
  @state() private dashboardDialog?: DashboardDialog
  @state() private dashboardDraft?: Dashboard

  @query('ods-canvas') private canvas?: OdsCanvas

  private previewTimer?: number
  private previewRequest = 0
  private bootstrapStarted = false
  private readonly history = new History<Dashboard>()

  private get language(): string { return this.hass?.language || 'en' }

  connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener('keydown', this.onHistoryKeyDown)
  }
  protected firstUpdated(): void { this.ensureBootstrap() }
  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('hass')) this.ensureBootstrap()
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    if (this.previewTimer) window.clearTimeout(this.previewTimer)
    window.removeEventListener('keydown', this.onHistoryKeyDown)
  }

  // --- loading -------------------------------------------------------------------------------

  private ensureBootstrap(): void {
    if (!this.hass || this.bootstrapStarted) return
    this.bootstrapStarted = true
    void this.bootstrap()
  }
  private async bootstrap(): Promise<void> {
    const hass = this.hass
    if (!hass) return
    this.loading = true; this.error = ''
    try {
      const data = await hass.callWS<BootstrapResponse>({ type: 'opendisplay_studio/bootstrap' })
      this.dashboards = data.dashboards; this.widgets = data.widgets; this.primitives = data.primitives
      this.current = undefined; this.preview = undefined; this.view = 'dashboards'
      this.clearHistory()
      this.newDashboard = freshDashboard(hass.language)
    } catch (error) { this.error = messageFrom(error, 'Could not load OpenDisplay Studio') } finally { this.loading = false }
  }

  // --- dashboards (gallery) --------------------------------------------------------------------

  private openNewDashboard(): void {
    this.newDashboard = freshDashboard(this.language)
    this.newDashboardOpen = true
  }
  private async createDashboard(): Promise<void> {
    if (!this.hass) return
    this.saving = true; this.error = ''
    try {
      const result = await this.hass.callWS<{ dashboard: Dashboard }>({ type: 'opendisplay_studio/create_dashboard', dashboard: this.newDashboard })
      this.dashboards = [...this.dashboards, result.dashboard]; this.current = structuredClone(result.dashboard); this.selectedItemId = ''; this.dirty = false; this.newDashboardOpen = false; this.view = 'design'
      this.clearHistory()
      await this.composePreview(); await this.updateComplete; this.showWholeCanvas()
    } catch (error) { this.error = messageFrom(error, 'Could not create the dashboard') } finally { this.saving = false }
  }
  private async saveDashboard(): Promise<void> {
    if (!this.hass || !this.current) return
    this.saving = true; this.error = ''
    try {
      const result = await this.hass.callWS<{ dashboard: Dashboard }>({ type: 'opendisplay_studio/update_dashboard', dashboard_id: this.current.id, dashboard: this.current })
      this.current = structuredClone(result.dashboard); this.dashboards = this.dashboards.map(dashboard => dashboard.id === result.dashboard.id ? result.dashboard : dashboard); this.dirty = false
    } catch (error) { this.error = messageFrom(error, 'Could not save the dashboard') } finally { this.saving = false }
  }
  private async deleteDashboard(): Promise<void> {
    if (!this.hass || !this.current) return
    const id = this.current.id
    try {
      await this.hass.callWS({ type: 'opendisplay_studio/delete_dashboard', dashboard_id: id })
      this.dashboards = this.dashboards.filter(dashboard => dashboard.id !== id); this.current = undefined; this.selectedItemId = ''; this.preview = undefined; this.dirty = false; this.view = 'dashboards'
      this.clearHistory()
    } catch (error) { this.error = messageFrom(error, 'Could not delete the dashboard') }
  }
  private openDashboard(dashboard: Dashboard): void {
    if (this.current?.id === dashboard.id) {
      this.view = 'design'
      if (!this.preview) void this.composePreview()
      return
    }
    if (this.dirty && !window.confirm('Discard unsaved dashboard changes?')) return
    this.current = structuredClone(dashboard); this.selectedItemId = ''; this.dirty = false
    this.clearHistory()
    this.view = 'design'
    void this.composePreview().then(() => this.showWholeCanvas())
  }
  private openAction(dashboard: Dashboard, action: DashboardDialog): void {
    this.dashboardDraft = structuredClone(dashboard)
    this.dashboardDialog = action
  }
  private closeAction(): void {
    this.dashboardDialog = undefined
    this.dashboardDraft = undefined
  }
  private async updateFromGallery(dashboard: Dashboard, fallback: string): Promise<Dashboard | undefined> {
    if (!this.hass || this.saving) return undefined
    this.saving = true; this.error = ''
    try {
      const result = await this.hass.callWS<{ dashboard: Dashboard }>({ type: 'opendisplay_studio/update_dashboard', dashboard_id: dashboard.id, dashboard })
      this.dashboards = this.dashboards.map(candidate => candidate.id === result.dashboard.id ? result.dashboard : candidate)
      if (this.current?.id === result.dashboard.id) { this.current = structuredClone(result.dashboard); this.preview = undefined; this.dirty = false }
      return result.dashboard
    } catch (error) {
      this.error = messageFrom(error, fallback)
      return undefined
    } finally { this.saving = false }
  }
  private async saveRename(): Promise<void> {
    if (this.dashboardDialog !== 'rename' || !this.dashboardDraft || this.saving) return
    const dashboard = structuredClone(this.dashboardDraft)
    dashboard.name = dashboard.name.trim()
    if (!dashboard.name) { this.error = 'Dashboard name cannot be empty'; return }
    if (this.dashboards.find(candidate => candidate.id === dashboard.id)?.name === dashboard.name) { this.closeAction(); return }
    if (await this.updateFromGallery(dashboard, 'Could not rename the dashboard')) this.closeAction()
  }
  private async duplicateDashboard(dashboard: Dashboard): Promise<void> {
    if (!this.hass || this.saving) return
    this.saving = true; this.error = ''
    const duplicate = structuredClone(dashboard)
    duplicate.id = ''; duplicate.name = copyName(dashboard, this.dashboards, this.language); duplicate.status = 'draft'; duplicate.createdAt = ''; duplicate.updatedAt = ''
    try {
      const result = await this.hass.callWS<{ dashboard: Dashboard }>({ type: 'opendisplay_studio/create_dashboard', dashboard: duplicate })
      this.dashboards = [...this.dashboards, result.dashboard]
    } catch (error) { this.error = messageFrom(error, 'Could not duplicate the dashboard') } finally { this.saving = false }
  }
  private async saveSettings(): Promise<void> {
    if (this.dashboardDialog !== 'settings' || !this.dashboardDraft || !dashboardIsValid(this.dashboardDraft)) return
    const dashboard = structuredClone(this.dashboardDraft); dashboard.name = dashboard.name.trim()
    if (await this.updateFromGallery(dashboard, 'Could not update dashboard settings')) this.closeAction()
  }
  private async confirmDeleteDashboard(): Promise<void> {
    if (this.dashboardDialog !== 'delete' || !this.dashboardDraft || !this.hass || this.saving) return
    const id = this.dashboardDraft.id
    this.saving = true; this.error = ''
    try {
      await this.hass.callWS({ type: 'opendisplay_studio/delete_dashboard', dashboard_id: id })
      this.dashboards = this.dashboards.filter(dashboard => dashboard.id !== id)
      if (this.current?.id === id) { this.current = undefined; this.selectedItemId = ''; this.preview = undefined; this.dirty = false; this.clearHistory() }
      this.closeAction()
    } catch (error) { this.error = messageFrom(error, 'Could not delete the dashboard') } finally { this.saving = false }
  }

  // --- the open dashboard: document, history, preview ----------------------------------------------

  private mutate(mutator: (dashboard: Dashboard) => void, preview = true, history = true): void {
    if (!this.current) return
    const before = structuredClone(this.current); const next = structuredClone(this.current); mutator(next)
    if (JSON.stringify(next) === JSON.stringify(before)) return
    if (history) this.recordHistory(before)
    this.current = next; this.dirty = true
    if (preview) this.schedulePreview()
  }
  private recordHistory(dashboard: Dashboard): void { this.history.record(dashboard); this.syncHistory() }
  private clearHistory(): void { this.history.clear(); this.syncHistory() }
  private syncHistory(): void { this.undoCount = this.history.undoCount; this.redoCount = this.history.redoCount }
  private restore(snapshot: Dashboard | undefined): void {
    if (!snapshot) return
    this.current = snapshot; this.dirty = true
    if (this.selectedItemId && !snapshot.items.some(item => item.id === this.selectedItemId)) this.selectedItemId = ''
    this.syncHistory(); this.schedulePreview()
  }
  private undo = (): void => { if (this.current) this.restore(this.history.undo(this.current)) }
  private redo = (): void => { if (this.current) this.restore(this.history.redo(this.current)) }
  private onHistoryKeyDown = (event: KeyboardEvent): void => {
    if (!event.ctrlKey && !event.metaKey) return
    const editing = event.composedPath().some(target => target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable))
    if (editing) return
    const key = event.key.toLowerCase()
    if (key === 'z' && event.shiftKey) { event.preventDefault(); this.redo(); return }
    if (key === 'z') { event.preventDefault(); this.undo(); return }
    if (key === 'y') { event.preventDefault(); this.redo() }
  }
  private schedulePreview(): void {
    if (this.previewTimer) window.clearTimeout(this.previewTimer)
    this.previewTimer = window.setTimeout(() => void this.composePreview(), PREVIEW_DELAY_MS)
  }
  private async composePreview(): Promise<void> {
    if (!this.hass || !this.current) return
    this.error = ''
    const request = ++this.previewRequest
    try {
      const result = await this.hass.callWS<ComposePreviewResponse>({ type: 'opendisplay_studio/compose_preview', dashboard: structuredClone(this.current) })
      if (request === this.previewRequest) this.preview = result
    } catch (error) { this.error = messageFrom(error, 'Could not render the preview') }
  }
  private setEditorView(view: 'design' | 'code'): void {
    this.view = view
    if (view === 'code' && !this.preview) void this.composePreview()
  }
  private selectItem(itemId: string): void {
    if (this.selectedItemId !== itemId) this.selectedItemId = itemId
  }
  private showWholeCanvas(): void {
    this.canvas?.resetView()
    requestAnimationFrame(() => this.canvas?.fitView())
  }

  // --- adding elements ------------------------------------------------------------------------------

  private addAt(value: string, x: number, y: number): void {
    const dashboard = this.current
    if (!dashboard) return
    const [kind, type] = value.split(':')
    if (!type) return
    let item: StudioItem | undefined
    if (kind === 'widget') {
      const definition = this.widgets.find(widget => widget.id === type)
      if (definition) item = createWidgetItem(definition, x, y, dashboard)
    } else if (kind === 'primitive') {
      item = createPrimitiveItem(type, x, y, dashboard)
      if (!item) { this.error = `Unsupported primitive type: ${type || '(empty)'}`; return }
    }
    if (!item) return
    const added = item
    this.mutate(next => { next.items.push(added) }); this.selectItem(added.id)
  }
  private addFromCatalog(value: string): void {
    if (!this.current) return
    const { x, y } = catalogCascadePosition(this.current, this.snapEnabled)
    this.addAt(value, x, y)
  }
  private dropFromCatalog(value: string, clientX: number, clientY: number): void {
    const dashboard = this.current
    const point = this.canvas?.displayPointAt(clientX, clientY)
    if (!dashboard || !point) return
    const area = workingArea(dashboard)
    this.addAt(value, clamp(snapToGrid(point.x, dashboard, this.snapEnabled), area.x, area.x + area.width - 1), clamp(snapToGrid(point.y, dashboard, this.snapEnabled), area.y, area.y + area.height - 1))
  }
  private confirmDeleteItem(): void {
    const itemId = this.pendingDeleteItemId; if (!itemId) return
    this.pendingDeleteItemId = ''
    this.mutate(next => removeItem(next, itemId))
    if (this.selectedItemId === itemId) this.selectItem('')
  }

  // --- templates --------------------------------------------------------------------------------------

  private renderDeleteDialog(): TemplateResult | typeof nothing {
    const item = this.current?.items.find(candidate => candidate.id === this.pendingDeleteItemId)
    if (!item) return nothing
    const name = itemName(item, this.widgets)
    return html`<div class="dialog-scrim" @click=${(event: Event) => { if (event.target === event.currentTarget) this.pendingDeleteItemId = '' }}><section class="dialog confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-element-title"><header><div><span class="eyebrow">Confirm removal</span><h2 id="delete-element-title">Delete ${name}?</h2></div><button class="icon-button" aria-label="Close" @click=${() => { this.pendingDeleteItemId = '' }}><ha-icon icon="mdi:close"></ha-icon></button></header><p>This removes the element from the dashboard. You can restore it with Undo.</p><footer><ha-button appearance="plain" @click=${() => { this.pendingDeleteItemId = '' }}>Cancel</ha-button><ha-button appearance="filled" class="confirm-delete" @click=${this.confirmDeleteItem}>Delete element</ha-button></footer></section></div>`
  }

  private renderGallery(): TemplateResult {
    return html`
      <ods-gallery
        .dashboards=${this.dashboards} .hass=${this.hass} .error=${this.error} .saving=${this.saving} .dialog=${this.dashboardDialog} .draft=${this.dashboardDraft}
        @dashboard-new=${this.openNewDashboard}
        @dashboard-open=${(event: OdsEvent<'dashboard-open'>) => this.openDashboard(event.detail.dashboard)}
        @dashboard-menu-action=${(event: OdsEvent<'dashboard-menu-action'>) => event.detail.action === 'duplicate' ? void this.duplicateDashboard(event.detail.dashboard) : this.openAction(event.detail.dashboard, event.detail.action)}
        @dashboard-rename-input=${(event: OdsEvent<'dashboard-rename-input'>) => { if (this.dashboardDraft) this.dashboardDraft = { ...this.dashboardDraft, name: event.detail.name } }}
        @dashboard-rename-commit=${this.saveRename}
        @dashboard-rename-cancel=${this.closeAction}
        @dashboard-settings-change=${(event: OdsEvent<'dashboard-settings-change'>) => { if (this.dashboardDraft) this.dashboardDraft = dashboardFromForm(this.dashboardDraft, event.detail.value) }}
        @dashboard-settings-save=${this.saveSettings}
        @dashboard-delete-confirm=${this.confirmDeleteDashboard}
        @dashboard-dialog-close=${this.closeAction}
      ></ods-gallery>
      ${this.newDashboardOpen ? html`
        <ods-new-dashboard-dialog
          .hass=${this.hass} .dashboard=${this.newDashboard} .saving=${this.saving}
          @new-dashboard-change=${(event: OdsEvent<'new-dashboard-change'>) => { this.newDashboard = dashboardFromForm(this.newDashboard, event.detail.value) }}
          @new-dashboard-close=${() => { this.newDashboardOpen = false }}
          @dashboard-create=${this.createDashboard}
        ></ods-new-dashboard-dialog>` : nothing}
    `
  }

  private renderDesign(dashboard: Dashboard): TemplateResult {
    const layoutStyle = styleMap({ '--toolbox-width': this.leftCollapsed ? '48px' : '255px', '--inspector-width': this.rightCollapsed ? '48px' : `${this.inspectorWidth}px` })
    return html`
      <div
        class="layout" style=${layoutStyle}
        @item-select=${(event: OdsEvent<'item-select'>) => this.selectItem(event.detail.itemId)}
        @item-flag-toggle=${(event: OdsEvent<'item-flag-toggle'>) => this.mutate(next => toggleItemState(next, event.detail.itemId, event.detail.flag))}
        @item-delete-request=${(event: OdsEvent<'item-delete-request'>) => { this.pendingDeleteItemId = event.detail.itemId }}
      >
        <ods-library
          .widgets=${this.widgets} .primitives=${this.primitives} .collapsed=${this.leftCollapsed}
          @library-collapse=${(event: OdsEvent<'library-collapse'>) => { this.leftCollapsed = event.detail.collapsed }}
          @catalog-add=${(event: OdsEvent<'catalog-add'>) => this.addFromCatalog(event.detail.value)}
          @catalog-drag=${(event: OdsEvent<'catalog-drag'>) => { this.draggingCatalog = event.detail.active }}
          @catalog-drop=${(event: OdsEvent<'catalog-drop'>) => this.dropFromCatalog(event.detail.value, event.detail.clientX, event.detail.clientY)}
        ></ods-library>
        <ods-canvas
          .dashboard=${dashboard} .preview=${this.preview} .widgets=${this.widgets} .selectedItemId=${this.selectedItemId} .snapEnabled=${this.snapEnabled}
          .acceptingDrop=${this.draggingCatalog} .undoCount=${this.undoCount} .redoCount=${this.redoCount} .viewport=${this.viewport}
          @viewport-change=${(event: OdsEvent<'viewport-change'>) => { this.viewport = event.detail }}
          @item-transform=${(event: OdsEvent<'item-transform'>) => this.mutate(next => { const index = next.items.findIndex(item => item.id === event.detail.item.id); if (index >= 0) next.items[index] = event.detail.item }, false, false)}
          @item-transform-end=${(event: OdsEvent<'item-transform-end'>) => { this.recordHistory(event.detail.before); this.schedulePreview() }}
          @snap-toggle=${() => { this.snapEnabled = !this.snapEnabled }}
          @undo=${this.undo} @redo=${this.redo}
        ></ods-canvas>
        <ods-inspector
          .hass=${this.hass} .dashboard=${dashboard} .widgets=${this.widgets} .preview=${this.preview} .selectedItemId=${this.selectedItemId} .collapsed=${this.rightCollapsed} .width=${this.inspectorWidth}
          @inspector-collapse=${(event: OdsEvent<'inspector-collapse'>) => { this.rightCollapsed = event.detail.collapsed }}
          @inspector-resize=${(event: OdsEvent<'inspector-resize'>) => { this.inspectorWidth = event.detail.width }}
          @layers-reorder=${(event: OdsEvent<'layers-reorder'>) => this.mutate(next => moveLayer(next, event.detail.itemId, event.detail.targetId, event.detail.edge))}
          @item-number-change=${(event: OdsEvent<'item-number-change'>) => this.mutate(next => setItemNumber(next, this.selectedItemId, event.detail.key, event.detail.value))}
          @display-number-change=${(event: OdsEvent<'display-number-change'>) => this.mutate(next => setDisplayNumber(next, event.detail.key, event.detail.value))}
          @profile-change=${(event: OdsEvent<'profile-change'>) => { const profile = profileById(event.detail.profileId); this.mutate(next => applyProfile(next, profile)); requestAnimationFrame(() => this.canvas?.fitView()) }}
          @palette-change=${(event: OdsEvent<'palette-change'>) => this.mutate(next => setPalette(next, event.detail.palette))}
          @background-change=${(event: OdsEvent<'background-change'>) => this.mutate(next => setBackground(next, event.detail.color))}
          @widget-config-change=${(event: OdsEvent<'widget-config-change'>) => this.mutate(next => setWidgetConfig(next, this.selectedItemId, event.detail.value as WidgetConfig))}
          @primitive-change=${(event: OdsEvent<'primitive-change'>) => this.mutate(next => updatePrimitiveFields(next, this.selectedItemId, event.detail.value))}
          @dashboard-delete-request=${this.deleteDashboard}
        ></ods-inspector>
      </div>
      ${this.renderDeleteDialog()}
    `
  }

  protected render(): TemplateResult {
    if (this.loading) return html`<div class="dashboard-empty"><p>Loading OpenDisplay Studio…</p></div>`
    const dashboard = this.current
    if (this.view === 'dashboards' || !dashboard) return this.renderGallery()
    return html`
      <div class="shell">
        <ods-header
          .dashboard=${dashboard} .view=${this.view} .dirty=${this.dirty} .saving=${this.saving}
          @show-dashboards=${() => { this.view = 'dashboards' }}
          @dashboard-name-change=${(event: OdsEvent<'dashboard-name-change'>) => this.mutate(next => { next.name = event.detail.name }, false)}
          @view-change=${(event: OdsEvent<'view-change'>) => this.setEditorView(event.detail.view)}
          @toggle-ready=${() => this.mutate(next => { next.status = next.status === 'ready' ? 'draft' : 'ready' }, false)}
          @dashboard-save=${this.saveDashboard}
        ></ods-header>
        ${this.error ? html`<ha-alert alert-type="error">${this.error}</ha-alert>` : nothing}
        ${this.view === 'code' ? html`<ods-code-view .preview=${this.preview}></ods-code-view>` : this.renderDesign(dashboard)}
      </div>
    `
  }
}

declare global { interface HTMLElementTagNameMap { 'ods-app': OdsApp } }
