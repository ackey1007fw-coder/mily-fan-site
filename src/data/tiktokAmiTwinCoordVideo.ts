import type { DriveGalleryVideo } from "./driveGallery";
import manifest from "./tiktokAmiTwinCoordVideo.json" with { type: "json" };

/**
 * 2026-09-22の天宮あみさんTikTokに使われた、オーナー提供の短尺動画（batch b141-03）。
 * LatestとGalleryがこの1オブジェクトを共有し、公開MP4とposterを複製しない。
 */
export type TikTokAmiTwinCoordVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceUrl: string;
  sourceDate: string;
  published: boolean;
};

export const tiktokAmiTwinCoordVideo = manifest as TikTokAmiTwinCoordVideo;
