/**
 * 2026-08-06 本人X投稿の白いポロ・ピース自撮り（batch b30-01）。
 * 確認済みの公開X投稿（Story閲覧スクレイプではない）。
 * Gallery（media.ts）と新しい NEWS `2026-08-06-ohayo-morning-stream` の両方に載せる。
 * NEWS 代表は `/media/news/` の自己ホスト JPEG。Gallery 派生は
 * `pnpm media:build` 済みの `/media/gallery/`。バイトは共有しない。
 */
export const OHAYO_WHITE_POLO_X_URL =
  "https://x.com/Mily_chan36/status/2085116769161896098";

export const ohayoWhitePoloPeacePhoto = {
  id: "mily-b30-01",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b30-01-ohayo-white-polo-peace",
  widths: [480, 960, 1600] as const,
  // 元素材が 1153px 幅のため、`-1600` の派生は拡大せず 1153x2048 のまま。
  width: 1153,
  height: 2048,
  alt: "白いポロシャツでピースをし、星のステッカーと「OHAYO」の文字が入ったみりぃの自撮り",
  caption: "2026年8月6日の本人X投稿。朝のあいさつと当日AM 10:00〜の配信案内。",
  provenance: "sns-post" as const,
  sourceUrl: OHAYO_WHITE_POLO_X_URL,
  sourceDate: "2026-08-06",
  credit: null,
  aspect: "1153 / 2048",
  published: true,
};

function gallerySrcSet(format: "jpg" | "webp"): string {
  return ohayoWhitePoloPeacePhoto.widths
    .map((width) => `${ohayoWhitePoloPeacePhoto.basePath}-${width}.${format} ${width}w`)
    .join(", ");
}

/** Latest / NEWS 代表。Gallery 派生とは別ファイル（再エンコードしない）。 */
export const ohayoWhitePoloPeaceImage = {
  id: "mily-b30-01-ohayo-white-polo-peace",
  kind: "image" as const,
  src: "/media/news/mily-b30-01-ohayo-white-polo-peace.jpg",
  srcSet: gallerySrcSet("jpg"),
  webpSrcSet: gallerySrcSet("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 1153,
  height: 2048,
  alt: ohayoWhitePoloPeacePhoto.alt,
  caption: ohayoWhitePoloPeacePhoto.caption,
  provenance: "sns-post" as const,
  sourceUrl: OHAYO_WHITE_POLO_X_URL,
  sourceDate: "2026-08-06",
} as const;
