import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { news as beforeB41 } from "./fixtures/news-before-b41.ts";
import { news as beforeB58 } from "./fixtures/news-before-b58.ts";
import { news as beforeSeptember9 } from "./fixtures/news-before-20260909.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-09-19-showroom-room-name-fourth";
const ADVANCEMENT_ID = "2026-09-16-miss-circle-fourth-round";
const SHOWROOM = "https://www.showroom-live.com/r/circle2026_0734";
const ROOM_NAME = "10/2〜4次🩵三橋莉子🍅✨(みりぃ)#ミスサークル2026";
const TITLE = "SHOWROOMのルーム名が「10/2〜4次」に";
const BODY =
  "9月19日、みりぃのSHOWROOMルーム表示名が「10/2〜4次🩵三橋莉子🍅✨(みりぃ)#ミスサークル2026」になっていることを確認しました。表示名には4次と、開始のめやすとして10/2〜と出ています。";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-19 SHOWROOMルーム名「10/2〜4次」 — Latest entry", () => {
  it("adds exactly one text NEWS card ahead of the 9/18 items, separate from 進出", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);
    const advancement = news.find((candidate) => candidate.id === ADVANCEMENT_ID);

    assert.ok(entry);
    assert.ok(advancement);
    assert.notEqual(entry, advancement);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.id === ADVANCEMENT_ID).length, 1);
    assert.equal(news[0], entry);
    assert.equal(ordered[0], entry);
    assert.equal(ordered[1]?.id, "2026-09-18-kikkake-and-regular-stream");
    assert.equal(ordered[2]?.id, "2026-09-18-campus-girls-paton-15x-story");
    assert.equal(ordered[3]?.id, ADVANCEMENT_ID);
    assert.equal(entry.date, "2026-09-19");
    assert.equal(entry.sameDayOrder, undefined);
    assert.deepEqual(entry.activityIds, ["miss-circle", "live-stream"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.source, SHOWROOM);
    assert.equal(entry.sourceLabel, "SHOWROOMルームを見る");
    assert.equal(entry.ctaLabel, "SHOWROOMを見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.equal(entry.source.includes("room_id="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("quotes the observed room display name and only the 10/2〜 / 4次 timing it shows", () => {
    const entry = item();

    assert.equal(entry.message?.label, "SHOWROOMルーム名");
    assert.equal(entry.message?.text, ROOM_NAME);
    assert.match(entry.body, /9月19日/);
    assert.match(entry.body, /SHOWROOMルーム表示名/);
    assert.match(entry.body, /10\/2〜4次/);
    assert.match(entry.body, /開始のめやすとして10\/2〜/);
    assert.match(entry.body, /三橋莉子/);
    assert.match(entry.body, /みりぃ/);
  });

  it("does not invent formal schedule, venue, vote method, or exact start time", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

    assert.doesNotMatch(copy, /公式|公認|本人運営/);
    assert.doesNotMatch(copy, /10\/12|10月12|WEB投票|会場|投票方法|ギフト審査/);
    assert.doesNotMatch(copy, /12:00|05:00|21:59|23:59|JST/);
    assert.doesNotMatch(copy, /作業メモ|room_id|573253|\?t=/);
    assert.doesNotMatch(copy, /急いで|今すぐ投票|残り/);
    assert.equal(copy.toLowerCase().includes("millie"), false);

    const now = Date.parse("2026-09-19T12:00:00+09:00");
    const resolved = resolveNewsLinks(entry, now);
    assert.deepEqual(resolved.cta, { label: "SHOWROOMを見る", url: SHOWROOM });
    assert.equal(resolved.relatedUrl, undefined);
    assert.equal(resolved.additionalCtas, undefined);
  });
});

describe("2026-09-19 SHOWROOMルーム名「10/2〜4次」 — scope", () => {
  it("surfaces on miss-circle and live-stream Activities", () => {
    assert.equal(
      selectActivityNews("miss-circle", news, news.length)[0]?.id,
      NEWS_ID,
    );
    assert.equal(
      selectActivityNews("live-stream", news, news.length)[0]?.id,
      NEWS_ID,
    );
    for (const activityId of ["campus-girls", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
    }
  });

  it("does not add a room-name schedule slot", () => {
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-19"),
      false,
    );
  });

  it("stays out of Gallery, Stories, highlights, events, and recaps", async () => {
    assert.equal(media.some((entry) => String(entry.id).includes(NEWS_ID)), false);
    assert.equal(
      galleryVideos.some((entry) => String(entry.id ?? "").includes(NEWS_ID)),
      false,
    );
    assert.equal(
      stories.some((entry) => JSON.stringify(entry).includes(NEWS_ID)),
      false,
    );
    assert.equal(
      highlights.some((entry) => String(entry.id).includes(NEWS_ID)),
      false,
    );
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
    assert.equal(
      events.some((entry) => String(entry.id ?? "").includes(NEWS_ID)),
      false,
    );

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/profile.ts",
      "src/data/contest.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
    ]) {
      const sourceText = await readFile(path.join(root, relative), "utf8");
      assert.equal(sourceText.includes(NEWS_ID), false, relative);
    }
  });

  it("keeps historical NEWS fixtures on their original snapshots", () => {
    for (const snapshot of [beforeB41, beforeB58, beforeSeptember9]) {
      assert.equal(
        snapshot.some((candidate) => candidate.id === NEWS_ID),
        false,
      );
    }
  });

  it("does not scrape SHOWROOM image hosts", async () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

    for (const phrase of [
      "Millie",
      "millie",
      "公式サイト",
      "公認",
      "本人運営",
      "image.showroom-live.com",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }

    const source = await readFile(path.join(root, "src/data/news.ts"), "utf8");
    assert.equal(source.includes("image.showroom-live.com"), false);
    assert.equal(DRIVE_HOST_PATTERN.test(source), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(source), false);
    assert.equal(source.toLowerCase().includes("millie"), false);
  });
});

describe("2026-09-19 SHOWROOMルーム名「10/2〜4次」 — Portal Feed", () => {
  it("flows through Portal Feed as text-only NEWS", () => {
    const feed = createPortalFeed({
      newsItems: news,
      now: new Date("2026-09-19T12:00:00+09:00"),
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-19T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SHOWROOM);
    assert.equal(entry.image, undefined);
  });
});
