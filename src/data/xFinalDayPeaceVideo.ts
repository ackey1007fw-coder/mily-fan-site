import type { DriveGalleryVideo } from "./driveGallery.ts";

/**
 * X's October 11, 23:59 JST post about the October 12 fourth-round final day.
 * Owner-supplied two-second silent clip; never fetched from X media CDN.
 * The same source object is used by NEWS and Gallery.
 */
export type XFinalDayPeaceVideo = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceUrl: string;
  sourceDate: string;
  receivedDate: string;
  published: boolean;
};

export const X_FINAL_DAY_PEACE_POST_URL =
  "https://x.com/Mily_chan36/status/2109297721366773862";

export const xFinalDayPeaceVideo: XFinalDayPeaceVideo = {
  id: "mily-b216-01-x-final-day-peace",
  kind: "video",
  alt: "三つ編み姿のみりぃが淡いブルーのトップスと黒い羽織で両手ピースする2秒の無音動画",
  src: "/media/gallery/mily-b216-01-20261011-twin-braids-peace.mp4",
  poster: "/media/gallery/mily-b216-01-20261011-twin-braids-peace-poster.jpg",
  width: 910,
  height: 512,
  provenance: "owner-provided",
  sourceUrl: X_FINAL_DAY_PEACE_POST_URL,
  sourceDate: "2026-10-11",
  receivedDate: "2026-10-12",
  published: true,
};
