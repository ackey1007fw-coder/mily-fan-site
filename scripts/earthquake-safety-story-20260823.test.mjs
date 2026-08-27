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
import { driveVideoView } from "../src/data/driveGallery.ts";
import {
  earthquakeSafetyStoryVideo,
  eventStory20260821,
  galleryVideos,
  morningShowroomRunwayVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { events } from "../src/data/events.ts";
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
const mp4 = path.join(galleryDirectory, "mily-b18-01-earthquake-safety-story.mp4");
const poster = path.join(
  galleryDirectory,
  "mily-b18-01-earthquake-safety-story-poster.jpg",
);
const original = path.join(
  root,
  "media/original/mily-b18-01-earthquake-safety-story.mp4",
);

const NEWS_ID = "2026-08-23-earthquake-showroom-fanroom";
const ALT =
  "地震後、関東圏の人たちの無事を気遣い、落ち着いて身の安全を確保するよう呼びかける縦型動画";
const POSTER_SECONDS = "8.0";
const ORIGINAL_SHA256 =
  "29a6202b7c646e230797ddcb75d75eec865ccd3fa9e838c1d08043884a03de18";
const PUBLIC_MP4_SHA256 =
  "c80e2d99cce5e5c9e5cfd0ec8e565938fbb5bec81d78900010c69ef4ead0d130";
const POSTER_SHA256 =
  "8051dc985cf9e19a5f61476530dd8d3d210ba06368212d31c08bbdd00571edfa";
const DOCS_HOST_PATTERN = /docs\.google\.com/i;
const DRIVE_SHARE_QUERY_PATTERN = /usp=drivesdk/i;
const DRIVE_FILE_PATH_PATTERN = /\/file\/d\//i;

const EARTHQUAKE_MESSAGE = [
  "みりぃ · 02:02",
  "地震だね、落ち着いて！！まずは身の安全を確保✊🏻😌",
  "",
  "みりぃ · 02:18",
  "皆さん無事かな？？",
  "",
  "みりぃ · 02:19",
  "みりぃは無事です、ありがとう🙌🏻🙌🏻",
].join("\n");

const FANROOM_SPEAKER_LINE = /^(.+?) · \d{1,2}:\d{2}$/u;

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

function conversationSpeakers(text) {
  return (text ?? "")
    .split("\n")
    .map((line) => line.trim().match(FANROOM_SPEAKER_LINE)?.[1])
    .filter(Boolean);
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

describe("2026-08-23 earthquake safety Story — existing NEWS only", () => {
  it("keeps the single earthquake NEWS id and does not add another", () => {
    const matches = news.filter((entry) => entry.id === NEWS_ID);
    const extraEarthquakeNews = news.filter(
      (entry) =>
        entry.id !== NEWS_ID &&
        (entry.id.includes("earthquake") ||
          entry.title.includes("地震") ||
          entry.body.includes("地震")),
    );

    assert.equal(matches.length, 1);
    assert.equal(item()?.id, NEWS_ID);
    assert.equal(item()?.date, "2026-08-23");
    assert.equal(item()?.sameDayOrder, 1);
    assert.equal(item()?.activityIds, undefined);
    assert.equal(item()?.title, "地震直後、みんなの安全を気遣うみりぃ💌");
    assert.equal(extraEarthquakeNews.length, 0);
    assert.equal(news.length, 45);
    assert.deepEqual(verifyNews([item()]), []);
  });

  it("keeps the Fan Room archive to Mily's three confirmed remarks", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃからの連絡💌 · 02:02〜02:19");
    assert.equal(entry.message?.text, EARTHQUAKE_MESSAGE);
    assert.deepEqual(conversationSpeakers(entry.message?.text), [
      "みりぃ",
      "みりぃ",
      "みりぃ",
    ]);
    assert.match(entry.message?.text ?? "", /地震だね、落ち着いて！！まずは身の安全を確保✊🏻😌/);
    assert.match(entry.message?.text ?? "", /皆さん無事かな？？/);
    assert.match(entry.message?.text ?? "", /みりぃは無事です、ありがとう🙌🏻🙌🏻/);
    assert.doesNotMatch(entry.message?.text ?? "", /関東圏|まずは落ち着いて、|自分の身の安全の確保/);
  });

  it("summarizes Fan Room and Instagram Story in parallel without extra quake facts", () => {
    const entry = item();

    assert.match(entry.body, /SHOWROOMファンルーム/);
    assert.match(entry.body, /まずは身の安全を確保/);
    assert.match(entry.body, /皆さん無事かな？？/);
    assert.match(entry.body, /Instagram Storyでも関東圏の皆さんの無事を気遣い/);
    assert.match(entry.body, /まずは落ち着いて/);
    assert.match(entry.body, /自分の身の安全の確保‼/);
    assert.doesNotMatch(entry.body, /その後、Instagram Story|その後もInstagram Story/);
    assert.doesNotMatch(entry.body, /震度|震源|マグニチュード|津波|余震/);
    assert.doesNotMatch(entry.body, /公式|公認|本人運営/);
    assert.equal(entry.source, undefined);
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.sourceLabel, "SHOWROOMファンルーム / Instagram Story");
  });
});

