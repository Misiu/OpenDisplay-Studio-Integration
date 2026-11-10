export type PaletteId =
  | "bw"
  | "bwr"
  | "bwy"
  | "bwry"
  | "spectra6"
  | "seven_color"
  | "grayscale4"
  | "grayscale16";
export type DashboardStatus = "draft" | "ready";

/** One colored range of a scale: where it starts (`null` for the lowest value) and its color. */
export type WidgetRange = { from: number | null; color: string };

export type WidgetValue = string | number | boolean | string[] | WidgetRange[];
/** An option left unset, as the text size is when it is automatic, is `null`. */
export type WidgetOptions = Record<string, WidgetValue | null>;

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
  /** The region of a basic dashboard's layout the widget fills; its frame follows it. */
  region?: string;
}

/** What every primitive but the debug grid can be: turned clockwise about its middle. */
interface Turnable {
  /** Degrees, -360 … 360; `null` or absent leaves the renderer's own upright drawing. */
  rotation?: number | null;
}

/** How a text-like element is drawn: font, alignment and outline of the glyphs. */
interface TextStyle extends Turnable {
  font: string;
  align: "left" | "center" | "right";
  spacing: number;
  stroke_width: number;
  stroke_fill: string;
  parse_colors: boolean;
}
export interface TextPrimitive extends TextStyle {
  type: "text";
  value: string;
  x: number;
  y: number;
  size: number;
  color: string;
  /** Pillow anchor; `null` lets the renderer choose. */
  anchor: string | null;
  max_width: number | null;
  truncate: boolean;
}
export interface MultilinePrimitive extends TextStyle {
  type: "multiline";
  value: string;
  delimiter: string;
  x: number;
  y: number;
  offset_y: number;
  size: number;
  color: string;
  anchor: string;
}

/** A primitive given by two opposite corners. */
interface CornerBox {
  x_start: number;
  y_start: number;
  x_end: number;
  y_end: number;
}
/** Corner rounding shared by the rectangle and the rectangle pattern. */
interface Rounding {
  radius: number | null;
  corners: string | null;
}
interface Outlined {
  fill: string | null;
  outline: string;
  width: number;
}
export interface RectanglePrimitive
  extends CornerBox, Outlined, Rounding, Turnable {
  type: "rectangle";
}
export interface RectanglePatternPrimitive
  extends Outlined, Rounding, Turnable {
  type: "rectangle_pattern";
  x_start: number;
  y_start: number;
  x_size: number;
  y_size: number;
  x_offset: number;
  y_offset: number;
  x_repeat: number;
  y_repeat: number;
}
export interface LinePrimitive extends CornerBox, Turnable {
  type: "line";
  fill: string;
  width: number;
  dashed: boolean;
  dash_length: number;
  space_length: number;
}
export interface PolygonPrimitive extends Turnable {
  type: "polygon";
  points: [number, number][];
  fill: string | null;
  outline: string;
}
export interface CirclePrimitive extends Outlined, Turnable {
  type: "circle";
  x: number;
  y: number;
  radius: number;
}
export interface ArcPrimitive extends Outlined, Turnable {
  type: "arc";
  x: number;
  y: number;
  radius: number;
  start_angle: number;
  end_angle: number;
}
export interface EllipsePrimitive extends CornerBox, Outlined, Turnable {
  type: "ellipse";
}
interface IconStyle {
  size: number;
  fill: string;
  anchor: string;
  stroke_width: number;
  stroke_fill: string;
}
export interface IconPrimitive extends IconStyle, Turnable {
  type: "icon";
  value: string;
  x: number;
  y: number;
}
export interface IconSequencePrimitive extends IconStyle, Turnable {
  type: "icon_sequence";
  icons: string[];
  x: number;
  y: number;
  direction: "right" | "left" | "up" | "down";
  /** `null` leaves the gap to the renderer: a quarter of the icon size. */
  spacing: number | null;
}
export interface QrCodePrimitive extends Turnable {
  type: "qrcode";
  data: string;
  x: number;
  y: number;
  boxsize: number;
  border: number;
  color: string;
  bgcolor: string;
}
export interface DlimgPrimitive extends Turnable {
  type: "dlimg";
  url: string;
  x: number;
  y: number;
  xsize: number;
  ysize: number;
  resize_method: "stretch" | "cover" | "contain" | "crop";
  rotate: number;
}
export interface ProgressBarPrimitive extends CornerBox, Turnable {
  type: "progress_bar";
  progress: number;
  direction: "right" | "left" | "up" | "down";
  background: string;
  fill: string;
  outline: string;
  width: number;
  show_percentage: boolean;
  font_name: string;
}
/** A nested object of a plot (a series, an axis or a legend): plain values by key. */
export type PlotObject = Record<string, string | number | boolean | null>;
export interface PlotPrimitive extends CornerBox, Turnable {
  type: "plot";
  data: PlotObject[];
  duration: number;
  low: number | null;
  high: number | null;
  round_values: boolean;
  font: string;
  debug: boolean;
  ylegend: PlotObject | null;
  yaxis: PlotObject | null;
  xlegend: PlotObject | null;
  xaxis: PlotObject | null;
}
export interface DebugGridPrimitive {
  type: "debug_grid";
  spacing: number;
  line_color: string;
  dashed: boolean;
  dash_length: number;
  space_length: number;
  show_labels: boolean;
  label_step: number | null;
  label_color: string;
  label_font_size: number;
  font: string;
}

