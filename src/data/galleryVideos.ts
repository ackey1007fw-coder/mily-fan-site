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
import { nightStoryB41Video } from "./nightStoryB41Video.ts";
import { morningMissCircleShowroomStoryVideo } from "./morningMissCircleShowroomStoryVideo.ts";
import { nightThanksMorningStreamStoryVideo } from "./nightThanksMorningStreamStoryVideo.ts";
import { patonVoteCollageStoryVideo } from "./patonVoteCollageStoryVideo.ts";
import { patonVoteMirrorStoryVideo } from "./patonVoteMirrorStoryVideo.ts";
import { patonVoteDay4StoryVideo } from "./patonVoteDay4StoryVideo.ts";
import { seasideCircleMusicalSpecialVideo } from "./seasideCircleMusicalSpecialVideo.ts";
import { seasideCircleMusicalSpecialThanksVideo } from "./seasideCircleMusicalSpecialThanksVideo.ts";
import { seasideCircleYesTokyoVideo } from "./seasideCircleYesTokyoVideo.ts";
import { seasideCircleMovieThemeStoryVideo } from "./seasideCircleMovieThemeStoryVideo.ts";
import { secondRoundStoryVideo } from "./secondRoundStoryVideo.ts";
import { tiktokRadioVideo, type TikTokRadioVideo } from "./tiktokRadioVideo.ts";
import {
  tiktokSayonaraIchigoVideo,
  type TikTokSayonaraIchigoVideo,
} from "./tiktokSayonaraIchigoVideo.ts";
import {
  mixchFinalDayMovie,
  mixchExpressiveMovie,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
  type MixchMovie,
} from "./mixchMovies.ts";

export type SelfHostedGalleryVideo =
  | MorningStoryVideo
  | MorningShowroomRunwayVideo
  | TikTokRadioVideo
  | TikTokSayonaraIchigoVideo;

export type GalleryVideoItem = SelfHostedGalleryVideo | MixchMovie;
export {
  earthquakeSafetyStoryVideo,
  eventStory20260821,
  mixchFinalDayMovie,
  mixchExpressiveMovie,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
  morningOhayo20260821,
  morningMissCircleShowroomStoryVideo,
  morningShowroomRunwayVideo,
  morningStoryVideo,
  morningStory20260820,
  nightStoryB41Video,
  patonVoteDay4StoryVideo,
  nightThanksMorningStreamStoryVideo,
  patonVoteCollageStoryVideo,
  patonVoteMirrorStoryVideo,
  seasideCircleMusicalSpecialThanksVideo,
  seasideCircleMusicalSpecialVideo,
  seasideCircleMovieThemeStoryVideo,
  seasideCircleYesTokyoVideo,
  secondRoundStoryVideo,
  tiktokRadioVideo,
  tiktokSayonaraIchigoVideo,
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
 * index pins remain stable; older-than-August self-hosted items sit just
 * before Mixch. Mixch outbound cards follow in this array. Gallery UI leads
 * with みりぃ portraits via
 * selectGalleryEntries, then later photos, then Mixch in the video block.
 * Mixch is not a DriveGalleryVideo.
 */
export const galleryVideos: GalleryVideoItem[] = [
  patonVoteDay4StoryVideo,
  nightStoryB41Video,
  seasideCircleMovieThemeStoryVideo,
  morningMissCircleShowroomStoryVideo,
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
  tiktokSayonaraIchigoVideo,
  mixchFinalDayMovie,
  mixchExpressiveMovie,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
];

export function visibleGalleryVideos(
  items: GalleryVideoItem[] = galleryVideos,
): GalleryVideoItem[] {
  return items.filter((item) => item.published);
}
