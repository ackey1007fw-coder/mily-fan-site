/**
 * 2026-08-21 本人X「急遽なガンダ」投稿のキャップ＋マスク写真。
 * NEWS `2026-08-21-after-afternoon-ganda` の自己ホスト JPEG（720×1280）は
 * 既存のまま上書きしない。Gallery は同じツイート写真のより大きい orig
 *（1162×2048）から `pnpm media:build` した派生。NEWS 表示は Gallery srcset。
 */
export const GANDA_BEFORE_NIGHT_STREAM_X_URL =
  "https://x.com/mily_chan36/status/2090722156162478273";

export const gandaBeforeNightStreamPhoto = {
  id: "mily-b14-01",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b14-01-ganda-before-night-stream",
  widths: [480, 960, 1600] as const,
  // Gallery 用 orig が 1162px 幅のため、`-1600` は拡大せず 1162x2048 のまま。
  width: 1162,
  height: 2048,
  alt: "黒いキャップとマスク姿で、青空と太陽を背に見上げる構図のみりぃ。写真内に昼枠配信と23:00からの配信についての文字が表示されている",
  caption: "2026年8月21日の本人X投稿。急遽なガンダの一枚。",
  provenance: "sns-post" as const,
  sourceUrl: GANDA_BEFORE_NIGHT_STREAM_X_URL,
  sourceDate: "2026-08-21",
  credit: null,
  aspect: "1162 / 2048",
  published: true,
};

function gallerySrcSet(format: "jpg" | "webp"): string {
  return gandaBeforeNightStreamPhoto.widths
    .map((width) => `${gandaBeforeNightStreamPhoto.basePath}-${width}.${format} ${width}w`)
    .join(", ");
}

/**
 * 既存 NEWS JPEG は 720×1280 のまま fallback `src`。
 * 表示は Gallery 480/960/1600 srcset。ファイルは複製していない。
 */
export const gandaBeforeNightStreamImage = {
  id: "mily-b14-01-ganda-before-night-stream",
  kind: "image" as const,
  src: "/media/news/mily-b14-01-ganda-before-night-stream.jpg",
  srcSet: gallerySrcSet("jpg"),
  webpSrcSet: gallerySrcSet("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 720,
  height: 1280,
  alt: gandaBeforeNightStreamPhoto.alt,
  caption: gandaBeforeNightStreamPhoto.caption,
  provenance: "sns-post" as const,
  sourceUrl: GANDA_BEFORE_NIGHT_STREAM_X_URL,
  sourceDate: "2026-08-21",
} as const;
