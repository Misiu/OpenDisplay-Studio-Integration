import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import { colorLabel, PALETTE_SWATCHES } from "./palettes";
import { strings } from "./strings";
import { baseStyles } from "./studio-styles";
import type { PaletteId } from "./types";

/**
 * The colors the display can show, as swatches with their names ("Panel colours" in the
 * color picker of the reference designer on an e-paper display). Nothing but the palette can
 * be picked, so there is no free color and no accent. A field that may be empty also offers "None".
 */
@customElement("ods-color-picker")
export class OdsColorPicker extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        max-height: 260px;
        overflow: auto;
      }
      button {
        display: flex;
        align-items: center;
        gap: 7px;
        min-width: 0;
        height: 30px;
        padding: 0 8px;
        border: 1px solid var(--studio-border);
        border-radius: 7px;
        background: var(--studio-surface);
        font-size: 11px;
        text-align: start;
      }
      button:hover {
        border-color: var(--primary-color);
      }
      button[aria-pressed="true"] {
        border-color: var(--primary-color);
        box-shadow: inset 0 0 0 1px var(--primary-color);
      }
      .swatch {
        flex: none;
        width: 16px;
        height: 16px;
        border: 1px solid var(--studio-border);
        border-radius: 4px;
      }
      .swatch.none {
        background: repeating-conic-gradient(#bbb 0 25%, #fff 0 50%) 0 0 / 8px
          8px;
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ];

  @property() public palette: PaletteId = "bw";
  /** The stored value of the field, or an empty string for none. */
  @property() public value = "";
  /** Whether the field may be left without a color. */
  @property({ type: Boolean }) public nullable = false;

  private choose(color: string | null): void {
    emit(this, "color-change", { color });
  }

  private renderChoice(
    value: string | null,
    label: string,
    swatch: TemplateResult
  ): TemplateResult {
    const selected = (value ?? "") === this.value;
    return html`
      <button
        type="button"
        data-color=${value ?? "none"}
        aria-pressed=${selected ? "true" : "false"}
        @click=${() => this.choose(value)}
      >
        ${swatch}
        <span class="name">${label}</span>
      </button>
    `;
  }

  private renderNone(): TemplateResult | typeof nothing {
    if (!this.nullable) return nothing;
    return this.renderChoice(
      null,
      strings.colors.none,
      html`
        <span class="swatch none"></span>
      `
    );
  }

  protected render(): TemplateResult {
    return html`
      <div class="grid">
        ${this.renderNone()}
        ${PALETTE_SWATCHES[this.palette].map((color) =>
          this.renderChoice(
            color.value,
            colorLabel(color.id),
            html`
              <span class="swatch" style=${`background:${color.hex}`}></span>
            `
          )
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-color-picker": OdsColorPicker;
  }
}
