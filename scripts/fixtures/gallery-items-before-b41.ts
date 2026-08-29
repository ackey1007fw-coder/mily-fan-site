export * from "../../src/lib/galleryItems.ts";
import {
  selectGalleryEntries as selectCurrentGalleryEntries,
  type GalleryEntry,
} from "../../src/lib/galleryItems.ts";

const batch41VideoIds = new Set([
  "mily-b41-01-night-showroom-story",
  "mily-b41-02-paton-vote-day4-story",
]);

export function selectGalleryEntries(): GalleryEntry[] {
  return selectCurrentGalleryEntries().filter(
    ({ item }) => !("id" in item && batch41VideoIds.has(item.id)),
  );
}

export function selectGalleryPreview(limit: number): GalleryEntry[] {
  return selectGalleryEntries().slice(0, limit);
}
