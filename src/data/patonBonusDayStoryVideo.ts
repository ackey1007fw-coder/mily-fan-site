import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonBonusDayStoryVideo.json" with { type: "json" };

/**
 * 2026-08-31 の Instagram Story（Paton投票の今日・明日案内 / 1.5倍DAY / batch b44-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 */
export const patonBonusDayStoryVideo = manifest as MorningStoryVideo;
