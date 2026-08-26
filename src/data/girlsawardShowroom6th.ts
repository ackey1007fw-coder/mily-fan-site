/**
 * 2026-08-26 本人X投稿のガルアワイベ最終日お礼写真（batch b28-01）。
 * 確認済みの公開X投稿（Story閲覧スクレイプではない）。
 * Gallery（media.ts）と Latest / NEWS の両方に載せる。NEWS 代表は
 * `/media/news/` の自己ホスト JPEG。Gallery 派生は `pnpm media:build`
 * 済みの `/media/gallery/`。バイトは共有しない。
 */
export const GIRLSAWARD_SHOWROOM_6TH_X_URL =
  "https://x.com/Mily_chan36/status/2092621770406896106";

export const girlsawardShowroomSixthPhoto = {
  id: "mily-b28-01",
  kind: "photo" as const,
  basePath: "/media/gallery/mily-b28-01-girlsaward-showroom-6th",
  widths: [480, 960, 1600] as const,
  width: 1156,
  height: 2048,
  alt: "くま耳キラキラフィルターの自撮り、黄白ストライプのリボン／シュシュと紺（ネイビー）のポロ。",
  caption:
    "2026年8月26日の本人X投稿。ガルアワイベ最終日に6位で終われたことへのお礼。",
  provenance: "sns-post" as const,
  sourceUrl: GIRLSAWARD_SHOWROOM_6TH_X_URL,
  sourceDate: "2026-08-26",
  credit: null,
  aspect: "1156 / 2048",
  published: true,
};

/** Latest / NEWS 代表。Gallery 派生とは別ファイル（再エンコードしない）。 */
export const girlsawardShowroomSixthImage = {
  id: "mily-b28-01-girlsaward-showroom-6th",
  kind: "image" as const,
  src: "/media/news/mily-b28-01-girlsaward-showroom-6th.jpg",
  width: 1156,
  height: 2048,
  alt: "くま耳キラキラフィルターの自撮り、黄白ストライプのリボン／シュシュと紺（ネイビー）のポロ。",
  caption:
    "2026年8月26日の本人X投稿。ガルアワイベ最終日に6位で終われたことへのお礼。",
  provenance: "sns-post" as const,
  sourceUrl: GIRLSAWARD_SHOWROOM_6TH_X_URL,
  sourceDate: "2026-08-26",
} as const;
