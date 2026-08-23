import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertPortalFeedContract,
  createPortalFeed,
  PORTAL_FEED_LIMIT,
} from "../src/data/portalFeed.ts";
import { events } from "../src/data/events.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { assertPortalNewsFollowsSort } from "./portal-feed-order.mjs";
import { siteOrigin } from "../src/data/site.ts";
import { stories } from "../src/data/stories.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixedNow = new Date("2026-08-19T12:00:00+09:00");
const fixedGeneratedAt = "2026-08-19T03:00:00.000Z";
const sourceUrl = "https://www.instagram.com/mily_chan36/";

function newsFixture(overrides = {}) {
  return {
    id: "confirmed-update",
    date: "2026-08-18",
    title: "みりぃからのお知らせ",
    body: "確認済みの更新です。",
    source: sourceUrl,
    ...overrides,
  };
}

function storyFixture(overrides = {}) {
  return {
    slug: "confirmed-story",
    href: "/stories/confirmed-story/",
    title: "みりぃの記録",
    cardTitle: "みりぃの記録",
    eyebrow: "STORY",
    lead: "確認済みの記録です。",
    cardDescription: "確認済みの記録です。",
    date: "2026-08-17",
    dateLabel: "2026.08.17",
    published: true,
    sourceIds: [],
    leadMediaId: null,
    media: [],
    sections: [],
    ...overrides,
  };
}

function eventFixture(overrides = {}) {
  return {
    id: "confirmed-event",
    title: "みりぃ出演予定",
    listedAt: "2026-08-18",
    startAt: "2026-08-20T19:00:00+09:00",
    endAt: "2026-08-20T20:00:00+09:00",
    timezone: "Asia/Tokyo",
    kind: "appearance",
    source: sourceUrl,
    notes: "確認済みの予定です。",
    ...overrides,
  };
}

function createFixtureFeed(overrides = {}) {
  return createPortalFeed({
    newsItems: [],
    storyItems: [],
    eventItems: [],
    now: fixedNow,
    generatedAt: fixedGeneratedAt,
    ...overrides,
  });
}

