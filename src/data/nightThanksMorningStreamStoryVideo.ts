import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./nightThanksMorningStreamStoryVideo.json" with { type: "json" };

/**
 * 2026-08-24 未明の Instagram Story（夜枠・ラジオへの感謝と朝配信案内 / batch b23）。
 *
 * Latest / NEWS と Gallery がこの 1 オブジェクトを共有するので、
 * 公開MP4とposterが用途別に複製されない。
 * 公開派生は視聴者アバター・表示名・コメント帯を覆った noviewers ファイルだけを指す。
 * 恒久的な公開permalinkがないため `sourceLabel` は非リンクの label に留め、
 * `sourceUrl` は持たない。
 */
export const nightThanksMorningStreamStoryVideo = manifest as MorningStoryVideo;
