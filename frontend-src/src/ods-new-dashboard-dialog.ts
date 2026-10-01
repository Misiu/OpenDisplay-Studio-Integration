import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  ALL_PALETTES,
  PRESET_PROFILES,
  type DisplayFields,
  dashboardFormData,
  dashboardFormLabel,
  dashboardFormSchema,
  dashboardIsValid,
  type DashboardFormData,
  type DashboardSource,
} from "./dashboards";
import {
  PALETTE_COLORS,
  PALETTE_LABELS,
  profileById,
} from "./display-profiles";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";
import type { Dashboard, DisplayDevice, HomeAssistant } from "./types";

type PickerChange = CustomEvent<{ value: Record<string, string> }>;

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
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 9px;
      }
      .dashboard-source {
        min-width: 0;
        min-height: 52px;
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        align-items: center;
        gap: 9px;
        padding: 8px 10px;
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
      .display-summary {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
        margin: 0;
      }
      .display-summary div {
        padding: 9px 11px;
        border: 1px solid var(--studio-border);
        border-radius: 9px;
      }
      .display-summary dt {
        color: var(--studio-muted);
        font-size: 10px;
      }
      .display-summary dd {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 3px 0 0;
        font-size: 12px;
        font-weight: 700;
      }
      .swatch {
        width: 12px;
        height: 12px;
        border: 1px solid var(--studio-border);
        border-radius: 50%;
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
  @property({ attribute: false }) public devices: DisplayDevice[] = [];
  @property() public source: DashboardSource = "custom";
  @property() public deviceId = "";
  @property({ type: Boolean }) public saving = false;

  private formChanged(
    event: CustomEvent<{ value: Partial<DashboardFormData> }>
  ): void {
    emit(this, "new-dashboard-change", { value: event.detail.value });
  }

  private deviceChanged(event: PickerChange): void {
    emit(this, "new-dashboard-device", {
      deviceId: event.detail.value.deviceId ?? "",
    });
  }

  private profileChanged(event: PickerChange): void {
    emit(this, "new-dashboard-profile", {
      profileId: event.detail.value.profileId ?? "",
    });
  }

  private close(): void {
    emit(this, "new-dashboard-close");
  }

  private create(): void {
    emit(this, "dashboard-create");
  }

  private renderSource(
    source: DashboardSource,
    icon: string,
    title: string,
    hint: string
  ): TemplateResult {
    const selected = this.source === source;
    return html`
      <button
        class=${selected ? "dashboard-source selected" : "dashboard-source"}
        type="button"
        role="radio"
        aria-checked=${selected ? "true" : "false"}
        @click=${() => emit(this, "new-dashboard-source", { source })}
      >
        <ha-icon icon=${icon}></ha-icon>
        <span>
          <strong>${title}</strong>
          <small>${hint}</small>
        </span>
      </button>
    `;
  }

  private renderSources(): TemplateResult {
    const text = strings.newDashboard;
    return html`
      <div
        class="dashboard-source-options"
        role="radiogroup"
        aria-label=${text.sources}
      >
        ${this.renderSource(
          "device",
          "mdi:devices",
          text.fromDevice,
          text.fromDeviceHint
        )}
        ${this.renderSource(
          "preset",
          "mdi:format-list-bulleted",
          text.preset,
          text.presetHint
        )}
        ${this.renderSource(
          "custom",
          "mdi:monitor",
          text.customSize,
          text.customSizeHint
        )}
      </div>
    `;
  }

  /** What the picked display gives the dashboard: its size and the colors it can show. */
  private renderDisplaySummary(): TemplateResult {
    const { width, height, palette } = this.dashboard.display;
    return html`
      <dl
        class="display-summary"
        role="group"
        aria-label=${strings.newDashboard.deviceDetails}
      >
        <div>
          <dt>${strings.fields.resolution}</dt>
          <dd>${strings.common.sizeInPixels(width, height)}</dd>
        </div>
        <div>
          <dt>${strings.newDashboard.colors}</dt>
          <dd class="swatches">
            ${PALETTE_COLORS[palette].map(
              (color) => html`
                <span
                  class="swatch"
                  title=${color}
                  style=${`background:${color}`}
                ></span>
              `
            )}
            ${PALETTE_LABELS[palette]}
          </dd>
        </div>
      </dl>
    `;
  }

  private renderPicker(
    name: string,
    label: string,
    options: { value: string; label: string }[],
    value: string,
    changed: (event: PickerChange) => void
  ): TemplateResult {
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ [name]: value }}
        .schema=${[
          {
            name,
            label,
            selector: { select: { mode: "dropdown", options } },
          },
        ]}
        .computeLabel=${dashboardFormLabel}
        @value-changed=${changed}
      ></ha-form>
    `;
  }

  private renderDevicePicker(): TemplateResult {
    if (this.devices.length === 0) {
      return html`
        <ha-alert alert-type="info">${strings.newDashboard.noDevices}</ha-alert>
      `;
    }
    const options = this.devices.map((device) => ({
      value: device.id,
      label: `${device.name} · ${strings.common.size(device.width, device.height)}`,
    }));
    return html`
      ${this.renderPicker(
        "deviceId",
        strings.newDashboard.device,
        options,
        this.deviceId,
        this.deviceChanged
      )}
      ${this.renderDisplaySummary()}
    `;
  }

  private renderProfilePicker(): TemplateResult {
    const options = PRESET_PROFILES.map((profile) => ({
      value: profile.id,
      label: `${profile.manufacturer} · ${profile.name}`,
    }));
    return html`
      ${this.renderPicker(
        "profileId",
        strings.newDashboard.display,
        options,
        this.dashboard.display.profileId ?? "",
        this.profileChanged
      )}
      ${this.renderDisplaySummary()}
    `;
  }

  private renderSourceBody(): TemplateResult | typeof nothing {
    if (this.source === "device") return this.renderDevicePicker();
    if (this.source === "preset") return this.renderProfilePicker();
    return nothing;
  }

  /** The fields below the picker: a custom display sets its size, a preset only its colors. */
  private displayFields(): DisplayFields {
    if (this.source === "custom") {
      return { size: true, palettes: ALL_PALETTES, backgrounds: [] };
    }
    if (this.source === "preset") {
      return {
        size: false,
        palettes: profileById(this.dashboard.display.profileId).palettes,
        backgrounds: [],
      };
    }
    return { size: false, palettes: [], backgrounds: [] };
  }

  protected render(): TemplateResult {
    return html`
      <ha-dialog
        .open=${true}
        width="medium"
        style="--ha-dialog-width-md: 720px"
        header-title=${strings.newDashboard.title}
        header-subtitle=${strings.newDashboard.subtitle}
        @closed=${this.close}
      >
        <div class="new-dashboard-content">
          <span class="form-label">${strings.newDashboard.startFrom}</span>
          ${this.renderSources()} ${this.renderSourceBody()}
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${dashboardFormData(this.dashboard)}
            .schema=${dashboardFormSchema(this.displayFields())}
            .computeLabel=${dashboardFormLabel}
            @value-changed=${this.formChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${this.close}
          >
            ${strings.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !dashboardIsValid(this.dashboard)}
            @click=${this.create}
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
