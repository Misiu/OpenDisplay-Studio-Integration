import { isBoxPrimitive } from "./geometry";
import { PALETTE_COLORS } from "./display-profiles";
import { strings } from "./strings";
import type {
  Dashboard,
  HaFormSchema,
  PaletteId,
  PrimitiveItem,
  StudioItem,
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

/** The numeric layout fields the inspector shows for an item, by kind and primitive type. */
export const layoutFields = (
  item: StudioItem,
  dashboard: Dashboard
): LayoutFields => {
  const { width, height } = dashboard.display;
  const labels = strings.fields;
  const field = (
    label: string,
    key: string,
    value: number,
    min: number,
    max: number
  ): LayoutField => ({ label, key, value, min, max });
  if (item.kind === "widget") {
    return {
      grid: [
        field(labels.x, "x", item.frame.x, 0, width),
        field(labels.y, "y", item.frame.y, 0, height),
        field(labels.width, "width", item.frame.width, 1, width),
        field(labels.height, "height", item.frame.height, 1, height),
      ],
      extra: [
        field(labels.innerPadding, "padding", item.layout.padding, 0, 128),
      ],
    };
  }
  const primitive = item.primitive;
  if (isBoxPrimitive(primitive)) {
    return {
      grid: [
        field(
          labels.x,
          "x",
          Math.min(primitive.x_start, primitive.x_end),
          0,
          width
        ),
        field(
          labels.y,
          "y",
          Math.min(primitive.y_start, primitive.y_end),
          0,
          height
        ),
        field(
          labels.width,
          "width",
          Math.abs(primitive.x_end - primitive.x_start) + 1,
          1,
          width
        ),
        field(
          labels.height,
          "height",
          Math.abs(primitive.y_end - primitive.y_start) + 1,
          1,
          height
        ),
      ],
      extra: [],
    };
  }
  if (primitive.type === "circle") {
    return {
      grid: [
        field(labels.centerX, "x", primitive.x, 0, width),
        field(labels.centerY, "y", primitive.y, 0, height),
        field(
          labels.radius,
          "radius",
          primitive.radius,
          1,
          Math.min(width, height)
        ),
      ],
      extra: [],
    };
  }
  if (primitive.type === "qrcode") {
    return {
      grid: [
        field(labels.x, "x", primitive.x, 0, width),
        field(labels.y, "y", primitive.y, 0, height),
        field(labels.moduleSize, "boxsize", primitive.boxsize, 1, 16),
      ],
      extra: [],
    };
  }
  return {
    grid: [
      field(labels.x, "x", primitive.x, 0, width),
      field(labels.y, "y", primitive.y, 0, height),
      field(labels.size, "size", primitive.size, 6, 256),
    ],
    extra: [],
  };
};

/** The `ha-form` schema for a primitive's appearance, with colours limited to the palette. */
export const primitiveAppearanceSchema = (
  item: PrimitiveItem,
  palette: PaletteId
): HaFormSchema[] => {
  const colors = [...PALETTE_COLORS[palette], "accent"];
  const labels = strings.fields;
  const color = (
    name: string,
    label: string,
    options: string[] = colors
  ): HaFormSchema => ({ name, label, selector: { select: { options } } });
  const number = (
    name: string,
    label: string,
    min: number,
    max: number
  ): HaFormSchema => ({ name, label, selector: { number: { min, max } } });
  const text = (name: string, label: string): HaFormSchema => ({
    name,
    label,
    selector: { text: {} },
  });
  const toggle = (name: string, label: string): HaFormSchema => ({
    name,
    label,
    selector: { boolean: {} },
  });
  switch (item.primitive.type) {
    case "text":
      return [text("value", labels.text), color("color", labels.color)];
    case "line":
      return [
        color("fill", labels.color),
        number("width", labels.lineWidth, 1, 32),
        toggle("dashed", labels.dashed),
      ];
    case "icon":
      return [text("value", labels.iconName), color("color", labels.color)];
    case "qrcode":
      return [
        text("data", labels.content),
        number("border", labels.quietZone, 0, 8),
        color("color", labels.foreground),
        color("bgcolor", labels.background),
      ];
    case "progress_bar":
      return [
        number("progress", labels.progress, 0, 100),
        color("direction", labels.direction, ["right", "left", "up", "down"]),
        color("fill", labels.fill),
        color("background", labels.background),
        toggle("show_percentage", labels.showPercentage),
      ];
    default:
      return [
        color("fill", labels.fill, ["transparent", ...colors]),
        color("outline", labels.outline),
        number("width", labels.outlineWidth, 0, 32),
      ];
  }
};
