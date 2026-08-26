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
import { driveVideoView } from "../src/data/driveGallery.ts";
import {
  galleryVideos,
  nightThanksMorningStreamStoryVideo,
  seasideCircleYesTokyoVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { events } from "../src/data/events.ts";
import { links } from "../src/data/links.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { profile } from "../src/data/profile.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { stories } from "../src/data/stories.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { isFaststart, validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
  isProbablyBinary,
} from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(
  galleryDirectory,
  "mily-b25-01-seasidecircle-yes-tokyo.mp4",
);
const poster = path.join(
  galleryDirectory,
  "mily-b25-01-seasidecircle-yes-tokyo-poster.jpg",
);
const original = path.join(
  root,
  "media/original/mily-b25-01-seasidecircle-yes-tokyo.mp4",
);

const NEWS_ID = "2026-08-24-seasidecircle-yes-tokyo";
const INSTAGRAM_PROFILE = "https://www.instagram.com/seasidecircle";
const ALT = "ラジオスタジオで両手を挙げて踊る、みりぃの縦型動画";
const MESSAGE = `Yes!東京
#踊ってみた #ダンス #ミスコン #ラジオ`;
const POSTER_SECONDS = "8.0";
const ORIGINAL_SHA256 =
  "7badb86e34988df04d96486b14f4283309f08fd4bb847197dad3ebeb196dfe27";
const PUBLIC_MP4_SHA256 =
  "8ebc63ccaae09efe3e7d33a7112fa31c005a25128693a932f220c0a9fd03b6ca";
const PUBLIC_MP4_SIZE = 8557057;
const POSTER_SHA256 =
  "afeb34bb44910c71d2c39cd086218f972cc917863f3446f00a1adc625141e1e6";
const DOCS_HOST_PATTERN = /docs\.google\.com/i;
const DRIVE_SHARE_QUERY_PATTERN = /usp=drivesdk/i;
const DRIVE_FILE_PATH_PATTERN = /\/file\/d\//i;
const TRANSFER_PATH_PATTERN = /\/mnt\/data|\/exec-daemon\//i;

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

async function ffmpegExe() {
  const mod = await import("ffmpeg-static");
  return mod.default ?? mod;
}

async function probe(file) {
  const ffprobe = await ffprobeExe();
  const { stdout } = await run(ffprobe, [
    "-hide_banner", "-v", "error",
    "-show_format", "-show_streams", "-show_chapters",
    "-print_format", "json", file,
  ]);
  return JSON.parse(stdout);
}

async function repositoryFiles() {
  const { stdout } = await run(
    "git",
    ["ls-files", "-co", "--exclude-standard"],
    { cwd: root, maxBuffer: 1024 * 1024 * 16 },
  );
  return stdout.split("\n").filter(Boolean);
}

