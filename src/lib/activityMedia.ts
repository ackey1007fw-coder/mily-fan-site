import {
  activities,
  type Activity,
  type ActivityId,
} from "../data/activities.ts";
import {
  isNewsAudio,
  news,
  sortNewsByDateDesc,
  type NewsAudioMedia,
  type NewsItem,
  type NewsMedia,
} from "../data/news.ts";
import {
  galleryVideos,
  type GalleryVideoItem,
} from "../data/galleryVideos.ts";
import { isMixchMovie, type MixchMovie } from "../data/mixchMovies.ts";
import { stories, type Story, type StoryMedia } from "../data/stories.ts";

/**
 * Mixch outbound cards and Fan Room audio are NEWS (+ Gallery for Mixch) only,
 * not Activity related media.
 */
export type ActivityMediaItem = Exclude<
  NewsMedia | StoryMedia | GalleryVideoItem,
  MixchMovie | NewsAudioMedia
>;

export type ActivityMediaSources = {
  activityRecords?: Activity[];
  newsItems?: NewsItem[];
  storyItems?: Story[];
  galleryItems?: GalleryVideoItem[];
};

function objectId(media: object): string | null {
  return "id" in media && typeof media.id === "string" ? media.id : null;
}

function mediaSrc(media: object): string | null {
  return "src" in media && typeof media.src === "string" ? media.src : null;
}

function canonicalGalleryItem(
  media: ActivityMediaItem,
  galleryItems: GalleryVideoItem[],
): ActivityMediaItem {
  const id = objectId(media);
  const src = mediaSrc(media);
  const match = galleryItems.find(
    (item) =>
      (id !== null && item.id === id) ||
      (src !== null && mediaSrc(item) === src),
  );
  if (!match || isMixchMovie(match)) return media;
  return match;
}

function activityMediaKey(media: ActivityMediaItem): string {
  const id = objectId(media);
  if (id) return id;
  const src = mediaSrc(media);
  return `${media.kind}:${src ?? ""}`;
}

function isActivityNewsMedia(
  media: NewsMedia,
): media is Exclude<NewsMedia, MixchMovie | NewsAudioMedia> {
  return !isMixchMovie(media) && !isNewsAudio(media);
}

/**
 * Selects explicitly related NEWS media plus media from related STORY slugs.
 * Story view objects that point at a Gallery manifest are resolved back to that
 * existing manifest object. Results are then deduplicated by manifest id.
 * Mixch outbound cards and Fan Room audio are NEWS-only and are not included here.
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
    .flatMap((item): ActivityMediaItem[] =>
      item.media && isActivityNewsMedia(item.media) ? [item.media] : [],
    );

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
