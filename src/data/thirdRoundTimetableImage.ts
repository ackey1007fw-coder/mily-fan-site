/**
 * 2026-09-02 三次審査 NEWS 用。オーナー提供の本人配布タイムテーブル。
 * 実写ポートレートではない。AI生成・再描画・再エンコードしていない。
 * 公開JPEGは元素材の lossless APP-strip（EXIF / IPTC / ICC / COM /
 * 作成時刻メタデータを除去）。画素は 1206×950 のまま。crop していない。
 * HOME Latest / `/news/` 専用。Gallery・media.ts・galleryVideos・`/stories/` には出さない。
 */
export const THIRD_ROUND_TIMETABLE_SRC =
  "/media/news/mily-b49-01-third-round-timetable.jpg";

export const thirdRoundTimetableImage = {
  id: "mily-b49-01-third-round-timetable",
  kind: "image" as const,
  src: THIRD_ROUND_TIMETABLE_SRC,
  width: 1206,
  height: 950,
  alt: "みりぃの配信タイムテーブル（ミスサークルコンテスト2026 3次審査）",
  caption: "本人配布の三次審査配信タイムテーブル。",
  published: true,
  provenance: "owner-provided" as const,
  sourceDate: "2026-09-02",
  sourceUrl: null,
} as const;
