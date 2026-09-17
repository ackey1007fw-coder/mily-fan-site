import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createHash } from "node:crypto";
import { streamRecap20260917Asa as recap, streamRecaps, streamRecap20260916Yoru } from "../src/data/streamRecaps.ts";

const seconds = value => value.split(":").reduce((total, part) => total * 60 + Number(part), 0);

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

test("録画尺と発言を確認した前半50分を区別する", () => {
  assert.match(recap.summary, /確認できた前半50分/);
  assert.match(recap.transcriptionNote, /4434\.404秒/);
  assert.match(recap.transcriptionNote, /録画先頭から0:50:00まで/);
  assert.match(recap.transcriptionNote, /794区間/);
  assert.match(recap.transcriptionNote, /50分以降は静止画の目視確認のみ/);
  assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
  assert.match(recap.transcriptionNote, /静止画は録画の実フレーム10枚/);
  assert.equal(recap.highlights.length, 8);
  assert.ok(recap.highlights.every(({ timestamp }) => seconds(timestamp) < 3000));
  for (const item of recap.timeline) {
    assert.ok(seconds(item.timestamp) <= 4434.404);
    if (seconds(item.timestamp) >= 3000) assert.match(item.label, /静止画確認/);
  }
});

test("未確認の終盤情報を補わず、私的情報を公開しない", () => {
  assert.equal(recap.songs, undefined);
  assert.deepEqual(recap.goals, []);
  assert.deepEqual(recap.ranking, []);
  assert.equal(recap.nextNote, "");
  assert.match(recap.highlights[1].quote, /^私自身が太陽だから$/);
  assert.match(recap.highlights[6].body, /四次審査/);
  assert.match(recap.highlights[7].body, /吹奏楽部のキャプテン/);
  assert.doesNotMatch(JSON.stringify(recap), /drive\.google|docs\.google|room_id|live_id|\.mkv|\.flac|[\\/]Users[\\/]|https?:\/\//i);
});
