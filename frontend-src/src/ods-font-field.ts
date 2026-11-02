import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { emit } from "./events";
import { fontByName, fontLabel, loadFonts } from "./font-catalog";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";
import type { FontInfo, HomeAssistant, PrimitiveField } from "./types";
import "./ods-font-sample";
import "./ods-popover";

const REOPEN_GUARD_MS = 250;
const POPOVER_WIDTH = 400;

/**
 * A font field. The control shows the chosen font in its own letters; a click opens the list
 * of every installed font, each with its name and style and a picture of it. It reports the
 * file name with `primitive-field-change`.
 */
@customElement("ods-font-field")
export class OdsFontField extends LitElement {
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
      .option ods-font-sample {
        --ods-sample-size: 18px;
      }
      .trigger .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .trigger .name.missing {
        color: var(--error-color, #db4437);
      }
      .list {
        display: grid;
        max-height: 320px;
        margin: 0;
        padding: 0;
        overflow: auto;
        list-style: none;
      }
      .option {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: 40px;
        padding: 3px 8px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: var(--studio-text);
        text-align: start;
      }
      .option:hover,
      .option:focus-visible {
        background: var(--studio-accent-soft);
        outline: 0;
      }
      .option[aria-selected="true"] {
        background: var(--studio-accent-soft);
        box-shadow: inset 3px 0 0 var(--studio-accent);
      }
      .option .family {
        display: block;
        overflow: hidden;
        font-size: 12px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .option .style {
        display: block;
        color: var(--studio-muted);
        font-size: 10px;
      }
      .message {
        padding: 10px;
        color: var(--studio-muted);
        font-size: 12px;
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public field!: PrimitiveField;
  /** The file name of the chosen font. */
  @property({ attribute: false }) public value: unknown;
  @property({ type: Boolean }) public disabled = false;

  @state() private fonts: FontInfo[] = [];
  @state() private loaded = false;
  @state() private anchor?: DOMRect;
  private closedAt = 0;

  connectedCallback(): void {
    super.connectedCallback();
    void this.loadList();
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("hass") && !this.loaded) void this.loadList();
  }

  private get chosen(): string {
    return String(this.value ?? "");
  }

  private async loadList(): Promise<void> {
    if (!this.hass) return;
    try {
      this.fonts = await loadFonts(this.hass);
    } catch {
      // Without the list the control shows the file name; the font can still be kept.
      this.fonts = [];
    }
    this.loaded = true;
  }

  private open(event: Event): void {
    if (this.disabled || Date.now() - this.closedAt < REOPEN_GUARD_MS) return;
    const trigger = event.currentTarget;
    if (!(trigger instanceof HTMLElement)) return;
    this.anchor = trigger.getBoundingClientRect();
    void this.loadList();
  }

  private close(): void {
    this.closedAt = Date.now();
    this.anchor = undefined;
  }

  private choose(font: FontInfo): void {
    emit(this, "primitive-field-change", {
      key: this.field.key,
      value: font.name,
    });
    this.close();
  }

  private renderCurrent(): TemplateResult {
    const font = fontByName(this.fonts, this.chosen);
    if (font) {
      // Only the name: the samples are in the list that opens, one per font.
      return html`
        <span class="name">${fontLabel(font)}</span>
      `;
    }
    const missing = this.loaded && this.chosen !== "";
    const text = missing
      ? strings.fontField.missing(this.chosen)
      : this.chosen || strings.fontField.choose;
    return html`
      <span class="name ${missing ? "missing" : ""}">${text}</span>
    `;
  }

  private renderOption(font: FontInfo): TemplateResult {
    const selected = font.name === this.chosen;
    return html`
      <li>
        <button
          type="button"
          role="option"
          class="option"
          data-font=${font.name}
          aria-selected=${selected ? "true" : "false"}
          @click=${() => this.choose(font)}
        >
          <span>
            <span class="family">${font.family}</span>
            <span class="style">${font.style}</span>
          </span>
          <ods-font-sample .hass=${this.hass} .font=${font}></ods-font-sample>
        </button>
      </li>
    `;
  }

  private renderList(): TemplateResult {
    if (!this.loaded) {
      return html`
        <p class="message">${strings.fontField.loading}</p>
      `;
    }
    return html`
      <ul class="list" role="listbox" aria-label=${this.field.label}>
        ${this.fonts.map((font) => this.renderOption(font))}
      </ul>
    `;
  }

  private renderPopover(): TemplateResult | typeof nothing {
    if (!this.anchor) return nothing;
    return html`
      <ods-popover
        .heading=${this.field.label}
        .anchor=${this.anchor}
        .width=${POPOVER_WIDTH}
        @popover-close=${this.close}
      >
        ${this.renderList()}
      </ods-popover>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <span class="field-label">${this.field.label}</span>
      <button
        type="button"
        class="box trigger ${this.disabled ? "disabled" : ""}"
        aria-label=${this.field.label}
        aria-haspopup="listbox"
        .disabled=${this.disabled}
        @click=${this.open}
      >
        ${this.renderCurrent()}
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </button>
      ${this.renderPopover()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-font-field": OdsFontField;
  }
}
