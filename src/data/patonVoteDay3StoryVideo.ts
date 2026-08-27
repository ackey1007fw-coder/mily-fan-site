import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./patonVoteDay3StoryVideo.json" with { type: "json" };

/**
 * 2026-08-28 の Instagram Story（Paton投票3日目案内 / batch b39-01）。
 *
 * 既存のPaton投票方法NEWSカードで再生し、カードの確認済み投票CTAを使う。
 * 通常のStory記事・Highlight・Gallery動画一覧には重複掲載しない。
 * 恒久的な公開permalinkがないため `sourceLabel` は非リンクのlabelに留め、
 * `sourceUrl` は持たない。
 */
export const patonVoteDay3StoryVideo = manifest as MorningStoryVideo;
