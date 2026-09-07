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
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-09-07-campus-girls-final-ex-period";
const RESULT_ID = "2026-09-06-campus-girls-prelim-final-result";
const NEXT_SLOTS_ID = "2026-09-06-stream-thanks-next-slots";
const SOURCE = "https://x.com/Mily_chan36/status/2096754197362622971";
const TWEET_ID = "2096754197362622971";
const TITLE = "キャンガル本選EX期間、本人コメント";
const BODY =
  "みりぃがXで、CAMPUS GIRLS 2027の本選EX期間について書いた。本選まで長いので読んでほしい、とのこと。本人の解釈として、自分を知ってもらい本選でも応援してくれる人に出逢う期間。キャンガルでの配信は行わない。授賞式登壇を目指す、とある。";
const MESSAGE =
  "【キャンガル2027 本選EX期間】\n" +
  "本選まで長いので、是非目を通しておいてくださると嬉しいです😳🙏🏻🩵✨\n" +
  "個人的解釈ですが、この期間は、『私を知ってもらって、本選でも応援してくださる方々に出逢うための期間』。\n" +
  "キャンガルでの配信は行いませんが、私らしく授賞式登壇するぞ〜✊🏻❤️‍🔥";

const FORBIDDEN_PEOPLE_SITES = [
  "Millie",
  "millie",
  "公式サイト",
  "公認",
  "本人運営",
  "pbs.twimg.com",
  "video.twimg.com",
  "amplify_video",
  "_movie_mps",
];

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-07 X キャンガル本選EX期間コメント — Latest entry", () => {
  it("adds exactly one source-backed text NEWS card ahead of the 9/6 cards", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(
      news.filter((candidate) => (candidate.source ?? "").includes(TWEET_ID)).length,
      1,
    );
    assert.equal(news[0], entry);
    assert.equal(ordered[0], entry);
    assert.equal(ordered[1]?.id, NEXT_SLOTS_ID);
    assert.equal(ordered[2]?.id, RESULT_ID);
    assert.equal(entry.date, "2026-09-07");
    assert.equal(entry.sameDayOrder, 10);
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
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.ok(news.some((candidate) => candidate.id === RESULT_ID));
    assert.notEqual(entry, news.find((candidate) => candidate.id === RESULT_ID));
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim and a short fan NEWS body", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのX");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 4);
    assert.match(entry.message.text, /^【キャンガル2027 本選EX期間】\n/);
    assert.match(entry.message.text, /本選まで長いので/);
    assert.match(entry.message.text, /私を知ってもらって、本選でも応援してくださる方々に出逢うための期間/);
    assert.match(entry.message.text, /キャンガルでの配信は行いませんが/);
    assert.match(entry.message.text, /授賞式登壇するぞ〜✊🏻❤️‍🔥$/);
    assert.match(entry.body, /本選EX期間/);
    assert.match(entry.body, /出逢う期間/);
    assert.match(entry.body, /配信は行わない/);
    assert.match(entry.body, /授賞式登壇/);
    assert.ok(entry.body.length <= 220);
  });

  it("does not duplicate the 本戦進出 card or invent schedule, ranks, or vote CTAs", () => {
    const entry = item();
    const result = news.find((candidate) => candidate.id === RESULT_ID);
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

    assert.ok(result);
    assert.notEqual(entry.id, result.id);
    assert.notEqual(entry.source, result.source);
    assert.match(result.title, /本戦進出/);
    assert.doesNotMatch(entry.title, /本戦進出/);
    assert.doesNotMatch(copy, /公式|公認|本人運営/);
    assert.doesNotMatch(copy, /JST|\blive\b|作業メモ/i);
    assert.doesNotMatch(copy, /急いで|今すぐ投票|残り/);
    assert.doesNotMatch(copy, /票|pt|ポイント|順位|1位|2位/);
    assert.doesNotMatch(copy, /CanCam|AGESTOCK|横浜アリーナ/);
    assert.equal(copy.toLowerCase().includes("millie"), false);

    const now = Date.parse("2026-09-07T12:00:00+09:00");
    const resolved = resolveNewsLinks(entry, now);
    assert.equal(resolved.cta, undefined);
    assert.equal(resolved.additionalCtas, undefined);
    assert.equal(resolved.relatedUrl, undefined);
  });
});

describe("2026-09-07 X キャンガル本選EX期間コメント — scope", () => {
  it("surfaces on the campus-girls Activity only", () => {
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    assert.equal(campusNews[0]?.id, NEWS_ID);
    assert.equal(campusNews[1]?.id, RESULT_ID);
    for (const activityId of ["live-stream", "miss-circle", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
    }
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
    assert.equal(contest.contestName, "MISS CIRCLE CONTEST 2026");

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

    assert.equal(JSON.stringify(streamSchedule).includes(NEWS_ID), false);
    assert.deepEqual(
      streamSchedule.filter((slot) => slot.date === "2026-09-07"),
      [
        { date: "2026-09-07", time: "06:30", endTime: "07:30" },
        { date: "2026-09-07", time: "22:00", endTime: "23:00" },
      ],
    );
  });

  it("does not invent other people, sites, or SNS media URLs", async () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

    for (const phrase of FORBIDDEN_PEOPLE_SITES) {
      assert.equal(copy.includes(phrase), false, phrase);
    }

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

describe("2026-09-07 X キャンガル本選EX期間コメント — Portal Feed and CONTENT-OPS", () => {
  it("flows through Portal Feed as text-only NEWS", () => {
    const feed = createPortalFeed({
      newsItems: news,
      now: new Date("2026-09-07T12:00:00+09:00"),
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-07T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);
  });

  it("documents the separate 9/7 card without images or vote buttons", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const start = ops.indexOf("### 2026-09-07 本人X キャンガル本選EX期間コメント");
    const end = ops.indexOf("### 2026-09-06 歌リストのカラオケ参考リンクと過去回点検");
    assert.notEqual(start, -1);
    assert.notEqual(end, -1);
    const section = ops.slice(start, end);

    assert.match(ops, /82件/);
    assert.match(section, /2096754197362622971/);
    assert.match(section, /sameDayOrder: 10/);
    assert.match(section, /テキストNEWS＋出典リンクのみ/);
    assert.match(section, /2026-09-06-campus-girls-prelim-final-result/);
    assert.match(section, /別カード/);
    assert.match(section, /投票CTAなし/);
    assert.doesNotMatch(section, /WEB投票する/);
    assert.doesNotMatch(section, /Drive ID|attachment hash|sha256/);
    assert.equal(DRIVE_HOST_PATTERN.test(ops), false);
    assert.equal(DRIVE_FOLDER_PATTERN.test(ops), false);
  });
});
