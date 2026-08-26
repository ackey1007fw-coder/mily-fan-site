import {
  activities,
  type Activity,
  type ActivityId,
} from "../data/activities.ts";
import {
  news,
  sortNewsByDateDesc,
  type NewsItem,
  type NewsMedia,
} from "../data/news.ts";
import {
  galleryVideos,
  type GalleryVideoItem,
} from "../data/galleryVideos.ts";
import { isMixchMovie } from "../data/mixchMovies.ts";
import { stories, type Story, type StoryMedia } from "../data/stories.ts";

export type ActivityMediaItem = NewsMedia | StoryMedia | GalleryVideoItem;

export type ActivityMediaSources = {
  activityRecords?: Activity[];
  newsItems?: NewsItem[];
  storyItems?: Story[];
  galleryItems?: GalleryVideoItem[];
};

function objectId(media: ActivityMediaItem): string | null {
  return "id" in media && typeof media.id === "string" ? media.id : null;
}

function mediaSrc(media: ActivityMediaItem): string | null {
  return "src" in media && typeof media.src === "string" ? media.src : null;
}

function canonicalGalleryItem(
  media: ActivityMediaItem,
  galleryItems: GalleryVideoItem[],
): ActivityMediaItem {
  const id = objectId(media);
  const src = mediaSrc(media);
  return (
    galleryItems.find(
      (item) =>
        (id !== null && item.id === id) ||
        (src !== null && mediaSrc(item) === src),
    ) ?? media
  );
}

function activityMediaKey(media: ActivityMediaItem): string {
  const id = objectId(media);
  if (id) return id;
  if (isMixchMovie(media)) return `${media.kind}:${media.mixchUrl}`;
  const src = mediaSrc(media);
  return `${media.kind}:${src ?? ""}`;
}

/**
 * Selects explicitly related NEWS media plus media from related STORY slugs.
 * Story view objects that point at a Gallery manifest are resolved back to that
 * existing manifest object. Results are then deduplicated by manifest id.
 */
export function selectActivityMedia(
  activityId: ActivityId,
  sources: ActivityMediaSources = {},
): ActivityMediaItem[] {
  const activityRecords = sources.activityRecords ?? activities;
  const newsItems = sources.newsItems ?? news;
  const storyItems = sources.storyItems ?? stories;
  const galleryItems = sources.galleryItems ?? galleryVideos;
  const activity = activityRecords.find(({ id }) => id === activityId);
  if (!activity) return [];

  const relatedNewsMedia = sortNewsByDateDesc(newsItems)
    .filter((item) => item.activityIds?.includes(activityId))
    .flatMap((item) => (item.media ? [item.media] : []));

  const relatedStoryMedia = activity.relatedStorySlugs.flatMap((slug) => {
    const story = storyItems.find((item) => item.slug === slug && item.published);
    return story?.media ?? [];
  });

  const selected: ActivityMediaItem[] = [];
  const seen = new Set<string>();
  for (const media of [...relatedNewsMedia, ...relatedStoryMedia]) {
    const canonical = canonicalGalleryItem(media, galleryItems);
    const key = activityMediaKey(canonical);
    if (seen.has(key)) continue;
    seen.add(key);
    selected.push(canonical);
  }
  return selected;
}
