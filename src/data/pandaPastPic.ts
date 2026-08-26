/**
 * 2026-08-05 本人X投稿のパンダ耳自撮り（batch b31-01）。
 * 確認済みの公開X投稿。画像に「※過去pic」とあり、投稿時点の新撮ではない。
 * Gallery（media.ts）と新しい NEWS `2026-08-05-panda-past-pic` の両方に載せる。
 * NEWS 代表は `/media/news/` の自己ホスト JPEG。Gallery 派生は
 * `pnpm media:build` 済みの `/media/gallery/`。バイトは共有しない。
 */
export const PANDA_PAST_PIC_X_URL =
  "https://x.com/Mily_chan36/status/2084752452373680152";

export const pandaPastPicPhoto = {
  id: "mily-b31-01",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b31-01-panda-past-pic",
  widths: [480, 960, 1600] as const,
  // 元素材が 1153px 幅のため、`-1600` の派生は拡大せず 1153x2048 のまま。
  width: 1153,
  height: 2048,
  alt: "パンダ耳と鼻のフィルター、顔のグリッター、「おはよう」「※過去pic」の文字が入ったみりぃの自撮り",
  caption:
    "2026年8月5日の本人X投稿。画像に「※過去pic」とあり、投稿時点の新しい撮影ではない。",
  provenance: "sns-post" as const,
  sourceUrl: PANDA_PAST_PIC_X_URL,
  sourceDate: "2026-08-05",
  credit: null,
  aspect: "1153 / 2048",
  published: true,
};

function gallerySrcSet(format: "jpg" | "webp"): string {
  return pandaPastPicPhoto.widths
    .map((width) => `${pandaPastPicPhoto.basePath}-${width}.${format} ${width}w`)
    .join(", ");
}

/** Latest / NEWS 代表。Gallery 派生とは別ファイル（再エンコードしない）。 */
export const pandaPastPicImage = {
  id: "mily-b31-01-panda-past-pic",
  kind: "image" as const,
  src: "/media/news/mily-b31-01-panda-past-pic.jpg",
  srcSet: gallerySrcSet("jpg"),
  webpSrcSet: gallerySrcSet("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 1153,
  height: 2048,
  alt: pandaPastPicPhoto.alt,
  caption: pandaPastPicPhoto.caption,
  provenance: "sns-post" as const,
  sourceUrl: PANDA_PAST_PIC_X_URL,
  sourceDate: "2026-08-05",
} as const;
