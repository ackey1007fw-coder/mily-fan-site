import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
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
  eventStory20260821,
  galleryVideos,
  tiktokRadioVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { isFaststart, validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import { isProbablyBinary } from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(galleryDirectory, "mily-b15-01-tiktok-radio-misscircle.mp4");
const poster = path.join(
  galleryDirectory,
  "mily-b15-01-tiktok-radio-misscircle-poster.jpg",
);
const original = path.join(
  root,
  "media/original",
  ["oI6IiTYQEia0BuixSZBr", "BE5gEA8RVSPKyAIoo.mp4"].join(""),
);

const NEWS_ID = "2026-08-21-tiktok-radio-misscircle";
const SOURCE = "https://www.tiktok.com/@seasidecircle/video/7676407054466174229";
const TITLE = "湘南シーサイドサークルのTikTokにみりぃが登場📻✨";
const BODY =
  "8月21日、湘南シーサイドサークルのTikTokに、みりぃの動画が投稿されました。番組TikTokに登場したみりぃが、ラジオDJとミスコンの両方を頑張る気持ちを伝えています。";
const MESSAGE = "ラジオDJもミスコンも頑張らせていただくよ✌みりぃです^^";
const ALT =
  "室内でカメラに向かい、手でポーズを取りながら表情を変える、みりぃの短い縦型動画";
const ORIGINAL_SHA256 =
  "40af17f54b7d254d7e337a41cf86d6ec7309985725a928ae0fc0929620b3d50f";
const POSTER_SECONDS = "5.5";
const HANDOFF_HOST = ["drive", "google", "com"].join(".");
const HANDOFF_ID = ["1-aVNLGhEQm5yqdIRof8B", "IHSmn3XuQHRr"].join("");

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

async function repositoryFiles() {
  const { stdout } = await run(
    "git",
    ["ls-files", "-co", "--exclude-standard"],
    { cwd: root, maxBuffer: 1024 * 1024 * 16 },
  );
  return stdout.split("\n").filter(Boolean);
}

describe("2026-08-21 TikTok radio / misscircle post — Latest", () => {
  it("adds exactly one dated News item with the canonical TikTok source", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-21");
    assert.equal(entry.sameDayOrder, 1);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "湘南シーサイドサークルのTikTok投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("preserves only the confirmed post text", () => {
    const entry = item();

    assert.equal(entry.message?.label, "湘南シーサイドサークルの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.doesNotMatch(entry.body, /目標|結果|達成|受賞|順位|投稿時刻|#\S+/);
    assert.equal(entry.body.includes(["みりぃが", "TikTokを更新"].join("")), false);
  });

  it("leads Latest on 8/21 without changing the remaining same-day order", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story")).map((entry) => entry.id);
    assert.deepEqual(ordered.slice(0, 24), [
      "2026-08-26-girlsaward-showroom-6th",
      "2026-08-26-paton-vote-stories",
      "2026-08-26-instagram-followers-400",
      "2026-08-26-morning-stream-thanks",
      "2026-08-26-girl-award-event-fanroom",
      "2026-08-26-mixch-15x-day",
      "2026-08-26-stream-1000",
      "2026-08-25-mixch-confidence-message",
      "2026-08-25-motivation",
      "2026-08-24-seasidecircle-yes-tokyo",
      "2026-08-24-campus-girls-final-stage-guide",
      "2026-08-24-makeup-stream",
      "2026-08-24-night-thanks-morning-stream",
      "2026-08-23-dragon-cloud",
      "2026-08-23-seaside-circle-musical-special",
      "2026-08-23-morning-showroom-fanroom",
      "2026-08-23-early-showroom-fanroom",
      "2026-08-23-earthquake-showroom-fanroom",
      "2026-08-22-night-showroom-thanks",
      "2026-08-22-night-showroom-fanroom",
      "2026-08-22-evening-showroom-fanroom",
      "2026-08-22-campus-girls-second-stage-jury-award",
      NEWS_ID,
      "2026-08-21-after-afternoon-ganda",
    ]);
    assert.equal(news.length, 42);
  });

  it("drives both Hero and Latest from the same ordered News list", async () => {
    const hero = await readFile(path.join(root, "src/components/Hero.tsx"), "utf8");
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");

    assert.equal(
      sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story"))[0]?.id,
      "2026-08-26-girlsaward-showroom-6th",
    );
    assert.match(hero, /const latest = sortNewsByDateDesc\(news\)\[0\]/);
    assert.match(latest, /const latestNews = sortNewsByDateDesc\(news\)/);
  });
});

