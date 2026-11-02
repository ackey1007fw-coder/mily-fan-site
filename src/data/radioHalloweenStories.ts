import type { DriveGalleryVideo } from "./driveGallery.ts";
import type { ActivityId } from "./activities.ts";
import manifest from "./radioHalloweenStories.json" with { type: "json" };

export type RadioHalloweenStoryVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceLabel: string;
  sourceDate: null;
  receivedDate: string;
  activityIds: ActivityId[];
  published: boolean;
};

/** October 25 is the receipt date; the original Story upload dates are unverified. */
export const radioHalloweenStories = manifest as RadioHalloweenStoryVideo[];
