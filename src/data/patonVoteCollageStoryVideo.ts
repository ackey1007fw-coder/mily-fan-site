import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonVoteCollageStoryVideo.json" with { type: "json" };

/**
 * 2026-08-26 の Instagram Story（CAMPUS GIRLS 2027 予選ファイナル毎日投票案内 / batch b27-01）。
 *
 * Latest / NEWS と Gallery がこの 1 オブジェクトを共有するので、
 * 公開MP4とposterが用途別に複製されない。
 * 恒久的な公開permalinkがないため `sourceLabel` は非リンクの label に留め、
 * `sourceUrl` は持たない。
 */
export const patonVoteCollageStoryVideo = manifest as MorningStoryVideo;