describe("2026-08-24 seasidecircle Yes! Tokyo dance — NEWS", () => {
  it("adds one 8/24 NEWS item for the dance video", () => {
    const matches = news.filter((entry) => entry.id === NEWS_ID);
    const extra = news.filter(
      (entry) =>
        entry.id !== NEWS_ID &&
        (entry.id.includes("yes-tokyo") ||
          entry.id.includes("seasidecircle-yes")),
    );

    assert.equal(matches.length, 1);
    assert.equal(item()?.id, NEWS_ID);
    assert.equal(item()?.date, "2026-08-24");
    assert.equal(item()?.sameDayOrder, 4);
    assert.deepEqual(item()?.activityIds, ["radio"]);
    assert.equal(item()?.title, "「Yes!東京」踊ってみた💃");
    assert.equal(extra.length, 0);
    assert.equal(news.length, 34);
    assert.deepEqual(verifyNews([item()]), []);
  });

  it("paraphrases the confirmed caption without inventing a permalink", () => {
    const entry = item();

    assert.match(entry.body, /湘南シーサイドサークルのInstagram/);
    assert.match(entry.body, /「Yes!東京」踊ってみた/);
    assert.match(entry.body, /ダンス・ミスコン・ラジオ/);
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "湘南シーサイドサークル Instagram");
    assert.equal(entry.url, INSTAGRAM_PROFILE);
    assert.equal(entry.ctaLabel, "湘南シーサイドサークル Instagramを見る");
    assert.equal(entry.message?.label, "湘南シーサイドサークルの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.doesNotMatch(entry.body, /公式|公認|本人運営/);
    assert.doesNotMatch(JSON.stringify(entry), /instagram\.com\/(p|reel|stories)\//);
  });

  it("ranks as the top 8/24 Latest item after the newer 8/25 morning STORY CTA", () => {
    const ordered = sortNewsByDateDesc(news).map((entry) => entry.id);
    assert.equal(ordered[0], "2026-08-26-paton-vote-stories");
    assert.equal(ordered[1], "2026-08-26-instagram-followers-400");
    assert.equal(ordered[2], "2026-08-26-morning-stream-thanks");
    assert.equal(ordered[3], "2026-08-26-stream-1000");
    assert.equal(ordered[4], "2026-08-25-mixch-confidence-message");
    assert.equal(ordered[5], "2026-08-25-motivation");
    assert.equal(ordered[6], NEWS_ID);
    assert.equal(ordered[7], "2026-08-24-campus-girls-final-stage-guide");
    assert.equal(ordered[8], "2026-08-24-makeup-stream");
    assert.equal(ordered[9], "2026-08-24-night-thanks-morning-stream");
  });
});

describe("2026-08-24 seasidecircle Yes! Tokyo dance — shared Latest / Gallery asset", () => {
  it("registers exactly one Gallery video and shares the same object with NEWS", () => {
    const visible = visibleGalleryVideos();
    const matches = galleryVideos.filter(
      (entry) => entry.id === seasideCircleYesTokyoVideo.id,
    );

    assert.equal(item().media, seasideCircleYesTokyoVideo);
    assert.deepEqual(matches, [seasideCircleYesTokyoVideo]);
    assert.equal(galleryVideos[2], seasideCircleYesTokyoVideo);
    assert.equal(visible[2], seasideCircleYesTokyoVideo);
    assert.equal(galleryVideos[3], nightThanksMorningStreamStoryVideo);
    assert.equal(galleryVideos.length, 14);
    assert.equal(visible.length, 14);
    assert.equal(seasideCircleYesTokyoVideo.kind, "video");
    assert.equal(seasideCircleYesTokyoVideo.provenance, "owner-provided");
    assert.equal(
      seasideCircleYesTokyoVideo.sourceLabel,
      "湘南シーサイドサークル Instagram",
    );
    assert.equal(seasideCircleYesTokyoVideo.sourceDate, "2026-08-24");
    assert.equal(seasideCircleYesTokyoVideo.published, true);
    assert.equal(seasideCircleYesTokyoVideo.width, 720);
    assert.equal(seasideCircleYesTokyoVideo.height, 1280);
    assert.equal(seasideCircleYesTokyoVideo.alt, ALT);
    assert.equal("sourceUrl" in seasideCircleYesTokyoVideo, false);
    assert.equal(item().media.src, seasideCircleYesTokyoVideo.src);
    assert.equal(item().media.poster, seasideCircleYesTokyoVideo.poster);
    assert.doesNotMatch(seasideCircleYesTokyoVideo.alt, /可愛|美人|綺麗/);
  });

  it("publishes exactly one local MP4 and one local poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b25-01-seasidecircle-yes-tokyo"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b25-01-seasidecircle-yes-tokyo-poster.jpg",
      "media/gallery/mily-b25-01-seasidecircle-yes-tokyo.mp4",
    ]);
    assert.match(seasideCircleYesTokyoVideo.src, /^\/media\/gallery\//);
    assert.match(seasideCircleYesTokyoVideo.poster, /^\/media\/gallery\//);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(poster)).size > 0);
    assert.equal(
      existsSync(path.join(root, "public/media/news/mily-b25-01-seasidecircle-yes-tokyo.mp4")),
      false,
    );
  });

  it("keeps Gallery newest-first after inserting b25", () => {
    assert.deepEqual(
      visibleGalleryVideos().map((entry) => entry.sourceDate),
      [
        "2026-08-26",
        "2026-08-26",
        "2026-08-24",
        "2026-08-24",
        "2026-08-23",
        "2026-08-23",
        "2026-08-23",
        "2026-08-21",
        "2026-08-21",
        "2026-08-21",
        "2026-08-21",
        "2026-08-20",
        "2026-08-19",
        "2026-08-17",
      ],
    );
  });
});

