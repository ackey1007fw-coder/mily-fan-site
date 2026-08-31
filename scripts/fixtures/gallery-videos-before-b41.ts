export * from "../../src/data/galleryVideos.ts";
import {
  galleryVideos as currentGalleryVideos,
  type GalleryVideoItem,
} from "../../src/data/galleryVideos.ts";

const laterVideoIds = new Set([
  "mily-b44-02-paton-vote-first-place-story",
  "mily-b44-01-paton-vote-15x-emergency-story",
  "mily-b44-04-showroom-30-day-anniversary-story",
  "mily-b43-02-campus-girls-hold-second-story",
  "mily-b43-01-paton-vote-day5-story",
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
