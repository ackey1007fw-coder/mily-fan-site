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
import { galleryVideos } from "../src/data/galleryVideos.ts";
import {
  radioStoryVideos,
  seasideCircleLiveBroadcastStoryVideo,
  seasideCircleMessageFormStoryVideo,
} from "../src/data/radioStoryB42.ts";
import { seasideCircleMessageFormLink } from "../src/data/links.ts";
import { isFaststart } from "./build-drive-gallery.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const radioDirectory = path.join(root, "public/media/radio");

const fixtures = [
  {
    item: seasideCircleMessageFormStoryVideo,
    original: "mily-b42-01-seaside-circle-message-form-story.mp4",
    publicVideo: "mily-b42-01-seaside-circle-message-form-story.mp4",
    poster: "mily-b42-01-seaside-circle-message-form-story-poster.jpg",
    originalBytes: 7_802_686,
    originalSha256:
      "4638b96f92be9681e6a6460285cf13ef20ee0110e64ccec9f50abef884ddd9fa",
    publicBytes: 603_497,
    publicSha256:
      "0a2a6435060523a0f9a3e71d6fe68fcf16ad1939994465979dde4cdf98ef7d69",
    posterBytes: 116_909,
    posterSha256:
      "f17b0d6c3504e05890f6d001f0dd02b4b099b540b43b51b46afac8a1b6cfe30f",
  },
  {
    item: seasideCircleLiveBroadcastStoryVideo,
    original: "mily-b42-02-seaside-circle-live-broadcast-story.mp4",
    publicVideo: "mily-b42-02-seaside-circle-live-broadcast-story.mp4",
    poster: "mily-b42-02-seaside-circle-live-broadcast-story-poster.jpg",
    originalBytes: 7_617_268,
    originalSha256:
      "52c60494708678dca0bf36b9e65c22f28d8251a885f01e72566fb9a796da8552",
    publicBytes: 595_846,
    publicSha256:
      "1e2a37dc3ba83c51d6753af64e4459bb5ea42e96f60958f1e47457c7b0e7bb5b",
    posterBytes: 123_293,
    posterSha256:
      "17ba92876d6ad790fd598f0ebf728feaface90f0b6aa98e0a3c6482dbd08bfab",
  },
];

async function ffprobeExe() {
  const mod = await import("ffprobe-static");
  const resolved = mod.default ?? mod;
  return resolved.path ?? resolved;
}

async function probe(file) {
  const { stdout } = await run(await ffprobeExe(), [
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

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

describe("2026-08-30 湘南シーサイドサークル Story動画", () => {
  it("publishes both videos only in the Radio page collection", () => {
    assert.deepEqual(radioStoryVideos, fixtures.map(({ item }) => item));

    for (const { item } of fixtures) {
      assert.equal(item.published, true);
      assert.equal(item.sourceDate, "2026-08-30");
      assert.equal(item.sourceLabel, "湘南シーサイドサークル Instagram Story");
      assert.deepEqual(item.activityIds, ["radio"]);
    }

    assert.equal(
      galleryVideos.some(({ id }) => id.startsWith("mily-b42-")),
      false,
    );
  });

  it("reuses the canonical public message form below Radio media", async () => {
    const page = await readFile(path.join(root, "src/ActivitiesPage.tsx"), "utf8");
    assert.match(page, /activityId === "radio"/);
    assert.match(page, /radioStoryVideos\.map/);
    assert.match(page, /動画で紹介しているメッセージフォームはこちら/);
    assert.match(page, /href=\{seasideCircleMessageFormLink\.url\}/);
    assert.match(page, /\{seasideCircleMessageFormLink\.label\}/);
    assert.match(seasideCircleMessageFormLink.url, /^https:\/\/docs\.google\.com\/forms\/d\/e\//);
  });

  it("publishes exactly two sanitized MP4s and two real-frame posters", async () => {
    const assets = (await readdir(radioDirectory))
      .filter((file) => file.includes("mily-b42-"))
      .sort();
    assert.deepEqual(
      assets,
      fixtures.flatMap(({ poster, publicVideo }) => [poster, publicVideo]).sort(),
    );

    for (const fixture of fixtures) {
      const mp4 = path.join(radioDirectory, fixture.publicVideo);
      const poster = path.join(radioDirectory, fixture.poster);
      assert.equal((await stat(mp4)).size, fixture.publicBytes);
      assert.equal(await sha256(mp4), fixture.publicSha256);
      assert.equal((await stat(poster)).size, fixture.posterBytes);
      assert.equal(await sha256(poster), fixture.posterSha256);

      const posterInfo = await sharp(poster).metadata();
      assert.equal(posterInfo.width, 512);
      assert.equal(posterInfo.height, 910);
      assert.equal(posterInfo.exif, undefined);
      assert.equal(posterInfo.iptc, undefined);
      assert.equal(posterInfo.xmp, undefined);
      assert.equal(posterInfo.icc, undefined);
    }
  });

  it("keeps geometry and frames while removing unconfirmed audio and metadata", async () => {
    for (const fixture of fixtures) {
      const mp4 = path.join(radioDirectory, fixture.publicVideo);
      const info = await probe(mp4);
      const video = info.streams.find((stream) => stream.codec_type === "video");
      const audio = info.streams.find((stream) => stream.codec_type === "audio");

      assert.ok(video);
      assert.equal(video.codec_name, "h264");
      assert.match(video.profile, /Baseline/);
      assert.equal(video.has_b_frames, 0);
      assert.equal(video.pix_fmt, "yuv420p");
      assert.equal(video.width, 512);
      assert.equal(video.height, 910);
      assert.equal(video.avg_frame_rate, "30/1");
      assert.equal(video.nb_frames, "571");
      assert.ok(Math.abs(Number(info.format.duration) - 19.033) < 0.001);
      assert.equal(audio, undefined);
      assert.equal(await isFaststart(mp4), true);
      assert.deepEqual(info.chapters, []);
      assert.equal("creation_time" in (info.format.tags ?? {}), false);
      assert.notEqual(video.tags?.handler_name, "Core Media Video");

      const original = path.join(root, "media/original", fixture.original);
      if (existsSync(original)) {
        const source = await probe(original);
        const sourceVideo = source.streams.find(
          (stream) => stream.codec_type === "video",
        );
        const sourceAudio = source.streams.find(
          (stream) => stream.codec_type === "audio",
        );
        assert.equal((await stat(original)).size, fixture.originalBytes);
        assert.equal(await sha256(original), fixture.originalSha256);
        assert.equal(sourceVideo.width, video.width);
        assert.equal(sourceVideo.height, video.height);
        assert.equal(sourceVideo.avg_frame_rate, video.avg_frame_rate);
        assert.equal(sourceVideo.nb_frames, video.nb_frames);
        assert.equal(sourceAudio.profile, "HE-AAC");
        assert.equal(sourceAudio.sample_rate, "44100");
        assert.equal(sourceAudio.channels, 2);
      }
    }
  });
});
