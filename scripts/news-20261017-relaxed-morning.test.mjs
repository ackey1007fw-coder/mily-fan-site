import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("2026-10-17 X morning update is uniquely sourced and historical", async () => {
  const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
  const id = 'id: "2026-10-17-x-relaxed-morning-showroom"';
  assert.equal(newsSource.split(id).length - 1, 1);
  const body = newsSource.split(id)[1].split("\n  },")[0];
  assert.match(body, /date: "2026-10-17"/);
  assert.match(body, /sameDayOrder: 1045/);
  assert.match(body, /source: "https:\/\/x\.com\/Mily_chan36\/status\/2111272418140622870"/);
  assert.match(body, /mily-b229-01-20261017-relaxed-morning-selfie.jpg/);
  assert.match(body, /width: 1152/);
  assert.match(body, /height: 2048/);
  assert.match(body, /10月17日時点の案内/);
});

test("the published photo matches the original supplied JPEG byte-for-byte", async () => {
  const img = await readFile(path.join(root, "public/media/news/mily-b229-01-20261017-relaxed-morning-selfie.jpg"));
  assert.equal(img.byteLength, 369141);
  assert.equal(createHash("sha256").update(img).digest("hex"), "acd2949880c34572a069bec3553be981a52f0f9a8d844e6653329ef4d7b5e410");
  const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
  assert.ok(!newsSource.includes("pbs.twimg.com/media/HUy_EpwboAA0aln.jpg"));
});
