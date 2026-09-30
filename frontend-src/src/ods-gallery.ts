import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import type { ContextMenuEntry } from './ods-context-menu'
import { dashboardAccent, dashboardDate, dashboardFormData, dashboardFormLabel, dashboardFormSchema, dashboardIsValid, listDashboards, type DashboardFormData, type DashboardSort } from './dashboards'
import { PALETTE_COLORS, PALETTE_LABELS } from './display-profiles'
import { emit, type DashboardAction, type DashboardDialog, type OdsEvent } from './events'
import { baseStyles, chromeStyles } from './studio-styles'
import type { Dashboard, HomeAssistant } from './types'
import './ods-context-menu'

const MENU: Array<ContextMenuEntry & { id: DashboardAction }> = [
  { id: 'rename', label: 'Rename', icon: 'mdi:pencil-outline' },
  { id: 'duplicate', label: 'Duplicate', icon: 'mdi:content-copy' },
  { id: 'settings', label: 'Display Settings', icon: 'mdi:monitor-cog' },
  { id: 'delete', label: 'Delete', icon: 'mdi:delete-outline', danger: true },
]

/** The dashboard library: search, sort, cards, the per-card menu and the settings/delete dialogs. */
@customElement('ods-gallery')
export class OdsGallery extends LitElement {
  static styles = [baseStyles, chromeStyles, css`
    :host { display: contents; }
    .dashboard-library { height: 100%; overflow: auto; padding: clamp(22px, 4vw, 48px); background: var(--primary-background-color, #f5f7f8); }
    .dashboard-library-header, .dashboard-library-tools, .dashboard-grid, .dashboard-library > ha-alert { width: min(1180px, 100%); margin-inline: auto; }
    .dashboard-library-header { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 24px; }
    .dashboard-library-header h1 { margin: 0; font-size: 25px; letter-spacing: -.025em; }
    .dashboard-library-header p { margin: 5px 0 0; color: var(--studio-muted); font-size: 12px; }
    .dashboard-new-button-label { display: inline-flex; align-items: center; justify-content: center; gap: 7px; line-height: 1; }
    .dashboard-new-button-label ha-icon { width: 17px; height: 17px; line-height: 1; --mdc-icon-size: 17px; }
    .dashboard-library-tools { display: grid; grid-template-columns: minmax(220px, 1fr) auto; gap: 10px; margin-bottom: 18px; }
    .dashboard-search, .dashboard-sort { min-height: 40px; display: flex; align-items: center; gap: 8px; padding: 0 12px; border: 1px solid var(--studio-border); border-radius: 10px; background: var(--studio-surface); }
    .dashboard-search ha-icon { width: 17px; color: var(--studio-muted); }
    .dashboard-search input { width: 100%; border: 0; outline: 0; background: transparent; }
    .dashboard-sort span { color: var(--studio-muted); font-size: 11px; }
    .dashboard-sort select { min-width: 130px; border: 0; outline: 0; background: transparent; font-size: 12px; }
    .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; align-items: stretch; }
    .dashboard-card, .dashboard-add-card { min-width: 0; min-height: 236px; padding: 0; border: 1px solid var(--studio-border); border-radius: 13px; text-align: start; background: var(--studio-surface); box-shadow: 0 1px 3px rgba(0,0,0,.06); }
    .dashboard-card { position: relative; display: grid; grid-template-rows: 150px auto; }
    .dashboard-card.menu-open { z-index: 20; }
    .dashboard-card:hover, .dashboard-card:focus-within, .dashboard-add-card:hover, .dashboard-add-card:focus-visible { border-color: color-mix(in srgb, var(--studio-accent) 55%, var(--studio-border)); box-shadow: 0 8px 24px rgba(0,0,0,.09); outline: 0; transform: translateY(-1px); }
    .dashboard-card-open { position: absolute; inset: 0; z-index: 1; padding: 0; border: 0; border-radius: inherit; background: transparent; }
    .dashboard-card-open:focus-visible { outline: 2px solid var(--studio-accent); outline-offset: 2px; }
    .dashboard-card-preview { position: relative; display: grid; place-items: center; overflow: hidden; padding: 23px; border-radius: 12px 12px 0 0; background: color-mix(in srgb, var(--primary-background-color, #f5f7f8) 70%, var(--studio-surface)); pointer-events: none; }
    .dashboard-miniature { position: relative; width: min(145px, 70%); max-height: 96px; overflow: hidden; border: 2px solid color-mix(in srgb, var(--dashboard-accent) 22%, var(--studio-border)); border-radius: 9px; box-shadow: 0 7px 18px rgba(0,0,0,.12); }
    .dashboard-miniature > span { position: absolute; display: block; border-radius: 99px; }
    .miniature-title { left: 12%; top: 25%; width: 25%; height: 4%; min-height: 3px; background: color-mix(in srgb, var(--studio-muted) 50%, transparent); }
    .miniature-accent { right: 12%; top: 25%; width: 5px; height: 5px; background: var(--dashboard-accent); }
    .miniature-line { left: 12%; bottom: 26%; width: 48%; height: 4%; min-height: 3px; background: color-mix(in srgb, var(--studio-muted) 28%, transparent); }
    .miniature-line.long { bottom: 39%; width: 72%; height: 13%; background: color-mix(in srgb, var(--dashboard-accent) 18%, var(--studio-surface)); }
    .dashboard-resolution { position: absolute; right: 11px; bottom: 8px; color: var(--studio-muted); font: 9px var(--code-font-family, monospace); }
    .dashboard-card-copy { min-width: 0; display: grid; align-content: start; gap: 7px; padding: 13px 15px 15px; border-radius: 0 0 12px 12px; pointer-events: none; }
    .dashboard-card-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .dashboard-card-title strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
    .dashboard-card-title .status { flex: none; padding: 3px 7px; font-size: 8px; }
    .dashboard-rename-input { position: relative; z-index: 7; min-width: 0; width: 100%; height: 28px; padding: 0 7px; border: 1px solid var(--studio-accent); border-radius: 6px; outline: 0; background: var(--secondary-background-color, #f3f5f6); font-size: 13px; font-weight: 700; pointer-events: auto; }
    .dashboard-card-meta { display: flex; align-items: center; gap: 7px; color: var(--studio-muted); font-size: 10px; }
    .dashboard-card-meta > span + span::before { content: '·'; margin-right: 7px; }
    .dashboard-card-copy small { color: var(--studio-muted); font-size: 10px; }
    .palette-dots { display: inline-flex; align-items: center; gap: 2px; }
    .palette-dots i { width: 8px; height: 8px; border: 1px solid color-mix(in srgb, var(--studio-text) 22%, transparent); border-radius: 50%; }
    .dashboard-menu-trigger { position: absolute; inset-block-start: 9px; inset-inline-end: 9px; z-index: 5; width: 32px; height: 32px; display: grid; place-items: center; padding: 0; border: 0; border-radius: 8px; color: var(--studio-muted); background: color-mix(in srgb, var(--studio-surface) 90%, transparent); box-shadow: 0 1px 3px rgba(0,0,0,.08); opacity: 0; pointer-events: none; transition: opacity 120ms ease, color 120ms ease, background 120ms ease; }
    .dashboard-menu-trigger:hover, .dashboard-menu-trigger:focus-visible { color: var(--studio-text); background: var(--studio-surface); outline: 0; }
    .dashboard-card:hover .dashboard-menu-trigger, .dashboard-card:focus-within .dashboard-menu-trigger, .dashboard-card.menu-open .dashboard-menu-trigger { opacity: 1; pointer-events: auto; }
    .dashboard-menu-trigger ha-icon { width: 17px; height: 17px; --mdc-icon-size: 17px; }
    .dashboard-menu { position: absolute; inset-block-start: 45px; inset-inline-end: 9px; z-index: 8; }
    .dashboard-add-card { display: grid; place-items: center; align-content: center; gap: 10px; border-style: dashed; color: var(--studio-muted); box-shadow: none; }
    .dashboard-add-card ha-icon { width: 38px; height: 38px; display: grid; place-items: center; padding: 9px; border-radius: 10px; color: var(--studio-accent); background: var(--studio-accent-soft); line-height: 1; --mdc-icon-size: 20px; }
    .dashboard-add-card strong { color: var(--studio-text); font-size: 13px; }
    .dashboard-no-results { min-height: 236px; display: grid; place-items: center; align-content: center; gap: 8px; color: var(--studio-muted); text-align: center; }
    .dashboard-no-results ha-icon { width: 30px; height: 30px; }
    .dashboard-no-results strong { color: var(--studio-text); }
    .dashboard-no-results span { font-size: 12px; }
    .dashboard-settings-content { padding: 18px 22px 22px; }
    .dashboard-delete-content { padding: 8px 22px 22px; color: var(--studio-muted); font-size: 13px; line-height: 1.5; }
    .dashboard-delete-content p { margin: 0; }
    .dashboard-delete-content p + p { margin-top: 8px; }
    .dashboard-delete-content strong { color: var(--studio-text); }
    @media (hover: none) { .dashboard-menu-trigger { opacity: 1; pointer-events: auto; } }
    @media (max-width: 600px) {
      .dashboard-library { padding: 18px 12px; }
      .dashboard-library-header { align-items: flex-start; }
      .dashboard-library-tools { grid-template-columns: 1fr; }
      .dashboard-sort { justify-content: space-between; }
      .dashboard-grid { grid-template-columns: 1fr; }
    }
  `]

