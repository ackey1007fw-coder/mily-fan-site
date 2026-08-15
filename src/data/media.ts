/**
 * Photo / video manifest.
 *
 * - Derivative files live in /public/media/gallery as
 *   `<basePath>-<width>.jpg` and `.webp`. Originals stay outside the
 *   repository (media/original/, gitignored) and are never overwritten.
 * - Filenames start with `milly-` (two l). Once published, a filename is
 *   immutable — changed content gets a new name.
 * - sourceUrl / sourceDate / credit hold confirmed values only.
 *   Keep them null rather than guessing; docs/MEDIA.md tracks what is
 *   still unconfirmed.
 */
export type MediaKind = "photo" | "video";

export type MediaProvenance =
  /** Received directly from the site owner. */
  | "owner-provided"
  /** From a confirmed post on みりぃさん's own SNS (sourceUrl required). */
  | "sns-post"
  /** Shot by a third party (credit required). */
  | "third-party";

export type MediaItem = {
  /** Stable id, never reused. */
  id: string;
  kind: MediaKind;
  /** Public path prefix, e.g. "/media/gallery/milly-b01-03-bouquet-smile". */
  basePath: string;
  /** Derivative widths in px, ascending. */
  widths: readonly number[];
  /** Intrinsic size of the largest derivative (for width/height attrs). */
  width: number;
  height: number;
  alt: string;
  caption?: string;
  provenance: MediaProvenance;
  sourceUrl: string | null;
  /** Confirmed post date, `YYYY-MM-DD`. Never inferred from the image. */
  sourceDate: string | null;
  credit: string | null;
  /** CSS object-position keeping the subject in frame when cropped. */
  focal?: string;
  featured?: boolean;
  published: boolean;
};

export const media: MediaItem[] = [
  {
    id: "milly-b01-03",
    kind: "photo",
    basePath: "/media/gallery/milly-b01-03-bouquet-smile",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "花束と緑のバッグを持ち、笑顔でカメラを見るみりぃさん",
    provenance: "owner-provided",
    sourceUrl: null,
    sourceDate: null,
    credit: null,
    focal: "49% 28%",
    featured: true,
    published: true,
  },
  {
    id: "milly-b01-05",
    kind: "photo",
    basePath: "/media/gallery/milly-b01-05-bouquet-closeup",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "水色の紙に包まれた花束を抱えるみりぃさん",
    provenance: "owner-provided",
    sourceUrl: null,
    sourceDate: null,
    credit: null,
    focal: "48% 26%",
    published: true,
  },
  {
    id: "milly-b01-02",
    kind: "photo",
    basePath: "/media/gallery/milly-b01-02-bouquet-standing",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "花束を両手に持って立つみりぃさん",
    provenance: "owner-provided",
    sourceUrl: null,
    sourceDate: null,
    credit: null,
    focal: "52% 26%",
    published: true,
  },
  {
    id: "milly-b01-06",
    kind: "photo",
    basePath: "/media/gallery/milly-b01-06-necklace-gift",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "ジュエリーボックスに入ったCanal 4℃のネックレス",
    caption: "Canal 4℃のネックレス",
    provenance: "owner-provided",
    sourceUrl: null,
    sourceDate: null,
    credit: null,
    published: true,
  },
];

export function srcSetFor(item: MediaItem, format: "jpg" | "webp"): string {
  return item.widths
    .map((width) => `${item.basePath}-${width}.${format} ${width}w`)
    .join(", ");
}

export function defaultSrc(item: MediaItem): string {
  const middle = item.widths[Math.min(1, item.widths.length - 1)];
  return `${item.basePath}-${middle}.jpg`;
}

export function visibleMedia(items: MediaItem[] = media): MediaItem[] {
  return items.filter((item) => item.published);
}

export function featuredPhoto(items: MediaItem[] = media): MediaItem | undefined {
  return visibleMedia(items).find(
    (item) => item.kind === "photo" && item.featured,
  );
}
