import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./seasideCircleMusicalSpecialVideo.json" with { type: "json" };

/**
 * 2026-08-23 の湘南シーサイドサークル Instagram Story（batch b19）。
 *
 * NEWS / Gallery / STORY がこの 1 オブジェクトを共有するので、
 * 公開MP4とposterが用途別に複製されない。
 * みりぃ個人のInstagram Storyではない。恒久的な公開permalinkがないため
 * `sourceLabel` は非リンクの label に留める。
 */
export const seasideCircleMusicalSpecialVideo = manifest as MorningStoryVideo;
