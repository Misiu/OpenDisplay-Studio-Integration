import { strings } from "./strings";
import type { Primitive, StudioItem, WidgetDefinition } from "./types";

export const primitiveIcons: Record<Primitive["type"], string> = {
  text: "mdi:format-text",
  rectangle: "mdi:rectangle-outline",
  line: "mdi:vector-line",
  circle: "mdi:circle-outline",
  ellipse: "mdi:ellipse-outline",
  icon: "mdi:star-outline",
  qrcode: "mdi:qrcode",
  progress_bar: "mdi:progress-helper",
};

const definitionOf = (
  item: StudioItem,
  widgets: WidgetDefinition[]
): WidgetDefinition | undefined =>
  item.kind === "widget"
    ? widgets.find((widget) => widget.id === item.widget.type)
    : undefined;

/**
 * What the structure list, canvas and inspector call an item: a widget's own
 * title if it has one.
 */
export const itemName = (
  item: StudioItem,
  widgets: WidgetDefinition[]
): string => {
  if (item.kind === "primitive") return strings.primitives[item.primitive.type];
  const title = item.widget.config.title;
  return typeof title === "string" && title.trim()
    ? title
    : (definitionOf(item, widgets)?.name ?? item.widget.type);
};

export const itemIcon = (
  item: StudioItem,
  widgets: WidgetDefinition[]
): string =>
  item.kind === "primitive"
    ? primitiveIcons[item.primitive.type]
    : (definitionOf(item, widgets)?.icon ?? "mdi:puzzle");
