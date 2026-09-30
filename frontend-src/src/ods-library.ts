import { css, html, LitElement, nothing, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { filterCatalog } from './catalog'
import { emit } from './events'
import { trackPointerGesture } from './pointer-gesture'
import { baseStyles, chromeStyles } from './studio-styles'
import type { PrimitiveDefinition, WidgetDefinition } from './types'

interface CatalogEntry { id: string; name: string; description: string; icon: string }
interface DragGhost { value: string; icon: string; name: string; x: number; y: number; width: number; height: number }

const DRAG_THRESHOLD = 4

/** The element catalog: search, click to add, drag onto the canvas. Collapses to a rail. */
@customElement('ods-library')
export class OdsLibrary extends LitElement {
  static styles = [baseStyles, chromeStyles, css`
    :host { display: contents; }
    .panel { position: relative; min-width: 0; min-height: 0; background: var(--studio-surface); }
    .toolbox { border-right: 1px solid var(--studio-border); display: flex; flex-direction: column; overflow: hidden; }
    .panel-title { min-height: 58px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 11px 12px; }
    .panel-title h2 { margin: 1px 0 0; font-size: 15px; }
    .search { margin: 0 10px 10px 9px; min-height: 30px; display: flex; align-items: center; gap: 7px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 8px; background: var(--secondary-background-color, #f3f5f6); }
    .search ha-icon { width: 17px; }
    .search input { width: 100%; border: 0; outline: 0; background: transparent; font-size: 13px; }
    .catalog-scroll { flex: 1; min-height: 0; overflow: auto; padding: 0 9px 16px; }
    .catalog-section { margin-top: 8px; }
    .catalog-section > header { display: flex; justify-content: space-between; align-items: center; padding: 7px 2px; color: var(--studio-muted); font: 700 10px var(--code-font-family, monospace); letter-spacing: .11em; text-transform: uppercase; }
    .catalog-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
    .catalog-item { min-height: 34px; display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 8px; align-items: center; padding: 0 10px; text-align: start; border: 1px solid var(--studio-border); border-radius: 8px; background: var(--studio-surface); cursor: grab; touch-action: none; user-select: none; }
    .catalog-item:hover { border-color: var(--studio-accent); background: var(--studio-accent-soft); transform: translateY(-1px); }
    .catalog-item:active { cursor: grabbing; }
    .catalog-item ha-icon { width: 16px; height: 16px; color: var(--studio-accent); --mdc-icon-size: 16px; }
    .catalog-item strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; line-height: 1.2; }
    .catalog-item small { display: none; }
    .empty-result { grid-column: 1 / -1; margin: 10px 2px; color: var(--studio-muted); font-size: 12px; line-height: 1.45; }
    .panel-rail { border-right: 1px solid var(--studio-border); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 12px; padding: 10px 6px; }
    .rail-label { writing-mode: vertical-rl; color: var(--studio-muted); font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .catalog-drag-ghost { position: fixed; z-index: 1200; box-sizing: border-box; display: grid; grid-template-columns: 16px minmax(0, 1fr) 14px; align-items: center; gap: 5px; min-height: 34px; padding: 0 7px; border: 1px solid var(--studio-accent); border-radius: 8px; color: var(--primary-text-color, #182026); background: var(--studio-surface); box-shadow: 0 7px 18px rgba(0,0,0,.22); font-size: 11px; font-weight: 700; pointer-events: none; }
    .catalog-drag-ghost ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }
    .catalog-drag-ghost .drag-type-icon, .catalog-drag-ghost .drag-add-icon { color: var(--studio-accent); }
    @media (max-width: 900px) { .toolbox, .panel-rail { display: none; } }
  `]

  @property({ attribute: false }) public widgets: WidgetDefinition[] = []
  @property({ attribute: false }) public primitives: PrimitiveDefinition[] = []
  @property({ type: Boolean }) public collapsed = false

  @state() private searchText = ''
  @state() private ghost?: DragGhost
  private suppressClick = false
  private stopGesture?: () => void

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.stopGesture?.()
  }

  /** The panel host: the ghost is `position: fixed` inside it, so its coordinates are relative to it. */
  private panelOrigin(): DOMRect {
    const root = this.getRootNode()
    return (root instanceof ShadowRoot ? root.host : this).getBoundingClientRect()
  }

  private startDrag(event: PointerEvent, value: string, entry: CatalogEntry): void {
    if (event.button !== 0) return
    event.preventDefault()
    const source = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const grabX = event.clientX - source.left; const grabY = event.clientY - source.top
    this.stopGesture = trackPointerGesture({
      origin: event,
      threshold: DRAG_THRESHOLD,
      onActivate: () => emit(this, 'catalog-drag', { active: true }),
      onMove: move => {
        move.preventDefault()
        const origin = this.panelOrigin()
        this.ghost = { value, icon: entry.icon, name: entry.name, x: move.clientX - origin.left - grabX, y: move.clientY - origin.top - grabY, width: source.width, height: source.height }
      },
      onEnd: (end, activated) => {
        this.ghost = undefined
        if (!activated) return
        emit(this, 'catalog-drag', { active: false })
        this.suppressClick = true
        emit(this, 'catalog-drop', { value, clientX: end.clientX, clientY: end.clientY })
        window.setTimeout(() => { this.suppressClick = false }, 0)
      },
      onCancel: () => { this.ghost = undefined; emit(this, 'catalog-drag', { active: false }) },
    })
  }

  private renderEntries(entries: CatalogEntry[], kind: 'widget' | 'primitive', emptyText: string): TemplateResult {
    return html`${entries.map(entry => {
      const value = `${kind}:${entry.id}`
      return html`<button class="catalog-item" title=${`${entry.description} Click or drag to add.`} @click=${() => { if (!this.suppressClick) emit(this, 'catalog-add', { value }) }} @pointerdown=${(event: PointerEvent) => this.startDrag(event, value, entry)}><ha-icon .icon=${entry.icon}></ha-icon><strong>${entry.name}</strong><small>${entry.description}</small></button>`
    })}${!entries.length ? html`<p class="empty-result">${emptyText}</p>` : nothing}`
  }

  private renderGhost(): TemplateResult | typeof nothing {
    const ghost = this.ghost
    if (!ghost) return nothing
    return html`<div class="catalog-drag-ghost" data-catalog-value=${ghost.value} style=${styleMap({ left: `${ghost.x}px`, top: `${ghost.y}px`, width: `${ghost.width}px`, height: `${ghost.height}px` })}><ha-icon class="drag-type-icon" .icon=${ghost.icon}></ha-icon><span>${ghost.name}</span><ha-icon class="drag-add-icon" icon="mdi:plus"></ha-icon></div>`
  }

  protected render(): TemplateResult {
    if (this.collapsed) return html`<aside class="panel panel-rail"><button class="icon-button" title="Expand element catalog" aria-label="Expand element catalog" @click=${() => emit(this, 'library-collapse', { collapsed: false })}><ha-icon icon="mdi:chevron-right"></ha-icon></button><span class="rail-label">Library</span></aside>`
    const widgets = filterCatalog(this.widgets, this.searchText)
    const primitives = filterCatalog(this.primitives, this.searchText)
    return html`${this.renderGhost()}<aside class="panel toolbox"><div class="panel-title"><div><span class="eyebrow">Library</span><h2>Elements</h2></div><button class="icon-button" title="Collapse element catalog" aria-label="Collapse element catalog" @click=${() => emit(this, 'library-collapse', { collapsed: true })}><ha-icon icon="mdi:chevron-left"></ha-icon></button></div><label class="search"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" aria-label="Search widgets and primitives" placeholder="Search elements…" .value=${this.searchText} @input=${(event: Event) => { this.searchText = (event.target as HTMLInputElement).value }}></label><div class="catalog-scroll"><section class="catalog-section"><header><span>Widgets</span><span class="count">${widgets.length}</span></header><div class="catalog-grid">${this.renderEntries(widgets, 'widget', 'No matching widgets')}</div></section><section class="catalog-section"><header><span>Primitives</span><span class="count">${primitives.length}</span></header><div class="catalog-grid">${this.renderEntries(primitives, 'primitive', 'No matching primitives')}</div></section></div></aside>`
  }
}

declare global { interface HTMLElementTagNameMap { 'ods-library': OdsLibrary } }