export type Primitive =
  | TextPrimitive
  | MultilinePrimitive
  | RectanglePrimitive
  | RectanglePatternPrimitive
  | LinePrimitive
  | PolygonPrimitive
  | CirclePrimitive
  | ArcPrimitive
  | EllipsePrimitive
  | IconPrimitive
  | IconSequencePrimitive
  | QrCodePrimitive
  | DlimgPrimitive
  | ProgressBarPrimitive
  | PlotPrimitive
  | DebugGridPrimitive;

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
  /**
   * What a plain container looked like before it was made a group. Ungrouping gives it
   * back; a group made from a selection has none and is dissolved instead.
   */
  savedBackground?: ContainerBackground | null;
  children: StudioItem[];
}

/** An item that draws something itself, as opposed to holding other items. */
export type LeafItem = WidgetItem | PrimitiveItem;
export type StudioItem = LeafItem | ContainerItem;

/** How far, clockwise, the picture is turned before a display gets it. */
export type Rotation = 0 | 90 | 180 | 270;

/** How a dashboard is edited: by regions of a grid (basic) or by free placement (advanced). */
export type DashboardMode = "basic" | "advanced";

/** A rectangle of cells of the grid; every cell of the grid belongs to exactly one. */
export interface GridRegion {
  id: string;
  row: number;
  column: number;
  rowSpan: number;
  columnSpan: number;
}

export interface GridLayout {
  columns: number;
  rows: number;
  gap: number;
  regions: GridRegion[];
}

/** Where the cells and the regions of a layout are on the display, as the backend lays them. */
export interface LayoutFrames {
  cells: ItemFrame[];
  regions: Array<ItemFrame & { id: string }>;
}

/** What the backend accepts of a grid; the panel never declares these itself. */
export interface LayoutLimits {
  minLines: number;
  maxLines: number;
  defaultGap: number;
  maxGap: number;
}

