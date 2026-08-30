import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { siteOrigin } from "../src/data/site.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { contest } from "../src/data/contest.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { verifyNews } from "./content-invariants.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-31-morning-showroom-thanks";
const SOURCE = "https://x.com/Mily_chan36/status/2094192106105659650";
const SHOWROOM = "https://www.showroom-live.com/r/circle2026_0734";
const PHOTO = "/media/news/mily-b44-01-morning-showroom-thanks.jpg";
const PHOTO_FILE = path.join(root, "public", PHOTO.slice(1));
const ORIGINAL = path.join(
  root,
  "media/original/mily-b44-01-morning-showroom-thanks.jpg",
);
const PLEADING = "\u{1F979}";
const FOLDED_HANDS = "\u{1F64F}\u{1F3FB}";
const SPARKLES = "\u{2728}";
const FACEPALM = "\u{1F926}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}";
const HEART_EXCLAMATION = "\u{2763}\u{FE0F}";
const MESSAGE =
  `朝から私を起こしに来てくれたみんな、ありがとう${PLEADING}${FOLDED_HANDS}${SPARKLES}なんだか勇気ももらえて、朝から配信した甲斐があったなぁぁぁ〜\n` +
  `これからの頑張る糧になるね、確実に${FACEPALM}${HEART_EXCLAMATION}\n` +
  "#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサー2026 #ミスサークル2026 #ミスサークルコンテスト2026";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

describe("2026-08-31 morning SHOWROOM thanks X post — Latest entry", () => {
  it("adds one source-backed News item at the top of 8/31", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(news.length, 58);
    assert.equal(ordered[0]?.id, NEWS_ID);
    assert.equal(ordered[1]?.id, "2026-08-30-campus-girls-hold-second-story");
    assert.equal(entry.date, "2026-08-31");
    assert.equal(entry.sameDayOrder, undefined);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, SHOWROOM);
    assert.equal(entry.ctaLabel, "SHOWROOMを見る");
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.equal(entry.source.includes("?s="), false);
    assert.equal(entry.url.includes("?t="), false);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim, including emoji", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 3);
    assert.match(entry.message.text, /^朝から私を起こしに来てくれたみんな、ありがとう/);
    assert.equal(entry.message.text.includes(PLEADING), true);
    assert.equal(entry.message.text.includes(FOLDED_HANDS), true);
    assert.equal(entry.message.text.includes(SPARKLES), true);
    assert.equal(entry.message.text.includes(FACEPALM), true);
    assert.equal(entry.message.text.includes(HEART_EXCLAMATION), true);
    assert.match(entry.message.text, /朝から配信した甲斐があった/);
    assert.match(entry.message.text, /これからの頑張る糧になるね、確実に/);
    assert.match(
      entry.message.text,
      /#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサー2026 #ミスサークル2026 #ミスサークルコンテスト2026$/,
    );
  });

  it("uses archive wording and does not invent a slot or ranking", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}`;

    assert.match(entry.body, /8月31日朝/);
    assert.match(entry.body, /起こしに来てくれた人へのお礼/);
    assert.match(entry.body, /勇気/);
    assert.match(entry.body, /朝から配信した甲斐があった/);
    assert.match(entry.body, /頑張る糧/);
    assert.equal(contest.currentPhase?.name, "3次審査進出");

    for (const phrase of [
      "配信します",
      "現在予定されている配信",
      "ファイナル進出",
      "グランプリ",
      "現在順位",
      "得票",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("contains no rankings, engagement metrics, or unrelated contest facts", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}\n${entry.media.alt}`;

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
      "Paton",
      "パトン",
      "審査員賞",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });
});

