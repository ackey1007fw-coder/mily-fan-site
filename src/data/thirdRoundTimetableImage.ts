/**
 * 2026-09-02 三次審査 NEWS 用。オーナー提供の本人配布タイムテーブル。
 * 実写ポートレートではない。AI生成・再描画・再エンコードしていない。
 * HOME Latest / `/news/` 専用。Gallery・media.ts・galleryVideos・`/stories/` には出さない。
 * 公開パスは元素材 JPEG の実寸 1206×950 のまま。
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
