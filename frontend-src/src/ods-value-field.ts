import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { emit, type OdsEvent } from "./events";
import { isSeriesField } from "./series";
import { UNCHANGED, valueForForm, valueFromForm } from "./field-codecs";
import { fieldFormSchema } from "./item-fields";
import { colorHex, colorLabel, PALETTE_SWATCHES } from "./palettes";
import { resolveLimit } from "./primitives";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";
import type { HomeAssistant, PaletteId, PrimitiveField } from "./types";
import "./ods-property-field";
import { ANCHOR_POSITIONS, isAnchorPosition } from "./ods-anchor-picker";
import "./ods-color-picker";
import "./ods-icon-field";
import "./ods-points-field";
import "./ods-series-field";
import "./ods-image-field";
import "./ods-popover";

/** How soon after a popover closed a click on its trigger is the click that closed it. */
const REOPEN_GUARD_MS = 250;
const SEGMENTED_MAXIMUM = 4;

/** The anchor the renderer uses when none is set: the top left of the text. */
const DEFAULT_ANCHOR = "lt";

type Picker = "color" | "anchor";

/**
 * One field of a primitive, drawn for its shape: a number in a compact box with its unit,
 * a color as a swatch that opens the colors of the display, an anchor as a 3 x 3 grid, a
 * short choice as a segmented control. It reports the new stored value with
 * `primitive-field-change`; its owner changes the item.
 */
