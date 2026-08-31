/**
 * 2026-08-31 本人X投稿の朝配信お礼SHOWROOM画面（batch b44-01）。
 * 確認済みの公開X投稿。みりぃが白・黄・青の花束を持ち微笑んでいる。
 * Gallery（media.ts）と NEWS `2026-08-31-morning-stream-thanks` の両方に載せる。
 * NEWS 代表は `/media/news/` の自己ホスト JPEG。
 * Gallery 派生は既存の `/media/gallery/` 480/960/1600。
 */
export const MORNING_STREAM_THANKS_X_URL =
  "https://x.com/Mily_chan36/status/2094192106105659650";

export const morningStreamThanksPhoto = {
  id: "mily-b44-01",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b44-01-morning-stream-thanks",
  widths: [480, 960, 1600] as const,
  // 元素材が 1262px 幅のため、`-1600` の派生は拡大せず 1262x2048 のまま。
  width: 1262,
  height: 2048,
  alt: "SHOWROOM配信画面で、白と黄と青の花束を持ち、濃いピンストライプのノースリーブで微笑むみりぃ。背景はベージュの壁。",
  caption: "2026年8月31日の本人X投稿。朝配信へのお礼。",
  provenance: "sns-post" as const,
  sourceUrl: MORNING_STREAM_THANKS_X_URL,
  sourceDate: "2026-08-31",
  credit: null,
  aspect: "1262 / 2048",
  published: true,
};

function gallerySrcSet(format: "jpg" | "webp"): string {
  return morningStreamThanksPhoto.widths
    .map((width) => `${morningStreamThanksPhoto.basePath}-${width}.${format} ${width}w`)
    .join(", ");
}

/** Latest / NEWS 代表。Gallery 派生とは別パス。 */
export const morningStreamThanksImage = {
  id: "mily-b44-01-morning-stream-thanks",
  kind: "image" as const,
  src: "/media/news/mily-b44-01-morning-stream-thanks.jpg",
  srcSet: gallerySrcSet("jpg"),
  webpSrcSet: gallerySrcSet("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 1262,
  height: 2048,
  alt: morningStreamThanksPhoto.alt,
  caption: morningStreamThanksPhoto.caption,
  provenance: "sns-post" as const,
  sourceUrl: MORNING_STREAM_THANKS_X_URL,
  sourceDate: "2026-08-31",
} as const;
