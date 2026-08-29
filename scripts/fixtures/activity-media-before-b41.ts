export * from "../../src/lib/activityMedia.ts";
import type { ActivityId } from "../../src/data/activities.ts";
import {
  selectActivityMedia as selectCurrentActivityMedia,
  type ActivityMediaItem,
  type ActivityMediaSources,
} from "../../src/lib/activityMedia.ts";
import { galleryVideos } from "./gallery-videos-before-b41.ts";
import { news } from "./news-before-b41.ts";

export function selectActivityMedia(
  activityId: ActivityId,
  sources: ActivityMediaSources = {},
): ActivityMediaItem[] {
  return selectCurrentActivityMedia(activityId, {
    ...sources,
    newsItems: sources.newsItems ?? news,
    galleryItems: sources.galleryItems ?? galleryVideos,
  });
}
