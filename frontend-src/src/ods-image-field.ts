import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { emit, type OdsEvent } from "./events";
import { imageKind } from "./image-source";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";
import type { HomeAssistant, PrimitiveField } from "./types";
import "./ods-image-picker";
import "./ods-popover";

const REOPEN_GUARD_MS = 250;

const KIND_ICONS = {
  entity: "mdi:cctv",
  web: "mdi:web",
  file: "mdi:file-image-outline",
  other: "mdi:image-off-outline",
} as const;

/**
 * The picture of an image element: the source it has, which opens the picker with the
 * media browser, the camera and image entities and a field for an address. It reports the
 * stored source with `primitive-field-change`.
 */
@customElement("ods-image-field")
export class OdsImageField extends LitElement {
  static styles = [
    baseStyles,
    fieldStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .trigger {
        width: 100%;
        height: 30px;
        cursor: pointer;
        text-align: start;
      }
      .trigger .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-family: var(--code-font-family, monospace);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .trigger ha-icon {
        --mdi-icon-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--studio-muted);
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public field!: PrimitiveField;
  @property() public value = "";
  @property({ type: Boolean }) public disabled = false;

  @state() private anchor?: DOMRect;
  private closedAt = 0;

  private openPicker(event: Event): void {
    if (this.disabled || Date.now() - this.closedAt < REOPEN_GUARD_MS) return;
    const trigger = event.currentTarget;
    if (trigger instanceof HTMLElement) {
      this.anchor = trigger.getBoundingClientRect();
    }
  }

  private close(): void {
    this.closedAt = Date.now();
    this.anchor = undefined;
  }

  private onImageChange(event: OdsEvent<"image-change">): void {
    emit(this, "primitive-field-change", {
      key: this.field.key,
      value: event.detail.image,
    });
    this.close();
  }

  private renderPicker(): TemplateResult | typeof nothing {
    if (!this.anchor) return nothing;
    return html`
      <ods-popover
        .heading=${this.field.label}
        .anchor=${this.anchor}
        .width=${288}
        @popover-close=${this.close}
      >
        <ods-image-picker
          .hass=${this.hass}
          .value=${this.value}
          @image-change=${this.onImageChange}
        ></ods-image-picker>
      </ods-popover>
    `;
  }

  protected render(): TemplateResult {
    const kind = imageKind(this.value);
    return html`
      <span class="field-label">${this.field.label}</span>
      <button
        type="button"
        class="box trigger ${this.disabled ? "disabled" : ""}"
        aria-label=${this.field.label}
        aria-haspopup="dialog"
        title=${this.value}
        @click=${this.openPicker}
      >
        <ha-icon icon=${KIND_ICONS[kind]}></ha-icon>
        <span class="name">${this.value || strings.imagePicker.empty}</span>
      </button>
      ${this.renderPicker()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-image-field": OdsImageField;
  }
}
