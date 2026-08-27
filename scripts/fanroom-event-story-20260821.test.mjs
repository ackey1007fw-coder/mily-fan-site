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
import { media } from "../src/data/media.ts";
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
const newsDirectory = path.join(root, "public/media/news");
const fanroomImage = path.join(newsDirectory, "mily-b13-01-fanroom-next-slot.jpg");
const fanroomOriginal = path.join(
  root,
  "media/original/8C35FA05-8AB0-427B-8238-F097183EA5F2.jpeg",
);
const storyMp4 = path.join(galleryDirectory, "mily-b13-02-event-story.mp4");
const storyPoster = path.join(
  galleryDirectory,
  "mily-b13-02-event-story-poster.jpg",
);
const storyOriginal = path.join(
  root,
  "media/original/51A32589-0C2D-443A-BAD1-A3076FA3C98C.mp4",
);

const FANROOM_NEWS_ID = "2026-08-21-afternoon-showroom-fanroom";
const STORY_NEWS_ID = "2026-08-21-event-story-next-slot";
const INSTAGRAM_PROFILE = "https://www.instagram.com/mily_chan36";
const FANROOM_MESSAGE =
  "みなさーん！朝枠ありがとう😭❣️\n【次枠】\n14:00〜\n跨ぎ配信するぜーっ！\n皆様、一緒に楽しもう？！✨";
const STORY_MESSAGE =
  "寝起き配信ありがとうございました〜❣️\nまさかの現在5位🥹💙\n【次枠】\n14:00〜";
const STORY_ALT =
  "次枠14:00のボードを持つ画面と、配信へのお礼・投稿時点の順位・イベント参加理由を表示したInstagram Story動画";
const FANROOM_ORIGINAL_SHA256 =
  "eca2478248f7465137f0224ec25d225c4a2bba84344c85fcbe62825fb03ccbf6";
const STORY_ORIGINAL_SHA256 =
  "0f56cfb7d68a248f1a109a7a09aa1a5ae2ded95f9d8b62c5d7a95dcb1e8504ba";
const DRIVE_HOST_PATTERN = /drive\.google\.com/i;
const DRIVE_FILE_ID_PATTERN = /\b1-[A-Za-z0-9_-]{25,}\b/;

function fanroomNews() {
  return news.find((entry) => entry.id === FANROOM_NEWS_ID);
}

