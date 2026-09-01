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
import { contest } from "../src/data/contest.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-09-01-ohayo-september-x";
const SEPTEMBER_STORY_ID = "2026-09-01-september-mily-story";
const FINAL_DAY_STORY_ID = "2026-09-01-paton-vote-final-day-story";
const SOURCE = "https://x.com/Mily_chan36/status/2094579904587382930";
const TWEET_ID = "2094579904587382930";
const WAVE_DASH = "\u{301C}";
const SUN = "\u{1F31E}";
const PROLONGED = "\u{30FC}";
const FULLWIDTH_BANG = "\u{FF01}";
const MESSAGE = `おはよ${WAVE_DASH}${SUN}\n今日から9月${PROLONGED}${FULLWIDTH_BANG}${FULLWIDTH_BANG}`;

const FORBIDDEN_PEOPLE_SITES = [
  "Millie",
  "millie",
  "あっきー",
  "Ackey",
  "公式サイト",
  "公認",
  "本人運営",
  "tiktok.com",
  "instagram.com",
  "pbs.twimg.com",
  "video.twimg.com",
  "amplify_video",
  "_movie_mps",
];

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-01 X おはよ〜 今日から9月ー — Latest entry", () => {
  it("adds exactly one source-backed News item ahead of the 9/1 Instagram Stories", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(
      news.filter((candidate) => (candidate.source ?? "").includes(TWEET_ID)).length,
      1,
    );
    assert.equal(news.length, 70);
    assert.equal(ordered[0]?.id, NEWS_ID);
    assert.equal(ordered[1]?.id, FINAL_DAY_STORY_ID);
    assert.equal(ordered[2]?.id, SEPTEMBER_STORY_ID);
    assert.equal(entry.date, "2026-09-01");
    assert.equal(entry.sameDayOrder, 3);
    assert.equal(news.find((candidate) => candidate.id === FINAL_DAY_STORY_ID)?.sameDayOrder, 2);
    assert.equal(news.find((candidate) => candidate.id === SEPTEMBER_STORY_ID)?.sameDayOrder, 1);
    assert.equal(entry.activityIds, undefined);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed greeting verbatim, including the line break and no hashtags", () => {
    const entry = item();

    assert.equal(entry.title, "おはよ〜 今日から9月ー");
    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 2);
    assert.equal(entry.message.text.includes("#"), false);
    assert.equal(entry.message.text.includes(WAVE_DASH), true);
    assert.equal(entry.message.text.includes(SUN), true);
    assert.equal(entry.message.text.includes(PROLONGED), true);
    assert.equal(entry.message.text.includes(FULLWIDTH_BANG), true);
    assert.equal(entry.message.text.includes("!"), false);
  });

  it("uses archive wording and stays a greeting-only NEWS card", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

    assert.equal(
      entry.body,
      "9月1日朝、みりぃがXで「おはよ〜 今日から9月ー！！」とあいさつした。約3秒の動画付き。",
    );
    assert.match(entry.body, /9月1日朝/);
    assert.match(entry.body, /あいさつした/);
    assert.match(entry.body, /約3秒の動画付き/);

    for (const phrase of [
      "配信します",
      "現在予定されている配信",
      "ファイナル進出",
      "グランプリ",
      "現在順位",
      "得票",
      "Paton",
      "パトン",
      "CAMPUS GIRLS",
      "SHOWROOM",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("does not merge with the existing 9/1 Instagram Story greeting", () => {
    const story = news.find((entry) => entry.id === SEPTEMBER_STORY_ID);

    assert.ok(story);
    assert.equal(news.filter((entry) => entry.id === SEPTEMBER_STORY_ID).length, 1);
    assert.equal(story.media?.id, "mily-b46-02-september-mily-story");
    assert.notEqual(item().id, story.id);
    assert.notEqual(item().source, story.source);
    assert.equal(item().media, undefined);
  });
});

describe("2026-09-01 X おはよ〜 今日から9月ー — scope and identity", () => {
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

  it("stays out of Gallery, Stories, highlights, profile, and schedule files", async () => {
    assert.equal(media.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(galleryVideos.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(stories.some((entry) => JSON.stringify(entry).includes(NEWS_ID)), false);
    assert.equal(highlights.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
    assert.deepEqual(events, []);
    assert.deepEqual(streamSchedule, []);
    assert.equal(contest.currentPhase?.name, "3次審査進出");

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/profile.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
      "src/data/contest.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes(TWEET_ID), false, relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.equal(DRIVE_FOLDER_PATTERN.test(source), false, relative);
    }

    const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
    assert.equal(newsSource.includes("pbs.twimg.com"), false);
    assert.equal(newsSource.includes("video.twimg.com"), false);
    assert.equal(DRIVE_HOST_PATTERN.test(newsSource), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(newsSource), false);

    const copy = `${item().title}\n${item().body}\n${item().message?.text ?? ""}`;
    for (const phrase of FORBIDDEN_PEOPLE_SITES) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
    assert.equal(copy.toLowerCase().includes("millie"), false);
  });
});

describe("2026-09-01 X おはよ〜 今日から9月ー — Portal Feed and CONTENT-OPS", () => {
  it("flows through Portal Feed without a hardcoded news id or image", async () => {
    const feed = createPortalFeed({ now: new Date("2026-09-01T09:20:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-01T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);

    const portalSource = await readFile(path.join(root, "src/data/portalFeed.ts"), "utf8");
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes(TWEET_ID), false);
  });

  it("documents the NEWS-only greeting and waiting Drive cut", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(ops, /70件/);
    assert.match(ops, /2094579904587382930/);
    assert.match(ops, /おはよ〜 今日から9月ー/);
    assert.match(ops, /テキストNEWS＋出典リンクのみ/);
    assert.match(ops, /Drive本人カットは未指定/);
    assert.match(ops, /sameDayOrder: 3/);
    assert.match(ops, /2026-09-01-september-mily-story/);
    assert.equal(DRIVE_HOST_PATTERN.test(ops), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(ops), false);
  });
});
