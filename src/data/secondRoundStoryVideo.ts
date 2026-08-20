import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./secondRoundStoryVideo.json" with { type: "json" };

/**
 * 2026-08-19 の「2次審査通過」を報告したInstagram Story（batch b09）。
 *
 * STORY 記事 `/stories/second-round-result-2026/` と Gallery の動画アーカイブが
 * この 1 オブジェクトを共有するので、公開MP4とposterが用途別に複製されない。
 * 恒久的な公開permalinkがないため `sourceLabel` は非リンクの label に留める。
 */
export const secondRoundStoryVideo = manifest as MorningStoryVideo;
