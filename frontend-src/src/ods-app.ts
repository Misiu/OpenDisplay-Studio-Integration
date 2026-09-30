import {
  css,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  catalogCascadePosition,
  applyProfile,
  createPrimitiveItem,
  createWidgetItem,
  moveLayer,
  removeItem,
  setBackground,
  setDisplayNumber,
  setItemNumber,
  setPalette,
  setWidgetConfig,
  toggleItemState,
  updatePrimitiveFields,
} from "./dashboard-ops";
import {
  commandById,
  commandForKey,
  type CommandActions,
  type CommandContext,
  type CommandId,
} from "./commands";
import {
  copyName,
  dashboardFromForm,
  dashboardIsValid,
  freshDashboard,
} from "./dashboards";
import { profileById } from "./display-profiles";
import { isTypingTarget } from "./dom";
import { type DashboardDialog, type EditorView, type OdsEvent } from "./events";
import { snapToGrid, workingArea } from "./geometry";
import { History } from "./history";
import { itemName } from "./item-labels";
import { strings } from "./strings";
import * as api from "./studio-api";
import { clamp } from "./math";
import { baseStyles, chromeStyles } from "./studio-styles";
import { DEFAULT_VIEWPORT, type Viewport } from "./viewport";
import type {
  ComposePreviewResponse,
  Dashboard,
  HomeAssistant,
  PrimitiveDefinition,
  StudioItem,
  WidgetConfig,
  WidgetDefinition,
} from "./types";
import type { OdsCanvas } from "./ods-canvas";
import "./ods-canvas";
import "./ods-code-view";
import "./ods-confirm-dialog";
import "./ods-gallery";
import "./ods-header";
import "./ods-inspector";
import "./ods-library";
import "./ods-new-dashboard-dialog";

const PREVIEW_DELAY_MS = 220;
const messageFrom = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === "string" && error) {
    return error;
  }
  return fallback;
};

/**
 * The panel shell. It owns the dashboards, the open dashboard, the selection and the history;
 * every child element reports intent through events and this element applies it.
 */
