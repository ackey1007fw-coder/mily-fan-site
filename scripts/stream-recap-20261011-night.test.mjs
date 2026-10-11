import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";
import path from "node:path";
import sharp from "sharp";
import { streamRecap20261011Night } from "../src/data/streamRecap20261011Night.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const root = path.resolve(import.meta.dirname, "..");
const item = streamRecap20261011Night;

describe("2026-10-11 night SHOWROOM recap", () => {
  it("keeps the existing morning entry and latest-first order", () => {
    assert.equal(streamRecaps[0].id, "2026-10-12-asa-showroom");
    assert.equal(streamRecaps[1], item);
    assert.equal(streamRecaps[2].id, "2026-10-11-asa-showroom");
    assert.equal(streamRecaps.filter((recap) => recap.id === item.id).length, 1);
  });
  it("distinguishes broadcast recap from uncertain raw ASR and private analytics", () => {
    assert.equal(item.date, "2026-10-11");
    assert.equal(item.broadcastLabel, "録画開始20:30頃〜 約56分");
    assert.equal(item.goals.length, 0);
    assert.equal(item.ranking.length, 1);
    assert.match(item.transcriptionNote, /全編の実聴・逐語校正は未実施/);
    assert.match(item.nextNote, /配信時点では/);
    const content = JSON.stringify(item);
    for (const term of ["23540963", "659,247", "651,787", "4,462", "4,476", "@ackey"]) {
      assert.ok(!content.includes(term), "private or disputed figure: " + term);
    }
  });
  it("publishes exactly 12 real-frame stills without copied EXIF", async () => {
    assert.equal(item.gallery.length, 12);
    assert.ok(item.gallery.includes(item.image));
    const seen = new Set();
    for (const photo of item.gallery) {
      assert.equal(photo.width, 640);
      assert.equal(photo.height, 360);
      assert.match(photo.alt, /みりぃ/);
      assert.ok(photo.caption && photo.downloadName);
      assert.ok(!seen.has(photo.src));
      seen.add(photo.src);
      const file = path.join(root, "public", photo.src.slice(1));
      assert.ok(existsSync(file), file);
      const meta = await sharp(file).metadata();
      assert.equal(meta.width, 640);
      assert.equal(meta.height, 360);
      assert.equal(meta.exif, undefined);
      assert.equal(meta.iptc, undefined);
    }
    assert.ok(existsSync(path.join(root, "public", item.galleryZip.src.slice(1))));
  });
});
