import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { inputValue } from "./dom";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";

/**
 * One compact numeric input of the inspector: a 28 px box with its label inside at the
 * left and its unit inside at the right. It reports the raw text; its owner validates
 * and clamps it.
 */
@customElement("ods-property-field")
export class OdsPropertyField extends LitElement {
  static styles = [
    baseStyles,
    fieldStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .box {
        position: relative;
        width: 100%;
        cursor: text;
      }
      input[type="number"] {
        appearance: textfield;
        -moz-appearance: textfield;
      }
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        appearance: none;
        margin: 0;
      }
      /* On hover the unit moves left and the step buttons appear at the right edge. */
      .steppers {
        position: absolute;
        top: 1px;
        right: 1px;
        bottom: 1px;
        display: none;
        flex-direction: column;
        width: 14px;
      }
      .box:hover:not(.disabled) .steppers,
      .box:focus-within:not(.disabled) .steppers {
        display: flex;
      }
      .box:hover:not(.disabled) .unit,
      .box:focus-within:not(.disabled) .unit {
        margin-right: 12px;
      }
      .steppers button {
        flex: 1;
        min-height: 0;
        padding: 0;
        border: 0;
        border-radius: 3px;
        background: transparent;
        color: var(--studio-muted);
        font-size: 7px;
        line-height: 1;
      }
      .steppers button:hover {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
    `,
  ];

  @property() public label = "";
  @property() public fieldKey = "";
  @property() public unit = "";
  @property({ attribute: false }) public value: number | null = 0;
  @property({ type: Number }) public min = 0;
  @property({ type: Number }) public max = 4096;
  @property({ type: Boolean }) public disabled = false;

  @query("input") private input?: HTMLInputElement;

  /** Step the value by one, ten with Shift, and report it like a typed one. */
  private step(direction: 1 | -1, event: MouseEvent): void {
    const input = this.input;
    if (!input) return;
    const amount = event.shiftKey ? 10 : 1;
    const next = Number(input.value || 0) + direction * amount;
    input.value = String(Math.min(this.max, Math.max(this.min, next)));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  private stepUp(event: MouseEvent): void {
    this.step(1, event);
  }

  private stepDown(event: MouseEvent): void {
    this.step(-1, event);
  }

  private renderSteppers(): TemplateResult | typeof nothing {
    if (this.disabled) return nothing;
    return html`
      <span class="steppers">
        <button
          type="button"
          tabindex="-1"
          aria-label=${strings.common.increase}
          @click=${this.stepUp}
        >
          ▲
        </button>
        <button
          type="button"
          tabindex="-1"
          aria-label=${strings.common.decrease}
          @click=${this.stepDown}
        >
          ▼
        </button>
      </span>
    `;
  }

  private onChange(event: Event): void {
    emit(this, "field-change", {
      key: this.fieldKey,
      value: inputValue(event),
    });
  }

  protected render(): TemplateResult {
    return html`
      <label class="box ${this.disabled ? "disabled" : ""}">
        <span class="inner-label">${this.label}</span>
        <input
          class="mono"
          data-field=${this.fieldKey}
          aria-label=${this.label}
          type="number"
          .value=${this.value === null ? "" : String(this.value)}
          min=${this.min}
          max=${this.max}
          .disabled=${this.disabled}
          @change=${this.onChange}
        />
        ${
          this.unit
            ? html`
                <span class="unit">${this.unit}</span>
              `
            : nothing
        }
        ${this.renderSteppers()}
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-property-field": OdsPropertyField;
  }
}
