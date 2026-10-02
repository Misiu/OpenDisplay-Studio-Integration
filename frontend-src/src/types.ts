export type PaletteId =
  | "bw"
  | "bwr"
  | "bwy"
  | "bwry"
  | "spectra6"
  | "seven_color"
  | "grayscale4"
  | "grayscale8"
  | "grayscale16";
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

/** How a text-like element is drawn: font, alignment and outline of the glyphs. */
interface TextStyle {
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
export interface RectanglePrimitive extends CornerBox, Outlined, Rounding {
  type: "rectangle";
}
export interface RectanglePatternPrimitive extends Outlined, Rounding {
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
export interface LinePrimitive extends CornerBox {
  type: "line";
  fill: string;
  width: number;
  dashed: boolean;
  dash_length: number;
  space_length: number;
}
export interface PolygonPrimitive {
  type: "polygon";
  points: [number, number][];
  fill: string | null;
  outline: string;
}
export interface CirclePrimitive extends Outlined {
  type: "circle";
  x: number;
  y: number;
  radius: number;
}
export interface ArcPrimitive extends Outlined {
  type: "arc";
  x: number;
  y: number;
  radius: number;
  start_angle: number;
  end_angle: number;
}
export interface EllipsePrimitive extends CornerBox, Outlined {
  type: "ellipse";
}
interface IconStyle {
  size: number;
  fill: string;
  anchor: string;
  stroke_width: number;
  stroke_fill: string;
}
export interface IconPrimitive extends IconStyle {
  type: "icon";
  value: string;
  x: number;
  y: number;
}
export interface IconSequencePrimitive extends IconStyle {
  type: "icon_sequence";
  icons: string[];
  x: number;
  y: number;
  direction: "right" | "left" | "up" | "down";
  /** `null` leaves the gap to the renderer: a quarter of the icon size. */
  spacing: number | null;
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
export interface DlimgPrimitive {
  type: "dlimg";
  url: string;
  x: number;
  y: number;
  xsize: number;
  ysize: number;
  resize_method: "stretch" | "cover" | "contain" | "crop";
  rotate: number;
}
export interface ProgressBarPrimitive extends CornerBox {
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
export interface PlotPrimitive extends CornerBox {
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
  | "objects";

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
  /** Rarely needed: listed under `Advanced`, closed until asked for. */
  advanced?: boolean;
  /** A number that may have a fraction, such as a multiplier. */
  decimal?: boolean;
  /** Left unset (`null`) when the user has not chosen a value; the renderer decides. */
  optional?: boolean;
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
