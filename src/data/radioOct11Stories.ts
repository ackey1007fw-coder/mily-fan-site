import type { DriveGalleryVideo } from "./driveGallery.ts";
import type { ActivityId } from "./activities.ts";
import manifest from "./radioOct11Stories.json" with { type: "json" };

export type RadioOct11StoryVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceLabel: string;
  sourceDate: null;
  receivedDate: string;
  activityIds: ActivityId[];
  published: boolean;
};

/** Original Story upload dates are unverified. 10/11 is the date received and checked. */
export const radioOct11Stories = manifest as RadioOct11StoryVideo[];
