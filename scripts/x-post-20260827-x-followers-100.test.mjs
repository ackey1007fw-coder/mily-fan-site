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

const NEWS_ID = "2026-08-27-x-followers-100";
const SOURCE = "https://x.com/Mily_chan36/status/2092884427605266708";
const MESSAGE =
  "X初心者\u{1F530}で上手く使いこなせない中、なんとフォロワー様100人になりました〜\u{1F979}\u{1F44F}\u{1F3FB}\u{2764}\u{FE0F}\u{200D}\u{1F525}\n" +
  "ありがとうございます\u{1F972}\u{2728}\n" +
  "変動はあるだろうけど、これからも楽しく発信していきますね\u{266A}\n" +
  "これからもよろしくです\u{FF01}\u{FF01}\n" +
  "#ミスサー #キャンガル #ミスサー2026 #キャンガル2027 #ミスコン";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-27 X followers 100 — Latest entry", () => {
  it("adds exactly one source-backed News item with the confirmed JST date", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(
      news.filter((candidate) => candidate.source === SOURCE).length,
      1,
    );
    assert.equal(entry.date, "2026-08-27");
    assert.equal(entry.sameDayOrder, 1);
    assert.equal(entry.activityIds, undefined);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim, including blank-line-free line breaks", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 5);
    assert.match(
      entry.message.text,
      /^X初心者\u{1F530}で上手く使いこなせない中、なんとフォロワー様100人になりました〜\u{1F979}\u{1F44F}\u{1F3FB}\u{2764}\u{FE0F}\u{200D}\u{1F525}\n/u,
    );
    assert.match(entry.message.text, /ありがとうございます\u{1F972}\u{2728}\n/u);
    assert.match(
      entry.message.text,
      /変動はあるだろうけど、これからも楽しく発信していきますね\u{266A}\n/u,
    );
    assert.match(
      entry.message.text,
      /これからもよろしくです\u{FF01}\u{FF01}\n#ミスサー #キャンガル #ミスサー2026 #キャンガル2027 #ミスコン$/u,
    );
  });

  it("uses archive wording and does not freeze a live follower count", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.title, /Xフォロワー100人/);
    assert.match(entry.body, /8月27日/);
    assert.match(entry.body, /フォロワー100人を報告しました/);
    assert.match(entry.body, /X初心者/);
    assert.match(entry.body, /ありがとうございます/);
    assert.match(entry.body, /変動はある/);
    assert.match(entry.body, /楽しく発信/);
    assert.match(entry.body, /これからもよろしくです/);

    for (const phrase of [
      "現在フォロワー",
      "フォロワー数",
      "達成したので",
      "配信します",
      "今夜の配信",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("contains no rankings, engagement metrics, or invented contest facts", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    for (const phrase of [
      "現在順位",
      "順位",
      "得票",
      "SHOWROOMポイント",
      "いいね",
      "リポスト",
      "RP数",
      "閲覧数",
      "審査員賞",
      "ファイナル進出",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });
});

describe("2026-08-27 X followers 100 — scope and ordering", () => {
  it("stays out of Gallery, Gallery videos, Stories, highlights, and profile facts", async () => {
    assert.equal(media.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(galleryVideos.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(stories.some((entry) => entry.slug.includes("x-followers-100")), false);
    assert.equal(highlights.some((entry) => entry.id.includes("x-followers-100")), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/profile.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("2092884427605266708"), false, relative);
    }
  });

  it("does not hand-enter a follower count or new slot into schedule data", async () => {
    const { events } = await import("../src/data/events.ts");
    const { streamSchedule } = await import("../src/data/streamSchedule.ts");
    const { supportEvents } = await import("../src/data/supportEvents.ts");

    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.every((slot) => slot.date.startsWith("2026-09-") && slot.date >= "2026-09-03"),
      true,
    );
    assert.equal(
      supportEvents.some((entry) => JSON.stringify(entry).includes(NEWS_ID)),
      false,
    );

    for (const relative of ["src/data/events.ts", "src/data/streamSchedule.ts"]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("2092884427605266708"), false, relative);
    }
  });

  it("follows the Paton guide and keeps Mixch plus the two Story items behind it", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-movie-night")).map((entry) => entry.id);

    assert.equal(ordered[0], "2026-08-27-paton-vote-how-to");
    assert.equal(ordered[1], NEWS_ID);
    assert.equal(ordered[2], "2026-08-27-mixch-expressive");
    assert.equal(ordered[3], "2026-08-27-seaside-circle-movie-theme-story");
    assert.equal(ordered[4], "2026-08-27-miss-circle-showroom-story");
    assert.equal(ordered[5], "2026-08-26-girlsaward-showroom-6th");
    assert.equal(news.length, 49);
    assert.equal(news.filter((entry) => entry.date === "2026-08-27").length, 6);
    assert.equal(item().media, undefined);
    assert.equal(item().additionalMedia, undefined);
  });

  it("is not classified onto Activity pages", () => {
    for (const activityId of ["live-stream", "radio", "miss-circle", "campus-girls"]) {
      const selected = selectActivityNews(activityId, news, news.length);
      assert.equal(
        selected.some((entry) => entry.id === NEWS_ID),
        false,
        activityId,
      );
    }
  });
});

describe("2026-08-27 X followers 100 — Portal Feed", () => {
  it("flows through Portal Feed without a hardcoded news id or image", async () => {
    const feed = createPortalFeed({ now: new Date("2026-08-27T17:00:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-27T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);

    const portalSource = await readFile(path.join(root, "src/data/portalFeed.ts"), "utf8");
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes("2092884427605266708"), false);
  });

  it("keeps the existing message rendering contract for quoted posts", async () => {
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    assert.match(latest, /whitespace-pre-line break-words/);
  });
});
