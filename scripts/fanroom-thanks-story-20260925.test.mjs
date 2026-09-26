import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { storyBySlug, storySources } from "../src/data/stories.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";

test("Sep 25 fanroom article preserves source, quotation, and NEWS discovery", async () => {
  const story = storyBySlug("2026-09-25-thanks-and-finals");
  assert.ok(story);
  assert.equal(story.date, "2026-09-25");
  assert.equal(story.href, "/stories/2026-09-25-thanks-and-finals/");
  assert.deepEqual(story.sourceIds, ["fanroom-2026-09-25-night-thanks"]);
  assert.equal("url" in storySources[story.sourceIds[0]], false);
  const quotes = story.sections.flatMap(({ blocks }) =>
    blocks.filter(({ type }) => type === "quote").flatMap(({ paragraphs }) => paragraphs));
  assert.deepEqual(quotes, [
    "必ずファイナルに行けるよう努力し続けるので、見ててね🎀🩵",
    "みんなからの愛をいただきました❤️",
    "大好きです。いつもありがとう。",
  ]);
  assert.match(story.lead, /夜配信後/);
  assert.doesNotMatch(JSON.stringify(story), /5:30|IMG_8709|IMG_8710|進出決定/);
  const item = news.find(({ id }) => id === "2026-09-25-fanroom-thanks-and-finals");
  assert.ok(item);
  assert.equal(item.url, story.href);
  assert.equal(item.ctaLabel, "夜のメッセージを読む");
  const sameDay = sortNewsByDateDesc(news.filter(({ date }) => date === story.date));
  assert.ok(sameDay.indexOf(item) < sameDay.findIndex(({ id }) => id === "2026-09-25-super-oreo-mcflurry-x"));
  const html = await readFile(fileURLToPath(new URL("../stories/2026-09-25-thanks-and-finals/index.html", import.meta.url)), "utf8");
  const vite = await readFile(fileURLToPath(new URL("../vite.config.ts", import.meta.url)), "utf8");
  assert.match(html, /src="\/src\/story-main\.tsx"/);
  assert.match(html, /__STORY_2026_09_25_THANKS_CANONICAL__/);
  assert.match(html, /"datePublished": "2026-09-26"/);
  assert.ok(html.includes(story.title));
  assert.match(vite, /storyThanks20260925: "stories\/2026-09-25-thanks-and-finals\/index\.html"/);
});
