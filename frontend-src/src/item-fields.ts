import { PALETTE_COLORS } from "./display-profiles";
import { isBoxPrimitive, primitiveBounds } from "./geometry";
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
  /** The field is one the primitive stores itself, so it can be an expression. */
  stored: boolean;
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

/** A layout input; derived ones (a box's width, a widget's frame) are not stored fields. */
const layoutField = (
  label: string,
  key: string,
  value: number,
  min: number,
  max: number,
  stored = false
): LayoutField => ({ label, key, value, min, max, stored });

const widgetLayoutFields = (
  item: WidgetItem,
  dashboard: Dashboard
): LayoutFields => {
  const { width, height } = dashboard.display;
  const labels = strings.fields;
  return {
    grid: [
      layoutField(labels.x, "x", item.frame.x, 0, width),
      layoutField(labels.y, "y", item.frame.y, 0, height),
      layoutField(labels.width, "width", item.frame.width, 1, width),
      layoutField(labels.height, "height", item.frame.height, 1, height),
    ],
    extra: [
      layoutField(labels.innerPadding, "padding", item.layout.padding, 0, 128),
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
  const bounds = primitiveBounds(primitive);
  return {
    grid: [
      layoutField(labels.x, "x", bounds.x, 0, width),
      layoutField(labels.y, "y", bounds.y, 0, height),
      layoutField(labels.width, "width", bounds.width, 1, width),
      layoutField(labels.height, "height", bounds.height, 1, height),
    ],
    extra: [],
  };
};

const storedLayoutField = (
  field: PrimitiveField,
  values: Record<string, unknown>,
  dashboard: Dashboard
): LayoutField => {
  const display = dashboard.display;
  const coordinateLimit = field.axis === "x" ? display.width : display.height;
  const isCoordinate = field.shape === "coordinate";
  return layoutField(
    field.label,
    field.key,
    Number(values[field.key]),
    isCoordinate ? 0 : resolveLimit(field.min, display, 0),
    isCoordinate
      ? coordinateLimit
      : resolveLimit(field.max, display, coordinateLimit),
    true
  );
};

/** The layout fields a primitive stores itself, straight from its definition. */
const storedLayoutFields = (
  item: PrimitiveItem,
  definition: PrimitiveDefinition,
  dashboard: Dashboard
): LayoutFields => {
  const values: Record<string, unknown> = { ...item.primitive };
  const grid = definition.fields
    .filter((field) => field.section === "layout")
    .map((field) => storedLayoutField(field, values, dashboard));
  return { grid, extra: [] };
};

/** Whether a box or line can also be edited by its corners, where each may be an expression. */
export const hasCornerFields = (
  item: StudioItem,
  definitions: PrimitiveDefinition[]
): boolean =>
  item.kind === "primitive" &&
  definitionFor(item, definitions)?.geometry !== "point";

/**
 * The numeric layout fields the inspector shows for an item, from its definition. A box
 * or line shows left, top, width and height, or with `corners` the four stored corners.
 */
export const layoutFields = (
  item: StudioItem,
  dashboard: Dashboard,
  definitions: PrimitiveDefinition[],
  corners = false
): LayoutFields => {
  if (item.kind === "widget") {
    return widgetLayoutFields(item, dashboard);
  }
  const definition = definitionFor(item, definitions);
  if (!definition) {
    return NO_FIELDS;
  }
  return definition.geometry === "point" || corners
    ? storedLayoutFields(item, definition, dashboard)
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
