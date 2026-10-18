import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./campusGirlsPatonFifteenXStoryVideo.json" with { type: "json" };

/**
 * 2026-09-18 朝の Instagram Story（CAMPUS GIRLS 2027 本選EX vol.1
 * Paton投票 本日1.5倍DAY / batch b128-01）。本人肉声あり。
 *
 * Latest / NEWS と Gallery がこの1オブジェクトを共有する。恒久的なStory
 * permalinkはないため、`sourceLabel`だけを持ち、`sourceUrl`は持たない。
 * 画面上の「本日1.5倍DAY」はStory表示の引用に留め、0:00–23:59の枠は
 * 作らない。
 */
export const campusGirlsPatonFifteenXStoryVideo = manifest as MorningStoryVideo;
