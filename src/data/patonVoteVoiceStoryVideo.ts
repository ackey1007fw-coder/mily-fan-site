import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonVoteVoiceStoryVideo.json" with { type: "json" };

/**
 * 2026-08-31 の Instagram Story（キャンパスガールズ2027出場中 /
 * Paton投票は9月1日まで / 31日は1.5倍 / 本人肉声 / batch b45-01）。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * オーナーが本人肉声の保持を明示依頼したため、公開派生でも AAC 音声を残す。
 */
export const patonVoteVoiceStoryVideo = manifest as MorningStoryVideo;
