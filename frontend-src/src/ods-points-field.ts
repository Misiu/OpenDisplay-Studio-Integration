import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import {
  addPoint,
  canAddPoint,
  canRemovePoint,
  pointsOf,
  removePoint,
  setPointCoordinate,
  type Point,
} from "./polygon-points";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";
import type { PrimitiveField } from "./types";

/**
 * The points of a polygon, one row each with its `x` and `y`, a button to remove it, and a
 * button to add another. It reports the new points with `primitive-field-change`.
 */
@customElement("ods-points-field")
export class OdsPointsField extends LitElement {
  static styles = [
    baseStyles,
    fieldStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .rows {
        display: grid;
        gap: 4px;
      }
      .row {
        display: grid;
        grid-template-columns: 18px 1fr 1fr 24px;
        align-items: center;
        gap: 4px;
      }
      .row .index {
        color: var(--studio-muted);
        font-size: 10px;
        text-align: center;
      }
      .row button,
      .add {
        display: grid;
        place-items: center;
        height: 24px;
        padding: 0;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: var(--studio-muted);
      }
      .row button:hover:not(:disabled),
      .add:hover:not(:disabled) {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
      .add {
        grid-auto-flow: column;
        gap: 4px;
        width: 100%;
        margin-top: 4px;
        border: 1px dashed var(--studio-border);
        font-size: 11px;
      }
      button:disabled {
        opacity: 0.4;
      }
    `,
  ];

  @property({ attribute: false }) public field!: PrimitiveField;
  /** The stored value: a list of `[x, y]` pairs. */
  @property({ attribute: false }) public value: unknown;
  @property({ type: Boolean }) public disabled = false;

  private get points(): Point[] {
    return pointsOf(this.value);
  }

  private change(points: Point[]): void {
    emit(this, "primitive-field-change", {
      key: this.field.key,
      value: points,
    });
  }

  private onCoordinateChange(index: number, axis: 0 | 1, event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    const value = Number.parseInt(event.target.value, 10);
    if (Number.isNaN(value)) {
      // Not a number yet: show the stored one again.
      event.target.value = String(this.points[index][axis]);
      return;
    }
    this.change(setPointCoordinate(this.points, index, axis, value));
  }

  private onXChange(index: number, event: Event): void {
    this.onCoordinateChange(index, 0, event);
  }

  private onYChange(index: number, event: Event): void {
    this.onCoordinateChange(index, 1, event);
  }

  private removeAt(index: number): void {
    this.change(removePoint(this.points, index));
  }

  private add(): void {
    this.change(addPoint(this.points));
  }

  private renderCoordinate(
    label: string,
    value: number,
    onChange: (event: Event) => void
  ): TemplateResult {
    return html`
      <label class="box ${this.disabled ? "disabled" : ""}">
        <span class="inner-label">${label}</span>
        <input
          type="number"
          step="1"
          .value=${String(value)}
          .disabled=${this.disabled}
          @change=${onChange}
        />
      </label>
    `;
  }

  private renderRow(point: Point, index: number): TemplateResult {
    const label = strings.pointsField.remove(index + 1);
    return html`
      <div class="row" data-point=${index}>
        <span class="index">${index + 1}</span>
        ${this.renderCoordinate(strings.pointsField.x, point[0], (event) =>
          this.onXChange(index, event)
        )}
        ${this.renderCoordinate(strings.pointsField.y, point[1], (event) =>
          this.onYChange(index, event)
        )}
        <button
          type="button"
          title=${label}
          aria-label=${label}
          .disabled=${this.disabled || !canRemovePoint(this.points)}
          @click=${() => this.removeAt(index)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `;
  }

  protected render(): TemplateResult {
    const points = this.points;
    return html`
      <div class="rows" role="group" aria-label=${this.field.label}>
        ${points.map((point, index) => this.renderRow(point, index))}
      </div>
      <button
        type="button"
        class="add"
        .disabled=${this.disabled || !canAddPoint(points)}
        @click=${this.add}
      >
        <ha-icon icon="mdi:plus"></ha-icon>
        ${strings.pointsField.add}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-points-field": OdsPointsField;
  }
}
