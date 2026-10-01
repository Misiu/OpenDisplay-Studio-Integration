import { applyLanguage } from "./i18n";
import { backgroundFromForm } from "./container-fields";
import {
  copyItems,
  duplicateItems,
  pasteItems,
  pasteTarget,
  COPY_OFFSET,
  type ClipboardData,
} from "./clipboard";
import { nudgeItems } from "./nudge";
import { itemLocks } from "./locks";
import { bringToFront, sendToBack, stepItems } from "./tree";
import { withZoom } from "./viewport";
import {
  canGroup,
  canUngroup,
  createContainerItem,
  groupItems,
  insertOnDisplay,
  reparentByDrop,
  setContainerBackground,
  ungroupItem,
} from "./container-ops";
import {
  ancestors,
  replaceItem,
  containerAt,
  findItem,
  isContainer,
  isGroup,
  locate,
} from "./tree";
import { optionsFromForm } from "./widget-fields";
import {
  CLOCK_REFRESH_MS,
  STATE_REFRESH_DELAY_MS,
  dependenciesChanged,
} from "./preview-refresh";
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
  createPrimitiveItem,
  renameItem,
  createWidgetItem,
  moveLayer,
  removeItem,
  setBackground,
  setDisplayNumber,
  setItemExpression,
  setItemNumber,
  setPalette,
  setRotation,
  setWidgetOptions,
  setWidgetPicks,
  toggleItemState,
  updatePrimitiveFields,
} from "./dashboard-ops";
import {
  commandById,
  CANVAS_MENU,
  EMPTY_CANVAS_MENU,
  TREE_MENU,
  commandForKey,
  isCommandId,
  menuEntries,
  type CommandActions,
  type CommandContext,
  type CommandId,
  type MenuEntry,
  type MenuLayout,
} from "./commands";
import {
  copyName,
  PRESET_PROFILES,
  dashboardFromDevice,
  dashboardFromForm,
  dashboardFromProfile,
  dashboardIsValid,
  freshDashboard,
  type DashboardSource,
} from "./dashboards";
import { isMacPlatform, isTypingTarget } from "./dom";
import { type DashboardDialog, type EditorView, type OdsEvent } from "./events";
import { snapToGrid, workingArea } from "./geometry";
import { History } from "./history";
import { strings } from "./strings";
import * as api from "./studio-api";
import { clamp } from "./math";
import { baseStyles, chromeStyles } from "./studio-styles";
import { DEFAULT_VIEWPORT, type Viewport } from "./viewport";
import type {
  ComposePreviewResponse,
  Dashboard,
  DisplayDevice,
  HomeAssistant,
  PrimitiveDefinition,
  StudioItem,
  WidgetLoadError,
  WidgetDefinition,
} from "./types";
import type { OdsCanvas } from "./ods-canvas";
import "./ods-canvas";
import "./ods-code-view";
import "./ods-confirm-dialog";
import "./ods-context-menu";
import "./ods-shortcuts-dialog";
import "./ods-gallery";
import "./ods-header";
import "./ods-inspector";
import "./ods-library";
import "./ods-new-dashboard-dialog";

const ancestorIds = (dashboard: Dashboard, id: string): string[] =>
  ancestors(dashboard.items, id).map((container) => container.id);

const CLIPBOARD_KEY = "opendisplay_studio.clipboard";
const ZOOM_STEP = 1.25;
const MENU_WIDTH = 228;
const MENU_ROW = 36;
const MENU_SEPARATOR = 9;
const MENU_MARGIN = 8;

/** A menu opened by a right click, where it is on the panel and what it offers. */
interface OpenMenu {
  x: number;
  y: number;
  label: string;
  entries: MenuEntry[];
  /** The element the menu is about, if it was opened on one. */
  itemId?: string;
  /** The display pixel under the pointer, for Paste Here. */
  point?: { x: number; y: number };
}

