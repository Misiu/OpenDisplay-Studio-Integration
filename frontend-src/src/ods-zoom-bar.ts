import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles } from "./studio-styles";

const PRESETS = [0.5, 1, 2, 3];

/**
 * Zoom buttons floating over the canvas. They report the wanted zoom; the
 * viewport decides what is allowed.
 */
@customElement("ods-zoom-bar")
export class OdsZoomBar extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: contents;
      }
      .zoom-controls {
        position: absolute;
        right: 16px;
        bottom: 14px;
        display: flex;
        align-items: center;
        padding: 4px;
        border: 1px solid var(--studio-border);
        border-radius: 9px;
        background: var(--studio-surface);
        box-shadow: 0 8px 24px rgba(28, 38, 48, 0.14);
      }
      .zoom-controls button {
        min-width: 34px;
        height: 30px;
        padding: 0 8px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--studio-muted);
        font-size: 11px;
      }
      .zoom-controls button:hover {
        color: var(--studio-text);
        background: var(--secondary-background-color, #eef1f4);
      }
      .zoom-controls button.active {
        color: #fff;
        background: var(--studio-accent);
      }
      @media (max-width: 900px) {
        .zoom-controls {
          right: 8px;
          bottom: 8px;
        }
        .zoom-controls button:nth-of-type(2),
        .zoom-controls button:nth-of-type(4) {
          display: none;
        }
      }
    `,
  ];

  @property({ type: Number }) public zoom = 1;

  private zoomTo(zoom: number): void {
    emit(this, "zoom-change", { zoom });
  }

  private step(direction: 1 | -1): void {
    emit(this, "zoom-step", { direction });
  }

  protected render(): TemplateResult {
    return html`
      <div class="zoom-controls">
        <button aria-label=${strings.zoom.out} @click=${() => this.step(-1)}>
          −
        </button>
        ${PRESETS.map(
          (value) => html`
            <button
              class=${this.zoom === value ? "active" : ""}
              aria-label=${strings.zoom.preset(value)}
              @click=${() => this.zoomTo(value)}
            >
              ${strings.zoom.preset(value)}
            </button>
          `
        )}
        <button aria-label=${strings.zoom.in} @click=${() => this.step(1)}>
          +
        </button>
        <button
          aria-label=${strings.zoom.reset}
          @click=${() => emit(this, "zoom-reset")}
        >
          ${strings.zoom.reset}
        </button>
        <button
          aria-label=${strings.zoom.fit}
          @click=${() => emit(this, "zoom-fit")}
        >
          ${strings.zoom.fit}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-zoom-bar": OdsZoomBar;
  }
}
