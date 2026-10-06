import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { news } from "../src/data/news.ts";

test("October 5 night recap connects the archive and NEWS with reviewed real photos", async () => {
  const recap = streamRecaps.find(r => r.id === "2026-10-05-night-showroom");
  assert.ok(recap);
  assert.equal(streamRecaps.filter(r => r.id === recap.id).length, 1);
  assert.equal(recap.gallery.length, 3);
  const expected = ["0673ec70a6f9139589b813933fe46a88cc44ee31e2f0910d5dfe0f6dbe0394da", "0aebcb70eb33f3c9979e2a9396ddfc6b31fba6a56641505496c44b23e3b612c7", "d5c35a7580987ee441d968043096df1554fc668e4466dd7956c17f2cba320c53"];
  const { createHash } = await import("node:crypto");
  for (const [index, photo] of recap.gallery.entries()) {
    const bytes = await readFile(new URL(`../public${photo.src}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected[index]);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, 640); assert.equal(metadata.height, 360);
    assert.equal(metadata.exif, undefined); assert.equal(metadata.xmp, undefined);
    assert.doesNotMatch(photo.caption, /虫に驚いた瞬間|歌唱中|挨拶の瞬間/);
  }
  const item = news.find(n => n.id === "2026-10-05-night-showroom-recap");
  assert.ok(item.relatedUrl.endsWith(`#recap-${recap.id}`));
  assert.equal(item.media.src, recap.image.src);
  const publicText = JSON.stringify(recap);
  assert.doesNotMatch(publicText, /お風呂|入浴|ズボン|転ん|幼少|ちっちゃい頃|DM|AppData|source-working-copy|live23515832/);
  assert.match(recap.transcriptionNote, /未完了/);
  assert.deepEqual(recap.ranking, []);
});
