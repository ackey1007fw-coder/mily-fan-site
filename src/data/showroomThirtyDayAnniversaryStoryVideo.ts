import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./showroomThirtyDayAnniversaryStoryVideo.json" with { type: "json" };

/**
 * 2026-08-30 の Instagram Story（SHOWROOM 30日連続配信記念日 / batch b44-04）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 画面内の7:30配信予定は投稿時点の記録であり、streamSchedule へは転記しない。
 */
export const showroomThirtyDayAnniversaryStoryVideo = manifest as MorningStoryVideo;
