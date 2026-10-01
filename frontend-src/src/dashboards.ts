import {
  DISPLAY_PROFILES,
  isPaletteId,
  PALETTE_COLORS,
  PALETTE_LABELS,
  profileById,
} from "./display-profiles";
import { strings } from "./strings";
import type {
  Dashboard,
  DisplayDevice,
  DisplayProfile,
  PaletteId,
  Rotation,
  StudioFormSchema,
} from "./types";

/** Where a new dashboard takes its display from. */
export type DashboardSource = "device" | "preset" | "custom";

export const ROTATIONS: Rotation[] = [0, 90, 180, 270];

export const isRotation = (value: number): value is Rotation =>
  ROTATIONS.some((rotation) => rotation === value);

/** A quarter turn swaps the width and the height of the picture. */
export const isQuarterTurn = (rotation: Rotation): boolean =>
  rotation === 90 || rotation === 270;

/** The canvas of a display of the given own size, for the way the picture is turned. */
export const canvasSize = (
  size: { width: number; height: number },
  rotation: Rotation
): { width: number; height: number } =>
  isQuarterTurn(rotation)
    ? { width: size.height, height: size.width }
    : { width: size.width, height: size.height };

/** The canvas after the picture is turned from one rotation to another. */
export const turnedCanvas = (
  size: { width: number; height: number },
  from: Rotation,
  to: Rotation
): { width: number; height: number } =>
  isQuarterTurn(from) === isQuarterTurn(to)
    ? size
    : { width: size.height, height: size.width };

const rotationFrom = (value: string, current: Rotation): Rotation => {
  const rotation = Number(value);
  return isRotation(rotation) ? rotation : current;
};

export type DashboardSort = "updated" | "name";

/** The fields the create and display-settings forms edit. */
export interface DashboardFormData {
  name: string;
  width: number;
  height: number;
  palette: PaletteId;
  background: string;
  rotation: string;
  padding: number;
  snapSize: number;
}

export const freshDashboard = (
  language: string,
  profileId = "custom"
): Dashboard => {
  const profile = profileById(profileId);
  return {
    id: "",
    schemaVersion: 1,
    name: "",
    status: "draft",
    language: language || "en",
    display: {
      profileId: profile.id,
      width: profile.width,
      height: profile.height,
      palette: profile.defaultPalette,
      background: "white",
      padding: 0,
      snapSize: 5,
      rotation: 0,
      deviceId: null,
    },
    items: [],
    createdAt: "",
    updatedAt: "",
  };
};

export const dashboardFormData = (dashboard: Dashboard): DashboardFormData => ({
  name: dashboard.name,
  width: dashboard.display.width,
  height: dashboard.display.height,
  palette: dashboard.display.palette,
  background: dashboard.display.background,
  rotation: String(dashboard.display.rotation),
  padding: dashboard.display.padding,
  snapSize: dashboard.display.snapSize,
});

interface DisplaySettings {
  profileId: string;
  deviceId: string | null;
  width: number;
  height: number;
  palette: PaletteId;
}

/** A copy of the dashboard on another display; a background the palette lacks becomes white. */
const onDisplay = (
  dashboard: Dashboard,
  display: DisplaySettings
): Dashboard => {
  const next = structuredClone(dashboard);
  Object.assign(next.display, display);
  if (!PALETTE_COLORS[display.palette].includes(next.display.background)) {
    next.display.background = "white";
  }
  return next;
};

/** The dashboard sized for an OpenDisplay device: its resolution and its colors. */
export const dashboardFromDevice = (
  dashboard: Dashboard,
  device: DisplayDevice
): Dashboard =>
  onDisplay(dashboard, {
    profileId: "custom",
    deviceId: device.id,
    ...canvasSize(device, dashboard.display.rotation),
    palette: device.palette,
  });

