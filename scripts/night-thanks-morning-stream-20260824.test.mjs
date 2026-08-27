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
  galleryVideos,
  nightThanksMorningStreamStoryVideo,
  seasideCircleMusicalSpecialThanksVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { events } from "../src/data/events.ts";
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
  "mily-b23-01-night-thanks-morning-stream-story.mp4",
);
const poster = path.join(
  galleryDirectory,
  "mily-b23-01-night-thanks-morning-stream-story-poster.jpg",
);
const original = path.join(
  root,
  "media/original/mily-b23-01-night-thanks-morning-stream-story.mp4",
);

const NEWS_ID = "2026-08-24-night-thanks-morning-stream";
const X_SOURCE = "https://x.com/mily_chan36/status/2091561616307585262";
const ALT =
  "SHOWROOMの夜配信とラジオへの感謝、8月24日朝6時20分から6時50分の配信予定を伝えるInstagram Story動画";
const POSTER_SECONDS = "4.0";
const ORIGINAL_SHA256 =
  "4ddbd6dbf609325f886f0b9968b0f6f498fd961c973d59425aa03a283e38895e";
const PUBLIC_MP4_SHA256 =
  "6084ca92ebb4743065324055dc5706637978566d1f0f9d7b48e0feaffa2578ae";
const PUBLIC_MP4_SIZE = 344986;
const POSTER_SHA256 =
  "516e9a3e3b7541002e56d6c5c9fe2a6e7980df715ad01bb904d641fe4f53aa20";
const DOCS_HOST_PATTERN = /docs\.google\.com/i;
const DRIVE_SHARE_QUERY_PATTERN = /usp=drivesdk/i;
const DRIVE_FILE_PATH_PATTERN = /\/file\/d\//i;
const TRANSFER_PATH_PATTERN = /\/mnt\/data|\/exec-daemon\//i;

const FANROOM_MESSAGE = `今日もありがとうございました😌🙏🏻✨

ラジオのことも知ってくれて、聴いてもらえて、嬉しいねぇ、愛されているねぇ、幸せだねぇ🥺🩵

明日は6:20〜6:50で配信します！
早く寝ないと私起きれないよ〜😭😭😭笑
起きるの頑張ります🤭

おやすみりぃ`;

const FANROOM_SPEAKER_LINE = /^(.+?) · \d{1,2}:\d{2}$/u;
const THIRD_PARTY_LEAKS = [
  "キサラギ",
  "あっきー",
  "ackey",
  "震度",
  "津波",
];

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

describe("2026-08-24 night thanks morning stream — NEWS", () => {
  it("adds one 8/24 NEWS item with confirmed archive wording", () => {
    const matches = news.filter((entry) => entry.id === NEWS_ID);
    const extra = news.filter(
      (entry) =>
        entry.id !== NEWS_ID &&
        entry.id !== "2026-08-24-seasidecircle-yes-tokyo" &&
        entry.id !== "2026-08-24-campus-girls-final-stage-guide" &&
        entry.id !== "2026-08-24-makeup-stream" &&
        (entry.id.includes("night-thanks-morning-stream") ||
          entry.id.includes("2026-08-24")),
    );

    assert.equal(matches.length, 1);
    assert.equal(item()?.id, NEWS_ID);
    assert.equal(item()?.date, "2026-08-24");
    assert.equal(item()?.sameDayOrder, 1);
    assert.deepEqual(item()?.activityIds, ["live-stream", "radio"]);
    assert.equal(item()?.title, "夜枠＆ラジオありがとう！朝は6:20〜☀️");
    assert.equal(extra.length, 0);
    assert.ok(
      news.some((entry) => entry.id === "2026-08-24-campus-girls-final-stage-guide"),
    );
    assert.ok(news.some((entry) => entry.id === "2026-08-24-makeup-stream"));
    assert.equal(news.length, 45);
    assert.deepEqual(verifyNews([item()]), []);
  });

  it("keeps Mily's Fan Room message and does not add other users", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃからの連絡💌 · 00:57");
    assert.equal(entry.message?.text, FANROOM_MESSAGE);
    assert.deepEqual(conversationSpeakers(entry.message?.text), []);
    assert.match(entry.message?.text ?? "", /今日もありがとうございました😌🙏🏻✨/);
    assert.match(entry.message?.text ?? "", /ラジオのことも知ってくれて、聴いてもらえて/);
    assert.match(entry.message?.text ?? "", /明日は6:20〜6:50で配信します！/);
    assert.match(entry.message?.text ?? "", /おやすみりぃ/);
    assert.doesNotMatch(entry.message?.text ?? "", /ファン獲得|親近感/);
    for (const leak of THIRD_PARTY_LEAKS) {
      assert.equal((entry.message?.text ?? "").includes(leak), false, leak);
      assert.equal(entry.body.includes(leak), false, leak);
    }
  });

  it("summarizes Fan Room, Instagram Story, and the confirmed X post", () => {
    const entry = item();

    assert.match(entry.body, /SHOWROOMファンルームとInstagram Story/);
    assert.match(entry.body, /夜枠へのお礼/);
    assert.match(entry.body, /ラジオをたくさんの方に聴いてもらえたことへの感謝/);
    assert.match(entry.body, /みんなと話すことが楽しい/);
    assert.match(entry.body, /誰でも参加しやすいルームにしていきたい/);
    assert.match(entry.body, /8月24日の朝枠は6:20〜6:50/);
    assert.match(entry.body, /最近の1日のスケジュールについて話す予定/);
    assert.match(entry.body, /夜については改めて連絡する/);
    assert.doesNotMatch(entry.body, /ファン獲得|親近感を高める|公式|公認|本人運営/);
    assert.equal(entry.source, X_SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
  });
});

