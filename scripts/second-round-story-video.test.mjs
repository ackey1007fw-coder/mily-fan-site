import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { open, readFile, readdir, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { contest } from "../src/data/contest.ts";
import { driveGallerySections, driveVideoView, visibleDriveGallery } from "../src/data/driveGallery.ts";
import {
  eventStory20260821,
  galleryVideos,
  morningOhayo20260821,
  morningShowroomRunwayVideo,
  morningStory20260820,
  morningStoryVideo,
  secondRoundStoryVideo,
  tiktokRadioVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { media } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import { stories, storyBySlug, storySources } from "../src/data/stories.ts";
import { isFaststart, validateVideoDerivatives } from "./build-drive-gallery.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(galleryDirectory, "mily-b09-01-second-round-story.mp4");
const poster = path.join(galleryDirectory, "mily-b09-01-second-round-story-poster.jpg");
const original = path.join(root, "media/original/mily-b09-01-second-round-story.mp4");

const STORY_SLUG = "second-round-result-2026";
const NEWS_ID = "2026-08-19-second-round-result";
const X_STATUS_ID = "2089996508691390948";
const STORY_MEDIA_ID = "second-round-result-story-video";
const SOURCE_ID = "instagram-story-2026-08-19-second-round-result";
/** The frame the published poster was taken from. */
const POSTER_SECONDS = "5.0";
/** Owner-verified measurements of the original (SHA256SUMS.txt / METADATA.txt). */
const ORIGINAL_SHA256 =
  "f426810ca76b2c8a9a6d10212853e67a4e20de172565bbf60285fc8ffa3f63f1";

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

/** Tracked files plus not-yet-committed ones, so a new file added by this
 *  change is scanned too. gitignored paths stay excluded. */
async function committableFiles() {
  const { stdout } = await run(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard"],
    { cwd: root, maxBuffer: 1024 * 1024 * 16 },
  );
  return [...new Set(stdout.split("\n").filter(Boolean))];
}

function resultStory() {
  return storyBySlug(STORY_SLUG);
}

function storyVideo() {
  return resultStory()?.media.find((item) => item.id === STORY_MEDIA_ID);
}

describe("2026-08-19 second-round Story video — nothing existing was duplicated", () => {
  it("keeps exactly one 2次審査通過 news item and adds no new one", () => {
    const matches = news.filter((entry) => entry.id === NEWS_ID);

    assert.equal(matches.length, 1);
    assert.equal(matches[0].date, "2026-08-19");
    assert.equal(matches[0].url, `/stories/${STORY_SLUG}/`);
  });

  it("never reuses the 2次審査通過 X post URL in a second news item", () => {
    const usingPost = news.filter((entry) =>
      [entry.source, entry.url].some((value) => value?.includes(X_STATUS_ID)),
    );

    assert.equal(usingPost.length, 1);
    assert.equal(usingPost[0].id, NEWS_ID);
  });

  it("keeps the existing STORY article and its original photo and sources", () => {
    const story = resultStory();

    assert.ok(story);
    assert.equal(story.published, true);
    assert.equal(story.badge, "2次審査通過");
    assert.equal(story.leadMediaId, "second-round-result-photo");

    const photo = story.media.find((item) => item.id === "second-round-result-photo");
    assert.equal(photo.kind, "image");
    assert.equal(
      photo.src,
      "/media/stories/second-round-result-2026/mily-second-round-result-autumn-leaf.jpg",
    );

    // 既存の本文セクションと出典は残す
    for (const id of ["second-round-result", "thanks", "next-stage"]) {
      assert.ok(story.sections.some((section) => section.id === id), id);
    }
    for (const id of [
      "x-2026-08-19-second-round-result",
      "misscircle-2026-third-round-post",
      "misscircle-2026-third-round-list",
      "misscircle-2026-entry-734",
    ]) {
      assert.ok(story.sourceIds.includes(id), id);
    }
  });

  it("does not re-add or duplicate the b05-01 autumn-leaf photo", async () => {
    const b05 = media.filter((item) => item.basePath?.includes("mily-b05-01"));
    assert.equal(b05.length, 1);

    // 記事側のフルサイズ1枚も1つだけ。Story動画の追加で複製していない。
    const articleCopies = resultStory().media.filter(
      (item) => item.kind === "image" && item.src.includes("autumn-leaf"),
    );
    assert.equal(articleCopies.length, 1);

    // 公開派生も既存の 480/960/1600 × jpg/webp のまま（新規生成なし）
    const derivatives = (await readdir(galleryDirectory))
      .filter((file) => file.includes("mily-b05-01"))
      .sort();
    assert.deepEqual(derivatives, [
      "mily-b05-01-autumn-leaf-1600.jpg",
      "mily-b05-01-autumn-leaf-1600.webp",
      "mily-b05-01-autumn-leaf-480.jpg",
      "mily-b05-01-autumn-leaf-480.webp",
      "mily-b05-01-autumn-leaf-960.jpg",
      "mily-b05-01-autumn-leaf-960.webp",
    ]);
  });
});

describe("2026-08-19 second-round Story video — shared STORY / Gallery asset", () => {
  it("adds the video to the existing STORY article", () => {
    const video = storyVideo();

    assert.ok(video);
    assert.equal(video.kind, "video");
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);

    // 記事本文の該当セクションから参照されている
    const section = resultStory().sections.find((entry) => entry.id === "instagram-story");
    assert.ok(section);
    assert.match(section.title, /Instagram Story/);
    assert.ok(
      section.blocks.some(
        (block) => block.type === "media" && block.mediaId === STORY_MEDIA_ID,
      ),
    );
  });

  it("adds the video to the Gallery archive, newest first, keeping b03 and b07", () => {
    const visible = visibleGalleryVideos();

    assert.equal(visible.length, 12);
    // 8/24 (b25 → b23) → 8/23 (b21 → b19 → b18) → 8/21 (b15 → b13 → b12 → b11) → 8/20 (b07) → 8/19 (b09) → 8/17 (b03)
    assert.deepEqual(visible.map((entry) => entry.sourceDate), [
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
    ]);
    assert.equal(visible[5], tiktokRadioVideo);
    assert.equal(visible[6], eventStory20260821);
    assert.equal(visible[7], morningOhayo20260821);
    assert.equal(visible[8], morningShowroomRunwayVideo);
    assert.equal(visible[10], secondRoundStoryVideo);
    assert.ok(visible.includes(morningStory20260820));
    assert.ok(visible.includes(morningStoryVideo));
    assert.equal(morningStoryVideo.src, "/media/gallery/mily-b03-01-morning-ohayo.mp4");
    assert.equal(
      morningStory20260820.src,
      "/media/gallery/mily-b07-01-morning-story.mp4",
    );
    assert.equal(galleryVideos.length, 12);
  });

  it("shares one MP4 and one poster between the STORY article and Gallery", () => {
    const video = storyVideo();

    assert.equal(video.src, secondRoundStoryVideo.src);
    assert.equal(video.poster, secondRoundStoryVideo.poster);
    assert.equal(video.width, secondRoundStoryVideo.width);
    assert.equal(video.height, secondRoundStoryVideo.height);
    assert.equal(video.src, "/media/gallery/mily-b09-01-second-round-story.mp4");
    assert.equal(
      video.poster,
      "/media/gallery/mily-b09-01-second-round-story-poster.jpg",
    );
  });

  it("publishes exactly one MP4 and one poster, and no viewer screenshot", async () => {
    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"));
    const assets = publicFiles.filter((file) => file.includes("mily-b09-01"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b09-01-second-round-story-poster.jpg",
      "media/gallery/mily-b09-01-second-round-story.mp4",
    ]);

    // 元素材は gitignore されたままで、コミットされていない
    const tracked = await trackedFiles();
    assert.equal(tracked.includes("media/original/mily-b09-01-second-round-story.mp4"), false);

    const allowed = new Set([
      "public/media/gallery/mily-b09-01-second-round-story.mp4",
      "public/media/gallery/mily-b09-01-second-round-story-poster.jpg",
    ]);
    for (const file of tracked) {
      if (!file.includes("b09")) continue;
      assert.equal(allowed.has(file), true, file);
    }
  });

  it("is not mixed into the Drive Gallery b02 batch", () => {
    const drive = driveGallerySections(visibleDriveGallery());

    assert.equal(drive.videos.length, 11);
    assert.equal(drive.photos.length, 45);
    assert.equal(
      drive.videos.some((video) => video.video.src.includes("mily-b09-01")),
      false,
    );
  });
});

describe("2026-08-19 second-round Story video — source URL handling", () => {
  it("shows a non-link Instagram Story label and stores no Story URL", () => {
    assert.equal(secondRoundStoryVideo.sourceLabel, "Instagram Story");
    assert.equal(secondRoundStoryVideo.provenance, "owner-provided");
    assert.equal(secondRoundStoryVideo.sourceDate, "2026-08-19");
    assert.equal("sourceUrl" in secondRoundStoryVideo, false);
    assert.equal("url" in storySources[SOURCE_ID], false);
    assert.ok(resultStory().sourceIds.includes(SOURCE_ID));
  });

  it("keeps the temporary Instagram Story share URL out of every tracked file", async () => {
    // 一時的なStory共有URLは確認資料に留め、コード・data・metadataへ残さない
    // 検査対象の文字列そのものがこのファイルに残らないよう分割して組み立てる
    const forbidden = [
      ["396704516", "7589057716"].join(""),
      ["instagram.com", "stories"].join("/"),
    ];

    const scanned = [];
    for (const file of await committableFiles()) {
      if (/^(pnpm-lock\.yaml|public\/media\/|media\/|node_modules\/|dist\/)/.test(file)) continue;
      let text;
      try {
        text = await readFile(path.join(root, file), "utf8");
      } catch {
        continue;
      }
      scanned.push(file);
      for (const needle of forbidden) {
        assert.equal(text.includes(needle), false, `${file}: ${needle}`);
      }
    }

    // 走査が空振りしていないこと（この変更で足したファイルも対象に入る）
    assert.ok(scanned.includes("src/data/secondRoundStoryVideo.ts"));
    assert.ok(scanned.includes("src/data/secondRoundStoryVideo.json"));
    assert.ok(scanned.includes("src/data/stories.ts"));
    assert.ok(scanned.length > 50, `scanned ${scanned.length} files`);
  });

  it("adds no unconfirmed third-round schedule", async () => {
    // Storyに「9/3〜 3次審査」の表示はあるが、恒久ソースとして保存しない方針。
    // contest.ts は据え置き、9/13 のような未確認の日付はどこにも書かない。
    assert.equal(contest.currentPhase.start, null);
    assert.equal(contest.currentPhase.end, null);
    assert.equal(contest.lastVerifiedAt, "2026-08-19");

    const story = resultStory();
    const text = [
      story.title,
      story.lead,
      story.cardDescription,
      ...story.sections.flatMap((section) => [
        section.title,
        ...section.blocks.flatMap((block) =>
          block.type === "paragraph"
            ? [block.text]
            : block.type === "quote"
              ? block.paragraphs
              : [],
        ),
      ]),
      ...story.media.map((item) => item.caption ?? ""),
      secondRoundStoryVideo.alt,
    ].join("\n");

    for (const phrase of ["9/13", "9月13日", "9/3", "9月3日", "三次審査は", "順位", "得票"]) {
      assert.equal(text.includes(phrase), false, phrase);
    }
  });
});

describe("2026-08-19 second-round Story video — iOS-compatible encode", () => {
  it("is H.264 Constrained Baseline / yuv420p with the audio track removed", async () => {
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

    // 再配信権を確認できない音声のため video-only にした（docs/MEDIA.md b09）
    assert.equal(audio, undefined);
    assert.equal(info.streams.length, 1);
  });

  it("keeps the source framing: 512×910, no upscale, downscale or crop", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");

    assert.equal(video.width, 512);
    assert.equal(video.height, 910);
    assert.equal(video.width, secondRoundStoryVideo.width);
    assert.equal(video.height, secondRoundStoryVideo.height);

    // 元素材がある環境（gitignore 済みなので CI にはない）では、公開MP4が
    // 元素材と同じ画素数＝拡大も縮小もトリミングもしていないことを実測する。
    if (existsSync(original)) {
      const source = await probe(original);
      const sourceVideo = source.streams.find((stream) => stream.codec_type === "video");

      assert.equal(video.width, sourceVideo.width);
      assert.equal(video.height, sourceVideo.height);
      assert.equal(
        video.width / video.height,
        sourceVideo.width / sourceVideo.height,
      );
      assert.equal(sourceVideo.avg_frame_rate, "30/1");

      // オーナーが一次資料として指定した SHA-256 と一致した元素材だけを使う
      const { createHash } = await import("node:crypto");
      const digest = createHash("sha256").update(await readFile(original)).digest("hex");
      assert.equal(digest, ORIGINAL_SHA256);
    }

    assert.ok((await stat(mp4)).size < 5 * 1024 * 1024);
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
      assert.equal(stream.tags?.handler_name, "VideoHandler");
    }

    // 既存の共有バリデータ（metadata allowlist / faststart / 720px上限）も通す
    assert.deepEqual(
      await validateVideoDerivatives(secondRoundStoryVideo, galleryDirectory),
      { width: secondRoundStoryVideo.width, height: secondRoundStoryVideo.height },
    );
  });

  it("uses a poster taken from a real frame of the published MP4", async () => {
    const meta = await sharp(poster).metadata();

    assert.equal(meta.width, secondRoundStoryVideo.width);
    assert.equal(meta.height, secondRoundStoryVideo.height);
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

describe("2026-08-19 second-round Story video — playback attributes", () => {
  it("renders with controls / playsInline / preload=none and never autoplays or loops", async () => {
    const view = driveVideoView(secondRoundStoryVideo);
    const storyPage = await readFile(path.join(root, "src/StoryPage.tsx"), "utf8");
    const gallery = await readFile(path.join(root, "src/components/Gallery.tsx"), "utf8");

    assert.equal(view.video.controls, true);
    assert.equal(view.video.playsInline, true);
    assert.equal(view.video.preload, "none");
    assert.equal("autoPlay" in view.video, false);
    assert.equal("loop" in view.video, false);

    for (const source of [storyPage, gallery]) {
      assert.match(source, /controls/);
      assert.match(source, /playsInline/);
      assert.match(source, /preload/);
      assert.doesNotMatch(source, /autoPlay|autoplay|\bloop\b/);
    }

    // 記事側は preload="none" を直接書く。Gallery は driveVideoView 経由なので
    // 上の view.video.preload === "none" が同じ契約を押さえている。
    assert.match(storyPage, /preload="none"/);
    assert.match(gallery, /preload=\{video\.video\.preload\}/);

    // 記事側の <video> も poster を出す
    assert.match(storyPage, /poster=\{media\.poster\}/);
  });

  it("does not create a second /stories/ article for the Story video", () => {
    const sameDay = stories.filter((story) => story.date === "2026-08-19");

    assert.equal(sameDay.length, 1);
    assert.equal(sameDay[0].slug, STORY_SLUG);
    assert.equal(existsSync(path.join(root, "stories/2026-08-19-second-round-story")), false);
  });
});
