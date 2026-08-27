import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { open, readFile, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { campusGirlsPatonVoteLink } from "../src/data/links.ts";
import { media } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import { patonVoteDay3StoryVideo } from "../src/data/patonVoteDay3StoryVideo.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(
  publicDirectory,
  "mily-b39-01-paton-vote-day-3-story.mp4",
);
const poster = path.join(
  publicDirectory,
  "mily-b39-01-paton-vote-day-3-story-poster.jpg",
);
const MEDIA_ID = "mily-b39-01-paton-vote-day-3-story";
const PATON_URL = "https://paton.jp/event/entrant/11380";
const VIDEO_BYTES = 24_372;
const VIDEO_SHA256 =
  "d7c5d3c7b0f2382e2c6d1872c23d088bbcbce8792fd2dceac81cea6749608bb5";
const POSTER_BYTES = 7_142;
const POSTER_SHA256 =
  "60a0079fa98bee0f693d764311ee3ad534a8b8288a23314069b3d1bc96fd5d48";

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
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

describe("2026-08-28 Paton投票3日目 Instagram Story — 応援導線", () => {
  it("keeps one owner-provided manifest with non-link Story attribution", () => {
    assert.equal(patonVoteDay3StoryVideo.id, MEDIA_ID);
    assert.equal(patonVoteDay3StoryVideo.kind, "video");
    assert.equal(
      patonVoteDay3StoryVideo.src,
      "/media/gallery/mily-b39-01-paton-vote-day-3-story.mp4",
    );
    assert.equal(
      patonVoteDay3StoryVideo.poster,
      "/media/gallery/mily-b39-01-paton-vote-day-3-story-poster.jpg",
    );
    assert.equal(patonVoteDay3StoryVideo.width, 240);
    assert.equal(patonVoteDay3StoryVideo.height, 426);
    assert.equal(patonVoteDay3StoryVideo.provenance, "owner-provided");
    assert.equal(patonVoteDay3StoryVideo.sourceLabel, "Instagram Story");
    assert.equal(patonVoteDay3StoryVideo.sourceDate, "2026-08-28");
    assert.equal(patonVoteDay3StoryVideo.published, true);
    assert.equal("sourceUrl" in patonVoteDay3StoryVideo, false);
    assert.match(patonVoteDay3StoryVideo.alt, /パトン投票3日目/);
  });

  it("shows the Story in the active Paton guide and keeps the verified direct CTA", async () => {
    const guide = await readFile(
      path.join(root, "src/components/PatonVoteGuide.tsx"),
      "utf8",
    );
    const app = await readFile(path.join(root, "src/App.tsx"), "utf8");
    const support = await readFile(path.join(root, "src/SupportPage.tsx"), "utf8");

    assert.equal(campusGirlsPatonVoteLink.url, PATON_URL);
    assert.match(guide, /patonVoteDay3StoryVideo/);
    assert.match(guide, /8\/28のInstagram Story/);
    assert.match(guide, /パトン投票3日目はここから❣️/);
    assert.match(guide, /Story内のリンクはサイト上では押せないため/);
    assert.match(guide, /href=\{campusGirlsPatonVoteLink\.url\}/);
    assert.match(guide, /isSupportEventUrlActive/);
    assert.match(guide, /<video/);
    assert.match(guide, /controls/);
    assert.match(guide, /playsInline/);
    assert.match(guide, /preload="none"/);
    assert.match(guide, /poster=\{patonVoteDay3StoryVideo\.poster\}/);
    assert.match(guide, /width=\{patonVoteDay3StoryVideo\.width\}/);
    assert.match(guide, /height=\{patonVoteDay3StoryVideo\.height\}/);
    assert.doesNotMatch(guide, /autoPlay|autoplay|\bloop\b/);
    assert.match(app, /<PatonVoteGuide/);
    assert.match(support, /<PatonVoteGuide/);
  });

  it("does not duplicate the temporary Story into archival data surfaces", () => {
    assert.equal(news.some((entry) => entry.id === MEDIA_ID), false);
    assert.equal(galleryVideos.some((entry) => entry.id === MEDIA_ID), false);
    assert.equal(media.some((entry) => entry.id === MEDIA_ID), false);
    assert.equal(stories.some((entry) => JSON.stringify(entry).includes(MEDIA_ID)), false);
    assert.equal(highlights.some((entry) => entry.id === MEDIA_ID), false);
    assert.equal(events.some((entry) => JSON.stringify(entry).includes(MEDIA_ID)), false);
    assert.equal(
      streamSchedule.some((entry) => JSON.stringify(entry).includes(MEDIA_ID)),
      false,
    );
  });
});

describe("2026-08-28 Paton投票3日目 Instagram Story — generated media", () => {
  it("generates exact verified public files", async () => {
    const videoBytes = await readFile(mp4);
    const posterBytes = await readFile(poster);

    assert.equal((await stat(mp4)).size, VIDEO_BYTES);
    assert.equal(sha256(videoBytes), VIDEO_SHA256);
    assert.equal((await stat(poster)).size, POSTER_BYTES);
    assert.equal(sha256(posterBytes), POSTER_SHA256);
  });

  it("publishes a faststart, video-only Baseline MP4", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.level, 30);
    assert.equal(video.width, 240);
    assert.equal(video.height, 426);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.avg_frame_rate, "15/1");
    assert.equal(video.nb_frames, "300");
    assert.ok(Math.abs(Number(info.format.duration) - 20) < 0.001);
    assert.equal(audio, undefined);
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
      const moov = window.indexOf("moov", 0, "latin1");
      const mdat = window.indexOf("mdat", 0, "latin1");
      assert.ok(moov >= 0 && mdat >= 0 && moov < mdat);
    } finally {
      await handle.close();
    }
  });

  it("uses a metadata-free frame from the public video as poster", async () => {
    const metadata = await sharp(poster).metadata();
    assert.equal(metadata.width, 240);
    assert.equal(metadata.height, 426);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);

    const ffmpeg = await ffmpegExe();
    const { stdout } = await run(
      ffmpeg,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-ss",
        "8.0",
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
      { encoding: "buffer", maxBuffer: 1024 * 1024 * 16 },
    );
    const posterGray = await sharp(poster).greyscale().raw().toBuffer();

    assert.equal(stdout.length, posterGray.length);
    let total = 0;
    for (let index = 0; index < posterGray.length; index += 1) {
      total += Math.abs(posterGray[index] - stdout[index]);
    }
    assert.ok(total / posterGray.length < 4);
  });

  it("keeps originals and generated binaries out of tracked paths", async () => {
    const { stdout } = await run("git", ["ls-files"], { cwd: root });
    const tracked = stdout.split("\n").filter(Boolean);

    assert.equal(
      tracked.some((entry) => entry.startsWith("media/original/") && entry.includes("b39")),
      false,
    );
    assert.equal(
      tracked.includes("public/media/gallery/mily-b39-01-paton-vote-day-3-story.mp4"),
      false,
    );
    assert.equal(
      tracked.includes(
        "public/media/gallery/mily-b39-01-paton-vote-day-3-story-poster.jpg",
      ),
      false,
    );
  });
});
