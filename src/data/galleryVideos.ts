import { morningStoryVideo, type MorningStoryVideo } from "./morningStoryVideo";

export type GalleryVideoItem = MorningStoryVideo;
export { morningStoryVideo };

/**
 * Standalone local videos that belong in Gallery without being folded into
 * the older Drive batch b02 registry. Latest may reuse the same object so the
 * MP4 and poster paths remain single-source.
 */
export const galleryVideos: GalleryVideoItem[] = [morningStoryVideo];

export function visibleGalleryVideos(
  items: GalleryVideoItem[] = galleryVideos,
): GalleryVideoItem[] {
  return items.filter((item) => item.published);
}
