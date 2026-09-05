import type { DriveGalleryVideo } from "./driveGallery";
import manifest from "./tiktokPortraitVideo.json" with { type: "json" };

/** Owner-provided TikTok clip. Publication date remains unconfirmed. */
export type TikTokPortraitVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceUrl: string;
  sourceDate: string | null;
  published: boolean;
};

export const tiktokPortraitVideo = manifest as TikTokPortraitVideo;
