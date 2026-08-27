import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./seasideCircleMovieThemeStoryVideo.json" with { type: "json" };

/**
 * 2026-08-27 の本人 Instagram Story（湘南シーサイドサークルの
 * 8月30日「映画」テーマ生放送案内を再共有 / batch b36）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 */
export const seasideCircleMovieThemeStoryVideo =
  manifest as MorningStoryVideo;