/** The dashboard sized for a predefined display, in one of the colors it offers. */
export const dashboardFromProfile = (
  dashboard: Dashboard,
  profile: DisplayProfile,
  palette: PaletteId = profile.defaultPalette
): Dashboard =>
  onDisplay(dashboard, {
    profileId: profile.id,
    deviceId: null,
    ...canvasSize(profile, dashboard.display.rotation),
    palette: profile.palettes.includes(palette)
      ? palette
      : profile.defaultPalette,
  });

/** Apply form edits to a copy of the dashboard; a new size makes the display "custom". */
export const dashboardFromForm = (
  dashboard: Dashboard,
  partial: Partial<DashboardFormData>
): Dashboard => {
  const value = { ...dashboardFormData(dashboard), ...partial };
  const next = structuredClone(dashboard);
  next.name = String(value.name);
  const typed = {
    width: Math.round(Number(value.width) || 0),
    height: Math.round(Number(value.height) || 0),
  };
  const sizeEdited =
    typed.width !== dashboard.display.width ||
    typed.height !== dashboard.display.height;
  const rotation = rotationFrom(value.rotation, dashboard.display.rotation);
  // A new size is the user's own; a new rotation keeps the display and turns its canvas.
  const canvas = sizeEdited
    ? typed
    : turnedCanvas(typed, dashboard.display.rotation, rotation);
  if (sizeEdited) {
    next.display.profileId = "custom";
    next.display.deviceId = null;
  }
  next.display.width = canvas.width;
  next.display.height = canvas.height;
  next.display.rotation = rotation;
  next.display.palette = value.palette in PALETTE_LABELS ? value.palette : "bw";
  next.display.padding = Math.round(Number(value.padding) || 0);
  next.display.snapSize = Math.round(Number(value.snapSize) || 0);
  const colors = PALETTE_COLORS[next.display.palette];
  next.display.background = colors.includes(value.background)
    ? value.background
    : "white";
  return next;
};

export const dashboardIsValid = (dashboard: Dashboard): boolean => {
  const { width, height, padding, snapSize } = dashboard.display;
  return (
    Boolean(dashboard.name.trim()) &&
    width >= 64 &&
    width <= 4096 &&
    height >= 64 &&
    height <= 4096 &&
    padding >= 0 &&
    padding * 2 < Math.min(width, height) &&
    snapSize >= 1 &&
    snapSize <= 256
  );
};

/** The gallery list: filtered by name, then sorted; the input array is left alone. */
export const listDashboards = (
  dashboards: Dashboard[],
  query: string,
  sort: DashboardSort,
  language: string
): Dashboard[] => {
  const needle = query.trim().toLocaleLowerCase(language);
  return dashboards
    .filter(
      (dashboard) =>
        !needle || dashboard.name.toLocaleLowerCase(language).includes(needle)
    )
    .sort((left, right) =>
      sort === "name"
        ? left.name.localeCompare(right.name, language)
        : right.updatedAt.localeCompare(left.updatedAt) ||
          left.name.localeCompare(right.name, language)
    );
};

/** "<name> copy", then "<name> copy 2", … until no dashboard has that name. */
export const copyName = (
  dashboard: Dashboard,
  all: Dashboard[],
  language: string
): string => {
  const names = new Set(
    all.map((candidate) => candidate.name.toLocaleLowerCase(language))
  );
  const base = `${dashboard.name} copy`;
  let candidate = base;
  let suffix = 2;
  while (names.has(candidate.toLocaleLowerCase(language))) {
    candidate = `${base} ${suffix++}`;
  }
  return candidate;
};

/** Which display fields a form offers: the size, and the palettes to pick from. */
export interface DisplayFields {
  size: boolean;
  palettes: PaletteId[];
  /** The colors the background can be; none leaves the background out of the form. */
  backgrounds: string[];
}

export const ALL_PALETTES: PaletteId[] =
  Object.keys(PALETTE_LABELS).filter(isPaletteId);

/** The predefined displays; `custom` is the size the user types. */
export const PRESET_PROFILES: DisplayProfile[] = DISPLAY_PROFILES.filter(
  (profile) => profile.id !== "custom"
);

