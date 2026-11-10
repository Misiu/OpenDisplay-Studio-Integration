import type {
  BootstrapResponse,
  ComposePreviewResponse,
  Dashboard,
  DisplayDevice,
  FontInfo,
  HomeAssistant,
  IconCatalog,
  GridLayout,
  ImportPlan,
  LayoutFrames,
  ReloadWidgetsResponse,
} from "./types";

/** The `opendisplay_studio/*` WebSocket commands, one function each. */

export const bootstrap = (hass: HomeAssistant): Promise<BootstrapResponse> =>
  hass.callWS<BootstrapResponse>({
    type: "opendisplay_studio/bootstrap",
    language: hass.language,
  });

/** Where the cells and regions of a layout are on a display, laid out by the backend. */
export const layoutFrames = (
  hass: HomeAssistant,
  display: { width: number; height: number; padding: number },
  layout: GridLayout
): Promise<LayoutFrames> =>
  hass.callWS<LayoutFrames>({
    type: "opendisplay_studio/layout_frames",
    width: display.width,
    height: display.height,
    padding: display.padding,
    layout,
  });

/** Loads the widget packages again, without restarting Home Assistant. */
export const reloadWidgets = (
  hass: HomeAssistant
): Promise<ReloadWidgetsResponse> =>
  hass.callWS<ReloadWidgetsResponse>({
    type: "opendisplay_studio/reload_widgets",
    language: hass.language,
  });

export const createDashboard = async (
  hass: HomeAssistant,
  dashboard: Dashboard
): Promise<Dashboard> => {
  const result = await hass.callWS<{ dashboard: Dashboard }>({
    type: "opendisplay_studio/create_dashboard",
    dashboard,
  });
  return result.dashboard;
};

export const updateDashboard = async (
  hass: HomeAssistant,
  dashboard: Dashboard
): Promise<Dashboard> => {
  const result = await hass.callWS<{ dashboard: Dashboard }>({
    type: "opendisplay_studio/update_dashboard",
    dashboard_id: dashboard.id,
    dashboard,
  });
  return result.dashboard;
};

export const deleteDashboard = async (
  hass: HomeAssistant,
  dashboardId: string
): Promise<void> => {
  await hass.callWS({
    type: "opendisplay_studio/delete_dashboard",
    dashboard_id: dashboardId,
  });
};

/** Renders a dashboard on the backend; the canvas shows exactly this image. */
export const composePreview = (
  hass: HomeAssistant,
  dashboard: Dashboard
): Promise<ComposePreviewResponse> =>
  hass.callWS<ComposePreviewResponse>({
    type: "opendisplay_studio/compose_preview",
    dashboard: structuredClone(dashboard),
  });

/** The OpenDisplay devices a new dashboard can take its size and colors from. */
export const listDevices = async (
  hass: HomeAssistant
): Promise<DisplayDevice[]> => {
  const result = await hass.callWS<{ devices: DisplayDevice[] }>({
    type: "opendisplay_studio/list_devices",
  });
  return result.devices;
};

/** Renders the dashboard as the device shows it and uploads it to the device. */
export const sendToDevice = async (
  hass: HomeAssistant,
  dashboard: Dashboard
): Promise<void> => {
  await hass.callWS({
    type: "opendisplay_studio/send_to_device",
    dashboard: structuredClone(dashboard),
  });
};

/** The file for a dashboard as the panel has it, saved or not. */
export const exportDashboard = async (
  hass: HomeAssistant,
  dashboard: Dashboard
): Promise<unknown> => {
  const result = await hass.callWS<{ file: unknown }>({
    type: "opendisplay_studio/export_dashboard",
    dashboard: structuredClone(dashboard),
  });
  return result.file;
};

/**
 * Checks a dashboard file against the display of the open dashboard and returns the
 * elements to import. `colorMap` says which color of the dashboard's palette each color
 * of the file becomes.
 */
export const prepareImport = (
  hass: HomeAssistant,
  file: unknown,
  display: Dashboard["display"],
  colorMap: Record<string, string> = {}
): Promise<ImportPlan> =>
  hass.callWS<ImportPlan>({
    type: "opendisplay_studio/prepare_import",
    file,
    display,
    colorMap,
  });

let iconCatalog: Promise<IconCatalog> | undefined;

/** The icons the renderer can draw; asked for once, since the list is long and never changes. */
export const listIcons = (hass: HomeAssistant): Promise<IconCatalog> => {
  iconCatalog ??= hass
    .callWS<{ icons: string[]; glyphs: Record<string, number> }>({
      type: "opendisplay_studio/list_icons",
    })
    .then((result) => ({
      names: result.icons,
      glyphs: Object.fromEntries(
        Object.entries(result.glyphs).map(([name, code]) => [
          name,
          String.fromCodePoint(code),
        ])
      ),
    }));
  return iconCatalog;
};

/** Every font with a picture of it and the dashboards that use it. */
export const listFonts = async (hass: HomeAssistant): Promise<FontInfo[]> => {
  const result = await hass.callWS<{ fonts: FontInfo[] }>({
    type: "opendisplay_studio/list_fonts",
  });
  return result.fonts;
};

/** Installs a font file, given as base64, and returns the fonts there are now. */
export const installFont = async (
  hass: HomeAssistant,
  filename: string,
  data: string
): Promise<FontInfo[]> => {
  const result = await hass.callWS<{ fonts: FontInfo[] }>({
    type: "opendisplay_studio/install_font",
    filename,
    data,
  });
  return result.fonts;
};

/**
 * Removes an installed font and returns the fonts there are now. Without `force` the
 * backend keeps a font that dashboards still use and says so.
 */
export const deleteFont = async (
  hass: HomeAssistant,
  name: string,
  force: boolean
): Promise<FontInfo[]> => {
  const result = await hass.callWS<{ fonts: FontInfo[] }>({
    type: "opendisplay_studio/delete_font",
    name,
    force,
  });
  return result.fonts;
};
