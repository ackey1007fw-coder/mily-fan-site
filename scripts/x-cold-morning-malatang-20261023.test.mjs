import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("October 23 cold morning and malatang X post is sourced and shown through the official embed", async () => {
  const newsSource = await readFile(path.join(root, "src/data/news.ts"), "utf8");
  const id = 'id: "2026-10-23-x-cold-morning-malatang"';
  assert.equal(newsSource.split(id).length - 1, 1, "news entry must be unique");
  const entry = newsSource.split(id)[1].split("\n  },")[0];

  assert.match(entry, /date: "2026-10-23"/);
  assert.match(entry, /sameDayOrder: 843/);
  assert.match(entry, /10月23日8:43（日本時間）/);
  assert.match(entry, /薄手の上着/);
  assert.match(entry, /大学/);
  assert.match(entry, /麻辣湯/);
  assert.match(entry, /source: "https:\/\/x\.com\/Mily_chan36\/status\/2113416020597825627"/);
  assert.match(entry, /postId: "2113416020597825627"/);
  assert.match(entry, /sourceUrl: "https:\/\/x\.com\/Mily_chan36\/status\/2113416020597825627"/);
  assert.doesNotMatch(entry, /pbs\.twimg\.com|media:\s*\{/);
});

test("X embed uses an accurate link label for photo and video posts", async () => {
  const component = await readFile(path.join(root, "src/components/XEmbedCard.tsx"), "utf8");
  assert.match(component, /Xで元の投稿を見る/);
  assert.match(component, /platform\.twitter\.com\/embed\/Tweet\.html/);
});
