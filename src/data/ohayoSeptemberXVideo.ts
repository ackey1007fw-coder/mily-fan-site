import type { MorningStoryVideo } from "./morningStoryVideo.ts";
import manifest from "./ohayoSeptemberXVideo.json" with { type: "json" };

/**
 * 2026-09-01 の本人Xあいさつ（おはよ〜 今日から9月ー）用の Latest / NEWS wrapper。
 *
 * 画面は既存 Instagram Story batch b46-02 と同じクリップ。公開MP4とposterは
 * `septemberMilyStoryVideo` と同一パスを指し、バイナリは複製しない。
 * Gallery / galleryVideos にはこのobjectを足さない（Story側の1本だけ残す）。
 * SNS CDN は参照しない。
 */
export const ohayoSeptemberXVideo = manifest as MorningStoryVideo & {
  sourceUrl: string;
};
