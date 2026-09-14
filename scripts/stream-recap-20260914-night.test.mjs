import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import sharp from "sharp";
import {
  buildRankingNote,
  streamRecap20260914Day,
  streamRecap20260914Yoru as recap,
  streamRecaps,
} from "../src/data/streamRecaps.ts";

test("September 14 night is ahead of the same-day daytime recap", () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps[1], streamRecap20260914Day);
  assert.equal(recap.broadcastLabel, "20:31頃〜 約122分");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.deepEqual(recap.ranking, [buildRankingNote(13, 1, "during")]);
});

test("September 14 night records the two verified songs and next-stream note", () => {
  assert.deepEqual(recap.songs.map(({ title }) => title), ["ハナミズキ", "高嶺の花子さん"]);
  assert.equal(recap.songs[0].youtubeUrl, "https://www.youtube.com/watch?v=Lv9pOboKtjg");
  assert.equal(recap.songs[1].youtubeUrl, "https://www.youtube.com/watch?v=SII-S-zCg-c");
  assert.ok(recap.songs.every(({ clip }) => clip === undefined));
  assert.match(recap.nextNote, /朝と夜/);
  assert.match(recap.nextNote, /ファンルーム/);
});
test("September 14 night ships ten approved real-frame stills", async () => {
  assert.equal(recap.gallery.length, 10);
  assert.equal(recap.image, recap.gallery[0]);
  assert.equal(recap.galleryZip.label, "10枚まとめて保存");
  assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 10);
  for (const still of recap.gallery) {
    assert.match(still.src, /\/mily-b119-/);
    const file = new URL(`../public${still.src}`, import.meta.url);
    const meta = await sharp(await readFile(file)).metadata();
    assert.equal(meta.width, 640);
    assert.equal(meta.height, 360);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.xmp, undefined);
    assert.equal(meta.iptc, undefined);
    assert.ok(still.alt.includes("みりぃ"));
    assert.ok(still.caption && still.downloadName);
  }
  const zip = await readFile(new URL(`../public${recap.galleryZip.src}`, import.meta.url));
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  for (const still of recap.gallery) assert.ok(zip.includes(Buffer.from(still.src.split("/").pop())));
});

test("September 14 night keeps private source details out of public data", () => {
  const publicText = JSON.stringify(recap);
  assert.match(publicText, /2,132区間/);
  assert.match(publicText, /7313\.203秒/);
  assert.match(publicText, /実フレーム10枚/);
  assert.doesNotMatch(publicText, /(?:^|[\\/])Users[\\/]|(?:^|[\\/])recordings[\\/]|room_id|live_id|\.mkv/i);
});