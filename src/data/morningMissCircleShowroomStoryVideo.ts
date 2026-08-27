import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./morningMissCircleShowroomStoryVideo.json" with { type: "json" };

/**
 * 2026-08-27 の Instagram Story（14:00からのミスサーSHOWROOM配信案内 / batch b35）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 */
export const morningMissCircleShowroomStoryVideo =
  manifest as MorningStoryVideo;