describe("2026-08-31 morning SHOWROOM thanks X post — self-hosted photo", () => {
  it("uses one local /media/news/ JPEG and never hotlinks SNS media", async () => {
    const photo = item().media;

    assert.equal(photo?.kind, "image");
    assert.equal(photo?.src, PHOTO);
    assert.match(photo.src, /^\/media\/news\//);
    assert.equal(existsSync(PHOTO_FILE), true);

    for (const host of [
      "pbs.twimg.com",
      "twimg",
      "twitter.com",
      "cdninstagram",
      "instagram.com",
      "http://",
      "https://",
    ]) {
      assert.equal(photo.src.includes(host), false, host);
    }

    const b44Files = (await readdir(path.join(root, "public/media/news"))).filter(
      (file) => file.includes("mily-b44"),
    );
    assert.deepEqual(b44Files, [path.basename(PHOTO_FILE)]);
  });

  it("records 1500x2435 and strips EXIF / IPTC / ICC", async () => {
    const photo = item().media;
    const metadata = await sharp(PHOTO_FILE).metadata();

    assert.equal(metadata.format, "jpeg");
    assert.equal(photo.width, metadata.width);
    assert.equal(photo.height, metadata.height);
    assert.equal(metadata.width, 1500);
    assert.equal(metadata.height, 2435);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
    assert.equal(metadata.orientation, undefined);
    assert.equal(metadata.comments, undefined);
  });

  it("does not crop or change the original pixel dimensions", async () => {
    if (!existsSync(ORIGINAL)) return;

    const originalMetadata = await sharp(ORIGINAL).metadata();
    const publishedMetadata = await sharp(PHOTO_FILE).metadata();
    assert.equal(originalMetadata.width, 1500);
    assert.equal(originalMetadata.height, 2435);
    assert.equal(publishedMetadata.width, originalMetadata.width);
    assert.equal(publishedMetadata.height, originalMetadata.height);
    assert.notEqual(await sha256(ORIGINAL), await sha256(PHOTO_FILE));
  });

  it("keeps the owner-provided original ignored and out of git", async () => {
    const relative = "media/original/mily-b44-01-morning-showroom-thanks.jpg";
    const { stdout: ignored } = await run("git", ["check-ignore", "-v", "--", relative], {
      cwd: root,
    });
    const { stdout: tracked } = await run("git", ["ls-files", "--", relative], {
      cwd: root,
    });

    assert.match(ignored, /media\/original\/\*/);
    assert.equal(tracked.trim(), "");
  });
});

describe("2026-08-31 morning SHOWROOM thanks X post — scope", () => {
  it("stays out of Gallery, Gallery videos, Stories, and highlights", async () => {
    assert.equal(media.some((entry) => entry.id.includes("b44")), false);
    assert.equal(
      media.some((entry) => entry.basePath?.includes("morning-showroom-thanks")),
      false,
    );
    assert.equal(
      galleryVideos.some((entry) => entry.id.includes("b44")),
      false,
    );
    assert.equal(
      stories.some((entry) => entry.slug.includes("morning-showroom-thanks")),
      false,
    );
    assert.equal(
      highlights.some((entry) => entry.id.includes("morning-showroom-thanks")),
      false,
    );
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/profile.ts",
      "src/data/contest.ts",
    ]) {
      const sourceText = await readFile(path.join(root, relative), "utf8");
      assert.equal(sourceText.includes(NEWS_ID), false, relative);
      assert.equal(sourceText.includes("2094192106105659650"), false, relative);
      assert.equal(sourceText.includes("mily-b44"), false, relative);
    }
  });

  it("does not hand-enter a new slot into schedule data", async () => {
    assert.deepEqual(events, []);
    assert.deepEqual(streamSchedule, []);

    for (const relative of ["src/data/events.ts", "src/data/streamSchedule.ts"]) {
      const sourceText = await readFile(path.join(root, relative), "utf8");
      assert.equal(sourceText.includes(NEWS_ID), false, relative);
      assert.equal(sourceText.includes("2094192106105659650"), false, relative);
    }
  });

  it("leads LIVE STREAM without joining CAMPUS GIRLS, MISS CIRCLE, or radio", () => {
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const missNews = selectActivityNews("miss-circle", news, news.length);
    const campusNews = selectActivityNews("campus-girls", news, news.length);
    const radioNews = selectActivityNews("radio", news, news.length);

    assert.equal(liveNews[0]?.id, NEWS_ID);
    assert.equal(liveNews[1]?.id, "2026-08-30-morning-showroom-0600");
    assert.equal(campusNews[0]?.id, "2026-08-30-campus-girls-hold-second-story");
    assert.equal(
      campusNews.some((entry) => entry.id === NEWS_ID),
      false,
    );
    assert.equal(
      missNews.some((entry) => entry.id === NEWS_ID),
      false,
    );
    assert.equal(
      radioNews.some((entry) => entry.id === NEWS_ID),
      false,
    );
  });
});

describe("2026-08-31 morning SHOWROOM thanks X post — Portal Feed", () => {
  it("flows through Portal Feed without a hardcoded news id", async () => {
    const feed = createPortalFeed({ now: new Date("2026-08-31T08:00:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-31T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, new URL(PHOTO, siteOrigin()).href);

    const portalSource = await readFile(
      path.join(root, "src/data/portalFeed.ts"),
      "utf8",
    );
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes("2094192106105659650"), false);
  });

  it("documents the 8/31 morning SHOWROOM thanks X post in CONTENT-OPS", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    assert.match(ops, /58件/);
    assert.match(ops, /2094192106105659650/);
    assert.match(ops, /起こしに来てくれた/);
    assert.match(ops, /Gallery \/ media\.ts \/ galleryVideos/);
  });
});
