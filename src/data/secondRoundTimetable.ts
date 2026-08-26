/**
 * 2026-08-08 本人X投稿の2次審査期間配信スケジュール案内グラフィック
 * （batch b34-01）。実写ポートレートではない。新しい NEWS 専用。
 * Gallery・`/stories/`・highlights には出さない。配信時刻は画像の案内であり、
 * `events.ts` / `streamSchedule.ts` には転記しない。
 */
export const SECOND_ROUND_TIMETABLE_X_URL =
  "https://x.com/Mily_chan36/status/2086092518719140028";

export const secondRoundTimetableImage = {
  id: "mily-b34-01-second-round-timetable",
  kind: "image" as const,
  src: "/media/news/mily-b34-01-second-round-timetable.jpg",
  width: 1149,
  height: 1369,
  alt: "ミスサークルコンテスト2026 2次審査期間のみりぃの配信スケジュール案内グラフィック",
  caption: "2026年8月8日の本人X投稿。2次審査期間の配信スケジュール案内。",
  provenance: "sns-post" as const,
  sourceUrl: SECOND_ROUND_TIMETABLE_X_URL,
  sourceDate: "2026-08-08",
} as const;
