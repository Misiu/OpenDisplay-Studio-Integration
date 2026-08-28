import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import {
  mdiCheck,
  mdiChevronLeft,
  mdiChevronRight,
  mdiContentCopy,
  mdiDeleteOutline,
  mdiPlus,
  mdiRenameOutline,
  mdiTuneVariant,
} from '@mdi/js'
import { appStyles } from './app-styles'
import {
  DISPLAY_PROFILES,
  PALETTE_LABELS,
  getDisplayProfile,
  getPixelSize,
} from './data/display-profiles'
import {
  BACKGROUND_ANCHORS,
  BACKGROUND_MODES,
  backgroundMediaForForm,
  clampBackgroundScale,
  createDisplayBackground,
} from './services/background'
import { projectForPreview } from './services/preview'
import {
  clampLayoutSpacing,
  createId,
  createRegions,
  gridForOrientation,
  isActiveRegion,
  layoutSpacing,
  mergeRegions,
  regionAppearance,
  regionContainsCell,
  rotateRegions,
  splitRegion,
} from './services/layout'
import { createProject } from './services/storage'
import type {
  BootstrapResponse,
  BackgroundAnchor,
  BackgroundMode,
  CellCoordinate,
  ComposePreviewResponse,
  DisplayTheme,
  FontFamily,
  GridRegion,
  HomeAssistant,
  MediaSelectorValue,
  Orientation,
  PaletteId,
  PersistedState,
  ScreenProject,
  TextScale,
  WidgetDefinition,
  WidgetConfigValue,
  WidgetOption,
} from './types'
import { getRuntimeWidgetDefinition, getWidgetDefinition, widgetStyles } from './widgets/registry'
import { renderButtonIcon, renderIcon } from './widgets/shared'
import { sharedWidgetStyles } from './widgets/shared-styles'

const errorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string' && error) return error
  if (error && typeof error === 'object') {
    const response = error as Record<string, unknown>
    if (typeof response.message === 'string' && response.message) return response.message
    if (typeof response.body === 'string' && response.body) return response.body
    if (typeof response.code === 'string' && response.code) return `${fallback} (${response.code})`
  }
  return fallback
}

const cloneProject = (project: ScreenProject): ScreenProject => {
  const now = new Date().toISOString()
  return {
    ...structuredClone(project),
    id: createId(),
    name: `${project.name} copy`,
    createdAt: now,
    updatedAt: now,
    regions: project.regions.map((region) => ({ ...structuredClone(region), id: createId() })),
  }
}

const regionLabel = (index: number): string => {
  let value = index + 1
  let label = ''
  while (value > 0) {
    value -= 1
    label = String.fromCharCode(65 + (value % 26)) + label
    value = Math.floor(value / 26)
  }
  return label
}

type EditorMode = 'layout' | 'widgets'