describe("Portal Feed generation", () => {
  it("generates a contract-valid feed from the real published data", () => {
    const feed = createPortalFeed({
      now: fixedNow,
      generatedAt: fixedGeneratedAt,
    });

    assert.doesNotThrow(() => assertPortalFeedContract(feed));
    assert.equal(feed.version, 1);
    assert.equal(feed.personId, "mily");
    assert.equal(feed.siteUrl, "https://mily-fan-site.vercel.app/");
    const publishedStoryCount = stories.filter((story) => story.published).length;
    const newsInFeed = feed.items.filter((item) => item.type === "news").length;
    const storiesInFeed = feed.items.filter((item) => item.type === "story").length;
    const eventsInFeed = feed.items.filter(
      (item) => item.type === "event" || item.type === "schedule",
    ).length;

    assert.equal(feed.items.length, PORTAL_FEED_LIMIT);
    assert.equal(newsInFeed + storiesInFeed + eventsInFeed, feed.items.length);
    assert.ok(newsInFeed > 0);
    assert.ok(newsInFeed <= news.length);
    assert.ok(storiesInFeed > 0);
    assert.ok(storiesInFeed <= publishedStoryCount);
    assertPortalNewsFollowsSort(feed, news);
    assert.equal(eventsInFeed, events.length);
  });

  it("canonicalizes a real date-only news value to JST midnight", () => {
    const feed = createFixtureFeed({
      newsItems: [newsFixture({ date: "2026-08-18" })],
    });

    assert.equal(feed.items[0].publishedAt, "2026-08-18T00:00:00+09:00");
    assert.throws(() =>
      createFixtureFeed({ newsItems: [newsFixture({ date: "2026-02-31" })] }),
    );
  });

  it("uses only an external news destination as a source fallback", () => {
    const external = createFixtureFeed({
      newsItems: [
        newsFixture({
          source: undefined,
          url: "https://www.showroom-live.com/r/circle2026_0734",
        }),
      ],
    });
    const siteRelative = createFixtureFeed({
      newsItems: [
        newsFixture({
          source: undefined,
          url: "/stories/confirmed-story/",
        }),
      ],
    });

    assert.equal(
      external.items[0].sourceUrl,
      "https://www.showroom-live.com/r/circle2026_0734",
    );
    assert.equal("sourceUrl" in siteRelative.items[0], false);
  });

  it("includes only published stories", () => {
    const feed = createFixtureFeed({
      storyItems: [
        storyFixture({ slug: "published-story", published: true }),
        storyFixture({ slug: "draft-story", published: false }),
      ],
    });

    assert.deepEqual(
      feed.items.map((item) => item.id),
      ["mily:story:published-story"],
    );
  });

  it("maps event listing and schedule timestamps as separate fields", () => {
    const feed = createFixtureFeed({
      eventItems: [eventFixture({ kind: "stream" })],
    });
    const item = feed.items[0];

    assert.equal(item.id, "mily:schedule:confirmed-event");
    assert.equal(item.type, "schedule");
    assert.equal(item.publishedAt, "2026-08-18T00:00:00+09:00");
    assert.equal(item.startsAt, "2026-08-20T19:00:00+09:00");
    assert.equal(item.endsAt, "2026-08-20T20:00:00+09:00");
  });

  it("does not invent midnight starts or ends for date-only event values", () => {
    const feed = createFixtureFeed({
      eventItems: [
        eventFixture({
          startAt: "2026-08-20",
          endAt: "2026-08-20",
        }),
      ],
    });
    const item = feed.items[0];

    assert.equal("startsAt" in item, false);
    assert.equal("endsAt" in item, false);
  });

  it("rejects offset-less event datetimes", () => {
    assert.throws(
      () =>
        createFixtureFeed({
          eventItems: [eventFixture({ startAt: "2026-08-20T19:00:00" })],
        }),
      /startAt must be date-only or an offset datetime/,
    );
    assert.throws(
      () =>
        createFixtureFeed({
          eventItems: [eventFixture({ listedAt: "2026-08-18T12:00:00" })],
        }),
      /listedAt must be date-only or an offset datetime/,
    );
  });

  it("limits output to 20 items", () => {
    const newsItems = Array.from({ length: 25 }, (_, position) =>
      newsFixture({
        id: `confirmed-update-${String(position + 1).padStart(2, "0")}`,
      }),
    );
    const feed = createFixtureFeed({ newsItems });

    assert.equal(feed.items.length, PORTAL_FEED_LIMIT);
  });

  it("reserves a future exact-time event before filling the limit with news", () => {
    const newsItems = Array.from({ length: 25 }, (_, position) =>
      newsFixture({
        id: `newer-update-${String(position + 1).padStart(2, "0")}`,
        date: "2026-08-19",
      }),
    );
    const feed = createFixtureFeed({
      newsItems,
      eventItems: [
        eventFixture({
          id: "future-appearance",
          listedAt: "2026-08-01",
          startAt: "2026-08-21T18:00:00+09:00",
        }),
      ],
    });

    assert.equal(feed.items.length, PORTAL_FEED_LIMIT);
    assert.ok(feed.items.some((item) => item.id === "mily:event:future-appearance"));
  });

  it("keeps an exact-time event after its start while JST is still the same day", () => {
    const feed = createFixtureFeed({
      now: new Date("2026-08-19T22:00:00+09:00"),
      newsItems: Array.from({ length: 25 }, (_, position) =>
        newsFixture({
          id: `same-day-update-${String(position + 1).padStart(2, "0")}`,
          date: "2026-08-19",
        }),
      ),
      eventItems: [
        eventFixture({
          id: "started-today",
          listedAt: "2026-08-01",
          startAt: "2026-08-19T09:00:00+09:00",
          endAt: undefined,
        }),
      ],
    });

    assert.ok(feed.items.some((item) => item.id === "mily:event:started-today"));
  });

  it("accepts a JSON-serialized feed that keeps same-day NEWS chronology", () => {
    const live = createPortalFeed();
    const serialized = JSON.parse(JSON.stringify(live));
    const morningId = "mily:news:2026-08-23-morning-showroom-fanroom";
    const earlyId = "mily:news:2026-08-23-early-showroom-fanroom";

    assert.doesNotThrow(() => assertPortalFeedContract(serialized));
    assert.ok(
      serialized.items.findIndex((item) => item.id === morningId) <
        serialized.items.findIndex((item) => item.id === earlyId),
    );
  });

  it("preserves Latest same-day news chronology without inventing publication times", () => {
    const feed = createFixtureFeed({
      newsItems: [
        newsFixture({ id: "later-unranked", date: "2026-08-21" }),
        newsFixture({
          id: "earlier-ranked",
          date: "2026-08-21",
          sameDayOrder: 2,
        }),
        newsFixture({
          id: "middle-ranked",
          date: "2026-08-21",
          sameDayOrder: 1,
        }),
      ],
    });

    assert.deepEqual(
      feed.items.map((item) => item.id),
      [
        "mily:news:earlier-ranked",
        "mily:news:middle-ranked",
        "mily:news:later-unranked",
      ],
    );
    assert.ok(
      feed.items.every((item) => item.publishedAt === "2026-08-21T00:00:00+09:00"),
    );
  });

  it("uses NEWS editorial order for same-day ties, not lexicographic IDs", () => {
    const newsItems = [
      newsFixture({ id: "z-update" }),
      newsFixture({ id: "a-update" }),
    ];
    const expected = sortNewsByDateDesc(newsItems).map(
      (item) => `mily:news:${item.id}`,
    );
    const first = createFixtureFeed({ newsItems });
    const second = createFixtureFeed({ newsItems });

    assert.deepEqual(expected, ["mily:news:z-update", "mily:news:a-update"]);
    assertPortalNewsFollowsSort(first, newsItems);
    assert.deepEqual(first.items.map((item) => item.id), expected);
    assert.deepEqual(second.items.map((item) => item.id), expected);
  });

  it("honors sameDayOrder before source-array order on the same date", () => {
    const newsItems = [
      newsFixture({ id: "later-unranked" }),
      newsFixture({ id: "ranked-first", sameDayOrder: 1 }),
      newsFixture({ id: "aaa-unranked" }),
    ];
    const feed = createFixtureFeed({ newsItems });

    assert.deepEqual(
      sortNewsByDateDesc(newsItems).map((item) => item.id),
      ["ranked-first", "later-unranked", "aaa-unranked"],
    );
    assertPortalNewsFollowsSort(feed, newsItems);
  });

  it("keeps emitted image and item URLs on the Mily site origin", () => {
    const feed = createPortalFeed({
      now: fixedNow,
      generatedAt: fixedGeneratedAt,
    });

    assert.ok(feed.items.some((item) => item.image));
    for (const item of feed.items) {
      assert.equal(new URL(item.url).origin, siteOrigin());
      if (item.image) assert.equal(new URL(item.image).origin, siteOrigin());
    }
  });

  it("rejects external image hotlinks", () => {
    assert.throws(
      () =>
        createFixtureFeed({
          storyItems: [
            storyFixture({
              leadMediaId: "lead-image",
              media: [
                {
                  id: "lead-image",
                  kind: "image",
                  src: "https://images.example.com/mily.jpg",
                  alt: "みりぃの画像",
                  caption: "確認済み画像",
                },
              ],
            }),
          ],
        }),
      /local root-relative path/,
    );
  });

  it("builds only from static data modules without realtime or network fetches", async () => {
    const source = await readFile(path.join(root, "src/data/portalFeed.ts"), "utf8");

    assert.doesNotMatch(source, /\/api\/mily-(?:schedule|live|radio-status)/);
    assert.doesNotMatch(source, /streamSchedule|useStreamSchedule|fetch\s*\(/);
  });
});
