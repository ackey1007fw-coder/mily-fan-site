import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./oyasumilyStoryVideo.json" with { type: "json" };

/**
 * 2026-09-02 の Instagram Story（おやすみりぃ / 翌日9:00 SHOWROOM案内 /
 * batch b47-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 公開派生は video-only。9:00の案内はNEWS本文の引用に留め、
 * streamSchedule / events には転記しない。
 */
export const oyasumilyStoryVideo = manifest as MorningStoryVideo;
