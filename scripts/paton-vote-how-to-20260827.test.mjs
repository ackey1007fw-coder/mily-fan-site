import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { galleryVideos } from "./fixtures/gallery-videos-before-b41.ts";
import { highlights } from "../src/data/highlights.ts";
import { campusGirlsPatonPortraitImage } from "../src/data/campusGirlsPatonImages.ts";
import { events } from "../src/data/events.ts";
import { news, sortNewsByDateDesc } from "./fixtures/news-before-b41.ts";
import {
  PATON_VOTE_HOW_TO_ANCHOR_ID,
  PATON_VOTE_HOW_TO_CTA_LABEL,
  PATON_VOTE_HOW_TO_CTA_URL,
  PATON_VOTE_HOW_TO_NEWS_ID,
  PATON_VOTE_HOW_TO_SOURCE_LABEL,
  PATON_VOTE_HOW_TO_TITLE,
  PATON_VOTE_HOW_TO_X_URL,
  patonVoteHowToSpokenMessage,
  patonVoteHowToSteps,
} from "../src/data/patonVoteHowTo.ts";
import { createPortalFeed } from "./fixtures/portal-feed-before-b41.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { selectActivityMedia } from "./fixtures/activity-media-before-b41.ts";
import { selectActivityNews } from "./fixtures/activity-content-before-b41.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const START = Date.parse("2026-08-26T18:00:00+09:00");
const END = Date.parse("2026-09-01T23:59:00+09:00");
const FORBIDDEN = [
  "900 pt",
  "900pt",
  "5位",
  "Millie",
  "millie",
  "TOP個人サポーター",
];

function item() {
  return news.find((entry) => entry.id === PATON_VOTE_HOW_TO_NEWS_ID);
}