describe("2026-08-23 earthquake safety Story — shared Latest / Gallery asset", () => {
  it("registers exactly one Gallery video and shares the same object with NEWS", () => {
    const visible = visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5");
    const matches = galleryVideos.filter(
      (entry) => entry.id === earthquakeSafetyStoryVideo.id,
    );

    assert.equal(item().media, earthquakeSafetyStoryVideo);
    assert.deepEqual(matches, [earthquakeSafetyStoryVideo]);
    assert.equal(galleryVideos[8], earthquakeSafetyStoryVideo);
    assert.equal(visible[6], earthquakeSafetyStoryVideo);
    assert.equal(visible.length, 16);
    assert.equal(earthquakeSafetyStoryVideo.kind, "video");
    assert.equal(earthquakeSafetyStoryVideo.provenance, "owner-provided");
    assert.equal(earthquakeSafetyStoryVideo.sourceLabel, "Instagram Story");
    assert.equal(earthquakeSafetyStoryVideo.sourceDate, "2026-08-23");
    assert.equal(earthquakeSafetyStoryVideo.published, true);
    assert.equal(earthquakeSafetyStoryVideo.width, 720);
    assert.equal(earthquakeSafetyStoryVideo.height, 1280);
    assert.equal(earthquakeSafetyStoryVideo.alt, ALT);
    assert.equal("sourceUrl" in earthquakeSafetyStoryVideo, false);
    assert.equal(item().media.src, earthquakeSafetyStoryVideo.src);
    assert.equal(item().media.poster, earthquakeSafetyStoryVideo.poster);
  });

  it("publishes exactly one local MP4 and one local poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b18-01-earthquake-safety-story"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b18-01-earthquake-safety-story-poster.jpg",
      "media/gallery/mily-b18-01-earthquake-safety-story.mp4",
    ]);
    assert.match(earthquakeSafetyStoryVideo.src, /^\/media\/gallery\//);
    assert.match(earthquakeSafetyStoryVideo.poster, /^\/media\/gallery\//);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(poster)).size > 0);
    assert.equal(existsSync(path.join(root, "public/media/news/mily-b18-01-earthquake-safety-story.mp4")), false);
  });
});

