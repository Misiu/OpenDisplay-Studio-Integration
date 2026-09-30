import {
  css,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, query } from "lit/decorators.js";
import {
  DISPLAY_PROFILES,
  isPaletteId,
  PALETTE_COLORS,
  PALETTE_LABELS,
  profileById,
} from "./display-profiles";
import { inputValue } from "./dom";
import { emit, type OdsEvent } from "./events";
import { strings } from "./strings";
import {
  appearanceFormData,
  layoutFields,
  primitiveAppearanceSchema,
  type LayoutField,
} from "./item-fields";
import { itemIcon, itemName } from "./item-labels";
import { clamp } from "./math";
import { trackPointerGesture } from "./pointer-gesture";
import { baseStyles, chromeStyles } from "./studio-styles";
import type {
  ComposePreviewResponse,
  Dashboard,
  HaFormSchema,
  HomeAssistant,
  PaletteId,
  PrimitiveDefinition,
  PrimitiveItem,
  StudioItem,
  WidgetDefinition,
  WidgetItem,
} from "./types";
import "./ods-property-field";
import "./ods-structure";

const MIN_WIDTH = 286;
const MAX_WIDTH = 560;
const DISPLAY_KEYS = ["width", "height", "padding", "snapSize"] as const;
type DisplayKey = (typeof DISPLAY_KEYS)[number];

const isDisplayKey = (key: string): key is DisplayKey =>
  DISPLAY_KEYS.some((known) => known === key);

const formFieldLabel = (entry: HaFormSchema): string => entry.label;

