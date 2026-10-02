import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import { fieldFormSchema } from "./item-fields";
import {
  canAddSeries,
  canRemoveSeries,
  ENTITY_KEY,
  newSeries,
  seriesOf,
  withoutSeries,
  withSeriesValues,
  type Series,
} from "./series";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";
import type { HomeAssistant, PaletteId, PrimitiveField } from "./types";

/** The kinds of entity a history plot can draw: those with a number as their state. */
const NUMERIC_DOMAINS = ["sensor", "input_number", "number", "counter"];

interface FormEvent {
  detail: { value: Record<string, unknown> };
}

/**
 * The series of a history plot: one card each with a picker for the entity to draw and the
 * settings of the line below it. It reports the new list with `primitive-field-change`.
 */
@customElement("ods-series-field")
export class OdsSeriesField extends LitElement {
  static styles = [
    baseStyles,
    fieldStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .series {
        display: grid;
        gap: 6px;
        margin-bottom: 8px;
        padding: 8px;
        border: 1px solid var(--studio-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .series-header {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 28px;
        align-items: center;
        gap: 6px;
      }
      .series-header ha-entity-picker {
        min-width: 0;
      }
      .series button,
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
      .series button:hover:not(:disabled),
      .add:hover:not(:disabled) {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
      button:disabled {
        opacity: 0.4;
      }
      .series details > summary {
        cursor: pointer;
        color: var(--studio-muted);
        font-size: 11px;
      }
      .add {
        grid-auto-flow: column;
        gap: 4px;
        width: 100%;
        border: 1px dashed var(--studio-border);
        font-size: 11px;
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public field!: PrimitiveField;
  @property({ attribute: false }) public value: unknown;
  @property({ attribute: false }) public palette: PaletteId = "bwr";
  @property({ type: Boolean }) public disabled = false;

  private get list(): Series[] {
    return seriesOf(this.value);
  }

  private change(list: Series[]): void {
    emit(this, "primitive-field-change", { key: this.field.key, value: list });
  }

  private onEntityChange(
    index: number,
    event: CustomEvent<{ value: string }>
  ): void {
    event.stopPropagation();
    this.change(
      withSeriesValues(this.list, index, { [ENTITY_KEY]: event.detail.value })
    );
  }

  private onSettingsChange(index: number, event: FormEvent): void {
    this.change(withSeriesValues(this.list, index, event.detail.value));
  }

  private removeAt(index: number): void {
    this.change(withoutSeries(this.list, index));
  }

  private add(): void {
    this.change([...this.list, newSeries(this.field)]);
  }

  /** The settings of a line: every field of a series but the entity. */
  private get settingsSchema(): ReturnType<typeof fieldFormSchema>[] {
    return (this.field.nested ?? [])
      .filter((child) => child.key !== ENTITY_KEY)
      .map((child) => fieldFormSchema(child, this.palette));
  }

  private renderSeries(series: Series, index: number): TemplateResult {
    const label = strings.seriesField.remove(index + 1);
    return html`
      <div class="series" data-series=${index}>
        <div class="series-header">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${String(series[ENTITY_KEY] ?? "")}
            .label=${strings.seriesField.entity}
            .includeDomains=${NUMERIC_DOMAINS}
            .disabled=${this.disabled}
            @value-changed=${(event: CustomEvent<{ value: string }>) =>
              this.onEntityChange(index, event)}
          ></ha-entity-picker>
          <button
            type="button"
            title=${label}
            aria-label=${label}
            .disabled=${this.disabled || !canRemoveSeries(this.field, this.list)}
            @click=${() => this.removeAt(index)}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <details>
          <summary>${strings.seriesField.settings}</summary>
          <ha-form
            .hass=${this.hass}
            .data=${series}
            .schema=${this.settingsSchema}
            .computeLabel=${(entry: { label: string }) => entry.label}
            @value-changed=${(event: FormEvent) =>
              this.onSettingsChange(index, event)}
          ></ha-form>
        </details>
      </div>
    `;
  }

  protected render(): TemplateResult {
    const list = this.list;
    return html`
      ${list.map((series, index) => this.renderSeries(series, index))}
      <button
        type="button"
        class="add"
        .disabled=${this.disabled || !canAddSeries(this.field, list)}
        @click=${this.add}
      >
        <ha-icon icon="mdi:plus"></ha-icon>
        ${strings.seriesField.add}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-series-field": OdsSeriesField;
  }
}
