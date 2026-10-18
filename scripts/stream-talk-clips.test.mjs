import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import sharp from "sharp";
import ffprobe from "ffprobe-static";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const run = promisify(execFile);
const clips = streamRecaps.flatMap((recap) => recap.highlights
  .filter((highlight) => highlight.clip)
  .map((highlight) => ({ recap, highlight, clip: highlight.clip })));

test("talk highlights use short, playable clips with audio and real-frame posters", async () => {
  for (const { highlight, clip } of clips) {
    assert.match(clip.src, /^\/media\/live-clips\/mily-b\d+-.*\.mp4$/);
    assert.match(clip.sourceTimestamp, /^\d:[0-5]\d:[0-5]\d$/);
    assert.equal(clip.sourceTimestamp, highlight.timestamp);
    assert.ok(clip.durationSeconds > 0 && clip.durationSeconds <= 90);
    const videoUrl = new URL(`../public${clip.src}`, import.meta.url);
    const { stdout } = await run(ffprobe.path, [
      "-v", "error", "-show_format", "-show_streams", "-of", "json", fileURLToPath(videoUrl),
    ]);
    const media = JSON.parse(stdout);
    const video = media.streams.find((stream) => stream.codec_type === "video");
    const audio = media.streams.find((stream) => stream.codec_type === "audio");
    assert.equal(video?.codec_name, "h264");
    assert.equal(audio?.codec_name, "aac");
    assert.equal(video.width, clip.width);
    assert.equal(video.height, clip.height);
    assert.ok(Math.abs(Number(media.format.duration) - clip.durationSeconds) < 0.25);
    const bytes = await readFile(videoUrl);
    assert.ok(bytes.indexOf(Buffer.from("moov")) < bytes.indexOf(Buffer.from("mdat")));
    const poster = await sharp(await readFile(new URL(`../public${clip.poster}`, import.meta.url))).metadata();
    assert.equal(poster.width, clip.width);
    assert.equal(poster.height, clip.height);
    assert.equal(poster.exif, undefined);
    assert.equal(poster.xmp, undefined);
    assert.equal(poster.iptc, undefined);
  }
});
