import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { open, readFile, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import {
  CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_CTA_LABEL,
  CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_PROFILE_URL,
  campusGirlsFinalStageDetailsStoryImage,
  campusGirlsFinalStageMovieRecordStoryVideo,
  campusGirlsFinalStagePatonRecordStoryVideo,
  campusGirlsFinalStageRankingStoryVideos,
  campusGirlsFinalStageStorySeries,
} from "../src/data/campusGirlsFinalStageStorySeries.ts";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentPath = path.join(root, "src/components/PatonVoteGuide.tsx");

const expectedAssets = new Map([
  [
    campusGirlsFinalStageDetailsStoryImage.src,
    {
      bytes: 293_064,
      sha256: "0f909feb705b49d1f9122ff4e9009307a95f330615f87b354292a293341f2508",
    },
  ],
  [
    campusGirlsFinalStagePatonRecordStoryVideo.src,
    {
      bytes: 325_698,
      sha256: "794852a84298d62b8d998a9340aa9969f2ea0c799a1076676c99a2b2d7d6626a",
    },
  ],
  [
    campusGirlsFinalStagePatonRecordStoryVideo.poster,
    {
      bytes: 75_714,
      sha256: "ddab5d8e2299f14824a0e5316b40674d3d0a91cb64c4bb80178c7f2116918652",
    },
  ],
  [
    campusGirlsFinalStageMovieRecordStoryVideo.src,
    {
      bytes: 185_326,
      sha256: "850eda64913e36442013d42bcabb2d5db909f54988a466a64100d076ae6fdbc4",
    },
  ],
  [
    campusGirlsFinalStageMovieRecordStoryVideo.poster,
    {
      bytes: 67_132,
      sha256: "17bf991a39e5ee19f38ad54f8a8e230b487d3baa601b51e24725edf0de08d56b",
    },
  ],
]);

function publicAssetPath(src) {
  return path.join(root, "public", src.slice(1));
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
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

async function hasFaststart(file) {
  const handle = await open(file, "r");
  try {
    const head = Buffer.alloc(64 * 1024);
    const { bytesRead } = await handle.read(head, 0, head.length, 0);
    const window = head.subarray(0, bytesRead);
    const moov = window.indexOf("moov", 0, "latin1");
    const mdat = window.indexOf("mdat", 0, "latin1");
    return moov >= 0 && mdat >= 0 && moov < mdat;
  } finally {
    await handle.close();
  }
}

async function horizontalAdjacentDifference(file, region) {
  const { data, info } = await sharp(file)
    .extract(region)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let difference = 0;
  let samples = 0;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 1; x < info.width; x += 1) {
      for (let channel = 0; channel < 3; channel += 1) {
        const offset = (y * info.width + x) * 3 + channel;
        difference += Math.abs(data[offset] - data[offset - 3]);
        samples += 1;
      }
    }
  }

  return difference / samples;
}

describe("2026-08-28 CAMPUS GIRLS Final STAGE Story series — contract", () => {
  it("keeps exactly the three approved additions in the requested order", () => {
    assert.deepEqual(
      campusGirlsFinalStageStorySeries.map(({ id }) => id),
      [
        "mily-b40-01-campus-girls-final-stage-details",
        "mily-b40-02-paton-vote-day3-second-record",
        "mily-b40-03-movie-exam-first-overall-seventh-record",
      ],
    );
    assert.equal(campusGirlsFinalStageRankingStoryVideos.length, 2);

    for (const item of campusGirlsFinalStageStorySeries) {
      assert.equal(item.provenance, "owner-provided");
      assert.equal(item.sourceLabel, "Instagram Story");
      assert.equal(item.sourceDate, "2026-08-28");
      assert.equal(item.published, true);
      assert.equal("sourceUrl" in item, false);
      assert.match(item.src, /^\/media\/news\//);
    }

    for (const item of campusGirlsFinalStageRankingStoryVideos) {
      assert.equal(item.recordLabel, "投稿時点の記録");
      assert.match(item.alt, /モザイク処理済み/);
    }

    assert.equal(
      CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_PROFILE_URL,
      "https://www.instagram.com/mily_chan36",
    );
    assert.equal(
      CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_CTA_LABEL,
      "Instagramプロフィールを見る",
    );
  });

  it("renders the series once in the shared guide with safe video behavior", async () => {
    const source = await readFile(componentPath, "utf8");

    assert.match(source, /CAMPUS GIRLS 2027 予選Final STAGEのStory/);
    assert.match(source, /現在の順位を示すものではありません/);
    assert.match(source, /campusGirlsFinalStageDetailsStoryImage/);
    assert.match(source, /campusGirlsFinalStageRankingStoryVideos\.map/);
    assert.match(source, /item\.recordLabel/);
    assert.match(source, /patonVoteDay3StoryVideo/);
    assert.match(source, /CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_PROFILE_URL/);
    assert.match(source, /CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_CTA_LABEL/);
    assert.match(source, /controls/);
    assert.match(source, /playsInline/);
    assert.match(source, /preload="none"/);
    assert.doesNotMatch(source, /autoPlay|autoplay|\bloop\b/);

    const instagram = source.indexOf(
      "CAMPUS_GIRLS_FINAL_STAGE_INSTAGRAM_PROFILE_URL",
    );
    const paton = source.indexOf("href={campusGirlsPatonVoteLink.url}");
    assert.ok(instagram >= 0 && paton > instagram);
  });

  it("does not duplicate b40 into NEWS, Gallery, Story, schedules, or Portal Feed", async () => {
    const forbiddenFiles = [
      "src/data/news.ts",
      "src/data/galleryVideos.ts",
      "src/data/media.ts",
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/events.ts",
      "src/data/streamSchedule.ts",
      "src/lib/activityMedia.ts",
      "src/data/portalFeed.ts",
    ];

    for (const relative of forbiddenFiles) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.doesNotMatch(source, /mily-b40|campusGirlsFinalStageStorySeries/, relative);
    }
  });
});

