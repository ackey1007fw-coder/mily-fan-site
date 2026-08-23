import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./seasideCircleMusicalSpecialVideo.json" with { type: "json" };

/**
 * 2026-08-23 の湘南シーサイドサークル Instagram Story（放送案内 / batch b19）。
 *
 * Gallery と STORY lead がこの 1 オブジェクトを共有するので、
 * 公開MP4とposterが用途別に複製されない。
 * Latest / NEWS の代表動画は後から届いた放送後お礼 Story（b21）側。
 * みりぃ個人のInstagram Storyではない。恒久的な公開permalinkがないため
 * `sourceLabel` は非リンクの label に留める。
 */
export const seasideCircleMusicalSpecialVideo = manifest as MorningStoryVideo;
