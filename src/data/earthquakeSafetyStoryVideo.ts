import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./earthquakeSafetyStoryVideo.json" with { type: "json" };

/**
 * 2026-08-23 の地震後に投稿された Instagram Story（batch b18）。
 *
 * Latest の既存地震NEWSと Gallery の動画アーカイブがこの 1 オブジェクトを共有する。
 * 恒久的な公開permalinkがないため `sourceLabel` は非リンクの label に留める。
 */
export const earthquakeSafetyStoryVideo = manifest as MorningStoryVideo;
