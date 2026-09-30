import {
  css,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { baseStyles, chromeStyles } from "./studio-styles";
import { strings } from "./strings";
import type { ComposePreviewResponse } from "./types";

type CopyState = "idle" | "copied" | "failed";

const COPY_ICONS: Record<CopyState, string> = {
  idle: "mdi:content-copy",
  copied: "mdi:check",
  failed: "mdi:alert-circle-outline",
};
const COPY_FEEDBACK_MS = 2200;

/** Read-only generated ODL YAML with a copy button. */
@customElement("ods-code-view")
export class OdsCodeView extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .code-workspace {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: clamp(18px, 3vw, 36px);
        background: var(--primary-background-color, #f5f7f8);
      }
      .code-panel {
        width: min(1080px, 100%);
        min-height: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-inline: auto;
        padding: clamp(16px, 2vw, 24px);
        border: 1px solid var(--studio-border);
        border-radius: 12px;
        background: var(--studio-surface);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }
      .code-panel > header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }
      .code-panel h1 {
        margin: 4px 0 0;
        font-size: 20px;
      }
      .code-panel p {
        margin: 5px 0 0;
        color: var(--studio-muted);
        font-size: 12px;
      }
      .code-panel textarea {
        flex: 1;
        min-height: 420px;
        width: 100%;
        resize: none;
        padding: 15px;
        border: 1px solid var(--studio-border);
        border-radius: 9px;
        outline: 0;
        color: #d9e4ee;
        background: #121a24;
        font: 12px/1.55 var(--code-font-family, monospace);
        white-space: pre;
        tab-size: 2;
      }
      .code-panel textarea:focus {
        border-color: var(--studio-accent);
        box-shadow: 0 0 0 1px var(--studio-accent);
      }
      .copy-status {
        min-height: 16px;
        color: var(--studio-muted);
        font-size: 11px;
        text-align: end;
      }
      @media (max-width: 600px) {
        .code-workspace {
          padding: 10px;
        }
        .code-panel {
          padding: 13px;
        }
        .code-panel > header {
          align-items: stretch;
          flex-direction: column;
        }
      }
    `,
  ];

  @property({ attribute: false }) public preview?: ComposePreviewResponse;
  @state() private copyState: CopyState = "idle";
  private copyTimer?: number;

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("preview")) this.copyState = "idle";
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.copyTimer) window.clearTimeout(this.copyTimer);
  }

  private async copy(): Promise<void> {
    if (!this.preview?.yaml) return;
    if (this.copyTimer) window.clearTimeout(this.copyTimer);
    try {
      await navigator.clipboard.writeText(this.preview.yaml);
      this.copyState = "copied";
    } catch {
      this.copyState = "failed";
    }
    this.copyTimer = window.setTimeout(() => {
      this.copyState = "idle";
    }, COPY_FEEDBACK_MS);
  }

  protected render(): TemplateResult {
    return html`
      <main class="code-workspace">
        <section class="code-panel" aria-labelledby="generated-code-title">
          <header>
            <div>
              <span class="eyebrow">${strings.code.eyebrow}</span>
              <h1 id="generated-code-title">${strings.code.title}</h1>
              <p>${strings.code.description}</p>
            </div>
            <ha-button
              appearance="plain"
              aria-label=${strings.code.copyLabel}
              .disabled=${!this.preview?.yaml}
              @click=${this.copy}
            >
              <ha-icon
                slot="start"
                .icon=${COPY_ICONS[this.copyState]}
              ></ha-icon>
              ${strings.code.copy[this.copyState]}
            </ha-button>
          </header>
          ${
            this.preview?.warnings.map(
              (warning) => html`
                <ha-alert alert-type="warning">${warning}</ha-alert>
              `
            ) ?? nothing
          }
          <textarea
            aria-label=${strings.code.yaml}
            readonly
            spellcheck="false"
            dir="ltr"
            .value=${this.preview?.yaml ?? ""}
          ></textarea>
          <output class="copy-status" aria-live="polite">
            ${strings.code.status[this.copyState]}
          </output>
        </section>
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-code-view": OdsCodeView;
  }
}
