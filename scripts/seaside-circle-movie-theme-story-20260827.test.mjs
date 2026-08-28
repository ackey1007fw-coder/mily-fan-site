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
  seasideCircleMovieThemeStoryVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import {
  isFaststart,
  validateVideoDerivatives,
} from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import { findFeedItem, portalNewsId } from "./portal-feed-order.mjs";
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
  "mily-b36-01-seaside-circle-movie-theme-story.mp4",
);
const poster = path.join(
  galleryDirectory,
  "mily-b36-01-seaside-circle-movie-theme-story-poster.jpg",
);
const original = path.join(
  root,
  "media/original/mily-b36-01-seaside-circle-movie-theme-story.mp4",
);

const NEWS_ID = "2026-08-27-seaside-circle-movie-theme-story";
const INSTAGRAM_PROFILE = "https://www.instagram.com/mily_chan36";
const POSTER_SECONDS = "8.0";
const ORIGINAL_BYTES = 11_478_979;
const ORIGINAL_SHA256 =
  "f091af15ffa5b905c37c917ed9285f3fce33c7ec340dae60cfa7316221c54d40";
const PUBLIC_BYTES = 1_197_138;
const PUBLIC_SHA256 =
  "8972bcfa3dac0d08757a15275b1542ffdc706f9b8d96fa90d02f30d3dcd4da45";
const POSTER_BYTES = 88_947;
const POSTER_SHA256 =
  "1c7da24c2c36562dcf0312d54acfc4df859e4b089a1d4470fc736c084523a6da";

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
    "-count_frames",
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

describe("2026-08-27 湘南シーサイドサークル映画テーマ Story — Latest / NEWS", () => {
  it("adds only the confirmed Story date and visible radio announcement", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-28-stream-thanks").filter((entry) => entry.id !== "2026-08-28-paton-vote-day-3").filter((entry) => entry.id !== "2026-08-27-movie-night"))[3]?.id, NEWS_ID);
    assert.equal(entry.date, "2026-08-27");
    assert.equal(entry.sameDayOrder, undefined);
    assert.deepEqual(entry.activityIds, ["radio"]);
    assert.equal(entry.title, "8/30のラジオは「映画」がトークテーマ🎬");
    assert.equal(
      entry.body,
      "8月27日、みりぃがInstagram Storyで、湘南シーサイドサークルの8月30日（日）10:00〜13:00生放送の案内をシェアしました。トークテーマは「映画」で、メッセージを募集しています。",
    );
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.equal(entry.url, INSTAGRAM_PROFILE);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.equal(entry.message?.label, "みりぃがシェアした番組案内");
    assert.equal(
      entry.message?.text,
      "湘南シーサイドサークル\n8月30日（日）10:00〜13:00生放送！\nトークテーマは【映画】\nメッセージ募集中💌",
    );
    assert.deepEqual(verifyNews([entry]), []);
    assert.doesNotMatch(JSON.stringify(entry), /公式|公認|かわいい|美しい/);
  });

  it("shares one manifest object with Gallery and keeps Story attribution non-link", () => {
    const entry = item();
    const matches = galleryVideos.filter(
      (candidate) => candidate.id === seasideCircleMovieThemeStoryVideo.id,
    );

    assert.equal(entry.media, seasideCircleMovieThemeStoryVideo);
    assert.deepEqual(matches, [seasideCircleMovieThemeStoryVideo]);
    assert.equal(visibleGalleryVideos()[0], seasideCircleMovieThemeStoryVideo);
    assert.equal(seasideCircleMovieThemeStoryVideo.sourceDate, "2026-08-27");
    assert.equal(seasideCircleMovieThemeStoryVideo.sourceLabel, "Instagram Story");
    assert.equal("sourceUrl" in seasideCircleMovieThemeStoryVideo, false);
    assert.equal(seasideCircleMovieThemeStoryVideo.published, true);
  });

  it("flows through the scoped Portal Feed with the local poster", () => {
    const feed = createPortalFeed({
      now: new Date("2026-08-27T14:30:00+09:00"),
      newsItems: news.filter((entry) => entry.id === NEWS_ID),
      storyItems: [],
      eventItems: [],
    });
    const entry = findFeedItem(feed, portalNewsId(NEWS_ID));

    assert.equal(entry.publishedAt, "2026-08-27T00:00:00+09:00");
    assert.equal(entry.sourceUrl, INSTAGRAM_PROFILE);
    assert.ok(entry.image?.endsWith(seasideCircleMovieThemeStoryVideo.poster));
  });
});

