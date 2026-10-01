import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles } from "./studio-styles";

/**
 * The nine places an anchor can be, drawn as the 3 x 3 grid of "Align in Parent" on
 * lvgl.espboards.dev: the first letter of a position is the column (left, middle,
 * right), the second the row (top, middle, bottom). The chosen place has a large dot.
 */
export const ANCHOR_POSITIONS = [
  "lt",
  "mt",
  "rt",
  "lm",
  "mm",
  "rm",
  "lb",
  "mb",
  "rb",
] as const;

export type AnchorPosition = (typeof ANCHOR_POSITIONS)[number];

export const isAnchorPosition = (value: string): value is AnchorPosition =>
  ANCHOR_POSITIONS.some((position) => position === value);

@customElement("ods-anchor-picker")
export class OdsAnchorPicker extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: inline-block;
      }
      .grid {
        display: inline-grid;
        grid-template-columns: repeat(3, 24px);
        gap: 1px;
        padding: 1px;
        overflow: hidden;
        border-radius: 5px;
        background: var(--studio-border);
      }
      button {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        padding: 0;
        border: 0;
        background: var(--studio-surface);
      }
      button:hover {
        background: var(--studio-accent-soft);
      }
      button:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
      }
      .dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--studio-muted);
      }
      button[aria-pressed="true"] .dot {
        width: 8px;
        height: 8px;
        background: var(--primary-color);
      }
    `,
  ];

  @property() public value = "";
  @property({ type: Boolean }) public disabled = false;

  private choose(position: AnchorPosition): void {
    emit(this, "anchor-change", { anchor: position });
  }

  private renderPosition(position: AnchorPosition): TemplateResult {
    const name = strings.anchors[position];
    return html`
      <button
        type="button"
        data-anchor=${position}
        title=${name}
        aria-label=${name}
        aria-pressed=${this.value === position ? "true" : "false"}
        .disabled=${this.disabled}
        @click=${() => this.choose(position)}
      >
        <span class="dot"></span>
      </button>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="grid" role="group" aria-label=${strings.fields.anchor}>
        ${ANCHOR_POSITIONS.map((position) => this.renderPosition(position))}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-anchor-picker": OdsAnchorPicker;
  }
}
