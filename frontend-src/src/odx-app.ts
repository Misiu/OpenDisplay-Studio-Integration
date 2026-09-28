import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { appStyles } from './app-styles'
import { filterCatalog } from './catalog'
import { DISPLAY_PROFILES, PALETTE_COLORS, PALETTE_LABELS, profileById } from './display-profiles'
import { createId } from './ids'
import { createPrimitive } from './primitives'
import { alignIntrinsicBounds, RESIZE_HANDLES, resizeBounds, type ResizeHandle } from './resize'
import type { BootstrapResponse, ComposePreviewResponse, HaFormSchema, HomeAssistant, ItemBounds, PaletteId, Primitive, PrimitiveDefinition, PrimitiveItem, ScreenProject, StudioItem, WidgetDefinition, WidgetItem } from './types'

const clone = <T>(value: T): T => structuredClone(value)
const clamp = (value: number, minimum: number, maximum: number): number => Math.max(minimum, Math.min(maximum, value))
const snap = (value: number, size: number, origin = 0): number => origin + Math.round((value - origin) / size) * size
const messageFrom = (error: unknown, fallback: string): string => error instanceof Error && error.message ? error.message : typeof error === 'string' && error ? error : fallback

type BoxPrimitive = Extract<Primitive, { x_start: number; y_start: number; x_end: number; y_end: number }>
const isBoxPrimitive = (primitive: Primitive): primitive is BoxPrimitive => 'x_start' in primitive
const primitiveNames: Record<Primitive['type'], string> = { text: 'Text', rectangle: 'Rectangle', line: 'Line', circle: 'Circle', ellipse: 'Ellipse', icon: 'Icon', qrcode: 'QR code', progress_bar: 'Progress bar' }
const primitiveIcons: Record<Primitive['type'], string> = { text: 'mdi:format-text', rectangle: 'mdi:rectangle-outline', line: 'mdi:vector-line', circle: 'mdi:circle-outline', ellipse: 'mdi:ellipse-outline', icon: 'mdi:star-outline', qrcode: 'mdi:qrcode', progress_bar: 'mdi:progress-helper' }
const resizeHandleNames: Record<ResizeHandle, string> = { nw: 'north west', n: 'north', ne: 'north east', e: 'east', se: 'south east', s: 'south', sw: 'south west', w: 'west' }

