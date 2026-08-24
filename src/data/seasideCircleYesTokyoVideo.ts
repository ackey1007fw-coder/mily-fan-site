import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./seasideCircleYesTokyoVideo.json" with { type: "json" };

/**
 * 2026-08-24 の湘南シーサイドサークル Instagram（@seasidecircle）
 * 「Yes!東京」踊ってみた動画（batch b25）。
 *
 * Latest / NEWS と Gallery がこの 1 オブジェクトを共有するので、
 * 公開MP4とposterが用途別に複製されない。
 * みりぃ個人のInstagram投稿ではない。恒久的な公開permalinkが未確認のため
 * `sourceLabel` は非リンクの label に留め、`sourceUrl` は持たない。
 */
export const seasideCircleYesTokyoVideo = manifest as MorningStoryVideo;