@customElement("ods-value-field")
export class OdsValueField extends LitElement {
  static styles = [
    baseStyles,
    fieldStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .picker-trigger {
        width: 100%;
        cursor: pointer;
        text-align: start;
      }
      .picker-trigger.color {
        height: 30px;
      }
      .picker-trigger .value {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-family: var(--code-font-family, monospace);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .swatch {
        flex: none;
        width: 18px;
        height: 18px;
        border: 1px solid var(--studio-border);
        border-radius: 5px;
      }
      .swatch.none {
        background: repeating-conic-gradient(#bbb 0 25%, #fff 0 50%) 0 0 / 8px
          8px;
      }
      .clear {
        display: grid;
        flex: none;
        place-items: center;
        width: 14px;
        height: 14px;
        padding: 0;
        border: 0;
        border-radius: 4px;
        background: transparent;
        color: var(--studio-muted);
      }
      .clear:hover {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
      .anchor-mark {
        display: inline-grid;
        grid-template-columns: repeat(3, 4px);
        gap: 2px;
      }
      .anchor-mark i {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--studio-border);
      }
      .anchor-mark i.on {
        background: var(--primary-color);
      }
      .switch-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-height: 28px;
        font-size: 11px;
        font-weight: 500;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .chips button {
        height: 24px;
        padding: 0 8px;
        border: 1px solid var(--studio-border);
        border-radius: 6px;
        background: transparent;
        font-size: 11px;
      }
      .chips button[aria-pressed="true"] {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public field!: PrimitiveField;
  /** The stored value of the field. */
  @property({ attribute: false }) public value: unknown;
  @property() public palette: PaletteId = "bw";
  @property({ attribute: false }) public display = { width: 800, height: 480 };
  @property({ type: Boolean }) public disabled = false;

  @state() private picker?: { kind: Picker; anchor: DOMRect };
  private closedAt = 0;

  private change(value: unknown): void {
    emit(this, "primitive-field-change", { key: this.field.key, value });
  }

  // --- pickers --------------------------------------------------------------------------

  private openPicker(kind: Picker, event: Event): void {
    if (this.disabled) return;
    if (Date.now() - this.closedAt < REOPEN_GUARD_MS) return;
    const trigger = event.currentTarget;
    if (!(trigger instanceof HTMLElement)) return;
    this.picker = { kind, anchor: trigger.getBoundingClientRect() };
  }

  private closePicker(): void {
    this.closedAt = Date.now();
    this.picker = undefined;
  }

  private onAnchorChange(event: OdsEvent<"anchor-change">): void {
    this.change(event.detail.anchor);
    this.closePicker();
  }

  private onColorChange(event: OdsEvent<"color-change">): void {
    this.change(event.detail.color);
    this.closePicker();
  }

  private openColorPicker(event: Event): void {
    this.openPicker("color", event);
  }

  private openAnchorPicker(event: Event): void {
    this.openPicker("anchor", event);
  }

  private clearColor(event: Event): void {
    event.stopPropagation();
    this.change(null);
  }

  // --- numbers and text -------------------------------------------------------------------

  private onNumberChange(event: OdsEvent<"field-change">): void {
    event.stopPropagation();
    const text = event.detail.value.trim();
    if (text === "") {
      this.change(this.field.optional ? null : this.field.default);
      return;
    }
    const minimum = resolveLimit(this.field.min, this.display, -Infinity);
    const maximum = resolveLimit(this.field.max, this.display, Infinity);
    this.change(Math.min(maximum, Math.max(minimum, Math.round(Number(text)))));
  }

  private onTextChange(event: Event): void {
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) {
      this.change(target.value);
    }
  }

  private onSwitchChange(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.change(event.target.checked);
    }
  }

  private toggleFlag(option: string): void {
    const chosen = new Set(
      String(this.value ?? "")
        .split(",")
        .filter((flag) => flag !== "")
    );
    if (chosen.has(option)) chosen.delete(option);
    else chosen.add(option);
    const next = (this.field.options ?? []).filter((flag) => chosen.has(flag));
    this.change(next.length > 0 ? next.join(",") : null);
  }

  private onFormChange(
    event: CustomEvent<{ value: Record<string, unknown> }>
  ): void {
    event.stopPropagation();
    const value = valueFromForm(this.field, event.detail.value[this.field.key]);
    if (value !== UNCHANGED) this.change(value);
  }

  // --- renderers by shape -------------------------------------------------------------------

  private renderNumber(): TemplateResult {
    const { label, unit, key } = this.field;
    const empty = this.value === null || this.value === undefined;
    return html`
      <ods-property-field
        .label=${label}
        .fieldKey=${`value-${key}`}
        .unit=${unit ?? ""}
        .value=${empty ? null : Number(this.value)}
        .min=${resolveLimit(this.field.min, this.display, -Infinity)}
        .max=${resolveLimit(this.field.max, this.display, Infinity)}
        .disabled=${this.disabled}
        @field-change=${this.onNumberChange}
      ></ods-property-field>
    `;
  }

  private renderBoolean(): TemplateResult {
    return html`
      <label class="switch-row">
        <span>${this.field.label}</span>
        <input
          type="checkbox"
          role="switch"
          aria-checked=${this.value ? "true" : "false"}
          aria-label=${this.field.label}
          .checked=${Boolean(this.value)}
          .disabled=${this.disabled}
          @change=${this.onSwitchChange}
        />
      </label>
    `;
  }

  private optionLabel(option: string): string {
    return this.field.optionLabels?.[option] ?? option;
  }

  private renderSegmented(options: string[]): TemplateResult {
    return html`
      <div class="segmented" role="group" aria-label=${this.field.label}>
        ${options.map(
          (option) => html`
            <button
              type="button"
              aria-pressed=${this.value === option ? "true" : "false"}
              .disabled=${this.disabled}
              @click=${() => this.change(option)}
            >
              ${this.optionLabel(option)}
            </button>
          `
        )}
      </div>
    `;
  }

  private renderSelect(options: string[], custom = false): TemplateResult {
    const current = String(this.value ?? "");
    const shown =
      custom && !options.includes(current) ? [...options, current] : options;
    return html`
      <div class="box ${this.disabled ? "disabled" : ""}">
        <select
          aria-label=${this.field.label}
          .disabled=${this.disabled}
          @change=${this.onTextChange}
        >
          ${shown.map(
            (option) => html`
              <option value=${option} ?selected=${option === current}>
                ${this.optionLabel(option)}
              </option>
            `
          )}
        </select>
      </div>
    `;
  }

  /** The nine dots of the anchor grid, the chosen one lit, as a small mark. */
  private renderAnchorMark(anchor: string): TemplateResult {
    return html`
      <span class="anchor-mark">
        ${ANCHOR_POSITIONS.map(
          (position) => html`
            <i class=${position === anchor ? "on" : ""}></i>
          `
        )}
      </span>
    `;
  }

  private renderAnchor(): TemplateResult {
    const anchor = String(this.value ?? "") || DEFAULT_ANCHOR;
    const name = isAnchorPosition(anchor) ? strings.anchors[anchor] : anchor;
    return html`
      <button
        type="button"
        class="box picker-trigger ${this.disabled ? "disabled" : ""}"
        aria-label=${this.field.label}
        aria-haspopup="dialog"
        data-value-field=${this.field.key}
        @click=${this.openAnchorPicker}
      >
        ${this.renderAnchorMark(anchor)}
        <span class="value">${anchor || "—"} · ${name}</span>
      </button>
    `;
  }

  private renderEnum(): TemplateResult {
    const options = this.field.options ?? [];
    if (this.field.key === "anchor") return this.renderAnchor();
    const short =
      options.length <= SEGMENTED_MAXIMUM &&
      options.every((option) => this.optionLabel(option).length <= 10);
    return short ? this.renderSegmented(options) : this.renderSelect(options);
  }

  private colorName(): string {
    const value = String(this.value ?? "");
    const found = PALETTE_SWATCHES[this.palette].find(
      (color) => color.value === value
    );
    return colorLabel(found?.id ?? value);
  }

  private renderColor(): TemplateResult {
    const value =
      this.value === null || this.value === undefined ? "" : String(this.value);
    const hex = value ? colorHex(value, this.palette) : undefined;
    const clearable = this.field.nullable && value !== "" && !this.disabled;
    return html`
      <div
        class="box picker-trigger color ${this.disabled ? "disabled" : ""}"
        role="button"
        tabindex="0"
        aria-label=${this.field.label}
        aria-haspopup="dialog"
        data-value-field=${this.field.key}
        @click=${this.openColorPicker}
        @keydown=${this.onTriggerKey}
      >
        <span
          class="swatch ${hex ? "" : "none"}"
          style=${hex ? `background:${hex}` : ""}
        ></span>
        <span class="value">
          ${value ? this.colorName() : strings.colors.none}
        </span>
        ${
          clearable
            ? html`
                <button
                  type="button"
                  class="clear"
                  aria-label=${strings.colors.clear}
                  @click=${this.clearColor}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              `
            : nothing
        }
      </div>
    `;
  }

  private onTriggerKey(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.openColorPicker(event);
    }
  }

  private renderText(): TemplateResult {
    if (this.field.shape === "text") {
      return html`
        <textarea
          class="compact"
          rows="3"
          aria-label=${this.field.label}
          .value=${String(this.value ?? "")}
          .disabled=${this.disabled}
          @change=${this.onTextChange}
        ></textarea>
      `;
    }
    return html`
      <div class="box ${this.disabled ? "disabled" : ""}">
        <input
          type="text"
          aria-label=${this.field.label}
          .value=${String(this.value ?? "")}
          .disabled=${this.disabled}
          @change=${this.onTextChange}
        />
      </div>
    `;
  }

  /** The points of a polygon are edited row by row. */
  private renderPoints(): TemplateResult {
    return html`
      <ods-points-field
        .field=${this.field}
        .value=${this.value}
        .disabled=${this.disabled}
      ></ods-points-field>
    `;
  }

  /** Icons and images have their own fields, with a picker of Home Assistant's choices. */
  private renderIcon(): TemplateResult {
    return html`
      <ods-icon-field
        .hass=${this.hass}
        .field=${this.field}
        .value=${this.value}
        .disabled=${this.disabled}
      ></ods-icon-field>
    `;
  }

  private renderImage(): TemplateResult {
    return html`
      <ods-image-field
        .hass=${this.hass}
        .field=${this.field}
        .value=${String(this.value ?? "")}
        .disabled=${this.disabled}
      ></ods-image-field>
    `;
  }

  private renderFlags(): TemplateResult {
    const chosen = new Set(String(this.value ?? "").split(","));
    return html`
      <div class="chips" role="group" aria-label=${this.field.label}>
        ${(this.field.options ?? []).map(
          (option) => html`
            <button
              type="button"
              aria-pressed=${chosen.has(option) ? "true" : "false"}
              .disabled=${this.disabled}
              @click=${() => this.toggleFlag(option)}
            >
              ${option.replaceAll("_", " ")}
            </button>
          `
        )}
      </div>
    `;
  }

  /** The series of a plot are cards with an entity picker each. */
  private renderSeries(): TemplateResult {
    return html`
      <ods-series-field
        .hass=${this.hass}
        .field=${this.field}
        .value=${this.value}
        .palette=${this.palette}
        .disabled=${this.disabled}
      ></ods-series-field>
    `;
  }

  /** Nested settings keep Home Assistant's own editor: they are rare and structured. */
  private renderNested(): TemplateResult {
    if (isSeriesField(this.field)) return this.renderSeries();
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ [this.field.key]: valueForForm(this.field, this.value) }}
        .schema=${[fieldFormSchema(this.field, this.palette)]}
        .computeLabel=${(entry: { label: string }) => entry.label}
        @value-changed=${this.onFormChange}
      ></ha-form>
    `;
  }

  /** Short controls carry their label inside; the rest have it above. */
  private isLabelledInside(): boolean {
    return (
      this.field.shape === "icon" ||
      this.field.shape === "icons" ||
      this.field.shape === "image" ||
      this.field.shape === "number" ||
      this.field.shape === "coordinate" ||
      this.field.shape === "boolean" ||
      this.field.shape === "object" ||
      (this.field.shape === "objects" && !isSeriesField(this.field))
    );
  }

  private renderControl(): TemplateResult {
    switch (this.field.shape) {
      case "number":
      case "coordinate":
        return this.renderNumber();
      case "boolean":
        return this.renderBoolean();
      case "enum":
        return this.renderEnum();
      case "color":
        return this.renderColor();
      case "font":
        return this.renderSelect(this.field.options ?? [], true);
      case "flags":
        return this.renderFlags();
      case "icon":
      case "icons":
        return this.renderIcon();
      case "image":
        return this.renderImage();
      case "points":
        return this.renderPoints();
      case "object":
      case "objects":
        return this.renderNested();
      default:
        return this.renderText();
    }
  }

  private renderPicker(): TemplateResult | typeof nothing {
    const picker = this.picker;
    if (!picker) return nothing;
    const isColor = picker.kind === "color";
    return html`
      <ods-popover
        .heading=${this.field.label}
        .anchor=${picker.anchor}
        .width=${isColor ? 232 : 96}
        @popover-close=${this.closePicker}
      >
        ${
          isColor
            ? html`
                <ods-color-picker
                  .palette=${this.palette}
                  .value=${String(this.value ?? "")}
                  .nullable=${Boolean(this.field.nullable)}
                  @color-change=${this.onColorChange}
                ></ods-color-picker>
              `
            : html`
                <ods-anchor-picker
                  .value=${String(this.value ?? "") || DEFAULT_ANCHOR}
                  @anchor-change=${this.onAnchorChange}
                ></ods-anchor-picker>
              `
        }
      </ods-popover>
    `;
  }

  protected render(): TemplateResult {
    const label = this.isLabelledInside()
      ? nothing
      : html`
          <span class="field-label">${this.field.label}</span>
        `;
    return html`
      ${label} ${this.renderControl()} ${this.renderPicker()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-value-field": OdsValueField;
  }
}
