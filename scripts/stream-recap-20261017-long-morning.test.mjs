import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import sharp from "sharp";
import { streamRecap20261017Asa } from "../src/data/streamRecap20261017Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const recap = streamRecap20261017Asa;
const siteRoot = new URL("../", import.meta.url);

test("long October 17 morning is the latest unique LIVE STREAM card", () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps.filter((item) => item.id === recap.id).length, 1);
  assert.equal(recap.id, "2026-10-17-morning-showroom");
  assert.equal(recap.date, "2026-10-17");
  assert.equal(recap.dateLabel, "2026.10.17（土）");
  assert.equal(recap.broadcastLabel, "録画開始6:01頃〜 約218分");
  assert.ok(recap.theme.startsWith("朝"));
  assert.equal(recap.platformLabel, "SHOWROOM");
});

test("eleven photos come from this saved morning stream and preserve original frame dimensions", async () => {
  assert.equal(recap.gallery?.length, 11);
  assert.equal(recap.image, recap.gallery[2]);
  assert.equal(new Set(recap.gallery.map((item) => item.src)).size, 11);
  const clocks = [];
  for (const image of recap.gallery) {
    assert.match(image.src, /^\/media\/live\/mily-b230-\d{2}-20261017-long-[a-z0-9-]+\.jpg$/);
    assert.equal(image.downloadName, path.basename(image.src));
    assert.match(image.alt, /みりぃ/);
    assert.match(image.caption, /^[0-3]:[0-5]\d:[0-5]\d｜/);
    const [h, m, s] = image.caption.split("｜")[0].split(":").map(Number);
    const clock = h * 3600 + m * 60 + s;
    assert.ok(clock >= 0 && clock <= 13073, "still is within the 3h37m recording");
    clocks.push(clock);
    const file = new URL("../public" + image.src, import.meta.url);
    const raw = readFileSync(file);
    assert.ok(raw.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])));
    assert.ok(statSync(file).size < 220000);
    const meta = await sharp(raw).metadata();
    assert.deepEqual([meta.width, meta.height], [640, 360]);
    assert.equal(meta.format, "jpeg");
    assert.equal(meta.exif, undefined, "do not leak original image EXIF");
  }
  assert.deepEqual([...clocks].sort((a, b) => a - b), clocks);
});

test("recap uses verified themes, source-qualified timing and keeps missing UI counters separate from video", () => {
  assert.equal(recap.highlights.length, 8);
  assert.ok(recap.timeline.length >= 10 && recap.timeline.length <= 16);
  const allTimes = recap.timeline.map((p) => {
    const [h, m, s] = p.timestamp.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  });
  assert.deepEqual([...allTimes].sort((a, b) => a - b), allTimes);
  assert.ok(recap.highlights.some((p) => p.title.includes("写真")));
  assert.ok(recap.highlights.some((p) => p.title.includes("ラジオ")));
  assert.ok(recap.highlights.some((p) => p.title.includes("歌")));
  assert.ok(recap.highlights.some((p) => p.title.includes("感謝")));
  assert.ok(recap.highlights.some((p) =>
    p.relatedLinks?.some((link) => link.url === "/data-lab/reports/20261017-morning/")
  ));
  assert.ok(recap.transcriptionNote.includes("654"));
  assert.ok(recap.transcriptionNote.includes("約123分"));
  assert.ok(recap.transcriptionNote.includes("カウンターの欠測は録画の欠測と同義ではありません"));
  assert.ok(recap.transcriptionNote.includes("全編の手動聴取と逐語校正は行っていません"));
  assert.equal(recap.songs, undefined, "do not invent song titles from provisional ASR");
  assert.equal(recap.goals.length, 0);
  assert.equal(recap.ranking.length, 1);
  assert.match(recap.ranking[0], /個人名は掲載していません/);
});

test("LIVE STREAM article contains no raw viewer data, source media, ASR payload or local paths", () => {
  const published = JSON.stringify(recap);
  assert.doesNotMatch(published, /C:\\Users\\|private\.json|\.jsonl|\.partial\.mkv|\.mkv|\.wav|\.srt|\.vtt|\.mp4|viewer_id|user_id|@Mily_chan36/i);
  assert.doesNotMatch(published, /23564059|23562541|23559940/);
  assert.ok(!recap.gallery.some((item) => item.src.includes("news/")));
  assert.ok(recap.sourceLabel.includes("速報自動文字起こし"));
});
