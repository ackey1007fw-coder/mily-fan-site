import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonVoteFirstPlaceStoryVideo.json" with { type: "json" };

/**
 * 2026-08-31 の Instagram Story（現在1位・102,700pt / 31日は1.5倍DAY / batch b44-02）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 1位と得点は投稿時点の記録であり、現在の順位を示すものではない。
 */
export const patonVoteFirstPlaceStoryVideo = manifest as MorningStoryVideo;
