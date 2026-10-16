import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const read = relative => readFileSync(new URL(relative, root));
const manifest = JSON.parse(read("public/media/live/mily-b227-cute-shorts-20261015-16.json").toString("utf8"));

test("exactly two independently sourced 2026-10-15/16 short-form clips exist, not full SHOWROOM archives", () => {
  assert.equal(manifest.schema, 1);
  assert.deepEqual(manifest.clips.map(({ date, session, live_id }) => [date, session, live_id]), [
    ["2026-10-15", "night", 23558451],
    ["2026-10-16", "morning", 23559940],
  ]);
  assert.equal(new Set(manifest.clips.map(c => c.file)).size, 2);
  assert.match(manifest.scope, /not full archives/);
  assert.match(manifest.duplicate_policy, /no reupload on success/);
});

for (const entry of manifest.clips) {
  test(entry.id + " matches verified MP4 SHA-256, byte size, video/audio specs and public boundaries", () => {
    assert.ok(entry.file.startsWith("/media/live/mily-b227-"));
    assert.ok(entry.file.endsWith(".mp4"));
    const local = "public" + entry.file;
    const buffer = read(local);
    assert.equal(statSync(new URL(local, root)).size, entry.bytes);
    assert.equal(createHash("sha256").update(buffer).digest("hex"), entry.sha256);
    assert.ok(buffer.byteLength < 10 * 1024 * 1024, "short media only, never entire archive");
    assert.equal(entry.duration_seconds, 28);
    assert.deepEqual([entry.width, entry.height, entry.fps], [720, 1280, 30]);
    assert.equal(entry.source_audio_only, true);
    assert.equal(entry.face_retouched, false);
    assert.equal(entry.added_music, false);
    assert.match(entry.disclaimer, /非公式/);
    assert.match(entry.source, /saved 2026-10-/);
    assert.ok(entry.source_recording_offset_seconds > 0);
    assert.match(entry.recap, /^\/activities\/live\/#recap-2026-10-1[56]-/);
    const probed = JSON.parse(execFileSync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration:stream=codec_type,codec_name,width,height,r_frame_rate",
      "-of", "json",
      fileURLToPath(new URL(local, root)),
    ], { encoding: "utf8" }));
    const video = probed.streams.find(s => s.codec_type === "video");
    const audio = probed.streams.find(s => s.codec_type === "audio");
    assert.ok(video && audio);
    assert.equal(video.codec_name, "h264");
    assert.equal(audio.codec_name, "aac");
    assert.deepEqual([video.width, video.height, video.r_frame_rate], [720, 1280, "30/1"]);
    assert.ok(Math.abs(Number(probed.format.duration) - 28) < .05);
  });
}

test("manifest does not expose private recording paths, raw viewer records or usernames", () => {
  const data = JSON.stringify(manifest);
  for (const forbidden of [/C:\\/i, /Users\\/i, /@gmail/i, /viewer[_-]?id/i, /comment[_-]?text/i, /chatgpt\.site/i, /showroom-live\.com\/api/i]) {
    assert.doesNotMatch(data, forbidden);
  }
});