describe("2026-08-24 seasidecircle Yes! Tokyo dance — published derivatives", () => {
  it("keeps the received original bytes when present locally", async () => {
    if (!existsSync(original)) return;

    const bytes = await readFile(original);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), ORIGINAL_SHA256);
    assert.equal(bytes.length, 37468526);

    const meta = await probe(original);
    const video = meta.streams.find((stream) => stream.codec_type === "video");
    const audio = meta.streams.find((stream) => stream.codec_type === "audio");
    assert.equal(video?.codec_name, "h264");
    assert.equal(video?.profile, "High");
    assert.equal(video?.width, 720);
    assert.equal(video?.height, 1280);
    assert.equal(video?.avg_frame_rate, "30/1");
    assert.equal(video?.pix_fmt, "yuv420p");
    assert.equal(video?.nb_frames, "855");
    assert.equal(meta.format.duration, "28.500000");
    assert.equal(audio?.codec_name, "aac");
    assert.equal(audio?.profile, "HE-AAC");
    assert.equal(audio?.sample_rate, "44100");
    assert.equal(audio?.channels, 2);
    assert.deepEqual(meta.chapters, []);
  });

  it("publishes a faststart Baseline video-only MP4 without privacy metadata", async () => {
    const bytes = await readFile(mp4);
    assert.equal(bytes.length, PUBLIC_MP4_SIZE);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), PUBLIC_MP4_SHA256);
    assert.equal(await isFaststart(mp4), true);
    await validateVideoDerivatives(seasideCircleYesTokyoVideo, galleryDirectory);

    const meta = await probe(mp4);
    assert.equal(meta.streams.length, 1);
    const video = meta.streams[0];
    assert.equal(video.codec_type, "video");
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/i);
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.avg_frame_rate, "30/1");
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.nb_frames, "855");
    assert.equal(video.has_b_frames, 0);
    assert.equal(meta.format.duration, "28.500000");
    assert.equal(meta.streams.some((stream) => stream.codec_type === "audio"), false);
    assert.deepEqual(meta.chapters, []);
    assert.equal(meta.format.tags?.creation_time, undefined);
    assert.doesNotMatch(JSON.stringify(meta), /Core Media/);
  });

  it("uses an 8.0s real frame poster without privacy metadata", async () => {
    const posterBytes = await readFile(poster);
    const metadata = await sharp(poster).metadata();
    assert.equal(createHash("sha256").update(posterBytes).digest("hex"), POSTER_SHA256);
    assert.equal(metadata.width, 720);
    assert.equal(metadata.height, 1280);
    assert.equal(Boolean(metadata.exif), false);
    assert.equal(Boolean(metadata.iptc), false);
    assert.equal(Boolean(metadata.xmp), false);
    assert.equal(Boolean(metadata.icc), false);

    const ffmpeg = await ffmpegExe();
    const { stdout } = await run(
      ffmpeg,
      [
        "-hide_banner", "-loglevel", "error",
        "-ss", POSTER_SECONDS, "-i", mp4,
        "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-",
      ],
      { encoding: "buffer", maxBuffer: 720 * 1280 * 2 },
    );
    const posterGray = await sharp(poster).greyscale().raw().toBuffer();
    assert.equal(stdout.length, posterGray.length);
    let total = 0;
    for (let index = 0; index < posterGray.length; index += 1) {
      total += Math.abs(posterGray[index] - stdout[index]);
    }
    assert.ok(total / posterGray.length < 3);
  });
});

describe("2026-08-24 seasidecircle Yes! Tokyo dance — activity and scope", () => {
  it("appears once on the radio Activity only", () => {
    const radioNews = selectActivityNews("radio", news, news.length);
    const missNews = selectActivityNews("miss-circle", news, news.length);
    const radioMedia = selectActivityMedia("radio");
    const missMedia = selectActivityMedia("miss-circle");

    assert.equal(radioNews.filter((entry) => entry.id === NEWS_ID).length, 1);
    assert.equal(missNews.filter((entry) => entry.id === NEWS_ID).length, 0);
    assert.equal(radioNews[0]?.id, NEWS_ID);
    assert.equal(radioMedia[0], seasideCircleYesTokyoVideo);
    assert.equal(
      missMedia.filter((entry) => entry === seasideCircleYesTokyoVideo).length,
      0,
    );
  });

  it("does not expand into stories, events, schedule, profile, or links", async () => {
    assert.equal(events.length, 0);
    assert.deepEqual(streamSchedule, []);
    assert.equal(profile.displayName, "みりぃ");
    assert.equal(profile.publicName, "三橋莉子");
    assert.equal(
      stories.some((story) => JSON.stringify(story).includes("yes-tokyo")),
      false,
    );
    assert.ok(
      links.some((link) => link.url === INSTAGRAM_PROFILE),
    );

    for (const relative of [
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
      "src/data/highlights.ts",
      "src/data/contest.ts",
      "src/data/profile.ts",
      "src/data/socials.ts",
      "src/data/links.ts",
      "src/data/media.ts",
      "shared/radio-program.js",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("mily-b25-01"), false, relative);
    }
  });

  it("keeps video playback controls without autoplay", async () => {
    const view = driveVideoView(seasideCircleYesTokyoVideo);
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const gallery = await readFile(path.join(root, "src/components/Gallery.tsx"), "utf8");

    assert.equal(view.video.controls, true);
    assert.equal(view.video.playsInline, true);
    assert.equal(view.video.preload, "none");
    assert.equal("autoPlay" in view.video, false);
    assert.equal("loop" in view.video, false);
    for (const source of [latest, gallery]) {
      assert.match(source, /controls/);
      assert.match(source, /playsInline/);
      assert.match(source, /preload/);
      assert.doesNotMatch(source, /autoPlay|autoplay|\bloop\b/);
    }
  });
});

