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
const approvedMedia = JSON.parse(await readFile(new URL('./stream-media-20261020-21.json', import.meta.url), 'utf8')).groups;
const night20261022 = JSON.parse(await readFile(new URL('./mily-night-20261022-media.json', import.meta.url), 'utf8'));
const seconds = stamp => stamp.split(':').reduce((total, part) => total * 60 + Number(part), 0);
const clips = streamRecaps.flatMap((recap) => recap.highlights
  .filter((highlight) => highlight.clip)
  .map((highlight) => ({ recap, highlight, clip: highlight.clip })));

test("talk highlights use short, playable clips with audio and real-frame posters", async () => {
  for (const { recap, highlight, clip } of clips) {
    const approved = approvedMedia.find(group => group.recapId === recap.id);
    if (recap.id === night20261022.recapId) {
      const media = night20261022.files.find(file => file.role === 'talk' && clip.src === '/media/live/' + file.name);
      assert.ok(media, clip.src);
      const poster = night20261022.files.find(file => file.role === 'poster' && clip.poster === '/media/live/' + file.name);
      assert.ok(poster, clip.poster);
      assert.equal(recap.date, '2026-10-22');
      assert.equal(seconds(clip.sourceTimestamp), Math.floor(media.recordingSeconds));
      assert.equal(clip.durationSeconds, media.durationSeconds);
      assert.equal(poster.recordingSeconds, media.recordingSeconds);
      // Each timestamp marks the discussed moment inside its excerpt, including its brief lead-in.
      assert.ok(seconds(highlight.timestamp) >= Math.floor(media.recordingSeconds));
      assert.ok(seconds(highlight.timestamp) <= media.recordingSeconds + media.durationSeconds);
    } else if (approved) {
      const media = approved.files.find(file => file.role === 'talk');
      const poster = approved.files.find(file => file.role === 'talk-cover');
      assert.equal(recap.date, approved.date);
      assert.equal(clip.src, '/media/live/' + media.name);
      assert.equal(clip.poster, '/media/live/' + poster.name);
      assert.equal(seconds(clip.sourceTimestamp), Math.floor(media.sourceSeconds));
      // A highlight can start just before its actual excerpt; source time stays tied to the manifest.
      assert.ok(seconds(clip.sourceTimestamp) >= seconds(highlight.timestamp));
      assert.ok(seconds(clip.sourceTimestamp) - seconds(highlight.timestamp) <= 1);
    } else {
      assert.match(clip.src, /^\/media\/live-clips\/mily-b\d+-.*\.mp4$/);
      assert.equal(clip.sourceTimestamp, highlight.timestamp);
    }
    assert.match(clip.sourceTimestamp, /^\d:[0-5]\d:[0-5]\d$/);
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
