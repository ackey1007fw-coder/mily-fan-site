import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { media, visibleMedia } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import {
  komorebiShootNewsImages,
  komorebiShootPhotos,
} from "../src/data/komorebiShootPhotos.ts";
import { verifyMedia, verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CAROUSEL_URL = "https://www.instagram.com/p/DgHrkZrE_8x/";
const NEWS_ID = "2026-11-24-instagram-komorebi-photos";

const EXPECTED = [
  { sourceUrl: CAROUSEL_URL, width: 1080, height: 1350 },
  { sourceUrl: CAROUSEL_URL, width: 2000, height: 2666 },
  { sourceUrl: CAROUSEL_URL, width: 1080, height: 1350 },
  { sourceUrl: CAROUSEL_URL, width: 3000, height: 2000 },
  { sourceUrl: "https://www.instagram.com/p/DgHrqYzzR1W/", width: 1088, height: 1344 },
  { sourceUrl: "https://www.instagram.com/p/DgHrtpyzKGl/", width: 1088, height: 1344 },
];

test("2026-11-24 木漏れ日フォト Instagram投稿 — NEWS", () => {
  const matching = news.filter(({ id }) => id === NEWS_ID);
  assert.equal(matching.length, 1, "同じ投稿の記事を重複させない");
  const item = matching[0];

  assert.deepEqual(verifyNews(news), []);
  assert.equal(item.date, "2026-11-24");
  assert.equal(item.source, CAROUSEL_URL);
  assert.equal(item.media, komorebiShootNewsImages[0]);
  assert.deepEqual(item.additionalMedia, komorebiShootNewsImages.slice(1));
  assert.equal(item.activityIds, undefined);
});

test("2026-11-24 木漏れ日フォト Instagram投稿 — Gallery", () => {
  assert.deepEqual(verifyMedia(media), []);
  assert.equal(komorebiShootPhotos.length, 6);

  komorebiShootPhotos.forEach((item, index) => {
    const expected = EXPECTED[index];
    assert.equal(item.kind, "photo");
    assert.equal(item.provenance, "sns-post");
    assert.equal(item.sourceUrl, expected.sourceUrl);
    assert.equal(item.sourceDate, "2026-11-24");
    assert.equal(item.credit, "齊藤結（@_____fil_）");
    assert.equal(item.published, true);
    assert.equal(item.width, expected.width);
    assert.equal(item.height, expected.height);
    assert.equal(item.aspect, expected.width + " / " + expected.height);
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
  });
});
