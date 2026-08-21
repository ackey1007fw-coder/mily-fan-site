import type { DriveGalleryVideo } from "./driveGallery";
import eventManifest from "./eventStory20260821.json" with { type: "json" };
import manifest20260821 from "./morningOhayo20260821.json" with { type: "json" };
import manifest20260817 from "./morningStoryVideo.json" with { type: "json" };
import manifest20260820 from "./morningStory20260820.json" with { type: "json" };

/**
 * Typed wrapper around the morning Story JSON. Latest and Gallery both import
 * these objects so MP4 / poster paths and the raw-manifest assertion live here.
 *
 * One entry per received Story. Each object is shared by Latest and Gallery,
 * so a Story never gets a second purpose-specific MP4 or poster copy.
 */
export type MorningStoryVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceLabel: string;
  sourceDate: string;
  published: boolean;
};

/** 2026-08-17 朝のStory（batch b03）。 */
export const morningStoryVideo = manifest20260817 as MorningStoryVideo;

/** 2026-08-20 朝のStory（batch b07）。 */
export const morningStory20260820 = manifest20260820 as MorningStoryVideo;

/** 2026-08-21 朝の「OHAYO!」Story（batch b12）。 */
export const morningOhayo20260821 = manifest20260821 as MorningStoryVideo;

/** 2026-08-21 配信お礼・次枠・投稿時点順位のStory（batch b13）。 */
export const eventStory20260821 =
  eventManifest as MorningStoryVideo;