export interface Dashboard {
  id: string;
  schemaVersion: 1;
  name: string;
  /** Chosen when the dashboard is created and never changed afterwards. */
  mode: DashboardMode;
  /** The grid of a basic dashboard; an advanced one has none. */
  layout?: GridLayout;
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
    rotation: Rotation;
    /** The OpenDisplay device the dashboard is made for, which it can be sent to. */
    deviceId: string | null;
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

/** An OpenDisplay device the integration has set up, with the display it drives. */
export interface DisplayDevice {
  id: string;
  name: string;
  manufacturer: string | null;
  model: string | null;
  width: number;
  height: number;
  palette: PaletteId;
  colors: string[];
}

export interface WidgetFieldDefinition {
  key: string;
  label: string;
  selector: Record<string, unknown>;
  default?: WidgetValue | null;
  /** An optional option may be left unset, which means automatic. */
  optional?: boolean;
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
  /** The widget's `preview.png` as a data URL, for the list of widgets; null if it has none. */
  preview: string | null;
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
  | "number"
  | "coordinate"
  | "boolean"
  | "enum"
  | "flags"
  | "color"
  | "string"
  | "entity"
  | "text"
  | "font"
  | "icon"
  | "image"
  | "points"
  | "icons"
  | "object"
  | "objects"
  | "ranges";

/** A number limit: a fixed value, or one taken from the display size. */
export type FieldLimit =
  number | "display_width" | "display_height" | "display_shorter_side";

/** Anything a primitive field can hold, as JSON. */
export type PrimitiveValue =
  | string
  | number
  | boolean
  | null
  | PrimitiveValue[]
  | { [key: string]: PrimitiveValue };

export interface PrimitiveField {
  key: string;
  label: string;
  shape: FieldShape;
  section: "layout" | "appearance";
  required?: boolean;
  default?: PrimitiveValue;
  /** A colour that may be "no colour" (stored as null, shown as transparent). */
  nullable?: boolean;
  /** What an unset colour is called, where "None" would be wrong, such as "Auto". */
  emptyLabel?: string;
  /** Rarely needed: listed under `Advanced`, closed until asked for. */
  advanced?: boolean;
  /** A number that may have a fraction, such as a multiplier. */
  decimal?: boolean;
  /** Left unset (`null`) when the user has not chosen a value; the renderer decides. */
  optional?: boolean;
  /** Shown in an unset number: what it is then, such as "Auto". */
  placeholder?: string;
  /** The fields of an `object`, or of each entry of `objects`. */
  nested?: PrimitiveField[];
  axis?: "x" | "y";
  min?: FieldLimit;
  max?: FieldLimit;
  unit?: string;
  options?: string[];
  /** What to call each option, where it is not the value itself. */
  optionLabels?: Record<string, string>;
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
  geometry:
    | "point"
    | "box"
    | "line"
    | "radial"
    | "points"
    | "pattern"
    | "image"
    | "canvas";
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
/** A preview and the dashboard it was rendered from, which has since been edited. */
export interface PreviewState extends ComposePreviewResponse {
  composedFrom: Dashboard;
}

/** What the backend makes of a dashboard file for the dashboard that is open. */
export interface ImportPlan {
  items: StudioItem[];
  /** The colors the file uses that the palette lacks, each with the nearest color. */
  colorsToMap: Array<{ source: string; suggestion: string }>;
  sourcePalette: string | null;
  /** Elements were made smaller or moved nearer so that they fit this display. */
  adjusted: boolean;
}

export interface ComposePreviewResponse {
  imageUrl: string;
  /** Pixels the picture shows beyond each edge of the display, where elements hang out. */
  margin?: number;
  yaml: string;
  itemBounds: Record<string, ItemBounds>;
  /** Where the renderer turns each rotated primitive; one not listed turns about its middle. */
  itemPivots?: Record<string, { x: number; y: number }>;
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
/** A dashboard that uses a font. */
export interface FontUse {
  id: string;
  name: string;
}

/** A font the renderer can draw with, as the panel lists it. */
export interface FontInfo {
  /** The file name: what a dashboard stores. */
  name: string;
  family: string;
  style: string;
  /** Comes with the renderer: it cannot be removed. */
  bundled: boolean;
  /** Bytes. */
  size: number;
  /** Changes when the file does; part of the address the panel loads the font from. */
  version: number;
  usedBy: FontUse[];
}

export interface BootstrapResponse {
  version: string;
  dashboards: Dashboard[];
  widgets: WidgetDefinition[];
  widgetErrors: WidgetLoadError[];
  primitives: PrimitiveDefinition[];
  fonts: FontInfo[];
  layoutLimits: LayoutLimits;
}

export interface ReloadWidgetsResponse {
  widgets: WidgetDefinition[];
  widgetErrors: WidgetLoadError[];
}
/** The icons the renderer can draw and the character of each in its icon font. */
export interface IconCatalog {
  names: string[];
  glyphs: Record<string, string>;
}

export interface HomeAssistant {
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  /** Fetches an address of Home Assistant as the logged-in user. */
  fetchWithAuth?(path: string, init?: RequestInit): Promise<Response>;
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
