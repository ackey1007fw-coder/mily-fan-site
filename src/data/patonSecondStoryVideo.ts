import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonSecondStoryVideo.json" with { type: "json" };

/**
 * 2026-09-02 の Instagram Story（Paton投票を2位で締められたお礼 /
 * batch b47-02）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 公開派生は video-only。投票は 2026-09-01 23:59 JST で終了済みのため
 * live の投票CTAは付けない。他出場者の名前はNEWS本文に出さない。
 */
export const patonSecondStoryVideo = manifest as MorningStoryVideo;
