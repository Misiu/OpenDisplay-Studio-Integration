import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  advancedFields,
  ALL_PALETTES,
  dashboardAccent,
  dashboardFormData,
  dashboardFormLabel,
  dashboardIsValid,
  nameFields,
  paletteFields,
  PRESET_PROFILES,
  sizeFields,
  turnedRotation,
  type DashboardFormData,
  type DashboardSource,
} from "./dashboards";
import {
  PALETTE_COLORS,
  PALETTE_LABELS,
  profileById,
} from "./display-profiles";
import { emit } from "./events";
import type { Size } from "./display-shape";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";
import type {
  Dashboard,
  DashboardMode,
  DisplayDevice,
  HomeAssistant,
  PaletteId,
  StudioFormSchema,
} from "./types";
import "./ods-display-preview";

type PickerChange = CustomEvent<{ value: Record<string, string> }>;

/** The field the display is drawn in, a little roomier than the one on a card. */
const PREVIEW_BOX: Size = { width: 420, height: 150 };

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
      .swatch {
        width: 9px;
        height: 9px;
        border: 1px solid
          color-mix(in srgb, var(--studio-text) 25%, transparent);
        border-radius: 50%;
      }
      .fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--ha-space-3, 12px);
        align-items: start;
      }
      .fields > * {
        min-width: 0;
      }
      .preview {
        overflow: hidden;
        border: 1px solid var(--studio-border);
        border-radius: 11px;
        background: var(--studio-surface);
      }
      .preview-stage {
        position: relative;
        height: 190px;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .preview-stage ods-display-preview {
        width: 100%;
        height: 100%;
      }
      .turn {
        position: absolute;
        top: 10px;
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        padding: 0;
        border: 1px solid var(--studio-border);
        border-radius: 10px;
        background: var(--studio-surface);
        color: var(--studio-text);
      }
      .turn:hover,
      .turn:focus-visible {
        border-color: var(--studio-accent);
        background: var(--studio-accent-soft);
        outline: 0;
      }
      /* The arrows say which way the display turns, so they keep their sides in RTL. */
      .turn.left {
        left: 11px;
      }
      .turn.right {
        right: 11px;
      }
      .preview-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        height: 36px;
        padding: 0 12px;
        border-top: 1px solid var(--studio-border);
        color: var(--studio-muted);
        font-size: 11px;
      }
      .preview-meta .resolution {
        color: var(--studio-text);
        font-variant-numeric: tabular-nums;
      }
      .preview-meta .colors {
        display: inline-flex;
        align-items: center;
        gap: 7px;
      }
      .preview-meta .swatches {
        display: inline-flex;
        gap: 3px;
      }
      .new-dashboard-content ha-form {
        display: block;
      }
      .dashboard-source-options.modes {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      @media (max-width: 600px) {
        .fields {
          grid-template-columns: 1fr;
        }
        .dashboard-source-options,
        .dashboard-source-options.modes {
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

  private renderChoice(
    selected: boolean,
    icon: string,
    title: string,
    hint: string,
    onSelect: () => void
  ): TemplateResult {
    return html`
      <button
        class=${selected ? "dashboard-source selected" : "dashboard-source"}
        type="button"
        role="radio"
        aria-checked=${selected ? "true" : "false"}
        @click=${onSelect}
      >
        <ha-icon icon=${icon}></ha-icon>
        <span>
          <strong>${title}</strong>
          <small>${hint}</small>
        </span>
      </button>
    `;
  }

  private renderSource(
    source: DashboardSource,
    icon: string,
    title: string,
    hint: string
  ): TemplateResult {
    return this.renderChoice(this.source === source, icon, title, hint, () =>
      emit(this, "new-dashboard-source", { source })
    );
  }

  private renderMode(
    mode: DashboardMode,
    icon: string,
    title: string,
    hint: string
  ): TemplateResult {
    return this.renderChoice(
      this.dashboard.mode === mode,
      icon,
      title,
      hint,
      () => emit(this, "new-dashboard-mode", { mode })
    );
  }

  /** The editor is chosen here and never changed: a dashboard keeps the one it started in. */
  private renderModes(): TemplateResult {
    const text = strings.basic;
    return html`
      <span class="form-label">${text.modeTitle}</span>
      <div
        class="dashboard-source-options modes"
        role="radiogroup"
        aria-label=${text.modeTitle}
      >
        ${this.renderMode("basic", "mdi:view-grid-plus", text.basic, text.basicHint)}
        ${this.renderMode(
          "advanced",
          "mdi:vector-arrange-below",
          text.advanced,
          text.advancedHint
        )}
      </div>
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

  private renderForm(
    schema: StudioFormSchema[],
    autofocus = false
  ): TemplateResult {
    return html`
      <ha-form
        ?autofocus=${autofocus}
        .hass=${this.hass}
        .data=${dashboardFormData(this.dashboard)}
        .schema=${schema}
        .computeLabel=${dashboardFormLabel}
        @value-changed=${this.formChanged}
      ></ha-form>
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
    const options = this.devices.map((device) => ({
      value: device.id,
      label: `${device.name} · ${strings.common.size(device.width, device.height)}`,
    }));
    return this.renderPicker(
      "deviceId",
      strings.newDashboard.device,
      options,
      this.deviceId,
      this.deviceChanged
    );
  }

  private renderProfilePicker(): TemplateResult {
    const options = PRESET_PROFILES.map((profile) => ({
      value: profile.id,
      label: `${profile.manufacturer} · ${profile.name}`,
    }));
    return this.renderPicker(
      "profileId",
      strings.newDashboard.display,
      options,
      this.dashboard.display.profileId ?? "",
      this.profileChanged
    );
  }

  /** The palettes the chosen display can show; a display with one has nothing to pick. */
  private get palettes(): PaletteId[] {
    if (this.source === "custom") return ALL_PALETTES;
    if (this.source === "preset") {
      return profileById(this.dashboard.display.profileId).palettes;
    }
    return [];
  }

  /** The display on the left, the name on the right; a custom display has no list to pick from. */
  private renderPickerAndName(): TemplateResult {
    if (this.source === "device" && this.devices.length === 0) {
      return html`
        <ha-alert alert-type="info">${strings.newDashboard.noDevices}</ha-alert>
        ${this.renderForm(nameFields(), true)}
      `;
    }
    if (this.source === "custom") {
      const palettes = this.palettes;
      return html`
        <div class="fields">
          ${this.renderForm(nameFields(), true)}
          ${this.renderForm(paletteFields(palettes))}
        </div>
        ${this.renderForm(sizeFields())}
      `;
    }
    const picker =
      this.source === "device"
        ? this.renderDevicePicker()
        : this.renderProfilePicker();
    return html`
      <div class="fields">${picker} ${this.renderForm(nameFields(), true)}</div>
      ${this.palettes.length > 1 ? this.renderForm(paletteFields(this.palettes)) : nothing}
    `;
  }

  private turn(direction: 1 | -1): void {
    const rotation = turnedRotation(this.dashboard.display.rotation, direction);
    emit(this, "new-dashboard-change", {
      value: { rotation: String(rotation) },
    });
  }

  private renderTurnButton(
    direction: 1 | -1,
    label: string,
    icon: string
  ): TemplateResult {
    return html`
      <button
        type="button"
        class="turn ${direction === 1 ? "right" : "left"}"
        aria-label=${label}
        title=${label}
        @click=${() => this.turn(direction)}
      >
        <ha-icon icon=${icon}></ha-icon>
      </button>
    `;
  }

  private renderPaletteSummary(): TemplateResult {
    const { palette } = this.dashboard.display;
    return html`
      <span class="colors" title=${PALETTE_LABELS[palette]}>
        <span class="swatches">
          ${PALETTE_COLORS[palette].map(
            (color) => html`
              <i class="swatch" style=${`background:${color}`}></i>
            `
          )}
        </span>
        ${PALETTE_LABELS[palette]}
      </span>
    `;
  }

  /** The display as it will be, which the arrows turn a quarter at a time. */
  private renderPreview(): TemplateResult {
    const { display } = this.dashboard;
    const text = strings.newDashboard;
    return html`
      <section class="preview" aria-label=${text.previewLabel}>
        <div class="preview-stage">
          ${this.renderTurnButton(-1, text.turnLeft, "mdi:rotate-left")}
          ${this.renderTurnButton(1, text.turnRight, "mdi:rotate-right")}
          <ods-display-preview
            turns
            .width=${display.width}
            .height=${display.height}
            .rotation=${display.rotation}
            .background=${display.background}
            .accent=${dashboardAccent(display.palette)}
            .box=${PREVIEW_BOX}
          ></ods-display-preview>
        </div>
        <div class="preview-meta">
          <span class="resolution" aria-live="polite">
            ${strings.common.sizeInPixels(display.width, display.height)} ·
            ${display.rotation}°
          </span>
          ${this.renderPaletteSummary()}
        </div>
      </section>
    `;
  }

  /** Padding and snapping belong to the editor that places elements by hand. */
  private renderAdvanced(): TemplateResult | typeof nothing {
    if (this.dashboard.mode === "basic") return nothing;
    return this.renderForm(advancedFields());
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
          ${this.renderModes()}
          <span class="form-label">${strings.newDashboard.startFrom}</span>
          ${this.renderSources()} ${this.renderPickerAndName()}
          ${this.renderPreview()} ${this.renderAdvanced()}
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
