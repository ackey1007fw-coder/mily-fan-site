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
import {
  driveGallerySections,
  driveVideoView,
  visibleDriveGallery,
} from "../src/data/driveGallery.ts";
import {
  galleryVideos,
  morningOhayo20260821,
  morningShowroomRunwayVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { isFaststart, validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import { isProbablyBinary } from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(galleryDirectory, "mily-b12-01-morning-ohayo-story.mp4");
const poster = path.join(
  galleryDirectory,
  "mily-b12-01-morning-ohayo-story-poster.jpg",
);
const original = path.join(
  root,
  "media/original/5A997264-4F9F-4656-A3D9-65AABAFFDCB0.mp4",
);

const NEWS_ID = "2026-08-21-morning-ohayo-story";
const INSTAGRAM_PROFILE = "https://www.instagram.com/mily_chan36";
const ALT =
  "黒縁メガネのフェイスフィルターと「OHAYO!」の文字が表示され、室内でカメラに向かって表情を変える短い自撮り動画";
const POSTER_SECONDS = "3.4";
const ORIGINAL_SHA256 =
  "a098302330a074fea5ca3aaf3a5bda826353d4bcb90be1ad357339626b770abf";
const HANDOFF_HOST = ["drive", "google", "com"].join(".");
const HANDOFF_ID = ["1IdAjhTEeluohQPAMd", "BcqXfFgdTs6cFPN"].join("");

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

describe("2026-08-21 morning OHAYO Instagram Story — Latest", () => {
  it("adds exactly one dated item with a non-link Story label", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-21");
    assert.equal(entry.title, "OHAYO! 👓 8/21朝のInstagram Story");
    assert.equal(
      entry.body,
      "8月21日の朝、みりぃから「OHAYO!」のひとコマが届きました。メガネのフェイスフィルターとともに届けられた、朝の短い動画です。",
    );
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("uses the canonical Instagram profile only as the related URL and CTA", () => {
    const entry = item();

    assert.equal(entry.url, INSTAGRAM_PROFILE);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.equal(entry.source, undefined);
    assert.equal("sourceUrl" in morningOhayo20260821, false);
    assert.equal(morningOhayo20260821.sourceLabel, "Instagram Story");
  });

  it("stores only the confirmed in-video text", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのメッセージ");
    assert.equal(entry.message?.text, "OHAYO!");
    assert.doesNotMatch(entry.title, /気分|感情|かわいい|美しい|公式|公認/);
    assert.doesNotMatch(entry.body, /気分|感情|かわいい|美しい|公式|公認/);
  });

  it("keeps the established same-day id ordering", () => {
    const ordered = sortNewsByDateDesc(news).map((entry) => entry.id);

    assert.deepEqual(ordered.slice(0, 5), [
      NEWS_ID,
      "2026-08-21-morning-showroom-runway",
      "2026-08-20-mango-kakigori",
      "2026-08-20-morning-message",
      "2026-08-20-morning-story",
    ]);
    assert.equal(news.length, 11);
  });
});

describe("2026-08-21 morning OHAYO Story — shared Latest / Gallery asset", () => {
  it("shares one manifest object and stays ahead of the existing b11 video", () => {
    const galleryItem = galleryVideos.find(
      (entry) => entry.id === morningOhayo20260821.id,
    );
    const visible = visibleGalleryVideos();

    assert.equal(item().media, morningOhayo20260821);
    assert.equal(galleryItem, morningOhayo20260821);
    assert.equal(visible[0], morningOhayo20260821);
    assert.equal(visible[1], morningShowroomRunwayVideo);
    assert.deepEqual(visible.map((entry) => entry.sourceDate), [
      "2026-08-21",
      "2026-08-21",
      "2026-08-20",
      "2026-08-19",
      "2026-08-17",
    ]);
    assert.equal(visible.length, 5);
    assert.equal(morningOhayo20260821.sourceDate, "2026-08-21");
    assert.equal(morningOhayo20260821.alt, ALT);
  });

  it("publishes exactly one local MP4 and one local poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b12-01-morning-ohayo-story"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b12-01-morning-ohayo-story-poster.jpg",
      "media/gallery/mily-b12-01-morning-ohayo-story.mp4",
    ]);
    assert.match(morningOhayo20260821.src, /^\/media\//);
    assert.match(morningOhayo20260821.poster, /^\/media\//);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(poster)).size > 0);
  });

  it("keeps Drive Gallery unchanged and adds one standalone video", () => {
    const drive = driveGallerySections(visibleDriveGallery());

    assert.equal(drive.photos.length, 45);
    assert.equal(drive.videos.length, 11);
    assert.equal(galleryVideos.length, 5);
    assert.equal(visibleGalleryVideos().length + drive.videos.length, 16);
  });
});

describe("2026-08-21 morning OHAYO Story — published derivatives", () => {
  it("is H.264 Baseline / yuv420p with source dimensions and no audio", async () => {
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
    assert.equal(video.nb_frames, "123");
    assert.equal(Number(info.format.duration).toFixed(3), "4.100");
    assert.equal(audio, undefined);

    if (existsSync(original)) {
      const source = await probe(original);
      const sourceVideo = source.streams.find(
        (stream) => stream.codec_type === "video",
      );
      const sourceAudio = source.streams.find(
        (stream) => stream.codec_type === "audio",
      );
      const sourceBytes = await readFile(original);

      assert.equal(sourceBytes.length, 5448933);
      assert.equal(
        createHash("sha256").update(sourceBytes).digest("hex"),
        ORIGINAL_SHA256,
      );
      assert.equal(sourceVideo.codec_name, "h264");
      assert.equal(sourceVideo.profile, "High");
      assert.equal(sourceVideo.width, video.width);
      assert.equal(sourceVideo.height, video.height);
      assert.equal(sourceVideo.avg_frame_rate, "30/1");
      assert.equal(sourceVideo.pix_fmt, "yuv420p");
      assert.equal(sourceVideo.nb_frames, "123");
      assert.equal(Number(sourceVideo.duration).toFixed(6), "4.100000");
      assert.equal(sourceAudio.codec_name, "aac");
      assert.equal(sourceAudio.profile, "HE-AAC");
      assert.equal(sourceAudio.sample_rate, "44100");
      assert.equal(sourceAudio.channels, 2);
      assert.equal(sourceAudio.channel_layout, "stereo");
      assert.equal(Number(sourceAudio.duration).toFixed(6), "4.014127");
    }
  });

  it("uses faststart and removes source-specific metadata", async () => {
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(
      await validateVideoDerivatives(morningOhayo20260821, galleryDirectory),
      { width: 720, height: 1280 },
    );

    const handle = await open(mp4, "r");
    try {
      const head = Buffer.alloc(64 * 1024);
      const { bytesRead } = await handle.read(head, 0, head.length, 0);
      const window = head.subarray(0, bytesRead);
      assert.ok(window.indexOf("moov", 0, "latin1") < window.indexOf("mdat", 0, "latin1"));
    } finally {
      await handle.close();
    }

    const info = await probe(mp4);
    assert.equal("creation_time" in (info.format.tags ?? {}), false);
    for (const stream of info.streams) {
      assert.equal("creation_time" in (stream.tags ?? {}), false);
      assert.notEqual(stream.tags?.handler_name, "Core Media Video");
      assert.notEqual(stream.tags?.handler_name, "Core Media Audio");
    }
  });

  it("uses the selected 3.4-second real frame as a metadata-free poster", async () => {
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
        "-hide_banner", "-loglevel", "error", "-ss", POSTER_SECONDS,
        "-i", mp4, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-",
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

  it("documents the video-only policy and shared manifest", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");

    assert.match(docs, /batch b12/);
    assert.match(docs, /再配信権を\s*確認できないため、公開派生はvideo-only（無音）/);
    assert.match(docs, /3\.4秒地点/);
    assert.match(docs, /morningOhayo20260821\.json/);
  });

  it("retains the existing controls / inline / preload contract", async () => {
    const view = driveVideoView(morningOhayo20260821);
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

describe("2026-08-21 morning OHAYO Story — privacy and scope boundaries", () => {
  it("keeps the handoff URL, file id and original out of publishable files", async () => {
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

  it("publishes no Instagram viewer screenshot", async () => {
    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"));
    const screenshotish = /screenshot|screen-shot|story-screen/i;

    assert.deepEqual(publicFiles.filter((file) => screenshotish.test(file)), []);
  });

  it("does not add this daily Story to articles, milestones or events", async () => {
    for (const relative of [
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/contest.ts",
      "src/data/events.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("mily-b12-01"), false, relative);
    }
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
  });
});
