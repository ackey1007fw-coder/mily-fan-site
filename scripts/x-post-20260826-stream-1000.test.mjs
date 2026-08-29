import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { galleryVideos } from "./fixtures/gallery-videos-before-b41.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b41.ts";
import { createPortalFeed } from "./fixtures/portal-feed-before-b41.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { stories } from "../src/data/stories.ts";
import { selectActivityNews } from "./fixtures/activity-content-before-b41.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-26-stream-1000";
const SOURCE = "https://x.com/Mily_chan36/status/2092303118142939171";
const MESSAGE =
  "皆さん今日もお疲れ様\u{1F642}\u200D\u2195\uFE0F\u{1F340}\n\n26日の配信は10:00\u301C11:00\u270A\u{1F3FB}\u2728\n\n夜できるといいなぁ\u{1F972}\nおやすみなさい\u{1F4A4}\n\n#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサークルコンテスト2026";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-26 10:00 stream X announcement — Latest entry", () => {
  it("adds exactly one source-backed News item with the confirmed JST date", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(
      news.filter((candidate) => candidate.source === SOURCE).length,
      1,
    );
    assert.equal(entry.date, "2026-08-26");
    assert.equal(entry.sameDayOrder, undefined);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim, including blank lines", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 8);
    assert.match(entry.message.text, /^皆さん今日もお疲れ様\u{1F642}\u200D\u2195\uFE0F\u{1F340}\n\n/u);
    assert.match(entry.message.text, /26日の配信は10:00\u301C11:00\u270A\u{1F3FB}\u2728\n\n/u);
    assert.match(entry.message.text, /夜できるといいなぁ\u{1F972}\nおやすみなさい\u{1F4A4}\n\n#ミスサー/u);
    assert.match(entry.message.text, /#ミスサークルコンテスト2026$/);
  });

  it("uses archive wording and does not treat the night hope as a slot", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.body, /8月26日未明/);
    assert.match(entry.body, /26日の配信は10:00〜11:00と伝えました/);
    assert.match(entry.body, /夜できるといいなぁという言葉/);
    assert.match(entry.body, /「おやすみなさい」も残されています/);
    assert.equal(copy.includes("SHOWROOM"), false);
    assert.equal(copy.includes("ミスサークル"), false);

    for (const phrase of [
      "配信します",
      "今夜の配信",
      "現在予定されている配信",
      "夜枠",
      "夜配信",
      "夜の配信",
      "22:00",
      "22:30",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("contains no rankings, engagement metrics, or unrelated contest facts", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

    for (const phrase of [
      "現在順位",
      "順位",
      "得票",
      "SHOWROOMポイント",
      "いいね",
      "リポスト",
      "RP数",
      "閲覧数",
      "フォロワー数",
      "CAMPUS GIRLS",
      "審査員賞",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });
});

describe("2026-08-26 10:00 stream X announcement — scope and ordering", () => {
  it("stays out of Gallery, Gallery videos, Stories, and highlights", async () => {
    assert.equal(media.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(galleryVideos.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(stories.some((entry) => entry.slug.includes("stream-1000")), false);
    assert.equal(highlights.some((entry) => entry.id.includes("stream-1000")), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("2092303118142939171"), false, relative);
    }
  });

  it("does not hand-enter the 10:00 slot into schedule data", async () => {
    const { events } = await import("../src/data/events.ts");
    const { streamSchedule } = await import("../src/data/streamSchedule.ts");
    const { supportEvents } = await import("../src/data/supportEvents.ts");

    assert.deepEqual(events, []);
    assert.deepEqual(streamSchedule, []);
    assert.equal(
      supportEvents.some((entry) => JSON.stringify(entry).includes(NEWS_ID)),
      false,
    );

    for (const relative of ["src/data/events.ts", "src/data/streamSchedule.ts"]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("2092303118142939171"), false, relative);
    }
  });

  it("stays among the 2026-08-26 News items after the GirlsAward post", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-movie-night")).map((entry) => entry.id);

    assert.equal(ordered[0], "2026-08-26-girlsaward-showroom-6th");
    assert.equal(ordered[1], "2026-08-26-paton-vote-stories");
    assert.equal(ordered[2], "2026-08-26-instagram-followers-400");
    assert.equal(ordered[3], "2026-08-26-morning-stream-thanks");
    assert.equal(ordered[4], "2026-08-26-girl-award-event-fanroom");
    assert.equal(ordered[5], "2026-08-26-mixch-15x-day");
    assert.equal(ordered[6], NEWS_ID);
    assert.equal(ordered[7], "2026-08-25-mixch-confidence-message");
    assert.equal(ordered[8], "2026-08-25-motivation");
    assert.equal(news.length, 48);
    assert.equal(news.filter((entry) => entry.date === "2026-08-26").length, 7);
    assert.equal(item().media, undefined);
    assert.equal(item().additionalMedia, undefined);
  });

  it("appears on the LIVE STREAM Activity page through explicit activityIds", () => {
    const selected = selectActivityNews("live-stream", news, news.length);
    assert.ok(selected.some((entry) => entry.id === NEWS_ID));
    assert.equal(selected[0]?.id, "2026-08-28-stream-thanks");
    assert.equal(selected[1]?.id, "2026-08-26-girlsaward-showroom-6th");
    assert.equal(selected[2]?.id, "2026-08-26-morning-stream-thanks");
    assert.equal(selected[3]?.id, "2026-08-26-girl-award-event-fanroom");
    assert.equal(selected[4]?.id, NEWS_ID);
    assert.ok(selected.every(({ activityIds }) => activityIds?.includes("live-stream")));
    assert.equal(
      selectActivityNews("miss-circle", news, news.length).some(
        (entry) => entry.id === NEWS_ID,
      ),
      false,
    );
  });
});

describe("2026-08-26 10:00 stream X announcement — Portal Feed", () => {
  it("flows through Portal Feed without a hardcoded news id or image", async () => {
    const feed = createPortalFeed({ now: new Date("2026-08-26T02:30:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-26T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);

    const portalSource = await readFile(path.join(root, "src/data/portalFeed.ts"), "utf8");
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes("2092303118142939171"), false);
  });

  it("keeps the existing message rendering contract for quoted posts", async () => {
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    assert.match(latest, /whitespace-pre-line break-words/);
  });
});
