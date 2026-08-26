/**
 * 2026-08-02 本人X投稿の21歳誕生日・室内セルフィー（batch b29-01）。
 * 確認済みの公開X投稿（Story閲覧スクレイプではない）。
 * Gallery（media.ts）と既存 NEWS `2026-08-02-21st-birthday` の両方に載せる。
 * NEWS 代表は `/media/news/` の自己ホスト JPEG。Gallery 派生は
 * `pnpm media:build` 済みの `/media/gallery/`。バイトは共有しない。
 * NEWS の出典 / CTA は既存の Instagram 投稿のまま。
 */
export const BIRTHDAY_INDOOR_SELFIE_X_URL =
  "https://x.com/Mily_chan36/status/2083679191892115846";

export const birthdayIndoorSelfiePhoto = {
  id: "mily-b29-01",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b29-01-birthday-indoor-selfie",
  widths: [480, 960, 1600] as const,
  // 元素材が 1536px 幅のため、`-1600` の派生は拡大せず 1536x2048 のまま。
  width: 1536,
  height: 2048,
  alt: "クローゼットの前で、ピンストライプのノースリーブを着て横を向き微笑むみりぃ",
  caption: "2026年8月2日の本人X投稿。21歳の誕生日の朝。",
  provenance: "sns-post" as const,
  sourceUrl: BIRTHDAY_INDOOR_SELFIE_X_URL,
  sourceDate: "2026-08-02",
  credit: null,
  aspect: "1536 / 2048",
  published: true,
};

function gallerySrcSet(format: "jpg" | "webp"): string {
  return birthdayIndoorSelfiePhoto.widths
    .map((width) => `${birthdayIndoorSelfiePhoto.basePath}-${width}.${format} ${width}w`)
    .join(", ");
}

/** Latest / NEWS 代表。Gallery 派生とは別ファイル（再エンコードしない）。
 *  表示は既存 Gallery 480/960/1600 を srcset で出し、NEWS JPEG は fallback `src`。 */
export const birthdayIndoorSelfieImage = {
  id: "mily-b29-01-birthday-indoor-selfie",
  kind: "image" as const,
  src: "/media/news/mily-b29-01-birthday-indoor-selfie.jpg",
  srcSet: gallerySrcSet("jpg"),
  webpSrcSet: gallerySrcSet("webp"),
  sizes: "(min-width: 640px) 24rem, 100vw",
  width: 1536,
  height: 2048,
  alt: "クローゼットの前で、ピンストライプのノースリーブを着て横を向き微笑むみりぃ",
  caption: "2026年8月2日の本人X投稿。21歳の誕生日の朝。",
  provenance: "sns-post" as const,
  sourceUrl: BIRTHDAY_INDOOR_SELFIE_X_URL,
  sourceDate: "2026-08-02",
} as const;
