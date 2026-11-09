import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
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

test("11/8 night TikTok delivery copies retain every PNG pixel and the reviewed order", async () => {
  assert.equal(manifest.tiktokVariants.length, 10);
  assert.deepEqual(manifest.tiktokVariants.map(item => item.id), manifest.order);
  for (const [index, item] of manifest.tiktokVariants.entries()) {
    const original = manifest.items[index];
    assert.equal(item.source, original.path);
    assert.equal(item.path, original.path.replace(/\.png$/, ".webp"));
    assert.equal(item.lossless, true);
    const bytes = readFileSync(path.join(root, "public", item.path));
    assert.equal(bytes.length, item.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), item.sha256);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, "webp");
    assert.deepEqual([metadata.width, metadata.height], [720, 900]);
    const decoded = await sharp(bytes).ensureAlpha().raw().toBuffer();
    const source = await sharp(path.join(root, "public", original.path)).ensureAlpha().raw().toBuffer();
    assert.ok(decoded.equals(source), `Lossless delivery mismatch: ${item.id}`);
  }
});
