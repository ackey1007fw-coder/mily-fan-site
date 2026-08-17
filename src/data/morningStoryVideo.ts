import type { DriveGalleryVideo } from "./driveGallery";
import manifest from "./morningStoryVideo.json" with { type: "json" };

/**
 * Typed wrapper around the morning Story JSON. Latest and Gallery both import
 * this object so MP4 / poster paths and the raw-manifest assertion live here.
 */
export type MorningStoryVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceLabel: string;
  sourceDate: string;
  published: boolean;
};

export const morningStoryVideo = manifest as MorningStoryVideo;
