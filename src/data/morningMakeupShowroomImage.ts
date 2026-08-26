/**
 * 2026-08-24 朝のSHOWROOMメイク配信画面。本人X投稿のビジュアル。
 * NEWS の代表画像（lead media）として Latest / /news/ / Portal Feed に出る。
 * NEWS が live-stream に関連付いているため、他のNEWS代表画像と同じく
 * /activities/live/ の「関連するメディア」にも自動で出る（selectActivityMedia）。
 * 公開用metadata除去以外はcrop・mask・scaleなしで元画像の見た目を維持。
 * NEWS JPEG は既存のまま上書きしない。Gallery は同じ公開 JPEG から
 * `pnpm media:build` した派生。b24-02 Story 画像は Gallery に出さない。
 */
export const MORNING_MAKEUP_SHOWROOM_X_URL =
  "https://x.com/mily_chan36/status/2091668215919444138";

export const morningMakeupShowroomPhoto = {
  id: "mily-b24-01",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b24-01-morning-makeup-showroom",
  widths: [480, 960, 1600] as const,
  // 公開 NEWS JPEG が 1500px 幅のため、`-1600` は拡大せず 1500x691 のまま。
  width: 1500,
  height: 691,
  alt: "朝のSHOWROOMメイク配信で笑顔で手を振る三橋莉子さん",
  caption:
    "2026年8月24日朝のSHOWROOMメイク配信。花火大会仕様のフレームのなか、みりぃが笑顔で両手を振っている。",
  provenance: "owner-provided" as const,
  sourceUrl: MORNING_MAKEUP_SHOWROOM_X_URL,
  sourceDate: "2026-08-24",
  credit: null,
  aspect: "1500 / 691",
  published: true,
};

function gallerySrcSet(format: "jpg" | "webp"): string {
  return morningMakeupShowroomPhoto.widths
    .map((width) => `${morningMakeupShowroomPhoto.basePath}-${width}.${format} ${width}w`)
    .join(", ");
}

export const morningMakeupShowroomImage = {
  id: "mily-b24-01-morning-makeup-showroom",
  kind: "image" as const,
  src: "/media/news/mily-b24-01-morning-makeup-showroom.jpg",
  srcSet: gallerySrcSet("jpg"),
  webpSrcSet: gallerySrcSet("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 1500,
  height: 691,
  alt: morningMakeupShowroomPhoto.alt,
  caption: morningMakeupShowroomPhoto.caption,
  provenance: "owner-provided",
  sourceUrl: MORNING_MAKEUP_SHOWROOM_X_URL,
  sourceDate: "2026-08-24",
} as const;
