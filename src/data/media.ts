/**
 * Photos and later videos. Keep this empty rather than adding unverified media.
 * Local photo files live in /public/media and must start with `mily-`.
 */
export type MediaKind = "photo" | "video";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  src: string;
  alt: string;
  caption?: string;
  source: string;
  featured?: boolean;
};

export const media: MediaItem[] = [];

export function featuredPhoto(items: MediaItem[] = media): MediaItem | undefined {
  return items.find((item) => item.kind === "photo" && item.featured);
}

export function visibleMedia(items: MediaItem[] = media): MediaItem[] {
  return [...items];
}
