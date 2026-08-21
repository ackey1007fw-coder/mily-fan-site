import assert from "node:assert/strict";
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
  morningShowroomRunwayVideo,
  morningStory20260820,
  morningStoryVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { isFaststart, validateVideoDerivatives } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(galleryDirectory, "mily-b07-01-morning-story.mp4");
const poster = path.join(galleryDirectory, "mily-b07-01-morning-story-poster.jpg");

const NEWS_ID = "2026-08-20-morning-story";
const MESSAGE = "8/20 (木) 今日も自分ができることを〜♪";
/** The frame the published poster was taken from. */
const POSTER_SECONDS = "4.5";

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
    "-show_format", "-show_streams", "-print_format", "json", file,
  ]);
  return JSON.parse(stdout);
}

async function trackedFiles() {
  const { stdout } = await run("git", ["ls-files"], { cwd: root, maxBuffer: 1024 * 1024 * 16 });
  return stdout.split("\n").filter(Boolean);
}

describe("2026-08-20 morning Instagram Story — Latest entry", () => {
  it("exists and stays in Latest under the same-day posts", () => {
    assert.ok(item());
    // 8/21の新着の後も、8/20同日は既存の id 昇順を維持する。
    const ordered = sortNewsByDateDesc(news).map((entry) => entry.id);
    assert.equal(ordered[0], "2026-08-21-morning-showroom-runway");
    assert.equal(ordered[1], "2026-08-20-mango-kakigori");
    assert.equal(ordered[2], "2026-08-20-morning-message");
    assert.equal(ordered[3], NEWS_ID);
  });

  it("records the confirmed date only", () => {
    assert.equal(item().date, "2026-08-20");
  });

  it("carries no Story URL and shows a non-link Instagram Story label", () => {
    const entry = item();

    assert.equal(entry.source, undefined);
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
    assert.equal(entry.sourceLabel, "Instagram Story");
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("quotes only the text confirmed on the Story", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃのメッセージ");
    assert.equal(entry.message?.text, MESSAGE);
    assert.match(entry.title, /今日も自分ができることを/);
    assert.match(entry.body, /8月20日の朝/);
    assert.match(entry.body, /Instagram Story/);

    // 本人が明言していない感情・決意・心理状態・数値を足さない
    for (const phrase of [
      "決意", "決心", "覚悟", "不安", "安堵", "自信", "順位", "得票",
      "いいね", "閲覧", "ファイナル", "グランプリ", "公式", "公認",
    ]) {
      assert.equal(entry.title.includes(phrase), false, phrase);
      assert.equal(entry.body.includes(phrase), false, phrase);
      assert.equal(entry.message.text.includes(phrase), false, phrase);
    }
  });
});

describe("2026-08-20 morning Story — shared Latest / Gallery asset", () => {
  it("points Latest at local /media/ MP4 and poster paths", () => {
    const media = item().media;

    assert.equal(media.kind, "video");
    assert.equal(media.src, "/media/gallery/mily-b07-01-morning-story.mp4");
    assert.equal(media.poster, "/media/gallery/mily-b07-01-morning-story-poster.jpg");
    assert.match(media.src, /^\/media\//);
    assert.match(media.poster, /^\/media\//);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
  });

  it("shares one MP4 object and one poster between Latest and Gallery", () => {
    const galleryItem = galleryVideos.find(
      (entry) => entry.id === morningStory20260820.id,
    );

    assert.equal(item().media, morningStory20260820);
    assert.equal(galleryItem, morningStory20260820);
    assert.equal(item().media.src, morningStory20260820.src);
    assert.equal(item().media.poster, morningStory20260820.poster);
  });

  it("publishes exactly one MP4 and one poster, and no viewer screenshot", async () => {
    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"));
    const assets = publicFiles.filter((file) => file.includes("mily-b07-01-morning-story"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b07-01-morning-story-poster.jpg",
      "media/gallery/mily-b07-01-morning-story.mp4",
    ]);

    // Instagram閲覧画面のスクリーンショットは public にも git にも入れない。
    // 検査対象はスクリーンショットらしい名前だけで、正規の公開MP4と poster
    // （allowlist）は通す。b07 の jpg を一律で弾くと poster 自身が落ちる。
    const screenshotish = /screenshot|screen-shot|story-screen|ca01aecf|13480fbc5113|写真\d/i;
    const allowedB07Assets = new Set([
      "public/media/gallery/mily-b07-01-morning-story.mp4",
      "public/media/gallery/mily-b07-01-morning-story-poster.jpg",
    ]);

    for (const file of publicFiles) {
      assert.equal(screenshotish.test(file), false, file);
    }
    for (const file of await trackedFiles()) {
      assert.equal(screenshotish.test(file), false, file);
      if (!file.includes("b07")) continue;
      assert.equal(allowedB07Assets.has(file), true, file);
    }
  });
});

describe("2026-08-20 morning Story — iOS-compatible encode", () => {
  it("is H.264 Constrained Baseline / yuv420p with no generated audio track", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");

    assert.ok(video);
    assert.equal(video.codec_name, "h264");
    // iOS / WebKit in-app browsers: Baseline系プロファイルを維持する
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.avg_frame_rate, "30/1");
    assert.equal(audio, undefined);
    assert.equal(Number(info.format.duration).toFixed(2), "5.10");
  });

  it("puts moov before mdat and drops creation_time style metadata", async () => {
    assert.equal(await isFaststart(mp4), true);

    const handle = await open(mp4, "r");
    try {
      const head = Buffer.alloc(64 * 1024);
      const { bytesRead } = await handle.read(head, 0, head.length, 0);
      const window = head.subarray(0, bytesRead);
      assert.equal(window.subarray(4, 8).toString("ascii"), "ftyp");
      assert.ok(window.indexOf("moov", 0, "latin1") < window.indexOf("mdat", 0, "latin1"));
    } finally {
      await handle.close();
    }

    const info = await probe(mp4);
    assert.equal("creation_time" in (info.format.tags ?? {}), false);
    for (const stream of info.streams) {
      assert.equal("creation_time" in (stream.tags ?? {}), false);
    }

    // 既存の共有バリデータ（metadata allowlist / faststart / 720px上限）も通す
    assert.deepEqual(
      await validateVideoDerivatives(morningStory20260820, galleryDirectory),
      { width: morningStory20260820.width, height: morningStory20260820.height },
    );
  });

  it("keeps the source framing: no upscale, no downscale, no crop", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const original = path.join(root, "media/original/mily-b07-01-morning-story.mp4");

    // 公開MP4はマニフェストの実寸と一致する
    assert.equal(video.width, morningStory20260820.width);
    assert.equal(video.height, morningStory20260820.height);

    // 元素材がある環境（gitignore 済みなので CI にはない）では、
    // 公開MP4が元素材と同じ画素数であること＝拡大も縮小もトリミングもしていないこと
    // を実測で確認する。縦横比は申告値ではなく元素材から取る。
    if (existsSync(original)) {
      const source = await probe(original);
      const sourceVideo = source.streams.find((stream) => stream.codec_type === "video");
      assert.equal(video.width, sourceVideo.width);
      assert.equal(video.height, sourceVideo.height);
      assert.equal(
        video.width / video.height,
        sourceVideo.width / sourceVideo.height,
      );
    }

    assert.ok((await stat(mp4)).size < 5 * 1024 * 1024);
  });

  it("renders with controls / playsInline / preload=none and never autoplays or loops", async () => {
    const view = driveVideoView(morningStory20260820);
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

  it("uses a poster taken from a real frame of the published MP4", async () => {
    const meta = await sharp(poster).metadata();
    assert.equal(meta.width, morningStory20260820.width);
    assert.equal(meta.height, morningStory20260820.height);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.iptc, undefined);
    assert.equal(meta.xmp, undefined);

    // 実フレームであることを、公開MP4から取り直したフレームとの画素差で確認する
    const ffmpeg = await ffmpegExe();
    const { stdout } = await run(
      ffmpeg,
      [
        "-hide_banner", "-loglevel", "error",
        "-i", mp4, "-ss", POSTER_SECONDS, "-frames:v", "1",
        "-f", "rawvideo", "-pix_fmt", "gray", "-",
      ],
      { encoding: "buffer", maxBuffer: 1024 * 1024 * 64 },
    );
    const posterGray = await sharp(poster).greyscale().raw().toBuffer();

    assert.equal(stdout.length, posterGray.length);
    let total = 0;
    for (let index = 0; index < posterGray.length; index += 1) {
      total += Math.abs(posterGray[index] - stdout[index]);
    }
    const meanAbsoluteDifference = total / posterGray.length;
    assert.ok(meanAbsoluteDifference < 3, `mean |Δ| = ${meanAbsoluteDifference}`);
  });
});

describe("2026-08-20 morning Story — surrounding content is untouched", () => {
  it("adds one standalone Gallery video without dropping b03 or the Drive batch", () => {
    const drive = driveGallerySections(visibleDriveGallery());
    const visible = visibleGalleryVideos();

    // 2026-08-21 のX投稿動画（b11）が加わって4本。b07 は既存の2番目を維持。
    assert.equal(visible.length, 4);
    assert.equal(visible[0], morningShowroomRunwayVideo);
    assert.equal(visible[1], morningStory20260820);
    assert.ok(visible.includes(morningStoryVideo));
    assert.equal(morningStoryVideo.src, "/media/gallery/mily-b03-01-morning-ohayo.mp4");
    assert.equal(drive.videos.length, 11);
    assert.equal(drive.photos.length, 45);
    assert.equal(
      drive.videos.some((video) => video.video.src.includes("mily-b07-01")),
      false,
    );
  });

  it("keeps the 8/17, 8/18 and 8/19 Latest entries", () => {
    for (const id of [
      "2026-08-20-mango-kakigori",
      "2026-08-20-morning-message",
      "2026-08-19-second-round-result",
      "2026-08-19-well-rested-morning",
      "2026-08-18-evening-radio",
      "2026-08-18-morning-update",
      "2026-08-17-morning-story",
      "2026-08-02-21st-birthday",
    ]) {
      assert.ok(news.some((entry) => entry.id === id), id);
    }
  });

  it("does not create a /stories/ article for the morning Story", async () => {
    const source = await readFile(path.join(root, "src/data/stories.ts"), "utf8");

    assert.equal(stories.some((story) => story.date === "2026-08-20"), false);
    assert.doesNotMatch(source, /2026-08-20-morning-story|mily-b07-01-morning-story/);
    assert.equal(existsSync(path.join(root, "stories/2026-08-20-morning-story")), false);
  });
});

describe("2026-08-20 morning Story — Portal Feed", () => {
  it("flows through the existing Portal Feed logic with the poster as image", () => {
    const feed = createPortalFeed({ now: new Date("2026-08-20T09:00:00+09:00") });
    const entry = feed.items.find((candidate) => candidate.id === `mily:news:${NEWS_ID}`);

    assert.ok(entry);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-20T00:00:00+09:00");
    assert.equal(entry.sourceUrl, undefined);
    assert.equal(feed.items[0].id, "mily:news:2026-08-21-morning-showroom-runway");
    assert.equal(feed.items[1].id, "mily:news:2026-08-20-mango-kakigori");
    assert.equal(feed.items[2].id, "mily:news:2026-08-20-morning-message");
    assert.equal(feed.items[3].id, entry.id);
    assert.ok(entry.image?.endsWith(morningStory20260820.poster));
  });
});