describe("2026-08-24 seasidecircle Yes! Tokyo dance — privacy", () => {
  it("keeps Drive handoff fields out of tracked and public data", async () => {
    const scoped = [
      "src/data/seasideCircleYesTokyoVideo.json",
      "src/data/seasideCircleYesTokyoVideo.ts",
      "src/data/galleryVideos.ts",
      "src/data/news.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ];
    const files = await repositoryFiles();
    const published = JSON.stringify({
      news: item(),
      video: seasideCircleYesTokyoVideo,
    });

    assert.equal(files.includes(path.relative(root, original).replaceAll("\\", "/")), false);
    assert.equal("sourceUrl" in seasideCircleYesTokyoVideo, false);
    assert.doesNotMatch(published, DRIVE_HOST_PATTERN);
    assert.doesNotMatch(published, DOCS_HOST_PATTERN);
    assert.doesNotMatch(published, DRIVE_SHARE_QUERY_PATTERN);
    assert.doesNotMatch(published, DRIVE_FILE_PATH_PATTERN);
    assert.deepEqual(findDriveIds(published), []);

    for (const relative of scoped) {
      const bytes = await readFile(path.join(root, relative));
      if (isProbablyBinary(bytes)) continue;
      const source = bytes.toString("utf8");
      assert.doesNotMatch(source, DRIVE_HOST_PATTERN, relative);
      assert.doesNotMatch(source, DOCS_HOST_PATTERN, relative);
      assert.doesNotMatch(source, DRIVE_SHARE_QUERY_PATTERN, relative);
      assert.doesNotMatch(source, DRIVE_FILE_PATH_PATTERN, relative);
      assert.doesNotMatch(source, TRANSFER_PATH_PATTERN, relative);
    }
  });

  it("documents the shared video and audio removal", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");

    assert.match(docs, /batch b25/);
    assert.match(docs, /seasideCircleYesTokyoVideo\.json/);
    assert.match(docs, /8\.0秒地点/);
    assert.match(docs, /音声ストリームなし/);
    assert.match(docs, /再配信権を確認できないため/);
    assert.match(docs, /720×1280/);
    assert.match(docs, /512×910/);
    assert.match(docs, /実フレーム/);
    assert.match(docs, /AI生成・顔加工・塗り足しなし/);
    assert.match(ops, /34件/);
    assert.match(ops, /独立動画14本/);
    assert.match(ops, /Yes!東京/);
    assert.doesNotMatch(docs, DRIVE_HOST_PATTERN);
    assert.doesNotMatch(docs, DOCS_HOST_PATTERN);
    assert.doesNotMatch(docs, DRIVE_SHARE_QUERY_PATTERN);
    assert.doesNotMatch(docs, DRIVE_FILE_PATH_PATTERN);
  });

  it("keeps Portal Feed aligned with the new Latest lead", () => {
    const feed = createPortalFeed();
    const entry = feed.items.find((candidate) => candidate.id === `mily:news:${NEWS_ID}`);
    const latestIds = sortNewsByDateDesc(news).map((candidate) => candidate.id);
    assert.ok(entry);
    assert.equal(entry.publishedAt, "2026-08-24T00:00:00+09:00");
    assert.equal(entry.sourceUrl, INSTAGRAM_PROFILE);
    assert.ok(entry.image?.endsWith(seasideCircleYesTokyoVideo.poster));
    assert.equal(latestIds[0], "2026-08-26-paton-vote-stories");
    assert.equal(latestIds[1], "2026-08-26-instagram-followers-400");
    assert.equal(latestIds[2], "2026-08-26-morning-stream-thanks");
    assert.equal(latestIds[3], "2026-08-26-stream-1000");
    assert.equal(latestIds[4], "2026-08-25-mixch-confidence-message");
    assert.equal(latestIds[5], "2026-08-25-motivation");
    assert.equal(latestIds[6], NEWS_ID);
  });
});
