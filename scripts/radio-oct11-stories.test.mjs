import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(resolve(root, "src/data/radioOct11Stories.json"), "utf8"));

test("October 11 radio Stories use two owner-provided, dated-by-receipt videos", () => {
  assert.equal(manifest.length, 2);
  assert.equal(new Set(manifest.map((item) => item.id)).size, 2);
  for (const item of manifest) {
    assert.equal(item.kind, "video");
    assert.equal(item.provenance, "owner-provided");
    assert.equal(item.sourceDate, null);
    assert.equal(item.receivedDate, "2026-10-11");
    assert.deepEqual(item.activityIds, ["radio"]);
    assert.equal(item.published, true);
    assert.ok(item.alt.length > 10);
    assert.equal(item.width, 512);
    assert.equal(item.height, 910);
    assert.ok(item.src.startsWith("/media/gallery/mily-b201-"));
    assert.ok(item.poster.startsWith("/media/gallery/mily-b201-"));
    assert.ok(statSync(resolve(root, "public", item.src.slice(1))).size > 100_000);
    assert.ok(statSync(resolve(root, "public", item.poster.slice(1))).size > 5_000);
  }
});

test("October 11 radio announcement appears in NEWS and Gallery", () => {
  const news = readFileSync(resolve(root, "src/data/news.ts"), "utf8");
  const gallery = readFileSync(resolve(root, "src/data/galleryVideos.ts"), "utf8");
  assert.match(news, /2026-10-11-radio-tournament-stories/);
  assert.match(news, /media: radioOct11Stories\[0\]/);
  assert.match(news, /additionalMedia: radioOct11Stories\.slice\(1\)/);
  assert.match(gallery, /\.\.\.radioOct11Stories/);
});
