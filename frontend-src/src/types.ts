export type PaletteId = "bw" | "bwr" | "bwy" | "bwry" | "spectra6";
export type DashboardStatus = "draft" | "ready";

export type WidgetValue = string | number | boolean | string[];
export type WidgetOptions = Record<string, WidgetValue>;

/** One thing the user picked for a source (an entity, a calendar), with its per-source fields. */
export interface WidgetPick {
  id: string;
  [field: string]: string | number | boolean;
}
export type WidgetSources = Record<string, WidgetPick[]>;

export interface ItemFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}
/** Templates beside an item's literal fields, keyed by field (or `visible`). */
export type ItemExpressions = Record<string, string>;

export interface ItemState {
  id: string;
  /** What the structure tree and dialogs call the item; unique in a dashboard. */
  name: string;
  locked: boolean;
  hidden: boolean;
  expressions?: ItemExpressions;
}

export interface WidgetItem extends ItemState {
  kind: "widget";
  widget: {
    type: string;
    version: string;
    sources: WidgetSources;
    options: WidgetOptions;
  };
  frame: ItemFrame;
  layout: { padding: number };
}

export interface TextPrimitive {
  type: "text";
  value: string;
  x: number;
  y: number;
  size: number;
  color: string;
}
export interface RectanglePrimitive {
  type: "rectangle";
  x_start: number;
  y_start: number;
  x_end: number;
  y_end: number;
  fill: string | null;
  outline: string;
  width: number;
}
export interface LinePrimitive {
  type: "line";
  x_start: number;
  y_start: number;
  x_end: number;
  y_end: number;
  fill: string;
  width: number;
  dashed: boolean;
}
export interface CirclePrimitive {
  type: "circle";
  x: number;
  y: number;
  radius: number;
  fill: string | null;
  outline: string;
  width: number;
}
export interface EllipsePrimitive extends Omit<RectanglePrimitive, "type"> {
  type: "ellipse";
}
export interface IconPrimitive {
  type: "icon";
  value: string;
  x: number;
  y: number;
  size: number;
  color: string;
  anchor: "lt";
}
export interface QrCodePrimitive {
  type: "qrcode";
  data: string;
  x: number;
  y: number;
  boxsize: number;
  border: number;
  color: string;
  bgcolor: string;
}
export interface ProgressBarPrimitive extends Omit<
  RectanglePrimitive,
  "type" | "fill"
> {
  type: "progress_bar";
  progress: number;
  direction: "right" | "left" | "up" | "down";
  background: string;
  fill: string;
  show_percentage: boolean;
}

export type Primitive =
  | TextPrimitive
  | RectanglePrimitive
  | LinePrimitive
  | CirclePrimitive
  | EllipsePrimitive
  | IconPrimitive
  | QrCodePrimitive
  | ProgressBarPrimitive;

export interface PrimitiveItem extends ItemState {
  kind: "primitive";
  primitive: Primitive;
}

export interface ContainerBackground {
  fill: string | null;
  outline: string;
  width: number;
  radius: number;
}

/**
 * A parent of other items (LVGL "Object"). Children store coordinates relative to its
 * top-left corner. A `grouped` container is a group: it has no background of its own.
 */
export interface ContainerItem extends ItemState {
  kind: "container";
  x: number;
  y: number;
  width: number;
  height: number;
  grouped: boolean;
  background: ContainerBackground | null;
  children: TreeItem[];
}

/** What the panel draws and edits today: one flat list (containers arrive in phase 5). */
export type StudioItem = WidgetItem | PrimitiveItem;
export type TreeItem = StudioItem | ContainerItem;

export interface Dashboard {
  id: string;
  schemaVersion: 1;
  name: string;
  status: DashboardStatus;
  language: string;
  display: {
    profileId: string | null;
    width: number;
    height: number;
    palette: PaletteId;
    background: string;
    padding: number;
    snapSize: number;
  };
  items: StudioItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DisplayProfile {
  id: string;
  manufacturer: string;
  name: string;
  width: number;
  height: number;
  palettes: PaletteId[];
  defaultPalette: PaletteId;
}

export interface WidgetFieldDefinition {
  key: string;
  label: string;
  selector: Record<string, unknown>;
  default?: WidgetValue;
}
export interface WidgetSourceDefinition extends WidgetFieldDefinition {
  required: boolean;
  max: number;
  /** The data provider that resolves the picks on the backend. */
  data?: string;
  perSource: WidgetFieldDefinition[];
}
export interface WidgetOptionSection {
  section: string;
  fields: WidgetFieldDefinition[];
}
export interface WidgetDefinition {
  id: string;
  version: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  author: string;
  /** False for a package an administrator installed in the config folder. */
  builtin: boolean;
  layout: {
    defaultSize: { width: number; height: number };
    minSize: { width: number; height: number };
  };
  sources: WidgetSourceDefinition[];
  options: WidgetOptionSection[];
}
/** A widget package that could not be loaded, and why. */
export interface WidgetLoadError {
  folder: string;
  message: string;
}
export type FieldShape =
  "number" | "coordinate" | "boolean" | "enum" | "color" | "string" | "text";

/** A number limit: a fixed value, or one taken from the display size. */
export type FieldLimit =
  number | "display_width" | "display_height" | "display_shorter_side";

export interface PrimitiveField {
  key: string;
  label: string;
  shape: FieldShape;
  section: "layout" | "appearance";
  required?: boolean;
  default?: string | number | boolean;
  /** A colour that may be "no colour" (stored as null, shown as transparent). */
  nullable?: boolean;
  axis?: "x" | "y";
  min?: FieldLimit;
  max?: FieldLimit;
  unit?: string;
  options?: string[];
  maxLength?: number;
  maxBytes?: number;
  /** False for fields the backend fixes and the panel never shows. */
  visible?: boolean;
}

/** One ODL primitive, exactly as the backend's `primitives/<type>.yml` declares it. */
export interface PrimitiveDefinition {
  type: Primitive["type"];
  order: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  geometry: "point" | "box" | "line";
  /** How far a new box or line reaches from where it is dropped. */
  extent?: { x: number; y: number };
  fields: PrimitiveField[];
}
export interface PreviewDependencies {
  entities: string[];
  domains: string[];
  allStates: boolean;
  usesTime: boolean;
}

export interface ItemBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface ComposePreviewResponse {
  imageUrl: string;
  yaml: string;
  itemBounds: Record<string, ItemBounds>;
  warnings: string[];
  /** What the preview's expressions read; a change in any of it makes the preview stale. */
  dependencies: PreviewDependencies;
  timings: {
    queue: number;
    data: number;
    compile: number;
    render: number;
    encode: number;
    pipeline: number;
  };
}
export interface BootstrapResponse {
  version: string;
  dashboards: Dashboard[];
  widgets: WidgetDefinition[];
  widgetErrors: WidgetLoadError[];
  primitives: PrimitiveDefinition[];
}

export interface ReloadWidgetsResponse {
  widgets: WidgetDefinition[];
  widgetErrors: WidgetLoadError[];
}
export interface HomeAssistant {
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  language: string;
  states?: Record<
    string,
    { state: string; attributes?: Record<string, unknown> }
  >;
}
export interface HaFormSchema {
  name: string;
  label: string;
  required?: boolean;
  selector: Record<string, unknown>;
}
export interface FormSectionSchema {
  name: string;
  type: "grid" | "expandable";
  flatten: true;
  title?: string;
  expanded?: boolean;
  schema: StudioFormSchema[];
}
export type StudioFormSchema = HaFormSchema | FormSectionSchema;
