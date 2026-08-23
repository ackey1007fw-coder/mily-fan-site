import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./seasideCircleMusicalSpecialThanksVideo.json" with { type: "json" };

/**
 * 2026-08-23 の湘南シーサイドサークル Instagram Story（放送後お礼 / batch b21）。
 *
 * Latest / NEWS・Gallery・STORY closing がこの 1 オブジェクトを共有するので、
 * 公開MP4とposterが用途別に複製されない。
 * みりぃ個人のInstagram Storyではない。恒久的な公開permalinkがないため
 * `sourceLabel` は非リンクの label に留め、`sourceUrl` は持たない。
 */
export const seasideCircleMusicalSpecialThanksVideo = manifest as MorningStoryVideo;
