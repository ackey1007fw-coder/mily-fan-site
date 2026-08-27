import type { DriveGalleryVideo } from "./driveGallery";
import manifest from "./tiktokSayonaraIchigoVideo.json" with { type: "json" };

/**
 * 2026-04-23のTikTok通常投稿に使われた、オーナー提供の短尺動画（batch b37）。
 * LatestとGalleryがこの1オブジェクトを共有し、公開MP4とposterを複製しない。
 */
export type TikTokSayonaraIchigoVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceUrl: string;
  sourceDate: string;
  published: boolean;
};

export const tiktokSayonaraIchigoVideo = manifest as TikTokSayonaraIchigoVideo;
