import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { activities } from "../src/data/activities.ts";
import { news } from "../src/data/news.ts";
import {
  storyBySlug,
  storySources,
} from "../src/data/stories.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STORY_SLUG = "2026-08-25-motivation";
const STORY_HREF = "/stories/2026-08-25-motivation/";
const MAIN_SOURCE =
  "https://x.com/Mily_chan36/status/2092030938306039904";
const CHANGE_SOURCE =
  "https://x.com/Mily_chan36/status/2092063248615133398";

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

describe("2026-08-25 motivation morning STORY", () => {
  it("keeps STORY as the archive and NEWS as a short CTA only", () => {
    const story = storyBySlug(STORY_SLUG);
    const item = news.find((entry) => entry.id === STORY_SLUG);

    assert.ok(story);
    assert.ok(item);
    assert.equal(item.url, STORY_HREF);
    assert.equal(item.ctaLabel, "朝の言葉の記録を読む");
    assert.equal(item.source, MAIN_SOURCE);
    assert.equal(item.sourceLabel, "Xの投稿を見る");
    assert.deepEqual(item.activityIds, ["miss-circle", "live-stream"]);
    assert.doesNotMatch(item.body, /ドラマチックに膨らませる/);
    assert.match(item.body, /11:40/);
    assert.match(item.body, /やる気、元気、勇気でたぞ/);
  });

  it("preserves original wording and the 11:40 schedule change", () => {
    const story = storyBySlug(STORY_SLUG);
    assert.ok(story);
    assert.equal(story.eyebrow, "朝の言葉");
    assert.equal(
      storySources["x-2026-08-25-motivation"].url,
      MAIN_SOURCE,
    );
    assert.equal(
      storySources["x-2026-08-25-motivation-schedule-change"].url,
      CHANGE_SOURCE,
    );

    const quotes = story.sections.flatMap((section) =>
      section.blocks.flatMap((block) =>
        block.type === "quote" ? block.paragraphs : [],
      ),
    );
    assert.ok(
      quotes.some((quote) =>
        quote.includes("やる気、元気、勇気でたぞ✨"),
      ),
    );
    assert.ok(
      quotes.some((quote) =>
        quote.includes("1発目、11:40〜に変更させてください🥲🥲🥲🙏🏻"),
      ),
    );
    assert.ok(
      quotes.some((quote) =>
        quote.includes("なんとも悔しい位置にいるね、私。"),
      ),
    );
    assert.ok(
      quotes.some((quote) =>
        quote.includes("皆からの応援は絶対に無碍にしないよ"),
      ),
    );

    const allText = [
      story.lead,
      ...story.sections.flatMap((section) =>
        section.blocks.flatMap((block) =>
          block.type === "paragraph" ? [block.text] : [],
        ),
      ),
    ].join("\n");
    assert.doesNotMatch(allText, /\d+位/);
    assert.doesNotMatch(allText, /公式/);
  });

  it("wires discovery through home STORY, NEWS, Activities, and site metadata", async () => {
    const missCircle = activities.find((activity) => activity.id === "miss-circle");
    const liveStream = activities.find((activity) => activity.id === "live-stream");
    assert.ok(missCircle?.relatedStorySlugs.includes(STORY_SLUG));
    assert.ok(liveStream?.relatedStorySlugs.includes(STORY_SLUG));

    const vite = await read("vite.config.ts");
    const sitemap = await read("public/sitemap.xml");
    const html = await read("stories/2026-08-25-motivation/index.html");

    assert.match(
      vite,
      /storyMotivation20260825: "stories\/2026-08-25-motivation\/index\.html"/,
    );
    assert.match(vite, /storyUrl\("2026-08-25-motivation"\)/);
    assert.match(sitemap, /\/stories\/2026-08-25-motivation\//);
    assert.match(
      html,
      /rel="canonical" href="__STORY_2026_08_25_MOTIVATION_CANONICAL__"/,
    );
    assert.match(html, /"articleSection": "朝の言葉"/);
  });

  it("does not duplicate the same X posts across unrelated NEWS bodies", () => {
    const duplicates = news.filter(
      (entry) =>
        entry.id !== STORY_SLUG &&
        (entry.source === MAIN_SOURCE ||
          entry.source === CHANGE_SOURCE ||
          entry.body.includes("やる気、元気、勇気でたぞ")),
    );
    assert.deepEqual(duplicates, []);
  });
});
