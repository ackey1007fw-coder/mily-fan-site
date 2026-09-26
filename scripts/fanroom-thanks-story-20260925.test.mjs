import assert from "node:assert/strict";
import { test } from "node:test";
import { stories } from "../src/data/stories.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { verifyNews } from "./content-invariants.mjs";

test("Sep 25 fanroom article preserves quotes and NEWS-only publication", () => {
  const item = news.find(({ id }) => id === "2026-09-25-fanroom-thanks-and-finals");
  assert.ok(item);
  assert.equal(item.date, "2026-09-25");
  assert.equal(item.sourceLabel, "SHOWROOMファンルーム");
  assert.equal(item.source, undefined);
  assert.equal(item.media, undefined);
  assert.equal(item.message.text, "必ずファイナルに行けるよう努力し続けるので、見ててね🎀🩵\n\nみんなからの愛をいただきました❤️\n大好きです。いつもありがとう。");
  assert.match(item.body, /夜配信後/);
  assert.doesNotMatch(JSON.stringify(item), /5:30|IMG_8709|IMG_8710|進出決定/);
  assert.equal(item.url, "/activities/live/#recap-2026-09-25-night-showroom");
  assert.ok(streamRecaps.some(({ id }) => id === "2026-09-25-night-showroom"));
  assert.equal(stories.some(({ slug }) => slug === "2026-09-25-thanks-and-finals"), false);
  const sameDay = sortNewsByDateDesc(news.filter(({ date }) => date === item.date));
  assert.ok(sameDay.indexOf(item) < sameDay.findIndex(({ id }) => id === "2026-09-25-super-oreo-mcflurry-x"));
  assert.deepEqual(verifyNews([item]), []);
});
