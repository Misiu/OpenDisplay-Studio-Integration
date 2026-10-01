import { defaultBackground } from "./container-ops";
import { strings } from "./strings";
import type {
  ContainerBackground,
  ContainerItem,
  PrimitiveField,
} from "./types";

const MAX_OUTLINE = 32;
const MAX_RADIUS = 256;

/**
 * The fields of a plain container's background, described like the fields of a primitive
 * so they are edited with the same controls: a switch, two colors and two sizes.
 */
export const backgroundFields = (): PrimitiveField[] => {
  const labels = strings.inspector;
  return [
    {
      key: "enabled",
      label: labels.backgroundEnabled,
      shape: "boolean",
      section: "appearance",
      default: false,
    },
    {
      key: "fill",
      label: labels.backgroundFill,
      shape: "color",
      section: "appearance",
      nullable: true,
    },
    {
      key: "outline",
      label: labels.backgroundOutline,
      shape: "color",
      section: "appearance",
      default: "black",
    },
    {
      key: "width",
      label: labels.backgroundWidth,
      shape: "number",
      section: "appearance",
      unit: "px",
      min: 0,
      max: MAX_OUTLINE,
      default: 1,
    },
    {
      key: "radius",
      label: labels.backgroundRadius,
      shape: "number",
      section: "appearance",
      unit: "px",
      min: 0,
      max: MAX_RADIUS,
      default: 0,
    },
  ];
};

/** The values of the background fields; a container without one shows the defaults. */
export const backgroundFormData = (
  item: ContainerItem
): Record<string, unknown> => {
  const background = item.background ?? defaultBackground();
  return {
    enabled: item.background !== null,
    fill: background.fill,
    outline: background.outline,
    width: background.width,
    radius: background.radius,
  };
};

const numberIn = (
  value: unknown,
  fallback: number,
  maximum: number
): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(maximum, Math.max(0, Math.round(value)));
};

/** The background the fields describe: none when it is switched off. */
export const backgroundFromForm = (
  values: Record<string, unknown>
): ContainerBackground | null => {
  if (values.enabled !== true) return null;
  const fallback = defaultBackground();
  const fill = "fill" in values ? values.fill : fallback.fill;
  return {
    fill: typeof fill === "string" ? fill : null,
    outline:
      typeof values.outline === "string" ? values.outline : fallback.outline,
    width: numberIn(values.width, fallback.width, MAX_OUTLINE),
    radius: numberIn(values.radius, fallback.radius, MAX_RADIUS),
  };
};