function storyNews() {
  return news.find((entry) => entry.id === STORY_NEWS_ID);
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

describe("2026-08-21 SHOWROOM FanRoom — Latest-only", () => {
  it("adds one non-link FanRoom News item with confirmed archive wording", () => {
    const entry = fanroomNews();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === FANROOM_NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-21");
    assert.equal(entry.title, "朝枠ありがとう！次枠は14:00〜📡✨");
    assert.equal(
      entry.body,
      "8月21日のSHOWROOMファンルームで、みりぃが朝の配信へのお礼と次枠14:00〜を案内しました。初めて来てくれた方やフォローしてくれた方への感謝とともに、これからもいろいろな一面を見つけてほしいと呼びかけています。",
    );
    assert.equal(entry.source, undefined);
    assert.equal(entry.url, undefined);
    assert.equal(entry.sourceLabel, "SHOWROOMファンルーム");
    assert.equal(entry.message?.label, "みりぃからの連絡💌");
    assert.equal(entry.message?.text, FANROOM_MESSAGE);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("uses only the local privacy-safe crop with measured dimensions", async () => {
    const entry = fanroomNews();

    assert.equal(entry.media?.kind, "image");
    assert.equal(entry.media?.src, "/media/news/mily-b13-01-fanroom-next-slot.jpg");
    assert.equal(entry.media?.width, 443);
    assert.equal(entry.media?.height, 313);
    assert.equal(existsSync(fanroomImage), true);

    const meta = await sharp(fanroomImage).metadata();
    assert.equal(meta.width, 443);
    assert.equal(meta.height, 313);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.iptc, undefined);
    assert.equal(meta.xmp, undefined);
    assert.equal(meta.icc, undefined);

    if (existsSync(fanroomOriginal)) {
      const source = await readFile(fanroomOriginal);
      const published = await readFile(fanroomImage);
      const expected = await sharp(source)
        .extract({ left: 73, top: 808, width: 443, height: 313 })
        .jpeg({ quality: 82, progressive: true })
        .toBuffer();

      assert.equal(source.length, 109264);
      assert.equal(
        createHash("sha256").update(source).digest("hex"),
        FANROOM_ORIGINAL_SHA256,
      );
      assert.deepEqual(published, expected);
    }
  });

  it("keeps the raw screenshot and FanRoom crop out of every Gallery surface", async () => {
    const files = await repositoryFiles();
    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"));

    assert.equal(
      files.includes(path.relative(root, fanroomOriginal).replaceAll("\\", "/")),
      false,
    );
    assert.equal(
      publicFiles.some((file) => file.includes("8C35FA05-8AB0-427B-8238-F097183EA5F2")),
      false,
    );
    assert.equal(media.some((entry) => entry.id.includes("b13-01")), false);
    assert.equal(galleryVideos.some((entry) => entry.id.includes("b13-01")), false);

    for (const relative of [
      "src/data/media.ts",
      "src/data/galleryVideos.ts",
      "src/data/driveGalleryManifest.json",
      "src/data/stories.ts",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("mily-b13-01-fanroom-next-slot"), false, relative);
      assert.equal(source.includes(FANROOM_NEWS_ID), false, relative);
    }
  });
});

describe("2026-08-21 event Instagram Story — Latest / Gallery", () => {
  it("adds one source-less Story News item with a related Instagram CTA", () => {
    const entry = storyNews();

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === STORY_NEWS_ID).length, 1);
    assert.equal(entry.date, "2026-08-21");
    assert.equal(entry.title, "寝起き配信ありがとう！次枠14:00〜❤️‍🔥");
    assert.equal(
      entry.body,
      "8月21日のInstagram Storyで、みりぃが寝起き配信へのお礼を伝え、次枠14:00〜を案内しました。Story投稿時点では「現在5位」と報告し、ランウェイをかけたイベントに挑戦する理由についても伝えています。",
    );
    assert.equal(entry.source, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.equal(entry.url, INSTAGRAM_PROFILE);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.equal(entry.message?.text, STORY_MESSAGE);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("shares exactly one manifest object, MP4 and poster with Gallery", async () => {
    const entry = storyNews();
    const visible = visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story");
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b13-02-event-story"));

    assert.equal(entry.media, eventStory20260821);
    assert.equal(galleryVideos[9], tiktokRadioVideo);
    assert.equal(visible[7], tiktokRadioVideo);
    assert.equal(visible[8], eventStory20260821);
    assert.equal(visible[9], morningOhayo20260821);
    assert.equal(visible[10], morningShowroomRunwayVideo);
    assert.equal(visible.length, 16);
    assert.equal(galleryVideos.filter((item) => item === eventStory20260821).length, 1);
    assert.equal("sourceUrl" in eventStory20260821, false);
    assert.equal(eventStory20260821.sourceLabel, "Instagram Story");
    assert.equal(eventStory20260821.sourceDate, "2026-08-21");
    assert.equal(eventStory20260821.alt, STORY_ALT);
    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b13-02-event-story-poster.jpg",
      "media/gallery/mily-b13-02-event-story.mp4",
    ]);
    assert.equal(existsSync(storyMp4), true);
    assert.equal(existsSync(storyPoster), true);
    assert.ok((await stat(storyMp4)).size > 0);
    assert.ok((await stat(storyPoster)).size > 0);
  });

  it("keeps Drive Gallery unchanged and adds one standalone Gallery video", () => {
    const drive = driveGallerySections(visibleDriveGallery());

    assert.equal(drive.photos.length, 45);
    assert.equal(drive.videos.length, 11);
    assert.equal(galleryVideos.length, 18);
    assert.equal(visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").length + drive.videos.length, 27);
  });

  it("publishes 720x1280 H.264 Baseline at the original 1fps without audio", async () => {
    const info = await probe(storyMp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.avg_frame_rate, "1/1");
    assert.equal(video.nb_frames, "20");
    assert.equal(Number(video.duration).toFixed(6), "20.000000");
    assert.equal(Number(info.format.duration).toFixed(6), "20.000000");
    assert.equal(audio, undefined);

    if (existsSync(storyOriginal)) {
      const source = await probe(storyOriginal);
      const sourceVideo = source.streams.find((stream) => stream.codec_type === "video");
      const sourceAudio = source.streams.find((stream) => stream.codec_type === "audio");
      const sourceBytes = await readFile(storyOriginal);

      assert.equal(sourceBytes.length, 613963);
      assert.equal(
        createHash("sha256").update(sourceBytes).digest("hex"),
        STORY_ORIGINAL_SHA256,
      );
      assert.equal(sourceVideo.profile, "High");
      assert.equal(sourceVideo.width, 720);
      assert.equal(sourceVideo.height, 1280);
      assert.equal(sourceVideo.avg_frame_rate, "1/1");
      assert.equal(sourceVideo.nb_frames, "20");
      assert.equal(sourceVideo.pix_fmt, "yuv420p");
      assert.equal(sourceAudio.codec_name, "aac");
      assert.equal(sourceAudio.profile, "HE-AAC");
      assert.equal(sourceAudio.sample_rate, "44100");
      assert.equal(sourceAudio.channels, 2);
      assert.equal(sourceAudio.channel_layout, "stereo");
      assert.equal(Number(sourceAudio.duration).toFixed(6), "19.919796");
    }
  });

  it("uses faststart and removes source-specific metadata", async () => {
    assert.equal(await isFaststart(storyMp4), true);
    assert.deepEqual(
      await validateVideoDerivatives(eventStory20260821, galleryDirectory),
      { width: 720, height: 1280 },
    );

    const handle = await open(storyMp4, "r");
    try {
      const head = Buffer.alloc(64 * 1024);
      const { bytesRead } = await handle.read(head, 0, head.length, 0);
      const window = head.subarray(0, bytesRead);
      assert.ok(window.indexOf("moov", 0, "latin1") < window.indexOf("mdat", 0, "latin1"));
    } finally {
      await handle.close();
    }

    const info = await probe(storyMp4);
    assert.equal("creation_time" in (info.format.tags ?? {}), false);
    for (const stream of info.streams) {
      assert.equal("creation_time" in (stream.tags ?? {}), false);
      assert.notEqual(stream.tags?.handler_name, "Core Media Video");
      assert.notEqual(stream.tags?.handler_name, "Core Media Audio");
    }
  });

  it("uses the selected 10-second public-video frame as a clean poster", async () => {
    const meta = await sharp(storyPoster).metadata();
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
        "-hide_banner", "-loglevel", "error", "-ss", "10.0",
        "-i", storyMp4, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-",
      ],
      { encoding: "buffer", maxBuffer: 1024 * 1024 * 64 },
    );
    const posterGray = await sharp(storyPoster).greyscale().raw().toBuffer();

    assert.equal(stdout.length, posterGray.length);
    let total = 0;
    for (let index = 0; index < posterGray.length; index += 1) {
      total += Math.abs(posterGray[index] - stdout[index]);
    }
    assert.ok(total / posterGray.length < 3);
  });

  it("retains controls, inline playback and preload none", () => {
    const view = driveVideoView(eventStory20260821);

    assert.equal(view.video.controls, true);
    assert.equal(view.video.playsInline, true);
    assert.equal(view.video.preload, "none");
    assert.equal("autoPlay" in view.video, false);
    assert.equal("loop" in view.video, false);
  });
});

