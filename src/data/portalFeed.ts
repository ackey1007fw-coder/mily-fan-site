import {
  events,
  isValidDateOnly,
  isValidDateTime,
  type FanEvent,
} from "./events.ts";
import { news, sortNewsByDateDesc, type NewsItem } from "./news.ts";
import { canonicalUrl, site, siteOrigin, storyUrl } from "./site.ts";
import { stories, type Story } from "./stories.ts";

export const PORTAL_FEED_VERSION = 1 as const;
export const PORTAL_PERSON_ID = "mily" as const;
export const PORTAL_FEED_LIMIT = 20;

export type PersonId = typeof PORTAL_PERSON_ID;

export type PortalFeedItem = {
  id: string;
  personId: PersonId;
  type: "news" | "story" | "schedule" | "event" | "update";
  title: string;
  summary?: string;
  url: string;
  sourceUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  startsAt?: string;
  endsAt?: string;
  image?: string;
};

export type PortalFeed = {
  version: typeof PORTAL_FEED_VERSION;
  personId: PersonId;
  siteName: string;
  siteUrl: string;
  generatedAt: string;
  items: PortalFeedItem[];
};

export type CreatePortalFeedInput = {
  newsItems?: NewsItem[];
  storyItems?: Story[];
  eventItems?: FanEvent[];
  now?: Date;
  generatedAt?: string;
};

function canonicalizeDateOnly(value: string, label: string): string {
  if (!isValidDateOnly(value)) {
    throw new Error(`${label} must be a real YYYY-MM-DD date (got "${value}")`);
  }

  return `${value}T00:00:00+09:00`;
}

function canonicalizeListedAt(value: string, label: string): string {
  if (isValidDateOnly(value)) return `${value}T00:00:00+09:00`;
  if (isValidDateTime(value)) return value;
  throw new Error(`${label} must be date-only or an offset datetime (got "${value}")`);
}

