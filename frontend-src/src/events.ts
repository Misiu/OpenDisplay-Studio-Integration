import type { CommandId } from "./commands";
import type { DashboardFormData, DashboardSource } from "./dashboards";
import type {
  Dashboard,
  PaletteId,
  Rotation,
  StudioItem,
  WidgetPick,
} from "./types";
import type { Viewport } from "./viewport";

export type EditorView = "dashboards" | "design" | "code";
export type DashboardAction = "rename" | "duplicate" | "settings" | "delete";
export type DashboardDialog = Exclude<DashboardAction, "duplicate">;

/**
 * Every intent an element reports to its owner. Children never change the dashboard;
 * they fire one of these and `ods-app` decides. `undefined` means the event has no detail.
 */
export interface OdsEventMap {
  // gallery and dialogs
  "dashboard-new": undefined;
  "dashboard-open": { dashboard: Dashboard };
  "dashboard-menu-toggle": { dashboardId: string };
  "dashboard-menu-action": { dashboard: Dashboard; action: DashboardAction };
  "dashboard-rename-input": { name: string };
  "dashboard-rename-commit": undefined;
  "dashboard-rename-cancel": undefined;
  "dashboard-settings-change": { value: Partial<DashboardFormData> };
  "dashboard-settings-save": undefined;
  "dashboard-delete-confirm": undefined;
  "dashboard-dialog-close": undefined;
  "new-dashboard-change": { value: Partial<DashboardFormData> };
  "new-dashboard-close": undefined;
  "new-dashboard-source": { source: DashboardSource };
  "new-dashboard-device": { deviceId: string };
  "new-dashboard-profile": { profileId: string };
  "dashboard-create": undefined;
  // header
  "show-dashboards": undefined;
  "dashboard-name-change": { name: string };
  "view-change": { view: "design" | "code" };
  "toggle-ready": undefined;
  "dashboard-save": undefined;
  "send-to-device": undefined;
  "rotation-change": { rotation: Rotation };
  // library
  "library-collapse": { collapsed: boolean };
  "catalog-add": { value: string };
  "catalog-drag": { active: boolean };
  "catalog-drop": { value: string; clientX: number; clientY: number };
  // canvas
  /** `additive` (Shift) adds the item to the selection, or takes it out again. */
  "item-select": { itemId: string; additive?: boolean };
  /** A marquee or another gesture chose exactly these items. */
  "selection-change": { itemIds: string[] };
  "group-enter": { groupId: string };
  "items-transform": { items: StudioItem[] };
  /** `drop` is set when one element was moved: where the pointer ended, on the display. */
  "item-transform-end": {
    before: Dashboard;
    drop?: { itemId: string; x: number; y: number };
  };
  "item-rename": { itemId: string; name: string };
  /** A right click: on an element of the canvas, on a row of the tree, or on empty canvas. */
  "context-menu": {
    source: "canvas" | "tree" | "empty";
    itemId?: string;
    clientX: number;
    clientY: number;
    /** The display pixel under the pointer, for a menu on the canvas. */
    point?: { x: number; y: number };
  };
  "rename-handled": undefined;
  "help-open": undefined;
  "shortcuts-close": undefined;
  "snap-toggle": undefined;
  /** Run a registered command; `itemId` when it is about a particular item. */
  command: { id: CommandId; itemId?: string };
  "viewport-change": Viewport;
  "zoom-change": { zoom: number };
  "zoom-reset": undefined;
  "zoom-fit": undefined;
  // structure and inspector
  "layers-reorder": {
    itemId: string;
    targetId: string;
    edge: "before" | "after" | "inside";
  };
  "inspector-collapse": { collapsed: boolean };
  "inspector-resize": { width: number };
  "item-number-change": { key: string; value: number };
  "display-number-change": {
    key: "width" | "height" | "padding" | "snapSize";
    value: number;
  };
  "palette-change": { palette: PaletteId };
  "background-change": { color: string };
  "widget-options-change": { value: Record<string, unknown> };
  "widget-picks-change": { sourceKey: string; picks: WidgetPick[] };
  "widgets-reload": undefined;
  "primitive-change": { value: Record<string, unknown> };
  "container-background-change": { value: Record<string, unknown> };
  /** `template` is the new expression, `null` for back to the literal, `undefined` to start one. */
  "expression-change": { key: string; template: string | null | undefined };
  "dashboard-delete-request": undefined;
  // confirm dialog
  "confirm-accept": undefined;
  "confirm-cancel": undefined;
  // small controls
  "field-change": { key: string; value: string };
  "menu-select": { id: string };
}

export type OdsEvent<K extends keyof OdsEventMap> = CustomEvent<OdsEventMap[K]>;

type EmitArguments<K extends keyof OdsEventMap> =
  OdsEventMap[K] extends undefined ? [] : [detail: OdsEventMap[K]];

/** Fire a typed, bubbling, composed event from `host`. */
export const emit = <K extends keyof OdsEventMap>(
  host: HTMLElement,
  name: K,
  ...detail: EmitArguments<K>
): void => {
  host.dispatchEvent(
    new CustomEvent(name, { detail: detail[0], bubbles: true, composed: true })
  );
};
