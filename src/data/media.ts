/**
 * Photo / video manifest.
 *
 * - Derivative files live in /public/media/gallery as
 *   `<basePath>-<width>.jpg` and `.webp`. Originals stay outside the
 *   repository (media/original/, gitignored) and are never overwritten.
 * - Filenames start with `mily-` — Mily is 本人の公開表記 (Instagram
 *   @mily_chan36), not a typo. Once published, a filename is immutable —
 *   changed content gets a new name.
 * - Daily add flow: docs/CONTENT-OPS.md and docs/MEDIA.md.
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
  /** Public path prefix, e.g. "/media/gallery/mily-b01-03-bouquet-smile". */
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
  /**
   * CSS aspect-ratio for the gallery tile, e.g. "1152 / 2048".
   * Omit for the default 4/3 tile. Set it on portrait photos so the
   * composition is kept instead of being cropped to landscape.
   */
  aspect?: string;
  featured?: boolean;
  published: boolean;
};

const BIRTHDAY_POST = "https://www.instagram.com/p/DbiY3PHk1c8/";

export const media: MediaItem[] = [
  {
    id: "mily-b08-01",
    kind: "photo",
    basePath: "/media/gallery/mily-b08-01-do-what-you-can-morning",
    // 元素材が 1538px 幅のため、`-1600` の派生は拡大せず 1538x2048 のまま。
    // （`pnpm media:build` は withoutEnlargement で元素材幅を上限にする）
    widths: [480, 960, 1600],
    width: 1538,
    height: 2048,
    alt: "室内の鏡の前でスマートフォンを持って撮影するみりぃ",
    provenance: "owner-provided",
    sourceUrl: "https://x.com/mily_chan36/status/2090242507586322892",
    sourceDate: "2026-08-20",
    credit: null,
    aspect: "1538 / 2048",
    published: true,
  },
  {
    id: "mily-b05-01",
    kind: "photo",
    basePath: "/media/gallery/mily-b05-01-autumn-leaf",
    // 元素材が 1152px 幅のため、`-1600` の派生は拡大せず 1152x2048 のまま。
    // （`pnpm media:build` は withoutEnlargement で元素材幅を上限にする）
    widths: [480, 960, 1600],
    width: 1152,
    height: 2048,
    alt: "夜の並木道で、大きな落ち葉を手に持つみりぃさん",
    provenance: "owner-provided",
    sourceUrl: null,
    sourceDate: null,
    credit: null,
    aspect: "1152 / 2048",
    published: true,
  },
  {
    id: "mily-b01-03",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-03-bouquet-smile",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "花束と緑のバッグを持ち、笑顔でカメラを見るみりぃさん",
    caption: "21歳の誕生日投稿より",
    provenance: "sns-post",
    sourceUrl: BIRTHDAY_POST,
    sourceDate: null,
    credit: null,
    focal: "49% 28%",
    featured: true,
    published: true,
  },
  {
    id: "mily-b01-05",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-05-bouquet-closeup",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "水色の紙に包まれた花束を抱えるみりぃさん",
    provenance: "sns-post",
    sourceUrl: BIRTHDAY_POST,
    sourceDate: null,
    credit: null,
    focal: "48% 26%",
    published: true,
  },
  {
    id: "mily-b01-02",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-02-bouquet-standing",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "花束を両手に持って立つみりぃさん",
    provenance: "sns-post",
    sourceUrl: BIRTHDAY_POST,
    sourceDate: null,
    credit: null,
    focal: "52% 26%",
    published: true,
  },
  {
    id: "mily-b01-04",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-04-bouquet-pose",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "花束と緑のバッグを持って壁の前に立つみりぃさん",
    provenance: "sns-post",
    sourceUrl: BIRTHDAY_POST,
    sourceDate: null,
    credit: null,
    focal: "49% 26%",
    published: true,
  },
  {
    id: "mily-b01-06",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-06-necklace-gift",
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
  {
    id: "mily-b01-01",
    kind: "photo",
    basePath: "/media/gallery/mily-b01-01-birthday-cake",
    widths: [480, 960, 1600],
    width: 1600,
    height: 1200,
    alt: "ハートで飾られたプレートに載ったバースデーケーキと、2つの花束",
    caption: "誕生日のテーブル",
    provenance: "sns-post",
    sourceUrl: BIRTHDAY_POST,
    sourceDate: null,
    credit: null,
    focal: "50% 70%",
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