@customElement('opendisplay-studio-panel')
export class OdxApp extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant

  @state() private store: PersistedState = { schemaVersion: 1, activeProjectId: '', projects: [] }
  @state() private selectedRegionId = ''
  @state() private mergeAnchor?: CellCoordinate
  @state() private mergeHover?: CellCoordinate
  @state() private toastMessage = ''
  @state() private loading = true
  @state() private saving = false
  @state() private loadError = ''
  @state() private renameDraft = ''
  @state() private editorMode: EditorMode = 'widgets'
  @state() private layoutDraft?: ScreenProject
  @state() private widgetMetadata: BootstrapResponse['widgets'] = []
  @state() private previewImageUrl = ''
  @state() private previewLoading = false
  @state() private previewError = ''
  @state() private previewTimings?: ComposePreviewResponse['timings']
  @state() private projectRailCollapsed = false

  @query('.preview-boundary') private previewBoundary?: HTMLElement
  @query('.screen-fit') private screenFit?: HTMLElement
  @query('.screen-bezel') private screenBezel?: HTMLElement
  @query('#rename-dialog') private renameDialog?: HTMLDialogElement

  private toastTimer?: number
  private previewResizeObserver?: ResizeObserver
  private saveRevision = 0
  private previewRevision = 0
  private previewTimer?: number
  private entityStateSignature = ''

  static styles = [appStyles, sharedWidgetStyles, ...widgetStyles]

  protected firstUpdated(): void {
    this.previewResizeObserver = new ResizeObserver(() => this.updatePreviewScale())
    if (this.previewBoundary) this.previewResizeObserver.observe(this.previewBoundary)
    this.updatePreviewScale()
    void this.loadProjects()
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    if (this.previewBoundary) this.previewResizeObserver?.observe(this.previewBoundary)
    this.updatePreviewScale()
    if (changedProperties.has('hass')) {
      const signature = this.currentEntityStateSignature()
      if (signature !== this.entityStateSignature) {
        this.entityStateSignature = signature
        this.schedulePreview()
      }
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.previewResizeObserver?.disconnect()
    if (this.previewTimer) window.clearTimeout(this.previewTimer)
  }

  private get project(): ScreenProject {
    return this.store.projects.find((item) => item.id === this.store.activeProjectId) ?? this.store.projects[0]
  }

  private get canvasProject(): ScreenProject {
    return this.layoutDraft ?? this.project
  }

  private get canvasDisplay() {
    return getDisplayProfile(this.canvasProject.displayId)
  }

  private get canvasPixels(): { width: number; height: number } {
    return { width: this.canvasProject.width, height: this.canvasProject.height }
  }

  private displayName(project: ScreenProject): string {
    return project.displayId === 'custom' ? 'Custom display' : getDisplayProfile(project.displayId).name
  }

  private get selectedRegion(): GridRegion | undefined {
    return this.project.regions.find((region) => region.id === this.selectedRegionId)
  }

  private widgetDefinition(widgetId: string): WidgetDefinition | undefined {
    const local = getWidgetDefinition(widgetId)
    const backend = this.widgetMetadata.find((item) => item.id === widgetId)
    if (!backend) return local
    return getRuntimeWidgetDefinition(backend)
  }

  private updatePreviewScale(): void {
    if (!this.previewBoundary || !this.screenFit || !this.screenBezel) return
    const pixels = this.canvasPixels
    const frameWidth = pixels.width + 24
    const frameHeight = pixels.height + 24
    const scale = Math.max(0.05, Math.min(
      2,
      this.previewBoundary.clientWidth / frameWidth,
      this.previewBoundary.clientHeight / frameHeight,
    ))
    this.screenFit.style.width = `${frameWidth * scale}px`
    this.screenFit.style.height = `${frameHeight * scale}px`
    this.screenBezel.style.width = `${frameWidth}px`
    this.screenBezel.style.height = `${frameHeight}px`
    this.screenBezel.style.transform = `scale(${scale})`
  }

  private persist(store: PersistedState): void {
    this.store = store
  }

  private currentEntityStateSignature(): string {
    if (!this.store.projects.length) return ''
    return this.project.regions
      .flatMap((region) => {
        if (region.widget?.type === 'sensor') {
          return [String(region.widget.config.entity ?? '')]
        }
        if (region.widget?.type === 'weather') {
          return [String(region.widget.config.weather ?? '')]
        }
        return []
      })
      .filter(Boolean)
      .sort()
      .map((entityId) => {
        const state = this.hass.states?.[entityId]
        return `${entityId}:${state?.state ?? ''}:${state?.last_updated ?? ''}`
      })
      .join('|')
  }

  private schedulePreview(delay = 250): void {
    if (!this.store.projects.length) return
    if (this.previewTimer) window.clearTimeout(this.previewTimer)
    this.previewTimer = window.setTimeout(() => {
      this.previewTimer = undefined
      void this.composePreview(this.canvasProject)
    }, delay)
  }

  private async composePreview(project: ScreenProject): Promise<void> {
    const revision = ++this.previewRevision
    this.previewLoading = true
    this.previewError = ''
    try {
      const response = await this.hass.callWS<ComposePreviewResponse>({
        type: 'opendisplay_studio/compose_preview',
        project: projectForPreview(project, this.editorMode === 'layout'),
      })
      if (revision !== this.previewRevision) return
      this.previewImageUrl = response.imageUrl
      this.previewTimings = response.timings
    } catch (error) {
      if (revision !== this.previewRevision) return
      this.previewImageUrl = ''
      this.previewError = errorMessage(error, 'Could not compose live preview')
      if (this.previewError.startsWith('Renderer App is not connected')) {
        this.schedulePreview(1500)
      }
    } finally {
      if (revision === this.previewRevision) this.previewLoading = false
    }
  }

  private previewImageFailed(): void {
    this.previewImageUrl = ''
    this.previewError = 'Renderer preview image could not be loaded'
  }

  private async loadProjects(): Promise<void> {
    this.loading = true
    this.loadError = ''
    try {
      const response = await this.hass.callWS<BootstrapResponse>({ type: 'opendisplay_studio/bootstrap' })
      this.store = {
        schemaVersion: 1,
        activeProjectId: response.projects[0]?.id ?? '',
        projects: response.projects,
      }
      this.widgetMetadata = response.widgets
      this.schedulePreview(0)
    } catch (error) {
      this.loadError = errorMessage(error, 'Unable to load projects')
    } finally {
      this.loading = false
    }
  }

  private async saveProject(project: ScreenProject): Promise<void> {
    const revision = ++this.saveRevision
    this.saving = true
    try {
      const response = await this.hass.callWS<{ project: ScreenProject }>({
        type: 'opendisplay_studio/update_project',
        project_id: project.id,
        project,
      })
      if (revision === this.saveRevision) {
        this.store = {
          ...this.store,
          projects: this.store.projects.map((item) => item.id === response.project.id ? response.project : item),
        }
        this.schedulePreview()
      }
    } catch (error) {
      this.showToast(errorMessage(error, 'Could not save project'))
    } finally {
      if (revision === this.saveRevision) this.saving = false
    }
  }

  private updateProject(updater: (project: ScreenProject) => ScreenProject): void {
    const projects = this.store.projects.map((project) =>
      project.id === this.store.activeProjectId
        ? { ...updater(project), updatedAt: new Date().toISOString() }
        : project,
    )
    this.persist({ ...this.store, projects })
    const updated = projects.find((project) => project.id === this.store.activeProjectId)
    if (updated) {
      void this.saveProject(updated)
      this.schedulePreview()
    }
  }

  private updateLayoutDraft(updater: (project: ScreenProject) => ScreenProject): void {
    if (!this.layoutDraft) return
    this.layoutDraft = updater(this.layoutDraft)
    this.schedulePreview()
  }

  private openLayoutEditor(): void {
    this.layoutDraft = structuredClone(this.project)
    this.editorMode = 'layout'
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    this.previewImageUrl = ''
    this.schedulePreview(0)
  }

  private cancelLayoutEditor(): void {
    this.layoutDraft = undefined
    this.editorMode = 'widgets'
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    this.previewImageUrl = ''
    this.schedulePreview(0)
  }

  private applyLayoutEditor(): void {
    if (!this.layoutDraft) return
    const draft = this.layoutDraft
    this.updateProject(() => draft)
    this.layoutDraft = undefined
    this.editorMode = 'widgets'
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    this.selectedRegionId = ''
    this.showToast('Device and layout updated')
    this.schedulePreview(0)
  }

  private showToast(message: string): void {
    this.toastMessage = message
    if (this.toastTimer) window.clearTimeout(this.toastTimer)
    this.toastTimer = window.setTimeout(() => {
      this.toastMessage = ''
    }, 2600)
  }

  private selectProject(projectId: string): void {
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    this.layoutDraft = undefined
    this.editorMode = 'widgets'
    this.persist({ ...this.store, activeProjectId: projectId })
    this.previewImageUrl = ''
    this.schedulePreview(0)
  }

  private async addProject(): Promise<void> {
    try {
      const draft = createProject(
        `Untitled display ${this.store.projects.length + 1}`,
        this.hass.language,
      )
      const response = await this.hass.callWS<{ project: ScreenProject }>({
        type: 'opendisplay_studio/create_project',
        project: draft,
      })
      const project = response.project
      this.persist({ ...this.store, activeProjectId: project.id, projects: [...this.store.projects, project] })
      this.selectedRegionId = ''
      this.layoutDraft = structuredClone(project)
      this.editorMode = 'layout'
      this.showToast('Display created')
      this.schedulePreview(0)
    } catch (error) {
      this.showToast(errorMessage(error, 'Could not create display'))
    }
  }

  private async duplicateProject(): Promise<void> {
    const draft = cloneProject(this.project)
    const response = await this.hass.callWS<{ project: ScreenProject }>({ type: 'opendisplay_studio/create_project', project: draft })
    const project = response.project
    this.persist({ ...this.store, activeProjectId: project.id, projects: [...this.store.projects, project] })
    this.selectedRegionId = ''
    this.previewImageUrl = ''
    this.schedulePreview(0)
    this.showToast('Display duplicated')
  }

  private async deleteProject(): Promise<void> {
    await this.hass.callWS({ type: 'opendisplay_studio/delete_project', project_id: this.project.id })
    const projects = this.store.projects.filter((project) => project.id !== this.project.id)
    this.persist({ ...this.store, activeProjectId: projects[0]?.id ?? '', projects })
    this.selectedRegionId = ''
    this.layoutDraft = undefined
    this.editorMode = 'widgets'
    this.previewImageUrl = ''
    this.schedulePreview(0)
    this.showToast('Display deleted')
  }

  private setProjectStatus(status: 'draft' | 'ready'): void {
    this.updateProject((project) => ({ ...project, status }))
    this.showToast(status === 'ready' ? 'Media Source is ready' : 'Project moved to Draft')
  }

  private openRenameDialog(): void {
    this.renameDraft = this.project.name
    this.renameDialog?.showModal()
  }

  private saveProjectName(): void {
    const name = this.renameDraft.trim()
    if (!name) return
    this.updateProject((project) => ({ ...project, name }))
    this.renameDialog?.close()
    this.showToast('Name updated')
  }

  private applyDisplayProfile(displayId: string, driverId?: string): void {
    const profile = getDisplayProfile(displayId)
    const grid = gridForOrientation(profile, this.canvasProject.orientation)
    const sameGrid = grid.columns === this.canvasProject.grid.columns && grid.rows === this.canvasProject.grid.rows
    const widgets = this.canvasProject.regions.flatMap((region) => region.widget ? [region.widget] : [])
    const regions = sameGrid
      ? this.canvasProject.regions
      : createRegions(grid).map((region, index) => ({ ...region, widget: widgets[index] }))
    const pixels = getPixelSize(profile, this.canvasProject.orientation)

    this.updateLayoutDraft((project) => ({
      ...project,
      displayId,
      driverId,
      width: pixels.width,
      height: pixels.height,
      palette: profile.palettes.includes(project.palette) ? project.palette : profile.defaultPalette,
      grid,
      regions,
    }))
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    if (!sameGrid) this.showToast('Grid adapted to the selected display')
  }

  private changeDisplay(event: Event): void {
    const displayId = (event.currentTarget as HTMLSelectElement).value
    if (displayId === 'custom') {
      this.updateLayoutDraft((project) => ({ ...project, displayId: 'custom', driverId: undefined }))
      return
    }
    this.applyDisplayProfile(displayId)
  }

  private changePalette(event: Event): void {
    const palette = (event.currentTarget as HTMLSelectElement).value as PaletteId
    this.updateLayoutDraft((project) => ({ ...project, palette }))
  }

  private changeTheme(theme: DisplayTheme): void {
    this.updateLayoutDraft((project) => ({ ...project, theme }))
  }

  private changeFontFamily(event: Event): void {
    const fontFamily = (event.currentTarget as HTMLSelectElement).value as FontFamily
    this.updateLayoutDraft((project) => ({ ...project, fontFamily }))
  }

  private changeTextScale(event: Event): void {
    const textScale = (event.currentTarget as HTMLSelectElement).value as TextScale
    this.updateLayoutDraft((project) => ({ ...project, textScale }))
  }

  private changeBackgroundMedia(event: CustomEvent<{ value: { backgroundMedia?: MediaSelectorValue } }>): void {
    const media = event.detail.value.backgroundMedia
    this.updateLayoutDraft((project) => ({
      ...project,
      background: media?.media_content_id
        ? project.background
          ? { ...project.background, media }
          : createDisplayBackground(media)
        : undefined,
    }))
  }

  private clearBackground(): void {
    this.updateLayoutDraft((project) => ({ ...project, background: undefined }))
  }

  private changeBackgroundMode(mode: BackgroundMode): void {
    this.updateLayoutDraft((project) => project.background
      ? { ...project, background: { ...project.background, mode } }
      : project)
  }

  private changeBackgroundAnchor(anchor: BackgroundAnchor): void {
    this.updateLayoutDraft((project) => project.background
      ? { ...project, background: { ...project.background, anchor } }
      : project)
  }

  private changeBackgroundScale(event: Event): void {
    const scale = clampBackgroundScale(Number((event.currentTarget as HTMLInputElement).value))
    this.updateLayoutDraft((project) => project.background
      ? { ...project, background: { ...project.background, scale } }
      : project)
  }

  private changeLayoutSpacing(key: 'screenPadding' | 'regionGap', event: Event): void {
    const value = clampLayoutSpacing(Number((event.currentTarget as HTMLInputElement).value))
    this.updateLayoutDraft((project) => ({ ...project, [key]: value }))
  }

  private changeOrientation(orientation: Orientation): void {
    if (orientation === this.canvasProject.orientation) return
    const grid = this.canvasProject.displayId === 'custom'
      ? { columns: this.canvasProject.grid.rows, rows: this.canvasProject.grid.columns }
      : gridForOrientation(this.canvasDisplay, orientation)
    const direction = orientation === 'portrait' ? 'clockwise' : 'counterclockwise'
    const regions = rotateRegions(this.canvasProject.regions, this.canvasProject.grid, grid, direction)
    const pixels = this.canvasProject.displayId === 'custom'
      ? { width: this.canvasProject.height, height: this.canvasProject.width }
      : getPixelSize(this.canvasDisplay, orientation)
    this.updateLayoutDraft((project) => ({ ...project, orientation, grid, regions, ...pixels }))
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
  }

  private changeCustomSize(key: 'width' | 'height', event: Event): void {
    const value = Math.max(64, Math.min(4096, Number((event.currentTarget as HTMLInputElement).value)))
    this.updateLayoutDraft((project) => ({ ...project, [key]: value }))
  }

  private changeGrid(key: 'columns' | 'rows', event: Event): void {
    const value = Math.max(1, Math.min(24, Number((event.currentTarget as HTMLInputElement).value)))
    const grid = { ...this.canvasProject.grid, [key]: value }
    const widgets = this.canvasProject.regions.flatMap((region) => region.widget ? [region.widget] : [])
    const regions = createRegions(grid).map((region, index) => ({ ...region, widget: widgets[index] }))
    this.updateLayoutDraft((project) => ({ ...project, grid, regions }))
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
  }

  private selectionContainsComposedRegion(first: CellCoordinate, second: CellCoordinate): boolean {
    const rowStart = Math.min(first.row, second.row)
    const rowEnd = Math.max(first.row, second.row)
    const columnStart = Math.min(first.column, second.column)
    const columnEnd = Math.max(first.column, second.column)
    return this.canvasProject.regions.some((region) => {
      if (region.rowSpan === 1 && region.columnSpan === 1 && !region.label) return false
      const regionRowEnd = region.row + region.rowSpan - 1
      const regionColumnEnd = region.column + region.columnSpan - 1
      return region.row <= rowEnd && regionRowEnd >= rowStart && region.column <= columnEnd && regionColumnEnd >= columnStart
    })
  }

  private selectMergeCell(cell: CellCoordinate): void {
    const occupyingRegion = this.canvasProject.regions.find((region) => regionContainsCell(region, cell))
    if (occupyingRegion && (occupyingRegion.label || occupyingRegion.rowSpan > 1 || occupyingRegion.columnSpan > 1)) return

    if (!this.mergeAnchor) {
      this.mergeAnchor = cell
      this.mergeHover = cell
      return
    }
    if (this.selectionContainsComposedRegion(this.mergeAnchor, cell)) {
      this.mergeAnchor = undefined
      this.mergeHover = undefined
      this.showToast('Remove the existing region before drawing across it')
      return
    }
    const regions = mergeRegions(this.canvasProject.regions, this.mergeAnchor, cell)
    if (!regions) {
      this.mergeAnchor = undefined
      this.mergeHover = undefined
      this.showToast('The selected rectangle crosses an existing merged region')
      return
    }
    const previousIds = new Set(this.canvasProject.regions.map((region) => region.id))
    const mergedRegion = regions.find((region) => !previousIds.has(region.id))
    const existingComposedRegions = this.canvasProject.regions
      .filter((region) => region.label || region.rowSpan > 1 || region.columnSpan > 1)
      .sort((first, second) => first.row - second.row || first.column - second.column)
    const usedLabels = new Set(existingComposedRegions.map((region, index) => region.label ?? regionLabel(index)))
    let labelIndex = 0
    while (usedLabels.has(regionLabel(labelIndex))) labelIndex += 1
    const label = regionLabel(labelIndex)
    const labeledRegions = regions.map((region) => region.id === mergedRegion?.id ? { ...region, label } : region)
    this.updateLayoutDraft((project) => ({ ...project, regions: labeledRegions }))
    this.selectedRegionId = mergedRegion?.id ?? ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    this.showToast(`Region ${label} created`)
  }

  private splitSelectedRegion(regionId: string): void {
    const region = this.canvasProject.regions.find((item) => item.id === regionId)
    if (!region || (region.rowSpan === 1 && region.columnSpan === 1 && !region.label)) return
    this.updateLayoutDraft((project) => ({ ...project, regions: splitRegion(project.regions, regionId) }))
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
    this.showToast('Region removed')
  }

  private assignWidget(widgetId: string): void {
    const definition = this.widgetDefinition(widgetId)
    if (!definition || !this.selectedRegion) return
    this.updateProject((project) => ({
      ...project,
      regions: project.regions.map((region) =>
        region.id === this.selectedRegionId
          ? { ...region, widget: { type: definition.id, version: definition.version, config: { ...definition.defaults } } }
          : region,
      ),
    }))
  }

  private removeWidget(): void {
    this.updateProject((project) => ({
      ...project,
      regions: project.regions.map((region) =>
        region.id === this.selectedRegionId ? { ...region, widget: undefined } : region,
      ),
    }))
  }

  private updateWidgetOption(option: WidgetOption, event: Event): void {
    const input = event.currentTarget as HTMLInputElement | HTMLSelectElement
    const value = option.type === 'toggle'
      ? (input as HTMLInputElement).checked
      : option.type === 'number'
        ? Number(input.value)
        : input.value
    this.updateProject((project) => ({
      ...project,
      regions: project.regions.map((region) => {
        if (region.id !== this.selectedRegionId || !region.widget) return region
        return { ...region, widget: { ...region.widget, config: { ...region.widget.config, [option.key]: value } } }
      }),
    }))
  }

  private updateRegionAppearance(key: 'showBackground' | 'showBorder', event: Event): void {
    const value = (event.currentTarget as HTMLInputElement).checked
    this.updateProject((project) => ({ ...project, regions: project.regions.map((region) =>
      region.id === this.selectedRegionId
        ? { ...region, appearance: { ...regionAppearance(region), [key]: value } }
        : region) }))
  }

  private renderProjectRail(): TemplateResult {
    return html`
      <aside id="project-library" class="project-rail ${this.projectRailCollapsed ? 'collapsed' : ''}" aria-label="Saved displays">
        <div class="rail-heading">
          ${this.projectRailCollapsed ? nothing : html`<h2>Displays</h2>`}
          <div class="rail-heading-actions">
            ${this.projectRailCollapsed ? nothing : html`<button class="text-button" @click=${this.addProject}>+ New</button>`}
            <button
              class="rail-toggle"
              aria-controls="project-library"
              aria-expanded=${!this.projectRailCollapsed}
              aria-label=${this.projectRailCollapsed ? 'Expand displays panel' : 'Collapse displays panel'}
              title=${this.projectRailCollapsed ? 'Expand displays panel' : 'Collapse displays panel'}
              @click=${() => { this.projectRailCollapsed = !this.projectRailCollapsed }}
            >${renderIcon(this.projectRailCollapsed ? mdiChevronRight : mdiChevronLeft)}</button>
          </div>
        </div>
        <div class="project-list" ?hidden=${this.projectRailCollapsed}>
          ${this.store.projects.map((project) => {
            const size = { width: project.width, height: project.height }
            return html`
              <button class="project-card ${project.id === this.project.id ? 'active' : ''}" @click=${() => this.selectProject(project.id)}>
                <span class="mini-screen" style=${styleMap({ '--mini-aspect': String(size.width / size.height) })}>${project.grid.columns}×${project.grid.rows}</span>
                <span class="project-card-copy"><strong>${project.name}</strong><span>${this.displayName(project)} · ${project.status === 'ready' ? 'Ready' : 'Draft'}</span>${project.status === 'ready' ? html`<code>media-source://opendisplay_studio/${project.id}</code>` : nothing}</span>
              </button>
            `
          })}
        </div>
        <div class="rail-footer" ?hidden=${this.projectRailCollapsed}>Stored by Home Assistant.<br />Ready displays become Media Sources.</div>
        <div class="rail-actions" aria-label="Project actions" ?hidden=${this.projectRailCollapsed}>
          <button class="rail-action danger" @click=${this.deleteProject}>${renderIcon(mdiDeleteOutline)} Delete</button>
        </div>
      </aside>
    `
  }

  private renderToolbar(): TemplateResult {
    const project = this.canvasProject
    const display = this.canvasDisplay
    return html`
      <div class="device-toolbar layout-toolbar">
        <div class="control grow">
          <label for="device-model">Device model</label>
          <select id="device-model" @change=${this.changeDisplay}>
            <optgroup label="SOLUM · Newton Pro">
              ${DISPLAY_PROFILES.filter((profile) => profile.family === 'Newton Pro').map((profile) => html`
                <option value=${profile.id} .selected=${profile.id === display.id}>${profile.name} · ${profile.nativeWidth}×${profile.nativeHeight}${profile.freezer ? ' · mono' : ''}</option>
              `)}
            </optgroup>
            <optgroup label="Seeed · ready to use">
              ${DISPLAY_PROFILES.filter((profile) => profile.family === 'OpenDisplay' && profile.manufacturer === 'Seeed Studio').map((profile) => html`
                <option value=${profile.id} .selected=${profile.id === display.id}>${profile.name} · ${profile.nativeWidth}×${profile.nativeHeight}</option>
              `)}
            </optgroup>
            <optgroup label="Other OpenDisplay hardware">
              ${DISPLAY_PROFILES.filter((profile) => profile.family === 'OpenDisplay' && profile.manufacturer !== 'Seeed Studio').map((profile) => html`
                <option value=${profile.id} .selected=${profile.id === display.id}>${profile.name} · ${profile.nativeWidth}×${profile.nativeHeight}</option>
              `)}
            </optgroup>
            <optgroup label="Custom hardware">
              <option value="custom" .selected=${project.displayId === 'custom'}>Custom resolution</option>
            </optgroup>
          </select>
        </div>
        ${project.displayId === 'custom' ? html`
          <div class="control custom-control">
            <label for="custom-width">Width</label>
            <input id="custom-width" type="number" min="64" max="4096" .value=${String(project.width)} @change=${(event: Event) => this.changeCustomSize('width', event)} />
          </div>
          <div class="control custom-control">
            <label for="custom-height">Height</label>
            <input id="custom-height" type="number" min="64" max="4096" .value=${String(project.height)} @change=${(event: Event) => this.changeCustomSize('height', event)} />
          </div>
        ` : nothing}
        <div class="control">
          <label for="palette">Palette</label>
          <select id="palette" .value=${project.palette} @change=${this.changePalette}>
            ${(project.displayId === 'custom' ? Object.keys(PALETTE_LABELS) as PaletteId[] : display.palettes).map((palette) => html`<option value=${palette}>${PALETTE_LABELS[palette]}</option>`)}
          </select>
        </div>
        <div class="control">
          <span class="field-label">Theme</span>
          <div class="segment" role="group" aria-label="Display theme">
            <button class=${project.theme === 'light' ? 'active' : ''} @click=${() => this.changeTheme('light')}>Light</button>
            <button class=${project.theme === 'dark' ? 'active' : ''} @click=${() => this.changeTheme('dark')}>Dark</button>
          </div>
        </div>
        <div class="control">
          <label for="font-family">Font family</label>
          <select id="font-family" .value=${project.fontFamily} @change=${this.changeFontFamily}>
            <option value="default">Default</option>
            <option value="classic">Classic</option>
            <option value="trmnl">TRMNL</option>
          </select>
        </div>
        <div class="control">
          <label for="text-scale">Text scale</label>
          <select id="text-scale" .value=${project.textScale} @change=${this.changeTextScale}>
            <option value="small">Small</option>
            <option value="regular">Regular</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra large</option>
          </select>
        </div>
        <div class="control">
          <span class="field-label">Orientation</span>
          <div class="segment" role="group" aria-label="Display orientation">
            <button class=${project.orientation === 'landscape' ? 'active' : ''} @click=${() => this.changeOrientation('landscape')}>Landscape</button>
            <button class=${project.orientation === 'portrait' ? 'active' : ''} @click=${() => this.changeOrientation('portrait')}>Portrait</button>
          </div>
        </div>
        <div class="control"><label for="grid-columns">Columns</label><input id="grid-columns" type="number" min="1" max="24" .value=${String(project.grid.columns)} @change=${(event: Event) => this.changeGrid('columns', event)} /></div>
        <div class="control"><label for="grid-rows">Rows</label><input id="grid-rows" type="number" min="1" max="24" .value=${String(project.grid.rows)} @change=${(event: Event) => this.changeGrid('rows', event)} /></div>
      </div>
    `
  }

  private renderWidgetToolbar(): TemplateResult {
    const pixels = { width: this.project.width, height: this.project.height }
    return html`
      <div class="device-toolbar widget-toolbar">
        <div class="device-summary">
          <span class="step-kicker">Step 2 · Widgets</span>
          <strong>${this.displayName(this.project)}</strong>
          <span>${pixels.width}×${pixels.height} · ${PALETTE_LABELS[this.project.palette]} · ${this.project.theme} · ${this.project.fontFamily}/${this.project.textScale} · ${this.project.grid.columns}×${this.project.grid.rows} grid</span>
        </div>
        <ha-button size="s" appearance="outlined" @click=${this.openLayoutEditor}>${renderButtonIcon(mdiTuneVariant)} Edit device & layout</ha-button>
      </div>
    `
  }

  private renderScreenRegion(region: GridRegion): TemplateResult {
    const definition = region.widget ? this.widgetDefinition(region.widget.type) : undefined
    const compact = region.columnSpan === 1 || region.rowSpan === 1
    const layoutMode = this.editorMode === 'layout'
    const livePreview = !layoutMode && Boolean(this.previewImageUrl || this.previewError)
    const isComposed = Boolean(region.label) || region.rowSpan > 1 || region.columnSpan > 1
    const composedRegions = this.canvasProject.regions
      .filter((item) => item.label || item.rowSpan > 1 || item.columnSpan > 1)
      .sort((first, second) => first.row - second.row || first.column - second.column)
    const label = isComposed ? region.label ?? regionLabel(composedRegions.findIndex((item) => item.id === region.id)) : `${region.column}.${region.row}`
    const appearance = regionAppearance(region)
    return html`
      <section
        class="screen-region ${layoutMode ? 'layout-region' : region.widget ? '' : 'empty'} ${appearance.showBackground ? 'region-background' : ''} ${appearance.showBorder ? 'region-border' : ''} ${livePreview ? 'preview-region' : ''} ${!layoutMode && region.id === this.selectedRegionId ? 'selected' : ''}"
        style=${styleMap({ gridColumn: `${region.column} / span ${region.columnSpan}`, gridRow: `${region.row} / span ${region.rowSpan}` })}
        aria-label=${layoutMode ? isComposed ? `Region ${label}` : `Grid cell ${label}` : definition ? `${definition.name} region` : 'Empty region'}
        aria-pressed=${layoutMode ? nothing : String(region.id === this.selectedRegionId)}
        role=${layoutMode ? nothing : 'button'}
        tabindex=${layoutMode ? nothing : 0}
        @click=${() => { if (!layoutMode) this.selectedRegionId = region.id }}
        @keydown=${(event: KeyboardEvent) => {
          if (layoutMode || (event.key !== 'Enter' && event.key !== ' ')) return
          event.preventDefault()
          this.selectedRegionId = region.id
        }}
        @dblclick=${() => { if (layoutMode) this.splitSelectedRegion(region.id) }}
      >
        ${livePreview
          ? nothing
          : layoutMode
          ? isComposed
            ? html`<div class="layout-region-copy composed"><strong>${label}</strong><span>${region.columnSpan}×${region.rowSpan} region</span></div>`
            : nothing
          : definition && region.widget
            ? definition.render(region.widget.config, { compact, palette: this.project.palette })
            : html`<div class="empty-region-copy"><strong>Add widget</strong><span>${region.columnSpan}×${region.rowSpan} region</span></div>`}
      </section>
    `
  }

  private renderMergeLayer(): TemplateResult {
    if (this.editorMode !== 'layout') return html``
    const cells = Array.from({ length: this.canvasProject.grid.columns * this.canvasProject.grid.rows }, (_, index) => ({
      row: Math.floor(index / this.canvasProject.grid.columns) + 1,
      column: (index % this.canvasProject.grid.columns) + 1,
    }))
    const selectionEnd = this.mergeHover ?? this.mergeAnchor
    const selectionInvalid = Boolean(this.mergeAnchor && selectionEnd && this.selectionContainsComposedRegion(this.mergeAnchor, selectionEnd))
    return html`
      <div class="merge-layer active" aria-label="Region composition grid" @pointerleave=${() => { this.mergeHover = undefined }}>
        ${cells.map((cell) => {
          const occupyingRegion = this.canvasProject.regions.find((region) => regionContainsCell(region, cell))
          const occupied = Boolean(occupyingRegion && (occupyingRegion.label || occupyingRegion.rowSpan > 1 || occupyingRegion.columnSpan > 1))
          const inSelection = Boolean(this.mergeAnchor && selectionEnd &&
            cell.row >= Math.min(this.mergeAnchor.row, selectionEnd.row) &&
            cell.row <= Math.max(this.mergeAnchor.row, selectionEnd.row) &&
            cell.column >= Math.min(this.mergeAnchor.column, selectionEnd.column) &&
            cell.column <= Math.max(this.mergeAnchor.column, selectionEnd.column))
          return html`
            <button
              class="merge-cell ${occupied ? 'occupied' : ''} ${inSelection ? 'preview' : ''} ${selectionInvalid && inSelection ? 'invalid' : ''} ${this.mergeAnchor?.row === cell.row && this.mergeAnchor?.column === cell.column ? 'anchor' : ''}"
              aria-label=${occupied ? `Existing region at column ${cell.column}, row ${cell.row}; double-click to remove` : `Grid cell column ${cell.column}, row ${cell.row}`}
              @pointerenter=${() => { if (this.mergeAnchor) this.mergeHover = cell }}
              @click=${() => this.selectMergeCell(cell)}
              @dblclick=${(event: MouseEvent) => {
                event.preventDefault()
                event.stopPropagation()
                if (occupied && occupyingRegion) this.splitSelectedRegion(occupyingRegion.id)
              }}
            >${occupied ? nothing : `${cell.column}.${cell.row}`}</button>
          `
        })}
      </div>
    `
  }

  private renderCanvas(): TemplateResult {
    const project = this.canvasProject
    const display = this.canvasDisplay
    const pixels = { width: project.width, height: project.height }
    const exactPreview = Boolean(this.previewImageUrl || this.previewError)
    const spacing = layoutSpacing(project)
    const visibleRegions = this.editorMode === 'layout' ? project.regions : project.regions.filter(isActiveRegion)
    return html`
      <main class="canvas-area">
        <div class="canvas-stage">
          <div class="screen-meta"><span>${project.displayId === 'custom' ? 'CUSTOM DISPLAY' : `${display.manufacturer} · ${display.diagonal}″`}</span><code>${pixels.width} × ${pixels.height} px</code></div>
          <div class="preview-boundary">
            <div class="screen-fit">
              <div class="screen-bezel">
                <div
                  id="display-screen"
                  class="display-screen ${exactPreview ? 'live-preview' : ''}"
                  data-palette=${project.palette}
                  style=${styleMap({
                    '--grid-columns': String(project.grid.columns),
                    '--grid-rows': String(project.grid.rows),
                    '--preview-padding': `${spacing.screenPadding}px`,
                    '--preview-gap': `${spacing.regionGap}px`,
                    '--layout-padding': `${spacing.screenPadding}px`,
                    '--layout-gap': `${spacing.regionGap}px`,
                    width: `${pixels.width}px`,
                    height: `${pixels.height}px`,
                  })}
                >
                  ${exactPreview
                    ? html`
                      ${this.previewImageUrl
                        ? html`<img class="rendered-preview" alt="Live Home Assistant data preview" src=${this.previewImageUrl} @error=${this.previewImageFailed} />`
                        : html`<ha-alert class="preview-failure" alert-type="error" .title=${'Exact preview unavailable'}>${this.previewError}</ha-alert>`}
                      <div
                        class="preview-overlay"
                        style=${styleMap({
                          '--grid-columns': String(project.grid.columns),
                          '--grid-rows': String(project.grid.rows),
                        })}
                      >${visibleRegions.map((region) => this.renderScreenRegion(region))}</div>
                      ${this.renderMergeLayer()}
                    `
                    : html`
                      ${visibleRegions.map((region) => this.renderScreenRegion(region))}
                      ${this.renderMergeLayer()}
                    `}
                </div>
              </div>
            </div>
          </div>
          ${this.editorMode === 'layout'
            ? this.mergeAnchor
              ? html`<div class="merge-help"><strong>First corner selected.</strong> Move across the grid and click the opposite corner.</div>`
              : html`<div class="merge-help"><strong>Draw a region:</strong> Click two opposite corners. Double-click a region to remove it.</div>`
            : html`<div class="merge-help"><strong>Live preview:</strong> ${this.previewError
              ? this.previewError
              : this.previewLoading
                ? 'Refreshing current Home Assistant data…'
                : this.previewTimings
                  ? `Exact Renderer preview in ${this.previewTimings.pipeline.toFixed(1)} ms (${this.previewTimings.renderer.toFixed(1)} ms render). Select a region to configure it.`
                  : 'Select a region to configure its content.'}</div>`}
        </div>
      </main>
    `
  }

  private renderOption(option: WidgetOption): TemplateResult {
    const widget = this.selectedRegion?.widget
    const value = widget?.config[option.key]
      ?? (widget ? this.widgetDefinition(widget.type)?.defaults[option.key] : undefined)
    const selector = option.selector
      ?? (option.type === 'calendar'
        ? { entity: { filter: { domain: 'calendar' } } }
        : option.type === 'entities'
          ? { entity: { multiple: true } }
          : option.type === 'entity'
            ? { entity: {} }
            : undefined)
    if (selector) {
      return html`
        <ha-form
          .hass=${this.hass}
          .data=${{ [option.key]: value ?? '' }}
          .schema=${[{ name: option.key, label: option.label, required: option.required ?? false, selector }]}
          .computeLabel=${() => option.label}
          @value-changed=${(event: CustomEvent<{ value: Record<string, unknown> }>) => this.updateWidgetValue(option, event.detail.value[option.key])}
        ></ha-form>
      `
    }
    if (option.type === 'toggle') return html`
      <div class="toggle-field"><label for=${`option-${option.key}`}>${option.label}</label><input id=${`option-${option.key}`} class="toggle" type="checkbox" .checked=${Boolean(value)} @change=${(event: Event) => this.updateWidgetOption(option, event)} /></div>
    `
    if (option.type === 'select') return html`
      <div class="field">
        <label class="field-label" for=${`option-${option.key}`}>${option.label}</label>
        <select id=${`option-${option.key}`} .value=${String(value ?? '')} @change=${(event: Event) => this.updateWidgetOption(option, event)}>
          ${option.options?.map((item) => html`<option value=${item.value}>${item.label}</option>`)}
        </select>
      </div>
    `
    if (option.type === 'text' && option.multiline) return html`
      <div class="field">
        <label class="field-label" for=${`option-${option.key}`}>${option.label}</label>
        <textarea id=${`option-${option.key}`} rows="4" .value=${String(value ?? '')} @change=${(event: Event) => this.updateWidgetOption(option, event)}></textarea>
      </div>
    `
    return html`
      <div class="field">
        <label class="field-label" for=${`option-${option.key}`}>${option.label}</label>
        <input id=${`option-${option.key}`} type=${option.type} .value=${String(value ?? '')} min=${option.min ?? nothing} max=${option.max ?? nothing} step=${option.step ?? nothing} @change=${(event: Event) => this.updateWidgetOption(option, event)} />
      </div>
    `
  }

  private updateWidgetValue(option: WidgetOption, value: unknown): void {
    const normalizedValue: WidgetConfigValue = Array.isArray(value)
      ? value.map((item) => String(item))
      : typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
        ? value
        : String(value ?? '')
    this.updateProject((project) => ({
      ...project,
      regions: project.regions.map((region) => {
        if (region.id !== this.selectedRegionId || !region.widget) return region
        return {
          ...region,
          widget: {
            ...region.widget,
            config: {
              ...region.widget.config,
              [option.key]: normalizedValue,
            },
          },
        }
      }),
    }))
  }

  private renderInspector(): TemplateResult {
    const region = this.selectedRegion
    if (!region) return html`
      <aside class="inspector"><div class="inspector-heading"><h2>Region settings</h2></div><div class="inspector-empty"><div><strong>Select a region</strong><p>Choose a region on the display to assign a widget and configure its data.</p></div></div></aside>
    `
    const definition = region.widget ? this.widgetDefinition(region.widget.type) : undefined
    const appearance = regionAppearance(region)
    return html`
      <aside class="inspector">
        <div class="inspector-heading"><h2>Region settings</h2><span class="region-address">R${region.row}:C${region.column} · ${region.columnSpan}×${region.rowSpan}</span></div>
        <section class="region-appearance" aria-labelledby="region-appearance-heading">
          <div class="region-appearance-heading"><h3 id="region-appearance-heading">Appearance</h3><p>Applied to this region only.</p></div>
          <div class="toggle-field"><label for="region-show-background">Show background</label><input id="region-show-background" class="toggle" type="checkbox" .checked=${appearance.showBackground} @change=${(event: Event) => this.updateRegionAppearance('showBackground', event)} /></div>
          <div class="toggle-field"><label for="region-show-border">Show border</label><input id="region-show-border" class="toggle" type="checkbox" .checked=${appearance.showBorder} @change=${(event: Event) => this.updateRegionAppearance('showBorder', event)} /></div>
        </section>
        <div class="widget-picker">
          ${this.widgetMetadata.map((widget) => html`
            <button class="widget-choice ${definition?.id === widget.id ? 'active' : ''}" @click=${() => this.assignWidget(widget.id)}>
              ${getWidgetDefinition(widget.id)
                ? renderIcon(getWidgetDefinition(widget.id)!.icon)
                : html`<ha-icon .icon=${widget.icon}></ha-icon>`}
              <strong>${widget.name}</strong><span>${widget.description}</span>
            </button>
          `)}
        </div>
        ${definition
          ? html`<div class="option-form">${definition.options.map((option) => this.renderOption(option))}</div><div class="danger-zone"><ha-button size="s" variant="danger" appearance="outlined" @click=${this.removeWidget}>${renderButtonIcon(mdiDeleteOutline)} Remove widget</ha-button></div>`
          : html`<div class="inspector-empty"><div><strong>Choose a widget</strong><p>Each widget brings its own data source and configuration fields.</p></div></div>`}
      </aside>
    `
  }

  private renderLayoutGuide(): TemplateResult {
    const project = this.canvasProject
    const pixels = { width: project.width, height: project.height }
    return html`
      <aside class="inspector layout-guide">
        <span class="step-kicker">Step 1 · Device & layout</span>
        <h2>Prepare the canvas</h2>
        <p>Choose the hardware and palette, then compose regions before assigning widgets.</p>
        <dl class="device-facts">
          <div><dt>Device</dt><dd>${this.displayName(project)}</dd></div>
          <div><dt>Output</dt><dd>${pixels.width} × ${pixels.height} px</dd></div>
          <div><dt>Grid</dt><dd>${project.grid.columns} × ${project.grid.rows}</dd></div>
          <div><dt>Regions</dt><dd>${project.regions.length}</dd></div>
        </dl>
        <section class="layout-section" aria-labelledby="background-heading">
          <div class="layout-section-heading">
            <div><h3 id="background-heading">Display background</h3><p>Choose an image stored in Home Assistant Media.</p></div>
            ${project.background
              ? html`<ha-button size="s" appearance="plain" @click=${this.clearBackground}>Remove</ha-button>`
              : nothing}
          </div>
          <ha-form class="background-media-form"
            .hass=${this.hass}
            .data=${{ backgroundMedia: project.background ? backgroundMediaForForm(project.background.media) : undefined }}
            .schema=${[{
              name: 'backgroundMedia',
              label: 'Background image',
              selector: { media: { accept: ['image/*'], hide_content_type: true } },
            }]}
            .computeLabel=${() => 'Background image'}
            .computeHelper=${() => 'Home Assistant Media images only'}
            @value-changed=${this.changeBackgroundMedia}
          ></ha-form>
          ${project.background
            ? html`
              <div class="background-settings">
                <fieldset class="background-fieldset">
                  <legend>Image fit</legend>
                  <div class="background-mode-grid">
                    ${BACKGROUND_MODES.map((item) => html`
                      <button
                        class=${project.background?.mode === item.value ? 'active' : ''}
                        aria-pressed=${project.background?.mode === item.value}
                        @click=${() => this.changeBackgroundMode(item.value)}
                      >${item.label}</button>
                    `)}
                  </div>
                </fieldset>
                <fieldset class="background-fieldset" ?disabled=${project.background.mode === 'stretch'}>
                  <legend>Position</legend>
                  <div class="background-anchor-grid">
                    ${BACKGROUND_ANCHORS.map((item) => html`
                      <button
                        class=${project.background?.anchor === item.value ? 'active' : ''}
                        aria-label=${item.label}
                        title=${item.label}
                        aria-pressed=${project.background?.anchor === item.value}
                        ?disabled=${project.background?.mode === 'stretch'}
                        @click=${() => this.changeBackgroundAnchor(item.value)}
                      ><span></span></button>
                    `)}
                  </div>
                </fieldset>
                ${project.background.mode === 'manual'
                  ? html`
                    <div class="field background-scale">
                      <label class="field-label" for="background-scale">Scale of original image (%)</label>
                      <input
                        id="background-scale"
                        type="number"
                        min="1"
                        max="400"
                        step="1"
                        .value=${String(project.background.scale)}
                        @change=${this.changeBackgroundScale}
                      />
                      <p>100% uses the image's natural pixel size. An 800 × 800 image at 50% renders as 400 × 400 px.</p>
                    </div>
                  `
                  : nothing}
              </div>
            `
            : html`<p class="background-empty">No background image. The display uses its selected theme canvas.</p>`}
        </section>
        <section class="layout-section" aria-labelledby="spacing-heading">
          <div class="layout-section-heading"><div><h3 id="spacing-heading">Region spacing</h3><p>Set spacing in native output pixels.</p></div></div>
          <div class="spacing-grid">
            <div class="field"><label class="field-label" for="screen-padding">Screen padding (px)</label><input id="screen-padding" type="number" min="0" max="128" step="1" .value=${String(layoutSpacing(project).screenPadding)} @change=${(event: Event) => this.changeLayoutSpacing('screenPadding', event)} /><p>Inset from the display edge.</p></div>
            <div class="field"><label class="field-label" for="region-gap">Region gap (px)</label><input id="region-gap" type="number" min="0" max="128" step="1" .value=${String(layoutSpacing(project).regionGap)} @change=${(event: Event) => this.changeLayoutSpacing('regionGap', event)} /><p>Gutter between regions.</p></div>
          </div>
        </section>
        <ha-form
          .hass=${this.hass}
          .data=${{ language: project.language === 'system' ? this.hass.language : project.language }}
          .schema=${[{
            name: 'language',
            label: 'Display language',
            required: true,
            selector: { language: { native_name: true } },
          }]}
          .computeLabel=${() => 'Display language'}
          @value-changed=${(event: CustomEvent<{ value: { language?: string } }>) => {
            const language = event.detail.value.language
            if (language) this.updateLayoutDraft((draft) => ({ ...draft, language }))
          }}
        ></ha-form>
        <p>The selected language is used by live preview, Media Source, and the physical display.</p>
        <ol class="layout-instructions">
          <li>Click the first corner of a new region.</li>
          <li>Move across the grid and click the opposite corner.</li>
          <li>Double-click an existing region to remove it.</li>
        </ol>
      </aside>
    `
  }

  private renderRenameDialog(): TemplateResult {
    return html`
      <dialog id="rename-dialog"><div class="dialog-body">
        <h2>Rename display</h2><p>Use a name that describes where this display will be installed.</p>
        <div class="field"><label class="field-label" for="display-name">Display name</label><input id="display-name" type="text" .value=${this.renameDraft} @input=${(event: Event) => { this.renameDraft = (event.currentTarget as HTMLInputElement).value }} @keydown=${(event: KeyboardEvent) => { if (event.key === 'Enter') this.saveProjectName() }} /></div>
        <div class="dialog-actions"><ha-button appearance="outlined" @click=${() => this.renameDialog?.close()}>Cancel</ha-button><ha-button variant="brand" @click=${this.saveProjectName}>Save name</ha-button></div>
      </div></dialog>
    `
  }

  private renderWelcome(): TemplateResult {
    return html`
      <div class="app-shell welcome-shell">
        <header class="topbar welcome-topbar">
          <div class="brand"><span class="brand-mark">ODX</span><span class="brand-copy"><strong>OpenDisplay Studio</strong><span>Proof of Concept</span></span></div>
          <span class="welcome-topline">Device-accurate e-paper composition</span>
          <ha-button size="s" variant="brand" @click=${this.addProject}>${renderButtonIcon(mdiPlus)} New display</ha-button>
        </header>
        <div class="workspace welcome-workspace">
          <aside class="project-rail empty-rail" aria-label="Saved displays">
            <div class="rail-heading"><h2>Displays</h2><button class="text-button" @click=${this.addProject}>+ New</button></div>
            <div class="empty-library"><span class="empty-library-count">0</span><strong>No displays yet</strong><p>Your saved screens will appear here.</p></div>
            <div class="rail-footer">Stored securely by Home Assistant.</div>
          </aside>
          <main class="welcome-main">
            <section class="welcome-copy">
              <span class="step-kicker">Start with the hardware</span>
              <h1>Design an e-paper screen that fits the device.</h1>
              <p>Choose a verified display, compose its native-pixel layout, then add widgets and export the exact screen as PNG or JPG.</p>
              <div class="welcome-actions">
                <ha-button size="l" variant="brand" @click=${this.addProject}>${renderButtonIcon(mdiPlus)} Create your first display</ha-button>
              </div>
              <dl class="welcome-facts">
                <div><dt>1</dt><dd><strong>Select hardware</strong><span>Model, palette and orientation</span></dd></div>
                <div><dt>2</dt><dd><strong>Compose regions</strong><span>Device-aware native grid</span></dd></div>
                <div><dt>3</dt><dd><strong>Add widgets</strong><span>Preview and export one surface</span></dd></div>
              </dl>
            </section>
            <div class="welcome-visual" aria-hidden="true">
              <div class="welcome-device-meta"><span>OPEN DISPLAY</span><code>800 × 480</code></div>
              <div class="welcome-device">
                <div class="welcome-screen">
                  <div class="welcome-region welcome-region-a"><span>A</span><i></i><i></i></div>
                  <div class="welcome-region welcome-region-b"><span>B</span><b>21°</b><small>HOME</small></div>
                  <div class="welcome-region welcome-region-c"><span>C</span><em></em><em></em><em></em></div>
                </div>
              </div>
              <div class="welcome-palette"><i></i><i></i><i></i><i></i><i></i><i></i><span>SPECTRA 6</span></div>
            </div>
          </main>
        </div>
      </div>
      ${this.toastMessage ? html`<div class="toast" role="status">${this.toastMessage}</div>` : nothing}
    `
  }

  render(): TemplateResult {
    if (this.loading) return html`<div class="loading-state"><ha-circular-progress active></ha-circular-progress><p>Loading OpenDisplay Studio…</p></div>`
    if (this.loadError) return html`<div class="loading-state"><ha-alert alert-type="error">${this.loadError}</ha-alert><ha-button @click=${this.loadProjects}>Retry</ha-button></div>`
    if (this.store.projects.length === 0) return this.renderWelcome()
    return html`
      <div class="app-shell">
        <header class="topbar">
          <div class="brand"><span class="brand-mark">ODX</span><span class="brand-copy"><strong>OpenDisplay Studio</strong><span>Proof of Concept</span></span></div>
          <div class="project-context">
            <div class="project-title"><strong>${this.project.name}</strong><span class="autosave-state">${this.editorMode === 'layout' ? 'Changes not applied' : this.saving ? 'Saving…' : 'Saved in Home Assistant'}</span></div>
            <div class="workflow" aria-label="Editor workflow">
              <span class=${this.editorMode === 'layout' ? 'active' : 'complete'}><b>1</b> Device & layout</span>
              <i aria-hidden="true"></i>
              <span class=${this.editorMode === 'widgets' ? 'active' : ''}><b>2</b> Widgets</span>
            </div>
          </div>
          <div class="top-actions">
            ${this.editorMode === 'layout'
              ? html`<ha-button size="s" appearance="plain" @click=${this.cancelLayoutEditor}>Cancel</ha-button><ha-button size="s" variant="brand" appearance="filled" @click=${this.applyLayoutEditor}>${renderButtonIcon(mdiCheck)} Apply layout</ha-button>`
              : html`
                  <ha-button class="secondary-action" size="s" appearance="outlined" @click=${this.openRenameDialog}>${renderButtonIcon(mdiRenameOutline)} Rename</ha-button>
                  <ha-button class="secondary-action" size="s" appearance="outlined" @click=${this.duplicateProject}>${renderButtonIcon(mdiContentCopy)} Duplicate</ha-button>
                  <ha-button size="s" variant=${this.project.status === 'ready' ? 'neutral' : 'brand'} @click=${() => this.setProjectStatus(this.project.status === 'ready' ? 'draft' : 'ready')}>${this.project.status === 'ready' ? 'Move to Draft' : 'Mark Ready'}</ha-button>
                `}
          </div>
        </header>
        <div class="workspace ${this.projectRailCollapsed ? 'rail-collapsed' : ''}">
          ${this.renderProjectRail()}
          <section class="editor">${this.editorMode === 'layout' ? this.renderToolbar() : this.renderWidgetToolbar()}${this.renderCanvas()}</section>
          ${this.editorMode === 'layout' ? this.renderLayoutGuide() : this.renderInspector()}
        </div>
      </div>
      ${this.renderRenameDialog()}
      ${this.toastMessage ? html`<div class="toast" role="status">${this.toastMessage}</div>` : nothing}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'opendisplay-studio-panel': OdxApp
  }
}
