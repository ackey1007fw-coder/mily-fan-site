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
  eventStory20260821,
  galleryVideos,
  morningOhayo20260821,
  morningShowroomRunwayVideo,
  tiktokRadioVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { isFaststart, validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import { isProbablyBinary } from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(galleryDirectory, "mily-b11-01-morning-showroom-runway.mp4");
const poster = path.join(
  galleryDirectory,
  "mily-b11-01-morning-showroom-runway-poster.jpg",
);
const original = path.join(
  root,
  "media/original/0a502bbfb722d82ea97313483c8a377dd97c9e38.mp4",
);

const NEWS_ID = "2026-08-21-morning-showroom-runway";
const SOURCE = "https://x.com/Mily_chan36/status/2090557839492460779";
const MESSAGE =
  "おはよ〜🔅\n今日も一緒に頑張ろうねん\n\n7:00〜SHOWROOMにて配信しますよっ！\n26日までガチイベ中で、ランウェイかけて配信しております🛜❤️‍🔥\n待ってる〜！\n\n応援よろしくお願いいたします🥺\n\n⬇️昨日の動画🎥\n#ミスサー #ミスサークルコンテスト2026 #ミスサークル #ミスサークルコンテスト";
const ALT =
  "金色のハート型フィルターを使い、室内でカメラに向かって表情を変える短い自撮り動画";
const POSTER_SECONDS = "2.0";
const ORIGINAL_SHA256 =
  "cf893d157551cfbee6db08665c7ad1ec17f9e08f5810c0a6bf730cdddeca68d3";
const HANDOFF_HOST = ["drive", "google", "com"].join(".");
const HANDOFF_ID = ["1VW8Ru7QCkJ30hl8", "KVsBJDg5VU-5pJ082"].join("");

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

describe("2026-08-21 morning SHOWROOM X post — Latest", () => {
  it("adds exactly one dated News item with the confirmed X source", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-21");
    assert.equal(entry.title, "朝7:00からSHOWROOM配信📡❤️‍🔥");
    assert.equal(
      entry.body,
      "8月21日の朝、みりぃが7:00からのSHOWROOM配信を案内しました。投稿では、26日までランウェイをかけたイベントに参加していることを伝え、応援を呼びかけています。",
    );
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("preserves the owner-supplied post text verbatim, including line breaks", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.doesNotMatch(entry.body, /現在開催中|現在配信中|順位|ポイント|審査結果/);
  });

  it("keeps newest-first ordering without disturbing the existing 8/20 order", () => {
    const ordered = sortNewsByDateDesc(news).map((entry) => entry.id);

    assert.equal(ordered[0], "2026-08-24-night-thanks-morning-stream");
    assert.equal(ordered[1], "2026-08-23-dragon-cloud");
    assert.equal(ordered[2], "2026-08-23-seaside-circle-musical-special");
    assert.equal(ordered[3], "2026-08-23-morning-showroom-fanroom");
    assert.equal(ordered[4], "2026-08-23-early-showroom-fanroom");
    assert.equal(ordered[5], "2026-08-23-earthquake-showroom-fanroom");
    assert.equal(ordered[6], "2026-08-22-night-showroom-thanks");
    assert.equal(ordered[7], "2026-08-22-night-showroom-fanroom");
    assert.equal(ordered[8], "2026-08-22-evening-showroom-fanroom");
    assert.equal(ordered[9], "2026-08-22-campus-girls-second-stage-jury-award");
    assert.equal(ordered[10], "2026-08-21-tiktok-radio-misscircle");
    assert.equal(ordered[11], "2026-08-21-after-afternoon-ganda");
    assert.equal(ordered[12], "2026-08-21-afternoon-showroom-fanroom");
    assert.equal(ordered[13], "2026-08-21-event-story-next-slot");
    assert.equal(ordered[14], "2026-08-21-morning-ohayo-story");
    assert.equal(ordered[15], NEWS_ID);
    assert.deepEqual(ordered.slice(16, 19), [
      "2026-08-20-mango-kakigori",
      "2026-08-20-morning-message",
      "2026-08-20-morning-story",
    ]);
    assert.equal(news.length, 25);
  });
});

describe("2026-08-21 morning SHOWROOM video — shared Latest / Gallery asset", () => {
  it("shares one manifest object and stays behind the newer b12 video", () => {
    const galleryItem = galleryVideos.find(
      (entry) => entry.id === morningShowroomRunwayVideo.id,
    );

    assert.equal(item().media, morningShowroomRunwayVideo);
    assert.equal(galleryItem, morningShowroomRunwayVideo);
    assert.equal(visibleGalleryVideos()[4], tiktokRadioVideo);
    assert.equal(visibleGalleryVideos()[5], eventStory20260821);
    assert.equal(visibleGalleryVideos()[6], morningOhayo20260821);
    assert.equal(visibleGalleryVideos()[7], morningShowroomRunwayVideo);
    assert.equal(visibleGalleryVideos().length, 11);
    assert.equal(morningShowroomRunwayVideo.sourceUrl, SOURCE);
    assert.equal(morningShowroomRunwayVideo.sourceDate, "2026-08-21");
    assert.equal(morningShowroomRunwayVideo.alt, ALT);
  });

  it("publishes exactly one local MP4 and one local poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b11-01-morning-showroom-runway"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b11-01-morning-showroom-runway-poster.jpg",
      "media/gallery/mily-b11-01-morning-showroom-runway.mp4",
    ]);
    assert.match(morningShowroomRunwayVideo.src, /^\/media\//);
    assert.match(morningShowroomRunwayVideo.poster, /^\/media\//);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(poster)).size > 0);
  });

  it("keeps the existing Drive Gallery and adds only one standalone video", () => {
    const drive = driveGallerySections(visibleDriveGallery());

    assert.equal(drive.photos.length, 45);
    assert.equal(drive.videos.length, 11);
    assert.equal(galleryVideos.length, 11);
    assert.equal(visibleGalleryVideos().length + drive.videos.length, 22);
  });
});

