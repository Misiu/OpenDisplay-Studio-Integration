import type {
  BootstrapResponse,
  ComposePreviewResponse,
  Dashboard,
  DisplayDevice,
  HomeAssistant,
  ReloadWidgetsResponse,
} from "./types";

/** The `opendisplay_studio/*` WebSocket commands, one function each. */

export const bootstrap = (hass: HomeAssistant): Promise<BootstrapResponse> =>
  hass.callWS<BootstrapResponse>({
    type: "opendisplay_studio/bootstrap",
    language: hass.language,
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

let iconNames: Promise<string[]> | undefined;

/** The icons the renderer can draw; asked for once, since the list is long and never changes. */
export const listIcons = (hass: HomeAssistant): Promise<string[]> => {
  iconNames ??= hass
    .callWS<{ icons: string[] }>({ type: "opendisplay_studio/list_icons" })
    .then((result) => result.icons);
  return iconNames;
};
