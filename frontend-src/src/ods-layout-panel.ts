import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit, type OdsEvent } from "./events";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";
import type { GridLayout, LayoutLimits } from "./types";
import "./ods-property-field";

type GridKey = "columns" | "rows" | "gap";

const isGridKey = (key: string): key is GridKey =>
  key === "columns" || key === "rows" || key === "gap";

const PADDING_KEY = "padding";
const MAX_PADDING = 1024;

/**
 * The left panel of the Layout tab: how many columns and rows the grid has, the gap
 * between its cells, and the padding around the grid.
 */
@customElement("ods-layout-panel")
export class OdsLayoutPanel extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .toolbox {
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: auto;
        border-inline-end: 1px solid var(--studio-border);
        background: var(--studio-surface);
      }
      .panel-title {
        min-height: 58px;
        display: flex;
        align-items: center;
        padding: 11px 12px;
      }
      .panel-title h2 {
        margin: 1px 0 0;
        font-size: 15px;
      }
      .section {
        display: grid;
        gap: var(--ha-space-2, 8px);
        padding: var(--ha-space-1, 4px) var(--ha-space-3, 12px)
          var(--ha-space-4, 16px);
      }
      .section h3 {
        margin: 0;
        color: var(--studio-muted);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      .fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--ha-space-2, 8px);
      }
      p {
        margin: 0;
        color: var(--studio-muted);
        font-size: 12px;
        line-height: 1.45;
      }
      .count {
        color: var(--studio-text);
        font-weight: 600;
      }
    `,
  ];

  @property({ attribute: false }) public layout!: GridLayout;
  @property({ attribute: false }) public limits!: LayoutLimits;
  /** The space kept free around the grid, a setting of the display. */
  @property({ type: Number }) public padding = 0;

  private onFieldChange(event: OdsEvent<"field-change">): void {
    event.stopPropagation();
    const { key, value } = event.detail;
    const number = Number(value);
    if (!Number.isFinite(number)) return;
    if (isGridKey(key)) {
      emit(this, "grid-change", { [key]: number });
    }
    if (key === PADDING_KEY) {
      emit(this, "display-number-change", { key: PADDING_KEY, value: number });
    }
  }

  private renderField(
    key: GridKey | typeof PADDING_KEY,
    value: number,
    label: string,
    min: number,
    max: number
  ): TemplateResult {
    return html`
      <ods-property-field
        .label=${label}
        .fieldKey=${key}
        .value=${value}
        .min=${min}
        .max=${max}
        @field-change=${this.onFieldChange}
      ></ods-property-field>
    `;
  }

  private renderGrid(): TemplateResult {
    const { minLines, maxLines, maxGap } = this.limits;
    return html`
      <div class="section">
        <h3>${strings.basic.gridHeading}</h3>
        <div class="fields">
          ${this.renderField("columns", this.layout.columns, strings.basic.columns, minLines, maxLines)}
          ${this.renderField("rows", this.layout.rows, strings.basic.rows, minLines, maxLines)}
          ${this.renderField("gap", this.layout.gap, strings.basic.gap, 0, maxGap)}
          ${this.renderField(PADDING_KEY, this.padding, strings.fields.padding, 0, MAX_PADDING)}
        </div>
      </div>
    `;
  }

  private renderRegions(): TemplateResult {
    return html`
      <div class="section">
        <h3>${strings.basic.regionsHeading}</h3>
        <span class="count">
          ${strings.basic.regionCount(this.layout.regions.length)}
        </span>
        <p>${strings.basic.regionsHint}</p>
      </div>
    `;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.layout || !this.limits) return nothing;
    return html`
      <aside class="toolbox">
        <div class="panel-title">
          <div>
            <span class="eyebrow">${strings.basic.layoutTitle}</span>
            <h2>${strings.basic.layoutHeading}</h2>
          </div>
        </div>
        ${this.renderGrid()} ${this.renderRegions()}
      </aside>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-layout-panel": OdsLayoutPanel;
  }
}
