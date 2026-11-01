import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { news } from "../src/data/news.ts";
import { media } from "../src/data/media.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-11-01-x-radio-studio-selfie";
const SOURCE = "https://x.com/Mily_chan36/status/2116698308303598036";
const FILE = "public/media/news/mily-b246-01-20261101-radio-studio-selfie.jpg";

test("2026-11-01 X radio post is one uniquely sourced NEWS item", () => {
  const items = news.filter((entry) => entry.id === NEWS_ID);
  assert.equal(items.length, 1);
  const [entry] = items;
  assert.equal(entry.date, "2026-11-01");
  assert.equal(entry.sameDayOrder, 1006);
  assert.equal(entry.dateBasis, undefined);
  assert.deepEqual(entry.activityIds, ["radio"]);
  assert.deepEqual(entry.activityMediaIds, []);
  assert.equal(entry.source, SOURCE);
  assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
  assert.match(entry.body, /10:06（日本時間）/);
  assert.match(entry.body, /「今日もラジオはじまったぞー！！」/);
  assert.match(entry.body, /投稿時点の本人の案内/);
  assert.equal(entry.relatedUrl, "https://fm-smw.jp/radio");
  assert.equal(entry.media?.kind, "image");
  assert.equal(entry.media?.src, "/media/news/mily-b246-01-20261101-radio-studio-selfie.jpg");
  assert.equal(entry.media?.width, 1152);
  assert.equal(entry.media?.height, 2048);
  assert.equal(entry.xEmbed, undefined);
  assert.deepEqual(verifyNews([entry]), []);
});

test("the NEWS photo is the supplied JPEG byte-for-byte and stays out of Gallery", async () => {
  const img = await readFile(path.join(root, FILE));
  assert.equal(img.byteLength, 437985);
  assert.equal(
    createHash("sha256").update(img).digest("hex"),
    "129ccf65dbccf4e17697e735f08e2a365b43364fc9f3faf21eab1edd8ff2d45b",
  );
  const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
  assert.ok(!newsSource.includes("pbs.twimg.com/media/HWAF5ENbQAA0y8V"));
  assert.equal(media.some((entry) => String(entry.id).startsWith("mily-b246")), false);
  assert.equal(galleryVideos.some((entry) => String(entry.id ?? "").startsWith("mily-b246")), false);
});