describe("2026-08-24 night thanks morning stream — shared Latest / Gallery asset", () => {
  it("registers exactly one Gallery video and shares the same object with NEWS", () => {
    const visible = visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5");
    const matches = galleryVideos.filter(
      (entry) => entry.id === nightThanksMorningStreamStoryVideo.id,
    );

    assert.equal(item().media, nightThanksMorningStreamStoryVideo);
    assert.deepEqual(matches, [nightThanksMorningStreamStoryVideo]);
    assert.equal(galleryVideos[5], nightThanksMorningStreamStoryVideo);
    assert.equal(visible[3], nightThanksMorningStreamStoryVideo);
    assert.equal(galleryVideos[6], seasideCircleMusicalSpecialThanksVideo);
    assert.equal(galleryVideos.length, 19);
    assert.equal(visible.length, 16);
    assert.equal(nightThanksMorningStreamStoryVideo.kind, "video");
    assert.equal(nightThanksMorningStreamStoryVideo.provenance, "owner-provided");
    assert.equal(nightThanksMorningStreamStoryVideo.sourceLabel, "Instagram Story");
    assert.equal(nightThanksMorningStreamStoryVideo.sourceDate, "2026-08-24");
    assert.equal(nightThanksMorningStreamStoryVideo.published, true);
    assert.equal(nightThanksMorningStreamStoryVideo.width, 720);
    assert.equal(nightThanksMorningStreamStoryVideo.height, 1280);
    assert.equal(nightThanksMorningStreamStoryVideo.alt, ALT);
    assert.equal("sourceUrl" in nightThanksMorningStreamStoryVideo, false);
    assert.equal(item().media.src, nightThanksMorningStreamStoryVideo.src);
    assert.equal(item().media.poster, nightThanksMorningStreamStoryVideo.poster);
    assert.doesNotMatch(nightThanksMorningStreamStoryVideo.alt, /可愛|美人|綺麗/);
  });

  it("publishes exactly one local MP4 and one local poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b23-01-night-thanks-morning-stream-story"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b23-01-night-thanks-morning-stream-story-poster.jpg",
      "media/gallery/mily-b23-01-night-thanks-morning-stream-story.mp4",
    ]);
    assert.match(nightThanksMorningStreamStoryVideo.src, /^\/media\/gallery\//);
    assert.match(nightThanksMorningStreamStoryVideo.poster, /^\/media\/gallery\//);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(poster)).size > 0);
    assert.equal(
      existsSync(path.join(root, "public/media/news/mily-b23-01-night-thanks-morning-stream-story.mp4")),
      false,
    );
  });

  it("keeps Gallery newest-first after inserting b23", () => {
    assert.deepEqual(
      visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5").map((entry) => entry.sourceDate),
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
        "2026-08-26",
        "2026-08-25",
      ],
    );
  });
});

