/**
 * Every piece of text the panel shows, in English. Elements and helpers import from here;
 * nothing else writes user-facing text. Strings with a value are functions.
 */

const size = (width: number, height: number): string => `${width} × ${height}`;

export const strings = {
  common: {
    cancel: "Cancel",
    close: "Close",
    size,
    sizeInPixels: (width: number, height: number): string =>
      `${size(width, height)} px`,
    milliseconds: (value: number): string => `${value.toFixed(1)} ms`,
  },

  commands: {
    undo: "Undo",
    redo: "Redo",
    delete: "Delete",
    hide: "Hide",
    show: "Show",
    lock: "Lock",
    unlock: "Unlock",
  },

  app: {
    loading: "Loading OpenDisplay Studio…",
    loadFailed: "Could not load OpenDisplay Studio",
    createFailed: "Could not create the dashboard",
    saveFailed: "Could not save the dashboard",
    deleteFailed: "Could not delete the dashboard",
    renameFailed: "Could not rename the dashboard",
    duplicateFailed: "Could not duplicate the dashboard",
    settingsFailed: "Could not update dashboard settings",
    previewFailed: "Could not render the preview",
    renameEmpty: "Dashboard name cannot be empty",
    discardChanges: "Discard unsaved dashboard changes?",
    unsupportedPrimitive: (type: string): string =>
      `Unsupported primitive type: ${type || "(empty)"}`,
    confirmRemoval: "Confirm removal",
    deleteElementTitle: (name: string): string => `Delete ${name}?`,
    deleteElementBody:
      "This removes the element from the dashboard. You can restore it with Undo.",
    deleteElement: "Delete element",
  },

  gallery: {
    title: "Dashboards",
    count: (count: number): string =>
      `${count} ${count === 1 ? "dashboard" : "dashboards"}`,
    newDashboard: "New dashboard",
    addDashboard: "Add dashboard",
    filters: "Dashboard filters",
    search: "Search dashboards",
    searchPlaceholder: "Search dashboards…",
    sort: "Sort",
    sortDashboards: "Sort dashboards",
    sortUpdated: "Last updated",
    sortName: "Name A–Z",
    savedDashboards: "Saved dashboards",
    noResults: "No dashboards found",
    noResultsHint: "Try a different search.",
    updated: (date: string): string => `Updated ${date}`,
    open: (name: string): string => `Open dashboard ${name}`,
    actionsFor: (name: string): string => `Dashboard actions for ${name}`,
    menuFor: (name: string): string => `Actions for ${name}`,
    renameField: (name: string): string => `Rename dashboard ${name}`,
    menu: {
      rename: "Rename",
      duplicate: "Duplicate",
      settings: "Display Settings",
      delete: "Delete",
    },
    deleteTitle: "Delete dashboard?",
    deleteBody: "and all of its elements will be permanently removed.",
    deleteWarning: "This action cannot be undone.",
    deleteAction: "Delete dashboard",
    deleting: "Deleting…",
    settingsTitle: "Display settings",
    settingsSave: "Save changes",
    saving: "Saving…",
  },

  newDashboard: {
    title: "New dashboard",
    subtitle: "Create a custom OpenDisplay canvas",
    startFrom: "Start from",
    sources: "Dashboard source",
    customSize: "Custom size",
    customSizeHint: "Set resolution and colors",
    fromDevice: "From OpenDisplay device",
    fromDeviceHint: "Coming later",
    create: "Create dashboard",
    creating: "Creating…",
  },

  header: {
    studio: "OpenDisplay Studio",
    dashboards: "Dashboards",
    name: "Dashboard name",
    view: "Dashboard view",
    design: "Design",
    code: "Code",
    setDraft: "Set Draft",
    setReady: "Set Ready",
    save: "Save",
    saving: "Saving…",
  },

  library: {
    title: "Library",
    heading: "Elements",
    expand: "Expand element catalog",
    collapse: "Collapse element catalog",
    search: "Search widgets and primitives",
    searchPlaceholder: "Search elements…",
    widgets: "Widgets",
    primitives: "Primitives",
    noWidgets: "No matching widgets",
    noPrimitives: "No matching primitives",
    entryHint: (description: string): string =>
      `${description} Click or drag to add.`,
  },

  structure: {
    title: "Structure",
    heading: "Elements",
    collapse: "Collapse inspector",
    empty: "Drag widgets or primitives onto the canvas.",
    widget: "Widget",
    reorderTitle: "Reorder layer",
    reorder: (name: string): string => `Reorder ${name}`,
  },

  inspector: {
    expand: "Expand inspector",
    rail: "Layers",
    resize: "Resize inspector",
    dashboard: "Dashboard",
    dashboardHint: "Display and canvas settings",
    display: "Display",
    displayType: "Display type",
    workingArea: "Working area",
    workingAreaHelp:
      "Padding defines the editable safe area. Snap aligns movement and resizing to pixel increments.",
    layout: "Layout",
    widgetSettings: "Widget settings",
    appearance: "Appearance",
    diagnostics: "Render diagnostics",
    deleteDashboard: "Delete dashboard",
    removeElement: "Remove element",
    locked: "Position is locked",
    unlock: "Unlock",
    unlockElement: "Unlock element position",
    kindWidget: "Widget",
    kindPrimitive: "ODL primitive",
    subtitle: (kind: string, locked: boolean): string =>
      `${kind} · ${locked ? "position locked" : "editable"}`,
    metrics: {
      queue: "Queue",
      data: "Data",
      compile: "Compile",
      render: "Render",
      encode: "Encode",
      total: "Total",
    },
  },

  canvas: {
    rendering: "Rendering…",
    previewAlt: "Authoritative rendered display preview",
    hidden: "Hidden",
    layers: (count: number): string => `${count} layers`,
    padding: (pixels: number): string => `Padding ${pixels}px`,
    snap: (pixels: number): string => `Snap ${pixels}px`,
    resizeHandle: (name: string, side: string): string =>
      `Resize ${name} from ${side}`,
    sides: {
      nw: "north west",
      n: "north",
      ne: "north east",
      e: "east",
      se: "south east",
      s: "south",
      sw: "south west",
      w: "west",
    },
  },

  zoom: {
    out: "Zoom out",
    in: "Zoom in",
    reset: "Reset",
    fit: "Fit",
    preset: (value: number): string => `${value}×`,
  },

  code: {
    eyebrow: "Generated output",
    title: "Generated ODL YAML",
    description: "Read-only output generated from the current dashboard.",
    copyLabel: "Copy generated ODL YAML",
    yaml: "Generated ODL YAML",
    copy: { idle: "Copy YAML", copied: "Copied", failed: "Copy failed" },
    status: {
      idle: "",
      copied: "YAML copied to clipboard",
      failed: "Clipboard access failed",
    },
  },

  /**
   * Labels of form and inspector fields. One entry per concept, shared by
   * every place that shows it.
   */
  fields: {
    name: "Dashboard name",
    width: "Width",
    height: "Height",
    palette: "Palette",
    background: "Background",
    advanced: "Advanced display options",
    padding: "Outer padding",
    snapSize: "Snap size",
    x: "X",
    y: "Y",
    innerPadding: "Inner padding",
  },

  /** The generic display offered when none of the catalogued panels fits. */
  customDisplay: { manufacturer: "Custom", name: "Custom display" },

  palettes: {
    bw: "Black / white",
    bwr: "Black / white / red",
    bwy: "Black / white / yellow",
    bwry: "Black / white / red / yellow",
    spectra6: "Spectra 6 · black / white / red / yellow / blue / green",
  },
} as const;
