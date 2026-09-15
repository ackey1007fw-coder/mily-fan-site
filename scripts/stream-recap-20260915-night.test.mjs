import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import sharp from "sharp";
import { streamRecap20260915Yoru as recap, streamRecaps } from "../src/data/streamRecaps.ts";

test("September 15 night precedes its morning recap and discloses the recorded range", () => {
  const index = streamRecaps.indexOf(recap);
  assert.ok(index >= 0);
  assert.equal(streamRecaps[index + 1].id, "2026-09-15-asa-showroom");
  assert.equal(recap.broadcastLabel, "22:01頃〜 約97分");
  assert.match(recap.transcriptionNote, /5804\.103秒/);
  assert.match(recap.transcriptionNote, /全編.*保証/);
  assert.doesNotMatch(JSON.stringify(recap), /drive\.google|room_id|live_id|\.mkv|[\\/]Users[\\/]/i);
});

test("September 15 night offers ten real frames and matching save links", async () => {
  assert.equal(recap.gallery.length, 10);
  assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 10);
  assert.equal(recap.image, recap.gallery[5]);
  assert.equal(recap.galleryZip.label, "10枚まとめて保存");
  const zip = await readFile(new URL(`../public${recap.galleryZip.src}`, import.meta.url));
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  for (const still of recap.gallery) {
    assert.match(still.src, /\/mily-b124-/);
    assert.ok(still.downloadName && still.caption && still.alt.includes("みりぃ"));
    const bytes = await readFile(new URL(`../public${still.src}`, import.meta.url));
    const meta = await sharp(bytes).metadata();
    const { info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.width, still.width);
    assert.equal(info.height, still.height);
    assert.deepEqual([info.width, info.height], [640, 360]);
    for (const key of ["exif", "iptc", "xmp"]) assert.equal(meta[key], undefined);
    assert.ok(zip.includes(Buffer.from(still.src.split("/").pop())));
  }
});
