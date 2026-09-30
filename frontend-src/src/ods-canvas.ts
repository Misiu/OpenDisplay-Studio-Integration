import { css, html, LitElement, nothing, type TemplateResult } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { emit, type OdsEvent } from './events'
import { itemBounds, transformItem, workingArea, type ItemGesture } from './geometry'
import { itemName, resizeHandleNames } from './item-labels'
import { trackPointerGesture } from './pointer-gesture'
import { RESIZE_HANDLES, type ResizeHandle } from './resize'
import { baseStyles } from './studio-styles'
import type { ComposePreviewResponse, Dashboard, ItemBounds, StudioItem, WidgetDefinition } from './types'
import { DEFAULT_VIEWPORT, fitViewport, withZoom, wheelViewport, type Viewport } from './viewport'
import './ods-zoom-bar'

const GESTURE_THRESHOLD = 3

/** A box in display pixels as percentages of the display, so it scales with the canvas. */
const percentBox = (box: ItemBounds, display: { width: number; height: number }): Record<string, string> => ({
  left: `${box.x / display.width * 100}%`, top: `${box.y / display.height * 100}%`, width: `${box.width / display.width * 100}%`, height: `${box.height / display.height * 100}%`,
})

/** The canvas: the rendered PNG, an interaction overlay from authoritative bounds, and the viewport. */
@customElement('ods-canvas')
export class OdsCanvas extends LitElement {
  static styles = [baseStyles, css`
    :host { display: contents; }
    .workspace { min-width: 0; min-height: 0; display: grid; grid-template-rows: 42px minmax(0, 1fr); background: var(--primary-background-color, #f4f6f8); color: var(--studio-text); overflow: hidden; }
    .history-controls { flex: none; display: flex; align-items: center; gap: 2px; margin-inline-start: auto; }
    .history-controls button { width: 30px; height: 30px; display: grid; place-items: center; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--studio-muted); }
    .history-controls button:hover:not(:disabled) { color: var(--studio-text); background: var(--secondary-background-color, #eef1f4); }
    .history-controls button:disabled { cursor: default; opacity: .32; }
    .history-controls ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }
    .workspace-meta { display: flex; align-items: center; gap: 16px; padding: 0 16px; border-bottom: 1px solid var(--studio-border); color: var(--studio-muted); background: var(--studio-surface); font: 11px var(--code-font-family, monospace); }
    .tool-toggle { display: inline-flex; flex: none; align-items: center; gap: 6px; min-height: 28px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 7px; background: var(--studio-surface); color: var(--studio-muted); font-size: 10px; line-height: 1; white-space: nowrap; }
    .tool-toggle ha-icon { width: 14px; height: 14px; --mdc-icon-size: 14px; }
    .tool-toggle.active { color: var(--studio-accent); border-color: color-mix(in srgb, var(--studio-accent) 65%, var(--studio-border)); background: var(--studio-accent-soft); }
    .zoom-readout { min-width: 42px; text-align: right; color: var(--studio-text); }
    .canvas-stage { position: relative; min-width: 0; min-height: 0; overflow: hidden; overflow-anchor: none; overscroll-behavior: contain; contain: layout paint; background-color: var(--secondary-background-color, #eef1f4); background-image: radial-gradient(circle, color-mix(in srgb, var(--studio-muted) 27%, transparent) .8px, transparent .9px); background-size: 18px 18px; }
    .canvas-stage.accepting-drop { box-shadow: inset 0 0 0 3px var(--studio-accent); }
    .canvas-viewport { position: absolute; left: 50%; top: 50%; transform-origin: center; overflow-anchor: none; }
    .canvas { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: #fff; box-shadow: 0 14px 38px rgba(28, 38, 48, .18); user-select: none; touch-action: none; overflow-anchor: none; }
    .canvas > img, .canvas-placeholder { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
    .canvas-placeholder { display: grid; place-items: center; color: #59636b; background: #fff; }
    .working-area { position: absolute; pointer-events: none; z-index: 2; border: 1px dashed rgba(3, 169, 244, .72); background-image: radial-gradient(circle, rgba(3, 169, 244, .22) .7px, transparent .8px); background-size: max(12px, var(--snap-size)) max(12px, var(--snap-size)); }
    .selection { position: absolute; z-index: 3; min-width: 3px; min-height: 3px; border: 1px solid transparent; cursor: move; touch-action: none; }
    .selection:hover { border-color: rgba(3, 169, 244, .65); }
    .selection.selected { border: 2px solid #00aef0; box-shadow: 0 0 0 1px rgba(255,255,255,.9); }
    .selection.locked { cursor: default; border-style: dashed; }
    .selection.hidden { background: rgba(3, 169, 244, .09); border: 1px dashed rgba(3, 169, 244, .75); }
    .hidden-label { position: absolute; left: 3px; top: 3px; color: #006d99; background: rgba(255,255,255,.9); padding: 1px 4px; font-size: 8px; }
    .lock-badge { position: absolute; right: 2px; top: 2px; width: 15px; height: 15px; padding: 2px; color: #fff; background: #283746; border-radius: 3px; }
    .resize-handle { position: absolute; z-index: 7; width: 11px; height: 11px; padding: 0; border: 2px solid #00aef0; border-radius: 1px; background: #fff; box-shadow: 0 0 0 1px rgba(255,255,255,.85); touch-action: none; }
    .resize-nw { left: 0; top: 0; transform: translate(-50%, -50%); cursor: nwse-resize; }
    .resize-n { left: 50%; top: 0; transform: translate(-50%, -50%); cursor: ns-resize; }
    .resize-ne { right: 0; top: 0; transform: translate(50%, -50%); cursor: nesw-resize; }
    .resize-e { right: 0; top: 50%; transform: translate(50%, -50%); cursor: ew-resize; }
    .resize-se { right: 0; bottom: 0; transform: translate(50%, 50%); cursor: nwse-resize; }
    .resize-s { left: 50%; bottom: 0; transform: translate(-50%, 50%); cursor: ns-resize; }
    .resize-sw { left: 0; bottom: 0; transform: translate(-50%, 50%); cursor: nesw-resize; }
    .resize-w { left: 0; top: 50%; transform: translate(-50%, -50%); cursor: ew-resize; }
    .selection-size { position: absolute; z-index: 6; left: 50%; top: calc(100% + 9px); transform: translateX(-50%); min-width: max-content; padding: 2px 7px; border: 1px solid #2788b8; border-radius: 999px; color: #9cddff; background: #102033; box-shadow: 0 2px 6px rgba(0,0,0,.28); font: 700 10px/1.2 var(--code-font-family, monospace); white-space: nowrap; pointer-events: none; }
    @media (max-width: 900px) {
      .workspace-meta { gap: 8px; padding: 0 8px; }
      .workspace-meta > span:nth-child(2), .workspace-meta > span:nth-child(3) { display: none; }
    }
  `]

