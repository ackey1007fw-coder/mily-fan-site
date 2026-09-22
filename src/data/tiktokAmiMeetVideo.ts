import type { DriveGalleryVideo } from "./driveGallery";
import manifest from "./tiktokAmiMeetVideo.json" with { type: "json" };

/**
 * 2026-09-22のラジオDJネキみりぃTikTokに使われた、オーナー提供の短尺動画（batch b141-01）。
 * LatestとGalleryがこの1オブジェクトを共有し、公開MP4とposterを複製しない。
 */
export type TikTokAmiMeetVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceUrl: string;
  sourceDate: string;
  published: boolean;
};

export const tiktokAmiMeetVideo = manifest as TikTokAmiMeetVideo;
