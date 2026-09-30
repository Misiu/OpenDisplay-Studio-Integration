import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  dashboardFormData,
  dashboardFormLabel,
  dashboardFormSchema,
  dashboardIsValid,
  type DashboardFormData,
} from "./dashboards";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";
import type { Dashboard, HomeAssistant } from "./types";

/** The "New dashboard" dialog: shows the draft, reports edits and the create/cancel intent. */
@customElement("ods-new-dashboard-dialog")
export class OdsNewDashboardDialog extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .new-dashboard-content {
        display: grid;
        gap: 16px;
        padding: 18px 22px 22px;
      }
      .form-label {
        color: var(--studio-muted);
        font-size: 11px;
        font-weight: 700;
      }
      .dashboard-source-options {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
      }
      .dashboard-source {
        min-width: 0;
        min-height: 64px;
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        align-items: center;
        gap: 9px;
        padding: 9px 11px;
        border: 1px solid var(--studio-border);
        border-radius: 9px;
        text-align: start;
        background: var(--studio-surface);
      }
      .dashboard-source.selected {
        border-color: var(--studio-accent);
        box-shadow: inset 0 0 0 1px var(--studio-accent);
        background: var(--studio-accent-soft);
      }
      .dashboard-source:disabled {
        cursor: not-allowed;
        opacity: 0.52;
      }
      .dashboard-source ha-icon {
        color: var(--studio-accent);
      }
      .dashboard-source span {
        min-width: 0;
        display: grid;
        gap: 3px;
      }
      .dashboard-source strong {
        font-size: 12px;
      }
      .dashboard-source small {
        overflow: hidden;
        color: var(--studio-muted);
        font-size: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .new-dashboard-content ha-form {
        display: block;
      }
      @media (max-width: 600px) {
        .dashboard-source-options {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public dashboard!: Dashboard;
  @property({ type: Boolean }) public saving = false;

  private formChanged(
    event: CustomEvent<{ value: Partial<DashboardFormData> }>
  ): void {
    emit(this, "new-dashboard-change", { value: event.detail.value });
  }

  protected render(): TemplateResult {
    return html`
      <ha-dialog
        .open=${true}
        width="medium"
        header-title=${strings.newDashboard.title}
        header-subtitle=${strings.newDashboard.subtitle}
        @closed=${() => emit(this, "new-dashboard-close")}
      >
        <div class="new-dashboard-content">
          <span class="form-label">${strings.newDashboard.startFrom}</span>
          <div
            class="dashboard-source-options"
            role="radiogroup"
            aria-label=${strings.newDashboard.sources}
          >
            <button
              class="dashboard-source selected"
              type="button"
              role="radio"
              aria-checked="true"
            >
              <ha-icon icon="mdi:monitor"></ha-icon>
              <span>
                <strong>${strings.newDashboard.customSize}</strong>
                <small>${strings.newDashboard.customSizeHint}</small>
              </span>
            </button>
            <button
              class="dashboard-source"
              type="button"
              role="radio"
              aria-checked="false"
              disabled
            >
              <ha-icon icon="mdi:devices"></ha-icon>
              <span>
                <strong>${strings.newDashboard.fromDevice}</strong>
                <small>${strings.newDashboard.fromDeviceHint}</small>
              </span>
            </button>
          </div>
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${dashboardFormData(this.dashboard)}
            .schema=${dashboardFormSchema()}
            .computeLabel=${dashboardFormLabel}
            @value-changed=${this.formChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => emit(this, "new-dashboard-close")}
          >
            ${strings.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !dashboardIsValid(this.dashboard)}
            @click=${() => emit(this, "dashboard-create")}
          >
            ${this.saving ? strings.newDashboard.creating : strings.newDashboard.create}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-new-dashboard-dialog": OdsNewDashboardDialog;
  }
}
