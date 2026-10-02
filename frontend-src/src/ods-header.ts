import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { inputValue } from "./dom";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";
import type { Dashboard } from "./types";

/** The editor's top bar: breadcrumb, Design/Code switch, status and save. */
@customElement("ods-header")
export class OdsHeader extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .topbar {
        flex: none;
        height: calc(
          var(--header-height, 56px) + var(--safe-area-inset-top, 0px)
        );
        min-height: 0;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        align-items: center;
        gap: 14px;
        padding: var(--safe-area-inset-top, 0px) 14px 0;
        border-bottom: 1px solid var(--studio-border);
        background: var(--studio-surface);
        z-index: 5;
      }
      .editor-breadcrumb {
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        overflow: hidden;
        white-space: nowrap;
      }
      .studio-name {
        flex: none;
        font-size: 14px;
        letter-spacing: -0.01em;
      }
      .breadcrumb-divider {
        flex: none;
        color: var(--studio-border);
      }
      .breadcrumb-link {
        flex: none;
        min-height: 30px;
        padding: 0 3px;
        border: 0;
        color: var(--studio-accent);
        background: transparent;
        font-size: 12px;
        font-weight: 600;
      }
      .breadcrumb-link:hover {
        text-decoration: underline;
      }
      .dashboard-name {
        min-width: 80px;
        width: min(210px, 18vw);
        height: 32px;
        border: 1px solid transparent;
        border-radius: 7px;
        padding: 0 7px;
        background: transparent;
        font-size: 12px;
        font-weight: 600;
        text-overflow: ellipsis;
      }
      .dashboard-name:hover,
      .dashboard-name:focus {
        border-color: var(--studio-border);
        background: var(--secondary-background-color, #f3f5f6);
        outline: 0;
      }
      .view-switch {
        display: inline-flex;
        align-items: center;
        padding: 3px;
        border: 1px solid var(--studio-border);
        border-radius: 9px;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .view-switch button {
        min-height: 30px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0 12px;
        border: 0;
        border-radius: 6px;
        color: var(--studio-muted);
        background: transparent;
        font-size: 11px;
        font-weight: 700;
      }
      .view-switch button.active {
        color: var(--studio-text);
        background: var(--studio-surface);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      }
      .view-switch ha-icon {
        width: 15px;
        height: 15px;
        --mdc-icon-size: 15px;
      }
      .editor-actions {
        min-width: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 4px;
      }
      @media (max-width: 900px) {
        .topbar {
          height: auto;
          min-height: calc(
            var(--header-height, 56px) + var(--safe-area-inset-top, 0px)
          );
          grid-template-columns: minmax(0, 1fr) auto;
          grid-template-areas: "breadcrumb actions" "switch switch";
          gap: 5px 10px;
          padding: calc(var(--safe-area-inset-top, 0px) + 6px) 9px 6px;
        }
        .editor-breadcrumb {
          grid-area: breadcrumb;
        }
        .studio-name,
        .editor-actions .status {
          display: none;
        }
        .dashboard-name {
          width: min(180px, 36vw);
        }
        .view-switch {
          grid-area: switch;
          justify-self: center;
        }
        .editor-actions {
          grid-area: actions;
        }
      }
      @media (max-width: 600px) {
        .breadcrumb-divider:first-of-type {
          display: none;
        }
        .editor-actions ha-button:first-of-type {
          display: none;
        }
      }
    `,
  ];

  @property({ attribute: false }) public dashboard!: Dashboard;
  @property() public view: "design" | "code" = "design";
  @property({ type: Boolean }) public dirty = false;
  @property({ type: Boolean }) public saving = false;
  @property({ type: Boolean }) public sending = false;

  private onNameInput(event: Event): void {
    emit(this, "dashboard-name-change", { name: inputValue(event) });
  }

  private get statusToggleLabel(): string {
    return this.dashboard.status === "ready"
      ? strings.header.setDraft
      : strings.header.setReady;
  }

  private sendToDevice(): void {
    emit(this, "send-to-device");
  }

  private renderFileButtons(): TemplateResult {
    return html`
      <ha-button
        appearance="plain"
        title=${strings.header.exportTitle}
        @click=${() => emit(this, "dashboard-export")}
      >
        <ha-icon slot="start" icon="mdi:download"></ha-icon>
        ${strings.header.exportDashboard}
      </ha-button>
      <ha-button
        appearance="plain"
        title=${strings.header.importTitle}
        @click=${() => emit(this, "dashboard-import")}
      >
        <ha-icon slot="start" icon="mdi:upload"></ha-icon>
        ${strings.header.importDashboard}
      </ha-button>
    `;
  }

  /** The button that tries the design on the device the dashboard is made for. */
  private renderSendButton(): TemplateResult | typeof nothing {
    if (!this.dashboard.display.deviceId) return nothing;
    return html`
      <ha-button
        appearance="plain"
        .disabled=${this.sending}
        @click=${this.sendToDevice}
      >
        <ha-icon slot="start" icon="mdi:send"></ha-icon>
        ${this.sending ? strings.header.sendingToDevice : strings.header.sendToDevice}
      </ha-button>
    `;
  }

  protected render(): TemplateResult {
    const dashboard = this.dashboard;
    return html`
      <header class="topbar">
        <div class="editor-breadcrumb">
          <strong class="studio-name">${strings.header.studio}</strong>
          <span class="breadcrumb-divider">/</span>
          <button
            class="breadcrumb-link"
            @click=${() => emit(this, "show-dashboards")}
          >
            ${strings.header.dashboards}
          </button>
          <span class="breadcrumb-divider">/</span>
          <input
            class="dashboard-name"
            aria-label=${strings.header.name}
            .value=${dashboard.name}
            @input=${this.onNameInput}
          />
        </div>
        <nav class="view-switch" aria-label=${strings.header.view}>
          <button
            class=${this.view === "design" ? "active" : ""}
            aria-pressed=${this.view === "design"}
            @click=${() => emit(this, "view-change", { view: "design" })}
          >
            <ha-icon icon="mdi:tools"></ha-icon>
            ${strings.header.design}
          </button>
          <button
            class=${this.view === "code" ? "active" : ""}
            aria-pressed=${this.view === "code"}
            @click=${() => emit(this, "view-change", { view: "code" })}
          >
            <ha-icon icon="mdi:code-tags"></ha-icon>
            ${strings.header.code}
          </button>
        </nav>
        <div class="editor-actions">
          ${this.renderFileButtons()} ${this.renderSendButton()}
          <span class="status ${dashboard.status}">${dashboard.status}</span>
          <ha-button
            appearance="plain"
            @click=${() => emit(this, "toggle-ready")}
          >
            ${this.statusToggleLabel}
          </ha-button>
          <button
            class="icon-button"
            title=${strings.header.help}
            aria-label=${strings.header.help}
            @click=${() => emit(this, "help-open")}
          >
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <ha-button
            appearance="filled"
            .disabled=${!this.dirty || this.saving}
            @click=${() => emit(this, "dashboard-save")}
          >
            ${this.saving ? strings.header.saving : strings.header.save}
          </ha-button>
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-header": OdsHeader;
  }
}
