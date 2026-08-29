import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonVoteDay4StoryVideo.json" with { type: "json" };

/**
 * 2026-08-29 の Instagram Story（Paton投票4日目の案内 / batch b41-02）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 */
export const patonVoteDay4StoryVideo = manifest as MorningStoryVideo;
