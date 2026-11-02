import type { FontInfo, HomeAssistant } from "./types";

/** Where the integration gives the panel the files of its fonts. */
const FONT_URL = "/api/opendisplay_studio/fonts";
const ICON_FONT_URL = "/api/opendisplay_studio/icon-font";

/** The family the icons are drawn in. */
export const ICON_FONT_FAMILY = "ods-mdi";

const loading = new Map<string, Promise<string | undefined>>();

/** The name a font is registered under in the browser; a new file gets a new name. */
export const faceName = (font: FontInfo): string =>
  `ods-font-${font.name.replace(/[^A-Za-z0-9_-]/g, "_")}-${font.version}`;

export const fontUrl = (font: FontInfo): string =>
  `${FONT_URL}/${encodeURIComponent(font.name)}?v=${font.version}`;

/** Fetches a font file as the logged-in user and registers it for the whole page. */
const register = async (
  hass: HomeAssistant,
  family: string,
  url: string
): Promise<string | undefined> => {
  if (!hass.fetchWithAuth) return undefined;
  try {
    const response = await hass.fetchWithAuth(url);
    if (!response.ok) return undefined;
    const face = new FontFace(family, await response.arrayBuffer());
    await face.load();
    document.fonts.add(face);
    return family;
  } catch {
    // A file the browser cannot read leaves the text in the font around it.
    return undefined;
  }
};

const registerOnce = (
  hass: HomeAssistant,
  family: string,
  url: string
): Promise<string | undefined> => {
  let face = loading.get(family);
  if (!face) {
    face = register(hass, family, url);
    loading.set(family, face);
  }
  return face;
};

/**
 * Loads a font, once, so text can be written in it with `font-family`. Resolves to the
 * family to use, or to nothing when the font could not be loaded.
 */
export const loadFontFace = (
  hass: HomeAssistant,
  font: FontInfo
): Promise<string | undefined> =>
  registerOnce(hass, faceName(font), fontUrl(font));

/** Loads the font the renderer draws icons with: each icon is one character of it. */
export const loadIconFont = (
  hass: HomeAssistant
): Promise<string | undefined> =>
  registerOnce(hass, ICON_FONT_FAMILY, ICON_FONT_URL);
