/**
 * Historical tests were written against the site as it stood on 2026-09-22.
 * Node runs test files in separate workers, so remove later records from
 * the in-memory arrays for those historical assertions.
 * Current tests import the unmodified production data directly.
 */
import { news } from "../../src/data/news.ts";
import { galleryVideos } from "../../src/data/galleryVideos.ts";
import { media } from "../../src/data/media.ts";

const newNewsIds = new Set([
  "2026-09-26-fanroom-morning-dream-gongcha",
  "2026-09-25-fanroom-thanks-and-finals",
  "2026-09-25-super-oreo-mcflurry-x",
  "2026-09-25-first-avatar-distribution-x",
  "2026-09-24-face-to-face-class-story",
  "2026-09-23-fanroom-selfie-voices",
  "2026-09-23-morning-commute-x",
  "2026-09-23-morning-commute-story",
  "2026-09-23-paton-thanks-story",
]);
const newVideoIds = new Set([
  "mily-b146-01-face-to-face-class-story",
  "mily-b144-02-morning-x",
  "mily-b144-01-morning-commute-story",
]);

for (let index = news.length - 1; index >= 0; index--) {
  if (newNewsIds.has(news[index].id)) news.splice(index, 1);
}
for (let index = galleryVideos.length - 1; index >= 0; index--) {
  if (newVideoIds.has(galleryVideos[index].id)) galleryVideos.splice(index, 1);
}
for (let index = media.length - 1; index >= 0; index--) {
  if (media[index].id === "mily-b145-03") media.splice(index, 1);
}
