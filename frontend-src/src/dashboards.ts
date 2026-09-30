import {
  PALETTE_COLORS,
  PALETTE_LABELS,
  profileById,
} from "./display-profiles";
import { strings } from "./strings";
import type { Dashboard, PaletteId, StudioFormSchema } from "./types";

export type DashboardSort = "updated" | "name";

/** The fields the create and display-settings forms edit. */
export interface DashboardFormData {
  name: string;
  width: number;
  height: number;
  palette: PaletteId;
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
  padding: dashboard.display.padding,
  snapSize: dashboard.display.snapSize,
});

/** Apply form edits to a copy of the dashboard; any edit makes the display "custom". */
export const dashboardFromForm = (
  dashboard: Dashboard,
  partial: Partial<DashboardFormData>
): Dashboard => {
  const value = { ...dashboardFormData(dashboard), ...partial };
  const next = structuredClone(dashboard);
  next.name = String(value.name);
  next.display.profileId = "custom";
  next.display.width = Math.round(Number(value.width) || 0);
  next.display.height = Math.round(Number(value.height) || 0);
  next.display.palette = value.palette in PALETTE_LABELS ? value.palette : "bw";
  next.display.padding = Math.round(Number(value.padding) || 0);
  next.display.snapSize = Math.round(Number(value.snapSize) || 0);
  if (!PALETTE_COLORS[next.display.palette].includes(next.display.background)) {
    next.display.background = "white";
  }
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

/** The `ha-form` schema shared by the create and display-settings dialogs. */
export const dashboardFormSchema = (): StudioFormSchema[] => [
  {
    name: "name",
    label: strings.fields.name,
    required: true,
    selector: { text: {} },
  },
  {
    name: "dimensions",
    type: "grid",
    flatten: true,
    schema: [
      {
        name: "width",
        label: strings.fields.width,
        required: true,
        selector: {
          number: {
            mode: "box",
            min: 64,
            max: 4096,
            unit_of_measurement: "px",
          },
        },
      },
      {
        name: "height",
        label: strings.fields.height,
        required: true,
        selector: {
          number: {
            mode: "box",
            min: 64,
            max: 4096,
            unit_of_measurement: "px",
          },
        },
      },
    ],
  },
  {
    name: "palette",
    label: strings.fields.palette,
    required: true,
    selector: {
      select: {
        mode: "dropdown",
        options: Object.entries(PALETTE_LABELS).map(([value, label]) => ({
          value,
          label,
        })),
      },
    },
  },
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

export const dashboardFormLabel = (entry: StudioFormSchema): string =>
  "label" in entry ? entry.label : (entry.title ?? "");

const ACCENTS: Partial<Record<PaletteId, string>> = {
  bwr: "#d32f2f",
  bwry: "#d32f2f",
  bwy: "#d6a800",
  spectra6: "#246bfd",
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
