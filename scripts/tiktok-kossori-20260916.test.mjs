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
import { events } from "../src/data/events.ts";
import {
  campusGirlsPatonFifteenXStoryVideo,
  coldUmbrellaStoryVideo,
  galleryVideos,
  streamThanksMorningSlotStoryVideo,
  tiktokKossoriVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { stories } from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
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
const PUBLIC_VIDEO = "mily-b139-01-tiktok-kossori.mp4";
const PUBLIC_POSTER = "mily-b139-01-tiktok-kossori-poster.jpg";
const mp4 = path.join(galleryDirectory, PUBLIC_VIDEO);
const poster = path.join(galleryDirectory, PUBLIC_POSTER);
const original = path.join(
  root,
  "media/original",
  ["o8fzioNUqBBFpT5IQ", "EgdeDATwzlgXqn2DERqEK.mp4"].join(""),
);

const NEWS_ID = "2026-09-16-tiktok-kossori";
const MEDIA_ID = "mily-b139-01-tiktok-kossori";
const SOURCE = "https://www.tiktok.com/@seasidecircle/video/7686106779897498901";
const TITLE = "「君だけにこっそり教えてあげるっ」TikTok";
const BODY =
  "9月16日、湘南シーサイドサークルのTikTokに、みりぃの動画が投稿されました。猫耳フィルターをつけ、ハートやヒョウ柄のメガネなどのスタンプを変えながら、指を立てたりハートを作ったりしている短い縦型動画です。";
const MESSAGE = "君だけにこっそり教えてあげるっ🩷";
const ALT =
  "室内で猫耳フィルターをつけ、ハートやメガネなどのスタンプを変えながらカメラに向かう、みりぃの短い縦型動画";
const ORIGINAL_SHA256 =
  "6b889b74bf7d157661154dee1e9fa49509dba82ab436c09b5caecf63e3e9134a";
const PUBLIC_MP4_SHA256 =
  "8001670ccb4ff61da451643c523d3d205176d7e5a111bab6394b147f887a01c5";
const POSTER_SHA256 =
  "1ad6619dd195fa64ff69b53d00f5224062fd34a9e29ca6bf3f43399ba01f4931";
const PUBLIC_BYTES = 7_652_239;
const POSTER_BYTES = 73_873;
const POSTER_SECONDS = "0.5";
const SOURCE_METADATA_FILE_PATTERN =
  /(?:https?:\/\/|drive\.(?:google|usercontent\.google)\.com|media[\\/]original[\\/]|\.(?:mp4|mov|m4v|zip)\b)/i;

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

describe("2026-09-16 TikTok kossori post — Latest", () => {
  it("adds exactly one dated News item with the canonical TikTok source", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-09-16");
    assert.equal(entry.sameDayOrder, undefined);
    assert.equal(entry.activityIds, undefined);
    assert.equal(entry.title, TITLE);
    assert.equal(entry.body, BODY);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "湘南シーサイドサークルのTikTok投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.additionalCtas, undefined);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("preserves only the confirmed post text", () => {
    const entry = item();

    assert.equal(entry.message?.label, "湘南シーサイドサークルの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.doesNotMatch(entry.body, /目標|結果|達成|受賞|順位|投稿時刻|再生|コンテスト/);
  });

  it("keeps 9/16 behind later NEWS and after the fourth-round record", () => {
    const ordered = sortNewsByDateDesc(news);
    const ids = ordered.map((entry) => entry.id);

    assert.equal(ordered[0]?.id, "2026-09-21-agestock-yokohama");
    assert.equal(
      ids.indexOf(NEWS_ID),
      ids.indexOf("2026-09-16-miss-circle-fourth-round") + 1,
    );
  });
});

describe("2026-09-16 TikTok video — shared Latest / Gallery asset", () => {
  it("shares one manifest object among the standalone Gallery videos", () => {
    const matches = galleryVideos.filter((entry) => entry.id === MEDIA_ID);
    const entries = selectGalleryEntries().filter(({ key }) => key === MEDIA_ID);

    assert.equal(item().media, tiktokKossoriVideo);
    assert.deepEqual(matches, [tiktokKossoriVideo]);
    assert.equal(galleryVideos[0], coldUmbrellaStoryVideo);
    assert.equal(galleryVideos[1], campusGirlsPatonFifteenXStoryVideo);
    assert.equal(galleryVideos[2], tiktokKossoriVideo);
    assert.equal(galleryVideos[3], streamThanksMorningSlotStoryVideo);
    assert.equal(
      visibleGalleryVideos().find(({ id }) => id === MEDIA_ID),
      tiktokKossoriVideo,
    );
    assert.equal(tiktokKossoriVideo.provenance, "owner-provided");
    assert.equal(tiktokKossoriVideo.sourceUrl, SOURCE);
    assert.equal(tiktokKossoriVideo.sourceDate, "2026-09-16");
    assert.equal(tiktokKossoriVideo.published, true);
    assert.equal(tiktokKossoriVideo.alt, ALT);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].kind, "video");
    assert.equal(entries[0].item.video.controls, true);
    assert.equal(entries[0].item.video.playsInline, true);
    assert.equal(entries[0].item.video.preload, "none");
  });

  it("publishes exactly one local MP4 and one local poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b139-01-tiktok-kossori"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b139-01-tiktok-kossori-poster.jpg",
      "media/gallery/mily-b139-01-tiktok-kossori.mp4",
    ]);
    assert.match(tiktokKossoriVideo.src, /^\/media\/gallery\//);
    assert.match(tiktokKossoriVideo.poster, /^\/media\/gallery\//);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(poster)).size > 0);
  });

  it("does not add the clip to Drive Gallery, media.ts, Stories, or Activities", () => {
    const drive = driveGallerySections(visibleDriveGallery());

    assert.equal(
      drive.videos.some((entry) => String(entry.id ?? "").includes("b139")),
      false,
    );
    assert.equal(
      media.some((entry) => String(entry.id ?? "").includes("b139")),
      false,
    );
    assert.equal(
      stories.some((entry) => JSON.stringify(entry).includes("b139")),
      false,
    );
    assert.equal(events.length, 0);
    assert.equal(
      highlights.some((entry) => JSON.stringify(entry).includes(NEWS_ID)),
      false,
    );
    assert.equal(
      streamSchedule.some((entry) => JSON.stringify(entry).includes(NEWS_ID)),
      false,
    );
    assert.equal(selectActivityNews("radio").some((entry) => entry.id === NEWS_ID), false);
    assert.equal(
      selectActivityNews("miss-circle").some((entry) => entry.id === NEWS_ID),
      false,
    );
    assert.equal(
      selectActivityMedia("radio").some((entry) => entry.id === MEDIA_ID),
      false,
    );
  });
});

