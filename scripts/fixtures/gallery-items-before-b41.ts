export * from "../../src/lib/galleryItems.ts";
import {
  selectGalleryEntries as selectCurrentGalleryEntries,
  type GalleryEntry,
} from "../../src/lib/galleryItems.ts";

const laterGalleryIds = new Set([
  "mily-b44-02-paton-vote-first-place-story",
  "mily-b44-01-paton-vote-15x-emergency-story",
  "mily-b44-04-showroom-30-day-anniversary-story",
  "mily-b43-02-campus-girls-hold-second-story",
  "mily-b43-01-paton-vote-day5-story",
  "mily-b41-01-night-showroom-story",
  "mily-b41-02-paton-vote-day4-story",
  "mixch-m-UBHJplv4",
]);

export function selectGalleryEntries(): GalleryEntry[] {
  return selectCurrentGalleryEntries().filter(
    ({ item }) => !("id" in item && laterGalleryIds.has(item.id)),
  );
}

export function selectGalleryPreview(limit: number): GalleryEntry[] {
  return selectGalleryEntries().slice(0, limit);
}
