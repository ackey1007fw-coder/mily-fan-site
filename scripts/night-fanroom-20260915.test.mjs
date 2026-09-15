import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { news } from "../src/data/news.ts";
import { srcSetFor, media } from "../src/data/media.ts";
import { nightRibbonFanroomPhoto as photo, nightRibbonFanroomImage as image } from "../src/data/nightRibbonFanroomSelfie.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";

test("night Fan Room post keeps its evidence separate from the stream recording", () => {
  const item = news.find(({ id }) => id === "2026-09-15-night-fanroom-thanks");
  assert.equal(item.media, image);
  assert.ok(media.includes(photo));
  assert.deepEqual(item.activityIds, ["live-stream"]);
  assert.equal(item.source, undefined);
  assert.equal(photo.sourceUrl, null);
  assert.equal(photo.sourceDate, "2026-09-15");
  assert.match(item.body, /投稿時点では、翌9月16日7:30/);
  assert.match(photo.caption, /23:43.*配信後/);
  assert.ok(!streamRecaps.some(recap => recap.image?.src === image.src));
});

test("Fan Room responsive descriptors match decoded derivatives and strip metadata", async () => {
  for (const format of ["jpg", "webp"]) {
    const gallerySet = srcSetFor(photo, format);
    assert.equal(gallerySet, format === "jpg" ? image.srcSet : image.webpSrcSet);
    for (const entry of gallerySet.split(", ")) {
      const [src, descriptor] = entry.split(" ");
      const meta = await sharp(`public${src}`).metadata();
      assert.equal(meta.width, Number.parseInt(descriptor));
      assert.ok(meta.width <= photo.width);
      assert.equal(meta.exif, undefined);
      assert.equal(meta.iptc, undefined);
      assert.equal(meta.xmp, undefined);
    }
  }
});
