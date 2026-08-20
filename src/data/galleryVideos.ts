import {
  morningStoryVideo,
  morningStory20260820,
  type MorningStoryVideo,
} from "./morningStoryVideo.ts";
import { secondRoundStoryVideo } from "./secondRoundStoryVideo.ts";

export type GalleryVideoItem = MorningStoryVideo;
export { morningStoryVideo, morningStory20260820, secondRoundStoryVideo };

/**
 * Standalone local videos that belong in Gallery without being folded into
 * the older Drive batch b02 registry. Latest may reuse the same object so the
 * MP4 and poster paths remain single-source. Newest first.
 */
export const galleryVideos: GalleryVideoItem[] = [
  morningStory20260820,
  secondRoundStoryVideo,
  morningStoryVideo,
];

export function visibleGalleryVideos(
  items: GalleryVideoItem[] = galleryVideos,
): GalleryVideoItem[] {
  return items.filter((item) => item.published);
}