const ALL_DISPLAY_FIELDS: DisplayFields = {
  size: true,
  palettes: ALL_PALETTES,
  backgrounds: [],
};

/** The fields the display-settings dialog offers for a saved dashboard. */
export const settingsFormFields = (dashboard: Dashboard): DisplayFields => ({
  ...ALL_DISPLAY_FIELDS,
  backgrounds: PALETTE_COLORS[dashboard.display.palette],
});

const pixelField = (name: string, label: string): StudioFormSchema => ({
  name,
  label,
  required: true,
  selector: {
    number: { mode: "box", min: 64, max: 4096, unit_of_measurement: "px" },
  },
});

const sizeFields = (): StudioFormSchema[] => [
  {
    name: "dimensions",
    type: "grid",
    flatten: true,
    schema: [
      pixelField("width", strings.fields.width),
      pixelField("height", strings.fields.height),
    ],
  },
];

const paletteFields = (palettes: PaletteId[]): StudioFormSchema[] => [
  {
    name: "palette",
    label: strings.fields.palette,
    required: true,
    selector: {
      select: {
        mode: "dropdown",
        options: palettes.map((value) => ({
          value,
          label: PALETTE_LABELS[value],
        })),
      },
    },
  },
];

const backgroundFields = (colors: string[]): StudioFormSchema[] => [
  {
    name: "background",
    label: strings.fields.background,
    required: true,
    selector: {
      select: {
        mode: "dropdown",
        options: colors.map((color) => ({
          value: color,
          label: `${color[0].toUpperCase()}${color.slice(1)}`,
        })),
      },
    },
  },
];

const rotationFields = (): StudioFormSchema[] => [
  {
    name: "rotation",
    label: strings.fields.rotation,
    required: true,
    selector: {
      select: {
        mode: "dropdown",
        options: ROTATIONS.map((rotation) => ({
          value: String(rotation),
          label: strings.rotations[rotation],
        })),
      },
    },
  },
];

const advancedFields = (): StudioFormSchema[] => [
  {
    name: "advanced",
    type: "expandable",
    flatten: true,
    title: strings.fields.advanced,
    expanded: false,
    schema: [
      {
        name: "padding",
        label: strings.fields.padding,
        selector: {
          number: { mode: "box", min: 0, max: 1024, unit_of_measurement: "px" },
        },
      },
      {
        name: "snapSize",
        label: strings.fields.snapSize,
        selector: {
          number: { mode: "box", min: 1, max: 256, unit_of_measurement: "px" },
        },
      },
    ],
  },
];

/** The `ha-form` schema shared by the create and display-settings dialogs. */
export const dashboardFormSchema = (
  display: DisplayFields = ALL_DISPLAY_FIELDS
): StudioFormSchema[] => [
  {
    name: "name",
    label: strings.fields.name,
    required: true,
    selector: { text: {} },
  },
  ...(display.size ? sizeFields() : []),
  ...(display.palettes.length > 1 ? paletteFields(display.palettes) : []),
  ...(display.backgrounds.length > 0
    ? backgroundFields(display.backgrounds)
    : []),
  ...rotationFields(),
  ...advancedFields(),
];

export const dashboardFormLabel = (entry: StudioFormSchema): string =>
  "label" in entry ? entry.label : (entry.title ?? "");

const ACCENTS: Partial<Record<PaletteId, string>> = {
  bwr: "#d32f2f",
  bwry: "#d32f2f",
  bwy: "#d6a800",
  spectra6: "#246bfd",
  seven_color: "#ff8000",
};

/** The colour a gallery miniature uses for its accent mark. */
export const dashboardAccent = (palette: PaletteId): string =>
  ACCENTS[palette] ?? "#202124";

/** Medium-style date of the last update, or an empty string when the stored value is not a date. */
export const dashboardDate = (
  dashboard: Dashboard,
  language: string
): string => {
  const date = new Date(dashboard.updatedAt);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(date);
};
