import assert from "node:assert/strict";
import { sortNewsByDateDesc } from "../src/data/news.ts";

export function portalNewsId(newsId) {
  return `mily:news:${newsId}`;
}

/**
 * NEWS items in a Portal Feed must keep the same relative order as
 * `sortNewsByDateDesc()` (date, then sameDayOrder, then source-array order).
 * The feed may omit older NEWS when it hits the item limit.
 */
export function assertPortalNewsFollowsSort(feed, newsItems) {
  const expected = sortNewsByDateDesc(newsItems).map((item) =>
    portalNewsId(item.id),
  );
  const actual = feed.items
    .filter((item) => item.type === "news")
    .map((item) => item.id);

  assert.deepEqual(actual, expected.slice(0, actual.length));
}

export function findFeedItem(feed, id) {
  const item = feed.items.find((candidate) => candidate.id === id);
  assert.ok(item, `expected Portal Feed to include ${id}`);
  return item;
}

export function assertFeedItemBefore(feed, earlierId, laterId) {
  const earlier = feed.items.findIndex((item) => item.id === earlierId);
  const later = feed.items.findIndex((item) => item.id === laterId);
  assert.notEqual(earlier, -1, `missing ${earlierId}`);
  assert.notEqual(later, -1, `missing ${laterId}`);
  assert.ok(earlier < later, `${earlierId} should appear before ${laterId}`);
}
