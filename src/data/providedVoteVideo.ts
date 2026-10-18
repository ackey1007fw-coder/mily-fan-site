import type { DriveGalleryVideo } from "./driveGallery.ts";
import type { ActivityId } from "./activities.ts";

export type ProvidedVoteVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceUrl: null;
  sourceDate: null;
  receivedDate: string;
  activityIds: ActivityId[];
  published: boolean;
};

/** Receipt date is known; shooting and original publication dates are not. */
export const providedVoteVideo: ProvidedVoteVideo = {
  id: "mily-b187-01-vote-support",
  kind: "video",
  alt: "みりぃへの投票を呼びかける動画（5秒・音声なし／撮影・投稿日時未確認）",
  src: "/media/gallery/mily-b187-01-vote-support.mp4",
  poster: "/media/gallery/mily-b187-01-vote-support-poster.jpg",
  width: 512,
  height: 910,
  provenance: "owner-provided",
  sourceUrl: null,
  sourceDate: null,
  receivedDate: "2026-10-04",
  activityIds: ["miss-circle"],
  published: true,
};
