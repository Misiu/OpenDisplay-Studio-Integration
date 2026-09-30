import type { DashboardFormData } from "./dashboards";
import type { Dashboard, PaletteId, StudioItem } from "./types";
import type { Viewport } from "./viewport";

export type EditorView = "dashboards" | "design" | "code";
export type DashboardAction = "rename" | "duplicate" | "settings" | "delete";
export type DashboardDialog = Exclude<DashboardAction, "duplicate">;
export type ItemFlag = "locked" | "hidden";

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
  "dashboard-create": undefined;
  // header
  "show-dashboards": undefined;
  "dashboard-name-change": { name: string };
  "view-change": { view: "design" | "code" };
  "toggle-ready": undefined;
  "dashboard-save": undefined;
  // library
  "library-collapse": { collapsed: boolean };
  "catalog-add": { value: string };
  "catalog-drag": { active: boolean };
  "catalog-drop": { value: string; clientX: number; clientY: number };
  // canvas
  "item-select": { itemId: string };
  "item-transform": { item: StudioItem };
  "item-transform-end": { before: Dashboard };
  "snap-toggle": undefined;
  "viewport-change": Viewport;
  undo: undefined;
  redo: undefined;
  "zoom-change": { zoom: number };
  "zoom-reset": undefined;
  "zoom-fit": undefined;
  // structure and inspector
  "item-flag-toggle": { itemId: string; flag: ItemFlag };
  "item-delete-request": { itemId: string };
  "layers-reorder": {
    itemId: string;
    targetId: string;
    edge: "before" | "after";
  };
  "inspector-collapse": { collapsed: boolean };
  "inspector-resize": { width: number };
  "item-number-change": { key: string; value: number };
  "display-number-change": {
    key: "width" | "height" | "padding" | "snapSize";
    value: number;
  };
  "profile-change": { profileId: string };
  "palette-change": { palette: PaletteId };
  "background-change": { color: string };
  "widget-config-change": { value: Record<string, unknown> };
  "primitive-change": { value: Record<string, unknown> };
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
