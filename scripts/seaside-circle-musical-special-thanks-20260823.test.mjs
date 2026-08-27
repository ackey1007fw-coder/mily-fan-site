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
  earthquakeSafetyStoryVideo,
  eventStory20260821,
  galleryVideos,
  mixch15xDayMovie,
  mixchConfidenceMessageMovie,
  morningOhayo20260821,
  morningShowroomRunwayVideo,
  morningStory20260820,
  morningStoryVideo,
  seasideCircleMusicalSpecialThanksVideo,
  seasideCircleMusicalSpecialVideo,
  secondRoundStoryVideo,
  tiktokRadioVideo,
  tiktokSayonaraIchigoVideo,
  visibleGalleryVideos,
} from "../src/data/galleryVideos.ts";
import { contest } from "../src/data/contest.ts";
import { events } from "../src/data/events.ts";
import { highlights } from "../src/data/highlights.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { profile } from "../src/data/profile.ts";
import { socials } from "../src/data/socials.ts";
import {
  stories,
  storyBySlug,
  storySources,
} from "../src/data/stories.ts";
import { streamSchedule } from "../src/data/streamSchedule.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { isFaststart } from "./build-drive-gallery.mjs";
import { verifyNews } from "./content-invariants.mjs";
import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
} from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "public/media/gallery");
const mp4 = path.join(
  galleryDirectory,
  "mily-b21-01-seaside-circle-musical-special-thanks.mp4",
);
const poster = path.join(
  galleryDirectory,
  "mily-b21-01-seaside-circle-musical-special-thanks-poster.jpg",
);
const original = path.join(
  root,
  "media/original/mily-b21-01-seaside-circle-musical-special-thanks.mp4",
);
const b19Mp4 = path.join(
  galleryDirectory,
  "mily-b19-01-seaside-circle-musical-special.mp4",
);
const b19Poster = path.join(
  galleryDirectory,
  "mily-b19-01-seaside-circle-musical-special-poster.jpg",
);

const NEWS_ID = "2026-08-23-seaside-circle-musical-special";
const STORY_SLUG = "2026-08-23-musical-special";
const STORY_HREF = "/stories/2026-08-23-musical-special/";
const THANKS_SOURCE_ID = "program-instagram-story-thanks-2026-08-23";
const THANKS_MEDIA_ID = "seaside-circle-musical-special-thanks-story";
const ALT =
  "スタジオで3人が並び、真夏のミュージカル特集へのお礼と清水美依紗さんへの出演感謝メッセージが表示されたInstagram Story動画";
const POSTER_SECONDS = "8.0";
const ORIGINAL_SHA256 =
  "d143ecbd7976453470145be6079107a0e7820c13798098f3e155f5dfda5a917d";
const PUBLIC_MP4_SHA256 =
  "95c338f696557042c37c9cb95afbfe689763c7a7d8d0a38acc99b23933dfcf8f";
const PUBLIC_MP4_SIZE = 511902;
const POSTER_SHA256 =
  "fbf5cc8650932c617787f68053f02137f12586f4709492bd68fe6b021cc4b67b";
const DOCS_HOST_PATTERN = /docs\.google\.com/i;
const DRIVE_SHARE_QUERY_PATTERN = new RegExp(["usp=", "drivesdk"].join(""), "i");
const DRIVE_FILE_PATH_PATTERN = /\/file\/d\//i;
const TRANSFER_PATH_PATTERN = /\/mnt\/data|\/exec-daemon\//i;
const STORY_PERMALINK_PATTERN = /instagram\.com\/stories\//i;
const PERSONAL_STORY_LABEL = /本人Instagram Story|みりぃのInstagram Story|@mily_chan36 のInstagram Story/;

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

