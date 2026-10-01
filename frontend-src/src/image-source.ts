/**
 * Where an image comes from, as the backend (`images.py`) understands it: a web address,
 * a camera or image entity, a file under `/local` (the `www` folder) or `/media/<source>/…`.
 */

export type ImageKind = "entity" | "web" | "file" | "other";

const ENTITY = /^(camera|image)\.[a-z0-9_]+$/;
const MEDIA_SOURCE = /^media-source:\/\/media_source\/([^/]+)\/(.+)$/;

/** What kind of source a stored value is. */
export const imageKind = (value: string): ImageKind => {
  if (ENTITY.test(value)) return "entity";
  if (/^https?:\/\//.test(value) || value.startsWith("data:")) return "web";
  if (value.startsWith("/local/") || value.startsWith("/media/")) return "file";
  return "other";
};

/**
 * The path of a file chosen in Home Assistant's media browser. Only files of the local
 * media sources can be read; anything else (a camera stream, a radio) gives `undefined`.
 */
export const mediaPath = (mediaContentId: string): string | undefined => {
  const match = MEDIA_SOURCE.exec(mediaContentId);
  return match
    ? `/media/${match[1]}/${decodeURIComponent(match[2])}`
    : undefined;
};
