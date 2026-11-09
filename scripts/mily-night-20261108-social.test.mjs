import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { validateReportMedia } from "./social-report-quality.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(readFileSync(new URL("../docs/media/mily-20261108-night-social.json", import.meta.url), "utf8"));

test("11/8 night social photos: ten reviewed stills preserve original source pixels", async () => {
  assert.equal(manifest.recapId, "2026-11-08-night-showroom");
  assert.equal(manifest.items.length, 10);
  assert.deepEqual(manifest.items.map(item => item.sourcePhotoNumber), [6, 1, 2, 3, 4, 5, 7, 8, 9, 10]);
  assert.equal(manifest.order[0], manifest.coverId);
  assert.match(manifest.items[0].source, /06-20261108-night-talk-smile\.jpg$/);
  for (const item of manifest.items) {
    assert.deepEqual(item.photoBounds, [40, 270, 680, 630]);
    assert.match(item.path, /^\/media\/live\/mily-b257-\d+-20261108-night-social-(?:cover|photo)\.png$/);
  }
  await validateReportMedia(manifest, { root, recaps: streamRecaps });
});
