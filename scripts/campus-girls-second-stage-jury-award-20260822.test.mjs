import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { campusGirlsSecondStageInstagramStoryImage } from "../src/data/campusGirlsSecondStageInstagramStoryImage.ts";
import { campusGirlsSecondStageResultImage } from "../src/data/campusGirlsSecondStageResultImage.ts";
import { contest } from "../src/data/contest.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import {
  assertFeedItemBefore,
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { siteOrigin } from "../src/data/site.ts";
import { stories, storyBySlug, storySources } from "../src/data/stories.ts";

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
    assert.deepEqual(
      files.filter((file) => file.includes(campusGirlsSecondStageResultImage.id)),
      [path.basename(publicFile)],
    );
  });

  it("publishes the owner-approved Instagram Story image only inside this STORY", async () => {
    const story = newStory();
    assert.ok(story);
    assert.deepEqual(story.media, [
      campusGirlsSecondStageResultImage,
      campusGirlsSecondStageInstagramStoryImage,
    ]);
    assert.equal(story.media.every((item) => item.kind === "image"), true);
    assert.equal(
      campusGirlsSecondStageInstagramStoryImage.provenance,
      "owner-provided",
    );
    assert.equal(campusGirlsSecondStageInstagramStoryImage.sourceDate, "2026-08-22");
    assert.equal(
      "sourceUrl" in campusGirlsSecondStageInstagramStoryImage,
      false,
    );

    const storyImageBlocks = story.sections
      .flatMap((section) => section.blocks)
      .filter(
        (block) =>
          block.type === "media" &&
          block.mediaId === campusGirlsSecondStageInstagramStoryImage.id,
      );
    assert.equal(storyImageBlocks.length, 1);
    assert.deepEqual(storyImageBlocks[0].sourceIds, [instagramSourceId]);

    const publicFile = path.join(
      root,
      "public",
      campusGirlsSecondStageInstagramStoryImage.src.replace(/^\//, ""),
    );
    await access(publicFile);
    const metadata = await sharp(publicFile).metadata();
    assert.equal(metadata.width, 720);
    assert.equal(metadata.height, 1280);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);

    const item = news.find((entry) => entry.id === newsId);
    assert.ok(item);
    assert.equal(item.media, campusGirlsSecondStageResultImage);
    assert.notEqual(item.media, campusGirlsSecondStageInstagramStoryImage);
    assert.equal(
      media.some(
        (item) => item.id === campusGirlsSecondStageInstagramStoryImage.id,
      ),
      false,
    );
    assert.equal(
      galleryVideos.some(
        (item) => item.id === campusGirlsSecondStageInstagramStoryImage.id,
      ),
      false,
    );

    const trackedText = [
      await readFile(path.join(root, "src/data/stories.ts"), "utf8"),
      await readFile(
        path.join(root, "src/data/campusGirlsSecondStageResultImage.ts"),
        "utf8",
      ),
      await readFile(
        path.join(
          root,
          "src/data/campusGirlsSecondStageInstagramStoryImage.ts",
        ),
        "utf8",
      ),
    ].join("\n");
    assert.doesNotMatch(trackedText, /instagram\.com\/stories\//);
    assert.doesNotMatch(trackedText, /drive\.google\.com/);
    assert.doesNotMatch(trackedText, /ScreenRecording_/);
  });

  it("documents a narrow owner-approved milestone exception without broad Gallery reuse", async () => {
    const agents = await readFile(path.join(root, "AGENTS.md"), "utf8");
    const contentOps = await readFile(
      path.join(root, "docs/CONTENT-OPS.md"),
      "utf8",
    );
    const mediaGuide = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");

    assert.match(agents, /原則としてサイトへ掲載する/);
    assert.match(agents, /非掲載は例外とする/);
    assert.match(agents, /具体的な理由をPR本文または最終報告に残す/);
    assert.match(agents, /出典確認・プライバシー確認・第三者情報確認を省略しない/);
    assert.match(agents, /Story閲覧スクリーンショットには一般メディアより追加の安全条件がある/);
    assert.match(agents, /AI 生成・置換・補正・加工/);
    assert.match(agents, /生成塗り足しは禁止/);
    assert.match(agents, /X \/ Instagram \/ Mixch の動画ファイルを git/);
    assert.match(agents, /Mixch outbound/);

    assert.match(contentOps, /メディア掲載の上位方針/);
    assert.match(contentOps, /NEWSを文章だけで終わらせず/);
    assert.match(contentOps, /節目Storyでも、確認済みの画像・動画を積極的に使用する/);
    assert.match(contentOps, /Gallery向きでない結果グラフィックや記録資料でも、Story \/ NEWS向きなら/);
    assert.match(contentOps, /一般メディアの掲載ゲートを通過しただけでは公開しない/);

    assert.match(mediaGuide, /掲載ゲートを通過したオーナー提供・掲載承認済み素材は、原則としてサイトへ掲載する/);
    assert.match(mediaGuide, /「安全なので載せない」を理由にせず/);
    for (const reason of [
      "プライバシー上の問題",
      "識別可能な第三者情報",
      "出典 / 権利が未確認",
      "既存公開素材との重複",
      "公開用として不足する品質",
      "文脈に合う掲載面がない",
      "技術的問題",
    ]) {
      assert.match(mediaGuide, new RegExp(reason.replace("/", "\\/")), reason);
    }

    for (const phrase of [
      "デフォルトでは非掲載",
      "その素材と掲載面についてオーナーが明示承認",
      "`/stories/` 記事の作成を必須条件にしない",
      "承認を別素材・別掲載面へ自動流用しない",
      "掲載面の承認範囲",
    ]) {
      assert.match(contentOps, new RegExp(phrase.replace("/", "\\/")), phrase);
    }
    assert.doesNotMatch(contentOps, /`\/stories\/` の当該記事内だけへ自己ホスト/);
    assert.match(mediaGuide, /当該Story記事のみ \/ Latest・Gallery禁止/);
    assert.match(mediaGuide, /crop・scale・rotate・アップスケール・縦横比変更・内容削除なし/);
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

  it("keeps the campus milestone on 8/22 after same-day Fan Room updates", () => {
    const item = news.find((entry) => entry.id === newsId);
    assert.ok(item);
    assert.equal(item.date, "2026-08-22");
    assert.equal(item.sameDayOrder, undefined);
    assert.equal(item.source, xSource);
    assert.equal(item.url, `/stories/${slug}/`);
    const aug22 = sortNewsByDateDesc(news.filter((entry) => entry.id !== "2026-08-27-mixch-expressive").filter((entry) => entry.id !== "2026-08-27-seaside-circle-movie-theme-story").filter((entry) => entry.id !== "2026-08-27-miss-circle-showroom-story"))
      .filter((entry) => entry.date === "2026-08-22")
      .map((entry) => entry.id);
    assert.deepEqual(aug22, [
      "2026-08-22-night-showroom-thanks",
      "2026-08-22-night-showroom-fanroom",
      "2026-08-22-evening-showroom-fanroom",
      newsId,
    ]);
    assert.equal(aug22[3], item.id);
  });

  it("flows through the existing Portal Feed as separate NEWS and STORY items", () => {
    const newsItems = news.filter((item) => item.date <= "2026-08-22");
    const storyItems = stories.filter((story) => story.date <= "2026-08-22");
    const feed = createPortalFeed({
      now: new Date("2026-08-22T12:00:00+09:00"),
      newsItems,
      storyItems,
    });
    const image = new URL(campusGirlsSecondStageResultImage.src, siteOrigin()).href;
    const newsItem = findFeedItem(feed, portalNewsId(newsId));
    const storyItem = findFeedItem(feed, `mily:story:${slug}`);

    assertPortalNewsFollowsSort(feed, newsItems);
    assertFeedItemBefore(feed, newsItem.id, storyItem.id);
    assert.equal(newsItem.sourceUrl, xSource);
    assert.equal(newsItem.image, image);
    assert.equal(storyItem.url, `${siteOrigin()}/stories/${slug}/`);
    assert.equal(storyItem.image, image);
    const ids = feed.items.map((entry) => entry.id);
    assert.ok(
      ids.indexOf(`mily:news:${newsId}`) >
        ids.indexOf("mily:news:2026-08-22-evening-showroom-fanroom"),
    );
  });
});
