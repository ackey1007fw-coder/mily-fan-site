import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";
import path from "node:path";
import sharp from "sharp";
import { streamRecap20261012Asa } from "../src/data/streamRecap20261012Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

const root = path.resolve(import.meta.dirname, "..");
const item = streamRecap20261012Asa;

describe("2026-10-12 morning SHOWROOM recap", () => {
  it("adds the morning slot exactly once above both October 11 recaps", () => {
    const ids = streamRecaps.map((recap) => recap.id);
    const morning12 = ids.indexOf(item.id);
    const night11 = ids.indexOf("2026-10-11-night-showroom");
    const morning11 = ids.indexOf("2026-10-11-asa-showroom");
    assert.ok(morning12 >= 0 && night11 >= 0 && morning11 >= 0);
    assert.equal(streamRecaps[morning12], item);
    assert.ok(morning12 < night11 && night11 < morning11);
    assert.equal(streamRecaps.filter((x) => x.id === item.id).length, 1);
    assert.equal(item.dateLabel, "2026.10.12（月）");
  });
  it("avoids private analytics and treats the night slot as an announced future plan", () => {
    assert.match(item.broadcastLabel, /^録画開始5:32頃〜 約61分$/);
    assert.equal(item.goals.length, 0);
    assert.equal(item.ranking.length, 1);
    assert.match(item.transcriptionNote, /全編の手動聴取・逐語校正は未実施/);
    assert.match(item.nextNote, /配信時点では/);
    assert.match(item.nextNote, /21:00〜21:59/);
    for (const value of ["IMG_4380", "IMG_4390", "23542891", "678,518", "679,280", "670,048", "@ackey", "C:"]) {
      assert.ok(!JSON.stringify(item).includes(value), "nonpublic content leaked: " + value);
    }
  });
  it("uses 12 unique in-scope real frames with 640x360 and no EXIF", async () => {
    assert.equal(item.gallery.length, 12);
    assert.ok(item.gallery.includes(item.image));
    const seen = new Set();
    for (const [index, still] of item.gallery.entries()) {
      assert.ok(still.src.includes("mily-b214-"),still.src);
      assert.equal(still.width, 640);
      assert.equal(still.height, 360);
      assert.match(still.alt, /みりぃ/);
      assert.ok(still.caption && still.downloadName);
      assert.ok(!seen.has(still.src),"duplicate still");
      seen.add(still.src);
      assert.equal(still.src, `/media/live/mily-b214-${String(index + 1).padStart(2, "0")}-20261012-asa-still.jpg`);
      const f=path.join(root,"public",still.src.slice(1));
      assert.ok(existsSync(f),f);
      const meta=await sharp(f).metadata();
      assert.equal(meta.width,640);
      assert.equal(meta.height,360);
      assert.equal(meta.exif,undefined);
      assert.equal(meta.iptc,undefined);
    }
    assert.ok(existsSync(path.join(root,"public",item.galleryZip.src.slice(1))));
  });
});