@customElement("ods-app")
export class OdsApp extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        --studio-accent: var(--primary-color, #03a9f4);
        --studio-accent-soft: color-mix(
          in srgb,
          var(--studio-accent) 14%,
          transparent
        );
        --studio-border: var(--divider-color, #d5dadd);
        --studio-surface: var(--card-background-color, #fff);
        --studio-text: var(--primary-text-color, #202124);
        --studio-muted: var(--secondary-text-color, #68727a);
        display: block;
        width: 100%;
        height: 100vh;
        height: 100dvh;
        max-height: 100vh;
        max-height: 100dvh;
        min-height: 0;
        color: var(--studio-text);
        background: var(--primary-background-color, #f5f7f8);
        font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
        overflow: hidden;
        overflow-anchor: none;
        contain: size layout paint;
      }
      .shell {
        height: 100%;
        max-height: 100%;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        overflow-anchor: none;
      }
      .layout {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: var(--toolbox-width) minmax(0, 1fr) var(
            --inspector-width
          );
        overflow: hidden;
      }
      .dashboard-empty {
        position: relative;
        height: 100%;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(
            circle at 50% 30%,
            color-mix(in srgb, var(--studio-accent) 12%, transparent),
            transparent 42%
          ),
          var(--primary-background-color, #f5f7f8);
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: minmax(0, 1fr) !important;
        }
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private dashboards: Dashboard[] = [];
  @state() private view: EditorView = "dashboards";
  @state() private widgets: WidgetDefinition[] = [];
  @state() private primitives: PrimitiveDefinition[] = [];
  @state() private current?: Dashboard;
  @state() private selectedItemId = "";
  @state() private preview?: ComposePreviewResponse;
  @state() private loading = true;
  @state() private saving = false;
  @state() private dirty = false;
  @state() private error = "";
  @state() private draggingCatalog = false;
  @state() private undoCount = 0;
  @state() private redoCount = 0;
  @state() private pendingDeleteItemId = "";
  @state() private leftCollapsed = false;
  @state() private rightCollapsed = false;
  @state() private inspectorWidth = 350;
  @state() private snapEnabled = true;
  @state() private viewport: Viewport = DEFAULT_VIEWPORT;
  @state() private newDashboardOpen = false;
  @state() private newDashboard = freshDashboard("en");
  @state() private dashboardDialog?: DashboardDialog;
  @state() private dashboardDraft?: Dashboard;

  @query("ods-canvas") private canvas?: OdsCanvas;

  private previewTimer?: number;
  private previewRequest = 0;
  private bootstrapStarted = false;
  private readonly history = new History<Dashboard>();

  private get language(): string {
    return this.hass?.language || "en";
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
  }
  protected firstUpdated(): void {
    this.ensureBootstrap();
  }
  protected updated(changed: PropertyValues<this>): void {
    if (changed.has("hass")) this.ensureBootstrap();
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.previewTimer) window.clearTimeout(this.previewTimer);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  // --- loading -------------------------------------------------------------------------------

  private ensureBootstrap(): void {
    if (!this.hass || this.bootstrapStarted) return;
    this.bootstrapStarted = true;
    void this.bootstrap();
  }
  private async bootstrap(): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    this.loading = true;
    this.error = "";
    try {
      const data = await api.bootstrap(hass);
      this.dashboards = data.dashboards;
      this.widgets = data.widgets;
      this.primitives = data.primitives;
      this.current = undefined;
      this.preview = undefined;
      this.view = "dashboards";
      this.clearHistory();
      this.newDashboard = freshDashboard(hass.language);
    } catch (error) {
      this.error = messageFrom(error, strings.app.loadFailed);
    } finally {
      this.loading = false;
    }
  }

  // --- dashboards (gallery) --------------------------------------------------------------------

  private openNewDashboard(): void {
    this.newDashboard = freshDashboard(this.language);
    this.newDashboardOpen = true;
  }
  private async createDashboard(): Promise<void> {
    if (!this.hass) return;
    this.saving = true;
    this.error = "";
    try {
      const created = await api.createDashboard(this.hass, this.newDashboard);
      this.dashboards = [...this.dashboards, created];
      this.current = structuredClone(created);
      this.selectedItemId = "";
      this.dirty = false;
      this.newDashboardOpen = false;
      this.view = "design";
      this.clearHistory();
      await this.composePreview();
      await this.updateComplete;
      this.showWholeCanvas();
    } catch (error) {
      this.error = messageFrom(error, strings.app.createFailed);
    } finally {
      this.saving = false;
    }
  }
  private async saveDashboard(): Promise<void> {
    if (!this.hass || !this.current) return;
    this.saving = true;
    this.error = "";
    try {
      const saved = await api.updateDashboard(this.hass, this.current);
      this.current = structuredClone(saved);
      this.dashboards = this.dashboards.map((dashboard) =>
        dashboard.id === saved.id ? saved : dashboard
      );
      this.dirty = false;
    } catch (error) {
      this.error = messageFrom(error, strings.app.saveFailed);
    } finally {
      this.saving = false;
    }
  }
  private async deleteDashboard(): Promise<void> {
    if (!this.hass || !this.current) return;
    const id = this.current.id;
    try {
      await api.deleteDashboard(this.hass, id);
      this.dashboards = this.dashboards.filter(
        (dashboard) => dashboard.id !== id
      );
      this.current = undefined;
      this.selectedItemId = "";
      this.preview = undefined;
      this.dirty = false;
      this.view = "dashboards";
      this.clearHistory();
    } catch (error) {
      this.error = messageFrom(error, strings.app.deleteFailed);
    }
  }
  private openDashboard(dashboard: Dashboard): void {
    if (this.current?.id === dashboard.id) {
      this.view = "design";
      if (!this.preview) void this.composePreview();
      return;
    }
    if (this.dirty && !window.confirm(strings.app.discardChanges)) return;
    this.current = structuredClone(dashboard);
    this.selectedItemId = "";
    this.dirty = false;
    this.clearHistory();
    this.view = "design";
    void this.composePreview().then(() => this.showWholeCanvas());
  }
  private openAction(dashboard: Dashboard, action: DashboardDialog): void {
    this.dashboardDraft = structuredClone(dashboard);
    this.dashboardDialog = action;
  }
  private closeAction(): void {
    this.dashboardDialog = undefined;
    this.dashboardDraft = undefined;
  }
  private async updateFromGallery(
    dashboard: Dashboard,
    fallback: string
  ): Promise<Dashboard | undefined> {
    if (!this.hass || this.saving) return undefined;
    this.saving = true;
    this.error = "";
    try {
      const saved = await api.updateDashboard(this.hass, dashboard);
      this.dashboards = this.dashboards.map((candidate) =>
        candidate.id === saved.id ? saved : candidate
      );
      if (this.current?.id === saved.id) {
        this.current = structuredClone(saved);
        this.preview = undefined;
        this.dirty = false;
      }
      return saved;
    } catch (error) {
      this.error = messageFrom(error, fallback);
      return undefined;
    } finally {
      this.saving = false;
    }
  }
  private async saveRename(): Promise<void> {
    if (
      this.dashboardDialog !== "rename" ||
      !this.dashboardDraft ||
      this.saving
    ) {
      return;
    }
    const dashboard = structuredClone(this.dashboardDraft);
    dashboard.name = dashboard.name.trim();
    if (!dashboard.name) {
      this.error = strings.app.renameEmpty;
      return;
    }
    if (
      this.dashboards.find((candidate) => candidate.id === dashboard.id)
        ?.name === dashboard.name
    ) {
      this.closeAction();
      return;
    }
    if (await this.updateFromGallery(dashboard, strings.app.renameFailed)) {
      this.closeAction();
    }
  }
  private async duplicateDashboard(dashboard: Dashboard): Promise<void> {
    if (!this.hass || this.saving) return;
    this.saving = true;
    this.error = "";
    const duplicate = structuredClone(dashboard);
    duplicate.id = "";
    duplicate.name = copyName(dashboard, this.dashboards, this.language);
    duplicate.status = "draft";
    duplicate.createdAt = "";
    duplicate.updatedAt = "";
    try {
      const created = await api.createDashboard(this.hass, duplicate);
      this.dashboards = [...this.dashboards, created];
    } catch (error) {
      this.error = messageFrom(error, strings.app.duplicateFailed);
    } finally {
      this.saving = false;
    }
  }
  private async saveSettings(): Promise<void> {
    if (
      this.dashboardDialog !== "settings" ||
      !this.dashboardDraft ||
      !dashboardIsValid(this.dashboardDraft)
    ) {
      return;
    }
    const dashboard = structuredClone(this.dashboardDraft);
    dashboard.name = dashboard.name.trim();
    if (await this.updateFromGallery(dashboard, strings.app.settingsFailed)) {
      this.closeAction();
    }
  }
  private async confirmDeleteDashboard(): Promise<void> {
    if (
      this.dashboardDialog !== "delete" ||
      !this.dashboardDraft ||
      !this.hass ||
      this.saving
    ) {
      return;
    }
    const id = this.dashboardDraft.id;
    this.saving = true;
    this.error = "";
    try {
      await api.deleteDashboard(this.hass, id);
      this.dashboards = this.dashboards.filter(
        (dashboard) => dashboard.id !== id
      );
      if (this.current?.id === id) {
        this.current = undefined;
        this.selectedItemId = "";
        this.preview = undefined;
        this.dirty = false;
        this.clearHistory();
      }
      this.closeAction();
    } catch (error) {
      this.error = messageFrom(error, strings.app.deleteFailed);
    } finally {
      this.saving = false;
    }
  }

  // --- the open dashboard: document, history, preview ------------------------

  private mutate(
    mutator: (dashboard: Dashboard) => void,
    preview = true,
    history = true
  ): void {
    if (!this.current) return;
    const before = structuredClone(this.current);
    const next = structuredClone(this.current);
    mutator(next);
    if (JSON.stringify(next) === JSON.stringify(before)) return;
    if (history) this.recordHistory(before);
    this.current = next;
    this.dirty = true;
    if (preview) this.schedulePreview();
  }
  private recordHistory(dashboard: Dashboard): void {
    this.history.record(dashboard);
    this.syncHistory();
  }
  private clearHistory(): void {
    this.history.clear();
    this.syncHistory();
  }
  private syncHistory(): void {
    this.undoCount = this.history.undoCount;
    this.redoCount = this.history.redoCount;
  }
  private restore(snapshot: Dashboard | undefined): void {
    if (!snapshot) return;
    this.current = snapshot;
    this.dirty = true;
    if (
      this.selectedItemId &&
      !snapshot.items.some((item) => item.id === this.selectedItemId)
    ) {
      this.selectedItemId = "";
    }
    this.syncHistory();
    this.schedulePreview();
  }
  private undo = (): void => {
    if (this.current) this.restore(this.history.undo(this.current));
  };
  private redo = (): void => {
    if (this.current) this.restore(this.history.redo(this.current));
  };
  // --- commands ----------------------------------------------------------------

  private readonly commandActions: CommandActions = {
    undo: () => this.undo(),
    redo: () => this.redo(),
    requestDelete: (itemId) => {
      this.pendingDeleteItemId = itemId;
    },
    toggleFlag: (itemId, flag) =>
      this.mutate((next) => toggleItemState(next, itemId, flag)),
  };

  private commandContext(item?: StudioItem): CommandContext {
    return {
      canUndo: this.undoCount > 0,
      canRedo: this.redoCount > 0,
      item,
    };
  }

  private get selectedItem(): StudioItem | undefined {
    return this.current?.items.find(
      (candidate) => candidate.id === this.selectedItemId
    );
  }

  private runCommand(id: CommandId, item = this.selectedItem): void {
    const command = commandById(id);
    const context = this.commandContext(item);
    if (command.isEnabled(context)) {
      command.run(context, this.commandActions);
    }
  }

  private onCommand(event: OdsEvent<"command">): void {
    const { id, itemId } = event.detail;
    const item = itemId
      ? this.current?.items.find((candidate) => candidate.id === itemId)
      : undefined;
    this.runCommand(id, item ?? this.selectedItem);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (this.view !== "design" || isTypingTarget(event)) {
      return;
    }
    const command = commandForKey(event);
    if (command?.isEnabled(this.commandContext(this.selectedItem))) {
      event.preventDefault();
      this.runCommand(command.id);
    }
  };

  private schedulePreview(): void {
    if (this.previewTimer) window.clearTimeout(this.previewTimer);
    this.previewTimer = window.setTimeout(
      () => void this.composePreview(),
      PREVIEW_DELAY_MS
    );
  }
  private async composePreview(): Promise<void> {
    if (!this.hass || !this.current) return;
    this.error = "";
    const request = ++this.previewRequest;
    try {
      const result = await api.composePreview(this.hass, this.current);
      if (request === this.previewRequest) this.preview = result;
    } catch (error) {
      this.error = messageFrom(error, strings.app.previewFailed);
    }
  }
  private setEditorView(view: "design" | "code"): void {
    this.view = view;
    if (view === "code" && !this.preview) void this.composePreview();
  }
  private selectItem(itemId: string): void {
    if (this.selectedItemId !== itemId) this.selectedItemId = itemId;
  }
  private showWholeCanvas(): void {
    this.canvas?.resetView();
    requestAnimationFrame(() => this.canvas?.fitView());
  }

  // --- adding elements -------------------------------------------------------

  private addAt(value: string, x: number, y: number): void {
    const dashboard = this.current;
    if (!dashboard) return;
    const [kind, type] = value.split(":");
    if (!type) return;
    let item: StudioItem | undefined;
    if (kind === "widget") {
      const definition = this.widgets.find((widget) => widget.id === type);
      if (definition) item = createWidgetItem(definition, x, y, dashboard);
    } else if (kind === "primitive") {
      item = createPrimitiveItem(this.primitives, type, x, y, dashboard);
      if (!item) {
        this.error = strings.app.unsupportedPrimitive(type);
        return;
      }
    }
    if (!item) return;
    const added = item;
    this.mutate((next) => {
      next.items.push(added);
    });
    this.selectItem(added.id);
  }
  private addFromCatalog(value: string): void {
    if (!this.current) return;
    const { x, y } = catalogCascadePosition(this.current, this.snapEnabled);
    this.addAt(value, x, y);
  }
  private dropFromCatalog(
    value: string,
    clientX: number,
    clientY: number
  ): void {
    const dashboard = this.current;
    const point = this.canvas?.displayPointAt(clientX, clientY);
    if (!dashboard || !point) return;
    const area = workingArea(dashboard);
    this.addAt(
      value,
      clamp(
        snapToGrid(point.x, dashboard, this.snapEnabled),
        area.x,
        area.x + area.width - 1
      ),
      clamp(
        snapToGrid(point.y, dashboard, this.snapEnabled),
        area.y,
        area.y + area.height - 1
      )
    );
  }
  private confirmDeleteItem(): void {
    const itemId = this.pendingDeleteItemId;
    if (!itemId) return;
    this.pendingDeleteItemId = "";
    this.mutate((next) => removeItem(next, itemId));
    if (this.selectedItemId === itemId) this.selectItem("");
  }

  // --- events from the elements ---------------------------------------------

  private onDashboardOpen(event: OdsEvent<"dashboard-open">): void {
    this.openDashboard(event.detail.dashboard);
  }

  private onDashboardMenuAction(
    event: OdsEvent<"dashboard-menu-action">
  ): void {
    const { dashboard, action } = event.detail;
    if (action === "duplicate") {
      void this.duplicateDashboard(dashboard);
      return;
    }
    this.openAction(dashboard, action);
  }

  private onRenameInput(event: OdsEvent<"dashboard-rename-input">): void {
    if (this.dashboardDraft) {
      this.dashboardDraft = { ...this.dashboardDraft, name: event.detail.name };
    }
  }

  private onSettingsChange(event: OdsEvent<"dashboard-settings-change">): void {
    if (this.dashboardDraft) {
      this.dashboardDraft = dashboardFromForm(
        this.dashboardDraft,
        event.detail.value
      );
    }
  }

  private onNewDashboardChange(event: OdsEvent<"new-dashboard-change">): void {
    this.newDashboard = dashboardFromForm(
      this.newDashboard,
      event.detail.value
    );
  }

  private closeNewDashboard(): void {
    this.newDashboardOpen = false;
  }

  private showGallery(): void {
    this.view = "dashboards";
  }

  private onNameChange(event: OdsEvent<"dashboard-name-change">): void {
    this.mutate((next) => {
      next.name = event.detail.name;
    }, false);
  }

  private onViewChange(event: OdsEvent<"view-change">): void {
    this.setEditorView(event.detail.view);
  }

  private toggleReady(): void {
    this.mutate((next) => {
      next.status = next.status === "ready" ? "draft" : "ready";
    }, false);
  }

  private onItemSelect(event: OdsEvent<"item-select">): void {
    this.selectItem(event.detail.itemId);
  }

  private cancelDeleteItem(): void {
    this.pendingDeleteItemId = "";
  }

  private onLibraryCollapse(event: OdsEvent<"library-collapse">): void {
    this.leftCollapsed = event.detail.collapsed;
  }

  private onCatalogAdd(event: OdsEvent<"catalog-add">): void {
    this.addFromCatalog(event.detail.value);
  }

  private onCatalogDrag(event: OdsEvent<"catalog-drag">): void {
    this.draggingCatalog = event.detail.active;
  }

  private onCatalogDrop(event: OdsEvent<"catalog-drop">): void {
    const { value, clientX, clientY } = event.detail;
    this.dropFromCatalog(value, clientX, clientY);
  }

  private onViewportChange(event: OdsEvent<"viewport-change">): void {
    this.viewport = event.detail;
  }

  /** A live move or resize: replaces the item without a history step or preview. */
  private onItemTransform(event: OdsEvent<"item-transform">): void {
    const { item } = event.detail;
    this.mutate(
      (next) => {
        const index = next.items.findIndex(
          (candidate) => candidate.id === item.id
        );
        if (index >= 0) {
          next.items[index] = item;
        }
      },
      false,
      false
    );
  }

  private onItemTransformEnd(event: OdsEvent<"item-transform-end">): void {
    this.recordHistory(event.detail.before);
    this.schedulePreview();
  }

  private toggleSnap(): void {
    this.snapEnabled = !this.snapEnabled;
  }

  private onInspectorCollapse(event: OdsEvent<"inspector-collapse">): void {
    this.rightCollapsed = event.detail.collapsed;
  }

  private onInspectorResize(event: OdsEvent<"inspector-resize">): void {
    this.inspectorWidth = event.detail.width;
  }

  private onLayersReorder(event: OdsEvent<"layers-reorder">): void {
    const { itemId, targetId, edge } = event.detail;
    this.mutate((next) => moveLayer(next, itemId, targetId, edge));
  }

  private onItemNumberChange(event: OdsEvent<"item-number-change">): void {
    const { key, value } = event.detail;
    this.mutate((next) =>
      setItemNumber(next, this.selectedItemId, key, value, this.primitives)
    );
  }

  private onDisplayNumberChange(
    event: OdsEvent<"display-number-change">
  ): void {
    const { key, value } = event.detail;
    this.mutate((next) => setDisplayNumber(next, key, value));
  }

  private onProfileChange(event: OdsEvent<"profile-change">): void {
    const profile = profileById(event.detail.profileId);
    this.mutate((next) => applyProfile(next, profile));
    requestAnimationFrame(() => this.canvas?.fitView());
  }

  private onPaletteChange(event: OdsEvent<"palette-change">): void {
    this.mutate((next) => setPalette(next, event.detail.palette));
  }

  private onBackgroundChange(event: OdsEvent<"background-change">): void {
    this.mutate((next) => setBackground(next, event.detail.color));
  }

  private onWidgetConfigChange(event: OdsEvent<"widget-config-change">): void {
    // The value comes from `ha-form`, which is typed loosely at this boundary.
    const config = event.detail.value as WidgetConfig;
    this.mutate((next) => setWidgetConfig(next, this.selectedItemId, config));
  }

  private onPrimitiveChange(event: OdsEvent<"primitive-change">): void {
    const { value } = event.detail;
    this.mutate((next) =>
      updatePrimitiveFields(next, this.selectedItemId, value, this.primitives)
    );
  }

  // --- templates -------------------------------------------------------------

  private renderDeleteDialog(): TemplateResult | typeof nothing {
    const item = this.current?.items.find(
      (candidate) => candidate.id === this.pendingDeleteItemId
    );
    if (!item) {
      return nothing;
    }
    return html`
      <ods-confirm-dialog
        eyebrow=${strings.app.confirmRemoval}
        heading=${strings.app.deleteElementTitle(itemName(item, this.widgets, this.primitives))}
        body=${strings.app.deleteElementBody}
        confirmLabel=${strings.app.deleteElement}
        @confirm-accept=${this.confirmDeleteItem}
        @confirm-cancel=${this.cancelDeleteItem}
      ></ods-confirm-dialog>
    `;
  }

  private renderNewDashboardDialog(): TemplateResult | typeof nothing {
    if (!this.newDashboardOpen) {
      return nothing;
    }
    return html`
      <ods-new-dashboard-dialog
        .hass=${this.hass}
        .dashboard=${this.newDashboard}
        .saving=${this.saving}
        @new-dashboard-change=${this.onNewDashboardChange}
        @new-dashboard-close=${this.closeNewDashboard}
        @dashboard-create=${this.createDashboard}
      ></ods-new-dashboard-dialog>
    `;
  }

  private renderGallery(): TemplateResult {
    return html`
      <ods-gallery
        .dashboards=${this.dashboards}
        .hass=${this.hass}
        .error=${this.error}
        .saving=${this.saving}
        .dialog=${this.dashboardDialog}
        .draft=${this.dashboardDraft}
        @dashboard-new=${this.openNewDashboard}
        @dashboard-open=${this.onDashboardOpen}
        @dashboard-menu-action=${this.onDashboardMenuAction}
        @dashboard-rename-input=${this.onRenameInput}
        @dashboard-rename-commit=${this.saveRename}
        @dashboard-rename-cancel=${this.closeAction}
        @dashboard-settings-change=${this.onSettingsChange}
        @dashboard-settings-save=${this.saveSettings}
        @dashboard-delete-confirm=${this.confirmDeleteDashboard}
        @dashboard-dialog-close=${this.closeAction}
      ></ods-gallery>
      ${this.renderNewDashboardDialog()}
    `;
  }

  private renderDesign(dashboard: Dashboard): TemplateResult {
    const layoutStyle = styleMap({
      "--toolbox-width": this.leftCollapsed ? "48px" : "255px",
      "--inspector-width": this.rightCollapsed
        ? "48px"
        : `${this.inspectorWidth}px`,
    });
    return html`
      <div
        class="layout"
        style=${layoutStyle}
        @item-select=${this.onItemSelect}
        @command=${this.onCommand}
      >
        <ods-library
          .widgets=${this.widgets}
          .primitives=${this.primitives}
          .collapsed=${this.leftCollapsed}
          @library-collapse=${this.onLibraryCollapse}
          @catalog-add=${this.onCatalogAdd}
          @catalog-drag=${this.onCatalogDrag}
          @catalog-drop=${this.onCatalogDrop}
        ></ods-library>
        <ods-canvas
          .dashboard=${dashboard}
          .preview=${this.preview}
          .widgets=${this.widgets}
          .primitives=${this.primitives}
          .selectedItemId=${this.selectedItemId}
          .snapEnabled=${this.snapEnabled}
          .acceptingDrop=${this.draggingCatalog}
          .canUndo=${this.undoCount > 0}
          .canRedo=${this.redoCount > 0}
          .viewport=${this.viewport}
          @viewport-change=${this.onViewportChange}
          @item-transform=${this.onItemTransform}
          @item-transform-end=${this.onItemTransformEnd}
          @snap-toggle=${this.toggleSnap}
        ></ods-canvas>
        <ods-inspector
          .hass=${this.hass}
          .dashboard=${dashboard}
          .widgets=${this.widgets}
          .primitives=${this.primitives}
          .preview=${this.preview}
          .selectedItemId=${this.selectedItemId}
          .collapsed=${this.rightCollapsed}
          .width=${this.inspectorWidth}
          @inspector-collapse=${this.onInspectorCollapse}
          @inspector-resize=${this.onInspectorResize}
          @layers-reorder=${this.onLayersReorder}
          @item-number-change=${this.onItemNumberChange}
          @display-number-change=${this.onDisplayNumberChange}
          @profile-change=${this.onProfileChange}
          @palette-change=${this.onPaletteChange}
          @background-change=${this.onBackgroundChange}
          @widget-config-change=${this.onWidgetConfigChange}
          @primitive-change=${this.onPrimitiveChange}
          @dashboard-delete-request=${this.deleteDashboard}
        ></ods-inspector>
      </div>
      ${this.renderDeleteDialog()}
    `;
  }

  private renderError(): TemplateResult | typeof nothing {
    if (!this.error) {
      return nothing;
    }
    return html`
      <ha-alert alert-type="error">${this.error}</ha-alert>
    `;
  }

  private renderEditor(dashboard: Dashboard): TemplateResult {
    return html`
      <div class="shell">
        <ods-header
          .dashboard=${dashboard}
          .view=${this.view}
          .dirty=${this.dirty}
          .saving=${this.saving}
          @show-dashboards=${this.showGallery}
          @dashboard-name-change=${this.onNameChange}
          @view-change=${this.onViewChange}
          @toggle-ready=${this.toggleReady}
          @dashboard-save=${this.saveDashboard}
        ></ods-header>
        ${this.renderError()}
        ${
          this.view === "code"
            ? html`
                <ods-code-view .preview=${this.preview}></ods-code-view>
              `
            : this.renderDesign(dashboard)
        }
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (this.loading) {
      return html`
        <div class="dashboard-empty">
          <p>${strings.app.loading}</p>
        </div>
      `;
    }
    const dashboard = this.current;
    if (this.view === "dashboards" || !dashboard) {
      return this.renderGallery();
    }
    return this.renderEditor(dashboard);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-app": OdsApp;
  }
}
