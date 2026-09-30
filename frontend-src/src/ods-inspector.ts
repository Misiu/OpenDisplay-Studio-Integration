import {
  css,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
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
  hasCornerFields,
  layoutFields,
  primitiveAppearanceSchema,
  type LayoutField,
} from "./item-fields";
import { VISIBLE_KEY } from "./expressions";
import { itemIcon } from "./item-labels";
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
  WidgetFieldDefinition,
  WidgetItem,
  WidgetOptionSection,
  WidgetPick,
  WidgetSourceDefinition,
} from "./types";
import {
  formSelector,
  idsFromPicks,
  picksFromIds,
  withPickFields,
} from "./widget-fields";
import "./ods-expression-field";
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
      .section-body > ods-property-field,
      .section-body > ods-expression-field,
      .section-body > .text-button {
        margin-top: 10px;
      }
      .text-button {
        padding: 0;
        border: 0;
        background: none;
        color: var(--primary-color);
        font-size: 11px;
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

  /** A box or line shows its four stored corners instead of left, top and size. */
  @state() private showCorners = false;

  @query(".properties") private propertiesPanel?: HTMLElement;
  private stopGesture?: () => void;

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("selectedItemId")) this.showCorners = false;
  }
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

  private onItemFieldChange(
    event: OdsEvent<"field-change">,
    field: LayoutField
  ): void {
    event.stopPropagation();
    const value = this.numberFrom(event);
    if (value === undefined) return;
    if (field.stored && field.key.includes("_")) {
      emit(this, "primitive-change", { value: { [field.key]: value } });
    } else {
      emit(this, "item-number-change", { key: field.key, value });
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

  private onWidgetOptionsChange(
    event: OdsEvent<"widget-options-change">
  ): void {
    emit(this, "widget-options-change", { value: event.detail.value });
  }

  private onPicksChange(
    event: OdsEvent<"widget-options-change">,
    source: WidgetSourceDefinition,
    item: WidgetItem
  ): void {
    const previous = item.widget.sources[source.key] ?? [];
    const chosen = event.detail.value[source.key];
    emit(this, "widget-picks-change", {
      sourceKey: source.key,
      picks: picksFromIds(previous, chosen),
    });
  }

  private onPickFieldsChange(
    event: OdsEvent<"widget-options-change">,
    source: WidgetSourceDefinition,
    item: WidgetItem,
    pickId: string
  ): void {
    const picks = item.widget.sources[source.key] ?? [];
    emit(this, "widget-picks-change", {
      sourceKey: source.key,
      picks: withPickFields(picks, pickId, event.detail.value, source),
    });
  }

  private reloadWidgets(): void {
    emit(this, "widgets-reload");
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
        <ha-button appearance="plain" variant="danger" @click=${onClick}>
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
    item: StudioItem
  ): TemplateResult {
    const control = html`
      <ods-property-field
        .label=${field.label}
        .fieldKey=${field.key}
        .value=${field.value}
        .min=${field.min}
        .max=${field.max}
        .disabled=${item.locked}
        @field-change=${(event: OdsEvent<"field-change">) =>
          this.onItemFieldChange(event, field)}
      ></ods-property-field>
    `;
    return field.stored
      ? this.renderExpressible(item, field.key, field.label, control)
      : control;
  }

  /** A field's control with the `{}` toggle that swaps it for an expression. */
  private renderExpressible(
    item: StudioItem,
    key: string,
    label: string,
    control: TemplateResult
  ): TemplateResult {
    return html`
      <ods-expression-field
        .label=${label}
        .fieldKey=${key}
        .expression=${item.expressions?.[key]}
        .disabled=${item.locked}
      >
        ${control}
      </ods-expression-field>
    `;
  }

  private renderVisibility(item: StudioItem): TemplateResult {
    return this.renderExpressible(
      item,
      VISIBLE_KEY,
      strings.expression.visibleLabel,
      html`
        <span class="field-help">${strings.expression.alwaysVisible}</span>
      `
    );
  }

  private renderCornerToggle(
    item: StudioItem
  ): TemplateResult | typeof nothing {
    if (!hasCornerFields(item, this.primitives)) return nothing;
    return html`
      <button
        type="button"
        class="text-button"
        @click=${() => (this.showCorners = !this.showCorners)}
      >
        ${
          this.showCorners
            ? strings.expression.derivedFields
            : strings.expression.cornerFields
        }
      </button>
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
    const { grid, extra } = layoutFields(
      item,
      this.dashboard,
      this.primitives,
      this.showCorners
    );
    return html`
      <details class="inspector-section" open>
        <summary>${strings.inspector.layout}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${grid.map((field) => this.renderLayoutField(field, item))}
          </div>
          ${extra.map((field) => this.renderLayoutField(field, item))}
          ${this.renderCornerToggle(item)} ${this.renderVisibility(item)}
        </div>
      </details>
    `;
  }

  private formSchema(
    field: WidgetFieldDefinition,
    required = false
  ): HaFormSchema {
    return {
      name: field.key,
      label: field.label,
      required,
      selector: formSelector(field.selector, this.dashboard.display.palette),
    };
  }

  private renderPickFields(
    item: WidgetItem,
    source: WidgetSourceDefinition,
    pick: WidgetPick
  ): TemplateResult {
    const label =
      typeof pick.label === "string" && pick.label ? pick.label : pick.id;
    return html`
      <details class="pick-fields" data-pick=${pick.id}>
        <summary>${label}</summary>
        <ha-form
          .hass=${this.hass}
          .data=${pick}
          .schema=${source.perSource.map((field) => this.formSchema(field))}
          .computeLabel=${formFieldLabel}
          @value-changed=${(event: OdsEvent<"widget-options-change">) =>
            this.onPickFieldsChange(event, source, item, pick.id)}
        ></ha-form>
      </details>
    `;
  }

  private renderSource(
    item: WidgetItem,
    source: WidgetSourceDefinition
  ): TemplateResult {
    const picks = item.widget.sources[source.key] ?? [];
    return html`
      <div class="widget-source" data-source=${source.key}>
        <ha-form
          .hass=${this.hass}
          .data=${{ [source.key]: idsFromPicks(source, picks) }}
          .schema=${[this.formSchema(source, source.required)]}
          .computeLabel=${formFieldLabel}
          @value-changed=${(event: OdsEvent<"widget-options-change">) =>
            this.onPicksChange(event, source, item)}
        ></ha-form>
        ${
          source.perSource.length > 0
            ? picks.map((pick) => this.renderPickFields(item, source, pick))
            : nothing
        }
      </div>
    `;
  }

  private renderSources(
    item: WidgetItem,
    definition: WidgetDefinition
  ): TemplateResult | typeof nothing {
    if (definition.sources.length === 0) return nothing;
    return html`
      <details class="inspector-section" open>
        <summary>${strings.inspector.dataSources}</summary>
        <div class="section-body">
          ${definition.sources.map((source) => this.renderSource(item, source))}
        </div>
      </details>
    `;
  }

  private renderOptionSection(
    item: WidgetItem,
    section: WidgetOptionSection,
    open: boolean
  ): TemplateResult {
    return html`
      <details class="inspector-section" ?open=${open}>
        <summary>${section.section}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${item.widget.options}
            .schema=${section.fields.map((field) => this.formSchema(field))}
            .computeLabel=${formFieldLabel}
            @value-changed=${this.onWidgetOptionsChange}
          ></ha-form>
        </div>
      </details>
    `;
  }

  private renderMissingWidget(item: WidgetItem): TemplateResult {
    return html`
      <details class="inspector-section" open>
        <summary>${strings.inspector.widgetSettings}</summary>
        <div class="section-body">
          <ha-alert alert-type="warning">
            ${strings.inspector.widgetMissing(item.widget.type)}
          </ha-alert>
          <button
            type="button"
            class="text-button"
            @click=${this.reloadWidgets}
          >
            ${strings.library.reloadWidgets}
          </button>
        </div>
      </details>
    `;
  }

  private renderWidgetSettings(item: WidgetItem): TemplateResult {
    const definition = this.widgets.find(
      (widget) => widget.id === item.widget.type
    );
    if (!definition) return this.renderMissingWidget(item);
    return html`
      ${this.renderSources(item, definition)}
      ${definition.options.map((section, index) =>
        this.renderOptionSection(item, section, index === 0)
      )}
    `;
  }

  private renderAppearanceField(
    item: PrimitiveItem,
    entry: HaFormSchema,
    data: Record<string, unknown>
  ): TemplateResult {
    return this.renderExpressible(
      item,
      entry.name,
      entry.label,
      html`
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${[entry]}
          .computeLabel=${formFieldLabel}
          @value-changed=${this.onPrimitiveChange}
        ></ha-form>
      `
    );
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
          ${schema.map((entry) => this.renderAppearanceField(item, entry, data))}
        </div>
      </details>
    `;
  }

  /** A widget asks for its data first and its layout last; a primitive the other way. */
  private renderItemSections(item: StudioItem): TemplateResult {
    if (item.kind === "widget") {
      return html`
        ${this.renderWidgetSettings(item)} ${this.renderLayoutSection(item)}
      `;
    }
    return html`
      ${this.renderLayoutSection(item)} ${this.renderAppearance(item)}
    `;
  }

  private renderItemInspector(item: StudioItem): TemplateResult {
    const kind =
      item.kind === "widget"
        ? strings.inspector.kindWidget
        : strings.inspector.kindPrimitive;
    return html`
      ${this.renderHeader(
        item.name,
        strings.inspector.subtitle(kind, item.locked),
        itemIcon(item, this.widgets, this.primitives)
      )}
      ${this.renderLockedNotice(item)} ${this.renderItemSections(item)}
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