  @property({ attribute: false }) public dashboards: Dashboard[] = []
  @property({ attribute: false }) public hass?: HomeAssistant
  @property() public error = ''
  @property({ type: Boolean }) public saving = false
  /** The open dialog, if any; the owner keeps it so it can close it once a save succeeds. */
  @property() public dialog?: DashboardDialog
  @property({ attribute: false }) public draft?: Dashboard

  @state() private searchText = ''
  @state() private sort: DashboardSort = 'updated'
  @state() private menuDashboardId = ''
  @query('.dashboard-rename-input') private renameInput?: HTMLInputElement

  private get language(): string { return this.hass?.language || 'en' }

  connectedCallback(): void {
    super.connectedCallback()
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('pointerdown', this.onOutsidePointerDown)
  }
  disconnectedCallback(): void {
    super.disconnectedCallback()
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('pointerdown', this.onOutsidePointerDown)
  }
  protected updated(changed: PropertyValues<this>): void {
    if (changed.has('dialog') && this.dialog === 'rename') { this.renameInput?.focus(); this.renameInput?.select() }
  }

  private onOutsidePointerDown = (event: PointerEvent): void => {
    if (!this.menuDashboardId) return
    const insideMenu = event.composedPath().some(node => node instanceof HTMLElement && (node.classList.contains('dashboard-menu') || node.classList.contains('dashboard-menu-trigger')))
    if (!insideMenu) this.menuDashboardId = ''
  }
  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return
    if (this.menuDashboardId) { this.menuDashboardId = ''; event.stopPropagation() }
    else if (this.dialog) { emit(this, 'dashboard-dialog-close'); event.stopPropagation() }
  }

  private toggleMenu(event: Event, dashboardId: string): void {
    event.stopPropagation()
    this.menuDashboardId = this.menuDashboardId === dashboardId ? '' : dashboardId
  }
  private selectMenu(dashboard: Dashboard, event: OdsEvent<'menu-select'>): void {
    const entry = MENU.find(candidate => candidate.id === event.detail.id)
    if (!entry) return
    this.menuDashboardId = ''
    emit(this, 'dashboard-menu-action', { dashboard, action: entry.id })
  }
  private onRenameKeyDown(event: KeyboardEvent): void {
    event.stopPropagation()
    if (event.key === 'Enter') { event.preventDefault(); emit(this, 'dashboard-rename-commit') }
    else if (event.key === 'Escape') { event.preventDefault(); emit(this, 'dashboard-rename-cancel') }
  }
  private settingsChanged(event: CustomEvent<{ value: Partial<DashboardFormData> }>): void {
    emit(this, 'dashboard-settings-change', { value: event.detail.value })
  }

  private renderCard(dashboard: Dashboard): TemplateResult {
    const colors = PALETTE_COLORS[dashboard.display.palette]
    const menuOpen = this.menuDashboardId === dashboard.id
    const renaming = this.dialog === 'rename' && this.draft?.id === dashboard.id
    const menuId = `dashboard-menu-${dashboard.id}`
    return html`
      <article class=${`dashboard-card${menuOpen ? ' menu-open' : ''}`} data-dashboard-id=${dashboard.id}>
        <div class="dashboard-card-preview">
          <div class="dashboard-miniature" style=${styleMap({ aspectRatio: `${dashboard.display.width} / ${dashboard.display.height}`, background: dashboard.display.background, '--dashboard-accent': dashboardAccent(dashboard.display.palette) })}>
            <span class="miniature-title"></span>
            <span class="miniature-accent"></span>
            <span class="miniature-line long"></span>
            <span class="miniature-line"></span>
          </div>
          <span class="dashboard-resolution">${dashboard.display.width} × ${dashboard.display.height}</span>
        </div>
        <div class="dashboard-card-copy">
          <span class="dashboard-card-title">
            ${renaming ? html`<input class="dashboard-rename-input" aria-label=${`Rename dashboard ${dashboard.name}`} .value=${this.draft?.name ?? dashboard.name} @input=${(event: Event) => emit(this, 'dashboard-rename-input', { name: (event.target as HTMLInputElement).value })} @keydown=${this.onRenameKeyDown} @blur=${() => emit(this, 'dashboard-rename-commit')}>` : html`<strong>${dashboard.name}</strong>`}
            <span class=${`status ${dashboard.status}`}>${dashboard.status}</span>
          </span>
          <span class="dashboard-card-meta">
            <span>${dashboard.display.width} × ${dashboard.display.height}</span>
            <span class="palette-dots" aria-label=${PALETTE_LABELS[dashboard.display.palette]}>${colors.map(color => html`<i style=${styleMap({ background: color })}></i>`)}</span>
            <span>${PALETTE_LABELS[dashboard.display.palette]}</span>
          </span>
          <small>Updated ${dashboardDate(dashboard, this.language)}</small>
        </div>
        <button class="dashboard-card-open" aria-label=${`Open dashboard ${dashboard.name}`} @click=${() => emit(this, 'dashboard-open', { dashboard })}></button>
        <button class="dashboard-menu-trigger" aria-label=${`Dashboard actions for ${dashboard.name}`} aria-haspopup="menu" aria-controls=${menuId} aria-expanded=${menuOpen} @click=${(event: Event) => this.toggleMenu(event, dashboard.id)}><ha-icon icon="mdi:dots-horizontal"></ha-icon></button>
        ${menuOpen ? html`<ods-context-menu class="dashboard-menu" id=${menuId} label=${`Actions for ${dashboard.name}`} .entries=${MENU} @menu-select=${(event: OdsEvent<'menu-select'>) => this.selectMenu(dashboard, event)}></ods-context-menu>` : nothing}
      </article>
    `
  }

  private renderDialog(): TemplateResult | typeof nothing {
    const dashboard = this.draft
    if (!dashboard || !this.dialog || this.dialog === 'rename') return nothing
    if (this.dialog === 'delete') return html`
      <ha-dialog .open=${true} width="small" header-title="Delete dashboard?" @closed=${() => emit(this, 'dashboard-dialog-close')}>
        <div class="dashboard-delete-content">
          <p><strong>${dashboard.name}</strong> and all of its elements will be permanently removed.</p>
          <p>This action cannot be undone.</p>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${() => emit(this, 'dashboard-dialog-close')}>Cancel</ha-button>
          <ha-button slot="primaryAction" variant="danger" appearance="filled" .disabled=${this.saving} @click=${() => emit(this, 'dashboard-delete-confirm')}>${this.saving ? 'Deleting…' : 'Delete dashboard'}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `
    return html`
      <ha-dialog .open=${true} width="medium" header-title="Display settings" header-subtitle=${dashboard.name} @closed=${() => emit(this, 'dashboard-dialog-close')}>
        <div class="dashboard-settings-content">
          <ha-form autofocus .hass=${this.hass} .data=${dashboardFormData(dashboard)} .schema=${dashboardFormSchema()} .computeLabel=${dashboardFormLabel} @value-changed=${this.settingsChanged}></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${() => emit(this, 'dashboard-dialog-close')}>Cancel</ha-button>
          <ha-button slot="primaryAction" appearance="filled" .disabled=${this.saving || !dashboardIsValid(dashboard)} @click=${() => emit(this, 'dashboard-settings-save')}>${this.saving ? 'Saving…' : 'Save changes'}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `
  }

  protected render(): TemplateResult {
    const dashboards = listDashboards(this.dashboards, this.searchText, this.sort, this.language)
    return html`
      <main class="dashboard-library">
        <header class="dashboard-library-header">
          <div><h1>Dashboards</h1><p>${this.dashboards.length} ${this.dashboards.length === 1 ? 'dashboard' : 'dashboards'}</p></div>
          <ha-button class="dashboard-new-button" appearance="filled" aria-label="New dashboard" @click=${() => emit(this, 'dashboard-new')}><span class="dashboard-new-button-label"><ha-icon icon="mdi:plus"></ha-icon><span>New dashboard</span></span></ha-button>
        </header>
        ${this.error ? html`<ha-alert alert-type="error">${this.error}</ha-alert>` : nothing}
        <section class="dashboard-library-tools" aria-label="Dashboard filters">
          <label class="dashboard-search"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" aria-label="Search dashboards" placeholder="Search dashboards…" .value=${this.searchText} @input=${(event: Event) => { this.searchText = (event.target as HTMLInputElement).value }}></label>
          <label class="dashboard-sort"><span>Sort</span><select aria-label="Sort dashboards" .value=${this.sort} @change=${(event: Event) => { this.sort = (event.target as HTMLSelectElement).value === 'name' ? 'name' : 'updated' }}><option value="updated">Last updated</option><option value="name">Name A–Z</option></select></label>
        </section>
        <section class="dashboard-grid" aria-label="Saved dashboards">
          <button class="dashboard-add-card" aria-label="Add dashboard" @click=${() => emit(this, 'dashboard-new')}><ha-icon icon="mdi:plus"></ha-icon><strong>New dashboard</strong></button>
          ${dashboards.map(dashboard => this.renderCard(dashboard))}
          ${!dashboards.length ? html`<div class="dashboard-no-results"><ha-icon icon="mdi:magnify"></ha-icon><strong>No dashboards found</strong><span>Try a different search.</span></div>` : nothing}
        </section>
      </main>
      ${this.renderDialog()}
    `
  }
}

declare global { interface HTMLElementTagNameMap { 'ods-gallery': OdsGallery } }
