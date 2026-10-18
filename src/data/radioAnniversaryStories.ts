import type { DriveGalleryVideo } from "./driveGallery.ts";
import type { ActivityId } from "./activities.ts";
import manifest from "./radioAnniversaryStories.json" with { type: "json" };

export type RadioAnniversaryStoryVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceLabel: string;
  sourceDate: null;
  receivedDate: string;
  activityIds: ActivityId[];
  published: boolean;
};

/** Original Story publication time is unknown; 10/4 is the receipt date. */
export const radioAnniversaryStories = manifest as RadioAnniversaryStoryVideo[];
