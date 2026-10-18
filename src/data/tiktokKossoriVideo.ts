import type { DriveGalleryVideo } from "./driveGallery";
import manifest from "./tiktokKossoriVideo.json" with { type: "json" };

/**
 * 2026-09-16のTikTok通常投稿に使われた、オーナー提供の短尺動画（batch b139）。
 * LatestとGalleryがこの1オブジェクトを共有し、公開MP4とposterを複製しない。
 */
export type TikTokKossoriVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceUrl: string;
  sourceDate: string;
  published: boolean;
};

export const tiktokKossoriVideo = manifest as TikTokKossoriVideo;