describe("2026-08-21 TikTok video — shared Latest / Gallery asset", () => {
  it("shares one manifest object among the standalone Gallery videos", () => {
    const matches = galleryVideos.filter(
      (entry) => entry.id === tiktokRadioVideo.id,
    );

    assert.equal(item().media, tiktokRadioVideo);
    assert.deepEqual(matches, [tiktokRadioVideo]);
    assert.equal(galleryVideos[9], tiktokRadioVideo);
    assert.equal(visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story")[7], tiktokRadioVideo);
    assert.equal(visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").length, 16);
    assert.equal(tiktokRadioVideo.provenance, "owner-provided");
    assert.equal(tiktokRadioVideo.sourceUrl, SOURCE);
    assert.equal(tiktokRadioVideo.sourceDate, "2026-08-21");
    assert.equal(tiktokRadioVideo.published, true);
    assert.equal(tiktokRadioVideo.alt, ALT);
  });

  it("publishes exactly one local MP4 and one local poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b15-01-tiktok-radio-misscircle"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b15-01-tiktok-radio-misscircle-poster.jpg",
      "media/gallery/mily-b15-01-tiktok-radio-misscircle.mp4",
    ]);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(poster)).size > 0);
  });

  it("adds only one standalone Gallery video and leaves Drive Gallery unchanged", () => {
    const drive = driveGallerySections(visibleDriveGallery());

    assert.equal(drive.photos.length, 45);
    assert.equal(drive.videos.length, 11);
    assert.equal(galleryVideos.length, 18);
    assert.equal(visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").length + drive.videos.length, 27);
  });
});

describe("2026-08-21 TikTok video — published derivatives", () => {
  it("matches the manifest and is H.264 Baseline / yuv420p / video-only", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, tiktokRadioVideo.width);
    assert.equal(video.height, tiktokRadioVideo.height);
    assert.equal(video.avg_frame_rate, "30/1");
    assert.equal(video.nb_frames, "337");
    assert.equal(Number(info.format.duration).toFixed(3), "11.234");
    assert.equal(audio, undefined);

    if (existsSync(original)) {
      const source = await probe(original);
      const sourceVideo = source.streams.find((stream) => stream.codec_type === "video");
      const sourceAudio = source.streams.find((stream) => stream.codec_type === "audio");
      const sourceBytes = await readFile(original);

      assert.equal(sourceBytes.length, 1_339_785);
      assert.equal(createHash("sha256").update(sourceBytes).digest("hex"), ORIGINAL_SHA256);
      assert.equal(sourceVideo.width, video.width);
      assert.equal(sourceVideo.height, video.height);
      assert.equal(sourceVideo.avg_frame_rate, video.avg_frame_rate);
      assert.equal(sourceVideo.nb_frames, video.nb_frames);
      assert.equal(sourceAudio.codec_name, "aac");
      assert.equal(sourceAudio.profile, "HE-AACv2");
    }
  });

  it("uses faststart and removes source-specific metadata and chapters", async () => {
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(
      await validateVideoDerivatives(tiktokRadioVideo, galleryDirectory),
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
    const serialized = JSON.stringify(info);
    assert.equal(info.chapters.length, 0);
    assert.doesNotMatch(serialized, /aigc_info|vid_md5|v14044g50000da415s7og65k9aqf3ecg/);
  });

  it("uses the selected 5.5-second real frame as a metadata-free poster", async () => {
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

  it("retains the existing uncropped playback contract", async () => {
    const view = driveVideoView(tiktokRadioVideo);
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
      assert.match(source, /object-contain/);
      assert.doesNotMatch(source, /autoPlay|autoplay|\bloop\b/);
    }
  });
});

describe("2026-08-21 TikTok post — privacy, identity and scope boundaries", () => {
  it("keeps the handoff URL, file id and original out of tracked/public files", async () => {
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

  it("does not add the post to excluded data surfaces", async () => {
    for (const relative of [
      "src/data/stories.ts",
      "src/data/events.ts",
      "src/data/profile.ts",
      "src/data/highlights.ts",
      "src/data/media.ts",
      "src/data/driveGalleryManifest.json",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("mily-b15-01"), false, relative);
    }
  });

  it("keeps Mily identity and unrelated people/sites out of task files", async () => {
    const taskFiles = [
      "src/data/tiktokRadioVideo.json",
      "src/data/tiktokRadioVideo.ts",
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ];
    const forbidden = new RegExp(
      [
        ["Mi", "lly"].join(""),
        "Yukako",
        "Riri",
        "Mako",
        "Chizuru",
        "ouen-archive",
        "yukako-schedule",
        "riri-schedule",
        "mako-schedule",
      ].join("|"),
      "i",
    );

    for (const relative of taskFiles) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.doesNotMatch(source, forbidden, relative);
    }

    await run(process.execPath, ["scripts/check-site-identity.mjs", "main"], { cwd: root });
  });

  it("flows through Portal Feed with the TikTok source and shared poster", () => {
    const feed = createPortalFeed({
      newsItems: [item()],
      storyItems: [],
      now: new Date("2026-08-21T21:00:00+09:00"),
    });
    const entry = feed.items.find((candidate) => candidate.id === `mily:news:${NEWS_ID}`);

    assert.ok(entry);
    assert.equal(entry.publishedAt, "2026-08-21T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.ok(entry.image?.endsWith(tiktokRadioVideo.poster));
  });
});
