import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const news = readFileSync(new URL("../src/data/news.ts", import.meta.url), "utf8");
const video = readFileSync(new URL("../src/data/sscTikTokOct31.ts", import.meta.url), "utf8");
const gallery = readFileSync(new URL("../src/data/galleryVideos.ts", import.meta.url), "utf8");

test("10/31 program TikTok is added to the existing source-only news card", () => {
  const existing = news.slice(news.indexOf('id: "2026-10-16-tiktok-seasidecircle-shared"'));
  assert.equal((news.match(/id: "2026-10-16-tiktok-seasidecircle-shared"/g) ?? []).length, 1);
  assert.doesNotMatch(news, /id: "2026-10-31-tiktok-seasidecircle-shared"/);
  assert.match(existing, /additionalSources: \[/);
  assert.match(existing, /url: sscTikTokOct31\.sourceUrl/);
  assert.match(existing, /10月31日に新たに共有された別のTikTok投稿も関連リンクに追加しました/);
  assert.match(video, /postId: "7702609878941994261"/);
  assert.match(video, /sourceUrl: "https:\/\/www\.tiktok\.com\/@seasidecircle\/video\/7702609878941994261"/);
});

test("uninspected TikTok remains external-only with no Gallery or player", () => {
  assert.match(video, /sourceDate: null/);
  assert.match(video, /published: false/);
  assert.doesNotMatch(news, /media: sscTikTokOct31/);
  assert.doesNotMatch(gallery, /sscTikTokOct31/);
});
