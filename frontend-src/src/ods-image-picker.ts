import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import { imageKind, mediaReference } from "./image-source";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";
import type { HomeAssistant } from "./types";

/**
 * Chooses the picture of an image element, from Home Assistant: a file of the media
 * browser, a camera or image entity, or a web address typed by hand. It reports the
 * source as the backend reads it with `image-change`.
 */
@customElement("ods-image-picker")
export class OdsImagePicker extends LitElement {
  static styles = [
    baseStyles,
    fieldStyles,
    css`
      :host {
        display: grid;
        gap: 10px;
      }
      .hint {
        margin: 0;
        color: var(--studio-muted);
        font-size: 10px;
        line-height: 1.4;
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property() public value = "";

  private choose(image: string): void {
    emit(this, "image-change", { image });
  }

  private onAddress(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.choose(event.target.value.trim());
    }
  }

  /**
   * The media selector reports `{ media_content_id }`. A source that is no file is reported
   * as a warning when the image is drawn.
   */
  private onMedia(
    event: CustomEvent<{ value: Record<string, unknown> }>
  ): void {
    event.stopPropagation();
    const chosen = event.detail.value.media;
    const id =
      typeof chosen === "object" &&
      chosen !== null &&
      "media_content_id" in chosen
        ? String(chosen.media_content_id)
        : String(chosen ?? "");
    const path = mediaReference(id);
    if (path) this.choose(path);
  }

  private onEntity(
    event: CustomEvent<{ value: Record<string, unknown> }>
  ): void {
    event.stopPropagation();
    const entity = event.detail.value.entity;
    if (typeof entity === "string" && entity !== "") this.choose(entity);
  }

  private renderForm(
    name: string,
    label: string,
    selector: Record<string, unknown>,
    changed: (event: CustomEvent<{ value: Record<string, unknown> }>) => void
  ): TemplateResult {
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ [name]: "" }}
        .schema=${[{ name, label, selector }]}
        .computeLabel=${(entry: { label: string }) => entry.label}
        @value-changed=${changed}
      ></ha-form>
    `;
  }

  protected render(): TemplateResult {
    const kind = imageKind(this.value);
    return html`
      <label>
        <span class="field-label">${strings.imagePicker.address}</span>
        <span class="box">
          <input
            class="mono"
            type="text"
            aria-label=${strings.imagePicker.address}
            .value=${this.value}
            @change=${this.onAddress}
          />
        </span>
      </label>
      ${this.renderForm(
        "media",
        strings.imagePicker.media,
        { media: { accept: ["image/*"] } },
        this.onMedia
      )}
      ${this.renderForm(
        "entity",
        strings.imagePicker.entity,
        { entity: { domain: ["camera", "image"] } },
        this.onEntity
      )}
      <p class="hint">
        ${kind === "other" && this.value ? strings.imagePicker.unsupported : strings.imagePicker.hint}
      </p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-image-picker": OdsImagePicker;
  }
}