describe("2026-08-27 湘南シーサイドサークル映画テーマ Story — published media", () => {
  it("publishes exactly one shared MP4 and one poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b36-01-seaside-circle-movie-theme-story"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b36-01-seaside-circle-movie-theme-story-poster.jpg",
      "media/gallery/mily-b36-01-seaside-circle-movie-theme-story.mp4",
    ]);
    assert.equal((await stat(mp4)).size, PUBLIC_BYTES);
    assert.equal(await sha256(mp4), PUBLIC_SHA256);
    assert.equal((await stat(poster)).size, POSTER_BYTES);
    assert.equal(await sha256(poster), POSTER_SHA256);
  });

  it("keeps source geometry and frames while removing unconfirmed audio", async () => {
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
    assert.equal(video.nb_read_frames, "600");
    assert.equal(info.format.duration, "20.000000");
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
      assert.equal(sourceVideo.nb_read_frames, video.nb_read_frames);
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
        seasideCircleMovieThemeStoryVideo,
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
});

describe("2026-08-27 湘南シーサイドサークル映画テーマ Story — activity and scope", () => {
  it("appears once on the radio Activity only", () => {
    const radioNews = selectActivityNews("radio", news, news.length);
    const radioMedia = selectActivityMedia("radio");

    assert.equal(radioNews.filter((entry) => entry.id === NEWS_ID).length, 1);
    assert.equal(radioNews[0]?.id, NEWS_ID);
    assert.equal(
      radioMedia.filter((media) => media === seasideCircleMovieThemeStoryVideo)
        .length,
      1,
    );
    for (const activityId of ["miss-circle", "live-stream", "campus-girls"]) {
      assert.equal(
        selectActivityNews(activityId, news, news.length).some(
          (entry) => entry.id === NEWS_ID,
        ),
        false,
      );
      assert.equal(
        selectActivityMedia(activityId).some(
          (media) => media === seasideCircleMovieThemeStoryVideo,
        ),
        false,
      );
    }
  });

  it("does not create a Story article, event, schedule, highlight, or photo", async () => {
    for (const relative of [
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
      "src/data/media.ts",
      "shared/radio-program.js",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
      assert.equal(
        source.includes(seasideCircleMovieThemeStoryVideo.id),
        false,
        relative,
      );
    }
  });

  it("keeps controlled inline playback without autoplay", async () => {
    const view = driveVideoView(seasideCircleMovieThemeStoryVideo);
    const latest = await readFile(
      path.join(root, "src/components/Latest.tsx"),
      "utf8",
    );
    const gallery = await readFile(
      path.join(root, "src/components/Gallery.tsx"),
      "utf8",
    );

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

describe("2026-08-27 湘南シーサイドサークル映画テーマ Story — privacy and docs", () => {
  it("keeps the original and Drive transfer details out of tracked files", async () => {
    const files = await repositoryFiles();
    const published = JSON.stringify({
      news: item(),
      video: seasideCircleMovieThemeStoryVideo,
    });

    assert.equal(
      files.includes(path.relative(root, original).replaceAll("\\", "/")),
      false,
    );
    assert.equal("sourceUrl" in seasideCircleMovieThemeStoryVideo, false);
    assert.doesNotMatch(published, DRIVE_HOST_PATTERN);
    assert.deepEqual(findDriveIds(published), []);

    for (const relative of [
      "src/data/seasideCircleMovieThemeStoryVideo.json",
      "src/data/seasideCircleMovieThemeStoryVideo.ts",
      "src/data/galleryVideos.ts",
      "src/data/news.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ]) {
      const bytes = await readFile(path.join(root, relative));
      if (isProbablyBinary(bytes)) continue;
      const source = bytes.toString("utf8");
      assert.doesNotMatch(source, DRIVE_HOST_PATTERN, relative);
      assert.deepEqual(findDriveIds(source), [], relative);
    }
  });

  it("documents the shared video, privacy check and audio removal", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");

    assert.match(docs, /batch b36/);
    assert.match(docs, /8月30日（日）10:00〜13:00/);
    assert.match(docs, /再配信権を確認できないため/);
    assert.match(docs, /DM・通知・端末情報・第三者コメント/);
    assert.match(docs, /8\.0秒地点の実フレーム/);
    assert.match(ops, /48件/);
    assert.match(ops, /独立動画16本/);
    assert.match(ops, /ラジオ「映画」テーマ/);
  });
});
