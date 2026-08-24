import { LitElement, html, nothing, type TemplateResult } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import {
  mdiCheck,
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
  createId,
  createRegions,
  gridForOrientation,
  mergeRegions,
  regionContainsCell,
  rotateRegions,
  splitRegion,
} from './services/layout'
import { createProject } from './services/storage'
import type {
  BootstrapResponse,
  CellCoordinate,
  GridRegion,
  HomeAssistant,
  Orientation,
  PaletteId,
  PersistedState,
  ScreenProject,
  WidgetDefinition,
  WidgetOption,
} from './types'
import { WIDGETS, getWidgetDefinition, widgetStyles } from './widgets/registry'
import { renderButtonIcon, renderIcon } from './widgets/shared'
import { sharedWidgetStyles } from './widgets/shared-styles'

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

  @query('.preview-boundary') private previewBoundary?: HTMLElement
  @query('.screen-fit') private screenFit?: HTMLElement
  @query('.screen-bezel') private screenBezel?: HTMLElement
  @query('#rename-dialog') private renameDialog?: HTMLDialogElement

  private toastTimer?: number
  private previewResizeObserver?: ResizeObserver
  private saveRevision = 0

  static styles = [appStyles, sharedWidgetStyles, ...widgetStyles]

  protected firstUpdated(): void {
    this.previewResizeObserver = new ResizeObserver(() => this.updatePreviewScale())
    if (this.previewBoundary) this.previewResizeObserver.observe(this.previewBoundary)
    this.updatePreviewScale()
    void this.loadProjects()
  }

  protected updated(): void {
    if (this.previewBoundary) this.previewResizeObserver?.observe(this.previewBoundary)
    this.updatePreviewScale()
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.previewResizeObserver?.disconnect()
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
    if (!local || !backend) return local
    return {
      ...local,
      version: backend.version,
      name: backend.name,
      description: backend.description,
      defaults: backend.defaults,
      options: backend.fields,
    }
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
    } catch (error) {
      this.loadError = error instanceof Error ? error.message : 'Unable to load projects'
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
      }
    } catch (error) {
      this.showToast(error instanceof Error ? error.message : 'Could not save project')
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
    if (updated) void this.saveProject(updated)
  }

  private updateLayoutDraft(updater: (project: ScreenProject) => ScreenProject): void {
    if (!this.layoutDraft) return
    this.layoutDraft = updater(this.layoutDraft)
  }

  private openLayoutEditor(): void {
    this.layoutDraft = structuredClone(this.project)
    this.editorMode = 'layout'
    this.selectedRegionId = ''
    this.mergeAnchor = undefined
    this.mergeHover = undefined
  }

  private cancelLayoutEditor(): void {
    this.layoutDraft = undefined
    this.editorMode = 'widgets'
    this.mergeAnchor = undefined
    this.mergeHover = undefined
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
  }

  private async addProject(): Promise<void> {
    const draft = createProject(`Untitled display ${this.store.projects.length + 1}`)
    try {
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
    } catch (error) {
      this.showToast(error instanceof Error ? error.message : 'Could not create display')
    }
  }

  private async duplicateProject(): Promise<void> {
    const draft = cloneProject(this.project)
    const response = await this.hass.callWS<{ project: ScreenProject }>({ type: 'opendisplay_studio/create_project', project: draft })
    const project = response.project
    this.persist({ ...this.store, activeProjectId: project.id, projects: [...this.store.projects, project] })
    this.selectedRegionId = ''
    this.showToast('Display duplicated')
  }

  private async deleteProject(): Promise<void> {
    await this.hass.callWS({ type: 'opendisplay_studio/delete_project', project_id: this.project.id })
    const projects = this.store.projects.filter((project) => project.id !== this.project.id)
    this.persist({ ...this.store, activeProjectId: projects[0]?.id ?? '', projects })
    this.selectedRegionId = ''
    this.layoutDraft = undefined
    this.editorMode = 'widgets'
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

  private renderProjectRail(): TemplateResult {
    return html`
      <aside class="project-rail" aria-label="Saved displays">
        <div class="rail-heading"><h2>Displays</h2><button class="text-button" @click=${this.addProject}>+ New</button></div>
        <div class="project-list">
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
        <div class="rail-footer">Stored by Home Assistant.<br />Ready displays become Media Sources.</div>
        <div class="rail-actions" aria-label="Project actions">
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
          <select id="device-model" .value=${project.displayId === 'custom' ? 'custom' : display.id} @change=${this.changeDisplay}>
            <optgroup label="SOLUM · Newton Pro">
              ${DISPLAY_PROFILES.filter((profile) => profile.family === 'Newton Pro').map((profile) => html`
                <option value=${profile.id}>${profile.name} · ${profile.nativeWidth}×${profile.nativeHeight}${profile.freezer ? ' · mono' : ''}</option>
              `)}
            </optgroup>
            <optgroup label="Seeed · ready to use">
              ${DISPLAY_PROFILES.filter((profile) => profile.family === 'OpenDisplay' && profile.manufacturer === 'Seeed Studio').map((profile) => html`
                <option value=${profile.id}>${profile.name} · ${profile.nativeWidth}×${profile.nativeHeight}</option>
              `)}
            </optgroup>
            <optgroup label="Other OpenDisplay hardware">
              ${DISPLAY_PROFILES.filter((profile) => profile.family === 'OpenDisplay' && profile.manufacturer !== 'Seeed Studio').map((profile) => html`
                <option value=${profile.id}>${profile.name} · ${profile.nativeWidth}×${profile.nativeHeight}</option>
              `)}
            </optgroup>
            <optgroup label="Custom hardware">
              <option value="custom">Custom resolution</option>
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
          <span>${pixels.width}×${pixels.height} · ${PALETTE_LABELS[this.project.palette]} · ${this.project.grid.columns}×${this.project.grid.rows} grid</span>
        </div>
        <ha-button size="s" appearance="outlined" @click=${this.openLayoutEditor}>${renderButtonIcon(mdiTuneVariant)} Edit device & layout</ha-button>
      </div>
    `
  }

  private renderScreenRegion(region: GridRegion): TemplateResult {
    const definition = region.widget ? this.widgetDefinition(region.widget.type) : undefined
    const compact = region.columnSpan === 1 || region.rowSpan === 1
    const layoutMode = this.editorMode === 'layout'
    const isComposed = Boolean(region.label) || region.rowSpan > 1 || region.columnSpan > 1
    const composedRegions = this.canvasProject.regions
      .filter((item) => item.label || item.rowSpan > 1 || item.columnSpan > 1)
      .sort((first, second) => first.row - second.row || first.column - second.column)
    const label = isComposed ? region.label ?? regionLabel(composedRegions.findIndex((item) => item.id === region.id)) : `${region.column}.${region.row}`
    return html`
      <section
        class="screen-region ${layoutMode ? 'layout-region' : region.widget ? '' : 'empty'} ${!layoutMode && region.id === this.selectedRegionId ? 'selected' : ''}"
        style=${styleMap({ gridColumn: `${region.column} / span ${region.columnSpan}`, gridRow: `${region.row} / span ${region.rowSpan}` })}
        aria-label=${layoutMode ? isComposed ? `Region ${label}` : `Grid cell ${label}` : definition ? `${definition.name} region` : 'Empty region'}
        @click=${() => { if (!layoutMode) this.selectedRegionId = region.id }}
        @dblclick=${() => { if (layoutMode) this.splitSelectedRegion(region.id) }}
      >
        ${layoutMode
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
    return html`
      <main class="canvas-area">
        <div class="canvas-stage">
          <div class="screen-meta"><span>${project.displayId === 'custom' ? 'CUSTOM DISPLAY' : `${display.manufacturer} · ${display.diagonal}″`}</span><code>${pixels.width} × ${pixels.height} px</code></div>
          <div class="preview-boundary">
            <div class="screen-fit">
              <div class="screen-bezel">
                <div
                  id="display-screen"
                  class="display-screen"
                  data-palette=${project.palette}
                  style=${styleMap({
                    '--grid-columns': String(project.grid.columns),
                    '--grid-rows': String(project.grid.rows),
                    width: `${pixels.width}px`,
                    height: `${pixels.height}px`,
                  })}
                >
                  ${project.regions.map((region) => this.renderScreenRegion(region))}
                  ${this.renderMergeLayer()}
                </div>
              </div>
            </div>
          </div>
          ${this.editorMode === 'layout'
            ? this.mergeAnchor
              ? html`<div class="merge-help"><strong>First corner selected.</strong> Move across the grid and click the opposite corner.</div>`
              : html`<div class="merge-help"><strong>Draw a region:</strong> Click two opposite corners. Double-click a region to remove it.</div>`
            : html`<div class="merge-help"><strong>Widget mode:</strong> Select a region to configure its content.</div>`}
        </div>
      </main>
    `
  }

  private renderOption(option: WidgetOption): TemplateResult {
    const value = this.selectedRegion?.widget?.config[option.key]
    if (option.type === 'entity' || option.type === 'entities' || option.type === 'calendar') {
      const selector = option.type === 'calendar'
        ? { entity: { domain: 'calendar' } }
        : { entity: option.type === 'entities' ? { multiple: true } : {} }
      return html`
        <ha-form
          .hass=${this.hass}
          .data=${{ [option.key]: value ?? '' }}
          .schema=${[{ name: option.key, label: option.label, required: option.required ?? false, selector }]}
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
              [option.key]: Array.isArray(value)
                ? value.map((item) => String(item))
                : String(value ?? ''),
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
    return html`
      <aside class="inspector">
        <div class="inspector-heading"><h2>Region settings</h2><span class="region-address">R${region.row}:C${region.column} · ${region.columnSpan}×${region.rowSpan}</span></div>
        <div class="widget-picker">
          ${WIDGETS.map((widget) => html`
            <button class="widget-choice ${definition?.id === widget.id ? 'active' : ''}" @click=${() => this.assignWidget(widget.id)}>
              ${renderIcon(widget.icon)}<strong>${widget.name}</strong><span>${widget.description}</span>
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
        <div class="workspace">
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
