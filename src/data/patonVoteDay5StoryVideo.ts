import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonVoteDay5StoryVideo.json" with { type: "json" };

/**
 * 2026-08-29 の Instagram Story（日付が変わる前のPaton投票5日目案内 / batch b43-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 */
export const patonVoteDay5StoryVideo = manifest as MorningStoryVideo;
