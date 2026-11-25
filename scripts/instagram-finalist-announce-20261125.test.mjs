import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { media, visibleMedia } from "../src/data/media.ts";
import { news } from "../src/data/news.ts";
import {
  finalistForestNewsImages,
  finalistForestPhotos,
} from "../src/data/finalistForestPhotos.ts";
import { verifyMedia, verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POST_URL = "https://www.instagram.com/p/DgKWbe_E10B/";
const NEWS_ID = "2026-11-25-instagram-finalist-announce";

test("2026-11-25 ファイナリスト選出 Instagram投稿 — NEWS", () => {
  const matching = news.filter(({ id }) => id === NEWS_ID);
  assert.equal(matching.length, 1, "同じ投稿の記事を重複させない");
  const item = matching[0];

  assert.deepEqual(verifyNews(news), []);
  assert.equal(item.date, "2026-11-25");
  assert.equal(item.source, POST_URL);
  assert.equal(item.media, finalistForestNewsImages[0]);
  assert.deepEqual(item.additionalMedia, finalistForestNewsImages.slice(1));
  assert.deepEqual(item.activityIds, ["miss-circle"]);
});

test("2026-11-25 ファイナリスト選出 Instagram投稿 — Gallery", () => {
  assert.deepEqual(verifyMedia(media), []);
  assert.equal(finalistForestPhotos.length, 3);

  for (const item of finalistForestPhotos) {
    assert.equal(item.kind, "photo");
    assert.equal(item.provenance, "sns-post");
    assert.equal(item.sourceUrl, POST_URL);
    assert.equal(item.sourceDate, "2026-11-25");
    assert.equal(item.credit, "齊藤結（@_____fil_、本人投稿文による）");
    assert.equal(item.published, true);
    assert.equal(item.width, 3000);
    assert.equal(item.height, 2000);
    assert.equal(item.aspect, "3000 / 2000");
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
