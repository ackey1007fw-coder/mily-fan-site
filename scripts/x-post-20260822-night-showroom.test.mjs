import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
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
import { siteOrigin } from "../src/data/site.ts";
import { stories } from "../src/data/stories.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { verifyNews } from "./content-invariants.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-22-night-showroom-thanks";
const SOURCE = "https://x.com/mily_chan36/status/2091166455224299641";
const PHOTO = "/media/news/mily-b17-01-night-showroom-fireworks.jpg";
const PHOTO_FILE = path.join(root, "public", PHOTO.slice(1));
const ORIGINAL = path.join(
  root,
  "media/original/mily-b17-01-night-showroom-fireworks.jpg",
);
const ORIGINAL_SIZE = 132_220;
const ORIGINAL_SHA256 =
  "3409acb7c306f579561b77d96f3ee9f6df8be71cd5166b9e22340e6b1adde903";
const PUBLIC_SIZE = 132_220;
const PUBLIC_SHA256 = ORIGINAL_SHA256;
const MESSAGE = [
  "夜枠ありがとうございました！！",
  "",
  "明日は",
  "朝☀️5:40〜",
  "夜🌙22:30〜",
  "の予定だよ🙇🏻‍♀️🙇🏻‍♀️🙇🏻‍♀️",
  "",
  "おやすみりぃ",
  "",
  "#ミスサー #ミスサークル #ミスサークルコンテスト #ミスサークルコンテスト2026",
].join("\n");

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

