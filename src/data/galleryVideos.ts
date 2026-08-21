import {
  morningOhayo20260821,
  morningStoryVideo,
  morningStory20260820,
  type MorningStoryVideo,
} from "./morningStoryVideo.ts";
import {
  morningShowroomRunwayVideo,
  type MorningShowroomRunwayVideo,
} from "./morningShowroomRunwayVideo.ts";
import { secondRoundStoryVideo } from "./secondRoundStoryVideo.ts";

export type GalleryVideoItem = MorningStoryVideo | MorningShowroomRunwayVideo;
export {
  morningOhayo20260821,
  morningShowroomRunwayVideo,
  morningStoryVideo,
  morningStory20260820,
  secondRoundStoryVideo,
};

/**
 * Standalone local videos that belong in Gallery without being folded into
 * the older Drive batch b02 registry. Latest may reuse the same object so the
 * MP4 and poster paths remain single-source. Newest first.
 */
export const galleryVideos: GalleryVideoItem[] = [
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