/** The right panel: the layer list and the properties of the selected item, or of the dashboard. */
@customElement("ods-inspector")
export class OdsInspector extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .panel {
        position: relative;
        min-width: 0;
        min-height: 0;
        background: var(--studio-surface);
      }
      .inspector {
        min-width: 0;
        border-left: 1px solid var(--studio-border);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        overflow-anchor: none;
      }
      .panel-rail {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        padding: 10px 6px;
      }
      .right-rail {
        border-left: 1px solid var(--studio-border);
      }
      .rail-label {
        writing-mode: vertical-rl;
        color: var(--studio-muted);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .panel-resizer {
        position: absolute;
        left: -4px;
        top: 0;
        bottom: 0;
        width: 8px;
        cursor: ew-resize;
        z-index: 6;
      }
      .panel-resizer:hover {
        background: color-mix(in srgb, var(--studio-accent) 30%, transparent);
      }
      .properties {
        min-height: 0;
        flex: 1 1 auto;
        overflow: auto;
        overflow-anchor: none;
        overscroll-behavior: contain;
      }
      .inspector-title {
        min-height: 58px;
        display: grid;
        grid-template-columns: 30px minmax(0, 1fr);
        align-items: center;
        gap: 7px;
        padding: 8px 12px;
        border-bottom: 1px solid var(--studio-border);
      }
      .inspector-title > ha-icon {
        color: var(--studio-accent);
      }
      .inspector-title h2 {
        margin: 0;
        font-size: 15px;
      }
      .inspector-title p {
        margin: 3px 0 0;
        color: var(--studio-muted);
        font-size: 10px;
      }
      .inspector-section {
        border-bottom: 1px solid var(--studio-border);
      }
      .inspector-section > summary {
        padding: 12px 14px;
        cursor: pointer;
        list-style-position: inside;
        color: var(--studio-muted);
        font: 700 10px var(--code-font-family, monospace);
        letter-spacing: 0.09em;
        text-transform: uppercase;
      }
      .section-body {
        padding: 2px 14px 14px;
      }
      .field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .stack-field {
        display: grid;
        gap: 5px;
        min-width: 0;
        color: var(--studio-muted);
        font-size: 10px;
      }
      .stack-field select {
        width: 100%;
        min-width: 0;
        height: 36px;
        padding: 0 9px;
        border: 1px solid var(--studio-border);
        border-radius: 7px;
        background: var(--secondary-background-color, #f3f5f6);
        color: var(--studio-text);
      }
      .section-body > ods-property-field {
        margin-top: 10px;
      }
      .field-grid + .field-grid,
      .field-grid + .stack-field,
      .stack-field + .field-grid {
        margin-top: 10px;
      }
      .field-help {
        color: var(--studio-muted);
        font-size: 10px;
        line-height: 1.45;
      }
      .danger-zone {
        padding: 12px 14px;
        border-bottom: 1px solid var(--studio-border);
        color: var(--error-color, #db4437);
      }
      .metrics {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 5px 12px;
        font: 10px var(--code-font-family, monospace);
      }
      .metrics strong {
        text-align: right;
      }
      .locked-notice {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 8px 12px;
        padding: 7px 9px;
        border: 1px solid
          color-mix(
            in srgb,
            var(--warning-color, #ffa600) 45%,
            var(--studio-border)
          );
        border-radius: 7px;
        background: color-mix(
          in srgb,
          var(--warning-color, #ffa600) 10%,
          var(--studio-surface)
        );
        font-size: 11px;
      }
      .locked-notice span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .locked-notice ha-icon {
        width: 15px;
        height: 15px;
        --mdc-icon-size: 15px;
      }
      .locked-notice button {
        min-height: 26px;
        padding: 0 9px;
        border: 1px solid var(--studio-border);
        border-radius: 6px;
        color: var(--primary-text-color);
        background: var(--studio-surface);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      @media (max-width: 900px) {
        .inspector,
        .panel-rail {
          display: none;
        }
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public dashboard!: Dashboard;
  @property({ attribute: false }) public widgets: WidgetDefinition[] = [];
  @property({ attribute: false }) public primitives: PrimitiveDefinition[] = [];
  @property({ attribute: false }) public preview?: ComposePreviewResponse;
  @property() public selectedItemId = "";
  @property({ type: Boolean }) public collapsed = false;
  @property({ type: Number }) public width = 350;

  @query(".properties") private propertiesPanel?: HTMLElement;
  private stopGesture?: () => void;

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has("selectedItemId") && this.propertiesPanel) {
      this.propertiesPanel.scrollTop = 0;
    }
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopGesture?.();
  }

  private startResize(event: PointerEvent): void {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = this.width;
    this.stopGesture = trackPointerGesture({
      origin: event,
      onMove: (move) => {
        const width = startWidth + startX - move.clientX;
        emit(this, "inspector-resize", {
          width: clamp(width, MIN_WIDTH, MAX_WIDTH),
        });
      },
    });
  }

  private expand(): void {
    emit(this, "inspector-collapse", { collapsed: false });
  }

  // --- reading what the user typed -------------------------------------------

  private numberFrom(event: OdsEvent<"field-change">): number | undefined {
    const value = Math.round(Number(event.detail.value));
    return Number.isFinite(value) ? value : undefined;
  }

  private onItemFieldChange(event: OdsEvent<"field-change">): void {
    event.stopPropagation();
    const value = this.numberFrom(event);
    if (value !== undefined) {
      emit(this, "item-number-change", { key: event.detail.key, value });
    }
  }

  private onDisplayFieldChange(event: OdsEvent<"field-change">): void {
    event.stopPropagation();
    const { key } = event.detail;
    const value = this.numberFrom(event);
    if (value !== undefined && isDisplayKey(key)) {
      emit(this, "display-number-change", { key, value });
    }
  }

  private onProfileChange(event: Event): void {
    emit(this, "profile-change", { profileId: inputValue(event) });
  }

  private onPaletteChange(event: Event): void {
    const palette = inputValue(event);
    if (isPaletteId(palette)) {
      emit(this, "palette-change", { palette });
    }
  }

  private onBackgroundChange(event: Event): void {
    emit(this, "background-change", { color: inputValue(event) });
  }

  private onWidgetConfigChange(event: OdsEvent<"widget-config-change">): void {
    emit(this, "widget-config-change", { value: event.detail.value });
  }

  private onPrimitiveChange(event: OdsEvent<"primitive-change">): void {
    emit(this, "primitive-change", { value: event.detail.value });
  }

  private requestDashboardDelete(): void {
    emit(this, "dashboard-delete-request");
  }

  private unlock(item: StudioItem): void {
    emit(this, "command", { id: "toggle-locked", itemId: item.id });
  }

  private requestItemDelete(item: StudioItem): void {
    emit(this, "command", { id: "delete-item", itemId: item.id });
  }

  // --- shared pieces ---------------------------------------------------------

  private renderHeader(
    title: string,
    subtitle: string,
    icon: string
  ): TemplateResult {
    return html`
      <div class="inspector-title">
        <ha-icon .icon=${icon}></ha-icon>
        <div>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
      </div>
    `;
  }

  private renderDangerZone(label: string, onClick: () => void): TemplateResult {
    return html`
      <div class="danger-zone">
        <ha-button appearance="plain" @click=${onClick}>
          <ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>
          ${label}
        </ha-button>
      </div>
    `;
  }

  private renderMetrics(): TemplateResult | typeof nothing {
    const preview = this.preview;
    if (!preview) {
      return nothing;
    }
    const { timings } = preview;
    const labels = strings.inspector.metrics;
    const rows: Array<[string, number]> = [
      [labels.queue, timings.queue],
      [labels.data, timings.data],
      [labels.compile, timings.compile],
      [labels.render, timings.render],
      [labels.encode, timings.encode],
      [labels.total, timings.pipeline],
    ];
    return html`
      ${preview.warnings.map(
        (warning) => html`
          <ha-alert class="warning" alert-type="warning">${warning}</ha-alert>
        `
      )}
      <details class="inspector-section telemetry">
        <summary>${strings.inspector.diagnostics}</summary>
        <div class="section-body metrics">
          ${rows.map(
            ([label, value]) => html`
              <span>${label}</span>
              <strong>${strings.common.milliseconds(value)}</strong>
            `
          )}
        </div>
      </details>
    `;
  }

  // --- the dashboard's own settings ------------------------------------------

  private renderDisplayField(
    label: string,
    key: DisplayKey,
    min: number,
    max: number
  ): TemplateResult {
    return html`
      <ods-property-field
        .label=${label}
        .fieldKey=${key}
        .value=${this.dashboard.display[key]}
        .min=${min}
        .max=${max}
        @field-change=${this.onDisplayFieldChange}
      ></ods-property-field>
    `;
  }

  private renderProfileSelect(): TemplateResult {
    const selectedId = this.dashboard.display.profileId;
    return html`
      <label class="stack-field">
        ${strings.inspector.displayType}
        <select @change=${this.onProfileChange}>
          ${DISPLAY_PROFILES.map(
            (entry) => html`
              <option value=${entry.id} ?selected=${entry.id === selectedId}>
                ${entry.manufacturer} · ${entry.name}
              </option>
            `
          )}
        </select>
      </label>
    `;
  }

  private renderPaletteSelect(): TemplateResult {
    const { profileId, palette: selected } = this.dashboard.display;
    const profile = profileById(profileId);
    const palettes: PaletteId[] =
      profile.id === "custom"
        ? Object.keys(PALETTE_LABELS).filter(isPaletteId)
        : profile.palettes;
    return html`
      <label class="stack-field">
        ${strings.fields.palette}
        <select @change=${this.onPaletteChange}>
          ${palettes.map(
            (palette) => html`
              <option value=${palette} ?selected=${palette === selected}>
                ${PALETTE_LABELS[palette]}
              </option>
            `
          )}
        </select>
      </label>
    `;
  }

  private renderBackgroundSelect(): TemplateResult {
    const { palette, background } = this.dashboard.display;
    return html`
      <label class="stack-field">
        ${strings.fields.background}
        <select @change=${this.onBackgroundChange}>
          ${PALETTE_COLORS[palette].map(
            (color) => html`
              <option value=${color} ?selected=${color === background}>
                ${color[0].toUpperCase()}${color.slice(1)}
              </option>
            `
          )}
        </select>
      </label>
    `;
  }

  private renderDashboardInspector(): TemplateResult {
    return html`
      ${this.renderHeader(
        strings.inspector.dashboard,
        strings.inspector.dashboardHint,
        "mdi:monitor"
      )}
      <details class="inspector-section" open>
        <summary>${strings.inspector.display}</summary>
        <div class="section-body">
          ${this.renderProfileSelect()}
          <div class="field-grid">
            ${this.renderDisplayField(strings.fields.width, "width", 64, 4096)}
            ${this.renderDisplayField(strings.fields.height, "height", 64, 4096)}
          </div>
          <div class="field-grid">
            ${this.renderPaletteSelect()} ${this.renderBackgroundSelect()}
          </div>
        </div>
      </details>
      <details class="inspector-section" open>
        <summary>${strings.inspector.workingArea}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${this.renderDisplayField(strings.fields.padding, "padding", 0, 1024)}
            ${this.renderDisplayField(strings.fields.snapSize, "snapSize", 1, 256)}
          </div>
          <p class="field-help">${strings.inspector.workingAreaHelp}</p>
        </div>
      </details>
      ${this.renderDangerZone(
        strings.inspector.deleteDashboard,
        this.requestDashboardDelete
      )}
      ${this.renderMetrics()}
    `;
  }

  // --- the selected item's settings ------------------------------------------

  private renderLayoutField(
    field: LayoutField,
    disabled: boolean
  ): TemplateResult {
    return html`
      <ods-property-field
        .label=${field.label}
        .fieldKey=${field.key}
        .value=${field.value}
        .min=${field.min}
        .max=${field.max}
        .disabled=${disabled}
        @field-change=${this.onItemFieldChange}
      ></ods-property-field>
    `;
  }

  private renderLockedNotice(
    item: StudioItem
  ): TemplateResult | typeof nothing {
    if (!item.locked) {
      return nothing;
    }
    return html`
      <div class="locked-notice">
        <span>
          <ha-icon icon="mdi:lock"></ha-icon>
          ${strings.inspector.locked}
        </span>
        <button
          type="button"
          aria-label=${strings.inspector.unlockElement}
          @click=${() => this.unlock(item)}
        >
          ${strings.inspector.unlock}
        </button>
      </div>
    `;
  }

  private renderLayoutSection(item: StudioItem): TemplateResult {
    const { grid, extra } = layoutFields(item, this.dashboard, this.primitives);
    return html`
      <details class="inspector-section" open>
        <summary>${strings.inspector.layout}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${grid.map((field) => this.renderLayoutField(field, item.locked))}
          </div>
          ${extra.map((field) => this.renderLayoutField(field, item.locked))}
        </div>
      </details>
    `;
  }

  private renderWidgetSettings(item: WidgetItem): TemplateResult {
    const definition = this.widgets.find(
      (widget) => widget.id === item.widget.type
    );
    const schema =
      definition?.fields.map((field) => ({
        name: field.key,
        label: field.label,
        required: field.required,
        selector: field.selector,
      })) ?? [];
    return html`
      <details class="inspector-section" open>
        <summary>${strings.inspector.widgetSettings}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${item.widget.config}
            .schema=${schema}
            .computeLabel=${formFieldLabel}
            @value-changed=${this.onWidgetConfigChange}
          ></ha-form>
        </div>
      </details>
    `;
  }

  private renderAppearance(item: PrimitiveItem): TemplateResult {
    const data = appearanceFormData(item, this.primitives);
    const schema = primitiveAppearanceSchema(
      item,
      this.dashboard.display.palette,
      this.primitives
    );
    return html`
      <details class="inspector-section" open>
        <summary>${strings.inspector.appearance}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${data}
            .schema=${schema}
            .computeLabel=${formFieldLabel}
            @value-changed=${this.onPrimitiveChange}
          ></ha-form>
        </div>
      </details>
    `;
  }

  private renderItemInspector(item: StudioItem): TemplateResult {
    const kind =
      item.kind === "widget"
        ? strings.inspector.kindWidget
        : strings.inspector.kindPrimitive;
    return html`
      ${this.renderHeader(
        itemName(item, this.widgets, this.primitives),
        strings.inspector.subtitle(kind, item.locked),
        itemIcon(item, this.widgets, this.primitives)
      )}
      ${this.renderLockedNotice(item)} ${this.renderLayoutSection(item)}
      ${
        item.kind === "widget"
          ? this.renderWidgetSettings(item)
          : this.renderAppearance(item)
      }
      ${this.renderDangerZone(strings.inspector.removeElement, () =>
        this.requestItemDelete(item)
      )}
      ${this.renderMetrics()}
    `;
  }

  // --- the panel -------------------------------------------------------------

  private renderRail(): TemplateResult {
    return html`
      <aside class="panel panel-rail right-rail">
        <button
          class="icon-button"
          title=${strings.inspector.expand}
          aria-label=${strings.inspector.expand}
          @click=${this.expand}
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <span class="rail-label">${strings.inspector.rail}</span>
      </aside>
    `;
  }

  protected render(): TemplateResult {
    if (this.collapsed) {
      return this.renderRail();
    }
    const item = this.dashboard.items.find(
      (candidate) => candidate.id === this.selectedItemId
    );
    return html`
      <aside class="panel inspector">
        <div
          class="panel-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label=${strings.inspector.resize}
          @pointerdown=${this.startResize}
        ></div>
        <ods-structure
          .items=${this.dashboard.items}
          .widgets=${this.widgets}
          .primitives=${this.primitives}
          .selectedItemId=${this.selectedItemId}
        ></ods-structure>
        <section class="properties">
          ${
            item
              ? this.renderItemInspector(item)
              : this.renderDashboardInspector()
          }
        </section>
      </aside>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-inspector": OdsInspector;
  }
}
