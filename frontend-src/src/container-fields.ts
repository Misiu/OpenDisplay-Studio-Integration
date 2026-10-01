import { PALETTE_COLORS } from "./display-profiles";
import { defaultBackground } from "./container-ops";
import type {
  ContainerBackground,
  ContainerItem,
  HaFormSchema,
  PaletteId,
} from "./types";

/** What the form calls a fill of "no colour". */
const NO_FILL = "none";

const MAX_OUTLINE = 32;
const MAX_RADIUS = 256;

/** The `ha-form` schema of a plain container's background. */
export const backgroundSchema = (
  palette: PaletteId,
  labels: Record<"enabled" | "fill" | "outline" | "width" | "radius", string>
): HaFormSchema[] => {
  const colors = [...PALETTE_COLORS[palette], "accent"];
  return [
    { name: "enabled", label: labels.enabled, selector: { boolean: {} } },
    {
      name: "fill",
      label: labels.fill,
      selector: { select: { options: [NO_FILL, ...colors] } },
    },
    {
      name: "outline",
      label: labels.outline,
      selector: { select: { options: colors } },
    },
    {
      name: "width",
      label: labels.width,
      selector: { number: { min: 0, max: MAX_OUTLINE } },
    },
    {
      name: "radius",
      label: labels.radius,
      selector: { number: { min: 0, max: MAX_RADIUS } },
    },
  ];
};

/** The values the background form shows; a container without one shows the defaults. */
export const backgroundFormData = (
  item: ContainerItem
): Record<string, unknown> => {
  const background = item.background ?? defaultBackground();
  return {
    enabled: item.background !== null,
    fill: background.fill ?? NO_FILL,
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

/** The background a form reports: none when it is switched off. */
export const backgroundFromForm = (
  values: Record<string, unknown>
): ContainerBackground | null => {
  if (values.enabled !== true) return null;
  const fallback = defaultBackground();
  const fill = typeof values.fill === "string" ? values.fill : fallback.fill;
  return {
    fill: fill === NO_FILL ? null : fill,
    outline:
      typeof values.outline === "string" ? values.outline : fallback.outline,
    width: numberIn(values.width, fallback.width, MAX_OUTLINE),
    radius: numberIn(values.radius, fallback.radius, MAX_RADIUS),
  };
};
