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
import { patonVoteCollageStoryVideo } from "./patonVoteCollageStoryVideo.ts";
import { patonVoteMirrorStoryVideo } from "./patonVoteMirrorStoryVideo.ts";
import { seasideCircleMusicalSpecialVideo } from "./seasideCircleMusicalSpecialVideo.ts";
import { seasideCircleMusicalSpecialThanksVideo } from "./seasideCircleMusicalSpecialThanksVideo.ts";
import { seasideCircleYesTokyoVideo } from "./seasideCircleYesTokyoVideo.ts";
import { secondRoundStoryVideo } from "./secondRoundStoryVideo.ts";
import { tiktokRadioVideo, type TikTokRadioVideo } from "./tiktokRadioVideo.ts";
import {
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
  type MixchMovie,
} from "./mixchMovies.ts";

export type SelfHostedGalleryVideo =
  | MorningStoryVideo
  | MorningShowroomRunwayVideo
  | TikTokRadioVideo;

export type GalleryVideoItem = SelfHostedGalleryVideo | MixchMovie;
export {
  earthquakeSafetyStoryVideo,
  eventStory20260821,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
  morningOhayo20260821,
  morningShowroomRunwayVideo,
  morningStoryVideo,
  morningStory20260820,
  nightThanksMorningStreamStoryVideo,
  patonVoteCollageStoryVideo,
  patonVoteMirrorStoryVideo,
  seasideCircleMusicalSpecialThanksVideo,
  seasideCircleMusicalSpecialVideo,
  seasideCircleYesTokyoVideo,
  secondRoundStoryVideo,
  tiktokRadioVideo,
};

export function isSelfHostedGalleryVideo(
  item: GalleryVideoItem,
): item is SelfHostedGalleryVideo {
  return item.kind === "video";
}

/**
 * Standalone Gallery videos: owner-provided self-hosted MP4s plus Mixch
 * outbound player cards. Latest may reuse the same object so paths (or Mixch
 * URLs) remain single-source. Self-hosted items stay newest first so older
 * index pins remain stable; Mixch outbound cards follow. Gallery UI still
 * leads with Mixch via selectGalleryEntries. Mixch is not a DriveGalleryVideo.
 */
export const galleryVideos: GalleryVideoItem[] = [
  patonVoteMirrorStoryVideo,
  patonVoteCollageStoryVideo,
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
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
];

export function visibleGalleryVideos(
  items: GalleryVideoItem[] = galleryVideos,
): GalleryVideoItem[] {
  return items.filter((item) => item.published);
}
