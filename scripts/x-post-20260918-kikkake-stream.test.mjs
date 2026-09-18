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

const NEWS_ID = "2026-09-18-kikkake-and-regular-stream";
const SAME_DAY_STORY_ID = "2026-09-18-campus-girls-paton-15x-story";
const SOURCE = "https://x.com/Mily_chan36/status/2100806349680713766";
const TWEET_ID = "2100806349680713766";
const SHOWROOM = "https://www.showroom-live.com/r/circle2026_0734";
const TITLE = "13:40〜「初！きっかけ配信」、通常配信は15:30まで";
const BODY =
  "9月18日13:37、みりぃがXで、13:40〜14:40の「初！きっかけ配信」と、その後の通常配信を15:30まで行うと案内しました。16:07時点では配信は終了しており、次回配信は未定でした。";
const MESSAGE =
  "13:40〜14:40初！きっかけ配信🛜\n" +
  "終わったら通常配信を15:30までやります💖\n" +
  "見にきてくれたら喜びます‼︎";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-18 X きっかけ配信案内 — Latest entry", () => {
  it("adds exactly one source-backed text NEWS card ahead of the morning Story", () => {
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
    assert.equal(ordered[1]?.id, SAME_DAY_STORY_ID);
    assert.equal(ordered[2]?.id, "2026-09-16-miss-circle-fourth-round");
    assert.equal(entry.date, "2026-09-18");
    assert.equal(entry.sameDayOrder, 10);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, SHOWROOM);
    assert.equal(entry.ctaLabel, "SHOWROOMを見る");
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.additionalSources, undefined);
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.source.includes("?t="), false);
    assert.equal(entry.source.includes("?s="), false);
    assert.equal(entry.url.includes("?t="), false);
    assert.equal(entry.url.includes("room_id="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed announcement lines and a short fan NEWS body", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのX");
    assert.equal(entry.message?.text, MESSAGE);
    assert.match(entry.body, /13:40〜14:40/);
    assert.match(entry.body, /初！きっかけ配信/);
    assert.match(entry.body, /15:30まで/);
    assert.match(entry.body, /16:07時点では配信は終了/);
    assert.match(entry.body, /次回配信は未定/);
  });

  it("does not invent stream talk, ranks, gifts, clips, or API field names", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

    assert.doesNotMatch(copy, /公式|公認|本人運営/);
    assert.doesNotMatch(copy, /JST|\bis_onlive\b|\bnext_live\b|\bis_live\b|作業メモ/i);
    assert.doesNotMatch(copy, /急いで|今すぐ投票|残り/);
    assert.doesNotMatch(copy, /票|pt|ポイント|順位|位|ギフト|切り抜き|盛り上がり度/);
    assert.doesNotMatch(copy, /room_id|573253|\?t=/);
    assert.equal(copy.toLowerCase().includes("millie"), false);

    const now = Date.parse("2026-09-18T16:07:00+09:00");
    const resolved = resolveNewsLinks(entry, now);
    assert.deepEqual(resolved.cta, { label: "SHOWROOMを見る", url: SHOWROOM });
    assert.equal(resolved.relatedUrl, SHOWROOM);
    assert.equal(resolved.additionalCtas, undefined);
  });
});

describe("2026-09-18 X きっかけ配信案内 — scope", () => {
  it("surfaces on the live-stream Activity only", () => {
    const liveNews = selectActivityNews("live-stream", news, news.length);
    assert.equal(liveNews[0]?.id, NEWS_ID);
    assert.equal(
      selectActivityNews("campus-girls", news, news.length)[0]?.id,
      SAME_DAY_STORY_ID,
    );
    for (const activityId of ["miss-circle", "campus-girls", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
    }
  });

  it("does not add a 9/18 streamSchedule slot after next_live TBD", () => {
    assert.equal(
      streamSchedule.some((slot) => slot.date === "2026-09-18"),
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
      assert.equal(sourceText.includes(TWEET_ID), false, relative);
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

  it("does not scrape X or SHOWROOM image hosts", async () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

    for (const phrase of [
      "Millie",
      "millie",
      "公式サイト",
      "公認",
      "本人運営",
      "pbs.twimg.com",
      "video.twimg.com",
      "image.showroom-live.com",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }

    for (const relative of ["src/data/news.ts", "docs/CONTENT-OPS.md"]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("pbs.twimg.com"), false, relative);
      assert.equal(source.includes("video.twimg.com"), false, relative);
      assert.equal(source.includes("image.showroom-live.com"), false, relative);
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.equal(DRIVE_FOLDER_PATTERN.test(source), false, relative);
      assert.equal(source.toLowerCase().includes("millie"), false, relative);
    }
  });
});

describe("2026-09-18 X きっかけ配信案内 — Portal Feed and ops notes", () => {
  it("flows through Portal Feed as text-only NEWS", () => {
    const feed = createPortalFeed({
      newsItems: news,
      now: new Date("2026-09-18T16:07:00+09:00"),
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-09-18T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, undefined);
  });

  it("documents the confirmed X announcement without promoting it to a live recap", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const start = ops.indexOf("## 2026-09-18確認: X「初！きっかけ配信」と通常配信の案内");
    assert.notEqual(start, -1);
    const section = ops.slice(
      start,
      ops.indexOf("\n## ", start + 4),
    );

    assert.match(section, /2100806349680713766/);
    assert.match(section, /13:37 JST/);
    assert.match(section, /13:40〜14:40/);
    assert.match(section, /circle2026_0734/);
    assert.match(section, /room_id=573253/);
    assert.match(section, /is_onlive=false/);
    assert.match(section, /next_live=TBD/);
    assert.match(section, /sameDayOrder: 10/);
    assert.match(section, /添付画像なし/);
    assert.match(section, /streamSchedule/);
    assert.doesNotMatch(section, /公式|公認|本人運営/);
    assert.doesNotMatch(section, /pbs\.twimg\.com|video\.twimg\.com/);
  });
});
