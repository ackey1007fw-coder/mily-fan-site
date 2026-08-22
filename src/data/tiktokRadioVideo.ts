import type { DriveGalleryVideo } from "./driveGallery";
import manifest from "./tiktokRadioVideo.json" with { type: "json" };

/**
 * 2026-08-21のTikTok通常投稿に使われた、オーナー提供の短尺動画（batch b15）。
 * LatestとGalleryがこの1オブジェクトを共有し、公開MP4とposterを複製しない。
 */
export type TikTokRadioVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceUrl: string;
  sourceDate: string;
  published: boolean;
};

export const tiktokRadioVideo = manifest as TikTokRadioVideo;
