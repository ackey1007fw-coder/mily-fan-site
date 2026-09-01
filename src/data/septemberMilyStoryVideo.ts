import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./septemberMilyStoryVideo.json" with { type: "json" };

/**
 * 2026-09-01 の Instagram Story（9月のみりぃもよろしくね / batch b46-02）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 画面は9月のあいさつで、コンテスト文言はない。元動画に音声ストリームが
 * ないため、公開派生も video-only。
 */
export const septemberMilyStoryVideo = manifest as MorningStoryVideo;
