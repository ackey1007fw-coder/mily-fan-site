import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { open, readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { activities } from "../src/data/activities.ts";
import { driveVideoView } from "../src/data/driveGallery.ts";
import {
  galleryVideos,
  morningMissCircleShowroomStoryVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { isFaststart, validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import { findFeedItem, portalNewsId } from "./portal-feed-order.mjs";
import { isProbablyBinary } from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(
  galleryDirectory,
  "mily-b35-01-miss-circle-showroom-story.mp4",
);
const poster = path.join(
  galleryDirectory,
  "mily-b35-01-miss-circle-showroom-story-poster.jpg",
);
const original = path.join(
  root,
  "media/original/mily-b35-01-miss-circle-showroom-story.mp4",
);

const NEWS_ID = "2026-08-27-miss-circle-showroom-story";
const INSTAGRAM_PROFILE = "https://www.instagram.com/mily_chan36";
const POSTER_SECONDS = "8.0";
const ORIGINAL_BYTES = 19_956_962;
const ORIGINAL_SHA256 =
  "230c7088081f5fd72c427d545e427ecc0380717f8ad767cb620e33ce7549b9c3";
const PUBLIC_BYTES = 1_012_519;
const PUBLIC_SHA256 =
  "e54b6f15bd77cdb0820a403eabb83552188e891856d5d6f2566be15685cd1e49";
const POSTER_BYTES = 70_173;
const POSTER_SHA256 =
  "9810d3a4b420ba624ac229d58d778ccc52c0621f89eb440c82614dce96b2cc27";
const HANDOFF_HOST = ["drive", "google", "com"].join(".");
const HANDOFF_ID = ["1jfM_I2hz-lJtZk7fKqcEDOJ", "_HsGZpNVo"].join("");

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

async function repositoryFiles() {
  const { stdout } = await run(
    "git",
    ["ls-files", "-co", "--exclude-standard"],
    { cwd: root, maxBuffer: 1024 * 1024 * 16 },
  );
  return stdout.split("\n").filter(Boolean);
}

describe("2026-08-27 ミスサーSHOWROOM Instagram Story — Latest / NEWS", () => {
  it("adds only the confirmed date, display text and related Instagram profile", () => {
    const entry = item();

    assert.equal(sortNewsByDateDesc(news)[3]?.id, NEWS_ID);
    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-27");
    assert.equal(entry.sameDayOrder, undefined);
    assert.equal(entry.activityIds, undefined);
    assert.equal(entry.title, "おはよう☀️ 8/27は14:00〜ミスサーSR配信");
    assert.equal(
      entry.body,
      "8月27日、みりぃがInstagram Storyで、14:00からのミスサーSHOWROOM配信を案内しました。「おはよう」のメッセージを添えた短い動画です。",
    );
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.equal(entry.url, INSTAGRAM_PROFILE);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.equal(entry.message?.label, "みりぃのStory");
    assert.equal(
      entry.message?.text,
      "おはよう\n\n【8/27（木）】\nミスサーSR配信📶\n14:00〜",
    );
    assert.deepEqual(verifyNews([entry]), []);
    assert.doesNotMatch(entry.title, /公式|公認|かわいい|美しい/);
    assert.doesNotMatch(entry.body, /公式|公認|かわいい|美しい/);
  });

  it("shares one manifest object with Gallery and keeps Story attribution non-link", () => {
    const entry = item();
    const galleryItem = galleryVideos.find(
      (candidate) => candidate.id === morningMissCircleShowroomStoryVideo.id,
    );

    assert.equal(entry.media, morningMissCircleShowroomStoryVideo);
    assert.equal(galleryItem, morningMissCircleShowroomStoryVideo);
    assert.equal(visibleGalleryVideos()[1], morningMissCircleShowroomStoryVideo);
    assert.equal(morningMissCircleShowroomStoryVideo.sourceDate, "2026-08-27");
    assert.equal(morningMissCircleShowroomStoryVideo.sourceLabel, "Instagram Story");
    assert.equal("sourceUrl" in morningMissCircleShowroomStoryVideo, false);
    assert.equal(morningMissCircleShowroomStoryVideo.published, true);
  });

  it("flows through the capped Portal Feed from the scoped NEWS source", () => {
    const scopedNews = news.filter((entry) => entry.id === NEWS_ID);
    const feed = createPortalFeed({
      now: new Date("2026-08-27T12:30:00+09:00"),
      newsItems: scopedNews,
      storyItems: [],
      eventItems: [],
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assert.equal(entry.publishedAt, "2026-08-27T00:00:00+09:00");
    assert.equal(entry.sourceUrl, INSTAGRAM_PROFILE);
    assert.ok(entry.image?.endsWith(morningMissCircleShowroomStoryVideo.poster));
  });
});

describe("2026-08-27 ミスサーSHOWROOM Instagram Story — published media", () => {
  it("publishes exactly one shared MP4 and one poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b35-01-miss-circle-showroom-story"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b35-01-miss-circle-showroom-story-poster.jpg",
      "media/gallery/mily-b35-01-miss-circle-showroom-story.mp4",
    ]);
    assert.equal((await stat(mp4)).size, PUBLIC_BYTES);
    assert.equal(await sha256(mp4), PUBLIC_SHA256);
    assert.equal((await stat(poster)).size, POSTER_BYTES);
    assert.equal(await sha256(poster), POSTER_SHA256);
  });

  it("keeps source geometry and frames, removes unconfirmed audio, and uses Baseline", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.avg_frame_rate, "30/1");
    assert.equal(video.nb_frames, "527");
    assert.ok(Math.abs(Number(info.format.duration) - 17.567) < 0.001);
    assert.equal(audio, undefined);

    if (existsSync(original)) {
      const source = await probe(original);
      const sourceVideo = source.streams.find(
        (stream) => stream.codec_type === "video",
      );
      const sourceAudio = source.streams.find(
        (stream) => stream.codec_type === "audio",
      );

      assert.equal((await stat(original)).size, ORIGINAL_BYTES);
      assert.equal(await sha256(original), ORIGINAL_SHA256);
      assert.equal(sourceVideo.codec_name, "h264");
      assert.equal(sourceVideo.profile, "High");
      assert.equal(sourceVideo.width, video.width);
      assert.equal(sourceVideo.height, video.height);
      assert.equal(sourceVideo.avg_frame_rate, video.avg_frame_rate);
      assert.equal(sourceVideo.nb_frames, video.nb_frames);
      assert.equal(sourceAudio.codec_name, "aac");
      assert.equal(sourceAudio.profile, "HE-AAC");
      assert.equal(sourceAudio.sample_rate, "44100");
      assert.equal(sourceAudio.channels, 2);
    }
  });

  it("uses faststart and removes source metadata", async () => {
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(
      await validateVideoDerivatives(
        morningMissCircleShowroomStoryVideo,
        galleryDirectory,
      ),
      { width: 720, height: 1280 },
    );

    const info = await probe(mp4);
    assert.equal("creation_time" in (info.format.tags ?? {}), false);
    assert.deepEqual(info.chapters, []);
    for (const stream of info.streams) {
      assert.equal("creation_time" in (stream.tags ?? {}), false);
      assert.notEqual(stream.tags?.handler_name, "Core Media Video");
      assert.notEqual(stream.tags?.handler_name, "Core Media Audio");
    }

    const handle = await open(mp4, "r");
    try {
      const head = Buffer.alloc(64 * 1024);
      const { bytesRead } = await handle.read(head, 0, head.length, 0);
      const window = head.subarray(0, bytesRead);
      assert.ok(window.indexOf("moov", 0, "latin1") < window.indexOf("mdat", 0, "latin1"));
    } finally {
      await handle.close();
    }
  });

  it("uses the selected 8-second real frame as a metadata-free poster", async () => {
    const meta = await sharp(poster).metadata();
    assert.equal(meta.width, 720);
    assert.equal(meta.height, 1280);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.iptc, undefined);
    assert.equal(meta.xmp, undefined);
    assert.equal(meta.icc, undefined);

    const ffmpeg = await ffmpegExe();
    const { stdout } = await run(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-ss",
        POSTER_SECONDS,
        "-i",
        mp4,
        "-frames:v",
        "1",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "gray",
        "-",
      ],
      { encoding: "buffer", maxBuffer: 1024 * 1024 * 64 },
    );
    const posterGray = await sharp(poster).greyscale().raw().toBuffer();

    assert.equal(stdout.length, posterGray.length);
    let total = 0;
    for (let index = 0; index < posterGray.length; index += 1) {
      total += Math.abs(posterGray[index] - stdout[index]);
    }
    assert.ok(total / posterGray.length < 3);
  });

  it("retains controls, inline playback and no autoplay/loop", async () => {
    const view = driveVideoView(morningMissCircleShowroomStoryVideo);
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

describe("2026-08-27 ミスサーSHOWROOM Instagram Story — privacy and scope", () => {
  it("keeps transfer details and the original out of tracked files", async () => {
    const files = await repositoryFiles();

    assert.equal(files.includes(path.relative(root, original).replaceAll("\\", "/")), false);
    for (const relative of files) {
      const bytes = await readFile(path.join(root, relative));
      if (isProbablyBinary(bytes)) continue;
      const source = bytes.toString("utf8");
      assert.equal(source.includes(HANDOFF_HOST), false, relative);
      assert.equal(source.includes(HANDOFF_ID), false, relative);
    }
  });

  it("does not create a Story article, schedule entry, photo or Activity media", async () => {
    for (const relative of [
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
      "src/data/media.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(
        source.includes(morningMissCircleShowroomStoryVideo.id),
        false,
        relative,
      );
    }
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
    for (const activity of activities) {
      assert.equal(
        selectActivityMedia(activity.id).some(
          (media) => media.id === morningMissCircleShowroomStoryVideo.id,
        ),
        false,
        activity.id,
      );
    }
  });
});
