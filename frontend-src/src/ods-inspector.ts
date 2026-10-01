import {
  css,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { emit, type OdsEvent } from "./events";
import { strings } from "./strings";
import {
  hasCornerFields,
  layoutFields,
  primitiveFields,
  type LayoutField,
} from "./item-fields";
import { VISIBLE_KEY } from "./expressions";
import { itemIcon } from "./item-labels";
import { changedFields, defaultValues } from "./section-defaults";
import { itemLocks } from "./locks";
import { backgroundFields, backgroundFormData } from "./container-fields";
import { selectionBox } from "./selection-gesture";
import { findItem } from "./tree";
import { clamp } from "./math";
import { trackPointerGesture } from "./pointer-gesture";
import { baseStyles, chromeStyles } from "./studio-styles";
import type {
  ComposePreviewResponse,
  Dashboard,
  HaFormSchema,
  HomeAssistant,
  ContainerItem,
  PrimitiveDefinition,
  PrimitiveField,
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
  widgetFieldAsPrimitive,
} from "./widget-fields";
import "./ods-expression-field";
import "./ods-anchor-picker";
import "./ods-property-field";
import "./ods-value-field";
import "./ods-structure";

const MIN_WIDTH = 340;
const MAX_WIDTH = 560;
const DISPLAY_KEYS = ["padding", "snapSize"] as const;
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
        min-height: 46px;
        display: grid;
        grid-template-columns: 30px minmax(0, 1fr) auto;
        align-items: center;
        gap: 7px;
        padding: 6px 12px;
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
        display: flex;
        align-items: center;
        height: 38px;
        padding: 0 14px;
        cursor: pointer;
        gap: 7px;
        list-style: none;
        color: var(--studio-muted);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.045em;
        text-transform: uppercase;
      }
      .inspector-section > summary::-webkit-details-marker {
        display: none;
      }
      /* The arrow that says a section opens and closes: right when closed, down when open. */
      .inspector-section > summary::before {
        content: "";
        flex: none;
        border: 4px solid transparent;
        border-left: 5px solid currentColor;
        border-right: 0;
        transition: transform 0.12s;
      }
      .inspector-section[open] > summary::before {
        transform: rotate(90deg);
      }
      .section-body {
        padding: 0 14px 12px;
      }
      .changed-dot {
        flex: none;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--studio-accent);
      }
      .reset-link {
        margin-inline-start: auto;
        padding: 2px 4px;
        border: 0;
        background: transparent;
        color: var(--studio-accent);
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0;
        text-transform: none;
        cursor: pointer;
      }
      .reset-link:hover {
        text-decoration: underline;
      }
      .hidden-switch {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--studio-muted);
        font-size: 11px;
      }
      .field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
      }
      .disclosure {
        margin-top: 10px;
      }
      .disclosure > summary {
        display: flex;
        align-items: center;
        gap: 7px;
        list-style: none;
        color: var(--studio-muted);
        font-size: 11px;
        cursor: pointer;
      }
      .disclosure > summary::-webkit-details-marker {
        display: none;
      }
      .disclosure > summary::before {
        content: "";
        flex: none;
        border: 4px solid transparent;
        border-left: 5px solid currentColor;
        border-right: 0;
        transition: transform 0.12s;
      }
      .disclosure[open] > summary::before {
        transform: rotate(90deg);
      }
      .disclosure > ods-anchor-picker {
        margin-top: 6px;
      }
      .value-fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px 8px;
        margin-top: 10px;
      }
      .value-fields:first-child {
        margin-top: 0;
      }
      .value-field {
        min-width: 0;
      }
      .value-field.wide {
        grid-column: span 2;
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
  @property({ attribute: false }) public selectedItemIds: string[] = [];
  @property() public enteredGroupId = "";
  @property() public renameRequestId = "";
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

  private reloadWidgets(): void {
    emit(this, "widgets-reload");
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
    icon: string,
    trailing: TemplateResult | typeof nothing = nothing
  ): TemplateResult {
    return html`
      <div class="inspector-title">
        <ha-icon .icon=${icon}></ha-icon>
        <div>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
        ${trailing}
      </div>
    `;
  }

  private toggleHidden(): void {
    emit(this, "command", { id: "toggle-hidden" });
  }

  /** The `Hidden` switch in the header of an element. */
  private renderHiddenSwitch(item: StudioItem): TemplateResult {
    return html`
      <label class="hidden-switch">
        <span>${strings.inspector.hiddenSwitch}</span>
        <input
          type="checkbox"
          role="switch"
          aria-checked=${item.hidden ? "true" : "false"}
          aria-label=${strings.inspector.hiddenSwitch}
          .checked=${item.hidden}
          @change=${this.toggleHidden}
        />
      </label>
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

  private renderDashboardInspector(): TemplateResult {
    return html`
      ${this.renderHeader(
        strings.inspector.dashboard,
        strings.inspector.dashboardHint,
        "mdi:monitor"
      )}
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
        unit="px"
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

  private onAlignChoice(event: OdsEvent<"anchor-change">): void {
    event.stopPropagation();
    emit(this, "align-in-parent", { place: event.detail.anchor });
  }

  /** The 3 x 3 grid that puts the element at a place of its parent, closed until asked for. */
  private renderAlignInParent(item: StudioItem): TemplateResult {
    const locks = itemLocks(item, this.primitives);
    const blocked = item.locked || locks.position.length > 0;
    return html`
      <details class="disclosure">
        <summary>${strings.inspector.alignInParent}</summary>
        <ods-anchor-picker
          .disabled=${blocked}
          @anchor-change=${this.onAlignChoice}
        ></ods-anchor-picker>
      </details>
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
          ${item.kind === "primitive" ? this.renderValueFields(item, "layout") : nothing}
          ${this.renderCornerToggle(item)} ${this.renderAlignInParent(item)}
          ${this.renderVisibility(item)}
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

  /** One widget field: our own control where there is one, else Home Assistant's form. */
  private renderWidgetField(
    field: WidgetFieldDefinition,
    value: unknown,
    change: (key: string, value: unknown) => void
  ): TemplateResult {
    const spec = widgetFieldAsPrimitive(field);
    if (!spec) return this.renderFormField(field, value, change);
    const wide = spec.shape === "number" ? "value-field" : "value-field wide";
    return html`
      <div class=${wide}>
        <ods-value-field
          .hass=${this.hass}
          .field=${spec}
          .value=${value}
          .palette=${this.dashboard.display.palette}
          .display=${this.dashboard.display}
          @primitive-field-change=${(
            event: OdsEvent<"primitive-field-change">
          ) => this.onWidgetFieldChange(event, change)}
        ></ods-value-field>
      </div>
    `;
  }

  private onWidgetFieldChange(
    event: OdsEvent<"primitive-field-change">,
    change: (key: string, value: unknown) => void
  ): void {
    event.stopPropagation();
    change(event.detail.key, event.detail.value);
  }

  /** A field that needs one of Home Assistant's pickers keeps its own form. */
  private renderFormField(
    field: WidgetFieldDefinition,
    value: unknown,
    change: (key: string, value: unknown) => void
  ): TemplateResult {
    return html`
      <div class="value-field wide">
        <ha-form
          .hass=${this.hass}
          .data=${{ [field.key]: value }}
          .schema=${[this.formSchema(field)]}
          .computeLabel=${formFieldLabel}
          @value-changed=${(event: OdsEvent<"widget-options-change">) =>
            change(field.key, event.detail.value[field.key])}
        ></ha-form>
      </div>
    `;
  }

  private setWidgetOption(key: string, value: unknown): void {
    emit(this, "widget-options-change", { value: { [key]: value } });
  }

  private setPickField(
    item: WidgetItem,
    source: WidgetSourceDefinition,
    pickId: string,
    key: string,
    value: unknown
  ): void {
    const picks = item.widget.sources[source.key] ?? [];
    emit(this, "widget-picks-change", {
      sourceKey: source.key,
      picks: withPickFields(picks, pickId, { [key]: value }, source),
    });
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
        <div class="value-fields">
          ${source.perSource.map((field) =>
            this.renderWidgetField(field, pick[field.key], (key, value) =>
              this.setPickField(item, source, pick.id, key, value)
            )
          )}
        </div>
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

  /**
   * The header of a section that can be reset: a dot while something differs from the
   * defaults, and the `reset` link that puts it all back in one undo step.
   */
  private renderResettableSummary(
    label: string,
    changed: boolean,
    reset: () => void
  ): TemplateResult {
    const onReset = (event: Event): void => {
      // The link sits in the summary: it must not also open or close the section.
      event.preventDefault();
      event.stopPropagation();
      reset();
    };
    return html`
      <summary>
        ${label}
        ${
          changed
            ? html`
                <span
                  class="changed-dot"
                  title=${strings.inspector.changed}
                ></span>
                <button
                  type="button"
                  class="reset-link"
                  title=${strings.inspector.resetTitle(label)}
                  @click=${onReset}
                >
                  ${strings.inspector.reset}
                </button>
              `
            : nothing
        }
      </summary>
    `;
  }

  private renderOptionSection(
    item: WidgetItem,
    section: WidgetOptionSection,
    open: boolean
  ): TemplateResult {
    const resettable = section.fields.filter(
      (field) => field.default !== undefined
    );
    const changed = changedFields(resettable, item.widget.options);
    const reset = (): void =>
      emit(this, "widget-options-change", { value: defaultValues(changed) });
    return html`
      <details class="inspector-section" ?open=${open}>
        ${this.renderResettableSummary(section.section, changed.length > 0, reset)}
        <div class="section-body">
          <div class="value-fields">
            ${section.fields.map((field) =>
              this.renderWidgetField(
                field,
                item.widget.options[field.key],
                (key, value) => this.setWidgetOption(key, value)
              )
            )}
          </div>
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

  /** Half a row for a short value, a whole row for anything longer. */
  private fieldSpan(field: PrimitiveField): string {
    return field.shape === "number" ? "" : "wide";
  }

  private renderValueField(
    item: PrimitiveItem,
    field: PrimitiveField
  ): TemplateResult {
    const values: Record<string, unknown> = { ...item.primitive };
    const control = html`
      <ods-value-field
        .hass=${this.hass}
        .field=${field}
        .value=${values[field.key]}
        .palette=${this.dashboard.display.palette}
        .display=${this.dashboard.display}
        .disabled=${item.locked}
      ></ods-value-field>
    `;
    return html`
      <div class=${`value-field ${this.fieldSpan(field)}`}>
        ${this.renderExpressible(item, field.key, field.label, control)}
      </div>
    `;
  }

  private renderValueFields(
    item: PrimitiveItem,
    section: PrimitiveField["section"],
    advanced = false
  ): TemplateResult {
    const fields = primitiveFields(item, this.primitives, section).filter(
      (field) => Boolean(field.advanced) === advanced
    );
    return html`
      <div class="value-fields">
        ${fields.map((field) => this.renderValueField(item, field))}
      </div>
    `;
  }

  /** The rarely needed fields, closed until asked for or until one has been changed. */
  private renderAdvancedFields(
    item: PrimitiveItem
  ): TemplateResult | typeof nothing {
    const advanced = primitiveFields(
      item,
      this.primitives,
      "appearance"
    ).filter((field) => field.advanced);
    if (advanced.length === 0) return nothing;
    const changed = changedFields(
      advanced,
      { ...item.primitive },
      item.expressions
    );
    return html`
      <details class="disclosure" ?open=${changed.length > 0}>
        <summary>${strings.inspector.advanced}</summary>
        ${this.renderValueFields(item, "appearance", true)}
      </details>
    `;
  }

  private renderAppearance(item: PrimitiveItem): TemplateResult {
    const resettable = primitiveFields(
      item,
      this.primitives,
      "appearance"
    ).filter((field) => !field.required || field.default !== undefined);
    const changed = changedFields(
      resettable,
      { ...item.primitive },
      item.expressions
    );
    const reset = (): void =>
      emit(this, "primitive-fields-reset", { values: defaultValues(changed) });
    return html`
      <details class="inspector-section" open>
        ${this.renderResettableSummary(
          strings.inspector.appearance,
          changed.length > 0,
          reset
        )}
        <div class="section-body">
          ${this.renderValueFields(item, "appearance")}
          ${this.renderAdvancedFields(item)}
        </div>
      </details>
    `;
  }

  private onBackgroundFieldChange(
    item: ContainerItem,
    event: OdsEvent<"primitive-field-change">
  ): void {
    event.stopPropagation();
    const { key, value } = event.detail;
    emit(this, "container-background-change", {
      value: { ...backgroundFormData(item), [key]: value },
    });
  }

  private renderBackgroundField(
    item: ContainerItem,
    field: PrimitiveField
  ): TemplateResult {
    const values = backgroundFormData(item);
    return html`
      <div
        class=${field.shape === "number" ? "value-field" : "value-field wide"}
      >
        <ods-value-field
          .hass=${this.hass}
          .field=${field}
          .value=${values[field.key]}
          .palette=${this.dashboard.display.palette}
          .display=${this.dashboard.display}
          .disabled=${item.locked}
          @primitive-field-change=${(
            event: OdsEvent<"primitive-field-change">
          ) => this.onBackgroundFieldChange(item, event)}
        ></ods-value-field>
      </div>
    `;
  }

  /** The background of a plain container; a group has none. */
  private renderContainerBackground(
    item: ContainerItem
  ): TemplateResult | typeof nothing {
    if (item.grouped) return nothing;
    return html`
      <details class="inspector-section" open>
        <summary>${strings.inspector.background}</summary>
        <div class="section-body">
          <div class="value-fields">
            ${backgroundFields().map((field) =>
              this.renderBackgroundField(item, field)
            )}
          </div>
        </div>
      </details>
    `;
  }

  /** A widget asks for its data first and its layout last; a primitive the other way. */
  private renderItemSections(item: StudioItem): TemplateResult {
    if (item.kind === "widget") {
      return html`
        ${this.renderLayoutSection(item)} ${this.renderWidgetSettings(item)}
      `;
    }
    if (item.kind === "container") {
      return html`
        ${this.renderLayoutSection(item)}
        ${this.renderContainerBackground(item)}
      `;
    }
    return html`
      ${this.renderLayoutSection(item)} ${this.renderAppearance(item)}
    `;
  }

  private kindOf(item: StudioItem): string {
    if (item.kind === "widget") return strings.inspector.kindWidget;
    if (item.kind === "container") {
      return item.grouped
        ? strings.inspector.kindGroup
        : strings.inspector.kindContainer;
    }
    return strings.inspector.kindPrimitive;
  }

  private renderGroupedChip(item: StudioItem): TemplateResult | typeof nothing {
    if (item.kind !== "container" || !item.grouped) return nothing;
    return html`
      <div class="locked-notice grouped-chip">
        <span>
          <ha-icon icon="mdi:group"></ha-icon>
          ${strings.inspector.groupedChip}
        </span>
      </div>
    `;
  }

  private renderItemInspector(item: StudioItem): TemplateResult {
    return html`
      ${this.renderHeader(
        item.name,
        strings.inspector.subtitle(this.kindOf(item), item.locked),
        itemIcon(item, this.widgets, this.primitives),
        this.renderHiddenSwitch(item)
      )}
      ${this.renderGroupedChip(item)} ${this.renderLockedNotice(item)}
      ${this.renderItemSections(item)}
      ${this.renderDangerZone(strings.inspector.removeElement, () =>
        this.requestItemDelete(item)
      )}
      ${this.renderMetrics()}
    `;
  }

  /** Several elements selected: what they add up to, and what can be done to all of them. */
  private renderMultiInspector(): TemplateResult {
    const count = this.selectedItemIds.length;
    const box = selectionBox(
      this.dashboard,
      this.selectedItemIds,
      (item) => this.preview?.itemBounds[item.id]
    );
    return html`
      ${this.renderHeader(
        strings.inspector.selectedElements(count),
        strings.inspector.selectionHint,
        "mdi:select-multiple"
      )}
      ${
        box
          ? html`
              <details class="inspector-section" open>
                <summary>${strings.inspector.boundingBox}</summary>
                <div class="section-body">
                  <div class="field-grid">
                    ${this.renderBoxValue(strings.fields.x, box.x)}
                    ${this.renderBoxValue(strings.fields.y, box.y)}
                    ${this.renderBoxValue(strings.fields.width, box.width)}
                    ${this.renderBoxValue(strings.fields.height, box.height)}
                  </div>
                </div>
              </details>
            `
          : nothing
      }
      ${this.renderDangerZone(strings.inspector.removeElements, () =>
        emit(this, "command", { id: "delete-item" })
      )}
    `;
  }

  private renderBoxValue(label: string, value: number): TemplateResult {
    return html`
      <ods-property-field
        .label=${label}
        .fieldKey=${label}
        .value=${Math.round(value)}
        .disabled=${true}
      ></ods-property-field>
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

  private renderProperties(item: StudioItem | undefined): TemplateResult {
    if (this.selectedItemIds.length > 1) return this.renderMultiInspector();
    if (item) return this.renderItemInspector(item);
    return this.renderDashboardInspector();
  }

  protected render(): TemplateResult {
    if (this.collapsed) {
      return this.renderRail();
    }
    const item = findItem(this.dashboard.items, this.selectedItemId);
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
          .selectedItemIds=${this.selectedItemIds}
          .enteredGroupId=${this.enteredGroupId}
          .renameRequestId=${this.renameRequestId}
        ></ods-structure>
        <section class="properties">${this.renderProperties(item)}</section>
      </aside>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-inspector": OdsInspector;
  }
}
