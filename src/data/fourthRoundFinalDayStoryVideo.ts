import type { DriveGalleryVideo } from "./driveGallery.ts";

export type FourthRoundFinalDayStoryVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceLabel: string;
  sourceDate: null;
  receivedDate: string;
  published: boolean;
};

/** One owner-provided Story, shared by NEWS and Gallery. Receipt date is not its upload date. */
export const fourthRoundFinalDayStoryVideo: FourthRoundFinalDayStoryVideo = {
  id: "mily-b217-01-fourth-round-final-day-story",
  kind: "video",
  alt: "三つ編みとヘッドホン姿のみりぃ、投票へのお礼と「投票最終日」「SHOWROOM最終枠 21:00〜21:59」の案内が表示された音声なしの縦型Story動画",
  src: "/media/gallery/mily-b217-01-final-day-story.mp4",
  poster: "/media/gallery/mily-b217-01-final-day-story-poster.jpg",
  width: 512,
  height: 910,
  provenance: "owner-provided",
  sourceLabel: "Instagram Story（投稿日未確認）",
  sourceDate: null,
  receivedDate: "2026-10-12",
  published: true,
};
