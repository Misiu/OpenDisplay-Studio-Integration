import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { emit, type OdsEvent } from "./events";
import { storedIconName } from "./ods-icon-picker";
import { listIcons } from "./studio-api";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";
import type { HomeAssistant, PrimitiveField } from "./types";
import "./ods-icon-picker";
import "./ods-popover";

const MDI = "mdi:";
const REOPEN_GUARD_MS = 250;
const NEW_ICON = -1;

/**
 * An icon field: one icon (`icon`) or a row of them (`icons`). A click opens the picker
 * with every icon the renderer can draw. A row can be added to, reordered and trimmed.
 * It reports the stored value with `primitive-field-change`.
 */
@customElement("ods-icon-field")
export class OdsIconField extends LitElement {
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
      .trigger ha-icon,
      .chip ha-icon {
        --mdi-icon-size: 18px;
        width: 18px;
        height: 18px;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        height: 30px;
        padding: 0 2px 0 4px;
        border: 1px solid var(--studio-border);
        border-radius: 7px;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .chip button,
      .add {
        display: grid;
        place-items: center;
        min-width: 18px;
        height: 22px;
        padding: 0 2px;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: var(--studio-muted);
        font-size: 11px;
      }
      .chip button:hover,
      .add:hover {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
      .chip .icon {
        color: var(--studio-text);
      }
      .add {
        height: 30px;
        min-width: 30px;
        border: 1px dashed var(--studio-border);
        border-radius: 7px;
      }
      .chip button.edge {
        font-size: 9px;
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public field!: PrimitiveField;
  /** The stored value: a name, or a list of names. */
  @property({ attribute: false }) public value: unknown;
  @property({ type: Boolean }) public disabled = false;

  @state() private open?: { index: number; anchor: DOMRect };
  @state() private names: string[] = [];
  private closedAt = 0;

  private get isList(): boolean {
    return this.field.shape === "icons";
  }

  private get icons(): string[] {
    return Array.isArray(this.value) ? this.value.map(String) : [];
  }

  private change(value: unknown): void {
    emit(this, "primitive-field-change", { key: this.field.key, value });
  }

  // --- the picker ------------------------------------------------------------------------

  private async loadNames(): Promise<void> {
    if (this.names.length > 0 || !this.hass) return;
    try {
      this.names = await listIcons(this.hass);
    } catch {
      // Without the list the picker is empty and says so; the icon can still be removed.
      this.names = [];
    }
  }

  private openAt(index: number, event: Event): void {
    if (this.disabled || Date.now() - this.closedAt < REOPEN_GUARD_MS) return;
    const trigger = event.currentTarget;
    if (!(trigger instanceof HTMLElement)) return;
    this.open = { index, anchor: trigger.getBoundingClientRect() };
    void this.loadNames();
  }

  private openSingle(event: Event): void {
    this.openAt(0, event);
  }

  private openNew(event: Event): void {
    this.openAt(NEW_ICON, event);
  }

  private close(): void {
    this.closedAt = Date.now();
    this.open = undefined;
  }

  private onIconChange(event: OdsEvent<"icon-change">): void {
    const icon = storedIconName(event.detail.icon);
    const index = this.open?.index ?? 0;
    if (!this.isList) {
      this.change(icon);
    } else if (index === NEW_ICON) {
      this.change([...this.icons, icon]);
    } else {
      this.change(this.icons.map((entry, at) => (at === index ? icon : entry)));
    }
    this.close();
  }

  // --- the row ----------------------------------------------------------------------------

  private removeAt(index: number): void {
    const rest = this.icons.filter((_, at) => at !== index);
    // A row needs at least one icon.
    if (rest.length > 0) this.change(rest);
  }

  private move(index: number, by: -1 | 1): void {
    const icons = [...this.icons];
    const target = index + by;
    if (target < 0 || target >= icons.length) return;
    [icons[index], icons[target]] = [icons[target], icons[index]];
    this.change(icons);
  }

  private renderChip(icon: string, index: number): TemplateResult {
    return html`
      <span class="chip" data-icon=${icon}>
        <button
          type="button"
          class="edge"
          aria-label=${strings.iconPicker.left}
          .disabled=${this.disabled || index === 0}
          @click=${() => this.move(index, -1)}
        >
          ‹
        </button>
        <button
          type="button"
          class="icon"
          title=${icon}
          aria-label=${icon}
          .disabled=${this.disabled}
          @click=${(event: Event) => this.openAt(index, event)}
        >
          <ha-icon icon=${`${MDI}${storedIconName(icon)}`}></ha-icon>
        </button>
        <button
          type="button"
          class="edge"
          aria-label=${strings.iconPicker.right}
          .disabled=${this.disabled || index === this.icons.length - 1}
          @click=${() => this.move(index, 1)}
        >
          ›
        </button>
        <button
          type="button"
          aria-label=${`${strings.iconPicker.remove}: ${icon}`}
          .disabled=${this.disabled || this.icons.length === 1}
          @click=${() => this.removeAt(index)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </span>
    `;
  }

  private renderList(): TemplateResult {
    return html`
      <div class="chips" role="group" aria-label=${this.field.label}>
        ${this.icons.map((icon, index) => this.renderChip(icon, index))}
        <button
          type="button"
          class="add"
          title=${strings.iconPicker.add}
          aria-label=${strings.iconPicker.add}
          .disabled=${this.disabled}
          @click=${this.openNew}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
    `;
  }

  private renderSingle(): TemplateResult {
    const name = storedIconName(String(this.value ?? ""));
    return html`
      <button
        type="button"
        class="box trigger ${this.disabled ? "disabled" : ""}"
        aria-label=${this.field.label}
        aria-haspopup="dialog"
        @click=${this.openSingle}
      >
        ${
          name
            ? html`
                <ha-icon icon=${`${MDI}${name}`}></ha-icon>
              `
            : nothing
        }
        <span class="name">${name || strings.iconPicker.empty}</span>
      </button>
    `;
  }

  private renderPicker(): TemplateResult | typeof nothing {
    if (!this.open) return nothing;
    const current = this.isList
      ? (this.icons[this.open.index] ?? "")
      : String(this.value ?? "");
    return html`
      <ods-popover
        .heading=${this.field.label}
        .anchor=${this.open.anchor}
        .width=${268}
        @popover-close=${this.close}
      >
        <ods-icon-picker
          .icons=${this.names}
          .value=${current}
          @icon-change=${this.onIconChange}
        ></ods-icon-picker>
      </ods-popover>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <span class="field-label">${this.field.label}</span>
      ${this.isList ? this.renderList() : this.renderSingle()}
      ${this.renderPicker()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-icon-field": OdsIconField;
  }
}
