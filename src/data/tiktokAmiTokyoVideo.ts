import type { DriveGalleryVideo } from "./driveGallery";
import manifest from "./tiktokAmiTokyoVideo.json" with { type: "json" };

/**
 * 2026-09-21の天宮あみさんTikTokに使われた、オーナー提供の短尺動画（batch b140）。
 * LatestとGalleryがこの1オブジェクトを共有し、公開MP4とposterを複製しない。
 */
export type TikTokAmiTokyoVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceUrl: string;
  sourceDate: string;
  published: boolean;
};

export const tiktokAmiTokyoVideo = manifest as TikTokAmiTokyoVideo;
