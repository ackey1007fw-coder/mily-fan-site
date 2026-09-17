import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createHash } from "node:crypto";
import { streamRecap20260917Asa as recap, streamRecaps, streamRecap20260916Yoru } from "../src/data/streamRecaps.ts";

test("9/17朝を一度だけ登録し、前日の夜より新しく配置する", () => {
  assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
  assert.ok(streamRecaps.indexOf(recap) < streamRecaps.indexOf(streamRecap20260916Yoru));
  assert.equal(recap.dateLabel, "2026.09.17（木）");
  assert.equal(recap.broadcastLabel, "8:32頃〜 約74分");
});

test("承認済みの実フレーム10枚と代表10番を共有する", async () => {
  assert.equal(recap.gallery?.length, 10);
  assert.equal(recap.image, recap.gallery[9]);
  assert.equal(recap.galleryZip?.src, "/media/live/mily-b126-morning-stills.zip");
  const hashes = await Promise.all(recap.gallery.map(async (image, index) => {
    assert.equal(image.src, `/media/live/mily-b126-${String(index + 1).padStart(2, "0")}-morning.jpg`);
    assert.equal(image.width, 640);
    assert.equal(image.height, 360);
    const data = await readFile(new URL(`../public${image.src}`, import.meta.url));
    return createHash("sha256").update(data).digest("hex");
  }));
  assert.equal(new Set(hashes).size, 10);
});

test("録画範囲と確認方法を明示し、音声未確認時は内容を補わない", () => {
  assert.match(recap.transcriptionNote, /4434\.404秒/);
  assert.match(recap.transcriptionNote, /録画先頭から/);
  assert.match(recap.transcriptionNote, /静止画は録画の実フレーム10枚/);
  if (recap.transcriptionNote.includes("音声内容は未確認です")) {
    assert.equal(recap.songs, undefined);
    assert.deepEqual(recap.goals, []);
    assert.deepEqual(recap.ranking, []);
    assert.equal(recap.nextNote, "");
    assert.doesNotMatch(recap.transcriptionNote, /音声をもとに整文|自動文字起こしをもとに整理/);
  }
});
