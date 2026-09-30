import { css, html, LitElement, type TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { emit } from './events'
import { baseStyles } from './studio-styles'

const PRESETS = [.5, 1, 2, 3]
const STEP = .25

/** Zoom buttons floating over the canvas. Reports the wanted zoom; the viewport decides what is allowed. */
@customElement('ods-zoom-bar')
export class OdsZoomBar extends LitElement {
  static styles = [baseStyles, css`
    :host { display: contents; }
    .zoom-controls { position: absolute; right: 16px; bottom: 14px; display: flex; align-items: center; padding: 4px; border: 1px solid var(--studio-border); border-radius: 9px; background: var(--studio-surface); box-shadow: 0 8px 24px rgba(28,38,48,.14); }
    .zoom-controls button { min-width: 34px; height: 30px; padding: 0 8px; border: 0; border-radius: 6px; background: transparent; color: var(--studio-muted); font-size: 11px; }
    .zoom-controls button:hover { color: var(--studio-text); background: var(--secondary-background-color, #eef1f4); }
    .zoom-controls button.active { color: #fff; background: var(--studio-accent); }
    @media (max-width: 900px) {
      .zoom-controls { right: 8px; bottom: 8px; }
      .zoom-controls button:nth-of-type(2), .zoom-controls button:nth-of-type(4) { display: none; }
    }
  `]

  @property({ type: Number }) public zoom = 1

  private zoomTo(zoom: number): void { emit(this, 'zoom-change', { zoom }) }

  protected render(): TemplateResult {
    return html`<div class="zoom-controls"><button aria-label="Zoom out" @click=${() => this.zoomTo(this.zoom - STEP)}>−</button>${PRESETS.map(value => html`<button class=${this.zoom === value ? 'active' : ''} aria-label=${`${value}×`} @click=${() => this.zoomTo(value)}>${value}×</button>`)}<button aria-label="Zoom in" @click=${() => this.zoomTo(this.zoom + STEP)}>+</button><button aria-label="Reset" @click=${() => emit(this, 'zoom-reset')}>Reset</button><button aria-label="Fit" @click=${() => emit(this, 'zoom-fit')}>Fit</button></div>`
  }
}

declare global { interface HTMLElementTagNameMap { 'ods-zoom-bar': OdsZoomBar } }