  @property({ attribute: false }) public dashboard!: Dashboard
  @property({ attribute: false }) public preview?: ComposePreviewResponse
  @property({ attribute: false }) public widgets: WidgetDefinition[] = []
  @property() public selectedItemId = ''
  @property({ type: Boolean }) public snapEnabled = true
  /** True while a catalog drag is in progress, so the stage can show it accepts the drop. */
  @property({ type: Boolean }) public acceptingDrop = false
  @property({ type: Number }) public undoCount = 0
  @property({ type: Number }) public redoCount = 0

  /** Pan and zoom live in the shell so they survive switching to the code view and back. */
  @property({ attribute: false }) public viewport: Viewport = DEFAULT_VIEWPORT
  @query('.canvas') private canvas?: HTMLElement
  @query('.canvas-stage') private stage?: HTMLElement
  private stopGesture?: () => void

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.stopGesture?.()
  }

  /** The display pixel under a screen point, or undefined when the point is outside the canvas. */
  public displayPointAt(clientX: number, clientY: number): { x: number; y: number } | undefined {
    const canvas = this.canvas
    if (!canvas) return undefined
    const rect = canvas.getBoundingClientRect()
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return undefined
    const { width, height } = this.dashboard.display
    return { x: (clientX - rect.left) / rect.width * width, y: (clientY - rect.top) / rect.height * height }
  }

  private setViewport(viewport: Viewport): void { emit(this, 'viewport-change', viewport) }

  public resetView(): void { this.setViewport(DEFAULT_VIEWPORT) }

  /** Zoom so the whole display fits the stage with a margin. */
  public fitView(): void {
    const stage = this.stage
    if (stage) this.setViewport(fitViewport({ width: stage.clientWidth, height: stage.clientHeight }, this.dashboard.display))
  }

  private onWheel(event: WheelEvent): void {
    event.preventDefault()
    this.setViewport(wheelViewport(this.viewport, event))
  }

  private beginGesture(event: PointerEvent, item: StudioItem, handle?: ResizeHandle): void {
    event.stopPropagation(); event.preventDefault()
    emit(this, 'item-select', { itemId: item.id })
    if (item.locked) return
    this.stopGesture?.()
    const before = structuredClone(this.dashboard)
    const original = structuredClone(item)
    const minSize = item.kind === 'widget' ? this.widgets.find(widget => widget.id === item.widget.type)?.layout.minSize : undefined
    this.stopGesture = trackPointerGesture({
      origin: event,
      threshold: GESTURE_THRESHOLD,
      onMove: move => {
        const canvas = this.canvas
        if (!canvas) return
        const rect = canvas.getBoundingClientRect(); const { width, height } = this.dashboard.display
        const dx = Math.round((move.clientX - event.clientX) / rect.width * width)
        const dy = Math.round((move.clientY - event.clientY) / rect.height * height)
        const gesture: ItemGesture = handle ? { mode: 'resize', handle, shiftKey: move.shiftKey } : { mode: 'move' }
        emit(this, 'item-transform', { item: transformItem(original, gesture, dx, dy, this.dashboard, { snapEnabled: this.snapEnabled, minSize }) })
      },
      onEnd: (_end, activated) => { if (activated) emit(this, 'item-transform-end', { before }) },
    })
  }

  private renderItem(item: StudioItem): TemplateResult {
    const box = itemBounds(item)
    const selected = item.id === this.selectedItemId
    return html`
      <div
        data-item-id=${item.id}
        class=${`selection ${selected ? 'selected' : ''} ${item.locked ? 'locked' : ''} ${item.hidden ? 'hidden' : ''}`}
        style=${styleMap(percentBox(box, this.dashboard.display))}
        @pointerdown=${(event: PointerEvent) => this.beginGesture(event, item)}
      >
        ${item.hidden ? html`<span class="hidden-label">Hidden</span>` : nothing}
        ${item.locked ? html`<ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>` : nothing}
        ${selected ? html`<output class="selection-size" aria-live="off">${Math.round(box.width)} × ${Math.round(box.height)}</output>` : nothing}
        ${selected && !item.locked ? RESIZE_HANDLES.map(handle => html`
          <button
            data-resize-handle=${handle}
            class=${`resize-handle resize-${handle}`}
            tabindex="-1"
            aria-label=${`Resize ${itemName(item, this.widgets)} from ${resizeHandleNames[handle]}`}
            @pointerdown=${(event: PointerEvent) => this.beginGesture(event, item, handle)}
          ></button>
        `) : nothing}
      </div>
    `
  }

  protected render(): TemplateResult {
    const dashboard = this.dashboard
    const { width, height, padding, snapSize } = dashboard.display
    const area = workingArea(dashboard)
    const { zoom, panX, panY } = this.viewport
    const transform = `translate(${panX}px, ${panY}px) scale(${zoom})`
    return html`
      <main class="workspace">
        <div class="workspace-meta">
          <span>${width} × ${height} px</span>
          <span>${dashboard.items.length} layers</span>
          <span>Padding ${padding}px</span>
          <div class="history-controls"><button aria-label="Undo" title="Undo (Ctrl+Z)" ?disabled=${!this.undoCount} @click=${() => emit(this, 'undo')}><ha-icon icon="mdi:undo"></ha-icon></button><button aria-label="Redo" title="Redo (Ctrl+Shift+Z)" ?disabled=${!this.redoCount} @click=${() => emit(this, 'redo')}><ha-icon icon="mdi:redo"></ha-icon></button></div>
          <button class=${this.snapEnabled ? 'tool-toggle active' : 'tool-toggle'} aria-pressed=${this.snapEnabled} @click=${() => emit(this, 'snap-toggle')}>
            <ha-icon icon="mdi:magnet"></ha-icon><span>Snap ${snapSize}px</span>
          </button>
          <span class="zoom-readout">${Math.round(zoom * 100)}%</span>
        </div>
        <section class=${this.acceptingDrop ? 'canvas-stage accepting-drop' : 'canvas-stage'} @wheel=${this.onWheel} @dragover=${(event: DragEvent) => { if (this.acceptingDrop) event.preventDefault() }} @drop=${(event: DragEvent) => event.preventDefault()}>
          <div class="canvas-viewport" style=${styleMap({ transform })}>
            <div class="canvas" style=${styleMap({ width: `${width}px`, height: `${height}px` })} @pointerdown=${() => emit(this, 'item-select', { itemId: '' })}>
              ${this.preview ? html`<img draggable="false" src=${this.preview.imageUrl} alt="Authoritative rendered display preview">` : html`<div class="canvas-placeholder">Rendering…</div>`}
              <div class="working-area" aria-hidden="true" style=${styleMap({ ...percentBox(area, dashboard.display), '--snap-size': `${snapSize * zoom}px` })}></div>
              ${dashboard.items.map(item => this.renderItem(item))}
            </div>
          </div>
          <ods-zoom-bar .zoom=${zoom} @zoom-change=${(event: OdsEvent<'zoom-change'>) => { event.stopPropagation(); this.setViewport(withZoom(this.viewport, event.detail.zoom)) }} @zoom-reset=${(event: Event) => { event.stopPropagation(); this.resetView() }} @zoom-fit=${(event: Event) => { event.stopPropagation(); this.fitView() }}></ods-zoom-bar>
        </section>
      </main>
    `
  }
}

declare global { interface HTMLElementTagNameMap { 'ods-canvas': OdsCanvas } }
