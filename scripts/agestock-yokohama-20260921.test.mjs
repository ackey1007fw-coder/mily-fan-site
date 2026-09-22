import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import sharp from "sharp";

import { agestockYokohamaNewsImages } from "../src/data/agestockYokohamaNewsImages.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-09-21-agestock-yokohama";
const X_URL = "https://x.com/Mily_chan36/status/2101944527695057190";

describe("2026-09-21 AGESTOCK2026 in横アリ owner-provided photos", () => {
  it("keeps the existing sourced NEWS record Latest-only and attaches both photos", () => {
    const item = news.find(({ id }) => id === NEWS_ID);
    assert.ok(item);
    assert.equal(item.date, "2026-09-21");
    assert.equal(item.source, X_URL);
    assert.equal(item.activityIds, undefined);
    assert.equal(item.media, agestockYokohamaNewsImages.twoShot);
    assert.deepEqual(item.additionalMedia, [agestockYokohamaNewsImages.group]);
    assert.equal(sortNewsByDateDesc(news)[3]?.id, NEWS_ID);
  });

  it("ships both self-hosted 1179x884 JPEGs without privacy metadata", async () => {
    for (const image of [
      agestockYokohamaNewsImages.group,
      agestockYokohamaNewsImages.twoShot,
    ]) {
      const file = path.join(root, "public", image.src);
      assert.ok(existsSync(file), `missing ${image.src}`);
      const meta = await sharp(file).metadata();
      assert.equal(meta.width, 1179, image.src);
      assert.equal(meta.height, 884, image.src);
      assert.equal(meta.exif, undefined, `EXIF found in ${image.src}`);
      assert.equal(meta.iptc, undefined, `IPTC found in ${image.src}`);
      assert.equal(meta.xmp, undefined, `XMP found in ${image.src}`);
      assert.equal(meta.icc, undefined, `ICC found in ${image.src}`);
    }
  });

  it("does not turn the two photos into Gallery media", async () => {
    const mediaSource = await readFile(path.join(root, "src/data/media.ts"), "utf8");
    assert.equal(mediaSource.includes("mily-b138-01"), false);
    assert.equal(mediaSource.includes("mily-b138-02"), false);
  });
});
