import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { news } from "../src/data/news.ts";
import { storyBySlug, storySources } from "../src/data/stories.ts";
import { activities } from "../src/data/activities.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SLUG = "2026-10-15-semifinal";
const OPERATOR_X = "https://x.com/circle_contest/status/2110646640071860374";
const LIST_URL = "https://2026.misscircle.jp/list/5";

test("10月15日のセミファイナル進出storyを承認文そのままで、画像なしで掲載する", () => {
  const story = storyBySlug(SLUG);
  assert.ok(story);
  assert.equal(story.href, `/stories/${SLUG}/`);
  assert.equal(story.title, "4次審査を越えて、セミファイナルへ");
  assert.equal(story.date, "2026-10-15");
  assert.equal(story.leadMediaId, null);
  assert.deepEqual(story.media, []);
  const paragraphs = story.sections.flatMap((section) =>
    section.blocks.map((block) => (block.type === "paragraph" ? block.text : null)),
  );
  assert.deepEqual(paragraphs, [
    "10月15日の夕方、みりぃから「ご報告」が届きました。",
    "MISS CIRCLE CONTEST 2026の4次審査を突破して、セミファイナルに進みます。",
    "「4次審査もたくさんの応援ありがとうございました」「次も頑張るど〜」と本人。",
    "運営もこの日、セミファイナル審査の進出者をサイトで発表しました。",
    "セミファイナルの日程や審査の方法は、決まったら運営の案内で確認してください。",
  ]);
  assert.equal(storySources["x-2026-10-15-semifinal-advance"].url, "https://x.com/Mily_chan36/status/2110646575051747453");
  assert.equal(storySources["misscircle-2026-semifinal-post"].url, OPERATOR_X);
  assert.equal(storySources["misscircle-2026-semifinal-list"].url, LIST_URL);
  assert.ok(activities.find(({ id }) => id === "miss-circle")?.relatedStorySlugs.includes(SLUG));
});

test("story用HTML・vite入力・sitemapが揃っている", async () => {
  const read = (p) => readFile(path.join(root, p), "utf8");
  const html = await read(`stories/${SLUG}/index.html`);
  assert.match(html, /rel="canonical" href="__STORY_2026_10_15_SEMIFINAL_CANONICAL__"/);
  assert.match(html, /content="__SITE_OG_IMAGE__"/);
  assert.match(await read("vite.config.ts"), /storySemifinal20261015: "stories\/2026-10-15-semifinal\/index\.html"/);
  assert.match(await read("public/sitemap.xml"), /\/stories\/2026-10-15-semifinal\//);
});

test("既存のセミファイナルNEWSに運営X投稿と進出者一覧を出典として追加し、既存の出典は残す", () => {
  const item = news.find(({ id }) => id === "2026-10-15-miss-circle-semifinal-advance");
  assert.ok(item);
  assert.deepEqual(
    item.additionalSources?.map(({ url }) => url),
    ["https://www.misscircle.jp/", OPERATOR_X, LIST_URL],
  );
  assert.equal(item.sameDayOrder, 1718);
});