function requireHttpUrl(value: string, label: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be an absolute URL (got "${value}")`);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`${label} must use http(s) (got "${value}")`);
  }

  return parsed.href;
}

function sameOriginPageUrl(hash: string): string {
  return new URL(hash, canonicalUrl()).href;
}

function sameOriginImageUrl(value: string, label: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) {
    throw new Error(`${label} must be a local root-relative path (got "${value}")`);
  }

  const absolute = new URL(value, canonicalUrl());
  if (absolute.origin !== siteOrigin()) {
    throw new Error(`${label} must use the Mily site origin (got "${value}")`);
  }

  return absolute.href;
}

function optionalSummary(value: string | undefined): string | undefined {
  const summary = value?.trim();
  return summary ? summary : undefined;
}

function newsSourceUrl(item: NewsItem): string | undefined {
  if (item.source) return requireHttpUrl(item.source, `news "${item.id}" sourceUrl`);
  if (!item.url) return undefined;

  try {
    const parsed = new URL(item.url);
    if (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      parsed.origin !== siteOrigin()
    ) {
      return parsed.href;
    }
  } catch {
    // A site-relative detail route is an item destination, not an external source.
  }

  return undefined;
}

function newsToPortalItem(item: NewsItem): PortalFeedItem {
  const sourceUrl = newsSourceUrl(item);

  return {
    id: `${PORTAL_PERSON_ID}:news:${item.id}`,
    personId: PORTAL_PERSON_ID,
    type: "news",
    title: item.title,
    summary: optionalSummary(item.body),
    url: sameOriginPageUrl("#latest"),
    ...(sourceUrl ? { sourceUrl } : {}),
    publishedAt: canonicalizeDateOnly(item.date, `news "${item.id}" date`),
    ...(item.media?.kind === "video"
      ? {
          image: sameOriginImageUrl(
            item.media.poster,
            `news "${item.id}" poster`,
          ),
        }
      : {}),
    ...(item.media?.kind === "image"
      ? {
          image: sameOriginImageUrl(item.media.src, `news "${item.id}" image`),
        }
      : {}),
  };
}

function storyImage(story: Story): string | undefined {
  const lead = story.leadMediaId
    ? story.media.find((media) => media.id === story.leadMediaId)
    : undefined;
  const image =
    (lead?.kind === "image" ? lead : undefined) ??
    story.media.find((media) => media.kind === "image");

  return image
    ? sameOriginImageUrl(image.src, `story "${story.slug}" image`)
    : undefined;
}

function storyToPortalItem(story: Story): PortalFeedItem {
  const image = storyImage(story);

  return {
    id: `${PORTAL_PERSON_ID}:story:${story.slug}`,
    personId: PORTAL_PERSON_ID,
    type: "story",
    title: story.cardTitle || story.title,
    summary: optionalSummary(story.cardDescription || story.lead),
    url: storyUrl(story.slug),
    publishedAt: canonicalizeDateOnly(story.date, `story "${story.slug}" date`),
    ...(image ? { image } : {}),
  };
}

function eventToPortalItem(event: FanEvent): PortalFeedItem {
  if (event.timezone !== "Asia/Tokyo") {
    throw new Error(`event "${event.id}" timezone must be Asia/Tokyo`);
  }
  if (!isValidDateOnly(event.startAt) && !isValidDateTime(event.startAt)) {
    throw new Error(`event "${event.id}" startAt must be date-only or an offset datetime`);
  }
  if (
    event.endAt &&
    !isValidDateOnly(event.endAt) &&
    !isValidDateTime(event.endAt)
  ) {
    throw new Error(`event "${event.id}" endAt must be date-only or an offset datetime`);
  }

  const type = event.kind === "stream" ? "schedule" : "event";

  return {
    id: `${PORTAL_PERSON_ID}:${type}:${event.id}`,
    personId: PORTAL_PERSON_ID,
    type,
    title: event.title,
    summary: optionalSummary(event.notes),
    url: sameOriginPageUrl("#schedule"),
    sourceUrl: requireHttpUrl(event.source, `event "${event.id}" sourceUrl`),
    publishedAt: canonicalizeListedAt(
      event.listedAt,
      `event "${event.id}" listedAt`,
    ),
    ...(isValidDateTime(event.startAt) ? { startsAt: event.startAt } : {}),
    ...(event.endAt && isValidDateTime(event.endAt)
      ? { endsAt: event.endAt }
      : {}),
  };
}

function compareStableId(a: PortalFeedItem, b: PortalFeedItem): number {
  if (a.id < b.id) return -1;
  if (a.id > b.id) return 1;
  return 0;
}

const NEWS_EDITORIAL_RANKS = Symbol("newsEditorialRanks");

type PortalFeedWithEditorialRanks = PortalFeed & {
  [NEWS_EDITORIAL_RANKS]?: ReadonlyMap<string, number>;
};

function newsEditorialRanks(newsItems: NewsItem[]): ReadonlyMap<string, number> {
  return new Map(
    sortNewsByDateDesc(newsItems).map((item, index) => [
      `${PORTAL_PERSON_ID}:news:${item.id}`,
      index,
    ]),
  );
}

function comparePortalItems(
  a: PortalFeedItem,
  b: PortalFeedItem,
  editorialRanks?: ReadonlyMap<string, number>,
): number {
  const byPublishedAt = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
  if (byPublishedAt !== 0) return byPublishedAt;

  if (editorialRanks) {
    const rankA = editorialRanks.get(a.id);
    const rankB = editorialRanks.get(b.id);
    if (rankA !== undefined && rankB !== undefined && rankA !== rankB) {
      return rankA - rankB;
    }
  }

  return compareStableId(a, b);
}

export function comparePortalItemsByPublishedAt(
  a: PortalFeedItem,
  b: PortalFeedItem,
): number {
  return comparePortalItems(a, b);
}

function byPublishedAtThenNewsEditorialOrder(
  editorialRanks?: ReadonlyMap<string, number>,
) {
  return (a: PortalFeedItem, b: PortalFeedItem) =>
    comparePortalItems(a, b, editorialRanks);
}

function tokyoDayNumber(value: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const numberPart = (type: "year" | "month" | "day") => {
    const part = parts.find((candidate) => candidate.type === type)?.value;
    if (!part) throw new Error(`Unable to resolve Asia/Tokyo ${type}`);
    return Number(part);
  };

  return Date.UTC(numberPart("year"), numberPart("month") - 1, numberPart("day"));
}

export function selectPortalFeedItems(
  items: PortalFeedItem[],
  now = new Date(),
  limit = PORTAL_FEED_LIMIT,
  editorialRanks?: ReadonlyMap<string, number>,
): PortalFeedItem[] {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new Error(`Portal Feed limit must be a non-negative integer (got ${limit})`);
  }

  const compare = byPublishedAtThenNewsEditorialOrder(editorialRanks);
  const today = tokyoDayNumber(now);
  const priorityEvents = items
    .filter(
      (item) =>
        (item.type === "schedule" || item.type === "event") &&
        item.startsAt &&
        tokyoDayNumber(new Date(item.startsAt)) >= today,
    )
    .sort((a, b) => {
      const byStart = Date.parse(a.startsAt!) - Date.parse(b.startsAt!);
      return byStart !== 0 ? byStart : compareStableId(a, b);
    })
    .slice(0, limit);

  const selectedIds = new Set(priorityEvents.map((item) => item.id));
  const remaining = items
    .filter((item) => !selectedIds.has(item.id))
    .sort(compare)
    .slice(0, Math.max(0, limit - priorityEvents.length));

  return [...priorityEvents, ...remaining].sort(compare);
}

export function assertPortalFeedContract(feed: PortalFeed): void {
  if (feed.version !== PORTAL_FEED_VERSION) throw new Error("Unsupported Portal Feed version");
  if (feed.personId !== PORTAL_PERSON_ID) throw new Error("Unexpected Portal Feed personId");
  if (feed.siteUrl !== canonicalUrl()) throw new Error("Portal Feed siteUrl must be canonical");
  if (!isValidDateTime(feed.generatedAt)) {
    throw new Error("Portal Feed generatedAt must be an offset datetime");
  }
  if (feed.items.length > PORTAL_FEED_LIMIT) {
    throw new Error(`Portal Feed must contain at most ${PORTAL_FEED_LIMIT} items`);
  }

  const ids = new Set<string>();
  for (const item of feed.items) {
    if (ids.has(item.id)) throw new Error(`Duplicate Portal Feed id: ${item.id}`);
    ids.add(item.id);
    if (item.personId !== PORTAL_PERSON_ID) {
      throw new Error(`Portal Feed item "${item.id}" has an unexpected personId`);
    }
    if (!isValidDateTime(item.publishedAt)) {
      throw new Error(`Portal Feed item "${item.id}" has an invalid publishedAt`);
    }
    if (item.startsAt && !isValidDateTime(item.startsAt)) {
      throw new Error(`Portal Feed item "${item.id}" has an invalid startsAt`);
    }
    if (item.endsAt && !isValidDateTime(item.endsAt)) {
      throw new Error(`Portal Feed item "${item.id}" has an invalid endsAt`);
    }
    if (new URL(item.url).origin !== siteOrigin()) {
      throw new Error(`Portal Feed item "${item.id}" URL must use the Mily site origin`);
    }
    if (item.image && new URL(item.image).origin !== siteOrigin()) {
      throw new Error(`Portal Feed item "${item.id}" image must use the Mily site origin`);
    }
    if (item.sourceUrl) requireHttpUrl(item.sourceUrl, `item "${item.id}" sourceUrl`);
  }

  const ranks = (feed as PortalFeedWithEditorialRanks)[NEWS_EDITORIAL_RANKS];
  const sorted = [...feed.items].sort(byPublishedAtThenNewsEditorialOrder(ranks));
  if (sorted.some((item, index) => item.id !== feed.items[index]?.id)) {
    throw new Error("Portal Feed items must be sorted by publishedAt newest first");
  }
}

export function createPortalFeed(input: CreatePortalFeedInput = {}): PortalFeed {
  const now = input.now ?? new Date();
  const generatedAt = input.generatedAt ?? now.toISOString();
  const newsItems = input.newsItems ?? news;
  const editorialRanks = newsEditorialRanks(newsItems);
  const candidates = [
    ...newsItems.map(newsToPortalItem),
    ...(input.storyItems ?? stories)
      .filter((story) => story.published)
      .map(storyToPortalItem),
    ...(input.eventItems ?? events).map(eventToPortalItem),
  ];

  const feed: PortalFeedWithEditorialRanks = {
    version: PORTAL_FEED_VERSION,
    personId: PORTAL_PERSON_ID,
    siteName: site.displayTitle,
    siteUrl: canonicalUrl(),
    generatedAt,
    items: selectPortalFeedItems(candidates, now, PORTAL_FEED_LIMIT, editorialRanks),
  };
  feed[NEWS_EDITORIAL_RANKS] = editorialRanks;

  assertPortalFeedContract(feed);
  return feed;
}
