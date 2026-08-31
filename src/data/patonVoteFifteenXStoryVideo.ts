import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonVoteFifteenXStoryVideo.json" with { type: "json" };

/**
 * 2026-08-31 の Instagram Story（Paton投票1.5倍デーの緊急告知 / batch b44-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 */
export const patonVoteFifteenXStoryVideo = manifest as MorningStoryVideo;
