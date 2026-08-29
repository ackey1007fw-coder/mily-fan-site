import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./nightStoryB41Video.json" with { type: "json" };

/**
 * 2026-08-28 の Instagram Story（22:00からのSHOWROOM夜配信案内 / batch b41-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 */
export const nightStoryB41Video = manifest as MorningStoryVideo;
