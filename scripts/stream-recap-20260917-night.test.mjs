import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { streamRecap20260917Yoru as recap, streamRecap20260917Asa, streamRecaps } from "../src/data/streamRecaps.ts";
const seconds = value => value.split(":").reduce((n, part) => n * 60 + Number(part), 0);

test("9/17夜は同日の朝より前へ一度だけ登録する", () => {
  const index = streamRecaps.indexOf(recap);
  assert.equal(streamRecaps.filter(item => item.id === "2026-09-17-yoru-showroom").length, 1);
  assert.ok(index >= 0);
  assert.equal(streamRecaps[index + 1], streamRecap20260917Asa);
  assert.equal(recap.dateLabel, "2026.09.17（木）");
  assert.equal(recap.broadcastLabel, "22:10頃〜 約41分");
});

test("指定されたラジオ配信画像1枚のみを掲載し水増ししない", async () => {
  assert.equal(recap.image?.src, "/media/live/mily-b129-01-night-radio.jpg");
  assert.equal(recap.image?.width, 640);
  assert.equal(recap.image?.height, 360);
  assert.match(recap.image?.caption ?? "", /ラジオ配信.*表示/);
  assert.equal(recap.gallery, undefined);
  assert.equal(recap.galleryZip, undefined);
  const bytes = await readFile(new URL(`../public${recap.image.src}`, import.meta.url));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "b227e0c20a20c3fac6e3656e88a0fb2e80a1b89c3ebc9640243a7dbf4249ca6a");
});

test("保存録画全体の確認と自動文字起こしの限界を区別する", () => {
  assert.match(recap.sourceLabel, /2026年9月17日.*ラジオ配信/);
  assert.match(recap.transcriptionNote, /2480\.991秒/);
  assert.match(recap.transcriptionNote, /録画範囲全体/);
  assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
  assert.match(recap.transcriptionNote, /完全収録.*保証しません/);
  assert.ok(recap.highlights.every(item => seconds(item.timestamp) <= 2480.991));
  assert.ok(recap.timeline.every(item => seconds(item.timestamp) <= 2480.991));
  assert.ok(recap.timeline.some(item => seconds(item.timestamp) >= 2400));
});

test("今回の配信メモに非公開情報や制作途中の表示を混ぜない", () => {
  assert.doesNotMatch(JSON.stringify(recap), /drive\.google|docs\.google|room_id|live_id|\.mkv|\.flac|[\\/]Users[\\/]|https?:\/\/|承認待ち|準備中|前半のみ/i);
  assert.doesNotMatch(JSON.stringify(recap), /週1回、3時間|存在を大切に思って|うれしそうに|コメントとの会話を楽しみ|笑いながら/i);
  assert.ok(recap.verifiedAt >= recap.date);
});
