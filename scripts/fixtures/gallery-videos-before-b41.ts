export * from "../../src/data/galleryVideos.ts";
import {
  galleryVideos as currentGalleryVideos,
  type GalleryVideoItem,
} from "../../src/data/galleryVideos.ts";

const laterVideoIds = new Set([
  "mily-b41-01-night-showroom-story",
  "mily-b41-02-paton-vote-day4-story",
  "mixch-m-UBHJplv4",
]);

/** Historical view used by pre-b41 regression tests. */
export const galleryVideos: GalleryVideoItem[] = currentGalleryVideos.filter(
  ({ id }) => !laterVideoIds.has(id),
);

export function visibleGalleryVideos(
  items: GalleryVideoItem[] = galleryVideos,
): GalleryVideoItem[] {
  return items.filter((item) => item.published);
}