async function source(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("2026-08-27 CAMPUS GIRLS Paton vote how-to — 導線", () => {
  it("adds exactly one X-backed NEWS item that leads 8/27", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(
      news.filter((candidate) => candidate.id === PATON_VOTE_HOW_TO_NEWS_ID)
        .length,
      1,
    );
    assert.equal(news.length, 48);
    assert.equal(sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-movie-night"))[0]?.id, PATON_VOTE_HOW_TO_NEWS_ID);
    assert.equal(entry.date, "2026-08-27");
    assert.equal(entry.sameDayOrder, 2);
    assert.deepEqual(entry.activityIds, ["campus-girls"]);
    assert.equal(entry.title, PATON_VOTE_HOW_TO_TITLE);
    assert.equal(entry.source, PATON_VOTE_HOW_TO_X_URL);
    assert.equal(entry.sourceLabel, PATON_VOTE_HOW_TO_SOURCE_LABEL);
    assert.equal(entry.url, PATON_VOTE_HOW_TO_CTA_URL);
    assert.equal(entry.ctaLabel, PATON_VOTE_HOW_TO_CTA_LABEL);
    assert.equal(entry.media, campusGirlsPatonPortraitImage);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.message?.label, "みりぃの案内");
    assert.equal(entry.message?.text, patonVoteHowToSpokenMessage);
    assert.equal(entry.source.includes("?s="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed how-to without inventing rankings or other contestants", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text}`;

    assert.match(entry.title, /キャンガル2027/);
    assert.match(entry.title, /パトン投票方法/);
    assert.match(entry.body, /8月27日/);
    assert.match(entry.body, /CAMPUS GIRLS 2027/);
    assert.match(entry.body, /Paton/);
    assert.match(entry.body, /1日1回無料拍手/);
    assert.match(entry.body, /ギフト/);
    assert.match(entry.body, /応援コメント/);
    assert.match(entry.body, /9月1日/);
    assert.match(entry.message.text, /キャンパスガールズ2027をタップ/);
    assert.match(entry.message.text, /ギフトをタップ/);
    assert.match(entry.message.text, /無料拍手/);
    assert.match(entry.message.text, /投票完了/);
    assert.equal(patonVoteHowToSteps.length, 4);
    assert.equal(patonVoteHowToSteps[3].text, "1日1回無料拍手を送信");

    for (const phrase of FORBIDDEN) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
    for (const phrase of ["今すぐ投票", "公式", "公認", "本人運営"]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("hides the Paton CTA after the confirmed window while keeping the X source", () => {
    const entry = item();
    const during = resolveNewsLinks(entry, START);
    const atEnd = resolveNewsLinks(entry, END);
    const after = resolveNewsLinks(entry, END + 1);

    assert.equal(during.cta?.url, PATON_VOTE_HOW_TO_CTA_URL);
    assert.equal(during.cta?.label, PATON_VOTE_HOW_TO_CTA_LABEL);
    assert.equal(atEnd.cta?.url, PATON_VOTE_HOW_TO_CTA_URL);
    assert.equal(after.relatedUrl, undefined);
    assert.equal(after.cta, undefined);
    assert.equal(entry.source, PATON_VOTE_HOW_TO_X_URL);
  });

  it("leads CAMPUS GIRLS Activity NEWS without adding Gallery, STORY, or events", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const campusPreview = selectActivityNews("campus-girls");
    const campusMedia = selectActivityMedia("campus-girls");

    assert.equal(campusNews[0]?.id, "2026-08-28-paton-vote-day-3");
    assert.equal(campusNews[1]?.id, PATON_VOTE_HOW_TO_NEWS_ID);
    assert.equal(campusPreview[0]?.id, "2026-08-28-paton-vote-day-3");
    assert.equal(campusPreview[1]?.id, PATON_VOTE_HOW_TO_NEWS_ID);
    assert.equal(campusMedia[0], campusGirlsPatonPortraitImage);
    assert.equal(
      selectActivityNews("radio").some(
        (entry) => entry.id === PATON_VOTE_HOW_TO_NEWS_ID,
      ),
      false,
    );
    assert.equal(
      selectActivityNews("miss-circle").some(
        (entry) => entry.id === PATON_VOTE_HOW_TO_NEWS_ID,
      ),
      false,
    );
    assert.equal(
      selectActivityNews("live-stream").some(
        (entry) => entry.id === PATON_VOTE_HOW_TO_NEWS_ID,
      ),
      false,
    );
    assert.equal(
      galleryVideos.some((entry) => entry.id.includes("paton-vote-how-to")),
      false,
    );
    assert.equal(
      stories.some((entry) => JSON.stringify(entry).includes(PATON_VOTE_HOW_TO_NEWS_ID)),
      false,
    );
    assert.equal(
      highlights.some((entry) => entry.id.includes("paton-vote-how-to")),
      false,
    );
    assert.deepEqual(events, []);
    assert.equal(
      streamSchedule.some((entry) => JSON.stringify(entry).includes("paton-vote-how-to")),
      false,
    );
  });

  it("does not self-host the X video or the attached Paton app recording", async () => {
    const publicMedia = path.join(root, "public/media");
    const files = [];
    async function walk(dir) {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(full);
        else files.push(full);
      }
    }
    await walk(publicMedia);

    const banned = files.filter((file) =>
      /2092793734232748228|paton-vote-how-to|b27-05|paton-app/i.test(file),
    );
    assert.deepEqual(banned, []);
    assert.equal(existsSync(path.join(root, "stories", PATON_VOTE_HOW_TO_NEWS_ID)), false);

    const howTo = await source("src/data/patonVoteHowTo.ts");
    const guide = await source("src/components/PatonVoteGuide.tsx");
    const newsSource = await source("src/data/news.ts");
    for (const haystack of [newsSource, howTo, guide]) {
      assert.equal(haystack.includes("video.twimg.com"), false);
      assert.equal(haystack.includes("amplify_video"), false);
    }
    for (const haystack of [howTo, guide]) {
      for (const phrase of FORBIDDEN) {
        assert.equal(haystack.includes(phrase), false, phrase);
      }
    }
  });

  it("wires HOME, Support, and Hero 導線 to the X post and Paton page", async () => {
    const app = await source("src/App.tsx");
    const support = await source("src/SupportPage.tsx");
    const hero = await source("src/components/Hero.tsx");
    const guide = await source("src/components/PatonVoteGuide.tsx");

    assert.match(app, /PatonVoteGuide/);
    assert.match(support, /PatonVoteGuide/);
    assert.match(hero, /投票のやり方を見る/);
    assert.match(hero, /PATON_VOTE_HOW_TO_ANCHOR_ID/);
    assert.match(guide, /PATON_VOTE_HOW_TO_X_URL/);
    assert.match(guide, /campusGirlsPatonVoteLink/);
    assert.match(guide, /id=\{PATON_VOTE_HOW_TO_ANCHOR_ID\}/);
    assert.match(guide, /isSupportEventUrlActive/);
    assert.match(guide, /window\.location\.hash/);
    assert.match(guide, /addEventListener\("hashchange", scrollToGuide\)/);
    assert.match(guide, /scrollIntoView\(/);
    assert.equal(guide.includes("campusGirlsPatonPortraitImage"), false);
    assert.equal(guide.includes("NewsImage"), false);
  });

  it("keeps Portal Feed aligned with the new Latest lead", () => {
    const feed = createPortalFeed();
    const entry = feed.items.find(
      (candidate) => candidate.id === `mily:news:${PATON_VOTE_HOW_TO_NEWS_ID}`,
    );

    assert.ok(entry);
    assert.equal(entry.publishedAt, "2026-08-27T00:00:00+09:00");
    assert.equal(entry.sourceUrl, PATON_VOTE_HOW_TO_X_URL);
    assert.equal(
      entry.image,
      "https://mily-fan-site.vercel.app/media/news/mily-b26-01-campus-girls-paton-portrait.jpg",
    );
  });

  it("documents the outbound-only video and both 導線", async () => {
    const ops = await source("docs/CONTENT-OPS.md");
    const media = await source("docs/MEDIA.md");

    assert.match(ops, /48件/);
    assert.match(ops, /キャンガル2027 パトン投票方法/);
    assert.match(ops, /X動画は自己ホストせず/);
    assert.match(ops, /既存b26-01/);
    assert.match(ops, /8\/27投票方法案内は本人X投稿/);
    assert.match(media, /2092793734232748228/);
    assert.match(media, /自己ホストしない/);
    assert.match(media, /他出場者・順位/);
    assert.match(media, /導線カードへは流用しない/);
  });
});
