/**
 * 2026-08-18 本人X投稿のラジオ配信SHOWROOM画面（batch b32-01）。
 * 確認済みの公開X投稿。みりぃがゴディバのカップを持ち目を閉じて微笑んでいる。
 * Gallery（media.ts）と既存 NEWS `2026-08-18-evening-radio` の両方に載せる。
 * NEWS 代表は `/media/news/` の自己ホスト JPEG（ICC除去のため再エンコード）。
 * Gallery 派生は `pnpm media:build` 済みの `/media/gallery/`。バイトは共有しない。
 */
export const EVENING_RADIO_SHOWROOM_X_URL =
  "https://x.com/Mily_chan36/status/2089721650522820667";

export const eveningRadioShowroomPhoto = {
  id: "mily-b32-01",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b32-01-evening-radio-showroom",
  widths: [480, 960, 1600] as const,
  // 元素材が 1216px 幅のため、`-1600` の派生は拡大せず 1216x2048 のまま。
  width: 1216,
  height: 2048,
  alt: "SHOWROOM配信画面で、ゴディバのカップドリンクを両手に持ち目を閉じて微笑むみりぃ",
  caption: "2026年8月18日の本人X投稿。ラジオ配信へのお礼。",
  provenance: "sns-post" as const,
  sourceUrl: EVENING_RADIO_SHOWROOM_X_URL,
  sourceDate: "2026-08-18",
  credit: null,
  aspect: "1216 / 2048",
  published: true,
};

function gallerySrcSet(format: "jpg" | "webp"): string {
  return eveningRadioShowroomPhoto.widths
    .map((width) => `${eveningRadioShowroomPhoto.basePath}-${width}.${format} ${width}w`)
    .join(", ");
}

/** Latest / NEWS 代表。Gallery 派生とは別ファイル。 */
export const eveningRadioShowroomImage = {
  id: "mily-b32-01-evening-radio-showroom",
  kind: "image" as const,
  src: "/media/news/mily-b32-01-evening-radio-showroom.jpg",
  srcSet: gallerySrcSet("jpg"),
  webpSrcSet: gallerySrcSet("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 1216,
  height: 2048,
  alt: eveningRadioShowroomPhoto.alt,
  caption: eveningRadioShowroomPhoto.caption,
  provenance: "sns-post" as const,
  sourceUrl: EVENING_RADIO_SHOWROOM_X_URL,
  sourceDate: "2026-08-18",
} as const;
