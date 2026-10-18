import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { media } from "../src/data/media.ts";
import { news, newsDisplayMedia } from "../src/data/news.ts";
import { selectGalleryEntries } from "../src/lib/galleryItems.ts";
import {
  RED_RIDING_HOOD_X_URL,
  redRidingHoodPhotos,
  redRidingHoodNewsImages,
} from "../src/data/redRidingHoodPhotos.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedUrl = "https://x.com/Mily_chan36/status/2109783240366288956";

describe("10/13 本人Xの人生初赤ずきんコスプレ4枚", () => {
  it("本人X・写真の投稿日・NEWS日時は一致し、配信は当時の案内に留める", () => {
    assert.equal(RED_RIDING_HOOD_X_URL, expectedUrl);
    const post = news.find((item) => item.id === "2026-10-13-x-first-cosplay-red-riding-hood");
    assert.ok(post);
    assert.equal(post.date, "2026-10-13");
    assert.equal(post.sameDayOrder, 808);
    assert.equal(post.source, expectedUrl);
    assert.deepEqual(post.activityIds, ["miss-circle"]);
    assert.match(post.title, /赤ずきん/);
    assert.match(post.body, /人生初/);
    assert.match(post.body, /21:30/);
    assert.match(post.body, /投稿時点/);
    assert.equal(post.media, redRidingHoodNewsImages[0]);
    assert.deepEqual(post.additionalMedia, redRidingHoodNewsImages.slice(1));
    assert.equal(newsDisplayMedia(post).length, 4);
  });

  it("元の横・縦構図を保ち、Gallery 4点とNEWS 4枚の同じ派生を使う", () => {
    assert.equal(redRidingHoodPhotos.length, 4);
    assert.deepEqual(redRidingHoodPhotos.map((photo) => [photo.width, photo.height]), [
      [1600, 900],
      [1600, 900],
      [1600, 901],
      [1152, 2048],
    ]);
    const gallery = selectGalleryEntries();
    for (let i = 0; i < 4; i += 1) {
      const photo = redRidingHoodPhotos[i];
      assert.ok(photo);
      assert.equal(media[i], photo);
      assert.equal(photo.id, `mily-b219-0${i + 1}`);
      assert.equal(photo.sourceUrl, expectedUrl);
      assert.equal(photo.sourceDate, "2026-10-13");
      assert.equal(photo.provenance, "owner-provided");
      assert.equal(photo.published, true);
      assert.equal(photo.aspect, `${photo.width} / ${photo.height}`);
      assert.ok(gallery.some((entry) => entry.kind === "media" && entry.key === photo.id));
      assert.equal(redRidingHoodNewsImages[i].src, `${photo.basePath}-1600.jpg`);
      assert.ok(redRidingHoodNewsImages[i].webpSrcSet.includes(".webp"));
      assert.equal(redRidingHoodNewsImages[i].src.includes("pbs.twimg.com"), false);
      for (const size of photo.widths) {
        for (const ext of ["jpg", "webp"]) {
          assert.ok(
            existsSync(path.join(root, "public", `${photo.basePath}-${size}.${ext}`)),
            `missing published derivative: ${photo.basePath}-${size}.${ext}`,
          );
        }
      }
    }
    assert.match(redRidingHoodNewsImages[3].srcSet, /1152w/);
  });
});
