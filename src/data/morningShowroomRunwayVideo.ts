import type { DriveGalleryVideo } from "./driveGallery";
import manifest from "./morningShowroomRunwayVideo.json" with { type: "json" };

/**
 * 2026-08-21 朝のX投稿に添付された、オーナー提供の短尺動画（batch b11）。
 * Latest と Gallery がこの1オブジェクトを共有し、公開MP4とposterを複製しない。
 */
export type MorningShowroomRunwayVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceUrl: string;
  sourceDate: string;
  published: boolean;
};

export const morningShowroomRunwayVideo =
  manifest as MorningShowroomRunwayVideo;
