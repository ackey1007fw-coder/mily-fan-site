import "./fixtures/as-of-20260922.mjs";
import assert from "node:assert/strict";
import { news as currentNewsForMedia } from "../src/data/news.ts";
const priorMediaSources = {
  newsItems: currentNewsForMedia.filter(
    ({ id }) => id !== "2026-09-20-cold-umbrella-story",
  ),
};
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { events } from "../src/data/events.ts";
import {
  campusGirlsPatonFifteenXStoryVideo,
  coldUmbrellaStoryVideo,
  galleryVideos,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { resolveNewsLinks } from "../src/lib/newsLinks.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import { isFaststart } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import { DRIVE_FOLDER_PATTERN, DRIVE_HOST_PATTERN } from "./scan-tracked-text.mjs";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const instagramProfile = "https://www.instagram.com/mily_chan36";
const X_POST = "https://x.com/Mily_chan36/status/2101590482250088823";

const NEWS_ID = "2026-09-20-cold-umbrella-story";
const MEDIA_ID = "mily-b135-01-cold-umbrella-story";
const PUBLIC_VIDEO = "mily-b135-01-cold-umbrella-story.mp4";
const PUBLIC_POSTER = "mily-b135-01-cold-umbrella-story-poster.jpg";
const PUBLIC_BYTES = 5_713_571;
const PUBLIC_SHA256 =
  "4bbb543d49232779aa541395882ac38c78646d955c4fd39048c10ed6f76127f7";
const POSTER_BYTES = 84_195;
const POSTER_SHA256 =
  "46c2bee7c7500ae5f5a5637aca733e83b9d6704e742b189dfb32bb81e73541f1";
const ORIGINAL_SHA256 =
  "428ee17e3c64c7e134ba8a59a2c92a0b3cf5fa521f1fe6a8f8ba2fee177e2201";

const TITLE = "寒がりのみりいには耐え難い気温かも";
const BODY =
  "9月20日、みりぃがInstagram Storyで、銀の傘の下からくまの耳と鼻のフィルターを付けた縦型動画を届けました。画面には「みんな〜 寒がりのみりいには耐え難い気温かも」「行ってきまーす」とあり、出かける直前の様子です。同じ日のXでも、寒がりであることと体調管理を呼びかけています。";
const MESSAGE =
  "みんな〜\n" +
  "寒がりのみりいには耐え難い気温かも🥶🥶🥶\n" +
  "行ってきまーす٩(ˊᗜˋ*)و♪";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

async function probe(file) {
  const { stdout } = await run(await ffprobeExe(), [
    "-hide_banner",
    "-v",
    "error",
    "-show_format",
    "-show_streams",
    "-show_chapters",
    "-print_format",
    "json",
    file,
  ]);
  return JSON.parse(stdout);
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function changedText() {
  const files = [
    "docs/CONTENT-OPS.md",
    "docs/MEDIA.md",
    "scripts/fixtures/gallery-videos-before-b41.ts",
    "scripts/fixtures/gallery-videos-before-b58.ts",
    "scripts/fixtures/news-before-b41.ts",
    "scripts/fixtures/news-before-b58.ts",
    "scripts/fixtures/news-before-20260909.ts",
    "scripts/instagram-story-20260920-cold-umbrella.test.mjs",
    "src/data/galleryVideos.ts",
    "src/data/news.ts",
    "src/data/coldUmbrellaStoryVideo.json",
    "src/data/coldUmbrellaStoryVideo.ts",
  ];
  const result = [];

  for (const file of files) {
    let text = await readFile(path.join(root, file), "utf8");
    if (file === "docs/MEDIA.md") {
      const start = text.indexOf("## 素材台帳（batch b135");
      assert.notEqual(start, -1);
      const end = text.indexOf("\n## ", start + 4);
      text = text.slice(start, end === -1 ? undefined : end);
    }
    result.push({ file, text });
  }
  return result;
}

describe("2026-09-20 Instagram Story 寒がり傘 — Latest / NEWS", () => {
  it("follows the 9/21 AGESTOCK item and stays ahead of the 9/18 SHOWROOM X announcement", () => {
    const entry = item();
    const ordered = sortNewsByDateDesc(news);

    assert.ok(entry);
    assert.equal(news.filter(({ id }) => id === NEWS_ID).length, 1);
    assert.equal(news[5], entry);
    assert.equal(ordered[0]?.id, "2026-09-22-tiktok-ami-meet");
    assert.equal(ordered[1]?.id, "2026-09-22-tiktok-ami-meet-story");
    assert.equal(ordered[2]?.id, "2026-09-22-tiktok-ami-twin-coord");
    assert.equal(ordered[3]?.id, "2026-09-21-agestock-yokohama");
    assert.equal(ordered[4]?.id, "2026-09-21-tiktok-ami-tokyo");
    assert.equal(ordered[5], entry);
    assert.equal(ordered[6]?.id, "2026-09-18-kikkake-and-regular-stream");
    assert.equal(ordered[7]?.id, "2026-09-18-campus-girls-paton-15x-story");
    assert.equal(entry.date, "2026-09-20");
    assert.equal(entry.sameDayOrder, undefined);
    assert.equal(entry.activityIds, undefined);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.message?.label, "みりぃのStory");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.additionalMedia, undefined);
    assert.deepEqual(entry.additionalSources, [
      { label: "みりぃのX", url: X_POST },
    ]);
    assert.deepEqual(verifyNews([entry]), []);
    assert.deepEqual(verifyNews(news), []);
  });

  it("keeps Story attribution non-link with Instagram CTA and X as extra source", () => {
    const entry = item();

    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, instagramProfile);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.equal(entry.additionalCtas, undefined);
    const serialized = JSON.stringify(entry);
    assert.equal(serialized.includes("paton.jp"), false);
    assert.equal(serialized.includes("misscircle.jp"), false);
    assert.equal(serialized.includes("showroom-live.com"), false);
    assert.deepEqual(resolveNewsLinks(entry, Date.parse("2026-09-20T22:00:00+09:00")), {
      relatedUrl: instagramProfile,
      cta: { label: "Instagramプロフィールを見る", url: instagramProfile },
    });
  });

  it("shares one manifest object with Gallery and Portal Feed", () => {
    const entry = item();

    assert.equal(entry.media, coldUmbrellaStoryVideo);
    assert.equal(galleryVideos[4], coldUmbrellaStoryVideo);
    assert.equal(galleryVideos[5], campusGirlsPatonFifteenXStoryVideo);
    assert.deepEqual(
      galleryVideos.filter(({ id }) => id === MEDIA_ID),
      [coldUmbrellaStoryVideo],
    );
    assert.equal(
      visibleGalleryVideos().find(({ id }) => id === MEDIA_ID),
      coldUmbrellaStoryVideo,
    );
    assert.equal(coldUmbrellaStoryVideo.kind, "video");
    assert.equal(coldUmbrellaStoryVideo.provenance, "owner-provided");
    assert.equal(coldUmbrellaStoryVideo.sourceLabel, "Instagram Story");
    assert.equal(coldUmbrellaStoryVideo.sourceDate, "2026-09-20");
    assert.equal("sourceUrl" in coldUmbrellaStoryVideo, false);
    assert.equal(coldUmbrellaStoryVideo.published, true);
    assert.equal(coldUmbrellaStoryVideo.width, 720);
    assert.equal(coldUmbrellaStoryVideo.height, 1280);
    assert.equal(coldUmbrellaStoryVideo.src, `/media/gallery/${PUBLIC_VIDEO}`);
    assert.equal(
      coldUmbrellaStoryVideo.poster,
      `/media/gallery/${PUBLIC_POSTER}`,
    );

    const entries = selectGalleryEntries().filter(({ key }) => key === MEDIA_ID);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].kind, "video");
    assert.equal(entries[0].item.video.controls, true);
    assert.equal(entries[0].item.video.playsInline, true);
    assert.equal(entries[0].item.video.preload, "none");

    for (const activityId of ["campus-girls", "miss-circle", "live-stream", "radio"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (candidate) => candidate.id === NEWS_ID,
        ),
        false,
      );
      assert.equal(
        selectActivityMedia(activityId).some((candidate) => candidate.id === MEDIA_ID),
        false,
      );
      assert.equal(
        selectActivityMedia(activityId, priorMediaSources).some(
          (candidate) => candidate.id === MEDIA_ID,
        ),
        false,
      );
    }

    const feed = createPortalFeed({
      now: new Date("2026-09-20T22:00:00+09:00"),
      newsItems: news,
      storyItems: [],
      eventItems: [],
    });
    assertPortalNewsFollowsSort(feed, news);
    const feedItem = findFeedItem(feed, portalNewsId(NEWS_ID));
    assert.equal(feedItem.sourceUrl, undefined);
    assert.equal(feedItem.title, TITLE);
    assert.ok(feedItem.image?.endsWith(PUBLIC_POSTER));
  });

  it("quotes the overlay without inventing a destination or voting window", () => {
    const entry = item();
    const copy = `${entry.title}\n${entry.body}\n${entry.message.text}`;

    assert.match(copy, /寒がりのみりいには耐え難い気温かも/);
    assert.match(copy, /行ってきまーす/);
    assert.doesNotMatch(copy, /横アリ|横浜アリーナ/);
    assert.doesNotMatch(copy, /0:00|23:59|0時|23時/);
    assert.doesNotMatch(copy, /liff\.line\.me|misscircle\.jp|instagram\.com|paton\.jp/);
  });
});