describe("2026-08-21 FanRoom / Story — ordering, privacy and scope", () => {
  it("keeps all existing 8/21 News and the intended same-day order", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story").filter((entry) => entry.id !== "2026-08-27-x-followers-100")).map((entry) => entry.id);
    assert.deepEqual(ordered.slice(0, 28), [
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
      "2026-08-21-tiktok-radio-misscircle",
      "2026-08-21-after-afternoon-ganda",
      FANROOM_NEWS_ID,
      STORY_NEWS_ID,
      "2026-08-21-morning-ohayo-story",
      "2026-08-21-morning-showroom-runway",
    ]);
    assert.equal(news.length, 43);
  });

  it("keeps 14:00 out of schedule data and the temporary rank out of milestones", async () => {
    const scheduleFiles = ["src/data/events.ts", "src/data/streamSchedule.ts"];
    const rankingFiles = ["src/data/contest.ts", "src/data/highlights.ts"];

    for (const relative of scheduleFiles) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("14:00"), false, relative);
      assert.equal(source.includes(FANROOM_NEWS_ID), false, relative);
      assert.equal(source.includes(STORY_NEWS_ID), false, relative);
    }
    for (const relative of rankingFiles) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.equal(source.includes("現在5位"), false, relative);
      assert.equal(source.includes(STORY_NEWS_ID), false, relative);
      assert.equal(source.includes("mily-b13-02"), false, relative);
    }
    assert.equal(existsSync(path.join(root, "stories", FANROOM_NEWS_ID)), false);
    assert.equal(existsSync(path.join(root, "stories", STORY_NEWS_ID)), false);
  });

  it("keeps Drive handoff information out of tracked text", async () => {
    const files = await repositoryFiles();

    assert.equal(files.includes(path.relative(root, storyOriginal).replaceAll("\\", "/")), false);
    for (const relative of files) {
      const bytes = await readFile(path.join(root, relative));
      if (isProbablyBinary(bytes)) continue;
      const source = bytes.toString("utf8");
      assert.doesNotMatch(source, DRIVE_HOST_PATTERN, relative);
      assert.doesNotMatch(source, DRIVE_FILE_ID_PATTERN, relative);
    }
  });

  it("publishes through the existing Portal Feed without external media hotlinks", () => {
    const scopedNews = news.filter((entry) =>
      [FANROOM_NEWS_ID, STORY_NEWS_ID].includes(entry.id),
    );
    const feed = createPortalFeed({
      newsItems: scopedNews,
      storyItems: [],
      eventItems: [],
    });
    const fanroom = findFeedItem(feed, portalNewsId(FANROOM_NEWS_ID));
    const storyNews = findFeedItem(feed, portalNewsId(STORY_NEWS_ID));

    assert.equal(scopedNews.length, 2);
    assertPortalNewsFollowsSort(feed, scopedNews);
    assert.ok(
      fanroom.image?.endsWith("/media/news/mily-b13-01-fanroom-next-slot.jpg"),
    );
    assert.equal(fanroom.sourceUrl, undefined);
    assert.ok(storyNews.image?.endsWith(eventStory20260821.poster));
    // Portal Feedは既存仕様でNewsのrelated `url`を外部導線として直マップする。
    assert.equal(storyNews.sourceUrl, INSTAGRAM_PROFILE);
    assert.doesNotMatch(eventStory20260821.src, /instagram|google|twitter|x\.com/i);
    assert.doesNotMatch(eventStory20260821.poster, /instagram|google|twitter|x\.com/i);
  });

  it("documents the ongoing FanRoom and Instagram Story rules", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const mediaDocs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");

    assert.match(ops, /SHOWROOMファンルーム投稿はLatest \/ NEWS用途/);
    assert.match(ops, /Instagramプロフィールを見る/);
    assert.match(ops, /プロフィールはStoryの\s*出典ではない/);
    assert.match(mediaDocs, /batch b13/);
    assert.match(mediaDocs, /left: 73 \/ top: 808 \/ width: 443 \/ height: 313/);
    assert.match(mediaDocs, /10\.0秒地点/);
    assert.match(mediaDocs, /公開派生はvideo-only（無音）/);
    assert.match(mediaDocs, /eventStory20260821\.json/);
  });
});
