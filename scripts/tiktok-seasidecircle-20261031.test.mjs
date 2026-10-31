import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const news = readFileSync(new URL("../src/data/news.ts", import.meta.url), "utf8");
const video = readFileSync(new URL("../src/data/tiktokSeasideCircleOct31Video.ts", import.meta.url), "utf8");
const gallery = readFileSync(new URL("../src/data/galleryVideos.ts", import.meta.url), "utf8");

test("owner-specified 2026-10-31 TikTok URL appears exactly once in NEWS", () => {
  assert.equal((news.match(/2026-10-31-tiktok-seasidecircle-shared/g) ?? []).length, 1);
  assert.match(news, /dateBasis: "confirmed-on"/);
  assert.match(news, /source: tiktokSeasideCircleOct31Video\.sourceUrl/);
  assert.match(video, /postId: "7702609878941994261"/);
  assert.match(video, /sourceUrl: "https:\/\/www\.tiktok\.com\/@seasidecircle\/video\/7702609878941994261"/);
});

test("uninspected TikTok stays outbound-only and does not enter Gallery", () => {
  assert.match(video, /sourceDate: null/);
  assert.match(video, /published: false/);
  assert.doesNotMatch(news, /media: tiktokSeasideCircleOct31Video/);
  assert.doesNotMatch(gallery, /tiktokSeasideCircleOct31Video/);
  assert.match(news, /投稿内容・説明文・みりぃ本人の登場有無は独立確認できていません/);
});
