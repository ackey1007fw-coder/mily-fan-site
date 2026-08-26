import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonVoteMirrorStoryVideo.json" with { type: "json" };

/**
 * 2026-08-26 の Instagram Story（鏡自撮りと投票開始案内 / batch b27-02）。
 *
 * Latest / NEWS の代表メディアと Gallery がこの 1 オブジェクトを共有するので、
 * 公開MP4とposterが用途別に複製されない。
 * 恒久的な公開permalinkがないため `sourceLabel` は非リンクの label に留め、
 * `sourceUrl` は持たない。
 */
export const patonVoteMirrorStoryVideo = manifest as MorningStoryVideo;