describe("2026-08-21 morning SHOWROOM video — published derivatives", () => {
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
    assert.equal(Number(info.format.duration).toFixed(3), "4.267");
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

      assert.equal(sourceBytes.length, 515287);
      assert.equal(createHash("sha256").update(sourceBytes).digest("hex"), ORIGINAL_SHA256);
      assert.equal(sourceVideo.width, video.width);
      assert.equal(sourceVideo.height, video.height);
      assert.equal(sourceVideo.avg_frame_rate, "30/1");
      assert.equal(Number(source.format.duration).toFixed(6), "4.266667");
      assert.equal(sourceAudio, undefined);
    }
  });

  it("uses faststart and removes source-specific metadata", async () => {
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(
      await validateVideoDerivatives(morningShowroomRunwayVideo, galleryDirectory),
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
      assert.notEqual(stream.tags?.handler_name, "Twitter-vork muxer");
    }
  });

  it("uses the selected 2.0-second real frame as a metadata-free poster", async () => {
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

  it("retains the existing controls / inline / preload contract", async () => {
    const view = driveVideoView(morningShowroomRunwayVideo);
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

describe("2026-08-21 morning SHOWROOM post — privacy and scope boundaries", () => {
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

  it("does not add this normal post to STORIES, highlights, contest or events", async () => {
    for (const relative of [
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/contest.ts",
      "src/data/events.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(source.includes("mily-b11-01"), false, relative);
    }
    assert.equal(existsSync(path.join(root, "stories", NEWS_ID)), false);
  });

  it("flows through Portal Feed with the X source and shared poster", () => {
    const feed = createPortalFeed({ now: new Date("2026-08-21T09:00:00+09:00") });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(entry.publishedAt, "2026-08-21T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.ok(entry.image?.endsWith(morningShowroomRunwayVideo.poster));
  });
});
