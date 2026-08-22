import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { campusGirlsSecondStageResultImage } from "../src/data/campusGirlsSecondStageResultImage.ts";
import { contest } from "../src/data/contest.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { siteOrigin } from "../src/data/site.ts";
import { storyBySlug, storySources } from "../src/data/stories.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = "campus-girls-2027-second-stage-jury-award";
const newsId = "2026-08-22-campus-girls-second-stage-jury-award";
const highlightId = "campus-girls-2027-second-stage-jury-award";
const xSource = "https://x.com/mily_chan36/status/2090988000813654232";
const instagramSourceId =
  "instagram-story-2026-08-22-campus-girls-second-stage-result";

function newStory() {
  return storyBySlug(slug);
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

describe("2026-08-22 CAMPUS GIRLS 2nd STAGE milestone", () => {
  it("publishes the confirmed STORY from the本人X and non-link Instagram Story", () => {
    const story = newStory();
    assert.ok(story);
    assert.equal(story.href, `/stories/${slug}/`);
    assert.equal(story.date, "2026-08-22");
    assert.equal(story.badge, "予選ファイナル進出");
    assert.equal(
      story.title,
      "CAMPUS GIRLS 2027 予選A 2nd STAGE 審査員賞——予選ファイナル進出へ",
    );
    assert.deepEqual(story.sourceIds, [
      "x-2026-08-22-campus-girls-second-stage-result",
      instagramSourceId,
    ]);
    assert.equal(
      storySources["x-2026-08-22-campus-girls-second-stage-result"].url,
      xSource,
    );
    assert.equal("url" in storySources[instagramSourceId], false);
    assert.equal(storySources[instagramSourceId].label, "Instagram Story（2026年8月22日）");
    assert.deepEqual(
      story.sections.map((section) => section.title),
      [
        "審査員賞を受賞、予選ファイナルへ",
        "両立の難しさの中で届いたチャンス",
        "「可能性を信じて」",
        "誰かが挑戦するきっかけに",
        "予選ファイナルへ",
      ],
    );
  });

  it("keeps the article factual and does not name an unspecified parallel contest", () => {
    const story = newStory();
    assert.ok(story);
    const text = storyText(story);

    for (const phrase of [
      "審査員から高く評価された",
      "努力が認められた結果",
      "実力が証明された",
      "人気が証明された",
      "数字では測れない魅力が評価された",
      "MISS CIRCLEとの両立",
      "グランプリへ一歩近づいた",
      "次の審査は",
      "ファイナルでは",
    ]) {
      assert.equal(text.includes(phrase), false, phrase);
    }

    assert.match(text, /可能性を信じて、自分のできることをやれるだけやってみせます/);
    assert.match(text, /皆さんが何かに挑戦するきっかけの後押しになりますように/);
    assert.match(text, /もっとギア入れて頑張らせてください/);
  });

  it("uses one metadata-free result graphic in both STORY and Latest", async () => {
    const story = newStory();
    const item = news.find((entry) => entry.id === newsId);
    assert.ok(story);
    assert.ok(item);
    assert.equal(story.leadMediaId, campusGirlsSecondStageResultImage.id);
    assert.equal(story.media[0], campusGirlsSecondStageResultImage);
    assert.equal(item.media, campusGirlsSecondStageResultImage);
    assert.equal(campusGirlsSecondStageResultImage.provenance, "sns-post");
    assert.equal(campusGirlsSecondStageResultImage.sourceUrl, xSource);
    assert.equal(campusGirlsSecondStageResultImage.sourceDate, "2026-08-22");
    assert.equal(campusGirlsSecondStageResultImage.width, 1280);
    assert.equal(campusGirlsSecondStageResultImage.height, 862);

    const publicFile = path.join(
      root,
      "public",
      campusGirlsSecondStageResultImage.src.replace(/^\//, ""),
    );
    await access(publicFile);
    const metadata = await sharp(publicFile).metadata();
    assert.equal(metadata.width, 1280);
    assert.equal(metadata.height, 862);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);

    const files = await readdir(path.dirname(publicFile));
    assert.deepEqual(files, [path.basename(publicFile)]);
  });

  it("keeps the Story screenshot and this milestone out of Gallery and video data", async () => {
    const story = newStory();
    assert.ok(story);
    assert.equal(story.media.every((item) => item.kind === "image"), true);
    assert.equal(
      media.some((item) => item.id === campusGirlsSecondStageResultImage.id),
      false,
    );
    assert.equal(
      galleryVideos.some(
        (item) => item.id === campusGirlsSecondStageResultImage.id,
      ),
      false,
    );

    const trackedText = [
      await readFile(path.join(root, "src/data/stories.ts"), "utf8"),
      await readFile(
        path.join(root, "src/data/campusGirlsSecondStageResultImage.ts"),
        "utf8",
      ),
    ].join("\n");
    assert.doesNotMatch(trackedText, /instagram\.com\/stories\//);
    assert.doesNotMatch(trackedText, /drive\.google\.com/);
    assert.doesNotMatch(trackedText, /ScreenRecording_/);
  });

  it("adds a separate 2nd STAGE highlight and leaves CAMPUS GIRLS out of contest.ts", () => {
    const firstStage = highlights.find(
      (item) => item.id === "campus-girls-2027-jury-award",
    );
    const secondStage = highlights.find((item) => item.id === highlightId);
    assert.ok(firstStage);
    assert.ok(secondStage);
    assert.match(firstStage.title, /1st STAGE/);
    assert.match(secondStage.title, /2nd STAGE/);
    assert.equal(secondStage.source, xSource);
    assert.equal(JSON.stringify(contest).includes("CAMPUS GIRLS"), false);
  });

  it("leads Latest on 8/22 without inventing a publication-time order", () => {
    const item = news.find((entry) => entry.id === newsId);
    assert.ok(item);
    assert.equal(item.date, "2026-08-22");
    assert.equal(item.sameDayOrder, undefined);
    assert.equal(item.source, xSource);
    assert.equal(item.url, `/stories/${slug}/`);
    assert.equal(sortNewsByDateDesc(news)[0], item);
  });

  it("flows through the existing Portal Feed as separate NEWS and STORY items", () => {
    const feed = createPortalFeed({
      now: new Date("2026-08-22T12:00:00+09:00"),
    });
    const image = new URL(campusGirlsSecondStageResultImage.src, siteOrigin()).href;

    assert.equal(feed.items[0].id, `mily:news:${newsId}`);
    assert.equal(feed.items[0].sourceUrl, xSource);
    assert.equal(feed.items[0].image, image);
    assert.equal(feed.items[1].id, `mily:story:${slug}`);
    assert.equal(feed.items[1].url, `${siteOrigin()}/stories/${slug}/`);
    assert.equal(feed.items[1].image, image);
  });
});
