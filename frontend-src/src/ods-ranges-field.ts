import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit, type OdsEvent } from "./events";
import {
  canAddRange,
  isIdle,
  newRange,
  rangesOf,
  withoutRange,
  withRangeValues,
} from "./ranges";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";
import type {
  HomeAssistant,
  PaletteId,
  PrimitiveField,
  WidgetRange,
} from "./types";
import "./ods-value-field";

/** The two things a range keeps, described like fields of a primitive. */
const startField = (): PrimitiveField => ({
  key: "from",
  label: strings.rangesField.from,
  shape: "number",
  section: "appearance",
  decimal: true,
  optional: true,
});

const colorField = (): PrimitiveField => ({
  key: "color",
  label: strings.rangesField.color,
  shape: "color",
  section: "appearance",
});

/**
 * The colored ranges of a scale, as many as the user wants: for each, where it starts and
 * its color. The first needs no start; the others do nothing until one is typed. It reports
 * the new list with `primitive-field-change`.
 */
@customElement("ods-ranges-field")
export class OdsRangesField extends LitElement {
  static styles = [
    baseStyles,
    fieldStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .range {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 28px;
        align-items: center;
        gap: 6px;
        margin-bottom: 6px;
      }
      .range.idle {
        opacity: 0.55;
      }
      .range button,
      .add {
        display: grid;
        place-items: center;
        height: 28px;
        padding: 0;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--studio-muted);
      }
      .range button:hover:not(:disabled),
      .add:hover:not(:disabled) {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
      button:disabled {
        opacity: 0.4;
      }
      .add {
        grid-auto-flow: column;
        gap: 4px;
        width: 100%;
        border: 1px dashed var(--studio-border);
        font-size: 11px;
      }
      .hint {
        margin: 0 0 6px;
        color: var(--studio-muted);
        font-size: 11px;
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public field!: PrimitiveField;
  @property({ attribute: false }) public value: unknown;
  @property({ attribute: false }) public palette: PaletteId = "bwr";
  @property({ type: Boolean }) public disabled = false;

  private get list(): WidgetRange[] {
    return rangesOf(this.value);
  }

  private change(list: WidgetRange[]): void {
    emit(this, "primitive-field-change", { key: this.field.key, value: list });
  }

  private onRangeChange(
    index: number,
    event: OdsEvent<"primitive-field-change">
  ): void {
    event.stopPropagation();
    const { key, value } = event.detail;
    this.change(withRangeValues(this.list, index, { [key]: value }));
  }

  private removeAt(index: number): void {
    this.change(withoutRange(this.list, index));
  }

  private add(): void {
    this.change([...this.list, newRange(this.palette, this.list)]);
  }

  private renderRange(range: WidgetRange, index: number): TemplateResult {
    const label = strings.rangesField.remove(index + 1);
    return html`
      <div
        class=${isIdle(this.list, index) ? "range idle" : "range"}
        data-range=${index}
      >
        <ods-value-field
          .field=${startField()}
          .value=${range.from}
          .palette=${this.palette}
          .disabled=${this.disabled}
          @primitive-field-change=${(
            event: OdsEvent<"primitive-field-change">
          ) => this.onRangeChange(index, event)}
        ></ods-value-field>
        <ods-value-field
          .field=${colorField()}
          compact
          .value=${range.color}
          .palette=${this.palette}
          .disabled=${this.disabled}
          @primitive-field-change=${(
            event: OdsEvent<"primitive-field-change">
          ) => this.onRangeChange(index, event)}
        ></ods-value-field>
        <button
          type="button"
          title=${label}
          aria-label=${label}
          .disabled=${this.disabled}
          @click=${() => this.removeAt(index)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `;
  }

  protected render(): TemplateResult {
    const list = this.list;
    return html`
      <p class="hint">${strings.rangesField.hint}</p>
      ${list.map((range, index) => this.renderRange(range, index))}
      <button
        type="button"
        class="add"
        .disabled=${this.disabled || !canAddRange(this.field, list)}
        @click=${this.add}
      >
        <ha-icon icon="mdi:plus"></ha-icon>
        ${strings.rangesField.add}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-ranges-field": OdsRangesField;
  }
}
