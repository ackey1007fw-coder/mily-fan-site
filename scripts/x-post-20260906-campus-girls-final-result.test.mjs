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

const NEWS_ID = "2026-09-06-campus-girls-final-result";
const NIGHT_SLOT_ID = "2026-09-06-night-slot-2230";
const THANKS_ID = "2026-09-05-morning-stream-thanks";
const SOURCE = "https://x.com/Mily_chan36/status/2096422676395114801";
const TWEET_ID = "2096422676395114801";
const TITLE = "キャンガル予選final、本戦進出";
const BODY =
  "みりぃがXで、CAMPUS GIRLS 2027（キャンガル2027）予選finalの結果を報告しました。総合は審査員賞、面接審査1位、Paton投票審査2位で、本戦進出が決まりました。";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-06 X キャンガル予選final結果 — Latest entry", () => {
  it("adds exactly one source-backed text NEWS card ahead of the same-day night-slot", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(
      news.filter((candidate) => (candidate.source ?? "").includes(TWEET_ID)).length,
      1,
    );
    assert.equal(ordered[0], entry);
    assert.equal(ordered[1]?.id, NIGHT_SLOT_ID);
    assert.equal(ordered[2]?.id, THANKS_ID);
    assert.equal(entry.date, "2026-09-06");
    assert.equal(entry.sameDayOrder, 30);
    assert.ok((entry.sameDayOrder ?? 0) > (ordered[1]?.sameDayOrder ?? 0));
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "みりぃのX");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.message, undefined);
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps a short fan NEWS body with only the confirmed result facts", () => {
    const entry = item();

    assert.match(entry.body, /CAMPUS GIRLS 2027（キャンガル2027）予選final/);
    assert.match(entry.body, /総合は審査員賞/);
    assert.match(entry.body, /面接審査1位/);
    assert.match(entry.body, /Paton投票審査2位/);
    assert.match(entry.body, /本戦進出/);
    assert.doesNotMatch(entry.body, /会場|アリーナ|ホール|日程|決勝日|本戦日/);
    assert.ok(entry.body.length <= 120);
  });

  it("does not add vote buttons, hurry copy, or 公式/公認 claims", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.doesNotMatch(copy, /公式|公認|本人運営/);
    assert.doesNotMatch(copy, /JST|\blive\b|作業メモ/i);
    assert.doesNotMatch(copy, /急いで|今すぐ投票|残り|投票して|応援して/);
    assert.doesNotMatch(copy, /CanCam|AGESTOCK|横浜アリーナ/);
    assert.equal(copy.toLowerCase().includes("millie"), false);

    const now = Date.parse("2026-09-06T12:00:00+09:00");
    const resolved = resolveNewsLinks(entry, now);
    assert.equal(resolved.cta, undefined);
    assert.equal(resolved.additionalCtas, undefined);
    assert.equal(resolved.relatedUrl, undefined);
  });
});

describe("2026-09-06 X キャンガル予選final結果 — scope", () => {
  it("surfaces on the campus-girls Activity only", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    assert.equal(campusNews[0]?.id, NEWS_ID);
    for (const activityId of ["live-stream", "miss-circle", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
    }
    const liveNews = selectActivityNews("live-stream", news, news.length);
    assert.equal(liveNews[0]?.id, NIGHT_SLOT_ID);
  });

  it("does not edit the existing night-slot or morning-thanks NEWS", () => {
    const night = news.find((candidate) => candidate.id === NIGHT_SLOT_ID);
    const thanks = news.find((candidate) => candidate.id === THANKS_ID);

    assert.equal(night?.title, "今夜の配信、22:30から");
    assert.equal(night?.sameDayOrder, 20);
    assert.equal(night?.source, "https://x.com/Mily_chan36/status/2096366715181691270");
    assert.equal(thanks?.title, "朝配信ありがとう");
    assert.equal(thanks?.sameDayOrder, 20);
    assert.equal(thanks?.source, "https://x.com/Mily_chan36/status/2096037739833737354");
    assert.notEqual(night?.source, SOURCE);
    assert.notEqual(thanks?.source, SOURCE);
  });

  it("stays out of Gallery, Stories, highlights, and schedule data", async () => {
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
    assert.deepEqual(events, []);

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
      assert.equal(sourceText.includes(TWEET_ID), false, relative);
    }

    assert.deepEqual(
      streamSchedule.filter((slot) => slot.date === "2026-09-06"),
      [
        { date: "2026-09-06", time: "05:30", endTime: "07:00" },
        { date: "2026-09-06", time: "21:30" },
      ],
    );
  });

  it("does not invent other people, sites, or SNS media URLs", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    for (const phrase of [
      "Millie",
      "millie",
      "公式サイト",
      "公認",
      "本人運営",
      "pbs.twimg.com",
      "video.twimg.com",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("does not scrape X image hosts in the NEWS or ops notes", async () => {
    for (const relative of ["src/data/news.ts", "docs/CONTENT-OPS.md"]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("pbs.twimg.com"), false, relative);
      assert.equal(source.includes("video.twimg.com"), false, relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.equal(DRIVE_FOLDER_PATTERN.test(source), false, relative);
      assert.equal(source.toLowerCase().includes("millie"), false, relative);
    }
  });
});

describe("2026-09-06 X キャンガル予選final結果 — Portal Feed", () => {
  it("flows through Portal Feed as text-only NEWS", () => {
    const feed = createPortalFeed({
      newsItems: news,
      now: new Date("2026-09-06T16:00:00+09:00"),
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-06T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);
  });
});
