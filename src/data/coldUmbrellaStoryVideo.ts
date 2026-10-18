import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./coldUmbrellaStoryVideo.json" with { type: "json" };

/**
 * 2026-09-20 の Instagram Story（銀の傘・くまフィルター / batch b135-01）。
 * 元素材に音声ストリームはない。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 同じ日のX投稿は NEWS の additionalSources であり、この動画の出典URLではない。
 */
export const coldUmbrellaStoryVideo = manifest as MorningStoryVideo;