describe("2026-08-28 CAMPUS GIRLS Final STAGE Story series — public media", () => {
  it("publishes exactly the reviewed image, videos, and posters", async () => {
    for (const [src, expected] of expectedAssets) {
      const file = publicAssetPath(src);
      assert.equal((await stat(file)).size, expected.bytes, src);
      assert.equal(await sha256(file), expected.sha256, src);
    }
  });

  it("strips image metadata without cropping the Story image", async () => {
    const details = await sharp(
      publicAssetPath(campusGirlsFinalStageDetailsStoryImage.src),
    ).metadata();

    assert.equal(details.width, 1080);
    assert.equal(details.height, 1919);
    assert.equal(details.exif, undefined);
    assert.equal(details.iptc, undefined);
    assert.equal(details.xmp, undefined);
    assert.equal(details.icc, undefined);

    for (const item of campusGirlsFinalStageRankingStoryVideos) {
      const poster = await sharp(publicAssetPath(item.poster)).metadata();
      assert.equal(poster.width, 720);
      assert.equal(poster.height, 1280);
      assert.equal(poster.exif, undefined);
      assert.equal(poster.iptc, undefined);
      assert.equal(poster.xmp, undefined);
      assert.equal(poster.icc, undefined);
    }
  });

  it("ships silent H.264 vertical faststart MP4s without source metadata", async () => {
    const expected = [
      [campusGirlsFinalStagePatonRecordStoryVideo, 20, "600"],
      [campusGirlsFinalStageMovieRecordStoryVideo, 5, "150"],
    ];

    for (const [item, duration, frames] of expected) {
      const file = publicAssetPath(item.src);
      const info = await probe(file);
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
      assert.equal(video.nb_frames, frames);
      assert.ok(Math.abs(Number(info.format.duration) - duration) < 0.001);
      assert.equal(audio, undefined);
      assert.equal(await hasFaststart(file), true);
      assert.equal("creation_time" in (info.format.tags ?? {}), false);
      assert.deepEqual(info.chapters, []);

      for (const stream of info.streams) {
        assert.equal("creation_time" in (stream.tags ?? {}), false);
        assert.notEqual(stream.tags?.handler_name, "Core Media Video");
        assert.notEqual(stream.tags?.handler_name, "Core Media Audio");
      }
    }
  });

  it("keeps the other contestants pixelated while leaving Mily's rows readable", async () => {
    const patonPoster = publicAssetPath(
      campusGirlsFinalStagePatonRecordStoryVideo.poster,
    );
    const moviePoster = publicAssetPath(
      campusGirlsFinalStageMovieRecordStoryVideo.poster,
    );

    const patonMasked = await horizontalAdjacentDifference(patonPoster, {
      left: 210,
      top: 320,
      width: 280,
      height: 260,
    });
    const patonMily = await horizontalAdjacentDifference(patonPoster, {
      left: 50,
      top: 680,
      width: 260,
      height: 260,
    });
    const movieMasked = await horizontalAdjacentDifference(moviePoster, {
      left: 220,
      top: 760,
      width: 280,
      height: 300,
    });
    const movieMily = await horizontalAdjacentDifference(moviePoster, {
      left: 220,
      top: 650,
      width: 280,
      height: 60,
    });

    assert.ok(patonMasked < 4);
    assert.ok(patonMily > 6);
    assert.ok(movieMasked < 2);
    assert.ok(movieMily > 6);
  });
});
