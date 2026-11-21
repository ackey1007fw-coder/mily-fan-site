import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { media, visibleMedia } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import {
  photoshootDayNewsImages,
  photoshootDayPhotos,
} from "../src/data/photoshootDayPhotos.ts";
import { verifyMedia, verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POST_URL = "https://www.instagram.com/p/DgAZjpJk1TR/";
const NEWS_ID = "2026-11-21-instagram-photoshoot-day";

test("2026-11-21 撮影の日 Instagram投稿 — NEWS", () => {
  const matching = news.filter(({ id }) => id === NEWS_ID);
  assert.equal(matching.length, 1, "同じ投稿の記事を重複させない");
  const item = matching[0];

  assert.deepEqual(verifyNews(news), []);
  assert.equal(item.date, "2026-11-21");
  assert.equal(item.source, POST_URL);
  assert.equal(item.media, photoshootDayNewsImages[0]);
  assert.deepEqual(item.additionalMedia, photoshootDayNewsImages.slice(1));
  assert.equal(item.activityIds, undefined);
});

test("2026-11-21 撮影の日 Instagram投稿 — Gallery", () => {
  assert.deepEqual(verifyMedia(media), []);
  assert.equal(photoshootDayPhotos.length, 3);

  for (const item of photoshootDayPhotos) {
    assert.equal(item.kind, "photo");
    assert.equal(item.provenance, "sns-post");
    assert.equal(item.sourceUrl, POST_URL);
    assert.equal(item.sourceDate, "2026-11-21");
    assert.equal(item.credit, null);
    assert.equal(item.published, true);
    assert.equal(item.width, 1080);
    assert.equal(item.height, 1440);
    assert.equal(item.aspect, "1080 / 1440");
    assert.equal(visibleMedia(media).includes(item), true);

    for (const width of item.widths) {
      for (const format of ["jpg", "webp"]) {
        const file = path.join(
          root,
          "public",
          `${item.basePath}-${width}.${format}`.replace(/^\//, ""),
        );
        assert.ok(existsSync(file), `derivative exists: ${file}`);
      }
    }
  }
});
