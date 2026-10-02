/**
 * Where an image comes from, as the backend (`images.py`) understands it: a web address,
 * a camera or image entity, a file under `/local` (the `www` folder), `/media/<source>/…`,
 * or any media source that is a file on this machine (`media-source://image_upload/…`).
 */

export type ImageKind = "entity" | "web" | "file" | "other";

const ENTITY = /^(camera|image)\.[a-z0-9_]+$/;
const LOCAL_MEDIA = /^media-source:\/\/media_source\/([^/]+)\/(.+)$/;
const MEDIA_SOURCE_PREFIX = "media-source://";

/** What kind of source a stored value is. */
export const imageKind = (value: string): ImageKind => {
  if (ENTITY.test(value)) return "entity";
  if (/^https?:\/\//.test(value) || value.startsWith("data:")) return "web";
  if (value.startsWith("/local/") || value.startsWith("/media/")) return "file";
  if (value.startsWith(MEDIA_SOURCE_PREFIX)) return "file";
  return "other";
};

/**
 * What to store for an item chosen in Home Assistant's media browser. A file of a local
 * media source is stored as its path, which also reads well; any other source (Image
 * upload, …) as its media source address, which the backend resolves to a file. Whether
 * a source has a file to draw is the backend's to say: it reports it as a warning.
 */
export const mediaReference = (mediaContentId: string): string | undefined => {
  const local = LOCAL_MEDIA.exec(mediaContentId);
  if (local) return `/media/${local[1]}/${decodeURIComponent(local[2])}`;
  return mediaContentId.startsWith(MEDIA_SOURCE_PREFIX)
    ? mediaContentId
    : undefined;
};
