import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./campusGirlsHoldSecondStoryVideo.json" with { type: "json" };

/**
 * 2026-08-30 の Instagram Story（キャンパスガールズ2027情報 / 2位を守り抜きたい / batch b43-02）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 */
export const campusGirlsHoldSecondStoryVideo = manifest as MorningStoryVideo;