describe("2026-08-23 earthquake safety Story — published derivatives", () => {
  it("is H.264 Baseline / yuv420p with source dimensions and no audio", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");
    const mp4Bytes = await readFile(mp4);

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.avg_frame_rate, "30/1");
    assert.equal(video.nb_frames, "819");
    assert.equal(Number(info.format.duration).toFixed(3), "27.300");
    assert.equal(audio, undefined);
    assert.equal(info.chapters?.length ?? 0, 0);
    assert.equal(createHash("sha256").update(mp4Bytes).digest("hex"), PUBLIC_MP4_SHA256);

    if (existsSync(original)) {
      const source = await probe(original);
      const sourceVideo = source.streams.find(
        (stream) => stream.codec_type === "video",
      );
      const sourceAudio = source.streams.find(
        (stream) => stream.codec_type === "audio",
      );
      const sourceBytes = await readFile(original);

      assert.equal(sourceBytes.length, 19976089);
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
      assert.equal(sourceVideo.nb_frames, "819");
      assert.equal(Number(sourceVideo.duration).toFixed(6), "27.300000");
      assert.equal(sourceAudio, undefined);
    }
  });

  it("uses faststart and removes source-specific metadata", async () => {
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(
      await validateVideoDerivatives(earthquakeSafetyStoryVideo, galleryDirectory),
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
    }
  });

  it("uses the selected 8.0-second real frame as a metadata-free poster", async () => {
    const posterBytes = await readFile(poster);
    const meta = await sharp(poster).metadata();
    assert.equal(meta.width, 720);
    assert.equal(meta.height, 1280);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.iptc, undefined);
    assert.equal(meta.xmp, undefined);
    assert.equal(meta.icc, undefined);
    assert.equal(createHash("sha256").update(posterBytes).digest("hex"), POSTER_SHA256);

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

  it("retains the existing controls / inline / preload contract", async () => {
    const view = driveVideoView(earthquakeSafetyStoryVideo);
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

describe("2026-08-23 earthquake safety Story — live-stream activity media", () => {
  it("keeps the Story video on NEWS and Gallery but out of /activities/live/", () => {
    const liveMedia = selectActivityMedia("live-stream");
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const liveSrcs = liveMedia.map((entry) => entry.src);

    assert.equal(news.filter((entry) => entry.id === NEWS_ID).length, 1);
    assert.equal(item().media, earthquakeSafetyStoryVideo);
    assert.equal(galleryVideos[8], earthquakeSafetyStoryVideo);
    assert.equal(item().activityIds, undefined);
    assert.equal(
      liveNews.some((entry) => entry.id === NEWS_ID),
      false,
    );
    assert.equal(
      liveMedia.some((entry) => entry.id === earthquakeSafetyStoryVideo.id),
      false,
    );
    assert.equal(liveSrcs.includes(earthquakeSafetyStoryVideo.src), false);
    assert.equal(
      liveSrcs.includes("/media/gallery/mily-b18-01-earthquake-safety-story.mp4"),
      false,
    );
    assert.ok(liveMedia.includes(eventStory20260821));
    assert.ok(liveMedia.includes(morningShowroomRunwayVideo));
    assert.ok(
      liveNews.some((entry) => entry.id === "2026-08-23-morning-showroom-fanroom"),
    );
    assert.ok(
      liveNews.some((entry) => entry.id === "2026-08-22-night-showroom-thanks"),
    );
  });
});

describe("2026-08-23 earthquake safety Story — privacy and scope boundaries", () => {
  it("keeps Drive handoff fields out of the published b18 / earthquake records", async () => {
    const scoped = [
      "src/data/earthquakeSafetyStoryVideo.json",
      "src/data/earthquakeSafetyStoryVideo.ts",
      "src/data/galleryVideos.ts",
      "src/data/news.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ];
    const files = await repositoryFiles();
    const published = JSON.stringify({
      news: item(),
      video: earthquakeSafetyStoryVideo,
    });

    assert.equal(files.includes(path.relative(root, original).replaceAll("\\", "/")), false);
    assert.equal("sourceUrl" in earthquakeSafetyStoryVideo, false);
    assert.equal(item().source, undefined);
    assert.equal(item().url, undefined);
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
    }
  });

  it("does not copy the Story into articles, events or the stream fallback", async () => {
    assert.equal(
      stories.some((story) => story.slug.includes("earthquake")),
      false,
    );
    assert.equal(events.length, 0);
    assert.equal(streamSchedule.length, 0);
    for (const relative of [
      "src/data/stories.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
      "src/data/highlights.ts",
      "src/data/contest.ts",
      "src/data/media.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("mily-b18-01"), false, relative);
    }
  });

  it("documents the shared video and keeps the Fan Room screenshot unpublished", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");

    assert.match(docs, /batch b18/);
    assert.match(docs, /earthquakeSafetyStoryVideo\.json/);
    assert.match(docs, /8\.0秒地点/);
    assert.match(docs, /音声ストリームなし/);
    assert.match(docs, /2026-08-23 未明のSHOWROOMファンルーム \/ 公開cropなし/);
    assert.match(docs, /公開cropは作っていない/);
    assert.doesNotMatch(docs, DRIVE_HOST_PATTERN);
    assert.doesNotMatch(docs, DOCS_HOST_PATTERN);
    assert.doesNotMatch(docs, DRIVE_SHARE_QUERY_PATTERN);
    assert.doesNotMatch(docs, DRIVE_FILE_PATH_PATTERN);
  });

  it("keeps Portal Feed as the same earthquake NEWS item with the shared poster", () => {
    const feed = createPortalFeed({
      newsItems: news.filter((candidate) => candidate.id === NEWS_ID),
      storyItems: [],
      eventItems: [],
    });
    const matches = feed.items.filter((candidate) =>
      candidate.id.includes("earthquake"),
    );
    const entry = feed.items.find((candidate) => candidate.id === `mily:news:${NEWS_ID}`);
    const latestIds = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story"))
      .filter((candidate) => candidate.date === "2026-08-23")
      .map((candidate) => candidate.id);

    assert.equal(matches.length, 1);
    assert.ok(entry);
    assert.equal(entry.publishedAt, "2026-08-23T00:00:00+09:00");
    assert.equal(entry.sourceUrl, undefined);
    assert.ok(entry.image?.endsWith(earthquakeSafetyStoryVideo.poster));
    assert.deepEqual(latestIds, [
      "2026-08-23-dragon-cloud",
      "2026-08-23-seaside-circle-musical-special",
      "2026-08-23-morning-showroom-fanroom",
      "2026-08-23-early-showroom-fanroom",
      NEWS_ID,
    ]);
  });
});
