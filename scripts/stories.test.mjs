import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { galleryVideos } from "../src/data/galleryVideos.ts";
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
    assert.equal(stories.length, 5);
    assert.deepEqual(visibleStories(), [
      storyBySlug("2026-08-23-musical-special"),
      storyBySlug("campus-girls-2027-second-stage-jury-award"),
      storyBySlug("second-round-result-2026"),
      storyBySlug("2026-08-18-radio"),
      story,
    ]);
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

  it("publishes the 8/18 radio story from the confirmed X post", () => {
    const story = storyBySlug("2026-08-18-radio");
    assert.ok(story);
    assert.equal(story.href, "/stories/2026-08-18-radio/");
    assert.equal(story.date, "2026-08-18");
    assert.equal(story.leadMediaId, null);
    assert.deepEqual(story.media, []);
    assert.deepEqual(story.sourceIds, ["x-2026-08-18-radio"]);
    assert.equal(
      storySources["x-2026-08-18-radio"].url,
      "https://x.com/Mily_chan36/status/2089721650522820667",
    );
    assert.equal(
      story.title,
      "「元気なみりぃに会いにきてね」——8月18日のラジオ配信",
    );
    assert.match(story.lead, /体は本調子ではないなかでもラジオ配信/);
    assert.match(story.lead, /見に来てくれた人へのお礼/);

    const lastSection = story.sections.at(-1);
    assert.equal(lastSection?.title, "翌日の配信は夜になる予定");
    assert.deepEqual(lastSection?.blocks.at(-1), {
      type: "quote",
      paragraphs: ["元気なみりぃに会いにきてね~‼︎"],
      sourceIds: ["x-2026-08-18-radio"],
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
    // 2026-08-19 に主催者と本人が公表するまで、審査結果は書かない方針だった。
    // 公表後も、結果を扱ってよいのは出典付きの専用記事だけに限る。
    const resultStorySlugs = new Set(["second-round-result-2026"]);
    const resultClaims = [
      ["2次", "突破"].join(""),
      ["2次審査", "通過"].join(""),
      ["3次", "進出"].join(""),
      ["次審査", "進出"].join(""),
    ];
    const disallowed = [
      ["成長を", "遂げた"].join(""),
      ["ファンとの", "絆"].join(""),
      ["胸を", "打つ"].join(""),
      "体調不良",
      "病気",
    ];
    for (const story of stories) {
      const text = storyText(story);
      for (const phrase of disallowed) assert.equal(text.includes(phrase), false, `${story.slug}: ${phrase}`);
      if (!resultStorySlugs.has(story.slug)) {
        for (const phrase of resultClaims) {
          assert.equal(text.includes(phrase), false, `${story.slug}: ${phrase}`);
        }
      }
      assert.equal(text.includes(["みりぃ", "らしい"].join("")), false);
      assert.equal(text.includes(["Mi", "lly"].join("")), false);
    }
  });

  it("publishes the 2次審査通過 report from the confirmed public sources", () => {
    const story = storyBySlug("second-round-result-2026");
    assert.ok(story);
    assert.equal(story.href, "/stories/second-round-result-2026/");
    assert.equal(story.date, "2026-08-19");
    assert.equal(story.badge, "2次審査通過");
    assert.equal(
      story.title,
      "MISS CIRCLE CONTEST 2026 2次審査通過！三次審査進出へ",
    );
    assert.deepEqual(story.sourceIds, [
      "x-2026-08-19-second-round-result",
      "instagram-story-2026-08-19-second-round-result",
      "misscircle-2026-third-round-post",
      "misscircle-2026-third-round-list",
      "misscircle-2026-entry-734",
    ]);
    // 一時的なStoryなので恒久URLを持たせず、非リンクlabelとして出典に並べる
    assert.equal(
      "url" in storySources["instagram-story-2026-08-19-second-round-result"],
      false,
    );
    assert.equal(
      storySources["x-2026-08-19-second-round-result"].url,
      "https://x.com/Mily_chan36/status/2089996508691390948",
    );
    assert.equal(
      storySources["misscircle-2026-third-round-post"].url,
      "https://x.com/circle_contest/status/2089986551346573523",
    );
    assert.equal(
      storySources["misscircle-2026-third-round-list"].url,
      "https://2026.misscircle.jp/list/3",
    );

    const lead = story.media.find((item) => item.id === story.leadMediaId);
    assert.equal(lead?.kind, "image");
    assert.equal(
      lead?.src,
      "/media/stories/second-round-result-2026/mily-second-round-result-autumn-leaf.jpg",
    );
    assert.equal(
      lead?.alt,
      "MISS CIRCLE CONTEST 2026の2次審査通過を報告した三橋莉子さん",
    );
    assert.equal(lead?.width, 1152);
    assert.equal(lead?.height, 2048);
  });

  it("keeps unannounced third-round details out of the result story", () => {
    const story = storyBySlug("second-round-result-2026");
    assert.ok(story);
    const text = `${storyText(story)}\n${story.media.map((item) => item.caption).join("\n")}`;
    for (const phrase of [
      "ファイナル",
      "グランプリ",
      "順位",
      "得票",
      "票数",
      "1位",
      ["三次審査", "は"].join("") + "月",
    ]) {
      assert.equal(text.includes(phrase), false, phrase);
    }
  });

  it("keeps story media local, article-only, and separate from Gallery data", async () => {
    const mediaJson = JSON.stringify(media);
    const driveHost = ["drive", "google", "com"].join(".");
    assert.equal(mediaJson.includes("/media/stories/"), false);

    // 記事専用の写真は `/media/stories/<slug>/` に置く。唯一の例外が
    // 2026-08-19 のStory動画（b09）で、Gallery の動画アーカイブと公開MP4 /
    // poster を 1 本ずつ共有する（docs/MEDIA.md）。用途別コピーを作らないための
    // 意図的な共有なので、path が Gallery のマニフェストと一致することまで見る。
    const sharedGalleryVideos = new Map(
      galleryVideos.map((video) => [video.src, video]),
    );

    for (const story of stories) {
      for (const item of story.media) {
        const shared = sharedGalleryVideos.get(item.src);
        if (shared) {
          assert.equal(item.kind, "video");
          assert.equal(item.poster, shared.poster);
          assert.equal(item.width, shared.width);
          assert.equal(item.height, shared.height);
          await access(path.join(root, "public", shared.poster.replace(/^\//, "")));
        } else {
          assert.match(item.src, new RegExp(`^/media/stories/${story.slug}/`));
        }
        assert.equal(item.src.includes(driveHost), false);
        await access(path.join(root, "public", item.src.replace(/^\//, "")));
      }
    }

    const source = await read("src/data/stories.ts");
    assert.doesNotMatch(source, /drive\.google\.com/);
    assert.doesNotMatch(source, /src\/data\/media/);
  });
});

describe("STORIES pages and discovery", () => {
  it("places the STORIES preview after Latest on the home portal", async () => {
    const app = await read("src/App.tsx");
    const latest = app.indexOf("<Latest");
    const story = app.indexOf("<Stories");
    assert.ok(latest >= 0 && story > latest);
    assert.doesNotMatch(app, /<About/);

    const navigation = await read("src/lib/navigation.ts");
    assert.match(navigation, /STORIES_ARCHIVE_ROUTE/);
  });

  it("uses the Vite multi-page entry and complete article metadata", async () => {
    const html = await read("stories/second-round-2026/index.html");
    const radioHtml = await read("stories/2026-08-18-radio/index.html");
    const vite = await read("vite.config.ts");
    assert.match(vite, /storySecondRound: "stories\/second-round-2026\/index\.html"/);
    assert.match(vite, /storyRadio20260818: "stories\/2026-08-18-radio\/index\.html"/);
    assert.match(
      vite,
      /storySecondRoundResult: "stories\/second-round-result-2026\/index\.html"/,
    );
    assert.match(
      vite,
      /storyCampusGirlsSecondStageJuryAward:[\s\S]*"stories\/campus-girls-2027-second-stage-jury-award\/index\.html"/,
    );
    assert.match(
      vite,
      /storyMusicalSpecial20260823:[\s\S]*"stories\/2026-08-23-musical-special\/index\.html"/,
    );
    assert.match(html, /src="\/src\/story-main\.tsx"/);
    assert.match(html, /rel="canonical" href="__STORY_SECOND_ROUND_CANONICAL__"/);
    assert.match(html, /property="og:type" content="article"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /"@type": "Article"/);
    assert.match(html, /"@type": "BreadcrumbList"/);
    assert.match(html, /ファンサイト（非公式）/);
    assert.match(radioHtml, /src="\/src\/story-main\.tsx"/);
    assert.match(radioHtml, /rel="canonical" href="__STORY_2026_08_18_RADIO_CANONICAL__"/);
    assert.match(radioHtml, /property="og:type" content="article"/);
    assert.match(radioHtml, /"@type": "Article"/);
    assert.match(radioHtml, /ファンサイト（非公式）/);
    assert.match(radioHtml, /x\.com\/Mily_chan36\/status\/2089721650522820667|ラジオ配信/);

    const resultHtml = await read("stories/second-round-result-2026/index.html");
    assert.match(resultHtml, /src="\/src\/story-main\.tsx"/);
    assert.match(
      resultHtml,
      /rel="canonical" href="__STORY_SECOND_ROUND_RESULT_CANONICAL__"/,
    );
    assert.match(resultHtml, /property="og:type" content="article"/);
    assert.match(resultHtml, /name="twitter:card" content="summary_large_image"/);
    assert.match(resultHtml, /"@type": "Article"/);
    assert.match(resultHtml, /"@type": "BreadcrumbList"/);
    assert.match(resultHtml, /ファンサイト（非公式）/);
    assert.match(resultHtml, /2次審査通過/);

    const campusGirlsHtml = await read(
      "stories/campus-girls-2027-second-stage-jury-award/index.html",
    );
    assert.match(campusGirlsHtml, /src="\/src\/story-main\.tsx"/);
    assert.match(
      campusGirlsHtml,
      /rel="canonical" href="__STORY_CAMPUS_GIRLS_SECOND_STAGE_JURY_AWARD_CANONICAL__"/,
    );
    assert.match(campusGirlsHtml, /property="og:type" content="article"/);
    assert.match(campusGirlsHtml, /"@type": "Article"/);
    assert.match(campusGirlsHtml, /ファンサイト（非公式）/);
    assert.match(campusGirlsHtml, /予選ファイナル進出/);

    const musicalHtml = await read("stories/2026-08-23-musical-special/index.html");
    assert.match(musicalHtml, /src="\/src\/story-main\.tsx"/);
    assert.match(
      musicalHtml,
      /rel="canonical" href="__STORY_2026_08_23_MUSICAL_SPECIAL_CANONICAL__"/,
    );
    assert.match(musicalHtml, /property="og:type" content="article"/);
    assert.match(musicalHtml, /"@type": "Article"/);
    assert.match(musicalHtml, /ファンサイト（非公式）/);
    assert.match(musicalHtml, /真夏のミュージカル特集/);
  });

  it("renders the approved video behavior without autoplay or loop", async () => {
    const page = await read("src/StoryPage.tsx");
    assert.match(page, /controls/);
    assert.match(page, /playsInline/);
    assert.match(page, /preload="none"/);
    assert.doesNotMatch(page, /autoPlay/);
    assert.doesNotMatch(page, /\sloop(?:=|\s|>)/);
  });

  it("keeps the confirmed X post clickable on the radio story page", async () => {
    const page = await read("src/StoryPage.tsx");
    assert.match(page, /ExternalLink/);
    assert.match(page, /sourceHref|storySources\[sourceId\]/);
  });
});
