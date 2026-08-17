import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { media } from "../src/data/media.ts";
import {
  stories,
  storyBySlug,
  storySources,
  visibleStories,
} from "../src/data/stories.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relative) {
  return readFile(path.join(root, relative), "utf8");
}

function storyText(story) {
  return [
    story.title,
    story.cardTitle,
    story.lead,
    story.cardDescription,
    ...story.sections.flatMap((section) => [
      section.title,
      ...section.blocks.flatMap((block) =>
        block.type === "paragraph"
          ? [block.text]
          : block.type === "quote"
            ? block.paragraphs
            : [],
      ),
    ]),
  ].join("\n");
}

describe("reusable STORIES content", () => {
  it("publishes the source-backed second-round story with the approved copy", () => {
    const story = storyBySlug("second-round-2026");
    assert.ok(story);
    assert.equal(stories.length, 1);
    assert.deepEqual(visibleStories(), [story]);
    assert.equal(story.href, "/stories/second-round-2026/");
    assert.equal(
      story.title,
      "「一緒に絶景観に行こう！！」——みりぃ、初めてのガチイベで2次審査を完走",
    );
    assert.equal(
      story.lead,
      "8月1日、SHOWROOM配信を始めたみりぃ。8月16日、初めての「ガチイベ」として向き合った2次審査を完走。「配信を切りたくない」と思えた最終日と、応援への感謝、「自信を持つこと」への一歩。",
    );

    const finalSection = story.sections.at(-1);
    assert.equal(finalSection?.title, "「自信を持つこと」へ、一歩前進");
    assert.deepEqual(finalSection?.blocks.at(-2), {
      type: "paragraph",
      text: "最後は、この言葉でした。",
      sourceIds: ["completion-message"],
    });
    assert.deepEqual(finalSection?.blocks.at(-1), {
      type: "quote",
      paragraphs: ["一緒に絶景観に行こう！！\n下剋上よっ🔥"],
      sourceIds: ["completion-message"],
    });
  });

  it("keeps every content block tied to the declared source ledger", () => {
    const sourceIds = new Set(Object.keys(storySources));
    for (const story of stories) {
      assert.ok(story.sourceIds.length > 0);
      assert.ok(story.sourceIds.every((sourceId) => sourceIds.has(sourceId)));
      for (const section of story.sections) {
        for (const block of section.blocks) {
          assert.ok(block.sourceIds.length > 0);
          assert.ok(block.sourceIds.every((sourceId) => sourceIds.has(sourceId)));
        }
      }
    }
  });

  it("keeps result claims and added character judgments out of the story", () => {
    const text = storyText(stories[0]);
    const disallowed = [
      ["2次", "突破"].join(""),
      ["2次審査", "通過"].join(""),
      ["3次", "進出"].join(""),
      ["次審査", "進出"].join(""),
      ["成長を", "遂げた"].join(""),
      ["ファンとの", "絆"].join(""),
      ["胸を", "打つ"].join(""),
    ];
    for (const phrase of disallowed) assert.equal(text.includes(phrase), false, phrase);
    assert.equal(text.includes(["みりぃ", "らしい"].join("")), false);
    assert.equal(text.includes(["Mi", "lly"].join("")), false);
  });

  it("keeps story media local, article-only, and separate from Gallery data", async () => {
    const story = stories[0];
    const mediaJson = JSON.stringify(media);
    assert.equal(mediaJson.includes("/media/stories/"), false);

    for (const item of story.media) {
      assert.match(item.src, /^\/media\/stories\/second-round-2026\//);
      assert.equal(item.src.includes("drive.google.com"), false);
      await access(path.join(root, "public", item.src.replace(/^\//, "")));
    }

    const source = await read("src/data/stories.ts");
    assert.doesNotMatch(source, /drive\.google\.com/);
    assert.doesNotMatch(source, /src\/data\/media/);
  });
});

describe("STORIES pages and discovery", () => {
  it("places the STORIES section between Latest and About", async () => {
    const app = await read("src/App.tsx");
    const latest = app.indexOf("<Latest />");
    const story = app.indexOf("<Stories />");
    const about = app.indexOf("<About />");
    assert.ok(latest >= 0 && story > latest && about > story);

    const navigation = await read("src/lib/navigation.ts");
    assert.match(navigation, /href: "#stories", label: "STORY"/);
  });

  it("uses the Vite multi-page entry and complete article metadata", async () => {
    const html = await read("stories/second-round-2026/index.html");
    const vite = await read("vite.config.ts");
    assert.match(vite, /storySecondRound: "stories\/second-round-2026\/index\.html"/);
    assert.match(html, /src="\/src\/story-main\.tsx"/);
    assert.match(html, /rel="canonical" href="__STORY_SECOND_ROUND_CANONICAL__"/);
    assert.match(html, /property="og:type" content="article"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /"@type": "Article"/);
    assert.match(html, /"@type": "BreadcrumbList"/);
    assert.match(html, /ファンサイト（非公式）/);
  });

  it("renders the approved video behavior without autoplay or loop", async () => {
    const page = await read("src/StoryPage.tsx");
    assert.match(page, /controls/);
    assert.match(page, /playsInline/);
    assert.match(page, /preload="none"/);
    assert.doesNotMatch(page, /autoPlay/);
    assert.doesNotMatch(page, /\sloop(?:=|\s|>)/);
  });
});
