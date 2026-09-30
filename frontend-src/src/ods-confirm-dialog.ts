import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";

/** A modal asking the user to confirm an action; clicking outside it cancels. */
@customElement("ods-confirm-dialog")
export class OdsConfirmDialog extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .scrim {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: grid;
        place-items: center;
        padding: 20px;
        background: rgba(8, 15, 24, 0.62);
        backdrop-filter: blur(3px);
      }
      .dialog {
        width: min(430px, 100%);
        max-height: calc(100vh - 40px);
        overflow: auto;
        border-radius: 14px;
        background: var(--studio-surface);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
      }
      .dialog > header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px 12px;
      }
      .dialog h2 {
        margin: 3px 0 0;
        font-size: 21px;
      }
      .dialog > p {
        margin: 0;
        padding: 4px 20px 18px;
        color: var(--studio-muted);
        font-size: 13px;
        line-height: 1.5;
      }
      .dialog footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 14px 20px;
        border-top: 1px solid var(--studio-border);
      }
      .confirm {
        color: var(--error-color, #db4437);
      }
    `,
  ];

  @property() public eyebrow = "";
  @property() public heading = "";
  @property() public body = "";
  @property() public confirmLabel = "";

  private cancel(): void {
    emit(this, "confirm-cancel");
  }

  private accept(): void {
    emit(this, "confirm-accept");
  }

  /** Only a click on the backdrop itself cancels, not one that bubbles up from the dialog. */
  private onScrimClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }

  protected render(): TemplateResult {
    return html`
      <div class="scrim" role="presentation" @click=${this.onScrimClick}>
        <section
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <header>
            <div>
              <span class="eyebrow">${this.eyebrow}</span>
              <h2 id="confirm-title">${this.heading}</h2>
            </div>
            <button
              class="icon-button"
              aria-label=${strings.common.close}
              @click=${this.cancel}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <p>${this.body}</p>
          <footer>
            <ha-button appearance="plain" @click=${this.cancel}>
              ${strings.common.cancel}
            </ha-button>
            <ha-button
              class="confirm"
              appearance="filled"
              @click=${this.accept}
            >
              ${this.confirmLabel}
            </ha-button>
          </footer>
        </section>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-confirm-dialog": OdsConfirmDialog;
  }
}