describe("2026-08-22 night SHOWROOM thanks X post — Latest entry", () => {
  it("adds exactly one source-backed News item with the confirmed date", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-22");
    assert.equal(entry.sameDayOrder, 3);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps the confirmed post text verbatim, including blank lines", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 10);
    assert.match(entry.message.text, /^夜枠ありがとうございました！！\n\n/);
    assert.match(entry.message.text, /朝☀️5:40〜\n夜🌙22:30〜/);
    assert.match(entry.message.text, /おやすみりぃ\n\n#ミスサー/);
    assert.match(entry.message.text, /#ミスサークルコンテスト2026$/);
  });

  it("uses archive wording for the announced 8/23 slots", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}`;

    assert.match(entry.body, /8月22日の夜、みりぃがSHOWROOM配信へのお礼をXに投稿しました/);
    assert.match(entry.body, /投稿時点で翌23日は朝5:40〜と夜22:30〜の2枠を予定していることを案内/);
    assert.match(entry.body, /「おやすみりぃ」と締めくくっています/);

    for (const phrase of [
      "次の配信は5:40",
      "本日22:30",
      "今夜の配信",
      "現在予定されている配信",
      "明日配信します",
      "配信します",
    ]) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("contains no rankings, engagement metrics, or unrelated contest facts", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}\n${entry.media.alt}`;

    for (const phrase of [
      "現在48位",
      "48位",
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

describe("2026-08-22 night SHOWROOM thanks X post — self-hosted photo", () => {
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

    const b17Files = (await readdir(path.join(root, "public/media/news")))
      .filter((file) => file.includes("mily-b17"));
    assert.deepEqual(b17Files, [path.basename(PHOTO_FILE)]);
  });

  it("records the measured 1206x555 dimensions and byte-identical public copy", async () => {
    const photo = item().media;
    const metadata = await sharp(PHOTO_FILE).metadata();

    assert.equal(metadata.format, "jpeg");
    assert.equal(photo.width, metadata.width);
    assert.equal(photo.height, metadata.height);
    assert.equal(metadata.width, 1206);
    assert.equal(metadata.height, 555);
    assert.equal((await stat(PHOTO_FILE)).size, PUBLIC_SIZE);
    assert.equal(await sha256(PHOTO_FILE), PUBLIC_SHA256);

    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
    assert.equal(metadata.orientation, undefined);
    assert.equal(metadata.comments, undefined);
  });

  it("keeps the original dimensions and pixels aligned without crop or scale", async () => {
    if (!existsSync(ORIGINAL)) return;

    assert.equal((await stat(ORIGINAL)).size, ORIGINAL_SIZE);
    assert.equal(await sha256(ORIGINAL), ORIGINAL_SHA256);
    const originalMetadata = await sharp(ORIGINAL).metadata();
    assert.equal(originalMetadata.width, 1206);
    assert.equal(originalMetadata.height, 555);

    const original = await sharp(ORIGINAL).removeAlpha().raw().toBuffer();
    const published = await sharp(PHOTO_FILE).removeAlpha().raw().toBuffer();
    assert.equal(published.length, original.length);
    assert.equal(await sha256(ORIGINAL), await sha256(PHOTO_FILE));
  });

  it("keeps the owner-provided original ignored and out of git", async () => {
    const relative = "media/original/mily-b17-01-night-showroom-fireworks.jpg";
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

describe("2026-08-22 night SHOWROOM thanks X post — scope and ordering", () => {
  it("stays out of Gallery, Gallery videos, Stories, and highlights", async () => {
    assert.equal(media.some((entry) => entry.id.includes("b17")), false);
    assert.equal(media.some((entry) => entry.basePath.includes("night-showroom-fireworks")), false);
    assert.equal(galleryVideos.some((entry) => entry.id.includes("b17")), false);
    assert.equal(galleryVideos.some((entry) => entry.src.includes("night-showroom-fireworks")), false);
    assert.equal(stories.some((entry) => entry.slug.includes("night-showroom-thanks")), false);
    assert.equal(highlights.some((entry) => entry.id.includes("night-showroom")), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("mily-b17"), false, relative);
      assert.equal(source.includes(NEWS_ID), false, relative);
    }
  });

  it("does not hand-enter the 8/23 slots into schedule data", async () => {
    const { events } = await import("../src/data/events.ts");
    const { streamSchedule } = await import("../src/data/streamSchedule.ts");
    const { supportEvents } = await import("../src/data/supportEvents.ts");

    assert.deepEqual(events, []);
    assert.deepEqual(streamSchedule, []);
    assert.equal(
      supportEvents.some(
        (entry) =>
          JSON.stringify(entry).includes("5:40") ||
          JSON.stringify(entry).includes("22:30"),
      ),
      false,
    );

    for (const relative of ["src/data/events.ts", "src/data/streamSchedule.ts"]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("mily-b17"), false, relative);
    }
  });

  it("ranks ahead of the earlier 8/22 CAMPUS GIRLS item via sameDayOrder", () => {
    const ordered = sortNewsByDateDesc(news).map((entry) => entry.id);

    assert.deepEqual(ordered.slice(0, 17), [
      "2026-08-24-campus-girls-final-stage-guide",
      "2026-08-24-night-thanks-morning-stream",
      "2026-08-23-dragon-cloud",
      "2026-08-23-seaside-circle-musical-special",
      "2026-08-23-morning-showroom-fanroom",
      "2026-08-23-early-showroom-fanroom",
      "2026-08-23-earthquake-showroom-fanroom",
      NEWS_ID,
      "2026-08-22-night-showroom-fanroom",
      "2026-08-22-evening-showroom-fanroom",
      "2026-08-22-campus-girls-second-stage-jury-award",
      "2026-08-21-tiktok-radio-misscircle",
      "2026-08-21-after-afternoon-ganda",
      "2026-08-21-afternoon-showroom-fanroom",
      "2026-08-21-event-story-next-slot",
      "2026-08-21-morning-ohayo-story",
      "2026-08-21-morning-showroom-runway",
    ]);
    assert.equal(news.length, 26);
  });

  it("appears on the LIVE STREAM Activity page through explicit activityIds", () => {
    const selected = selectActivityNews("live-stream", news, news.length);
    assert.ok(selected.some((entry) => entry.id === NEWS_ID));
    assert.ok(selected.every(({ activityIds }) => activityIds?.includes("live-stream")));
  });
});

describe("2026-08-22 night SHOWROOM thanks X post — Portal Feed and responsive contract", () => {
  it("flows through Portal Feed with its self-hosted site-origin image", async () => {
    const feed = createPortalFeed({ now: new Date("2026-08-22T23:30:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-22T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(entry.image, new URL(PHOTO, siteOrigin()).href);
    assert.equal(new URL(entry.image).origin, siteOrigin());
    assert.equal(entry.image.includes("twimg"), false);

    const portalSource = await readFile(path.join(root, "src/data/portalFeed.ts"), "utf8");
    assert.equal(portalSource.includes(NEWS_ID), false);
    assert.equal(portalSource.includes("mily-b17"), false);
  });

  it("uses the existing uncropped, overflow-safe Latest rendering", async () => {
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const image = latest.match(/<img[\s\S]*?\/>/);

    assert.ok(image);
    assert.match(image[0], /object-contain/);
    assert.doesNotMatch(image[0], /object-cover/);
    assert.match(image[0], /\bw-full\b/);
    assert.match(image[0], /\bh-auto\b/);
    assert.match(image[0], /max-w-sm/);
    assert.match(latest, /whitespace-pre-line break-words/);
    assert.doesNotMatch(image[0], /className="[^"]*\bw-\[\d+px\]/);
  });
});