describe("2026-09-20 Instagram Story 寒がり傘 — published media", () => {
  it("publishes exactly one shared MP4 and one real-frame poster", async () => {
    const assets = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b135-"))
      .sort();
    assert.deepEqual(assets, [PUBLIC_POSTER, PUBLIC_VIDEO].sort());

    const mp4 = path.join(galleryDirectory, PUBLIC_VIDEO);
    const poster = path.join(galleryDirectory, PUBLIC_POSTER);
    assert.equal((await stat(mp4)).size, PUBLIC_BYTES);
    assert.equal(await sha256(mp4), PUBLIC_SHA256);
    assert.equal((await stat(poster)).size, POSTER_BYTES);
    assert.equal(await sha256(poster), POSTER_SHA256);

    const metadata = await sharp(poster).metadata();
    assert.equal(metadata.width, 720);
    assert.equal(metadata.height, 1280);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
  });

  it("keeps 30fps H.264 video-only and faststart without source metadata", async () => {
    const mp4 = path.join(galleryDirectory, PUBLIC_VIDEO);
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");

    assert.ok(video);
    assert.equal(audio, undefined);
    assert.equal(video.codec_name, "h264");
    assert.equal(video.profile, "Constrained Baseline");
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.avg_frame_rate, "30/1");
    assert.equal(video.nb_frames, "252");
    assert.equal(Number(info.format.duration), 8.4);
    assert.equal(video.has_b_frames, 0);
    assert.equal(info.format.nb_streams, 1);
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(info.chapters, []);
    assert.equal(video.tags?.creation_time, undefined);
    assert.equal(info.format.tags?.creation_time, undefined);
    assert.equal(JSON.stringify(info).includes("Core Media"), false);
  });
});

