import type { DriveGalleryVideo } from "./driveGallery";
import morningStoryVideoManifest from "./morningStoryVideo.json" with { type: "json" };

export type GalleryVideoItem = DriveGalleryVideo & {
  provenance: "owner-provided";
  sourceLabel: string;
  sourceDate: string;
  published: boolean;
};

/**
 * Standalone local videos that belong in Gallery without being folded into
 * the older Drive batch b02 registry. Latest may reuse the same object so the
 * MP4 and poster paths remain single-source.
 */
export const morningStoryVideo = morningStoryVideoManifest as GalleryVideoItem;

export const galleryVideos: GalleryVideoItem[] = [morningStoryVideo];

export function visibleGalleryVideos(
  items: GalleryVideoItem[] = galleryVideos,
): GalleryVideoItem[] {
  return items.filter((item) => item.published);
}
