import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import sharp from "sharp";
import {
  buildRankingNote,
  streamRecap20260914Day as recap,
  streamRecaps,
} from "../src/data/streamRecaps.ts";

test("September 14 day is the newest recap with the captured duration", () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(recap.broadcastLabel, "14:32頃〜 約137分");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.deepEqual(recap.ranking, [buildRankingNote(13, 1, "during")]);
  assert.equal(recap.songs.length, 2);
  assert.deepEqual(recap.songs.map(({ title }) => title), ["てぃんさぐぬ花", "島人ぬ宝"]);
  assert.doesNotMatch(recap.songs.map(({ title }) => title).join(" "), /19の春/);
  assert.equal(recap.songs[0].youtubeUrl, "https://www.youtube.com/watch?v=IJ6B4t-hxxY");
  assert.equal(recap.songs[1].youtubeUrl, "https://www.youtube.com/watch?v=hiK0oehes2c");
});

test("September 14 day records verified contest, avatar, karaoke, and next-stream notes", () => {
  const publicText = JSON.stringify(recap);
  assert.match(publicText, /四次審査/);
  assert.match(publicText, /アバター権/);
  assert.match(publicText, /てぃんさぐぬ花/);
  assert.match(publicText, /島人ぬ宝/);
  assert.match(recap.nextNote, /20:00/);
  assert.match(recap.nextNote, /19の春/);
  assert.doesNotMatch(publicText, /(?:^|[\\/])Users[\\/]|(?:^|[\\/])recordings[\\/]|room_id|live_id|\.mkv/i);
});

test("September 14 day ships ten approved real-frame stills including karaoke frames", async () => {
  assert.equal(recap.gallery.length, 10);
  assert.equal(recap.image, recap.gallery[0]);
  assert.equal(recap.galleryZip.label, "10枚まとめて保存");
  assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 10);
  assert.equal(recap.gallery.filter(({ src }) => /singing/.test(src)).length, 2);
  for (const still of recap.gallery) {
    assert.match(still.src, /\/mily-b118-/);
    const file = new URL(`../public${still.src}`, import.meta.url);
    const meta = await sharp(await readFile(file)).metadata();
    assert.equal(meta.width, 640);
    assert.equal(meta.height, 360);
    for (const field of ["exif", "xmp", "iptc"]) assert.equal(meta[field], undefined);
    assert.ok(still.alt?.includes("みりぃ"));
    assert.ok(still.caption && still.downloadName);
  }
  const zip = await readFile(new URL(`../public${recap.galleryZip.src}`, import.meta.url));
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  for (const still of recap.gallery) {
    assert.ok(zip.includes(Buffer.from(still.src.split("/").pop())));
  }
  assert.match(recap.transcriptionNote, /3,021区間/);
  assert.match(recap.transcriptionNote, /8222\.084秒/);
  assert.match(recap.transcriptionNote, /別モデルで再認識/);
  assert.match(recap.transcriptionNote, /実フレーム10枚/);
});
