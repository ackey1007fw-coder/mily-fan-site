import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonVoteFinalDayStoryVideo.json" with { type: "json" };

/**
 * 2026-09-01 の Instagram Story（おはよう / 今日はパトン投票最終日 /
 * batch b46-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 元動画に音声ストリームがないため、公開派生も video-only。
 */
export const patonVoteFinalDayStoryVideo = manifest as MorningStoryVideo;
