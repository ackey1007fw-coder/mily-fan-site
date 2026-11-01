import type { DriveGalleryVideo } from "./driveGallery.ts";
import type { ActivityId } from "./activities.ts";
import manifest from "./storiesNov01.json" with { type: "json" };

export type StoriesNov01Video = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceLabel: string;
  sourceDate: null;
  receivedDate: string;
  activityIds: ActivityId[];
  published: boolean;
};

/** November 1 is the receipt date; the original Story upload dates are unverified. */
export const storiesNov01 = manifest as StoriesNov01Video[];
export const radioNov01Stories = storiesNov01.slice(0, 2);
export const maidBunnyVoteDay4Story = storiesNov01[2];