const freshProject = (language: string, profileId = DISPLAY_PROFILES[0].id): ScreenProject => {
  const profile = profileById(profileId)
  return {
    id: '', schemaVersion: 3, name: 'New dashboard', status: 'draft', language: language || 'en',
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
interface PointerEdit { itemId: string; mode: 'move' | 'resize'; resizeHandle?: ResizeHandle; startX: number; startY: number; original: StudioItem; beforeProject: ScreenProject; changed: boolean }
interface PanelResize { startX: number; startWidth: number }
interface CatalogPointerDrag { value: string; startX: number; startY: number; currentX: number; currentY: number; grabOffsetX: number; grabOffsetY: number; previewWidth: number; previewHeight: number; active: boolean }
interface LayerPointerDrag { itemId: string; startX: number; startY: number; active: boolean }
interface LayerDropTarget { itemId: string; edge: 'before' | 'after' }

@customElement('opendisplay-studio-panel')
export class OpenDisplayStudioPanel extends LitElement {
  static styles = appStyles
  @property({ attribute: false }) public hass?: HomeAssistant

  @state() private projects: ScreenProject[] = []
  @state() private integrationVersion = ''
  @state() private widgets: WidgetDefinition[] = []
  @state() private primitives: PrimitiveDefinition[] = []
  @state() private current?: ScreenProject
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
  @state() private newDashboard = freshProject('en')
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
  private undoStack: ScreenProject[] = []
  private redoStack: ScreenProject[] = []

  @query('.properties') private propertiesPanel?: HTMLElement

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
      this.integrationVersion = data.version; this.projects = data.projects; this.widgets = data.widgets; this.primitives = data.primitives
      this.current = this.projects[0] ? clone(this.projects[0]) : undefined
      this.clearHistory()
      this.newDashboard = freshProject(hass.language)
      if (this.current) { await this.composePreview(); await this.updateComplete; requestAnimationFrame(() => this.fitCanvas()) }
    } catch (error) { this.error = messageFrom(error, 'Could not load OpenDisplay Studio') } finally { this.loading = false }
  }

  private openNewDashboard(): void {
    this.newDashboard = freshProject(this.hass?.language ?? 'en')
    this.newDashboardOpen = true
  }
  private updateNewDashboard(field: string, value: string): void {
    const next = clone(this.newDashboard)
    if (field === 'profileId') {
      const profile = profileById(value); next.display.profileId = profile.id; next.display.width = profile.width; next.display.height = profile.height; next.display.palette = profile.defaultPalette
    } else if (field === 'name') next.name = value
    else if (field === 'palette') next.display.palette = value as PaletteId
    else if (field === 'background') next.display.background = value
    else if (field === 'width' || field === 'height' || field === 'padding' || field === 'snapSize') next.display[field] = Math.max(field === 'snapSize' ? 1 : 0, Math.round(Number(value) || 0))
    this.newDashboard = next
  }
  private async createProject(): Promise<void> {
    if (!this.hass) return
    this.saving = true; this.error = ''
    try {
      const result = await this.hass.callWS<{ project: ScreenProject }>({ type: 'opendisplay_studio/create_project', project: this.newDashboard })
      this.projects = [...this.projects, result.project]; this.current = clone(result.project); this.selectedItemId = ''; this.dirty = false; this.newDashboardOpen = false
      this.clearHistory()
      await this.composePreview(); await this.updateComplete; this.resetCanvas(); requestAnimationFrame(() => this.fitCanvas())
    } catch (error) { this.error = messageFrom(error, 'Could not create the dashboard') } finally { this.saving = false }
  }
  private async saveProject(): Promise<void> {
    if (!this.hass || !this.current) return
    this.saving = true; this.error = ''
    try {
      const result = await this.hass.callWS<{ project: ScreenProject }>({ type: 'opendisplay_studio/update_project', project_id: this.current.id, project: this.current })
      this.current = clone(result.project); this.projects = this.projects.map(project => project.id === result.project.id ? result.project : project); this.dirty = false
    } catch (error) { this.error = messageFrom(error, 'Could not save the dashboard') } finally { this.saving = false }
  }
  private async deleteProject(): Promise<void> {
    if (!this.hass || !this.current) return
    const id = this.current.id
    try {
      await this.hass.callWS({ type: 'opendisplay_studio/delete_project', project_id: id })
      this.projects = this.projects.filter(project => project.id !== id); this.current = this.projects[0] ? clone(this.projects[0]) : undefined; this.selectedItemId = ''; this.preview = undefined; this.dirty = false
      this.clearHistory()
      if (this.current) await this.composePreview()
    } catch (error) { this.error = messageFrom(error, 'Could not delete the dashboard') }
  }
  private selectProject(project: ScreenProject): void {
    this.current = clone(project); this.selectedItemId = ''; this.dirty = false
    this.clearHistory()
    void this.composePreview().then(() => { this.resetCanvas(); requestAnimationFrame(() => this.fitCanvas()) })
  }
  private mutate(mutator: (project: ScreenProject) => void, preview = true, history = true): void {
    if (!this.current) return
    const before = clone(this.current); const next = clone(this.current); mutator(next)
    if (JSON.stringify(next) === JSON.stringify(before)) return
    if (history) this.recordHistory(before)
    this.current = next; this.dirty = true
    if (preview) this.schedulePreview()
  }
  private recordHistory(project: ScreenProject): void {
    this.undoStack.push(clone(project))
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
      const result = await this.hass.callWS<ComposePreviewResponse>({ type: 'opendisplay_studio/compose_preview', project: clone(this.current) })
      if (request === this.previewRequest) { this.preview = result; this.yamlCopyState = 'idle' }
    } catch (error) { this.error = messageFrom(error, 'Could not render the preview') }
  }
  private toggleReady(): void { this.mutate(project => { project.status = project.status === 'ready' ? 'draft' : 'ready' }, false) }
  private updateName(event: Event): void { const value = (event.target as HTMLInputElement).value; this.mutate(project => { project.name = value }, false) }

  private workingArea(project = this.current): ItemBounds {
    if (!project) return { x: 0, y: 0, width: 1, height: 1 }
    const padding = project.display.padding
    return { x: padding, y: padding, width: project.display.width - padding * 2, height: project.display.height - padding * 2 }
  }
  private snapValue(value: number, project = this.current): number {
    if (!project || !this.snapEnabled) return Math.round(value)
    return snap(value, project.display.snapSize, project.display.padding)
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
    this.mutate(project => { project.items.push(item) }); this.selectItemId(item.id)
  }
  private addPrimitive(type: string, x: number, y: number): void {
    if (!this.current) return
    const primitive = createPrimitive(type.trim(), { x: Math.round(this.current.display.width / 2), y: Math.round(this.current.display.height / 2), displayWidth: this.current.display.width, displayHeight: this.current.display.height })
    if (!primitive) { this.error = `Unsupported primitive type: ${type || '(empty)'}`; return }
    const item: PrimitiveItem = { id: createId(), kind: 'primitive', locked: false, hidden: false, primitive }
    const bounds = itemBounds(item)
    this.translateItem(item, Math.round(x - (bounds.x + bounds.width / 2)), Math.round(y - (bounds.y + bounds.height / 2)))
    this.constrainItem(item, this.current)
    this.mutate(project => { project.items.push(item) }); this.selectItemId(item.id)
  }

  private constrainItem(item: StudioItem, project: ScreenProject): void {
    const area = this.workingArea(project); const bounds = itemBounds(item)
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
  private resizeItem(item: StudioItem, handle: ResizeHandle, dx: number, dy: number, shiftKey: boolean, project: ScreenProject): void {
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
      area: this.workingArea(project),
      preserveAspect: shiftKey || intrinsicAspect,
      snapSize: project.display.snapSize,
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
          primitive.x_end = Math.min(project.display.width - 1, primitive.x_start + 1)
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
    this.pointerEdit = { itemId: item.id, mode, resizeHandle, startX: event.clientX, startY: event.clientY, original: clone(item), beforeProject: clone(this.current!), changed: false }
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
    this.mutate(project => {
      const index = project.items.findIndex(item => item.id === edit.itemId); if (index < 0) return
      const original = clone(edit.original); if (original.locked) return
      const area = this.workingArea(project); const before = itemBounds(original)
      if (edit.mode === 'move') {
        const nextX = clamp(this.snapValue(before.x + dx, project), area.x, Math.max(area.x, area.x + area.width - before.width))
        const nextY = clamp(this.snapValue(before.y + dy, project), area.y, Math.max(area.y, area.y + area.height - before.height))
        this.translateItem(original, nextX - before.x, nextY - before.y)
      } else if (edit.resizeHandle) this.resizeItem(original, edit.resizeHandle, dx, dy, event.shiftKey, project)
      project.items[index] = original
    }, false, false)
  }
  private onPointerUp = (): void => {
    const edit = this.pointerEdit
    window.removeEventListener('pointermove', this.onPointerMove); window.removeEventListener('pointerup', this.onPointerUp); this.pointerEdit = undefined
    if (edit?.changed) { this.recordHistory(edit.beforeProject); this.schedulePreview() }
  }

  private updateWidgetConfig(event: CustomEvent<{ value: Record<string, unknown> }>): void {
    this.mutate(project => { const item = project.items.find(candidate => candidate.id === this.selectedItemId); if (item?.kind === 'widget') item.widget.config = event.detail.value as WidgetItem['widget']['config'] })
  }
  private updatePrimitive(event: CustomEvent<{ value: Record<string, unknown> }>): void {
    this.mutate(project => {
      const item = project.items.find(candidate => candidate.id === this.selectedItemId); if (item?.kind !== 'primitive') return
      const normalized = { ...item.primitive, ...event.detail.value } as Primitive
      if ('fill' in normalized && normalized.fill === 'transparent') normalized.fill = null
      item.primitive = normalized
    })
  }
  private updateSelectedNumber(key: string, rawValue: string): void {
    if (!this.current) return
    const value = Math.round(Number(rawValue)); if (!Number.isFinite(value)) return
    this.mutate(project => {
      const item = project.items.find(candidate => candidate.id === this.selectedItemId); if (!item || item.locked) return
      const area = this.workingArea(project)
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
    this.mutate(project => {
      if (key === 'width' || key === 'height') project.display[key] = clamp(value, 64, 4096)
      if (key === 'padding') project.display.padding = clamp(value, 0, Math.floor((Math.min(project.display.width, project.display.height) - 1) / 2))
      if (key === 'snapSize') project.display.snapSize = clamp(value, 1, 256)
      project.items.forEach(item => this.constrainItem(item, project))
    })
  }
  private updateProfile(value: string): void {
    const profile = profileById(value)
    this.mutate(project => { project.display.profileId = profile.id; project.display.width = profile.width; project.display.height = profile.height; project.display.palette = profile.defaultPalette; project.items.forEach(item => this.constrainItem(item, project)) })
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
    this.mutate(project => { const item = project.items.find(candidate => candidate.id === itemId); if (item) item[key] = !item[key] })
  }
  private removeItem(itemId: string): void {
    this.pendingDeleteItemId = itemId
  }
  private confirmDeleteItem(): void {
    const itemId = this.pendingDeleteItemId; if (!itemId) return
    this.pendingDeleteItemId = ''
    this.mutate(project => { project.items = project.items.filter(item => item.id !== itemId) })
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
    this.mutate(project => {
      const topFirst = [...project.items].reverse(); const from = topFirst.findIndex(item => item.id === drag.itemId)
      if (from < 0) return
      const [moved] = topFirst.splice(from, 1); const targetIndex = topFirst.findIndex(item => item.id === target.itemId)
      if (targetIndex < 0) return
      const insertionIndex = target.edge === 'before' ? targetIndex : targetIndex + 1
      topFirst.splice(insertionIndex, 0, moved); project.items = topFirst.reverse()
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

  private renderNewDashboardDialog(): TemplateResult | typeof nothing {
    if (!this.newDashboardOpen) return nothing
    const profile = profileById(this.newDashboard.display.profileId)
    return html`<div class="dialog-scrim" @click=${(event: Event) => { if (event.target === event.currentTarget) this.newDashboardOpen = false }}><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="new-dashboard-title"><header><div><span class="eyebrow">Dashboard setup</span><h2 id="new-dashboard-title">Add dashboard</h2></div><button class="icon-button" aria-label="Close" @click=${() => { this.newDashboardOpen = false }}><ha-icon icon="mdi:close"></ha-icon></button></header><div class="dialog-grid"><label class="wide">Name<input aria-label="Dashboard name" .value=${this.newDashboard.name} @input=${(event: Event) => this.updateNewDashboard('name', (event.target as HTMLInputElement).value)}></label><label class="wide">Display type<select aria-label="Display type" .value=${this.newDashboard.display.profileId ?? ''} @change=${(event: Event) => this.updateNewDashboard('profileId', (event.target as HTMLSelectElement).value)}>${DISPLAY_PROFILES.map(entry => html`<option value=${entry.id}>${entry.manufacturer} · ${entry.name}</option>`)}</select></label><label>Width<input aria-label="New dashboard width" type="number" .disabled=${profile.id !== 'custom'} .value=${String(this.newDashboard.display.width)} @input=${(event: Event) => this.updateNewDashboard('width', (event.target as HTMLInputElement).value)}></label><label>Height<input aria-label="New dashboard height" type="number" .disabled=${profile.id !== 'custom'} .value=${String(this.newDashboard.display.height)} @input=${(event: Event) => this.updateNewDashboard('height', (event.target as HTMLInputElement).value)}></label><label class="wide">Colors<select aria-label="Dashboard colors" .value=${this.newDashboard.display.palette} @change=${(event: Event) => this.updateNewDashboard('palette', (event.target as HTMLSelectElement).value)}>${profile.palettes.map(palette => html`<option value=${palette}>${PALETTE_LABELS[palette]}</option>`)}</select></label><label>Outer padding<input aria-label="Dashboard padding" type="number" min="0" .value=${String(this.newDashboard.display.padding)} @input=${(event: Event) => this.updateNewDashboard('padding', (event.target as HTMLInputElement).value)}></label><label>Snap size<input aria-label="Dashboard snap size" type="number" min="1" .value=${String(this.newDashboard.display.snapSize)} @input=${(event: Event) => this.updateNewDashboard('snapSize', (event.target as HTMLInputElement).value)}></label></div><footer><ha-button appearance="plain" @click=${() => { this.newDashboardOpen = false }}>Cancel</ha-button><ha-button appearance="filled" .disabled=${this.saving || !this.newDashboard.name.trim()} @click=${this.createProject}>${this.saving ? 'Creating…' : 'Create dashboard'}</ha-button></footer></section></div>`
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

  private renderDashboardTabs(): TemplateResult {
    return html`<nav class="dashboard-tabs" aria-label="Dashboards">${this.projects.map(project => html`<button class=${project.id === this.current?.id ? 'dashboard-tab active' : 'dashboard-tab'} @click=${() => this.selectProject(project)}><ha-icon icon="mdi:monitor"></ha-icon><span>${project.name}</span><i class=${project.status} title=${project.status}></i></button>`)}<button class="add-tab" @click=${this.openNewDashboard}><ha-icon icon="mdi:plus"></ha-icon>Add dashboard</button><span class="tab-spacer"></span><div class="history-controls"><button aria-label="Undo" title="Undo (Ctrl+Z)" ?disabled=${!this.undoCount} @click=${this.undo}><ha-icon icon="mdi:undo"></ha-icon></button><button aria-label="Redo" title="Redo (Ctrl+Shift+Z)" ?disabled=${!this.redoCount} @click=${this.redo}><ha-icon icon="mdi:redo"></ha-icon></button></div></nav>${this.renderCatalogDragGhost()}`
  }
  private renderCanvasItem(item: StudioItem, project: ScreenProject): TemplateResult {
    const box = itemBounds(item)
    const selected = item.id === this.selectedItemId
    return html`
      <div
        data-item-id=${item.id}
        class=${`selection ${selected ? 'selected' : ''} ${item.locked ? 'locked' : ''} ${item.hidden ? 'hidden' : ''}`}
        style=${styleMap({
          left: `${box.x / project.display.width * 100}%`,
          top: `${box.y / project.display.height * 100}%`,
          width: `${box.width / project.display.width * 100}%`,
          height: `${box.height / project.display.height * 100}%`,
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
    const project = this.current!
    const transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`
    const area = this.workingArea(project)
    return html`
      <main class="workspace">
        ${this.renderDashboardTabs()}
        <div class="workspace-meta">
          <span>${project.display.width} × ${project.display.height} px</span>
          <span>${project.items.length} layers</span>
          <span>Padding ${project.display.padding}px</span>
          <button class=${this.snapEnabled ? 'tool-toggle active' : 'tool-toggle'} aria-pressed=${this.snapEnabled} @click=${() => { this.snapEnabled = !this.snapEnabled }}>
            <ha-icon icon="mdi:magnet"></ha-icon><span>Snap ${project.display.snapSize}px</span>
          </button>
          <span class="zoom-readout">${Math.round(this.zoom * 100)}%</span>
        </div>
        <section class=${this.draggingCatalog ? 'canvas-stage accepting-drop' : 'canvas-stage'} @wheel=${this.onCanvasWheel} @dragover=${this.onCanvasDragOver} @drop=${this.onCanvasDrop}>
          <div class="canvas-viewport" style=${styleMap({ transform })}>
            <div class="canvas" style=${styleMap({ width: `${project.display.width}px`, height: `${project.display.height}px` })} @pointerdown=${() => this.selectItemId('')}>
              ${this.preview ? html`<img draggable="false" src=${this.preview.imageUrl} alt="Authoritative rendered display preview">` : html`<div class="canvas-placeholder">Rendering…</div>`}
              <div class="working-area" aria-hidden="true" style=${styleMap({ left: `${area.x / project.display.width * 100}%`, top: `${area.y / project.display.height * 100}%`, width: `${area.width / project.display.width * 100}%`, height: `${area.height / project.display.height * 100}%`, '--snap-size': `${project.display.snapSize * this.zoom}px` })}></div>
              ${project.items.map(item => this.renderCanvasItem(item, project))}
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
    const project = this.current!; const profile = profileById(project.display.profileId)
    return html`${this.renderInspectorHeader('Dashboard', 'Display and canvas settings', 'mdi:monitor')}<details class="inspector-section" open><summary>Display</summary><div class="section-body"><label class="stack-field">Display type<select .value=${project.display.profileId ?? 'custom'} @change=${(event: Event) => this.updateProfile((event.target as HTMLSelectElement).value)}>${DISPLAY_PROFILES.map(entry => html`<option value=${entry.id}>${entry.manufacturer} · ${entry.name}</option>`)}</select></label><div class="field-grid">${this.screenNumberField('Width', project.display.width, 'width', 64, 4096)}${this.screenNumberField('Height', project.display.height, 'height', 64, 4096)}</div><div class="field-grid"><label class="stack-field">Palette<select .value=${project.display.palette} @change=${(event: Event) => { const value = (event.target as HTMLSelectElement).value as PaletteId; this.mutate(current => { current.display.palette = value; if (!PALETTE_COLORS[value].includes(current.display.background)) current.display.background = 'white' }) }}>${(profile.id === 'custom' ? Object.keys(PALETTE_LABELS) as PaletteId[] : profile.palettes).map(palette => html`<option value=${palette}>${PALETTE_LABELS[palette]}</option>`)}</select></label><label class="stack-field">Background<select @change=${(event: Event) => { const value = (event.target as HTMLSelectElement).value; this.mutate(current => { current.display.background = value }) }}>${PALETTE_COLORS[project.display.palette].map(color => html`<option value=${color} ?selected=${color === project.display.background}>${color[0].toUpperCase()}${color.slice(1)}</option>`)}</select></label></div></div></details><details class="inspector-section" open><summary>Working area</summary><div class="section-body"><div class="field-grid">${this.screenNumberField('Outer padding', project.display.padding, 'padding', 0, 1024)}${this.screenNumberField('Snap size', project.display.snapSize, 'snapSize', 1, 256)}</div><p class="field-help">Padding defines the editable safe area. Snap aligns movement and resizing to pixel increments.</p></div></details><div class="danger-zone"><ha-button appearance="plain" @click=${this.deleteProject}><ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>Delete dashboard</ha-button></div>${this.renderMetrics()}`
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
    const copyLabel = this.yamlCopyState === 'copied' ? 'Copied' : this.yamlCopyState === 'failed' ? 'Copy failed' : 'Copy YAML'; const copyIcon = this.yamlCopyState === 'copied' ? 'mdi:check' : this.yamlCopyState === 'failed' ? 'mdi:alert-circle-outline' : 'mdi:content-copy'
    return html`${this.preview.warnings.map(warning => html`<ha-alert class="warning" alert-type="warning">${warning}</ha-alert>`)}<details class="inspector-section telemetry"><summary>Render diagnostics</summary><div class="section-body metrics"><span>Queue</span><strong>${this.preview.timings.queue.toFixed(1)} ms</strong><span>Data</span><strong>${this.preview.timings.data.toFixed(1)} ms</strong><span>Compile</span><strong>${this.preview.timings.compile.toFixed(1)} ms</strong><span>Render</span><strong>${this.preview.timings.render.toFixed(1)} ms</strong><span>Encode</span><strong>${this.preview.timings.encode.toFixed(1)} ms</strong><span>Total</span><strong>${this.preview.timings.pipeline.toFixed(1)} ms</strong></div></details><details class="inspector-section yaml"><summary>Generated ODL YAML</summary><div class="yaml-actions"><ha-button size="s" appearance="plain" aria-label="Copy generated ODL YAML" @click=${this.copyGeneratedYaml}><ha-icon slot="start" .icon=${copyIcon}></ha-icon>${copyLabel}</ha-button><output aria-live="polite">${this.yamlCopyState === 'copied' ? 'YAML copied to clipboard' : this.yamlCopyState === 'failed' ? 'Clipboard access failed' : ''}</output></div><pre>${this.preview.yaml}</pre></details>`
  }
  private renderInspector(): TemplateResult {
    if (this.rightCollapsed) return html`<aside class="panel panel-rail right-rail"><button class="icon-button" title="Expand inspector" aria-label="Expand inspector" @click=${() => { this.rightCollapsed = false }}><ha-icon icon="mdi:chevron-left"></ha-icon></button><span class="rail-label">Layers</span></aside>`
    const item = this.current?.items.find(candidate => candidate.id === this.selectedItemId)
    return html`<aside class="panel inspector"><div class="panel-resizer" role="separator" aria-orientation="vertical" aria-label="Resize inspector" @pointerdown=${this.startPanelResize}></div>${this.renderLayers()}<section class="properties">${item ? this.renderItemInspector(item) : this.renderScreenInspector()}</section></aside>${this.renderDeleteDialog()}`
  }

  protected render(): TemplateResult {
    if (this.loading) return html`<div class="project-empty"><p>Loading OpenDisplay Studio…</p></div>`
    if (!this.current) return html`<div class="project-empty"><section class="empty-card"><ha-icon icon="mdi:monitor-edit"></ha-icon><span class="eyebrow">OpenDisplay Studio</span><h1>Build your first dashboard</h1><p>Create an exact-size e-paper canvas and compose it from live widgets and ODL primitives.</p>${this.error ? html`<ha-alert alert-type="error">${this.error}</ha-alert>` : nothing}<ha-button appearance="filled" @click=${this.openNewDashboard}>Add dashboard</ha-button></section>${this.renderNewDashboardDialog()}</div>`
    const layoutStyle = styleMap({ '--toolbox-width': this.leftCollapsed ? '48px' : '255px', '--inspector-width': this.rightCollapsed ? '48px' : `${this.inspectorWidth}px` })
    return html`<div class="shell"><header class="topbar"><div class="brand"><strong>OpenDisplay Studio</strong><span>Layer-based ODL designer · v${this.integrationVersion}</span></div><input class="project-name" aria-label="Dashboard name" .value=${this.current.name} @input=${this.updateName}><span class="status ${this.current.status}">${this.current.status}</span><div class="actions"><ha-button appearance="plain" @click=${this.openNewDashboard}><ha-icon slot="start" icon="mdi:plus"></ha-icon>Add dashboard</ha-button><ha-button appearance="plain" @click=${this.toggleReady}>${this.current.status === 'ready' ? 'Set Draft' : 'Set Ready'}</ha-button><ha-button appearance="filled" .disabled=${!this.dirty || this.saving} @click=${this.saveProject}>${this.saving ? 'Saving…' : 'Save'}</ha-button></div></header>${this.error ? html`<ha-alert alert-type="error">${this.error}</ha-alert>` : nothing}<div class="layout" style=${layoutStyle}>${this.renderToolbox()}${this.renderCanvas()}${this.renderInspector()}</div>${this.renderNewDashboardDialog()}</div>`
  }
}

declare global { interface HTMLElementTagNameMap { 'opendisplay-studio-panel': OpenDisplayStudioPanel } }
