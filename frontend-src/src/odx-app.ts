import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { appStyles } from './app-styles'
import { filterCatalog } from './catalog'
import { DISPLAY_PROFILES, PALETTE_COLORS, PALETTE_LABELS, profileById } from './display-profiles'
import { createId } from './ids'
import { createPrimitive } from './primitives'
import { alignIntrinsicBounds, RESIZE_HANDLES, resizeBounds, type ResizeHandle } from './resize'
import type { BootstrapResponse, ComposePreviewResponse, HaFormSchema, HomeAssistant, ItemBounds, PaletteId, Primitive, PrimitiveDefinition, PrimitiveItem, Dashboard, StudioItem, WidgetDefinition, WidgetItem } from './types'

const clone = <T>(value: T): T => structuredClone(value)
const clamp = (value: number, minimum: number, maximum: number): number => Math.max(minimum, Math.min(maximum, value))
const snap = (value: number, size: number, origin = 0): number => origin + Math.round((value - origin) / size) * size
const messageFrom = (error: unknown, fallback: string): string => error instanceof Error && error.message ? error.message : typeof error === 'string' && error ? error : fallback

type BoxPrimitive = Extract<Primitive, { x_start: number; y_start: number; x_end: number; y_end: number }>
const isBoxPrimitive = (primitive: Primitive): primitive is BoxPrimitive => 'x_start' in primitive
const primitiveNames: Record<Primitive['type'], string> = { text: 'Text', rectangle: 'Rectangle', line: 'Line', circle: 'Circle', ellipse: 'Ellipse', icon: 'Icon', qrcode: 'QR code', progress_bar: 'Progress bar' }
const primitiveIcons: Record<Primitive['type'], string> = { text: 'mdi:format-text', rectangle: 'mdi:rectangle-outline', line: 'mdi:vector-line', circle: 'mdi:circle-outline', ellipse: 'mdi:ellipse-outline', icon: 'mdi:star-outline', qrcode: 'mdi:qrcode', progress_bar: 'mdi:progress-helper' }
const resizeHandleNames: Record<ResizeHandle, string> = { nw: 'north west', n: 'north', ne: 'north east', e: 'east', se: 'south east', s: 'south', sw: 'south west', w: 'west' }
type StudioView = 'dashboards' | 'design' | 'code'
type DashboardSort = 'updated' | 'name'
type DashboardDialog = 'rename' | 'settings' | 'delete'
interface DashboardFormData { name: string; width: number; height: number; palette: PaletteId; padding: number; snapSize: number }
interface FormSectionSchema { name: string; type: 'grid' | 'expandable'; flatten: true; title?: string; expanded?: boolean; schema: StudioFormSchema[] }
type StudioFormSchema = HaFormSchema | FormSectionSchema

const freshDashboard = (language: string, profileId = 'custom'): Dashboard => {
  const profile = profileById(profileId)
  return {
    id: '', schemaVersion: 1, name: '', status: 'draft', language: language || 'en',
    display: { profileId: profile.id, width: profile.width, height: profile.height, palette: profile.defaultPalette, background: 'white', padding: 0, snapSize: 5 },
    items: [], createdAt: '', updatedAt: '',
  }
}

const primitiveBounds = (primitive: Primitive): ItemBounds => {
  if (isBoxPrimitive(primitive)) return { x: Math.min(primitive.x_start, primitive.x_end), y: Math.min(primitive.y_start, primitive.y_end), width: Math.abs(primitive.x_end - primitive.x_start) + 1, height: Math.abs(primitive.y_end - primitive.y_start) + 1 }
  if (primitive.type === 'circle') return { x: primitive.x - primitive.radius, y: primitive.y - primitive.radius, width: primitive.radius * 2 + 1, height: primitive.radius * 2 + 1 }
  if (primitive.type === 'qrcode') { const size = (21 + primitive.border * 2) * primitive.boxsize; return { x: primitive.x, y: primitive.y, width: size, height: size } }
  if (primitive.type === 'icon') return { x: primitive.x, y: primitive.y, width: primitive.size, height: primitive.size }
  return { x: primitive.x, y: primitive.y, width: Math.max(primitive.size, Math.round(primitive.value.length * primitive.size * .62)), height: Math.max(1, Math.round(primitive.size * 1.25)) }
}

const itemBounds = (item: StudioItem): ItemBounds => item.kind === 'widget' ? item.frame : primitiveBounds(item.primitive)
interface PointerEdit { itemId: string; mode: 'move' | 'resize'; resizeHandle?: ResizeHandle; startX: number; startY: number; original: StudioItem; beforeDashboard: Dashboard; changed: boolean }
interface PanelResize { startX: number; startWidth: number }
interface CatalogPointerDrag { value: string; startX: number; startY: number; currentX: number; currentY: number; grabOffsetX: number; grabOffsetY: number; previewWidth: number; previewHeight: number; active: boolean }
interface LayerPointerDrag { itemId: string; startX: number; startY: number; active: boolean }
interface LayerDropTarget { itemId: string; edge: 'before' | 'after' }

@customElement('opendisplay-studio-panel')
export class OpenDisplayStudioPanel extends LitElement {
  static styles = appStyles
  @property({ attribute: false }) public hass?: HomeAssistant

  @state() private dashboards: Dashboard[] = []
  @state() private view: StudioView = 'dashboards'
  @state() private dashboardQuery = ''
  @state() private dashboardSort: DashboardSort = 'updated'
  @state() private widgets: WidgetDefinition[] = []
  @state() private primitives: PrimitiveDefinition[] = []
  @state() private current?: Dashboard
  @state() private selectedItemId = ''
  @state() private query = ''
  @state() private preview?: ComposePreviewResponse
  @state() private loading = true
  @state() private saving = false
  @state() private dirty = false
  @state() private draggingCatalog = false
  @state() private draggingLayerId = ''
  @state() private catalogDragPosition?: { x: number; y: number }
  @state() private layerDropTarget?: LayerDropTarget
  @state() private undoCount = 0
  @state() private redoCount = 0
  @state() private pendingDeleteItemId = ''
  @state() private error = ''
  @state() private leftCollapsed = false
  @state() private rightCollapsed = false
  @state() private inspectorWidth = 350
  @state() private zoom = 1
  @state() private panX = 0
  @state() private panY = 0
  @state() private snapEnabled = true
  @state() private newDashboardOpen = false
  @state() private newDashboard = freshDashboard('en')
  @state() private dashboardMenuDashboardId = ''
  @state() private dashboardDialog?: DashboardDialog
  @state() private dashboardDraft?: Dashboard
  @state() private yamlCopyState: 'idle' | 'copied' | 'failed' = 'idle'

  private previewTimer?: number
  private yamlCopyTimer?: number
  private previewRequest = 0
  private panelResize?: PanelResize
  private pointerEdit?: PointerEdit
  private catalogPointerDrag?: CatalogPointerDrag
  private layerPointerDrag?: LayerPointerDrag
  private bootstrapStarted = false
  private suppressCatalogClick = false
  private undoStack: Dashboard[] = []
  private redoStack: Dashboard[] = []

  @query('.properties') private propertiesPanel?: HTMLElement

  connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener('keydown', this.onHistoryKeyDown)
    window.addEventListener('keydown', this.onDashboardMenuKeyDown)
    window.addEventListener('pointerdown', this.onDashboardOutsidePointerDown)
  }
  protected firstUpdated(): void { this.ensureBootstrap() }
  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('hass')) this.ensureBootstrap()
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    if (this.previewTimer) window.clearTimeout(this.previewTimer)
    if (this.yamlCopyTimer) window.clearTimeout(this.yamlCopyTimer)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
    window.removeEventListener('pointermove', this.onCatalogPointerMove)
    window.removeEventListener('pointerup', this.onCatalogPointerUp)
    window.removeEventListener('pointercancel', this.onCatalogPointerCancel)
    window.removeEventListener('pointermove', this.onLayerPointerMove)
    window.removeEventListener('pointerup', this.onLayerPointerUp)
    window.removeEventListener('pointercancel', this.onLayerPointerCancel)
    window.removeEventListener('pointermove', this.onPanelResizeMove)
    window.removeEventListener('pointerup', this.onPanelResizeEnd)
    window.removeEventListener('keydown', this.onHistoryKeyDown)
    window.removeEventListener('keydown', this.onDashboardMenuKeyDown)
    window.removeEventListener('pointerdown', this.onDashboardOutsidePointerDown)
  }

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

  private openNewDashboard(): void {
    this.newDashboard = freshDashboard(this.hass?.language ?? 'en')
    this.newDashboardOpen = true
  }
  private dashboardFormData(dashboard: Dashboard): DashboardFormData {
    return {
      name: dashboard.name,
      width: dashboard.display.width,
      height: dashboard.display.height,
      palette: dashboard.display.palette,
      padding: dashboard.display.padding,
      snapSize: dashboard.display.snapSize,
    }
  }
  private dashboardFromForm(dashboard: Dashboard, partial: Partial<DashboardFormData>): Dashboard {
    const value = { ...this.dashboardFormData(dashboard), ...partial }
    const next = clone(dashboard)
    next.name = String(value.name)
    next.display.profileId = 'custom'
    next.display.width = Math.round(Number(value.width) || 0)
    next.display.height = Math.round(Number(value.height) || 0)
    next.display.palette = value.palette in PALETTE_LABELS ? value.palette : 'bw'
    next.display.padding = Math.round(Number(value.padding) || 0)
    next.display.snapSize = Math.round(Number(value.snapSize) || 0)
    if (!PALETTE_COLORS[next.display.palette].includes(next.display.background)) next.display.background = 'white'
    return next
  }
  private updateNewDashboardForm(event: CustomEvent<{ value: Partial<DashboardFormData> }>): void {
    this.newDashboard = this.dashboardFromForm(this.newDashboard, event.detail.value)
  }
  private dashboardIsValid(dashboard: Dashboard): boolean {
    const { width, height, padding, snapSize } = dashboard.display
    return Boolean(dashboard.name.trim())
      && width >= 64 && width <= 4096
      && height >= 64 && height <= 4096
      && padding >= 0 && padding * 2 < Math.min(width, height)
      && snapSize >= 1 && snapSize <= 256
  }
  private async createDashboard(): Promise<void> {
    if (!this.hass) return
    this.saving = true; this.error = ''
    try {
      const result = await this.hass.callWS<{ dashboard: Dashboard }>({ type: 'opendisplay_studio/create_dashboard', dashboard: this.newDashboard })
      this.dashboards = [...this.dashboards, result.dashboard]; this.current = clone(result.dashboard); this.selectedItemId = ''; this.dirty = false; this.newDashboardOpen = false; this.view = 'design'
      this.clearHistory()
      await this.composePreview(); await this.updateComplete; this.resetCanvas(); requestAnimationFrame(() => this.fitCanvas())
    } catch (error) { this.error = messageFrom(error, 'Could not create the dashboard') } finally { this.saving = false }
  }
  private async saveDashboard(): Promise<void> {
    if (!this.hass || !this.current) return
    this.saving = true; this.error = ''
    try {
      const result = await this.hass.callWS<{ dashboard: Dashboard }>({ type: 'opendisplay_studio/update_dashboard', dashboard_id: this.current.id, dashboard: this.current })
      this.current = clone(result.dashboard); this.dashboards = this.dashboards.map(dashboard => dashboard.id === result.dashboard.id ? result.dashboard : dashboard); this.dirty = false
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
  private toggleDashboardMenu(event: Event, dashboardId: string): void {
    event.stopPropagation()
    this.dashboardMenuDashboardId = this.dashboardMenuDashboardId === dashboardId ? '' : dashboardId
  }
  private openDashboardAction(event: Event, dashboard: Dashboard, action: DashboardDialog): void {
    event.stopPropagation()
    this.dashboardMenuDashboardId = ''
    this.dashboardDraft = clone(dashboard)
    this.dashboardDialog = action
    if (action === 'rename') {
      void this.updateComplete.then(() => {
        const input = this.renderRoot.querySelector('.dashboard-rename-input') as HTMLInputElement | null
        input?.focus(); input?.select()
      })
    }
  }
  private closeDashboardAction(): void {
    this.dashboardDialog = undefined
    this.dashboardDraft = undefined
  }
  private onDashboardOutsidePointerDown = (event: PointerEvent): void => {
    if (!this.dashboardMenuDashboardId) return
    const insideMenu = event.composedPath().some(node => node instanceof HTMLElement
      && (node.classList.contains('dashboard-menu') || node.classList.contains('dashboard-menu-trigger')))
    if (!insideMenu) this.dashboardMenuDashboardId = ''
  }
  private onDashboardMenuKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return
    if (this.dashboardMenuDashboardId) {
      this.dashboardMenuDashboardId = ''
      event.stopPropagation()
    } else if (this.dashboardDialog) {
      this.closeDashboardAction()
      event.stopPropagation()
    }
  }
  private updateDashboardRename(event: Event): void {
    if (!this.dashboardDraft) return
    const draft = clone(this.dashboardDraft)
    draft.name = (event.target as HTMLInputElement).value
    this.dashboardDraft = draft
  }
  private onDashboardRenameKeyDown(event: KeyboardEvent): void {
    event.stopPropagation()
    if (event.key === 'Enter') {
      event.preventDefault()
      void this.saveDashboardRename()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      this.closeDashboardAction()
    }
  }
  private async updateDashboardFromGallery(dashboard: Dashboard, fallback: string): Promise<Dashboard | undefined> {
    if (!this.hass || this.saving) return undefined
    this.saving = true; this.error = ''
    try {
      const result = await this.hass.callWS<{ dashboard: Dashboard }>({ type: 'opendisplay_studio/update_dashboard', dashboard_id: dashboard.id, dashboard })
      this.dashboards = this.dashboards.map(candidate => candidate.id === result.dashboard.id ? result.dashboard : candidate)
      if (this.current?.id === result.dashboard.id) {
        this.current = clone(result.dashboard); this.preview = undefined; this.dirty = false
      }
      return result.dashboard
    } catch (error) {
      this.error = messageFrom(error, fallback)
      return undefined
    } finally { this.saving = false }
  }
  private async saveDashboardRename(): Promise<void> {
    if (this.dashboardDialog !== 'rename' || !this.dashboardDraft || this.saving) return
    const dashboard = clone(this.dashboardDraft)
    dashboard.name = dashboard.name.trim()
    if (!dashboard.name) {
      this.error = 'Dashboard name cannot be empty'
      return
    }
    const current = this.dashboards.find(candidate => candidate.id === dashboard.id)
    if (current?.name === dashboard.name) {
      this.closeDashboardAction()
      return
    }
    if (await this.updateDashboardFromGallery(dashboard, 'Could not rename the dashboard')) this.closeDashboardAction()
  }
  private dashboardCopyName(dashboard: Dashboard): string {
    const names = new Set(this.dashboards.map(candidate => candidate.name.toLocaleLowerCase(this.hass?.language || 'en')))
    const base = `${dashboard.name} copy`
    let candidate = base; let suffix = 2
    while (names.has(candidate.toLocaleLowerCase(this.hass?.language || 'en'))) candidate = `${base} ${suffix++}`
    return candidate
  }
  private async duplicateDashboard(event: Event, dashboard: Dashboard): Promise<void> {
    event.stopPropagation()
    if (!this.hass || this.saving) return
    this.dashboardMenuDashboardId = ''; this.saving = true; this.error = ''
    const duplicate = clone(dashboard)
    duplicate.id = ''; duplicate.name = this.dashboardCopyName(dashboard); duplicate.status = 'draft'; duplicate.createdAt = ''; duplicate.updatedAt = ''
    try {
      const result = await this.hass.callWS<{ dashboard: Dashboard }>({ type: 'opendisplay_studio/create_dashboard', dashboard: duplicate })
      this.dashboards = [...this.dashboards, result.dashboard]
    } catch (error) { this.error = messageFrom(error, 'Could not duplicate the dashboard') } finally { this.saving = false }
  }
  private updateDashboardSettings(event: CustomEvent<{ value: Partial<DashboardFormData> }>): void {
    if (!this.dashboardDraft) return
    this.dashboardDraft = this.dashboardFromForm(this.dashboardDraft, event.detail.value)
  }
  private async saveDashboardSettings(): Promise<void> {
    if (this.dashboardDialog !== 'settings' || !this.dashboardDraft || !this.dashboardIsValid(this.dashboardDraft)) return
    const dashboard = clone(this.dashboardDraft); dashboard.name = dashboard.name.trim()
    if (await this.updateDashboardFromGallery(dashboard, 'Could not update dashboard settings')) this.closeDashboardAction()
  }
  private async confirmDeleteDashboard(): Promise<void> {
    if (this.dashboardDialog !== 'delete' || !this.dashboardDraft || !this.hass || this.saving) return
    const id = this.dashboardDraft.id
    this.saving = true; this.error = ''
    try {
      await this.hass.callWS({ type: 'opendisplay_studio/delete_dashboard', dashboard_id: id })
      this.dashboards = this.dashboards.filter(dashboard => dashboard.id !== id)
      if (this.current?.id === id) {
        this.current = undefined; this.selectedItemId = ''; this.preview = undefined; this.dirty = false; this.clearHistory()
      }
      this.closeDashboardAction()
    } catch (error) { this.error = messageFrom(error, 'Could not delete the dashboard') } finally { this.saving = false }
  }
  private openDashboard(dashboard: Dashboard): void {
    if (this.current?.id === dashboard.id) {
      this.view = 'design'
      if (!this.preview) void this.composePreview()
      return
    }
    if (this.dirty && !window.confirm('Discard unsaved dashboard changes?')) return
    this.current = clone(dashboard); this.selectedItemId = ''; this.dirty = false
    this.clearHistory()
    this.view = 'design'
    void this.composePreview().then(() => { this.resetCanvas(); requestAnimationFrame(() => this.fitCanvas()) })
  }
  private showDashboards(): void { this.view = 'dashboards' }
  private setEditorView(view: 'design' | 'code'): void {
    this.view = view
    if (view === 'code' && !this.preview) void this.composePreview()
  }
  private mutate(mutator: (dashboard: Dashboard) => void, preview = true, history = true): void {
    if (!this.current) return
    const before = clone(this.current); const next = clone(this.current); mutator(next)
    if (JSON.stringify(next) === JSON.stringify(before)) return
    if (history) this.recordHistory(before)
    this.current = next; this.dirty = true
    if (preview) this.schedulePreview()
  }
  private recordHistory(dashboard: Dashboard): void {
    this.undoStack.push(clone(dashboard))
    if (this.undoStack.length > 100) this.undoStack.shift()
    this.redoStack = []
    this.syncHistoryState()
  }
  private clearHistory(): void {
    this.undoStack = []; this.redoStack = []; this.syncHistoryState()
  }
  private syncHistoryState(): void {
    this.undoCount = this.undoStack.length; this.redoCount = this.redoStack.length
  }
  private undo = (): void => {
    if (!this.current) return
    const previous = this.undoStack.pop(); if (!previous) return
    this.redoStack.push(clone(this.current)); this.current = clone(previous); this.dirty = true
    if (this.selectedItemId && !this.current.items.some(item => item.id === this.selectedItemId)) this.selectedItemId = ''
    this.syncHistoryState(); this.schedulePreview()
  }
  private redo = (): void => {
    if (!this.current) return
    const next = this.redoStack.pop(); if (!next) return
    this.undoStack.push(clone(this.current)); this.current = clone(next); this.dirty = true
    if (this.selectedItemId && !this.current.items.some(item => item.id === this.selectedItemId)) this.selectedItemId = ''
    this.syncHistoryState(); this.schedulePreview()
  }
  private onHistoryKeyDown = (event: KeyboardEvent): void => {
    if (!event.ctrlKey && !event.metaKey) return
    const editing = event.composedPath().some(target => target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable))
    if (editing) return
    const key = event.key.toLowerCase()
    if (key === 'z' && event.shiftKey) { event.preventDefault(); this.redo(); return }
    if (key === 'z') { event.preventDefault(); this.undo(); return }
    if (key === 'y') { event.preventDefault(); this.redo() }
  }
  private selectItemId(itemId: string): void {
    if (this.selectedItemId === itemId) return
    this.selectedItemId = itemId
    void this.updateComplete.then(() => {
      if (this.selectedItemId === itemId && this.propertiesPanel) this.propertiesPanel.scrollTop = 0
    })
  }
  private schedulePreview(): void {
    if (this.previewTimer) window.clearTimeout(this.previewTimer)
    this.previewTimer = window.setTimeout(() => void this.composePreview(), 220)
  }
  private async composePreview(): Promise<void> {
    if (!this.hass || !this.current) return
    this.error = ''
    const request = ++this.previewRequest
    try {
      const result = await this.hass.callWS<ComposePreviewResponse>({ type: 'opendisplay_studio/compose_preview', dashboard: clone(this.current) })
      if (request === this.previewRequest) { this.preview = result; this.yamlCopyState = 'idle' }
    } catch (error) { this.error = messageFrom(error, 'Could not render the preview') }
  }
  private toggleReady(): void { this.mutate(dashboard => { dashboard.status = dashboard.status === 'ready' ? 'draft' : 'ready' }, false) }
  private updateName(event: Event): void { const value = (event.target as HTMLInputElement).value; this.mutate(dashboard => { dashboard.name = value }, false) }

  private workingArea(dashboard = this.current): ItemBounds {
    if (!dashboard) return { x: 0, y: 0, width: 1, height: 1 }
    const padding = dashboard.display.padding
    return { x: padding, y: padding, width: dashboard.display.width - padding * 2, height: dashboard.display.height - padding * 2 }
  }
  private snapValue(value: number, dashboard = this.current): number {
    if (!dashboard || !this.snapEnabled) return Math.round(value)
    return snap(value, dashboard.display.snapSize, dashboard.display.padding)
  }
  private startCatalogPointerDrag(event: PointerEvent, value: string): void {
    if (event.button !== 0) return
    event.preventDefault()
    const sourceRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    this.catalogPointerDrag = {
      value,
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      grabOffsetX: event.clientX - sourceRect.left,
      grabOffsetY: event.clientY - sourceRect.top,
      previewWidth: sourceRect.width,
      previewHeight: sourceRect.height,
      active: false,
    }
    window.addEventListener('pointermove', this.onCatalogPointerMove)
    window.addEventListener('pointerup', this.onCatalogPointerUp)
    window.addEventListener('pointercancel', this.onCatalogPointerCancel)
  }
  private onCatalogPointerMove = (event: PointerEvent): void => {
    const drag = this.catalogPointerDrag; if (!drag) return
    if (!drag.active && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 4) return
    event.preventDefault(); drag.active = true; drag.currentX = event.clientX; drag.currentY = event.clientY
    const hostRect = this.getBoundingClientRect()
    this.draggingCatalog = true
    this.catalogDragPosition = { x: event.clientX - hostRect.left - drag.grabOffsetX, y: event.clientY - hostRect.top - drag.grabOffsetY }
  }
  private onCatalogPointerUp = (event: PointerEvent): void => {
    const drag = this.catalogPointerDrag
    this.finishCatalogPointerDrag()
    if (!drag?.active) return
    this.suppressCatalogClick = true
    this.dropCatalogItem(drag.value, event.clientX, event.clientY)
    window.setTimeout(() => { this.suppressCatalogClick = false }, 0)
  }
  private onCatalogPointerCancel = (): void => { this.finishCatalogPointerDrag() }
  private finishCatalogPointerDrag(): void {
    this.catalogPointerDrag = undefined; this.draggingCatalog = false; this.catalogDragPosition = undefined
    window.removeEventListener('pointermove', this.onCatalogPointerMove)
    window.removeEventListener('pointerup', this.onCatalogPointerUp)
    window.removeEventListener('pointercancel', this.onCatalogPointerCancel)
  }
  private dropCatalogItem(value: string, clientX: number, clientY: number): void {
    if (!this.current) return
    const [kind, type] = value.split(':')
    const canvas = this.renderRoot.querySelector('.canvas') as HTMLElement | null
    if (!canvas || !type) return
    const rect = canvas.getBoundingClientRect()
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return
    const area = this.workingArea()
    const x = clamp(this.snapValue((clientX - rect.left) / rect.width * this.current.display.width), area.x, area.x + area.width - 1)
    const y = clamp(this.snapValue((clientY - rect.top) / rect.height * this.current.display.height), area.y, area.y + area.height - 1)
    if (kind === 'widget') this.addWidget(type, x, y)
    if (kind === 'primitive') this.addPrimitive(type, x, y)
  }
  private onCanvasDragOver(event: DragEvent): void { if (this.draggingCatalog) event.preventDefault() }
  private onCanvasDrop(event: DragEvent): void { event.preventDefault() }
  private addCatalogItem(value: string): void {
    if (this.suppressCatalogClick || !this.current) return
    const [kind, type] = value.split(':')
    if (!type) return
    const area = this.workingArea()
    const cascade = (this.current.items.length * Math.max(this.current.display.snapSize, 5) * 3) % Math.max(1, Math.min(area.width, area.height) / 3)
    const x = this.snapValue(area.x + Math.min(24 + cascade, Math.max(0, area.width - 1)))
    const y = this.snapValue(area.y + Math.min(24 + cascade, Math.max(0, area.height - 1)))
    if (kind === 'widget') this.addWidget(type, x, y)
    if (kind === 'primitive') this.addPrimitive(type, x, y)
  }
  private addWidget(type: string, x: number, y: number): void {
    if (!this.current) return
    const definition = this.widgets.find(widget => widget.id === type)
    if (!definition) return
    const area = this.workingArea()
    const width = Math.min(definition.layout.defaultSize?.width ?? 240, area.width)
    const height = Math.min(definition.layout.defaultSize?.height ?? 144, area.height)
    const item: WidgetItem = {
      id: createId(), kind: 'widget', locked: false, hidden: false,
      widget: { type, version: definition.version, config: clone(definition.defaults) },
      frame: { x: clamp(Math.round(x - width / 2), area.x, area.x + area.width - width), y: clamp(Math.round(y - height / 2), area.y, area.y + area.height - height), width, height },
      layout: { padding: 0 },
    }
    this.mutate(dashboard => { dashboard.items.push(item) }); this.selectItemId(item.id)
  }
  private addPrimitive(type: string, x: number, y: number): void {
    if (!this.current) return
    const primitive = createPrimitive(type.trim(), { x: Math.round(this.current.display.width / 2), y: Math.round(this.current.display.height / 2), displayWidth: this.current.display.width, displayHeight: this.current.display.height })
    if (!primitive) { this.error = `Unsupported primitive type: ${type || '(empty)'}`; return }
    const item: PrimitiveItem = { id: createId(), kind: 'primitive', locked: false, hidden: false, primitive }
    const bounds = itemBounds(item)
    this.translateItem(item, Math.round(x - (bounds.x + bounds.width / 2)), Math.round(y - (bounds.y + bounds.height / 2)))
    this.constrainItem(item, this.current)
    this.mutate(dashboard => { dashboard.items.push(item) }); this.selectItemId(item.id)
  }

  private constrainItem(item: StudioItem, dashboard: Dashboard): void {
    const area = this.workingArea(dashboard); const bounds = itemBounds(item)
    const dx = clamp(bounds.x, area.x, Math.max(area.x, area.x + area.width - bounds.width)) - bounds.x
    const dy = clamp(bounds.y, area.y, Math.max(area.y, area.y + area.height - bounds.height)) - bounds.y
    this.translateItem(item, dx, dy)
    if (item.kind === 'widget') { item.frame.width = Math.min(item.frame.width, area.width); item.frame.height = Math.min(item.frame.height, area.height) }
  }
  private translateItem(item: StudioItem, dx: number, dy: number): void {
    if (item.kind === 'widget') { item.frame.x += dx; item.frame.y += dy; return }
    const primitive = item.primitive
    if (isBoxPrimitive(primitive)) { primitive.x_start += dx; primitive.x_end += dx; primitive.y_start += dy; primitive.y_end += dy }
    else if (primitive.type === 'circle') { primitive.x += dx; primitive.y += dy }
    else { primitive.x += dx; primitive.y += dy }
  }
  private resizeItem(item: StudioItem, handle: ResizeHandle, dx: number, dy: number, shiftKey: boolean, dashboard: Dashboard): void {
    const before = itemBounds(item)
    let minimumWidth = 1
    let minimumHeight = 1
    let intrinsicAspect = false
    if (item.kind === 'widget') {
      const minimum = this.widgets.find(widget => widget.id === item.widget.type)?.layout.minSize ?? { width: 60, height: 48 }
      minimumWidth = minimum.width
      minimumHeight = minimum.height
    } else if (item.primitive.type === 'circle') {
      minimumWidth = minimumHeight = 3
      intrinsicAspect = true
    } else if (item.primitive.type === 'qrcode') {
      minimumWidth = minimumHeight = 21 + item.primitive.border * 2
      intrinsicAspect = true
    } else if (item.primitive.type === 'icon') {
      minimumWidth = minimumHeight = 8
      intrinsicAspect = true
    } else if (item.primitive.type === 'text') {
      const minimumBounds = primitiveBounds({ ...item.primitive, size: 6 })
      minimumWidth = minimumBounds.width
      minimumHeight = minimumBounds.height
      intrinsicAspect = true
    } else if (item.primitive.type !== 'line') {
      minimumWidth = minimumHeight = 2
    }

    const geometryHandle: ResizeHandle = intrinsicAspect
      ? ({ n: 'ne', e: 'se', s: 'se', w: 'sw' } as Partial<Record<ResizeHandle, ResizeHandle>>)[handle] ?? handle
      : handle

    const requested = resizeBounds({
      bounds: before,
      handle: geometryHandle,
      deltaX: dx,
      deltaY: dy,
      minimumWidth,
      minimumHeight,
      area: this.workingArea(dashboard),
      preserveAspect: shiftKey || intrinsicAspect,
      snapSize: dashboard.display.snapSize,
      snapEnabled: this.snapEnabled,
    })

    if (item.kind === 'widget') {
      item.frame = requested
      return
    }

    const primitive = item.primitive
    if (isBoxPrimitive(primitive)) {
      const right = requested.x + requested.width - 1
      const bottom = requested.y + requested.height - 1
      if (primitive.type === 'line') {
        const leftToRight = primitive.x_start <= primitive.x_end
        const topToBottom = primitive.y_start <= primitive.y_end
        primitive.x_start = leftToRight ? requested.x : right
        primitive.x_end = leftToRight ? right : requested.x
        primitive.y_start = topToBottom ? requested.y : bottom
        primitive.y_end = topToBottom ? bottom : requested.y
        if (primitive.x_start === primitive.x_end && primitive.y_start === primitive.y_end) {
          primitive.x_end = Math.min(dashboard.display.width - 1, primitive.x_start + 1)
        }
      } else {
        primitive.x_start = requested.x
        primitive.y_start = requested.y
        primitive.x_end = right
        primitive.y_end = bottom
      }
      return
    }

    if (primitive.type === 'circle') {
      const radius = Math.max(1, Math.floor((Math.min(requested.width, requested.height) - 1) / 2))
      const diameter = radius * 2 + 1
      const aligned = alignIntrinsicBounds(requested, diameter, diameter, geometryHandle)
      primitive.x = aligned.x + radius
      primitive.y = aligned.y + radius
      primitive.radius = radius
      return
    }

    if (primitive.type === 'qrcode') {
      const modules = 21 + primitive.border * 2
      primitive.boxsize = clamp(Math.floor(Math.min(requested.width, requested.height) / modules), 1, 16)
      const size = modules * primitive.boxsize
      const aligned = alignIntrinsicBounds(requested, size, size, geometryHandle)
      primitive.x = aligned.x
      primitive.y = aligned.y
      return
    }

    if (primitive.type === 'icon') {
      primitive.size = clamp(Math.floor(Math.min(requested.width, requested.height)), 8, 256)
      const aligned = alignIntrinsicBounds(requested, primitive.size, primitive.size, geometryHandle)
      primitive.x = aligned.x
      primitive.y = aligned.y
      return
    }

    primitive.size = clamp(Math.round(primitive.size * requested.width / Math.max(1, before.width)), 6, 256)
    const actual = primitiveBounds(primitive)
    const aligned = alignIntrinsicBounds(requested, actual.width, actual.height, geometryHandle)
    primitive.x = aligned.x
    primitive.y = aligned.y
  }
  private selectItem(event: PointerEvent, item: StudioItem, mode: 'move' | 'resize' = 'move', resizeHandle?: ResizeHandle): void {
    event.stopPropagation(); event.preventDefault(); this.selectItemId(item.id)
    if (item.locked) return
    if (mode === 'resize' && !resizeHandle) return
    this.pointerEdit = { itemId: item.id, mode, resizeHandle, startX: event.clientX, startY: event.clientY, original: clone(item), beforeDashboard: clone(this.current!), changed: false }
    window.addEventListener('pointermove', this.onPointerMove); window.addEventListener('pointerup', this.onPointerUp)
  }
  private onPointerMove = (event: PointerEvent): void => {
    if (!this.current || !this.pointerEdit) return
    const canvas = this.renderRoot.querySelector('.canvas') as HTMLElement | null
    if (!canvas) return
    const edit = this.pointerEdit
    if (!edit.changed && Math.hypot(event.clientX - edit.startX, event.clientY - edit.startY) < 3) return
    edit.changed = true
    const rect = canvas.getBoundingClientRect()
    const dx = Math.round((event.clientX - edit.startX) / rect.width * this.current.display.width)
    const dy = Math.round((event.clientY - edit.startY) / rect.height * this.current.display.height)
    this.mutate(dashboard => {
      const index = dashboard.items.findIndex(item => item.id === edit.itemId); if (index < 0) return
      const original = clone(edit.original); if (original.locked) return
      const area = this.workingArea(dashboard); const before = itemBounds(original)
      if (edit.mode === 'move') {
        const nextX = clamp(this.snapValue(before.x + dx, dashboard), area.x, Math.max(area.x, area.x + area.width - before.width))
        const nextY = clamp(this.snapValue(before.y + dy, dashboard), area.y, Math.max(area.y, area.y + area.height - before.height))
        this.translateItem(original, nextX - before.x, nextY - before.y)
      } else if (edit.resizeHandle) this.resizeItem(original, edit.resizeHandle, dx, dy, event.shiftKey, dashboard)
      dashboard.items[index] = original
    }, false, false)
  }
  private onPointerUp = (): void => {
    const edit = this.pointerEdit
    window.removeEventListener('pointermove', this.onPointerMove); window.removeEventListener('pointerup', this.onPointerUp); this.pointerEdit = undefined
    if (edit?.changed) { this.recordHistory(edit.beforeDashboard); this.schedulePreview() }
  }

  private updateWidgetConfig(event: CustomEvent<{ value: Record<string, unknown> }>): void {
    this.mutate(dashboard => { const item = dashboard.items.find(candidate => candidate.id === this.selectedItemId); if (item?.kind === 'widget') item.widget.config = event.detail.value as WidgetItem['widget']['config'] })
  }
  private updatePrimitive(event: CustomEvent<{ value: Record<string, unknown> }>): void {
    this.mutate(dashboard => {
      const item = dashboard.items.find(candidate => candidate.id === this.selectedItemId); if (item?.kind !== 'primitive') return
      const normalized = { ...item.primitive, ...event.detail.value } as Primitive
      if ('fill' in normalized && normalized.fill === 'transparent') normalized.fill = null
      item.primitive = normalized
    })
  }
  private updateSelectedNumber(key: string, rawValue: string): void {
    if (!this.current) return
    const value = Math.round(Number(rawValue)); if (!Number.isFinite(value)) return
    this.mutate(dashboard => {
      const item = dashboard.items.find(candidate => candidate.id === this.selectedItemId); if (!item || item.locked) return
      const area = this.workingArea(dashboard)
      if (item.kind === 'widget') {
        if (key === 'padding') item.layout.padding = clamp(value, 0, 128)
        if (key === 'x') item.frame.x = clamp(value, area.x, area.x + area.width - item.frame.width)
        if (key === 'y') item.frame.y = clamp(value, area.y, area.y + area.height - item.frame.height)
        if (key === 'width') item.frame.width = clamp(value, 1, area.x + area.width - item.frame.x)
        if (key === 'height') item.frame.height = clamp(value, 1, area.y + area.height - item.frame.y)
        return
      }
      const primitive = item.primitive
      if (isBoxPrimitive(primitive)) {
        if (key === 'x') { const width = primitive.x_end - primitive.x_start; primitive.x_start = clamp(value, area.x, area.x + area.width - width - 1); primitive.x_end = primitive.x_start + width }
        if (key === 'y') { const height = primitive.y_end - primitive.y_start; primitive.y_start = clamp(value, area.y, area.y + area.height - height - 1); primitive.y_end = primitive.y_start + height }
        if (key === 'width') primitive.x_end = clamp(primitive.x_start + Math.max(1, value) - 1, primitive.x_start + 1, area.x + area.width - 1)
        if (key === 'height') primitive.y_end = clamp(primitive.y_start + Math.max(1, value) - 1, primitive.y_start + 1, area.y + area.height - 1)
      } else if (primitive.type === 'circle') {
        if (key === 'x') primitive.x = clamp(value, area.x + primitive.radius, area.x + area.width - primitive.radius)
        if (key === 'y') primitive.y = clamp(value, area.y + primitive.radius, area.y + area.height - primitive.radius)
        if (key === 'radius') primitive.radius = clamp(value, 1, Math.floor(Math.min(area.width, area.height) / 2))
      } else {
        if (key === 'x') primitive.x = clamp(value, area.x, area.x + area.width - 1)
        if (key === 'y') primitive.y = clamp(value, area.y, area.y + area.height - 1)
        if (key === 'size' && primitive.type !== 'qrcode') primitive.size = clamp(value, primitive.type === 'text' ? 6 : 8, 256)
        if (key === 'boxsize' && primitive.type === 'qrcode') primitive.boxsize = clamp(value, 1, 16)
      }
    })
  }
  private updateDisplayNumber(key: 'width' | 'height' | 'padding' | 'snapSize', rawValue: string): void {
    const value = Math.round(Number(rawValue)); if (!Number.isFinite(value)) return
    this.mutate(dashboard => {
      if (key === 'width' || key === 'height') dashboard.display[key] = clamp(value, 64, 4096)
      if (key === 'padding') dashboard.display.padding = clamp(value, 0, Math.floor((Math.min(dashboard.display.width, dashboard.display.height) - 1) / 2))
      if (key === 'snapSize') dashboard.display.snapSize = clamp(value, 1, 256)
      dashboard.items.forEach(item => this.constrainItem(item, dashboard))
    })
  }
  private updateProfile(value: string): void {
    const profile = profileById(value)
    this.mutate(dashboard => { dashboard.display.profileId = profile.id; dashboard.display.width = profile.width; dashboard.display.height = profile.height; dashboard.display.palette = profile.defaultPalette; dashboard.items.forEach(item => this.constrainItem(item, dashboard)) })
    requestAnimationFrame(() => this.fitCanvas())
  }
  private deleteSelected(): void {
    if (!this.selectedItemId) return
    this.pendingDeleteItemId = this.selectedItemId
  }

  private itemName(item: StudioItem): string {
    if (item.kind === 'primitive') return primitiveNames[item.primitive.type]
    const definition = this.widgets.find(widget => widget.id === item.widget.type)
    const title = item.widget.config.title
    return typeof title === 'string' && title.trim() ? title : definition?.name ?? item.widget.type
  }
  private toggleItemState(itemId: string, key: 'locked' | 'hidden'): void {
    this.mutate(dashboard => { const item = dashboard.items.find(candidate => candidate.id === itemId); if (item) item[key] = !item[key] })
  }
  private removeItem(itemId: string): void {
    this.pendingDeleteItemId = itemId
  }
  private confirmDeleteItem(): void {
    const itemId = this.pendingDeleteItemId; if (!itemId) return
    this.pendingDeleteItemId = ''
    this.mutate(dashboard => { dashboard.items = dashboard.items.filter(item => item.id !== itemId) })
    if (this.selectedItemId === itemId) this.selectItemId('')
  }
  private startLayerPointerDrag(event: PointerEvent, itemId: string): void {
    if (event.button !== 0) return
    event.stopPropagation(); event.preventDefault()
    this.layerPointerDrag = { itemId, startX: event.clientX, startY: event.clientY, active: false }
    window.addEventListener('pointermove', this.onLayerPointerMove)
    window.addEventListener('pointerup', this.onLayerPointerUp)
    window.addEventListener('pointercancel', this.onLayerPointerCancel)
  }
  private onLayerPointerMove = (event: PointerEvent): void => {
    const drag = this.layerPointerDrag; if (!drag) return
    if (!drag.active && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 4) return
    event.preventDefault(); drag.active = true; this.draggingLayerId = drag.itemId
    const target = this.shadowRoot?.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('.layer-row')
    const targetId = target?.dataset.itemId
    if (!target || !targetId || targetId === drag.itemId) { this.layerDropTarget = undefined; return }
    const rect = target.getBoundingClientRect()
    this.layerDropTarget = { itemId: targetId, edge: event.clientY < rect.top + rect.height / 2 ? 'before' : 'after' }
  }
  private onLayerPointerUp = (): void => {
    const drag = this.layerPointerDrag; const target = this.layerDropTarget
    this.finishLayerPointerDrag()
    if (!drag?.active || !target || drag.itemId === target.itemId) return
    this.mutate(dashboard => {
      const topFirst = [...dashboard.items].reverse(); const from = topFirst.findIndex(item => item.id === drag.itemId)
      if (from < 0) return
      const [moved] = topFirst.splice(from, 1); const targetIndex = topFirst.findIndex(item => item.id === target.itemId)
      if (targetIndex < 0) return
      const insertionIndex = target.edge === 'before' ? targetIndex : targetIndex + 1
      topFirst.splice(insertionIndex, 0, moved); dashboard.items = topFirst.reverse()
    })
  }
  private onLayerPointerCancel = (): void => { this.finishLayerPointerDrag() }
  private finishLayerPointerDrag(): void {
    this.layerPointerDrag = undefined; this.draggingLayerId = ''; this.layerDropTarget = undefined
    window.removeEventListener('pointermove', this.onLayerPointerMove)
    window.removeEventListener('pointerup', this.onLayerPointerUp)
    window.removeEventListener('pointercancel', this.onLayerPointerCancel)
  }

  private startPanelResize(event: PointerEvent): void {
    event.preventDefault(); this.panelResize = { startX: event.clientX, startWidth: this.inspectorWidth }
    window.addEventListener('pointermove', this.onPanelResizeMove); window.addEventListener('pointerup', this.onPanelResizeEnd)
  }
  private onPanelResizeMove = (event: PointerEvent): void => { if (this.panelResize) this.inspectorWidth = clamp(this.panelResize.startWidth + this.panelResize.startX - event.clientX, 286, 560) }
  private onPanelResizeEnd = (): void => { this.panelResize = undefined; window.removeEventListener('pointermove', this.onPanelResizeMove); window.removeEventListener('pointerup', this.onPanelResizeEnd) }
  private onCanvasWheel(event: WheelEvent): void {
    event.preventDefault()
    if (event.shiftKey) this.zoom = clamp(this.zoom + (event.deltaY < 0 ? .1 : -.1), .25, 4)
    else if (event.altKey) this.panX -= event.deltaY
    else this.panY -= event.deltaY
  }
  private resetCanvas(): void { this.zoom = 1; this.panX = 0; this.panY = 0 }
  private fitCanvas(): void {
    if (!this.current) return
    const stage = this.renderRoot.querySelector('.canvas-stage') as HTMLElement | null; if (!stage) return
    const availableWidth = Math.max(100, stage.clientWidth - 96); const availableHeight = Math.max(100, stage.clientHeight - 96)
    this.zoom = clamp(Math.min(availableWidth / this.current.display.width, availableHeight / this.current.display.height), .25, 3); this.panX = 0; this.panY = 0
  }

  private async copyGeneratedYaml(): Promise<void> {
    if (!this.preview?.yaml) return
    if (this.yamlCopyTimer) window.clearTimeout(this.yamlCopyTimer)
    try { await navigator.clipboard.writeText(this.preview.yaml); this.yamlCopyState = 'copied' } catch { this.yamlCopyState = 'failed' }
    this.yamlCopyTimer = window.setTimeout(() => { this.yamlCopyState = 'idle' }, 2200)
  }

  private dashboardList(): Dashboard[] {
    const query = this.dashboardQuery.trim().toLocaleLowerCase(this.hass?.language || 'en')
    return this.dashboards
      .filter(dashboard => !query || dashboard.name.toLocaleLowerCase(this.hass?.language || 'en').includes(query))
      .sort((left, right) => this.dashboardSort === 'name'
        ? left.name.localeCompare(right.name, this.hass?.language || 'en')
        : right.updatedAt.localeCompare(left.updatedAt) || left.name.localeCompare(right.name, this.hass?.language || 'en'))
  }
  private dashboardDate(dashboard: Dashboard): string {
    const date = new Date(dashboard.updatedAt)
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(this.hass?.language || 'en', { dateStyle: 'medium' }).format(date)
  }
  private dashboardAccent(palette: PaletteId): string {
    if (palette === 'bwr' || palette === 'bwry') return '#d32f2f'
    if (palette === 'bwy') return '#d6a800'
    if (palette === 'spectra6') return '#246bfd'
    return '#202124'
  }
  private renderDashboardCard(dashboard: Dashboard): TemplateResult {
    const colors = PALETTE_COLORS[dashboard.display.palette]
    const menuOpen = this.dashboardMenuDashboardId === dashboard.id
    const renaming = this.dashboardDialog === 'rename' && this.dashboardDraft?.id === dashboard.id
    const menuId = `dashboard-menu-${dashboard.id}`
    return html`
      <article class=${`dashboard-card${menuOpen ? ' menu-open' : ''}`} data-dashboard-id=${dashboard.id}>
        <div class="dashboard-card-preview">
          <div
            class="dashboard-miniature"
            style=${styleMap({
              aspectRatio: `${dashboard.display.width} / ${dashboard.display.height}`,
              background: dashboard.display.background,
              '--dashboard-accent': this.dashboardAccent(dashboard.display.palette),
            })}
          >
            <span class="miniature-title"></span>
            <span class="miniature-accent"></span>
            <span class="miniature-line long"></span>
            <span class="miniature-line"></span>
          </div>
          <span class="dashboard-resolution">${dashboard.display.width} × ${dashboard.display.height}</span>
        </div>
        <div class="dashboard-card-copy">
          <span class="dashboard-card-title">
            ${renaming ? html`<input class="dashboard-rename-input" aria-label=${`Rename dashboard ${dashboard.name}`} .value=${this.dashboardDraft?.name ?? dashboard.name} @input=${this.updateDashboardRename} @keydown=${this.onDashboardRenameKeyDown} @blur=${this.saveDashboardRename}>` : html`<strong>${dashboard.name}</strong>`}
            <span class=${`status ${dashboard.status}`}>${dashboard.status}</span>
          </span>
          <span class="dashboard-card-meta">
            <span>${dashboard.display.width} × ${dashboard.display.height}</span>
            <span class="palette-dots" aria-label=${PALETTE_LABELS[dashboard.display.palette]}>${colors.map(color => html`<i style=${styleMap({ background: color })}></i>`)}</span>
            <span>${PALETTE_LABELS[dashboard.display.palette]}</span>
          </span>
          <small>Updated ${this.dashboardDate(dashboard)}</small>
        </div>
        <button class="dashboard-card-open" aria-label=${`Open dashboard ${dashboard.name}`} @click=${() => this.openDashboard(dashboard)}></button>
        <button class="dashboard-menu-trigger" aria-label=${`Dashboard actions for ${dashboard.name}`} aria-haspopup="menu" aria-controls=${menuId} aria-expanded=${menuOpen} @click=${(event: Event) => this.toggleDashboardMenu(event, dashboard.id)}><ha-icon icon="mdi:dots-horizontal"></ha-icon></button>
        ${menuOpen ? html`
          <div class="dashboard-menu" id=${menuId} role="menu" aria-label=${`Actions for ${dashboard.name}`}>
            <button role="menuitem" @click=${(event: Event) => this.openDashboardAction(event, dashboard, 'rename')}><ha-icon icon="mdi:pencil-outline"></ha-icon><span>Rename</span></button>
            <button role="menuitem" @click=${(event: Event) => this.duplicateDashboard(event, dashboard)}><ha-icon icon="mdi:content-copy"></ha-icon><span>Duplicate</span></button>
            <button role="menuitem" @click=${(event: Event) => this.openDashboardAction(event, dashboard, 'settings')}><ha-icon icon="mdi:monitor-cog"></ha-icon><span>Display Settings</span></button>
            <button class="delete" role="menuitem" @click=${(event: Event) => this.openDashboardAction(event, dashboard, 'delete')}><ha-icon icon="mdi:delete-outline"></ha-icon><span>Delete</span></button>
          </div>
        ` : nothing}
      </article>
    `
  }
  private renderDashboardLibrary(): TemplateResult {
    const dashboards = this.dashboardList()
    return html`
      <main class="dashboard-library">
        <header class="dashboard-library-header">
          <div><h1>Dashboards</h1><p>${this.dashboards.length} ${this.dashboards.length === 1 ? 'dashboard' : 'dashboards'}</p></div>
          <ha-button class="dashboard-new-button" appearance="filled" aria-label="New dashboard" @click=${this.openNewDashboard}><span class="dashboard-new-button-label"><ha-icon icon="mdi:plus"></ha-icon><span>New dashboard</span></span></ha-button>
        </header>
        ${this.error ? html`<ha-alert alert-type="error">${this.error}</ha-alert>` : nothing}
        <section class="dashboard-library-tools" aria-label="Dashboard filters">
          <label class="dashboard-search"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" aria-label="Search dashboards" placeholder="Search dashboards…" .value=${this.dashboardQuery} @input=${(event: Event) => { this.dashboardQuery = (event.target as HTMLInputElement).value }}></label>
          <label class="dashboard-sort"><span>Sort</span><select aria-label="Sort dashboards" .value=${this.dashboardSort} @change=${(event: Event) => { this.dashboardSort = (event.target as HTMLSelectElement).value as DashboardSort }}><option value="updated">Last updated</option><option value="name">Name A–Z</option></select></label>
        </section>
        <section class="dashboard-grid" aria-label="Saved dashboards">
          <button class="dashboard-add-card" aria-label="Add dashboard" @click=${this.openNewDashboard}><ha-icon icon="mdi:plus"></ha-icon><strong>New dashboard</strong></button>
          ${dashboards.map(dashboard => this.renderDashboardCard(dashboard))}
          ${!dashboards.length ? html`<div class="dashboard-no-results"><ha-icon icon="mdi:magnify"></ha-icon><strong>No dashboards found</strong><span>Try a different search.</span></div>` : nothing}
        </section>
      </main>
      ${this.renderNewDashboardDialog()}
      ${this.renderDashboardActionDialog()}
    `
  }

  private newDashboardSchema(): StudioFormSchema[] {
    return [
      { name: 'name', label: 'Dashboard name', required: true, selector: { text: {} } },
      {
        name: 'dimensions', type: 'grid', flatten: true,
        schema: [
          { name: 'width', label: 'Width', required: true, selector: { number: { mode: 'box', min: 64, max: 4096, unit_of_measurement: 'px' } } },
          { name: 'height', label: 'Height', required: true, selector: { number: { mode: 'box', min: 64, max: 4096, unit_of_measurement: 'px' } } },
        ],
      },
      {
        name: 'palette', label: 'Palette', required: true,
        selector: { select: { mode: 'dropdown', options: Object.entries(PALETTE_LABELS).map(([value, label]) => ({ value, label })) } },
      },
      {
        name: 'advanced', type: 'expandable', flatten: true, title: 'Advanced display options', expanded: false,
        schema: [
          { name: 'padding', label: 'Outer padding', selector: { number: { mode: 'box', min: 0, max: 1024, unit_of_measurement: 'px' } } },
          { name: 'snapSize', label: 'Snap size', selector: { number: { mode: 'box', min: 1, max: 256, unit_of_measurement: 'px' } } },
        ],
      },
    ]
  }

  private renderNewDashboardDialog(): TemplateResult | typeof nothing {
    if (!this.newDashboardOpen) return nothing
    return html`
      <ha-dialog .open=${true} width="medium" header-title="New dashboard" header-subtitle="Create a custom OpenDisplay canvas" @closed=${() => { this.newDashboardOpen = false }}>
        <div class="new-dashboard-content">
          <span class="form-label">Start from</span>
          <div class="dashboard-source-options" role="radiogroup" aria-label="Dashboard source">
            <button class="dashboard-source selected" type="button" role="radio" aria-checked="true">
              <ha-icon icon="mdi:monitor"></ha-icon><span><strong>Custom size</strong><small>Set resolution and colors</small></span>
            </button>
            <button class="dashboard-source" type="button" role="radio" aria-checked="false" disabled>
              <ha-icon icon="mdi:devices"></ha-icon><span><strong>From OpenDisplay device</strong><small>Coming later</small></span>
            </button>
          </div>
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${this.dashboardFormData(this.newDashboard)}
            .schema=${this.newDashboardSchema()}
            .computeLabel=${(entry: StudioFormSchema) => 'label' in entry ? entry.label : entry.title ?? ''}
            @value-changed=${this.updateNewDashboardForm}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${() => { this.newDashboardOpen = false }}>Cancel</ha-button>
          <ha-button slot="primaryAction" appearance="filled" .disabled=${this.saving || !this.dashboardIsValid(this.newDashboard)} @click=${this.createDashboard}>${this.saving ? 'Creating…' : 'Create dashboard'}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `
  }
  private renderDashboardActionDialog(): TemplateResult | typeof nothing {
    const dashboard = this.dashboardDraft
    if (!dashboard || this.dashboardDialog === 'rename' || !this.dashboardDialog) return nothing
    if (this.dashboardDialog === 'delete') return html`
      <ha-dialog .open=${true} width="small" header-title="Delete dashboard?" @closed=${this.closeDashboardAction}>
        <div class="dashboard-delete-content">
          <p><strong>${dashboard.name}</strong> and all of its elements will be permanently removed.</p>
          <p>This action cannot be undone.</p>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${this.closeDashboardAction}>Cancel</ha-button>
          <ha-button slot="primaryAction" variant="danger" appearance="filled" .disabled=${this.saving} @click=${this.confirmDeleteDashboard}>${this.saving ? 'Deleting…' : 'Delete dashboard'}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `
    return html`
      <ha-dialog .open=${true} width="medium" header-title="Display settings" header-subtitle=${dashboard.name} @closed=${this.closeDashboardAction}>
        <div class="dashboard-settings-content">
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${this.dashboardFormData(dashboard)}
            .schema=${this.newDashboardSchema()}
            .computeLabel=${(entry: StudioFormSchema) => 'label' in entry ? entry.label : entry.title ?? ''}
            @value-changed=${this.updateDashboardSettings}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${this.closeDashboardAction}>Cancel</ha-button>
          <ha-button slot="primaryAction" appearance="filled" .disabled=${this.saving || !this.dashboardIsValid(dashboard)} @click=${this.saveDashboardSettings}>${this.saving ? 'Saving…' : 'Save changes'}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `
  }
  private renderDeleteDialog(): TemplateResult | typeof nothing {
    if (!this.pendingDeleteItemId || !this.current) return nothing
    const item = this.current.items.find(candidate => candidate.id === this.pendingDeleteItemId)
    if (!item) return nothing
    const name = this.itemName(item)
    return html`<div class="dialog-scrim" @click=${(event: Event) => { if (event.target === event.currentTarget) this.pendingDeleteItemId = '' }}><section class="dialog confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-element-title"><header><div><span class="eyebrow">Confirm removal</span><h2 id="delete-element-title">Delete ${name}?</h2></div><button class="icon-button" aria-label="Close" @click=${() => { this.pendingDeleteItemId = '' }}><ha-icon icon="mdi:close"></ha-icon></button></header><p>This removes the element from the dashboard. You can restore it with Undo.</p><footer><ha-button appearance="plain" @click=${() => { this.pendingDeleteItemId = '' }}>Cancel</ha-button><ha-button appearance="filled" class="confirm-delete" @click=${this.confirmDeleteItem}>Delete element</ha-button></footer></section></div>`
  }

  private renderToolbox(): TemplateResult {
    if (this.leftCollapsed) return html`<aside class="panel panel-rail"><button class="icon-button" title="Expand element catalog" aria-label="Expand element catalog" @click=${() => { this.leftCollapsed = false }}><ha-icon icon="mdi:chevron-right"></ha-icon></button><span class="rail-label">Library</span></aside>`
    const widgets = filterCatalog(this.widgets, this.query); const primitives = filterCatalog(this.primitives, this.query)
    return html`<aside class="panel toolbox"><div class="panel-title"><div><span class="eyebrow">Library</span><h2>Elements</h2></div><button class="icon-button" title="Collapse element catalog" aria-label="Collapse element catalog" @click=${() => { this.leftCollapsed = true }}><ha-icon icon="mdi:chevron-left"></ha-icon></button></div><label class="search"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" aria-label="Search widgets and primitives" placeholder="Search elements…" .value=${this.query} @input=${(event: Event) => { this.query = (event.target as HTMLInputElement).value }}></label><div class="catalog-scroll"><section class="catalog-section"><header><span>Widgets</span><span>${widgets.length}</span></header><div class="catalog-grid">${widgets.map(widget => { const value = `widget:${widget.id}`; return html`<button class="catalog-item" title=${`${widget.description} Click or drag to add.`} @click=${() => this.addCatalogItem(value)} @pointerdown=${(event: PointerEvent) => this.startCatalogPointerDrag(event, value)}><ha-icon .icon=${widget.icon}></ha-icon><strong>${widget.name}</strong><small>${widget.description}</small></button>` })}${!widgets.length ? html`<p class="empty-result">No matching widgets</p>` : nothing}</div></section><section class="catalog-section"><header><span>Primitives</span><span>${primitives.length}</span></header><div class="catalog-grid">${primitives.map(primitive => { const value = `primitive:${primitive.id}`; return html`<button class="catalog-item" title=${`${primitive.description} Click or drag to add.`} @click=${() => this.addCatalogItem(value)} @pointerdown=${(event: PointerEvent) => this.startCatalogPointerDrag(event, value)}><ha-icon .icon=${primitive.icon}></ha-icon><strong>${primitive.name}</strong><small>${primitive.description}</small></button>` })}${!primitives.length ? html`<p class="empty-result">No matching primitives</p>` : nothing}</div></section></div></aside>`
  }

  private renderCatalogDragGhost(): TemplateResult | typeof nothing {
    const drag = this.catalogPointerDrag
    if (!drag?.active || !this.catalogDragPosition) return nothing
    const [kind, type] = drag.value.split(':')
    const entry = kind === 'widget'
      ? this.widgets.find(widget => widget.id === type)
      : this.primitives.find(primitive => primitive.id === type)
    if (!entry) return nothing
    return html`
      <div
        class="catalog-drag-ghost"
        data-catalog-value=${drag.value}
        style=${styleMap({ left: `${this.catalogDragPosition.x}px`, top: `${this.catalogDragPosition.y}px`, width: `${drag.previewWidth}px`, height: `${drag.previewHeight}px` })}
      >
        <ha-icon class="drag-type-icon" .icon=${entry.icon}></ha-icon>
        <span>${entry.name}</span>
        <ha-icon class="drag-add-icon" icon="mdi:plus"></ha-icon>
      </div>
    `
  }

  private renderHistoryControls(): TemplateResult {
    return html`<div class="history-controls"><button aria-label="Undo" title="Undo (Ctrl+Z)" ?disabled=${!this.undoCount} @click=${this.undo}><ha-icon icon="mdi:undo"></ha-icon></button><button aria-label="Redo" title="Redo (Ctrl+Shift+Z)" ?disabled=${!this.redoCount} @click=${this.redo}><ha-icon icon="mdi:redo"></ha-icon></button></div>`
  }
  private renderCanvasItem(item: StudioItem, dashboard: Dashboard): TemplateResult {
    const box = itemBounds(item)
    const selected = item.id === this.selectedItemId
    return html`
      <div
        data-item-id=${item.id}
        class=${`selection ${selected ? 'selected' : ''} ${item.locked ? 'locked' : ''} ${item.hidden ? 'hidden' : ''}`}
        style=${styleMap({
          left: `${box.x / dashboard.display.width * 100}%`,
          top: `${box.y / dashboard.display.height * 100}%`,
          width: `${box.width / dashboard.display.width * 100}%`,
          height: `${box.height / dashboard.display.height * 100}%`,
        })}
        @pointerdown=${(event: PointerEvent) => this.selectItem(event, item)}
      >
        ${item.hidden ? html`<span class="hidden-label">Hidden</span>` : nothing}
        ${item.locked ? html`<ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>` : nothing}
        ${selected ? html`<output class="selection-size" aria-live="off">${Math.round(box.width)} × ${Math.round(box.height)}</output>` : nothing}
        ${selected && !item.locked ? RESIZE_HANDLES.map(handle => html`
          <button
            data-resize-handle=${handle}
            class=${`resize-handle resize-${handle}`}
            tabindex="-1"
            aria-label=${`Resize ${this.itemName(item)} from ${resizeHandleNames[handle]}`}
            @pointerdown=${(event: PointerEvent) => this.selectItem(event, item, 'resize', handle)}
          ></button>
        `) : nothing}
      </div>
    `
  }
  private renderCanvas(): TemplateResult {
    const dashboard = this.current!
    const transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`
    const area = this.workingArea(dashboard)
    return html`
      <main class="workspace">
        ${this.renderCatalogDragGhost()}
        <div class="workspace-meta">
          <span>${dashboard.display.width} × ${dashboard.display.height} px</span>
          <span>${dashboard.items.length} layers</span>
          <span>Padding ${dashboard.display.padding}px</span>
          ${this.renderHistoryControls()}
          <button class=${this.snapEnabled ? 'tool-toggle active' : 'tool-toggle'} aria-pressed=${this.snapEnabled} @click=${() => { this.snapEnabled = !this.snapEnabled }}>
            <ha-icon icon="mdi:magnet"></ha-icon><span>Snap ${dashboard.display.snapSize}px</span>
          </button>
          <span class="zoom-readout">${Math.round(this.zoom * 100)}%</span>
        </div>
        <section class=${this.draggingCatalog ? 'canvas-stage accepting-drop' : 'canvas-stage'} @wheel=${this.onCanvasWheel} @dragover=${this.onCanvasDragOver} @drop=${this.onCanvasDrop}>
          <div class="canvas-viewport" style=${styleMap({ transform })}>
            <div class="canvas" style=${styleMap({ width: `${dashboard.display.width}px`, height: `${dashboard.display.height}px` })} @pointerdown=${() => this.selectItemId('')}>
              ${this.preview ? html`<img draggable="false" src=${this.preview.imageUrl} alt="Authoritative rendered display preview">` : html`<div class="canvas-placeholder">Rendering…</div>`}
              <div class="working-area" aria-hidden="true" style=${styleMap({ left: `${area.x / dashboard.display.width * 100}%`, top: `${area.y / dashboard.display.height * 100}%`, width: `${area.width / dashboard.display.width * 100}%`, height: `${area.height / dashboard.display.height * 100}%`, '--snap-size': `${dashboard.display.snapSize * this.zoom}px` })}></div>
              ${dashboard.items.map(item => this.renderCanvasItem(item, dashboard))}
            </div>
          </div>
          <div class="zoom-controls"><button aria-label="Zoom out" @click=${() => { this.zoom = clamp(this.zoom - .25, .25, 4) }}>−</button>${[.5, 1, 2, 3].map(value => html`<button class=${this.zoom === value ? 'active' : ''} aria-label=${`${value}×`} @click=${() => { this.zoom = value }}>${value}×</button>`)}<button aria-label="Zoom in" @click=${() => { this.zoom = clamp(this.zoom + .25, .25, 4) }}>+</button><button aria-label="Reset" @click=${this.resetCanvas}>Reset</button><button aria-label="Fit" @click=${this.fitCanvas}>Fit</button></div>
        </section>
      </main>
    `
  }

  private renderLayers(): TemplateResult {
    const items = [...(this.current?.items ?? [])].reverse()
    return html`<section class="layers"><header><div><span class="eyebrow">Structure</span><h2>Elements</h2></div><div class="layers-header-actions"><span class="count">${items.length}</span><button class="icon-button" title="Collapse inspector" aria-label="Collapse inspector" @click=${() => { this.rightCollapsed = true }}><ha-icon icon="mdi:chevron-right"></ha-icon></button></div></header><div class="layer-list">${items.length ? items.map(item => { const drop = this.layerDropTarget?.itemId === item.id ? `drop-${this.layerDropTarget.edge}` : ''; const name = this.itemName(item); return html`<div data-item-id=${item.id} class=${`layer-row ${item.id === this.selectedItemId ? 'active' : ''} ${item.hidden ? 'is-hidden' : ''} ${item.id === this.draggingLayerId ? 'dragging' : ''} ${drop}`} @click=${() => this.selectItemId(item.id)}><button class="drag" title="Reorder layer" aria-label=${`Reorder ${name}`} @pointerdown=${(event: PointerEvent) => this.startLayerPointerDrag(event, item.id)}><ha-icon icon="mdi:drag-vertical"></ha-icon></button><ha-icon class="layer-type-icon" .icon=${item.kind === 'widget' ? this.widgets.find(widget => widget.id === item.widget.type)?.icon ?? 'mdi:puzzle' : primitiveIcons[item.primitive.type]}></ha-icon><span><strong>${name}</strong><small>${item.kind === 'widget' ? 'Widget' : item.primitive.type}</small></span><div class="layer-actions"><button title=${item.hidden ? 'Show layer' : 'Hide layer'} aria-label=${item.hidden ? `Show ${name}` : `Hide ${name}`} @click=${(event: Event) => { event.stopPropagation(); this.toggleItemState(item.id, 'hidden') }}><ha-icon .icon=${item.hidden ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}></ha-icon></button><button title=${item.locked ? 'Unlock position' : 'Lock position'} aria-label=${item.locked ? `Unlock ${name}` : `Lock ${name}`} @click=${(event: Event) => { event.stopPropagation(); this.toggleItemState(item.id, 'locked') }}><ha-icon .icon=${item.locked ? 'mdi:lock' : 'mdi:lock-open-variant-outline'}></ha-icon></button><button class="delete" title="Delete layer" aria-label=${`Delete ${name}`} @click=${(event: Event) => { event.stopPropagation(); this.removeItem(item.id) }}><ha-icon icon="mdi:delete-outline"></ha-icon></button></div></div>` }) : html`<p class="empty-layers">Drag widgets or primitives onto the canvas.</p>`}</div></section>`
  }

  private numberField(label: string, value: number, key: string, minimum = 0, maximum = 4096, disabled = false): TemplateResult {
    return html`<label class="number-field"><span>${label}</span><input data-field=${key} type="number" .value=${String(value)} min=${minimum} max=${maximum} .disabled=${disabled} @change=${(event: Event) => this.updateSelectedNumber(key, (event.target as HTMLInputElement).value)}></label>`
  }
  private screenNumberField(label: string, value: number, key: 'width' | 'height' | 'padding' | 'snapSize', minimum: number, maximum: number): TemplateResult {
    return html`<label class="number-field"><span>${label}</span><input aria-label=${label} type="number" .value=${String(value)} min=${minimum} max=${maximum} @change=${(event: Event) => this.updateDisplayNumber(key, (event.target as HTMLInputElement).value)}></label>`
  }
  private renderInspectorHeader(title: string, subtitle: string, icon: string): TemplateResult {
    return html`<div class="inspector-title"><ha-icon .icon=${icon}></ha-icon><div><h2>${title}</h2><p>${subtitle}</p></div></div>`
  }
  private renderScreenInspector(): TemplateResult {
    const dashboard = this.current!; const profile = profileById(dashboard.display.profileId)
    return html`${this.renderInspectorHeader('Dashboard', 'Display and canvas settings', 'mdi:monitor')}<details class="inspector-section" open><summary>Display</summary><div class="section-body"><label class="stack-field">Display type<select @change=${(event: Event) => this.updateProfile((event.target as HTMLSelectElement).value)}>${DISPLAY_PROFILES.map(entry => html`<option value=${entry.id} ?selected=${entry.id === dashboard.display.profileId}>${entry.manufacturer} · ${entry.name}</option>`)}</select></label><div class="field-grid">${this.screenNumberField('Width', dashboard.display.width, 'width', 64, 4096)}${this.screenNumberField('Height', dashboard.display.height, 'height', 64, 4096)}</div><div class="field-grid"><label class="stack-field">Palette<select @change=${(event: Event) => { const value = (event.target as HTMLSelectElement).value as PaletteId; this.mutate(current => { current.display.palette = value; if (!PALETTE_COLORS[value].includes(current.display.background)) current.display.background = 'white' }) }}>${(profile.id === 'custom' ? Object.keys(PALETTE_LABELS) as PaletteId[] : profile.palettes).map(palette => html`<option value=${palette} ?selected=${palette === dashboard.display.palette}>${PALETTE_LABELS[palette]}</option>`)}</select></label><label class="stack-field">Background<select @change=${(event: Event) => { const value = (event.target as HTMLSelectElement).value; this.mutate(current => { current.display.background = value }) }}>${PALETTE_COLORS[dashboard.display.palette].map(color => html`<option value=${color} ?selected=${color === dashboard.display.background}>${color[0].toUpperCase()}${color.slice(1)}</option>`)}</select></label></div></div></details><details class="inspector-section" open><summary>Working area</summary><div class="section-body"><div class="field-grid">${this.screenNumberField('Outer padding', dashboard.display.padding, 'padding', 0, 1024)}${this.screenNumberField('Snap size', dashboard.display.snapSize, 'snapSize', 1, 256)}</div><p class="field-help">Padding defines the editable safe area. Snap aligns movement and resizing to pixel increments.</p></div></details><div class="danger-zone"><ha-button appearance="plain" @click=${this.deleteDashboard}><ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>Delete dashboard</ha-button></div>${this.renderMetrics()}`
  }
  private renderItemLayout(item: StudioItem): TemplateResult {
    const disabled = item.locked
    if (item.kind === 'widget') return html`<div class="field-grid">${this.numberField('X', item.frame.x, 'x', 0, this.current!.display.width, disabled)}${this.numberField('Y', item.frame.y, 'y', 0, this.current!.display.height, disabled)}${this.numberField('Width', item.frame.width, 'width', 1, this.current!.display.width, disabled)}${this.numberField('Height', item.frame.height, 'height', 1, this.current!.display.height, disabled)}</div>${this.numberField('Inner padding', item.layout.padding, 'padding', 0, 128, disabled)}`
    const primitive = item.primitive
    if (isBoxPrimitive(primitive)) return html`<div class="field-grid">${this.numberField('X', Math.min(primitive.x_start, primitive.x_end), 'x', 0, this.current!.display.width, disabled)}${this.numberField('Y', Math.min(primitive.y_start, primitive.y_end), 'y', 0, this.current!.display.height, disabled)}${this.numberField('Width', Math.abs(primitive.x_end - primitive.x_start) + 1, 'width', 1, this.current!.display.width, disabled)}${this.numberField('Height', Math.abs(primitive.y_end - primitive.y_start) + 1, 'height', 1, this.current!.display.height, disabled)}</div>`
    if (primitive.type === 'circle') return html`<div class="field-grid">${this.numberField('Center X', primitive.x, 'x', 0, this.current!.display.width, disabled)}${this.numberField('Center Y', primitive.y, 'y', 0, this.current!.display.height, disabled)}${this.numberField('Radius', primitive.radius, 'radius', 1, Math.min(this.current!.display.width, this.current!.display.height), disabled)}</div>`
    if (primitive.type === 'qrcode') return html`<div class="field-grid">${this.numberField('X', primitive.x, 'x', 0, this.current!.display.width, disabled)}${this.numberField('Y', primitive.y, 'y', 0, this.current!.display.height, disabled)}${this.numberField('Module size', primitive.boxsize, 'boxsize', 1, 16, disabled)}</div>`
    return html`<div class="field-grid">${this.numberField('X', primitive.x, 'x', 0, this.current!.display.width, disabled)}${this.numberField('Y', primitive.y, 'y', 0, this.current!.display.height, disabled)}${this.numberField('Size', primitive.size, 'size', 6, 256, disabled)}</div>`
  }
  private primitiveAppearanceSchema(item: PrimitiveItem): HaFormSchema[] {
    const type = item.primitive.type
    const colors = [...PALETTE_COLORS[this.current?.display.palette ?? 'bw'], 'accent']
    if (type === 'text') return [{ name: 'value', label: 'Text', selector: { text: {} } }, { name: 'color', label: 'Color', selector: { select: { options: colors } } }]
    if (type === 'line') return [{ name: 'fill', label: 'Color', selector: { select: { options: colors } } }, { name: 'width', label: 'Line width', selector: { number: { min: 1, max: 32 } } }, { name: 'dashed', label: 'Dashed', selector: { boolean: {} } }]
    if (type === 'icon') return [{ name: 'value', label: 'MDI icon name', selector: { text: {} } }, { name: 'color', label: 'Color', selector: { select: { options: colors } } }]
    if (type === 'qrcode') return [{ name: 'data', label: 'Content', selector: { text: {} } }, { name: 'border', label: 'Quiet zone', selector: { number: { min: 0, max: 8 } } }, { name: 'color', label: 'Foreground', selector: { select: { options: colors } } }, { name: 'bgcolor', label: 'Background', selector: { select: { options: colors } } }]
    if (type === 'progress_bar') return [{ name: 'progress', label: 'Progress', selector: { number: { min: 0, max: 100 } } }, { name: 'direction', label: 'Direction', selector: { select: { options: ['right', 'left', 'up', 'down'] } } }, { name: 'fill', label: 'Fill', selector: { select: { options: colors } } }, { name: 'background', label: 'Background', selector: { select: { options: colors } } }, { name: 'show_percentage', label: 'Show percentage', selector: { boolean: {} } }]
    return [{ name: 'fill', label: 'Fill', selector: { select: { options: ['transparent', ...colors] } } }, { name: 'outline', label: 'Outline', selector: { select: { options: colors } } }, { name: 'width', label: 'Outline width', selector: { number: { min: 0, max: 32 } } }]
  }
  private renderItemInspector(item: StudioItem): TemplateResult {
    const definition = item.kind === 'widget' ? this.widgets.find(widget => widget.id === item.widget.type) : undefined
    const title = this.itemName(item); const subtitle = `${item.kind === 'widget' ? 'Widget' : 'ODL primitive'} · ${item.locked ? 'position locked' : 'editable'}`; const icon = item.kind === 'widget' ? (definition?.icon ?? 'mdi:puzzle') : primitiveIcons[item.primitive.type]
    const primitiveData = item.kind === 'primitive' && 'fill' in item.primitive ? { ...item.primitive, fill: item.primitive.fill ?? 'transparent' } : item.kind === 'primitive' ? item.primitive : undefined
    return html`${this.renderInspectorHeader(title, subtitle, icon)}${item.locked ? html`<div class="locked-notice"><span><ha-icon icon="mdi:lock"></ha-icon>Position is locked</span><button type="button" aria-label="Unlock element position" @click=${() => this.toggleItemState(item.id, 'locked')}>Unlock</button></div>` : nothing}<details class="inspector-section" open><summary>Layout</summary><div class="section-body">${this.renderItemLayout(item)}</div></details>${item.kind === 'widget' ? html`<details class="inspector-section" open><summary>Widget settings</summary><div class="section-body"><ha-form .hass=${this.hass} .data=${item.widget.config} .schema=${definition?.fields.map(field => ({ name: field.key, label: field.label, required: field.required, selector: field.selector })) ?? []} .computeLabel=${(entry: HaFormSchema) => entry.label} @value-changed=${this.updateWidgetConfig}></ha-form></div></details>` : html`<details class="inspector-section" open><summary>Appearance</summary><div class="section-body"><ha-form .hass=${this.hass} .data=${primitiveData} .schema=${this.primitiveAppearanceSchema(item)} .computeLabel=${(entry: HaFormSchema) => entry.label} @value-changed=${this.updatePrimitive}></ha-form></div></details>`}<div class="danger-zone"><ha-button appearance="plain" @click=${this.deleteSelected}><ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>Remove element</ha-button></div>${this.renderMetrics()}`
  }
  private renderMetrics(): TemplateResult | typeof nothing {
    if (!this.preview) return nothing
    return html`${this.preview.warnings.map(warning => html`<ha-alert class="warning" alert-type="warning">${warning}</ha-alert>`)}<details class="inspector-section telemetry"><summary>Render diagnostics</summary><div class="section-body metrics"><span>Queue</span><strong>${this.preview.timings.queue.toFixed(1)} ms</strong><span>Data</span><strong>${this.preview.timings.data.toFixed(1)} ms</strong><span>Compile</span><strong>${this.preview.timings.compile.toFixed(1)} ms</strong><span>Render</span><strong>${this.preview.timings.render.toFixed(1)} ms</strong><span>Encode</span><strong>${this.preview.timings.encode.toFixed(1)} ms</strong><span>Total</span><strong>${this.preview.timings.pipeline.toFixed(1)} ms</strong></div></details>`
  }
  private renderInspector(): TemplateResult {
    if (this.rightCollapsed) return html`<aside class="panel panel-rail right-rail"><button class="icon-button" title="Expand inspector" aria-label="Expand inspector" @click=${() => { this.rightCollapsed = false }}><ha-icon icon="mdi:chevron-left"></ha-icon></button><span class="rail-label">Layers</span></aside>`
    const item = this.current?.items.find(candidate => candidate.id === this.selectedItemId)
    return html`<aside class="panel inspector"><div class="panel-resizer" role="separator" aria-orientation="vertical" aria-label="Resize inspector" @pointerdown=${this.startPanelResize}></div>${this.renderLayers()}<section class="properties">${item ? this.renderItemInspector(item) : this.renderScreenInspector()}</section></aside>${this.renderDeleteDialog()}`
  }

  private renderEditorHeader(): TemplateResult {
    const dashboard = this.current!
    return html`
      <header class="topbar">
        <div class="editor-breadcrumb">
          <strong class="studio-name">OpenDisplay Studio</strong>
          <span class="breadcrumb-divider">/</span>
          <button class="breadcrumb-link" @click=${this.showDashboards}>Dashboards</button>
          <span class="breadcrumb-divider">/</span>
          <input class="dashboard-name" aria-label="Dashboard name" .value=${dashboard.name} @input=${this.updateName}>
        </div>
        <nav class="view-switch" aria-label="Dashboard view">
          <button class=${this.view === 'design' ? 'active' : ''} aria-pressed=${this.view === 'design'} @click=${() => this.setEditorView('design')}><ha-icon icon="mdi:tools"></ha-icon>Design</button>
          <button class=${this.view === 'code' ? 'active' : ''} aria-pressed=${this.view === 'code'} @click=${() => this.setEditorView('code')}><ha-icon icon="mdi:code-tags"></ha-icon>Code</button>
        </nav>
        <div class="editor-actions">
          <span class="status ${dashboard.status}">${dashboard.status}</span>
          <ha-button appearance="plain" @click=${this.toggleReady}>${dashboard.status === 'ready' ? 'Set Draft' : 'Set Ready'}</ha-button>
          <ha-button appearance="filled" .disabled=${!this.dirty || this.saving} @click=${this.saveDashboard}>${this.saving ? 'Saving…' : 'Save'}</ha-button>
        </div>
      </header>
    `
  }

  private renderCodeView(): TemplateResult {
    const copyLabel = this.yamlCopyState === 'copied' ? 'Copied' : this.yamlCopyState === 'failed' ? 'Copy failed' : 'Copy YAML'
    const copyIcon = this.yamlCopyState === 'copied' ? 'mdi:check' : this.yamlCopyState === 'failed' ? 'mdi:alert-circle-outline' : 'mdi:content-copy'
    return html`
      <main class="code-workspace">
        <section class="code-panel" aria-labelledby="generated-code-title">
          <header>
            <div>
              <span class="eyebrow">Generated output</span>
              <h1 id="generated-code-title">Generated ODL YAML</h1>
              <p>Read-only output generated from the current dashboard.</p>
            </div>
            <ha-button appearance="plain" aria-label="Copy generated ODL YAML" .disabled=${!this.preview?.yaml} @click=${this.copyGeneratedYaml}><ha-icon slot="start" .icon=${copyIcon}></ha-icon>${copyLabel}</ha-button>
          </header>
          ${this.preview?.warnings.map(warning => html`<ha-alert alert-type="warning">${warning}</ha-alert>`) ?? nothing}
          <textarea aria-label="Generated ODL YAML" readonly spellcheck="false" dir="ltr" .value=${this.preview?.yaml ?? ''}></textarea>
          <output class="copy-status" aria-live="polite">${this.yamlCopyState === 'copied' ? 'YAML copied to clipboard' : this.yamlCopyState === 'failed' ? 'Clipboard access failed' : ''}</output>
        </section>
      </main>
    `
  }

  protected render(): TemplateResult {
    if (this.loading) return html`<div class="dashboard-empty"><p>Loading OpenDisplay Studio…</p></div>`
    if (this.view === 'dashboards' || !this.current) return this.renderDashboardLibrary()
    const layoutStyle = styleMap({ '--toolbox-width': this.leftCollapsed ? '48px' : '255px', '--inspector-width': this.rightCollapsed ? '48px' : `${this.inspectorWidth}px` })
    return html`<div class="shell">${this.renderEditorHeader()}${this.error ? html`<ha-alert alert-type="error">${this.error}</ha-alert>` : nothing}${this.view === 'code' ? this.renderCodeView() : html`<div class="layout" style=${layoutStyle}>${this.renderToolbox()}${this.renderCanvas()}${this.renderInspector()}</div>`}</div>`
  }
}

declare global { interface HTMLElementTagNameMap { 'opendisplay-studio-panel': OpenDisplayStudioPanel } }
