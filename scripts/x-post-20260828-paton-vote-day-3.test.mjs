import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { campusGirlsPatonPortraitImage } from "../src/data/campusGirlsPatonImages.ts";
import { events } from "../src/data/events.ts";
import { campusGirlsPatonVoteLink } from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-08-28-paton-vote-day-3";
const SOURCE = "https://x.com/Mily_chan36/status/2093262992289026404";
const START = Date.parse("2026-08-26T18:00:00+09:00");
const END = Date.parse("2026-09-01T23:59:00+09:00");
const MESSAGE =
  "CAMPUS GIRLS 2027 予選A FinalSTAGEに三橋莉子（みりぃ）🍅✨さんが出場中！\n" +
  "\n" +
  "【3日目！！！！】\n" +
  "\n" +
  "みんなで三橋莉子（みりぃ）🍅✨さんを応援しよう✨\n" +
  "応援はこちらから👇\n" +
  "https://paton.jp/event/entrant/11380\n" +
  "#CAMPUS GIRLS 2027 予選A FinalSTAGE #paton";
const FORBIDDEN = [
  "2位",
  "7位",
  "1位",
  "現在順位",
  "得票",
  "Millie",
  "millie",
  "公式",
  "公認",
  "本人運営",
  "今すぐ投票",
  "TOP個人サポーター",
];

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-08-28 CAMPUS GIRLS Paton vote day 3 — Latest entry", () => {
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
    assert.equal(entry.date, "2026-08-28");
    assert.equal(entry.sameDayOrder, undefined);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, campusGirlsPatonVoteLink.url);
    assert.equal(entry.ctaLabel, campusGirlsPatonVoteLink.label);
    assert.equal(entry.media, campusGirlsPatonPortraitImage);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim, including blank lines", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 8);
    assert.match(
      entry.message.text,
      /^CAMPUS GIRLS 2027 予選A FinalSTAGEに三橋莉子（みりぃ）🍅✨さんが出場中！\n\n/,
    );
    assert.match(entry.message.text, /\n【3日目！！！！】\n\n/);
    assert.match(entry.message.text, /みんなで三橋莉子（みりぃ）🍅✨さんを応援しよう✨\n/);
    assert.match(entry.message.text, /応援はこちらから👇\n/);
    assert.match(
      entry.message.text,
      /https:\/\/paton\.jp\/event\/entrant\/11380\n#CAMPUS GIRLS 2027 予選A FinalSTAGE #paton$/,
    );
  });

  it("uses archive wording and does not freeze a live rank", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text}`;

    assert.match(entry.title, /予選A FinalSTAGE/);
    assert.match(entry.title, /3日目/);
    assert.match(entry.body, /8月28日/);
    assert.match(entry.body, /CAMPUS GIRLS 2027/);
    assert.match(entry.body, /予選A FinalSTAGE/);
    assert.match(entry.body, /3日目/);
    assert.match(entry.body, /Paton/);
    assert.match(entry.body, /応援/);

    for (const phrase of FORBIDDEN) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("hides the Paton CTA after the confirmed window while keeping the X source", () => {
    const entry = item();
    const during = resolveNewsLinks(entry, START);
    const atEnd = resolveNewsLinks(entry, END);
    const after = resolveNewsLinks(entry, END + 1);

    assert.equal(during.cta?.url, campusGirlsPatonVoteLink.url);
    assert.equal(during.cta?.label, campusGirlsPatonVoteLink.label);
    assert.equal(atEnd.cta?.url, campusGirlsPatonVoteLink.url);
    assert.equal(after.relatedUrl, undefined);
    assert.equal(after.cta, undefined);
    assert.equal(entry.source, SOURCE);
  });
});

describe("2026-08-28 CAMPUS GIRLS Paton vote day 3 — scope and ordering", () => {
  it("leads CAMPUS GIRLS Activity NEWS without adding Gallery, STORY, or events", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const campusPreview = selectActivityNews("campus-girls");
    const campusMedia = selectActivityMedia("campus-girls");

    assert.equal(campusNews[0]?.id, NEWS_ID);
    assert.equal(campusPreview[0]?.id, NEWS_ID);
    assert.equal(campusNews[1]?.id, "2026-08-27-paton-vote-how-to");
    assert.equal(campusMedia[0], campusGirlsPatonPortraitImage);
    assert.equal(
      selectActivityNews("radio").some((entry) => entry.id === NEWS_ID),
      false,
    );
    assert.equal(
      selectActivityNews("miss-circle").some((entry) => entry.id === NEWS_ID),
      false,
    );
    assert.equal(
      selectActivityNews("live-stream").some((entry) => entry.id === NEWS_ID),
      false,
    );
    assert.equal(media.some((entry) => entry.id.includes(NEWS_ID)), false);
    assert.equal(
      galleryVideos.some((entry) => entry.id.includes("paton-vote-day-3")),
      false,
    );
    assert.equal(
      stories.some((entry) => JSON.stringify(entry).includes(NEWS_ID)),
      false,
    );
    assert.equal(
      highlights.some((entry) => entry.id.includes("paton-vote-day-3")),
      false,
    );
    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.some((entry) => JSON.stringify(entry).includes(NEWS_ID)),
      false,
    );
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
  });

  it("does not hand-enter a new slot into schedule or profile data", async () => {
    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/profile.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("2093262992289026404"), false, relative);
    }
  });

  it("reuses the confirmed Paton portrait instead of hotlinking X media", async () => {
    const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
    assert.equal(newsSource.includes("pbs.twimg.com"), false);
    assert.equal(newsSource.includes("video.twimg.com"), false);
    assert.equal(newsSource.includes("amplify_video"), false);
    assert.equal(item().media, campusGirlsPatonPortraitImage);
  });
});

describe("2026-08-28 CAMPUS GIRLS Paton vote day 3 — Portal Feed", () => {
  it("flows through Portal Feed without a hardcoded news id", async () => {
    const feed = createPortalFeed({ now: new Date("2026-08-28T18:10:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-28T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(
      entry.image,
      "https://mily-fan-site.vercel.app/media/news/mily-b26-01-campus-girls-paton-portrait.jpg",
    );

    const portalSource = await readFile(
      path.join(root, "src/data/portalFeed.ts"),
      "utf8",
    );
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes("2093262992289026404"), false);
  });

  it("documents the 8/28 X vote-day NEWS in CONTENT-OPS", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(ops, /48件/);
    assert.match(ops, /8\/28の本人X/);
    assert.match(ops, /予選A FinalSTAGE 3日目/);
    assert.match(ops, /2093262992289026404/);
  });
});
