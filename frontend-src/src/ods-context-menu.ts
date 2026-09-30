import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import { baseStyles } from "./studio-styles";

export interface ContextMenuEntry {
  id: string;
  label: string;
  icon: string;
  danger?: boolean;
}

/** A vertical menu of actions. The owner decides where it sits and when it closes. */
@customElement("ods-context-menu")
export class OdsContextMenu extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        width: 190px;
      }
      .menu {
        padding: 5px;
        border: 1px solid var(--studio-border);
        border-radius: 10px;
        background: var(--studio-surface);
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18);
      }
      .menu button {
        width: 100%;
        min-height: 36px;
        display: grid;
        grid-template-columns: 20px minmax(0, 1fr);
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
      .menu button:hover,
      .menu button:focus-visible {
        outline: 0;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .menu button.delete {
        margin-top: 4px;
        border-top: 1px solid var(--studio-border);
        border-radius: 0 0 6px 6px;
        color: var(--error-color, #db4437);
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

  protected render(): TemplateResult {
    return html`
      <div class="menu" role="menu" aria-label=${this.label}>
        ${this.entries.map(
          (entry) => html`
            <button
              class=${entry.danger ? "delete" : ""}
              role="menuitem"
              @click=${(event: Event) => {
                event.stopPropagation();
                emit(this, "menu-select", { id: entry.id });
              }}
            >
              <ha-icon icon=${entry.icon}></ha-icon>
              <span>${entry.label}</span>
            </button>
          `
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-context-menu": OdsContextMenu;
  }
}
