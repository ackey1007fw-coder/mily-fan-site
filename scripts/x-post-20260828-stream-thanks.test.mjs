import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { stories } from "../src/data/stories.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-28-stream-thanks";
const SOURCE = "https://x.com/Mily_chan36/status/2093347548388110372";
const MESSAGE =
  "みんなー！今日の配信も来てくれてありがとうね😊🫶🏻❤️‍🔥\n" +
  "パトン投票もとても助かっております🗳️✨\n" +
  "\n" +
  "明日の配信時間はまだ確定していないので、また連絡するねー！\n" +
  "おつみりぃ💤💤💤\n" +
  "#ミスサークル #ミスサー #ミスサークルコンテスト #ミスサークルコンテスト2026";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-28 stream thanks X post — Latest entry", () => {
  it("adds exactly one source-backed News item with the confirmed JST date", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(
      news.filter((candidate) => candidate.source === SOURCE).length,
      1,
    );
    assert.equal(news.length, 48);
    assert.equal(sortNewsByDateDesc(news)[0]?.id, NEWS_ID);
    assert.equal(sortNewsByDateDesc(news)[1]?.id, "2026-08-28-paton-vote-day-3");
    assert.equal(entry.date, "2026-08-28");
    assert.equal(entry.sameDayOrder, 2);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim, including blank lines", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 6);
    assert.match(
      entry.message.text,
      /^みんなー！今日の配信も来てくれてありがとうね😊🫶🏻❤️‍🔥\n/,
    );
    assert.match(entry.message.text, /パトン投票もとても助かっております🗳️✨\n\n/);
    assert.match(
      entry.message.text,
      /明日の配信時間はまだ確定していないので、また連絡するねー！\n/,
    );
    assert.match(
      entry.message.text,
      /おつみりぃ💤💤💤\n#ミスサークル #ミスサー #ミスサークルコンテスト #ミスサークルコンテスト2026$/,
    );
  });

  it("uses archive wording and does not treat tomorrow as a slot", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.title, /今日の配信ありがとう/);
    assert.match(entry.title, /おつみりぃ/);
    assert.match(entry.body, /8月28日夜/);
    assert.match(entry.body, /配信へのお礼/);
    assert.match(entry.body, /パトン投票/);
    assert.match(entry.body, /翌日の配信時間はまだ確定していない/);
    assert.match(entry.body, /おつみりぃ/);
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
      "8月29日の配信は",
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

describe("2026-08-28 stream thanks X post — scope and ordering", () => {
  it("stays out of Gallery, Gallery videos, Stories, and highlights", async () => {
    assert.equal(media.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(
      galleryVideos.some((entry) => entry.id.includes("stream-thanks")),
      false,
    );
    assert.equal(
      stories.some((entry) => entry.slug.includes("stream-thanks")),
      false,
    );
    assert.equal(
      highlights.some((entry) => entry.id.includes("stream-thanks")),
      false,
    );
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
      assert.equal(source.includes("2093347548388110372"), false, relative);
    }
  });

  it("does not hand-enter a new slot into schedule data", async () => {
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
      assert.equal(source.includes("2093347548388110372"), false, relative);
    }
  });

  it("leads Latest and LIVE STREAM without joining CAMPUS GIRLS", () => {
    const selected = selectActivityNews("live-stream", news, news.length);

    assert.equal(selected[0]?.id, NEWS_ID);
    assert.ok(selected.every(({ activityIds }) => activityIds?.includes("live-stream")));
    assert.equal(
      selectActivityNews("campus-girls", news, news.length).some(
        (entry) => entry.id === NEWS_ID,
      ),
      false,
    );
    assert.equal(
      selectActivityNews("miss-circle", news, news.length).some(
        (entry) => entry.id === NEWS_ID,
      ),
      false,
    );
    assert.equal(
      selectActivityNews("radio", news, news.length).some(
        (entry) => entry.id === NEWS_ID,
      ),
      false,
    );
  });
});

describe("2026-08-28 stream thanks X post — Portal Feed", () => {
  it("flows through Portal Feed without a hardcoded news id or image", async () => {
    const feed = createPortalFeed({ now: new Date("2026-08-28T23:45:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-28T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);

    const portalSource = await readFile(
      path.join(root, "src/data/portalFeed.ts"),
      "utf8",
    );
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes("2093347548388110372"), false);
  });

  it("documents the 8/28 stream-thanks NEWS in CONTENT-OPS", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(ops, /48件/);
    assert.match(ops, /8\/28夜の本人X/);
    assert.match(ops, /おつみりぃ/);
    assert.match(ops, /2093347548388110372/);
    assert.match(ops, /翌日の配信時刻は未確定/);
  });
});
