import {
  eventStory20260821,
  morningOhayo20260821,
  morningStoryVideo,
  morningStory20260820,
  type MorningStoryVideo,
} from "./morningStoryVideo.ts";
import {
  morningShowroomRunwayVideo,
  type MorningShowroomRunwayVideo,
} from "./morningShowroomRunwayVideo.ts";
import { earthquakeSafetyStoryVideo } from "./earthquakeSafetyStoryVideo.ts";
import { nightThanksMorningStreamStoryVideo } from "./nightThanksMorningStreamStoryVideo.ts";
import { seasideCircleMusicalSpecialVideo } from "./seasideCircleMusicalSpecialVideo.ts";
import { seasideCircleMusicalSpecialThanksVideo } from "./seasideCircleMusicalSpecialThanksVideo.ts";
import { seasideCircleYesTokyoVideo } from "./seasideCircleYesTokyoVideo.ts";
import { secondRoundStoryVideo } from "./secondRoundStoryVideo.ts";
import { tiktokRadioVideo, type TikTokRadioVideo } from "./tiktokRadioVideo.ts";

export type GalleryVideoItem =
  | MorningStoryVideo
  | MorningShowroomRunwayVideo
  | TikTokRadioVideo;
export {
  earthquakeSafetyStoryVideo,
  eventStory20260821,
  morningOhayo20260821,
  morningShowroomRunwayVideo,
  morningStoryVideo,
  morningStory20260820,
  nightThanksMorningStreamStoryVideo,
  seasideCircleMusicalSpecialThanksVideo,
  seasideCircleMusicalSpecialVideo,
  seasideCircleYesTokyoVideo,
  secondRoundStoryVideo,
  tiktokRadioVideo,
};

/**
 * Standalone local videos that belong in Gallery without being folded into
 * the older Drive batch b02 registry. Latest may reuse the same object so the
 * MP4 and poster paths remain single-source. Newest first.
 */
export const galleryVideos: GalleryVideoItem[] = [
  seasideCircleYesTokyoVideo,
  nightThanksMorningStreamStoryVideo,
  seasideCircleMusicalSpecialThanksVideo,
  seasideCircleMusicalSpecialVideo,
  earthquakeSafetyStoryVideo,
  tiktokRadioVideo,
  eventStory20260821,
  morningOhayo20260821,
  morningShowroomRunwayVideo,
  morningStory20260820,
  secondRoundStoryVideo,
  morningStoryVideo,
];

export function visibleGalleryVideos(
  items: GalleryVideoItem[] = galleryVideos,
): GalleryVideoItem[] {
  return items.filter((item) => item.published);
}
