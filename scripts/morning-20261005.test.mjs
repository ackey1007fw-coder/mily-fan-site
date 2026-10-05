import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import sharp from "sharp";
import {streamRecap20261005Asa as recap} from "../src/data/streamRecap20261005Asa.ts";

test("October 5 morning has distinct real, privacy-cropped stills without metadata", async () => {
  assert.equal(recap.gallery.length, 8);
  const contents = new Set();
  for (const image of recap.gallery) {
    const bytes = await readFile(new URL(`../public${image.src}`, import.meta.url));
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, 430); assert.equal(metadata.height, 360);
    assert.equal(image.width, metadata.width); assert.equal(image.height, metadata.height);
    assert.equal(metadata.exif, undefined); assert.equal(metadata.icc, undefined);
    contents.add(bytes.toString("base64"));
  }
  assert.equal(contents.size, 8);
});

test("the morning archive distinguishes recording coverage and unverified speech", () => {
  assert.match(recap.broadcastLabel, /^録画開始6:00頃〜 約40分$/);
  assert.equal(recap.dateLabel, "2026.10.05（月）");
  assert.match(recap.transcriptionNote, /手動聴取/);
  assert.match(recap.transcriptionNote, /実開始/);
  assert.equal(recap.nextNote, "");
  assert.equal(recap.highlights.some(item => item.quote), false);
  assert.doesNotMatch(JSON.stringify(recap), /live\d{6,}|\.mkv|\.wav|drive\.google/);
});
