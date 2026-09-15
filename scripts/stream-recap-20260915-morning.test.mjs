import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import sharp from "sharp";
import {
  RANKING_NOTE_WITHOUT_RANGE,
  streamRecap20260915Asa as recap,
  streamRecaps,
} from "../src/data/streamRecaps.ts";

test("September 15 morning stays ahead of the previous night's recap", () => {
  const index = streamRecaps.indexOf(recap);
  assert.ok(index >= 0);
  assert.equal(streamRecaps[index + 1].id, "2026-09-14-yoru-showroom");
  assert.equal(recap.broadcastLabel, "10:02頃〜 約45分");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.deepEqual(recap.ranking, [RANKING_NOTE_WITHOUT_RANGE]);
  assert.equal(recap.nextNote, "");
});

test("September 15 morning records only verified topics", () => {
  assert.equal(recap.songs, undefined);
  assert.match(recap.summary, /メイク/);
  assert.match(recap.summary, /花火/);
  assert.equal(recap.highlights.length, 8);
  assert.equal(recap.timeline.at(-1)?.timestamp, "0:44:50");
});

test("September 15 morning ships ten approved real-frame stills", async () => {
  assert.equal(recap.gallery.length, 10);
  assert.equal(recap.image, recap.gallery[4]);
  assert.equal(recap.galleryZip.label, "10枚まとめて保存");
  assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 10);
  for (const still of recap.gallery) {
    assert.match(still.src, /\/mily-b121-/);
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

test("September 15 morning keeps private source details out of public data", () => {
  const publicText = JSON.stringify(recap);
  assert.match(publicText, /971区間/);
  assert.match(publicText, /2703\.616秒/);
  assert.match(publicText, /実フレーム10枚/);
  assert.doesNotMatch(publicText, /(?:^|[\\/])Users[\\/]|(?:^|[\\/])recordings[\\/]|room_id|live_id|\.mkv/i);
});