function story() {
  return storyBySlug(STORY_SLUG);
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

async function committableFiles() {
  const { stdout } = await run(
    "git",
    ["ls-files", "-co", "--exclude-standard"],
    { cwd: root, maxBuffer: 1024 * 1024 * 16 },
  );
  return stdout.split("\n").filter(Boolean);
}

describe("2026-08-23 seaside circle thanks Story — NEWS stays one item", () => {
  it("does not add a new NEWS id and keeps the existing radio NEWS shape", () => {
    const radioNews = news.filter((entry) => entry.id === NEWS_ID);
    const extraThanksNews = news.filter(
      (entry) =>
        entry.id === "2026-08-23-seaside-circle-musical-special-thanks" ||
        entry.id.includes("musical-special-thanks"),
    );
    const entry = item();

    assert.equal(radioNews.length, 1);
    assert.equal(extraThanksNews.length, 0);
    assert.equal(news.length, 46);
    assert.equal(entry?.date, "2026-08-23");
    assert.equal(entry?.sameDayOrder, 4);
    assert.deepEqual(entry?.activityIds, ["radio"]);
    assert.equal(entry?.url, STORY_HREF);
    assert.equal(entry?.ctaLabel, "真夏のミュージカル特集の放送記録を読む");
    assert.equal(entry?.source, "https://x.com/fm_smw856/status/2091499993102524714");
    assert.equal(entry?.sourceLabel, "FM湘南マジックウェイブの放送後投稿を見る");
    assert.match(entry?.body ?? "", /放送後、番組公式Instagram Storyでは、リスナーへのお礼と清水美依紗さんへの出演への感謝も届けられました。/);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("uses the b21 thanks video as the NEWS representative media", () => {
    const entry = item();

    assert.equal(entry?.media, seasideCircleMusicalSpecialThanksVideo);
    assert.equal(entry?.media?.kind, "video");
    assert.equal(entry?.media?.src, seasideCircleMusicalSpecialThanksVideo.src);
    assert.equal(entry?.media?.poster, seasideCircleMusicalSpecialThanksVideo.poster);
    assert.equal(entry?.media?.src, "/media/gallery/mily-b21-01-seaside-circle-musical-special-thanks.mp4");
    assert.notEqual(entry?.media, seasideCircleMusicalSpecialVideo);
    assert.notEqual(entry?.media?.src, seasideCircleMusicalSpecialVideo.src);
  });

  it("stays below the dragon-cloud NEWS and above earlier 8/23 Fan Room items", () => {
    const ordered = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-paton-vote-how-to").filter((entry) => entry.id !== "2026-08-27-x-followers-100").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story")).map((entry) => entry.id);
    assert.equal(ordered[0], "2026-08-26-girlsaward-showroom-6th");
    assert.equal(ordered[1], "2026-08-26-paton-vote-stories");
    assert.equal(ordered[2], "2026-08-26-instagram-followers-400");
    assert.equal(ordered[3], "2026-08-26-morning-stream-thanks");
    assert.equal(ordered[4], "2026-08-26-girl-award-event-fanroom");
    assert.equal(ordered[5], "2026-08-26-mixch-15x-day");
    assert.equal(ordered[6], "2026-08-26-stream-1000");
    assert.equal(ordered[7], "2026-08-25-mixch-confidence-message");
    assert.equal(ordered[8], "2026-08-25-motivation");
    assert.equal(ordered[9], "2026-08-24-seasidecircle-yes-tokyo");
    assert.equal(ordered[10], "2026-08-24-campus-girls-final-stage-guide");
    assert.equal(ordered[11], "2026-08-24-makeup-stream");
    assert.equal(ordered[12], "2026-08-24-night-thanks-morning-stream");
    assert.equal(ordered[13], "2026-08-23-dragon-cloud");
    assert.equal(ordered[14], NEWS_ID);
    assert.equal(ordered[15], "2026-08-23-morning-showroom-fanroom");
    assert.equal(ordered[16], "2026-08-23-early-showroom-fanroom");
    assert.equal(ordered[17], "2026-08-23-earthquake-showroom-fanroom");
  });

  it("still appears once on the radio Activity", () => {
    const priorRadioNews = news.filter(
      (entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story",
    );
    const radioNews = selectActivityNews("radio", priorRadioNews, priorRadioNews.length);
    assert.equal(radioNews.filter((entry) => entry.id === NEWS_ID).length, 1);
    assert.equal(radioNews[2]?.id, NEWS_ID);
  });
});

describe("2026-08-23 seaside circle thanks Story — Gallery order", () => {
  it("places b21 after newer 8/24 videos, keeps b19 next, and preserves the rest", () => {
    const visible = visibleGalleryVideos().filter((entry) => entry.id !== "mily-b36-01-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "mily-b35-01-miss-circle-showroom-story").filter((entry) => entry.id !== "mixch-m-VDojsMY5");

    assert.equal(galleryVideos.length, 20);
    assert.equal(visible.length, 17);
    assert.equal(galleryVideos[6], seasideCircleMusicalSpecialThanksVideo);
    assert.equal(visible[4], seasideCircleMusicalSpecialThanksVideo);
    assert.equal(galleryVideos[7], seasideCircleMusicalSpecialVideo);
    assert.equal(visible[5], seasideCircleMusicalSpecialVideo);
    assert.deepEqual(visible.slice(6), [
      earthquakeSafetyStoryVideo,
      tiktokRadioVideo,
      eventStory20260821,
      morningOhayo20260821,
      morningShowroomRunwayVideo,
      morningStory20260820,
      secondRoundStoryVideo,
      morningStoryVideo,
      tiktokSayonaraIchigoVideo,
      mixch15xDayMovie,
      mixchConfidenceMessageMovie,
    ]);
    assert.equal(seasideCircleMusicalSpecialThanksVideo.published, true);
    assert.equal(seasideCircleMusicalSpecialThanksVideo.provenance, "owner-provided");
    assert.equal(
      seasideCircleMusicalSpecialThanksVideo.sourceLabel,
      "湘南シーサイドサークル Instagram Story",
    );
    assert.equal(seasideCircleMusicalSpecialThanksVideo.sourceDate, "2026-08-23");
    assert.equal(seasideCircleMusicalSpecialThanksVideo.alt, ALT);
    assert.equal("sourceUrl" in seasideCircleMusicalSpecialThanksVideo, false);
    assert.equal(seasideCircleMusicalSpecialVideo.published, true);
    assert.equal(
      galleryVideos.filter((video) => video.id === seasideCircleMusicalSpecialVideo.id).length,
      1,
    );
  });
});

describe("2026-08-23 seaside circle thanks Story — existing STORY article", () => {
  it("keeps a single Story route and leaves b19 as leadMedia", () => {
    const musicalStories = stories.filter((entry) =>
      entry.slug.includes("2026-08-23-musical-special"),
    );
    const entry = story();

    assert.equal(musicalStories.length, 1);
    assert.equal(entry?.href, STORY_HREF);
    assert.equal(entry?.leadMediaId, "seaside-circle-musical-special-story");
    assert.equal(entry?.media[0]?.id, "seaside-circle-musical-special-story");
    assert.equal(entry?.media[0]?.src, seasideCircleMusicalSpecialVideo.src);
    assert.equal(existsSync(b19Mp4), true);
    assert.equal(existsSync(b19Poster), true);
  });

  it("adds the thanks Story as a non-link source and closing media block", () => {
    const entry = story();
    const closing = entry?.sections.find((section) => section.id === "closing");
    const thanksMedia = entry?.media.find((media) => media.id === THANKS_MEDIA_ID);
    const thanksSource = storySources[THANKS_SOURCE_ID];

    assert.ok(entry?.sourceIds.includes(THANKS_SOURCE_ID));
    assert.equal(thanksSource.label, "湘南シーサイドサークル Instagram Story（清水美依紗さん出演お礼 / 2026年8月23日）");
    assert.equal("url" in thanksSource, false);
    assert.equal(thanksMedia?.kind, "video");
    assert.equal(thanksMedia?.src, seasideCircleMusicalSpecialThanksVideo.src);
    assert.equal(thanksMedia?.poster, seasideCircleMusicalSpecialThanksVideo.poster);
    assert.equal(thanksMedia?.width, 720);
    assert.equal(thanksMedia?.height, 1280);
    assert.equal(
      thanksMedia?.label,
      "真夏のミュージカル特集へのお礼と、清水美依紗さんへの出演感謝を伝える湘南シーサイドサークルのInstagram Story動画",
    );
    assert.equal(
      thanksMedia?.caption,
      "放送後の湘南シーサイドサークル Instagram Story。番組を聴いてくれた人へのお礼と、清水美依紗さんのゲスト出演への感謝が届けられました。",
    );
    assert.equal(closing?.title, "真夏の3時間を閉じる");
    assert.equal(
      closing?.blocks.at(-2)?.type === "paragraph" && closing.blocks.at(-2).text,
      "放送後、湘南シーサイドサークルのInstagram Storyでは、番組を聴いてくれた人へのお礼と、清水美依紗さんの出演への感謝が届けられました。",
    );
    assert.deepEqual(closing?.blocks.at(-1), {
      type: "media",
      mediaId: THANKS_MEDIA_ID,
      sourceIds: [THANKS_SOURCE_ID],
    });
  });
});

describe("2026-08-23 seaside circle thanks Story — published assets", () => {
  it("publishes exactly one local MP4 and one local poster", async () => {
    const assets = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b21-01-seaside-circle-musical-special-thanks"));

    assert.deepEqual(assets.sort(), [
      "media/gallery/mily-b21-01-seaside-circle-musical-special-thanks-poster.jpg",
      "media/gallery/mily-b21-01-seaside-circle-musical-special-thanks.mp4",
    ]);
    assert.equal(existsSync(mp4), true);
    assert.equal(existsSync(poster), true);
    assert.ok((await stat(mp4)).size > 0);
    assert.ok((await stat(poster)).size > 0);
    assert.equal(
      existsSync(path.join(root, "public/media/news/mily-b21-01-seaside-circle-musical-special-thanks.mp4")),
      false,
    );
  });

  it("keeps H.264 video-only, 720x1280, 1fps, 20 frames, faststart, and stripped metadata", async () => {
    const info = await probe(mp4);
    const video = info.streams.find((stream) => stream.codec_type === "video");
    const audio = info.streams.find((stream) => stream.codec_type === "audio");
    const mp4Bytes = await readFile(mp4);

    assert.ok(video);
    assert.equal(audio, undefined);
    assert.equal(video.codec_name, "h264");
    assert.match(video.profile, /Baseline/);
    assert.equal(video.has_b_frames, 0);
    assert.equal(video.pix_fmt, "yuv420p");
    assert.equal(video.width, 720);
    assert.equal(video.height, 1280);
    assert.equal(video.avg_frame_rate, "1/1");
    assert.equal(video.nb_frames, "20");
    assert.ok(
      Math.abs(Number(video.duration) - 20) < 0.05,
      `duration ${video.duration}`,
    );
    assert.equal(mp4Bytes.length, PUBLIC_MP4_SIZE);
    assert.equal(info.chapters?.length ?? 0, 0);
    assert.equal(createHash("sha256").update(mp4Bytes).digest("hex"), PUBLIC_MP4_SHA256);
    assert.equal(await isFaststart(mp4), true);
    assert.equal(info.format.tags?.creation_time, undefined);
    assert.doesNotMatch(JSON.stringify(info), /Core Media/);

    if (existsSync(original)) {
      const source = await probe(original);
      const sourceVideo = source.streams.find((stream) => stream.codec_type === "video");
      const sourceAudio = source.streams.find((stream) => stream.codec_type === "audio");
      const sourceBytes = await readFile(original);
      assert.equal(sourceBytes.length, 824316);
      assert.equal(
        createHash("sha256").update(sourceBytes).digest("hex"),
        ORIGINAL_SHA256,
      );
      assert.equal(sourceVideo?.width, 720);
      assert.equal(sourceVideo?.height, 1280);
      assert.equal(sourceVideo?.nb_frames, "20");
      assert.equal(sourceVideo?.avg_frame_rate, "1/1");
      assert.equal(sourceAudio?.profile, "HE-AAC");
    }
  });

  it("uses an 8.0s real frame poster without privacy metadata", async () => {
    const posterBytes = await readFile(poster);
    const metadata = await sharp(poster).metadata();

    assert.equal(createHash("sha256").update(posterBytes).digest("hex"), POSTER_SHA256);
    assert.equal(metadata.width, 720);
    assert.equal(metadata.height, 1280);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
    assert.equal(POSTER_SECONDS, "8.0");

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

  it("does not add autoplay or loop", async () => {
    const view = driveVideoView(seasideCircleMusicalSpecialThanksVideo);
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const gallery = await readFile(path.join(root, "src/components/Gallery.tsx"), "utf8");
    const storyPage = await readFile(path.join(root, "src/StoryPage.tsx"), "utf8");

    assert.equal(view.video.controls, true);
    assert.equal(view.video.playsInline, true);
    assert.equal(view.video.preload, "none");
    assert.equal("autoPlay" in view.video, false);
    assert.equal("loop" in view.video, false);
    for (const source of [latest, gallery, storyPage]) {
      assert.match(source, /controls/);
      assert.match(source, /playsInline/);
      assert.match(source, /preload/);
      assert.doesNotMatch(source, /autoPlay|autoplay|\bloop\b/);
    }
  });
});

describe("2026-08-23 seaside circle thanks Story — privacy and scope", () => {
  it("does not publish Drive URLs, transfer paths, or invented Story permalinks", async () => {
    const published = [
      "src/data/news.ts",
      "src/data/stories.ts",
      "src/data/galleryVideos.ts",
      "src/data/activities.ts",
      "src/data/site.ts",
      "src/data/links.ts",
      "src/data/seasideCircleMusicalSpecialThanksVideo.ts",
      "src/data/seasideCircleMusicalSpecialThanksVideo.json",
      "docs/CONTENT-OPS.md",
      "docs/MEDIA.md",
      "public/sitemap.xml",
    ];
    const forbidden = [
      DOCS_HOST_PATTERN,
      DRIVE_HOST_PATTERN,
      DRIVE_SHARE_QUERY_PATTERN,
      DRIVE_FILE_PATH_PATTERN,
      TRANSFER_PATH_PATTERN,
      STORY_PERMALINK_PATTERN,
    ];

    for (const relative of published) {
      const text = await readFile(path.join(root, relative), "utf8");
      for (const pattern of forbidden) {
        assert.equal(pattern.test(text), false, `${relative} ${pattern}`);
      }
      assert.equal(findDriveIds(text).length, 0, relative);
    }

    const files = await committableFiles();
    assert.equal(
      files.some((file) => file.startsWith("media/original/") && file.endsWith(".mp4")),
      false,
    );
    assert.equal(
      files.some((file) => file.includes("mily-b21-01-seaside-circle-musical-special-thanks") && file.startsWith("media/original/")),
      false,
    );
  });

  it("does not expand into events, schedule, contest, profile, highlights, or socials", async () => {
    assert.equal(events.length, 0);
    assert.deepEqual(streamSchedule, []);
    assert.doesNotMatch(JSON.stringify(contest), /mily-b21|musical-special/);
    assert.match(contest.lastVerifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(profile.displayName, "みりぃ");
    assert.equal(profile.publicName, "三橋莉子");
    assert.equal(
      highlights.some((item) => JSON.stringify(item).includes("mily-b21")),
      false,
    );
    assert.equal(
      socials.some((item) => JSON.stringify(item).includes("mily-b21")),
      false,
    );

    for (const relative of [
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
      "src/data/contest.ts",
      "src/data/profile.ts",
      "src/data/highlights.ts",
      "src/data/socials.ts",
      "src/data/links.ts",
      "shared/radio-program.js",
      "public/sitemap.xml",
    ]) {
      const text = await readFile(path.join(root, relative), "utf8");
      assert.doesNotMatch(text, /mily-b21-01-seaside-circle-musical-special-thanks/);
      assert.doesNotMatch(text, /seasideCircleMusicalSpecialThanksVideo/);
      assert.equal(PERSONAL_STORY_LABEL.test(text), false, relative);
    }
  });
});
