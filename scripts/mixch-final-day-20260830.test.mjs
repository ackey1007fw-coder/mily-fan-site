import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { events } from "../src/data/events.ts";
import {
  galleryVideos,
  mixchFinalDayMovie,
  mixchExpressiveMovie,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { news, newsDisplayMedia, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { verifyNews } from "./content-invariants.mjs";
import { readFile } from "node:fs/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-08-30-mixch-final-day";
const MIXCH_URL = "https://mixch.tv/m/UBHJplv4";
const X_SOURCE = "https://x.com/Mily_chan36/status/2093799709219704887";
const FIST = "\u{270A}\u{1F3FB}";
const HEART_EXCLAMATION = "\u{2763}\u{FE0F}";
const FULLWIDTH_BANGS = "\u{FF01}".repeat(6);
const PLEADING_THANKS = "\u{1F979}\u{1F64F}\u{1F3FB}\u{2728}";
const MESSAGE =
  "#ミクチャ で動画を投稿したよ！見に来てね！\n" +
  `『配信＆ムービーは今日が最終日${FIST}${HEART_EXCLAMATION}絶対に本戦行くんだ${FULLWIDTH_BANGS}皆様の力を貸してください${PLEADING_THANKS}』\u{3000}${MIXCH_URL}`;

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-30 Mixch final-day NEWS", () => {
  it("adds one JST-dated NEWS item with X source, Mixch CTA, and shared outbound media", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === X_SOURCE).length, 1);
    assert.equal(entry.date, "2026-08-30");
    assert.equal(entry.sameDayOrder, undefined);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.source, X_SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, MIXCH_URL);
    assert.equal(entry.ctaLabel, "Mixchで見る");
    assert.equal(entry.media, mixchFinalDayMovie);
    assert.equal(entry.media.kind, "mixch");
    assert.equal(entry.media.mixchUrl, MIXCH_URL);
    assert.equal(entry.media.accountUrl, "https://mixch.tv/u/10114673");
    assert.equal(typeof entry.media.src, "undefined");
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews(news), []);
  });

  it("summarizes the caption without inventing a win, ranking, or schedule slot", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.title, /配信＆ムービーは今日が最終日/);
    assert.match(entry.title, /絶対に本戦行くんだ/);
    assert.match(entry.body, /8月30日/);
    assert.match(entry.body, /Mixch/);
    assert.match(entry.body, /配信＆ムービーは今日が最終日/);
    assert.match(entry.body, /絶対に本戦行くんだ/);
    assert.match(entry.body, /皆様の力を貸してください/);
    assert.match(entry.body, /CAMPUS GIRLS/);

    for (const phrase of [
      "優勝",
      "1位",
      "順位",
      "Paton",
      "SHOWROOM",
      "行った",
      "行ってきた",
      "本戦進出",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("keeps the X announcement verbatim with Mixch-page emoji and fullwidth bangs", async () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのX投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 2);
    assert.match(entry.message.text, /^#ミクチャ で動画を投稿したよ！見に来てね！\n/u);
    assert.match(entry.message.text, /『配信＆ムービーは今日が最終日/u);
    assert.equal(entry.message.text.includes("\u{270A}\u{1F3FB}"), true);
    assert.equal(entry.message.text.includes("\u{2763}\u{FE0F}"), true);
    assert.equal(entry.message.text.includes("\u{FF01}".repeat(6)), true);
    assert.equal(entry.message.text.includes("!"), false);
    assert.equal(entry.message.text.includes("\u{2764}"), false);

    const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
    assert.match(newsSource, /\\u\{270A\}\\u\{1F3FB\}\\u\{2763\}\\u\{FE0F\}/);
    assert.match(newsSource, /\\u\{FF01\}\\u\{FF01\}\\u\{FF01\}\\u\{FF01\}\\u\{FF01\}\\u\{FF01\}/);
    assert.match(newsSource, /\\u\{1F979\}\\u\{1F64F\}\\u\{1F3FB\}\\u\{2728\}/);
    assert.match(newsSource, /\\u\{3000\}/);
  });

  it("leads Latest ahead of the 8/29 SHOWROOM posts", () => {
    const ordered = sortNewsByDateDesc(news);
    assert.equal(ordered[0]?.id, "2026-08-30-campus-girls-hold-second-story");
    assert.equal(ordered[1]?.id, "2026-08-30-morning-showroom-0600");
    assert.equal(ordered[2]?.id, NEWS_ID);
    assert.equal(ordered[3]?.id, "2026-08-29-paton-vote-day-5-story");
    assert.equal(ordered[4]?.id, "2026-08-29-showroom-live-third-round");
    assert.equal(ordered[5]?.id, "2026-08-29-showroom-radio-1440");
    assert.equal(ordered[6]?.id, "2026-08-29-paton-vote-day-4-story");
    assert.equal(news.length, 57);
  });

  it("appears on CAMPUS GIRLS and is derived into the Portal Feed without a local image", () => {
    const selected = selectActivityNews("campus-girls", news, news.length);
    const feed = createPortalFeed();
    const feedItem = feed.items.find(
      (candidate) => candidate.id === `mily:news:${NEWS_ID}`,
    );

    assert.equal(selected[0]?.id, "2026-08-30-campus-girls-hold-second-story");
    assert.equal(selected[1]?.id, NEWS_ID);
    assert.equal(selected[2]?.id, "2026-08-29-paton-vote-day-5-story");
    assert.ok(feedItem);
    assert.equal(feedItem.publishedAt, "2026-08-30T00:00:00+09:00");
    assert.equal(feedItem.sourceUrl, X_SOURCE);
    assert.equal(feedItem.image, undefined);
  });

  it("shares one object between NEWS and Gallery and stays off Activity media", () => {
    const gallery = selectGalleryEntries().filter((entry) => entry.kind === "mixch");

    assert.equal(item().media, mixchFinalDayMovie);
    assert.equal(gallery[0]?.item, mixchFinalDayMovie);
    assert.equal(gallery[1]?.item, mixchExpressiveMovie);
    assert.equal(gallery[2]?.item, mixch15xDayMovie);
    assert.equal(gallery[3]?.item, mixchConfidenceMessageMovie);
    assert.equal(galleryVideos.filter((entry) => entry.kind === "mixch").length, 4);

    const activityMedia = selectActivityMedia("campus-girls");
    assert.equal(activityMedia.includes(mixchFinalDayMovie), false);
    assert.equal(
      activityMedia.some((media) => media.kind === "mixch"),
      false,
    );
    assert.equal(newsDisplayMedia(item()).includes(mixchFinalDayMovie), true);
    assert.equal(visibleGalleryVideos().includes(mixchFinalDayMovie), true);
  });

  it("does not add Mixch movies to events or streamSchedule or copy files", async () => {
    assert.deepEqual(events, []);
    assert.deepEqual(streamSchedule, []);
    assert.equal(JSON.stringify(events).includes("UBHJplv4"), false);
    assert.equal(JSON.stringify(streamSchedule).includes("UBHJplv4"), false);

    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"));
    const originalFiles = (
      await readdir(path.join(root, "media/original"), { recursive: true }).catch(
        () => [],
      )
    ).map((file) => String(file).replaceAll("\\", "/"));

    for (const file of [...publicFiles, ...originalFiles]) {
      assert.equal(file.includes("_movie_mps"), false, file);
      assert.equal(file.includes("UBHJplv4"), false, file);
      assert.equal(file.includes("mixch-final-day"), false, file);
    }

    assert.equal(mixchFinalDayMovie.poster.startsWith("/media/"), false);
    assert.match(mixchFinalDayMovie.poster, /thumb_normal/);
    assert.equal(mixchFinalDayMovie.width, 480);
    assert.equal(mixchFinalDayMovie.height, 853);
  });
});
