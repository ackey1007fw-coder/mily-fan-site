import type { ActivityId } from "../data/activities.ts";
import type { NewsCategory, NewsItem } from "../data/news.ts";

/** Display order of the filter chips and badges. */
export const NEWS_CATEGORY_ORDER: readonly NewsCategory[] = [
  "contest",
  "stream",
  "radio",
  "sns",
];

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  contest: "コンテスト",
  stream: "配信",
  radio: "ラジオ",
  sns: "近況・SNS",
};

const ACTIVITY_CATEGORY: Record<ActivityId, NewsCategory> = {
  "miss-circle": "contest",
  "campus-girls": "contest",
  "live-stream": "stream",
  radio: "radio",
};

/** URL query key for the selected category on /news/. */
export const NEWS_CATEGORY_QUERY_KEY = "category";

export function isNewsCategory(value: unknown): value is NewsCategory {
  return typeof value === "string" && (NEWS_CATEGORY_ORDER as readonly string[]).includes(value);
}

/**
 * Categories of one NEWS item, in display order.
 * An explicit `categories` override wins. Otherwise the Activity relations decide,
 * and an item without any relation is treated as a personal update (近況・SNS).
 * Does not change Activity propagation: `activityIds` stay the only relation source.
 */
export function newsCategoriesOf(item: Pick<NewsItem, "categories" | "activityIds">): NewsCategory[] {
  const raw = item.categories?.length
    ? item.categories
    : item.activityIds?.length
      ? item.activityIds.map((id) => ACTIVITY_CATEGORY[id])
      : (["sns"] as NewsCategory[]);
  const set = new Set(raw);
  return NEWS_CATEGORY_ORDER.filter((category) => set.has(category));
}

export function filterNewsByCategory<T extends Pick<NewsItem, "categories" | "activityIds">>(
  items: readonly T[],
  category: NewsCategory | null,
): T[] {
  if (!category) return [...items];
  return items.filter((item) => newsCategoriesOf(item).includes(category));
}

export function countNewsByCategory(
  items: readonly Pick<NewsItem, "categories" | "activityIds">[],
): Record<NewsCategory, number> {
  const counts: Record<NewsCategory, number> = { contest: 0, stream: 0, radio: 0, sns: 0 };
  for (const item of items) {
    for (const category of newsCategoriesOf(item)) counts[category] += 1;
  }
  return counts;
}

/** Reads `?category=` from a search string. Unknown values fall back to all. */
export function readNewsCategoryFromSearch(search: string): NewsCategory | null {
  const value = new URLSearchParams(search).get(NEWS_CATEGORY_QUERY_KEY);
  return isNewsCategory(value) ? value : null;
}