describe("2026-08-24 night thanks morning stream — published derivatives", () => {
  it("is H.264 / yuv420p with source dimensions and no audio", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");
    const mp4Bytes = await readFile(mp4);

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.avg_frame_rate, "1/1");
    assert.equal(video.nb_frames, "20");
    assert.ok(
      Math.abs(Number(info.format.duration) - 20) < 0.05,
      `duration ${info.format.duration}`,
    );
    assert.equal(audio, undefined);
    assert.equal(info.chapters?.length ?? 0, 0);
    assert.equal(mp4Bytes.length, PUBLIC_MP4_SIZE);
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

      assert.equal(sourceBytes.length, 500715);
      assert.equal(
        createHash("sha256").update(sourceBytes).digest("hex"),
        ORIGINAL_SHA256,
      );
      assert.equal(sourceVideo.codec_name, "h264");
      assert.equal(sourceVideo.width, video.width);
      assert.equal(sourceVideo.height, video.height);
      assert.equal(sourceVideo.avg_frame_rate, "1/1");
      assert.equal(sourceVideo.pix_fmt, "yuv420p");
      assert.equal(sourceVideo.nb_frames, "20");
      assert.equal(sourceAudio?.codec_name, "aac");
      assert.equal(sourceAudio?.profile, "HE-AAC");
    }
  });

  it("uses faststart and removes source-specific metadata", async () => {
    assert.equal(await isFaststart(mp4), true);
    assert.deepEqual(
      await validateVideoDerivatives(nightThanksMorningStreamStoryVideo, galleryDirectory),
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
    assert.doesNotMatch(JSON.stringify(info), /Core Media/);
  });

  it("uses the selected 4.0-second real frame as a metadata-free poster", async () => {
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
    // High / tv-range source is remuxed without re-encode, so JPEG poster vs
    // raw gray sits around 6.4. Same-frame identity still holds well below 8.
    assert.ok(total / posterGray.length < 8);
  });

  it("retains the existing controls / inline / preload contract", async () => {
    const view = driveVideoView(nightThanksMorningStreamStoryVideo);
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

describe("2026-08-24 night thanks morning stream — activity and scope", () => {
  it("appears once on live-stream and radio Activities", () => {
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const priorRadioNews = news.filter(
      (entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story",
    );
    const radioNews = selectActivityNews("radio", priorRadioNews, priorRadioNews.length);
    const liveMedia = selectActivityMedia("live-stream");
    const radioMedia = selectActivityMedia("radio");

    assert.equal(liveNews.filter((entry) => entry.id === NEWS_ID).length, 1);
    assert.equal(radioNews.filter((entry) => entry.id === NEWS_ID).length, 1);
    assert.equal(liveNews[0]?.id, "2026-08-26-girlsaward-showroom-6th");
    assert.equal(liveNews[1]?.id, "2026-08-26-morning-stream-thanks");
    assert.equal(liveNews[2]?.id, "2026-08-26-girl-award-event-fanroom");
    assert.equal(liveNews[3]?.id, "2026-08-26-stream-1000");
    assert.equal(liveNews[4]?.id, "2026-08-25-motivation");
    assert.equal(liveNews[5]?.id, "2026-08-24-makeup-stream");
    assert.equal(liveNews[6]?.id, NEWS_ID);
    assert.equal(radioNews[0]?.id, "2026-08-24-seasidecircle-yes-tokyo");
    assert.equal(radioNews[1]?.id, NEWS_ID);
    assert.equal(
      liveMedia[0]?.src,
      "/media/news/mily-b28-01-girlsaward-showroom-6th.jpg",
    );
    assert.equal(
      liveMedia[1]?.src,
      "/media/news/mily-b27-03-morning-stream-thanks-1600.jpg",
    );
    assert.equal(
      liveMedia[2]?.src,
      "/media/news/mily-b24-01-morning-makeup-showroom.jpg",
    );
    assert.equal(liveMedia[3], nightThanksMorningStreamStoryVideo);
    assert.equal(
      liveMedia.some((entry) => String(entry.src).includes("b24-02")),
      false,
    );
    assert.equal(radioMedia[2], nightThanksMorningStreamStoryVideo);
  });

  it("does not add 6:20-6:50 to events or the stream fallback", async () => {
    assert.equal(events.length, 0);
    assert.deepEqual(streamSchedule, []);
    assert.equal(profile.displayName, "みりぃ");
    assert.equal(profile.publicName, "三橋莉子");
    assert.equal(
      stories.some((story) => story.slug.includes("night-thanks")),
      false,
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
      assert.equal(source.includes("mily-b23-01"), false, relative);
      assert.doesNotMatch(source, /6:20〜6:50/, relative);
    }
  });
});

describe("2026-08-24 night thanks morning stream — privacy", () => {
  it("keeps Drive handoff fields out of tracked and public data", async () => {
    const scoped = [
      "src/data/nightThanksMorningStreamStoryVideo.json",
      "src/data/nightThanksMorningStreamStoryVideo.ts",
      "src/data/galleryVideos.ts",
      "src/data/news.ts",
      "docs/MEDIA.md",
      "docs/CONTENT-OPS.md",
    ];
    const files = await repositoryFiles();
    const published = JSON.stringify({
      news: item(),
      video: nightThanksMorningStreamStoryVideo,
    });

    assert.equal(files.includes(path.relative(root, original).replaceAll("\\", "/")), false);
    assert.equal("sourceUrl" in nightThanksMorningStreamStoryVideo, false);
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

  it("does not publish a Fan Room screenshot", async () => {
    const publicNews = existsSync(path.join(root, "public/media/news"))
      ? await readdir(path.join(root, "public/media/news"))
      : [];
    const publicAll = await readdir(path.join(root, "public"), { recursive: true });

    assert.equal(
      publicNews.some((file) => file.includes("night-thanks") && file.includes("fanroom")),
      false,
    );
    assert.equal(
      publicAll.some((file) =>
        String(file).includes("night-thanks") && String(file).includes("fanroom"),
      ),
      false,
    );
    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/driveGalleryManifest.json",
      "src/data/stories.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes(NEWS_ID), false, relative);
    }
  });

  it("documents the shared video and audio removal", async () => {
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");

    assert.match(docs, /batch b23/);
    assert.match(docs, /nightThanksMorningStreamStoryVideo\.json/);
    assert.match(docs, /4\.0秒地点/);
    assert.match(docs, /音声ストリームなし/);
    assert.match(docs, /再配信権を確認できないため/);
    assert.match(docs, /実フレーム/);
    assert.match(docs, /AI生成・顔加工・塗り足しなし/);
    assert.match(ops, /45件/);
    assert.match(ops, /独立動画16本/);
    assert.doesNotMatch(docs, DRIVE_HOST_PATTERN);
    assert.doesNotMatch(docs, DOCS_HOST_PATTERN);
    assert.doesNotMatch(docs, DRIVE_SHARE_QUERY_PATTERN);
    assert.doesNotMatch(docs, DRIVE_FILE_PATH_PATTERN);
  });

  it("keeps Portal Feed aligned with the new Latest lead", () => {
    const feed = createPortalFeed();
    const entry = feed.items.find((candidate) => candidate.id === `mily:news:${NEWS_ID}`);
    const latestIds = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story")).map((candidate) => candidate.id);
    assert.ok(entry);
    assert.equal(entry.publishedAt, "2026-08-24T00:00:00+09:00");
    assert.equal(entry.sourceUrl, X_SOURCE);
    assert.ok(entry.image?.endsWith(nightThanksMorningStreamStoryVideo.poster));
    assert.equal(latestIds[0], "2026-08-26-girlsaward-showroom-6th");
    assert.equal(latestIds[1], "2026-08-26-paton-vote-stories");
    assert.equal(latestIds[2], "2026-08-26-instagram-followers-400");
    assert.equal(latestIds[3], "2026-08-26-morning-stream-thanks");
    assert.equal(latestIds[4], "2026-08-26-girl-award-event-fanroom");
    assert.equal(latestIds[5], "2026-08-26-mixch-15x-day");
    assert.equal(latestIds[6], "2026-08-26-stream-1000");
    assert.equal(latestIds[7], "2026-08-25-mixch-confidence-message");
    assert.equal(latestIds[8], "2026-08-25-motivation");
    assert.equal(latestIds[9], "2026-08-24-seasidecircle-yes-tokyo");
    assert.equal(latestIds[10], "2026-08-24-campus-girls-final-stage-guide");
    assert.equal(latestIds[11], "2026-08-24-makeup-stream");
    assert.equal(latestIds[12], NEWS_ID);
    assert.equal(latestIds[13], "2026-08-23-dragon-cloud");
  });
});
