import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import sharp from "sharp";
import {
  buildRankingNote,
  streamRecap20260913Yoru as recap,
  streamRecaps,
} from "../src/data/streamRecaps.ts";

test("September 13 night precedes the same-day morning recap", () => {
  const index = streamRecaps.indexOf(recap);
  const morning = streamRecaps.findIndex(r => r.id === "2026-09-13-asa-showroom");
  assert.ok(index >= 0 && morning > index);
  assert.equal(recap.broadcastLabel, "22:31頃〜 約107分");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.equal(recap.songs, undefined);
  assert.deepEqual(recap.ranking, [buildRankingNote(13, 1, "during")]);
  assert.deepEqual(recap.goals, [
    { item: "WEB投票", target: "最終日", statusThen: "最後まで呼びかけ" },
    { item: "ファイナル", target: "進出", statusThen: "目指す思いを共有" },
  ]);
});

test("September 13 night records verified themes without private handoff data", () => {
  const publicText = JSON.stringify(recap);
  assert.match(publicText, /ラジオ/);
  assert.match(publicText, /アバター権/);
  assert.match(publicText, /44日目/);
  assert.match(publicText, /WEB投票最終日/);
  assert.match(publicText, /ファイナル/);
  assert.match(recap.nextNote, /9:30/);
  assert.match(recap.nextNote, /ファンルーム/);
  assert.doesNotMatch(publicText, /live23423409|573253|Mily_SHOWROOM_AutoRecord|ChatGPTWork/);
});

test("September 13 night ships ten approved real-frame stills", async () => {
  assert.equal(recap.gallery.length, 10);
  assert.equal(recap.image, recap.gallery[5]);
  assert.equal(recap.galleryZip.label, "10枚まとめて保存");
  assert.equal(new Set(recap.gallery.map(({ src }) => src)).size, 10);
  for (const still of recap.gallery) {
    assert.match(still.src, /\/mily-b117-/);
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
  assert.match(recap.transcriptionNote, /全1,988区間/);
  assert.match(recap.transcriptionNote, /6435\.493秒/);
  assert.match(recap.transcriptionNote, /実フレーム10枚/);
});
