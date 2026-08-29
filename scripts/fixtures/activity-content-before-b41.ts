export * from "../../src/lib/activityContent.ts";
import type { ActivityId } from "../../src/data/activities.ts";
import type { NewsItem } from "../../src/data/news.ts";
import {
  selectActivityNews as selectCurrentActivityNews,
  selectActivityPageContent as selectCurrentActivityPageContent,
  type ActivityPageContent,
} from "../../src/lib/activityContent.ts";
import { selectActivityMedia } from "./activity-media-before-b41.ts";
import { news } from "./news-before-b41.ts";

export function selectActivityNews(
  activityId: ActivityId,
  items: NewsItem[] = news,
  limit = 3,
): NewsItem[] {
  return selectCurrentActivityNews(activityId, items, limit);
}

export function selectActivityPageContent(
  activityId: ActivityId,
  now: number = Date.now(),
): ActivityPageContent {
  const current = selectCurrentActivityPageContent(activityId, now);
  return {
    ...current,
    news: selectActivityNews(activityId),
    media: selectActivityMedia(activityId),
  };
}
