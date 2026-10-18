import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { test } from "node:test";
import sharp from "sharp";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = streamRecaps.find(item => item.id === "2026-10-12-final-night-showroom");
const targetIndex = streamRecaps.findIndex(item => item.id === "2026-10-12-final-night-showroom");

test("10/12 final night and its older morning report survive newer recaps", () => {
  assert.ok(target);
  assert.ok(targetIndex >= 0);
  assert.equal(streamRecaps[targetIndex], target);
  assert.equal(streamRecaps[targetIndex + 1].id, "2026-10-12-asa-showroom");
  assert.equal(target.date, "2026-10-12");
  assert.match(target.theme, /^夜/);
  assert.match(target.broadcastLabel, /^録画開始21:00頃〜 約138分$/);
  assert.ok(target.gallery.length === 12);
  assert.equal(target.image, target.gallery[9]);
  assert.equal(target.highlights.length, 8);
  assert.equal(target.timeline.length, 16);
});

test("recap preserves the final night cutoff, ranking timing and honest source attribution", () => {
  assert.match(target.summary, /四次審査の最終夜/);
  assert.match(target.summary, /赤ずきん姿/);
  assert.match(target.summary, /審査終了後も配信/);
  assert.match(target.highlights[4].body, /審査終了が近づく中/);
  assert.match(target.ranking[0], /^配信中にランキングを読み上げました/);
  assert.match(target.transcriptionNote, /全編の手動実聴・逐語校正は未実施/);
  assert.match(target.transcriptionNote, /約138分は保存録画の長さ/);
  assert.match(target.transcriptionNote, /SHOWROOM審査は21:59まで/);
  assert.doesNotMatch(JSON.stringify(target), /(?:\.mkv|\.jsonl|drive\.google\.com|chatgpt\.site|@gmail\.com|https?:\/\/[^"\s]+private)/i);
  assert.deepEqual(target.goals, []);
  assert.equal(target.songs?.length, 5, 'The owner-approved official song links should be present');
  assert.ok(target.highlights.every(item => !item.quote));
});

test("all 12 stills are actual 640x360 JPEGs, free of EXIF and separately downloadable", async () => {
  const gallery = target.gallery;
  assert.equal(new Set(gallery.map(item => item.src)).size, 12);
  for (const item of gallery) {
    assert.match(item.alt, /みりぃ/);
    assert.match(item.src, /^\/media\/live\/mily-b218-\d{2}-20261012-final-night-still\.jpg$/);
    assert.match(item.caption, /^\d:\d\d:\d\d｜/);
    assert.equal(item.downloadName, path.basename(item.src));
    assert.equal(item.width, 640);
    assert.equal(item.height, 360);
    const p = path.join(root, "public", item.src.slice(1));
    assert.ok(existsSync(p), `missing ${p}`);
    const m = await sharp(p).metadata();
    assert.equal(m.format, "jpeg");
    assert.equal(m.width, 640);
    assert.equal(m.height, 360);
    assert.ok(!m.exif, `EXIF must not be present: ${item.downloadName}`);
  }
  const zip = path.join(root, "public/media/live", path.basename(target.galleryZip.src));
  assert.ok(existsSync(zip));
  assert.equal(target.galleryZip.filename, "mily_20261012_final_night_screenshots_12.zip");
  const zipBytes=readFileSync(zip);
  assert.equal(zipBytes.length,237357);
  assert.equal(createHash("sha256").update(zipBytes).digest("hex"),
    "b89ad04f5bc21611cff059999bd44f0a01b173a559a9e3edf8539da747b25222");
});
