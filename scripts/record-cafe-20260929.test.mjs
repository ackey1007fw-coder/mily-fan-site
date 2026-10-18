import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { news, newsDisplayMedia } from "../src/data/news.ts";
import { media } from "../src/data/media.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const photos = media.filter(({ id }) => id.startsWith("mily-b173-"));
const post = news.find(({ id }) => id === "2026-09-29-record-cafe-mily-collection");

describe("record-café second collection", () => {
  it("shows all seven provided photos in NEWS and Gallery without inventing a post date or URL", () => {
    assert.ok(post);
    assert.equal(post.date, "2026-09-29");
    assert.equal(post.source, undefined);
    assert.equal(post.additionalMedia?.length, 6);
    assert.equal(photos.length, 7);
    assert.deepEqual(
      newsDisplayMedia(post).map(({ src }) => src),
      photos.map(({ basePath }) => `${basePath}-1600.jpg`),
    );
    for (const photo of photos) {
      assert.equal(photo.published, true);
      assert.equal(photo.provenance, "owner-provided");
      assert.equal(photo.sourceUrl, null);
      assert.equal(photo.sourceDate, null);
      assert.match(photo.credit, /あみちゃん/);
      assert.equal(photo.aspect, "1153 / 1536");
    }
  });

  it("ships responsive derivatives without private photo metadata", async () => {
    for (const photo of photos) {
      for (const suffix of photo.widths) {
        for (const extension of ["jpg", "webp"]) {
          const file = path.join(root, "public", `${photo.basePath}-${suffix}.${extension}`);
          assert.ok(existsSync(file), file);
          const details = await sharp(file).metadata();
          assert.equal(details.exif, undefined, file);
          assert.equal(details.iptc, undefined, file);
          assert.equal(details.xmp, undefined, file);
          assert.equal(details.width, Math.min(suffix, 1153), file);
        }
      }
    }
  });
});
