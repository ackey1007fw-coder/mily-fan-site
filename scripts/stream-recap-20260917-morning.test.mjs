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

test("録画範囲全体の自動文字起こし確認を明示する", () => {
  assert.doesNotMatch(recap.summary, /前半50分/);
  assert.match(recap.transcriptionNote, /4434\.404秒/);
  assert.match(recap.transcriptionNote, /37チャンク・1221区間/);
  assert.match(recap.transcriptionNote, /録画範囲全体/);
  assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
  assert.match(recap.transcriptionNote, /静止画は録画の実フレーム10枚/);
  assert.equal(recap.highlights.length, 8);
  assert.ok(recap.highlights.some(({ timestamp }) => seconds(timestamp) >= 3000));
  assert.ok(recap.timeline.some(({ timestamp }) => seconds(timestamp) >= 3000));
  assert.ok(recap.timeline.every(({ timestamp }) => seconds(timestamp) <= 4434.404));
});

test("終盤のランキングと夜枠案内を確認済み情報として記録する", () => {
  assert.equal(recap.songs, undefined);
  assert.deepEqual(recap.goals, []);
  assert.deepEqual(recap.ranking, ["配信終了時に、13位から1位までランキングを読み上げました。個人名は掲載していません。"]);
  assert.match(recap.nextNote, /同日夜/);
  assert.match(recap.nextNote, /時間は未定/);
  assert.match(recap.highlights[1].quote, /^私自身が太陽だから$/);
  assert.ok(recap.highlights.some(({ title }) => title === "担当はトロンボーン"));
  assert.ok(recap.highlights.some(({ title }) => title === "ラジオとおしゃべり"));
  assert.doesNotMatch(JSON.stringify(recap), /drive\.google|docs\.google|room_id|live_id|\.mkv|\.flac|[\\/]Users[\\/]|https?:\/\//i);
});
