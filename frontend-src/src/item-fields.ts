import { PALETTE_COLORS } from "./display-profiles";
import { isBoxPrimitive } from "./geometry";
import { resolveLimit } from "./primitives";
import { strings } from "./strings";
import type {
  Dashboard,
  HaFormSchema,
  PaletteId,
  PrimitiveDefinition,
  PrimitiveField,
  PrimitiveItem,
  StudioItem,
  WidgetItem,
} from "./types";

/** One numeric layout input of the inspector. */
export interface LayoutField {
  label: string;
  key: string;
  value: number;
  min: number;
  max: number;
}

/** The layout inputs of an item: a grid of position/size fields plus any that sit below it. */
export interface LayoutFields {
  grid: LayoutField[];
  extra: LayoutField[];
}

const NO_FIELDS: LayoutFields = { grid: [], extra: [] };
const TRANSPARENT = "transparent";

/** The definition of a primitive item, if the backend offers that type. */
export const definitionFor = (
  item: PrimitiveItem,
  definitions: PrimitiveDefinition[]
): PrimitiveDefinition | undefined =>
  definitions.find((definition) => definition.type === item.primitive.type);

const widgetLayoutFields = (
  item: WidgetItem,
  dashboard: Dashboard
): LayoutFields => {
  const { width, height } = dashboard.display;
  const labels = strings.fields;
  return {
    grid: [
      { label: labels.x, key: "x", value: item.frame.x, min: 0, max: width },
      { label: labels.y, key: "y", value: item.frame.y, min: 0, max: height },
      {
        label: labels.width,
        key: "width",
        value: item.frame.width,
        min: 1,
        max: width,
      },
      {
        label: labels.height,
        key: "height",
        value: item.frame.height,
        min: 1,
        max: height,
      },
    ],
    extra: [
      {
        label: labels.innerPadding,
        key: "padding",
        value: item.layout.padding,
        min: 0,
        max: 128,
      },
    ],
  };
};

/** A box or line is edited as left, top, width and height, whichever way it was drawn. */
const cornerLayoutFields = (
  item: PrimitiveItem,
  dashboard: Dashboard
): LayoutFields => {
  const primitive = item.primitive;
  if (!isBoxPrimitive(primitive)) {
    return NO_FIELDS;
  }
  const { width, height } = dashboard.display;
  const labels = strings.fields;
  return {
    grid: [
      {
        label: labels.x,
        key: "x",
        value: Math.min(primitive.x_start, primitive.x_end),
        min: 0,
        max: width,
      },
      {
        label: labels.y,
        key: "y",
        value: Math.min(primitive.y_start, primitive.y_end),
        min: 0,
        max: height,
      },
      {
        label: labels.width,
        key: "width",
        value: Math.abs(primitive.x_end - primitive.x_start) + 1,
        min: 1,
        max: width,
      },
      {
        label: labels.height,
        key: "height",
        value: Math.abs(primitive.y_end - primitive.y_start) + 1,
        min: 1,
        max: height,
      },
    ],
    extra: [],
  };
};

const pointLayoutField = (
  field: PrimitiveField,
  values: Record<string, unknown>,
  dashboard: Dashboard
): LayoutField => {
  const display = dashboard.display;
  const coordinateLimit = field.axis === "x" ? display.width : display.height;
  const isCoordinate = field.shape === "coordinate";
  return {
    label: field.label,
    key: field.key,
    value: Number(values[field.key]),
    min: isCoordinate ? 0 : resolveLimit(field.min, display, 0),
    max: isCoordinate
      ? coordinateLimit
      : resolveLimit(field.max, display, coordinateLimit),
  };
};

/** A point is edited through its own layout fields: its position and, say, a radius or size. */
const pointLayoutFields = (
  item: PrimitiveItem,
  definition: PrimitiveDefinition,
  dashboard: Dashboard
): LayoutFields => {
  const values: Record<string, unknown> = { ...item.primitive };
  const grid = definition.fields
    .filter((field) => field.section === "layout")
    .map((field) => pointLayoutField(field, values, dashboard));
  return { grid, extra: [] };
};

/** The numeric layout fields the inspector shows for an item, from its definition. */
export const layoutFields = (
  item: StudioItem,
  dashboard: Dashboard,
  definitions: PrimitiveDefinition[]
): LayoutFields => {
  if (item.kind === "widget") {
    return widgetLayoutFields(item, dashboard);
  }
  const definition = definitionFor(item, definitions);
  if (!definition) {
    return NO_FIELDS;
  }
  return definition.geometry === "point"
    ? pointLayoutFields(item, definition, dashboard)
    : cornerLayoutFields(item, dashboard);
};

const formSelector = (
  field: PrimitiveField,
  colors: string[]
): Record<string, unknown> => {
  switch (field.shape) {
    case "boolean":
      return { boolean: {} };
    case "enum":
      return { select: { options: field.options ?? [] } };
    case "color":
      return {
        select: {
          options: field.nullable ? [TRANSPARENT, ...colors] : colors,
        },
      };
    case "number":
      return {
        number: {
          min: typeof field.min === "number" ? field.min : undefined,
          max: typeof field.max === "number" ? field.max : undefined,
        },
      };
    default:
      return { text: {} };
  }
};

const isShownInForm = (field: PrimitiveField): boolean =>
  field.section === "appearance" && field.visible !== false;

/** The `ha-form` schema for a primitive's appearance, with colours limited to the palette. */
export const primitiveAppearanceSchema = (
  item: PrimitiveItem,
  palette: PaletteId,
  definitions: PrimitiveDefinition[]
): HaFormSchema[] => {
  const definition = definitionFor(item, definitions);
  if (!definition) {
    return [];
  }
  const colors = [...PALETTE_COLORS[palette], "accent"];
  return definition.fields.filter(isShownInForm).map((field) => ({
    name: field.key,
    label: field.label,
    selector: formSelector(field, colors),
  }));
};

/** The values the appearance form shows: an empty optional colour reads as transparent. */
export const appearanceFormData = (
  item: PrimitiveItem,
  definitions: PrimitiveDefinition[]
): Record<string, unknown> => {
  const data: Record<string, unknown> = { ...item.primitive };
  const definition = definitionFor(item, definitions);
  for (const field of definition?.fields ?? []) {
    if (field.nullable && data[field.key] === null) {
      data[field.key] = TRANSPARENT;
    }
  }
  return data;
};

/** Turn what the appearance form reports back into primitive values. */
export const primitiveValuesFromForm = (
  values: Record<string, unknown>,
  definition: PrimitiveDefinition | undefined
): Record<string, unknown> => {
  const result = { ...values };
  for (const field of definition?.fields ?? []) {
    if (field.nullable && result[field.key] === TRANSPARENT) {
      result[field.key] = null;
    }
  }
  return result;
};