describe("2026-09-16 TikTok video — published derivatives", () => {
  it("matches the manifest and is H.264 Baseline / yuv420p / video-only", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audioStreams = info.streams.filter((stream) => stream.codec_type === "audio");
    const bytes = await readFile(mp4);

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, tiktokKossoriVideo.width);
    assert.equal(video.height, tiktokKossoriVideo.height);
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.nb_frames, "451");
    assert.equal(Number(info.format.duration).toFixed(3), "15.034");
    assert.equal(audioStreams.length, 0);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), PUBLIC_MP4_SHA256);
    assert.equal(bytes.length, PUBLIC_BYTES);

    if (existsSync(original)) {
      const source = await probe(original);
      const sourceVideo = source.streams.find((stream) => stream.codec_type === "video");
      const sourceBytes = await readFile(original);

      assert.equal(sourceBytes.length, 3_623_181);
      assert.equal(createHash("sha256").update(sourceBytes).digest("hex"), ORIGINAL_SHA256);
      assert.equal(sourceVideo.width, video.width);
      assert.equal(sourceVideo.height, video.height);
      assert.equal(sourceVideo.nb_frames, video.nb_frames);
      assert.equal(sourceVideo.profile, "High");
    }
  });

  it("uses faststart and removes source-specific metadata and chapters", async () => {
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(
      await validateVideoDerivatives(tiktokKossoriVideo, galleryDirectory),
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
    assert.doesNotMatch(serialized, /aigc_info|vid_md5/);
    const metadata = [
      info.format.tags ?? {},
      ...info.streams.map((stream) => stream.tags ?? {}),
    ];
    assert.deepEqual(Object.keys(metadata[0]).sort(), [
      "compatible_brands",
      "encoder",
      "major_brand",
      "minor_version",
    ]);
    const streamMetadataKeys = Object.keys(metadata[1]).sort();
    const allowedStreamMetadataKeys = new Set([
      "encoder",
      "handler_name",
      "language",
      "vendor_id",
    ]);
    assert.deepEqual(
      streamMetadataKeys.filter((key) => !allowedStreamMetadataKeys.has(key)),
      [],
    );
    for (const key of ["encoder", "handler_name", "language"]) {
      assert.equal(streamMetadataKeys.includes(key), true, key);
    }
    assert.doesNotMatch(JSON.stringify(metadata), SOURCE_METADATA_FILE_PATTERN);
  });

  it("uses the selected 0.5-second real frame as a metadata-free poster", async () => {
    const meta = await sharp(poster).metadata();
    const posterBytes = await readFile(poster);
    assert.equal(meta.width, 720);
    assert.equal(meta.height, 1280);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.iptc, undefined);
    assert.equal(meta.xmp, undefined);
    assert.equal(createHash("sha256").update(posterBytes).digest("hex"), POSTER_SHA256);
    assert.equal(posterBytes.length, POSTER_BYTES);

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
    const view = driveVideoView(tiktokKossoriVideo);
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

describe("2026-09-16 TikTok post — privacy, identity and scope boundaries", () => {
  it("keeps private handoff fields, Drive ids and raw originals out of tracked/public files", async () => {
    const files = await repositoryFiles();
    const taskFiles = [
      "src/data/tiktokKossoriVideo.json",
      "src/data/tiktokKossoriVideo.ts",
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ];

    assert.equal(files.includes(path.relative(root, original).replaceAll("\\", "/")), false);
    assert.equal(
      files.some(
        (relative) =>
          relative.startsWith("media/original/") &&
          relative.includes("mily-b139-01"),
      ),
      false,
    );

    for (const relative of taskFiles) {
      const bytes = await readFile(path.join(root, relative));
      if (isProbablyBinary(bytes)) continue;
      const source = bytes.toString("utf8");
      assert.equal(DRIVE_HOST_PATTERN.test(source), false, relative);
      assert.deepEqual(findDriveIds(source), [], relative);
      assert.doesNotMatch(source, PRIVATE_HANDOFF_KEY_PATTERN);
    }
  });
});

const PRIVATE_HANDOFF_KEY_PATTERN =
  /^(?:handoff(?:Url|Id)?|driveFileId|original(?:File)?Name|sourceFileName)$/i;
