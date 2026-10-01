import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import { baseStyles } from "./studio-styles";

export interface ContextMenuEntry {
  id: string;
  label: string;
  icon: string;
  /** The shortcut as the platform writes it, shown at the right. */
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  /** Draws a separator above the entry. */
  separatorBefore?: boolean;
}

/** A vertical menu of actions. The owner decides where it sits and when it closes. */
@customElement("ods-context-menu")
export class OdsContextMenu extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        width: 228px;
      }
      .menu {
        padding: 5px;
        border: 1px solid var(--studio-border);
        border-radius: 8px;
        background: var(--studio-surface);
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18);
      }
      .menu button {
        width: 100%;
        min-height: 36px;
        display: grid;
        grid-template-columns: 20px minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        padding: 0 9px;
        border: 0;
        border-radius: 6px;
        text-align: start;
        color: var(--studio-text);
        background: transparent;
        font-size: 12px;
      }
      .menu button:hover:not(:disabled),
      .menu button:focus-visible {
        outline: 0;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .menu button:disabled {
        cursor: default;
        opacity: 0.4;
      }
      .menu button.delete {
        color: var(--error-color, #db4437);
      }
      .menu .separator {
        height: 1px;
        margin: 4px 2px;
        background: var(--studio-border);
      }
      .menu .shortcut {
        color: var(--studio-muted);
        font-size: 11px;
        letter-spacing: 0.04em;
      }
      .menu ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }
    `,
  ];

  @property({ attribute: false }) public entries: ContextMenuEntry[] = [];
  @property() public label = "";

  private select(event: Event, entry: ContextMenuEntry): void {
    event.stopPropagation();
    emit(this, "menu-select", { id: entry.id });
  }

  private renderEntry(entry: ContextMenuEntry): TemplateResult {
    return html`
      ${
        entry.separatorBefore
          ? html`
              <div class="separator" role="separator"></div>
            `
          : nothing
      }
      <button
        class=${entry.danger ? "delete" : ""}
        role="menuitem"
        data-command=${entry.id}
        ?disabled=${entry.disabled}
        @click=${(event: Event) => this.select(event, entry)}
      >
        <ha-icon icon=${entry.icon}></ha-icon>
        <span>${entry.label}</span>
        <span class="shortcut">${entry.shortcut ?? ""}</span>
      </button>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="menu" role="menu" aria-label=${this.label}>
        ${this.entries.map((entry) => this.renderEntry(entry))}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-context-menu": OdsContextMenu;
  }
}