const readClipboard = (): ClipboardData | undefined => {
  try {
    const text = window.localStorage.getItem(CLIPBOARD_KEY);
    const parsed: unknown = text ? JSON.parse(text) : undefined;
    return isClipboard(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const isClipboard = (value: unknown): value is ClipboardData =>
  typeof value === "object" &&
  value !== null &&
  "items" in value &&
  Array.isArray(value.items);

const writeClipboard = (data: ClipboardData): void => {
  try {
    window.localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(data));
  } catch {
    // The clipboard still works in memory when storage is not available.
  }
};

/** The move a nudge makes: `step` pixels in a direction. */
const nudgeVector = (
  direction: "left" | "right" | "up" | "down",
  step: number
): { dx: number; dy: number } => {
  if (direction === "left") return { dx: -step, dy: 0 };
  if (direction === "right") return { dx: step, dy: 0 };
  if (direction === "up") return { dx: 0, dy: -step };
  return { dx: 0, dy: step };
};

const PREVIEW_DELAY_MS = 220;
const NOTICE_MS = 5000;
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
      .menu-scrim {
        position: absolute;
        inset: 0;
        z-index: 40;
      }
      .menu-layer {
        position: absolute;
        z-index: 41;
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
  @state() private widgetErrors: WidgetLoadError[] = [];
  @state() private notice = "";
  @state() private sending = false;
  private noticeTimer?: number;
  @state() private primitives: PrimitiveDefinition[] = [];
  @state() private current?: Dashboard;
  /** The selected items, in the order they were selected; the last one is the main one. */
  @state() private selection: string[] = [];
  /** The group whose children can be selected one by one, if one was entered. */
  @state() private enteredGroupId = "";
  @state() private menu?: OpenMenu;
  @state() private shortcutsOpen = false;
  /** The element whose name the tree should start editing. */
  @state() private renameRequestId = "";
  /** What Copy and Cut took; it also survives in local storage for other dashboards. */
  private clipboard = readClipboard();
  @state() private preview?: ComposePreviewResponse;
  @state() private loading = true;
  @state() private saving = false;
  @state() private dirty = false;
  @state() private error = "";
  @state() private draggingCatalog = false;
  @state() private undoCount = 0;
  @state() private redoCount = 0;
  @state() private pendingDeleteIds: string[] = [];
  @state() private leftCollapsed = false;
  @state() private rightCollapsed = false;
  @state() private inspectorWidth = 350;
  @state() private snapEnabled = true;
  @state() private viewport: Viewport = DEFAULT_VIEWPORT;
  @state() private newDashboardOpen = false;
  @state() private newDashboard = freshDashboard("en");
  @state() private newDashboardSource: DashboardSource = "custom";
  @state() private newDashboardDeviceId = "";
  @state() private displayDevices: DisplayDevice[] = [];
  @state() private dashboardDialog?: DashboardDialog;
  @state() private dashboardDraft?: Dashboard;

  @query("ods-canvas") private canvas?: OdsCanvas;

  private previewTimer?: number;
  private stateTimer?: number;
  private clockTimer?: number;
  private previewRequest = 0;
  private bootstrapStarted = false;
  private readonly history = new History<Dashboard>();

  private get selectedItemId(): string {
    return this.selection.at(-1) ?? "";
  }

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
  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("hass") && this.hass) applyLanguage(this.hass.language);
  }
  protected updated(changed: PropertyValues<this>): void {
    if (changed.has("hass")) {
      this.ensureBootstrap();
      this.refreshOnStateChange(changed.get("hass"));
    }
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.previewTimer) window.clearTimeout(this.previewTimer);
    if (this.stateTimer) window.clearTimeout(this.stateTimer);
    if (this.clockTimer) window.clearTimeout(this.clockTimer);
    if (this.noticeTimer) window.clearTimeout(this.noticeTimer);
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
      this.widgetErrors = data.widgetErrors;
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

  /** The devices come first, so the dialog opens on the source that fits what there is. */
  private async openNewDashboard(): Promise<void> {
    this.displayDevices = await this.loadDisplayDevices();
    this.newDashboard = freshDashboard(this.language);
    this.newDashboardDeviceId = "";
    this.newDashboardOpen = true;
    this.chooseNewDashboardSource(
      this.displayDevices.length ? "device" : "preset"
    );
  }

  private async loadDisplayDevices(): Promise<DisplayDevice[]> {
    if (!this.hass) return [];
    try {
      return await api.listDevices(this.hass);
    } catch {
      // Without the OpenDisplay integration the dialog offers the other sources.
      return [];
    }
  }

  /** Switching source gives the dashboard the display that source starts with. */
  private chooseNewDashboardSource(source: DashboardSource): void {
    this.newDashboardSource = source;
    if (source === "device") {
      this.useDevice(this.newDashboardDeviceId || this.displayDevices[0]?.id);
    }
    if (source === "preset") {
      this.useProfile(this.newDashboard.display.profileId ?? "");
    }
  }

  private useDevice(deviceId?: string): void {
    const device = this.displayDevices.find((entry) => entry.id === deviceId);
    if (!device) return;
    this.newDashboardDeviceId = device.id;
    this.newDashboard = dashboardFromDevice(this.newDashboard, device);
  }

  private useProfile(profileId: string): void {
    const profile =
      PRESET_PROFILES.find((entry) => entry.id === profileId) ??
      PRESET_PROFILES[0];
    this.newDashboard = dashboardFromProfile(this.newDashboard, profile);
  }
  private async createDashboard(): Promise<void> {
    if (!this.hass) return;
    this.saving = true;
    this.error = "";
    try {
      const created = await api.createDashboard(this.hass, this.newDashboard);
      this.dashboards = [...this.dashboards, created];
      this.current = structuredClone(created);
      this.clearSelection();
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
  /** Tries the design as it is, saved or not, on the device the dashboard is made for. */
  private async sendToDevice(): Promise<void> {
    if (!this.hass || !this.current) return;
    this.sending = true;
    this.error = "";
    try {
      await api.sendToDevice(this.hass, this.current);
      this.showNotice(strings.app.sentToDevice);
    } catch (error) {
      this.error = messageFrom(error, strings.app.sendFailed);
    } finally {
      this.sending = false;
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
      this.clearSelection();
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
    this.clearSelection();
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
        this.clearSelection();
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
    this.keepExistingSelection(snapshot);
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
    requestDelete: (itemIds) => {
      this.pendingDeleteIds = itemIds;
    },
    toggleFlag: (itemIds, flag) =>
      this.mutate((next) => {
        for (const itemId of itemIds) toggleItemState(next, itemId, flag);
      }),
    group: (itemIds) => this.groupSelection(itemIds),
    ungroup: (itemId) => this.ungroup(itemId),
    enterGroup: (itemId) => this.enterGroup(itemId),
    exitGroup: () => this.exitGroup(),
    deselect: () => this.clearSelection(),
    copy: (itemIds) => this.copy(itemIds),
    cut: (itemIds) => this.cut(itemIds),
    paste: () => this.paste(),
    pasteHere: () => this.pasteHere(),
    duplicate: (itemIds) => this.duplicate(itemIds),
    arrange: (itemIds, how) => this.arrange(itemIds, how),
    rename: (itemId) => {
      this.renameRequestId = itemId;
    },
    save: () => void this.saveDashboard(),
    toggleCode: () =>
      this.setEditorView(this.view === "code" ? "design" : "code"),
    zoom: (how) => this.zoom(how),
    nudge: (itemIds, direction, snapped) =>
      this.nudge(itemIds, direction, snapped),
    showShortcuts: () => {
      this.shortcutsOpen = true;
    },
  };

  private commandContext(
    item?: StudioItem,
    targets?: StudioItem[]
  ): CommandContext {
    const dashboard = this.current;
    const chosen = targets ?? (item ? [item] : this.selectedItems);
    const ids = chosen.map((target) => target.id);
    const primary = item ?? chosen.at(-1);
    return {
      canUndo: this.undoCount > 0,
      canRedo: this.redoCount > 0,
      item: primary,
      targets: chosen,
      canGroup: dashboard ? canGroup(dashboard, ids) : false,
      canUngroup:
        dashboard && primary ? canUngroup(dashboard, primary.id) : false,
      canEnter: primary ? isGroup(primary) : false,
      entered: this.enteredGroupId !== "",
      canPaste: (this.clipboard?.items.length ?? 0) > 0,
      dirty: this.dirty,
    };
  }

  private get selectedItems(): StudioItem[] {
    const items = this.current?.items ?? [];
    return this.selection.flatMap((id) => findItem(items, id) ?? []);
  }

  private get selectedItem(): StudioItem | undefined {
    return this.selectedItems.at(-1);
  }

  private runCommand(id: CommandId, item?: StudioItem): void {
    const command = commandById(id);
    const context = this.commandContext(item);
    if (command.isEnabled(context)) {
      command.run(context, this.commandActions);
    }
  }

  private onCommand(event: OdsEvent<"command">): void {
    const { id, itemId } = event.detail;
    const item = itemId
      ? findItem(this.current?.items ?? [], itemId)
      : undefined;
    this.runCommand(id, item);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.defaultPrevented) return;
    if (this.menu && event.key === "Escape") {
      event.preventDefault();
      this.closeMenu();
      return;
    }
    if (this.shortcutsOpen && event.key === "Escape") {
      this.shortcutsOpen = false;
      return;
    }
    if (isTypingTarget(event) || this.view === "dashboards") return;
    const command = commandForKey(event, this.commandContext());
    if (!command || (this.view === "code" && !command.anywhere)) return;
    event.preventDefault();
    this.runCommand(command.id);
  };

  // --- clipboard, order, nudging, zoom ------------------------------------------

  private copy(itemIds: string[]): void {
    const dashboard = this.current;
    if (!dashboard) return;
    this.clipboard = copyItems(dashboard, itemIds);
    writeClipboard(this.clipboard);
  }

  /** Cut is a copy and a delete, and one undo step. */
  private cut(itemIds: string[]): void {
    this.copy(itemIds);
    this.mutate((next) => {
      for (const itemId of itemIds) removeItem(next, itemId);
    });
    this.setSelection(this.selection.filter((id) => !itemIds.includes(id)));
  }

  private paste(): void {
    this.pasteWith(() => ({ delta: { x: COPY_OFFSET, y: COPY_OFFSET } }));
  }

  /** Paste Here puts the copies at the pointer, in the container under it. */
  private pasteHere(): void {
    const point = this.menu?.point;
    const dashboard = this.current;
    if (!point || !dashboard) return;
    const container = containerAt(
      dashboard.items,
      point.x,
      point.y,
      [],
      this.enteredGroupId || undefined
    );
    this.pasteWith(
      () => ({ anchor: point }),
      container ? { parentId: container.id } : {}
    );
  }

  private pasteWith(
    placement: () =>
      | { delta: { x: number; y: number } }
      | { anchor: { x: number; y: number } },
    forcedTarget?: { parentId?: string }
  ): void {
    const dashboard = this.current;
    const data = this.clipboard ?? readClipboard();
    if (!dashboard || !data) return;
    let created: string[] = [];
    this.mutate((next) => {
      const target = forcedTarget ?? pasteTarget(next, this.selection);
      created = pasteItems(next, data, target, placement());
    });
    if (created.length > 0) this.setSelection(created);
  }

  private duplicate(itemIds: string[]): void {
    let created: string[] = [];
    this.mutate((next) => {
      created = duplicateItems(next, itemIds);
    });
    if (created.length > 0) this.setSelection(created);
  }

  private arrange(
    itemIds: string[],
    how: "front" | "back" | "up" | "down"
  ): void {
    this.mutate((next) => {
      if (how === "front") bringToFront(next, itemIds);
      if (how === "back") sendToBack(next, itemIds);
      if (how === "up" || how === "down") stepItems(next, itemIds, how);
    });
  }

  private nudge(
    itemIds: string[],
    direction: "left" | "right" | "up" | "down",
    snapped: boolean
  ): void {
    const dashboard = this.current;
    if (!dashboard) return;
    const step = snapped ? dashboard.display.snapSize : 1;
    const { dx, dy } = nudgeVector(direction, step);
    this.mutate((next) => {
      nudgeItems(
        next,
        itemIds,
        dx,
        dy,
        workingArea(next),
        (item) => itemLocks(item, this.primitives).position.length === 0
      );
    });
  }

  private zoom(how: "in" | "out" | "reset"): void {
    if (how === "reset") {
      this.canvas?.resetView();
      return;
    }
    const factor = how === "in" ? ZOOM_STEP : 1 / ZOOM_STEP;
    this.viewport = withZoom(this.viewport, this.viewport.zoom * factor);
  }

  // --- context menus -------------------------------------------------------------

  private closeMenu(): void {
    this.menu = undefined;
  }

  private menuLayout(source: "canvas" | "tree" | "empty"): MenuLayout {
    if (source === "empty") return EMPTY_CANVAS_MENU;
    return source === "tree" ? TREE_MENU : CANVAS_MENU;
  }

  private onContextMenu(event: OdsEvent<"context-menu">): void {
    const { source, itemId, clientX, clientY, point } = event.detail;
    const dashboard = this.current;
    if (!dashboard) return;
    if (itemId && !this.selection.includes(itemId)) this.selectItem(itemId);
    if (!itemId && source === "empty") this.clearSelection();
    const item = itemId ? findItem(dashboard.items, itemId) : undefined;
    const targets = item ? this.targetsForMenu(item) : [];
    const context = this.commandContext(item, targets);
    const entries = menuEntries(
      this.menuLayout(source),
      context,
      isMacPlatform()
    );
    if (entries.length === 0) return;
    this.menu = {
      ...this.menuPosition(clientX, clientY, entries),
      label: item?.name ?? strings.canvas.menuLabel,
      entries,
      itemId,
      point,
    };
  }

  /** A menu opened on a selected element acts on the whole selection. */
  private targetsForMenu(item: StudioItem): StudioItem[] {
    return this.selection.includes(item.id) ? this.selectedItems : [item];
  }

  /** Puts a menu at the pointer, moved back inside the panel when it would overflow. */
  private menuPosition(
    clientX: number,
    clientY: number,
    entries: MenuEntry[]
  ): { x: number; y: number } {
    const host = this.getBoundingClientRect();
    const height =
      entries.length * MENU_ROW +
      entries.filter((entry) => entry.separatorBefore).length * MENU_SEPARATOR +
      MENU_MARGIN * 2;
    const x = clientX - host.left;
    const y = clientY - host.top;
    return {
      x:
        x + MENU_WIDTH + MENU_MARGIN > host.width
          ? Math.max(MENU_MARGIN, x - MENU_WIDTH)
          : x,
      y:
        y + height + MENU_MARGIN > host.height
          ? Math.max(MENU_MARGIN, host.height - height - MENU_MARGIN)
          : y,
    };
  }

  private onMenuSelect(event: OdsEvent<"menu-select">): void {
    const menu = this.menu;
    this.closeMenu();
    if (!menu || !this.current) return;
    const item = menu.itemId
      ? findItem(this.current.items, menu.itemId)
      : undefined;
    if (!isCommandId(event.detail.id)) return;
    const command = commandById(event.detail.id);
    const context = this.commandContext(
      item,
      item ? this.targetsForMenu(item) : []
    );
    if (!command.isEnabled(context)) return;
    // Paste Here reads the pointer position the menu was opened at.
    this.menu = menu;
    command.run(context, this.commandActions);
    this.menu = undefined;
  }

  private renderMenu(): TemplateResult | typeof nothing {
    const menu = this.menu;
    if (!menu) return nothing;
    return html`
      <div
        class="menu-scrim"
        @pointerdown=${this.closeMenu}
        @contextmenu=${this.dismissMenu}
      ></div>
      <div
        class="menu-layer"
        style=${styleMap({ left: `${menu.x}px`, top: `${menu.y}px` })}
      >
        <ods-context-menu
          .entries=${menu.entries}
          .label=${menu.label}
          @menu-select=${this.onMenuSelect}
        ></ods-context-menu>
      </div>
    `;
  }

  private dismissMenu(event: Event): void {
    event.preventDefault();
    this.closeMenu();
  }

  private renderShortcutsDialog(): TemplateResult | typeof nothing {
    if (!this.shortcutsOpen) return nothing;
    return html`
      <ods-shortcuts-dialog
        @shortcuts-close=${() => {
          this.shortcutsOpen = false;
        }}
      ></ods-shortcuts-dialog>
    `;
  }

  private schedulePreview(): void {
    if (this.previewTimer) window.clearTimeout(this.previewTimer);
    this.previewTimer = window.setTimeout(
      () => void this.composePreview(),
      PREVIEW_DELAY_MS
    );
  }

  /** Compose again, a moment later, when a state the expressions read has changed. */
  private refreshOnStateChange(previous: HomeAssistant | undefined): void {
    const dependencies = this.preview?.dependencies;
    if (
      !dependencies ||
      !dependenciesChanged(dependencies, previous?.states, this.hass?.states)
    ) {
      return;
    }
    if (this.stateTimer) window.clearTimeout(this.stateTimer);
    this.stateTimer = window.setTimeout(
      () => void this.composePreview(),
      STATE_REFRESH_DELAY_MS
    );
  }

  /** A preview that reads the clock is composed again every minute. */
  private scheduleClockRefresh(): void {
    if (this.clockTimer) window.clearTimeout(this.clockTimer);
    if (!this.preview?.dependencies.usesTime) return;
    this.clockTimer = window.setTimeout(
      () => void this.composePreview(),
      CLOCK_REFRESH_MS
    );
  }

  private async composePreview(): Promise<void> {
    if (!this.hass || !this.current) return;
    this.error = "";
    const request = ++this.previewRequest;
    try {
      const result = await api.composePreview(this.hass, this.current);
      if (request === this.previewRequest) {
        this.preview = result;
        this.scheduleClockRefresh();
      }
    } catch (error) {
      this.error = messageFrom(error, strings.app.previewFailed);
    }
  }
  private setEditorView(view: "design" | "code"): void {
    this.view = view;
    if (view === "code" && !this.preview) void this.composePreview();
  }
  private selectItem(itemId: string): void {
    this.setSelection(itemId ? [itemId] : []);
  }
  private clearSelection(): void {
    this.setSelection([]);
  }
  private setSelection(ids: string[]): void {
    const same =
      ids.length === this.selection.length &&
      ids.every((id, index) => id === this.selection[index]);
    if (!same) this.selection = ids;
    const main = ids.at(-1);
    const dashboard = this.current;
    if (this.enteredGroupId && main && dashboard) {
      const stillInside =
        locate(dashboard.items, main) && this.isInsideEntered(dashboard, main);
      if (!stillInside) this.enteredGroupId = "";
    }
  }
  private keepExistingSelection(dashboard: Dashboard): void {
    const kept = this.selection.filter((id) => findItem(dashboard.items, id));
    if (kept.length !== this.selection.length) this.selection = kept;
    if (
      this.enteredGroupId &&
      !findItem(dashboard.items, this.enteredGroupId)
    ) {
      this.enteredGroupId = "";
    }
  }
  /** Whether an item is the entered group or lies in it (or is that group's ancestor). */
  private isInsideEntered(dashboard: Dashboard, id: string): boolean {
    const entered = this.enteredGroupId;
    if (!entered) return true;
    const chain = [id, ...ancestorIds(dashboard, id)];
    return (
      chain.includes(entered) || ancestorIds(dashboard, entered).includes(id)
    );
  }
  private showWholeCanvas(): void {
    this.canvas?.resetView();
    requestAnimationFrame(() => this.canvas?.fitView());
  }

  // --- adding elements -------------------------------------------------------

  private createFromCatalog(
    value: string,
    x: number,
    y: number,
    dashboard: Dashboard
  ): StudioItem | undefined {
    const [kind, type] = value.split(":");
    if (!type) return undefined;
    if (kind === "container") return createContainerItem(dashboard, x, y);
    if (kind === "widget") {
      const definition = this.widgets.find((widget) => widget.id === type);
      return definition
        ? createWidgetItem(definition, x, y, dashboard)
        : undefined;
    }
    const item = createPrimitiveItem(this.primitives, type, x, y, dashboard);
    if (!item) this.error = strings.app.unsupportedPrimitive(type);
    return item;
  }

  /** Adds a catalog item centred on a display point, inside `parentId` when given. */
  private addAt(value: string, x: number, y: number, parentId?: string): void {
    const dashboard = this.current;
    if (!dashboard) return;
    const added = this.createFromCatalog(value, x, y, dashboard);
    if (!added) return;
    this.mutate((next) => insertOnDisplay(next, added, parentId));
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
    const x = clamp(
      snapToGrid(point.x, dashboard, this.snapEnabled),
      area.x,
      area.x + area.width - 1
    );
    const y = clamp(
      snapToGrid(point.y, dashboard, this.snapEnabled),
      area.y,
      area.y + area.height - 1
    );
    const target = containerAt(
      dashboard.items,
      x,
      y,
      [],
      this.enteredGroupId || undefined
    );
    this.addAt(value, x, y, target?.id);
  }

  // --- groups ----------------------------------------------------------------

  private groupSelection(itemIds: string[]): void {
    let groupId: string | undefined;
    this.mutate((next) => {
      groupId = groupItems(
        next,
        itemIds,
        (item) => this.preview?.itemBounds[item.id]
      );
    });
    if (groupId) this.selectItem(groupId);
  }

  private ungroup(itemId: string): void {
    let freed: string[] = [];
    this.mutate((next) => {
      freed = ungroupItem(next, itemId);
    });
    if (this.enteredGroupId === itemId) this.enteredGroupId = "";
    this.setSelection(freed);
  }

  private enterGroup(itemId: string): void {
    this.enteredGroupId = itemId;
    this.setSelection([itemId]);
  }

  private exitGroup(): void {
    const groupId = this.enteredGroupId;
    this.enteredGroupId = "";
    if (groupId) this.selectItem(groupId);
  }

  private confirmDeleteItem(): void {
    const itemIds = this.pendingDeleteIds;
    if (itemIds.length === 0) return;
    this.pendingDeleteIds = [];
    this.mutate((next) => {
      for (const itemId of itemIds) removeItem(next, itemId);
    });
    this.setSelection(this.selection.filter((id) => !itemIds.includes(id)));
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

  private onNewDashboardSource(event: OdsEvent<"new-dashboard-source">): void {
    this.chooseNewDashboardSource(event.detail.source);
  }

  private onNewDashboardDevice(event: OdsEvent<"new-dashboard-device">): void {
    this.useDevice(event.detail.deviceId);
  }

  private onNewDashboardProfile(
    event: OdsEvent<"new-dashboard-profile">
  ): void {
    this.useProfile(event.detail.profileId);
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
    const { itemId, additive } = event.detail;
    if (!additive || !itemId) {
      this.selectItem(itemId);
      return;
    }
    const without = this.selection.filter((id) => id !== itemId);
    const toggledOff = without.length !== this.selection.length;
    this.setSelection(toggledOff ? without : [...this.selection, itemId]);
  }

  private onSelectionChange(event: OdsEvent<"selection-change">): void {
    this.setSelection(event.detail.itemIds);
  }

  private onGroupEnter(event: OdsEvent<"group-enter">): void {
    this.enterGroup(event.detail.groupId);
  }

  private onItemRename(event: OdsEvent<"item-rename">): void {
    const { itemId, name } = event.detail;
    this.mutate((next) => renameItem(next, itemId, name));
  }

  private cancelDeleteItem(): void {
    this.pendingDeleteIds = [];
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

  /** A live move or resize: replaces the items without a history step or preview. */
  private onItemsTransform(event: OdsEvent<"items-transform">): void {
    const { items } = event.detail;
    this.mutate(
      (next) => {
        for (const item of items) replaceItem(next, item);
      },
      false,
      false
    );
  }

  private onItemTransformEnd(event: OdsEvent<"item-transform-end">): void {
    const { before, drop } = event.detail;
    if (drop) this.dropOnContainer(drop.itemId, drop.x, drop.y);
    this.recordHistory(before);
    this.schedulePreview();
  }

  /** An element dropped after a drag goes into the container under the pointer. */
  private dropOnContainer(itemId: string, x: number, y: number): void {
    const dashboard = this.current;
    if (!dashboard) return;
    const target = containerAt(
      dashboard.items,
      x,
      y,
      [itemId],
      this.enteredGroupId || undefined
    );
    if (target?.id === locate(dashboard.items, itemId)?.parent?.id) return;
    this.mutate(
      (next) => reparentByDrop(next, itemId, target?.id),
      false,
      false
    );
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

  private onExpressionChange(event: OdsEvent<"expression-change">): void {
    const { key, template } = event.detail;
    this.mutate((next) =>
      setItemExpression(next, this.selectedItemId, key, template)
    );
  }

  private onDisplayNumberChange(
    event: OdsEvent<"display-number-change">
  ): void {
    const { key, value } = event.detail;
    this.mutate((next) => setDisplayNumber(next, key, value));
  }

  private onRotationChange(event: OdsEvent<"rotation-change">): void {
    this.mutate((next) => setRotation(next, event.detail.rotation));
    requestAnimationFrame(() => this.canvas?.fitView());
  }

  private onPaletteChange(event: OdsEvent<"palette-change">): void {
    this.mutate((next) => setPalette(next, event.detail.palette));
  }

  private onBackgroundChange(event: OdsEvent<"background-change">): void {
    this.mutate((next) => setBackground(next, event.detail.color));
  }

  private onWidgetOptionsChange(
    event: OdsEvent<"widget-options-change">
  ): void {
    const item = this.selectedItem;
    if (item?.kind !== "widget") return;
    const definition = this.widgets.find(
      (widget) => widget.id === item.widget.type
    );
    if (!definition) return;
    const options = optionsFromForm(event.detail.value, definition);
    this.mutate((next) => setWidgetOptions(next, item.id, options));
  }

  private onWidgetPicksChange(event: OdsEvent<"widget-picks-change">): void {
    const { sourceKey, picks } = event.detail;
    this.mutate((next) =>
      setWidgetPicks(next, this.selectedItemId, sourceKey, picks)
    );
  }

  private async reloadWidgets(): Promise<void> {
    if (!this.hass) return;
    try {
      const result = await api.reloadWidgets(this.hass);
      this.widgets = result.widgets;
      this.widgetErrors = result.widgetErrors;
      this.showNotice(
        strings.library.widgetsReloaded(
          result.widgets.length,
          result.widgetErrors.length
        )
      );
      void this.composePreview();
    } catch (error) {
      this.error = messageFrom(error, strings.library.reloadFailed);
    }
  }

  private showNotice(message: string): void {
    this.notice = message;
    if (this.noticeTimer) window.clearTimeout(this.noticeTimer);
    this.noticeTimer = window.setTimeout(() => {
      this.notice = "";
    }, NOTICE_MS);
  }

  private onContainerBackgroundChange(
    event: OdsEvent<"container-background-change">
  ): void {
    const background = backgroundFromForm(event.detail.value);
    this.mutate((next) =>
      setContainerBackground(next, this.selectedItemId, background)
    );
  }

  private onPrimitiveChange(event: OdsEvent<"primitive-change">): void {
    const { value } = event.detail;
    this.mutate((next) =>
      updatePrimitiveFields(next, this.selectedItemId, value, this.primitives)
    );
  }

  // --- templates -------------------------------------------------------------

  private renderDeleteDialog(): TemplateResult | typeof nothing {
    const items = this.pendingDeleteIds.flatMap(
      (id) => findItem(this.current?.items ?? [], id) ?? []
    );
    const [first] = items;
    if (!first) {
      return nothing;
    }
    const holdsItems = items.some(
      (item) => isContainer(item) && item.children.length > 0
    );
    const heading =
      items.length === 1
        ? strings.app.deleteElementTitle(first.name)
        : strings.app.deleteElementsTitle(items.length);
    return html`
      <ods-confirm-dialog
        eyebrow=${strings.app.confirmRemoval}
        heading=${heading}
        body=${
          holdsItems
            ? strings.app.deleteContainerBody
            : strings.app.deleteElementBody
        }
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
        .devices=${this.displayDevices}
        .source=${this.newDashboardSource}
        .deviceId=${this.newDashboardDeviceId}
        .saving=${this.saving}
        @new-dashboard-change=${this.onNewDashboardChange}
        @new-dashboard-source=${this.onNewDashboardSource}
        @new-dashboard-device=${this.onNewDashboardDevice}
        @new-dashboard-profile=${this.onNewDashboardProfile}
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
        @selection-change=${this.onSelectionChange}
        @group-enter=${this.onGroupEnter}
        @item-rename=${this.onItemRename}
        @context-menu=${this.onContextMenu}
        @rename-handled=${() => {
          this.renameRequestId = "";
        }}
        @command=${this.onCommand}
      >
        <ods-library
          .widgets=${this.widgets}
          .widgetErrors=${this.widgetErrors}
          .primitives=${this.primitives}
          .collapsed=${this.leftCollapsed}
          @widgets-reload=${this.reloadWidgets}
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
          .selectedItemIds=${this.selection}
          .enteredGroupId=${this.enteredGroupId}
          .snapEnabled=${this.snapEnabled}
          .acceptingDrop=${this.draggingCatalog}
          .canUndo=${this.undoCount > 0}
          .canRedo=${this.redoCount > 0}
          .viewport=${this.viewport}
          @viewport-change=${this.onViewportChange}
          @items-transform=${this.onItemsTransform}
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
          .selectedItemIds=${this.selection}
          .enteredGroupId=${this.enteredGroupId}
          .renameRequestId=${this.renameRequestId}
          .collapsed=${this.rightCollapsed}
          .width=${this.inspectorWidth}
          @inspector-collapse=${this.onInspectorCollapse}
          @inspector-resize=${this.onInspectorResize}
          @layers-reorder=${this.onLayersReorder}
          @item-number-change=${this.onItemNumberChange}
          @display-number-change=${this.onDisplayNumberChange}
          @rotation-change=${this.onRotationChange}
          @palette-change=${this.onPaletteChange}
          @background-change=${this.onBackgroundChange}
          @widget-options-change=${this.onWidgetOptionsChange}
          @widget-picks-change=${this.onWidgetPicksChange}
          @widgets-reload=${this.reloadWidgets}
          @primitive-change=${this.onPrimitiveChange}
          @container-background-change=${this.onContainerBackgroundChange}
          @expression-change=${this.onExpressionChange}
          @dashboard-delete-request=${this.deleteDashboard}
        ></ods-inspector>
      </div>
      ${this.renderDeleteDialog()} ${this.renderMenu()}
      ${this.renderShortcutsDialog()}
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

  private renderNotice(): TemplateResult | typeof nothing {
    if (!this.notice) {
      return nothing;
    }
    return html`
      <ha-alert alert-type="success" class="notice">${this.notice}</ha-alert>
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
          .sending=${this.sending}
          @show-dashboards=${this.showGallery}
          @dashboard-name-change=${this.onNameChange}
          @view-change=${this.onViewChange}
          @toggle-ready=${this.toggleReady}
          @dashboard-save=${this.saveDashboard}
          @send-to-device=${this.sendToDevice}
          @help-open=${() => {
            this.shortcutsOpen = true;
          }}
        ></ods-header>
        ${this.renderError()} ${this.renderNotice()}
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