describe("2026-09-20 Instagram Story 寒がり傘 — privacy and scope", () => {
  it("does not create articles, milestones, events, schedules, or photo records", () => {
    const ids = new Set([NEWS_ID, MEDIA_ID]);

    assert.equal(
      stories.some((entry) => ids.has(entry.slug) || ids.has(entry.id)),
      false,
    );
    assert.equal(highlights.some((entry) => ids.has(entry.id)), false);
    assert.equal(events.some((entry) => ids.has(entry.id)), false);
    assert.equal(media.some((entry) => ids.has(entry.id)), false);
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
    assert.equal(
      streamSchedule.some((entry) => JSON.stringify(entry).includes("b135")),
      false,
    );
  });

  it("keeps the original and handoff identifiers out of tracked text", async () => {
    const forbidden = [
      /(?:^|\/)upload\//i,
      /uploads\//i,
      /drive\.google\.com/i,
      /[0-9A-F]{8}(?:-[0-9A-F]{4}){3}-[0-9A-F]{12}\.mp4/i,
      /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/i,
      /\/root\/|\/mnt\/|\/tmp\//,
    ];

    for (const { file, text } of await changedText()) {
      for (const pattern of forbidden) {
        assert.doesNotMatch(text, pattern, file);
      }
      assert.equal(DRIVE_HOST_PATTERN.test(text), false, file);
      assert.equal(DRIVE_FOLDER_PATTERN.test(text), false, file);
    }

    const { stdout } = await run("git", ["ls-files", "media/original"], {
      cwd: root,
    });
    assert.equal(stdout.trim(), "media/original/README.md");
  });

  it("documents the batch ledger and the operational notes", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const start = ops.indexOf(
      "## 2026-09-20確認: Instagram Story「寒がりのみりいには耐え難い気温かも」",
    );
    assert.notEqual(start, -1);
    const section = ops.slice(start, ops.indexOf("\n## 2026-09-19確認", start));

    assert.match(docs, /batch b135/);
    assert.match(docs, /720×1280/);
    assert.match(docs, /video-only/);
    assert.match(docs, new RegExp(PUBLIC_VIDEO.replace(/\./g, "\\.")));
    assert.match(docs, new RegExp(PUBLIC_SHA256));
    assert.match(docs, new RegExp(POSTER_SHA256));
    assert.match(docs, new RegExp(ORIGINAL_SHA256));
    assert.match(docs, /3\.0秒地点の実フレーム/);
    assert.match(section, /Activities 非関連付け/);
    assert.match(section, /2101590482250088823/);
    assert.doesNotMatch(docs, /drive\.google\.com/);
    assert.doesNotMatch(section, /drive\.google\.com/);
  });
});
