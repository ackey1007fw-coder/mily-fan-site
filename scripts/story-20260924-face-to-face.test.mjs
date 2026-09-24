import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import ffprobe from "ffprobe-static";
import sharp from "sharp";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { news } from "../src/data/news.ts";
import { faceToFaceClassStoryVideo } from "../src/data/faceToFaceClassStoryVideo.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const item = news.find(({ id }) => id === "2026-09-24-face-to-face-class-story");

describe("2026-09-24 face-to-face class Instagram Story", () => {
  it("publishes one source-bounded NEWS item and shares the video with Gallery", () => {
    assert.ok(item);
    assert.equal(item.date, "2026-09-24");
    assert.equal(item.source, undefined);
    assert.equal(item.sourceLabel, "Instagram Story");
    assert.equal(item.media, faceToFaceClassStoryVideo);
    assert.equal(galleryVideos[0], faceToFaceClassStoryVideo);
    assert.equal(galleryVideos.filter((video) => video === item.media).length, 1);
    assert.equal(item.activityIds, undefined);
    assert.match(item.body, /対面授業/);
  });

  it("ships the reviewed video-only MP4 and a real-frame vertical poster", async () => {
    const videoPath = path.join(root, "public", faceToFaceClassStoryVideo.src);
    const posterPath = path.join(root, "public", faceToFaceClassStoryVideo.poster);
    const [videoBytes, posterBytes] = await Promise.all([
      readFile(videoPath),
      readFile(posterPath),
    ]);
    assert.equal(videoBytes.length, 190853);
    assert.equal(
      createHash("sha256").update(videoBytes).digest("hex"),
      "d6f6433be6d2bda39bd349a73aba9852e0cac2e02a9393a78b063a44d3352167",
    );
    assert.equal(
      createHash("sha256").update(posterBytes).digest("hex"),
      "ceccc94218699552f4992350021e69f45bc70508a4ebacdfbc76b662d1692b58",
    );
    const probe = JSON.parse(
      execFileSync(ffprobe.path, ["-v", "error", "-show_streams", "-show_format", "-of", "json", videoPath]),
    );
    assert.equal(probe.streams.filter(({ codec_type }) => codec_type === "video").length, 1);
    assert.equal(probe.streams.filter(({ codec_type }) => codec_type === "audio").length, 0);
    assert.equal(probe.streams[0].codec_name, "h264");
    assert.equal(probe.streams[0].profile, "Constrained Baseline");
    assert.equal(probe.streams[0].width, 512);
    assert.equal(probe.streams[0].height, 910);
    assert.ok(videoBytes.indexOf("moov") > 0 && videoBytes.indexOf("moov") < videoBytes.indexOf("mdat"));
    const poster = await sharp(posterPath).metadata();
    assert.equal(poster.width, 512);
    assert.equal(poster.height, 910);
    assert.equal(poster.exif, undefined);
  });
});
