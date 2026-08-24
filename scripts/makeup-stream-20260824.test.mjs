import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { morningMakeupShowroomImage } from "../src/data/morningMakeupShowroomImage.ts";
import { contest } from "../src/data/contest.ts";
import { events } from "../src/data/events.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { siteOrigin } from "../src/data/site.ts";
import { stories } from "../src/data/stories.ts";
import { selectActivityNews } from "../src/lib/activityContent.ts";
import { selectActivityMedia } from "../src/lib/activityMedia.ts";
import { verifyNews } from "./content-invariants.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-24-makeup-stream";
const X_SOURCE = "https://x.com/mily_chan36/status/2091668215919444138";
const INSTAGRAM_PROFILE = "https://www.instagram.com/mily_chan36";
const PHOTO = "/media/news/mily-b24-01-morning-makeup-showroom.jpg";
const PHOTO_FILE = path.join(root, "public", PHOTO.slice(1));
/**
 * b24-02 is withheld entirely: the standing Story-view screenshot exception in
 * docs/CONTENT-OPS.md limits an owner-approved still to its own /stories/
 * article and excludes Latest, so no derivative may be published on NEWS.
 */
const STORY_WITHHELD_PUBLIC = [
  "public/media/news/mily-b24-02-morning-makeup-instagram-story.jpg",
  "public/media/news/mily-b24-02-morning-makeup-instagram-story-text.jpg",
  "public/media/news/mily-b24-02-morning-makeup-instagram-story-text-only.jpg",
];
const ORIGINAL = path.join(
  root,
  "media/original/mily-b24-01-morning-makeup-showroom.jpg",
);
const STORY_ORIGINAL = path.join(
  root,
  "media/original/mily-b24-02-morning-makeup-instagram-story.jpg",
);
const ORIGINAL_SHA256 =
  "fc5df1efce0007b642876855b9fb1699acad14d03115dc5b28d470410ec407a1";
const STORY_ORIGINAL_SHA256 =
  "81666f343b37dae7696079c0b278496411c1943114a2c81da2d459261161d5fa";
const PUBLIC_SIZE = 381_783;
const PUBLIC_SHA256 =
  "f6b9841b1194ccca157f78139ef49c3b0fda1e12501f06dd679231a8f07b27ca";
const MESSAGE = [
  "おはよう！朝配信ありがとう🥹✊🏻✨",
  "ついにメイク配信してしまったｾﾞ🤦🏻‍♀️",
  "朝早くだったのに来てもらえて、コメント、キラ星、ギフトいろんな形で応援してくれているのを感じて楽しかったよ〜🫶🏻❣️",
  "次の配信は夜になるかと！また連絡しますねん♪",
  "今日も暑い。溶けないように水分補給だね🫠",
  "#ミスサー",
].join("\n");

const FORBIDDEN = [
  "心境が大きく変化した",
  "ファンへの信頼が深まった",
  "ファンとの距離を縮める決意",
  "完璧主義を克服",
  "コンプレックス",
  "自信がなかった",
  "素顔を見せる覚悟",
  "SHOWROOM史上初",
  "16:50",
  "いいね",
  "リポスト",
  "表示数",
  "ブックマーク",
];

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

function copyText(entry) {
  return `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}\n${entry.media?.alt ?? ""}`;
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

describe("2026-08-24 first makeup stream — NEWS", () => {
  it("adds one 8/24 NEWS item combining the X post and Instagram Story", () => {
    const entry = item();
    const extra = news.filter(
      (candidate) =>
        candidate.id !== NEWS_ID && candidate.id.includes("makeup-stream"),
    );

    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(extra.length, 0);
    assert.equal(entry.date, "2026-08-24");
    assert.equal(entry.sameDayOrder, 2);
    assert.deepEqual(entry.activityIds, ["live-stream"]);
    assert.equal(entry.title, "初メイク配信！朝からの応援ありがとう💄");
    assert.equal(entry.source, X_SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    assert.equal(entry.url, INSTAGRAM_PROFILE);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.equal(news.length, 27);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("keeps the confirmed X text verbatim and does not invent a Story URL", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.doesNotMatch(entry.source ?? "", /instagram\.com/);
    assert.equal(entry.url.includes("/stories/"), false);
    assert.doesNotMatch(JSON.stringify(entry), /instagram\.com\/p\//);
    assert.doesNotMatch(entry.url, /drive\.google\.com/);
  });

  it("paraphrases Story and X facts without adding interpretation", () => {
    const entry = item();
    const copy = copyText(entry);

    assert.match(entry.body, /SHOWROOMでメイク配信/);
    assert.match(entry.body, /Instagram Storyでは自身で「初メイク配信」と紹介/);
    assert.match(entry.body, /完璧な状態でみんなの前に出たい/);
    assert.match(entry.body, /皆と過ごせる時間が限られてしまい/);
    assert.match(entry.body, /「無理する」/);
    assert.match(entry.body, /断念/);
    assert.match(entry.body, /コメントやキラ星、ギフト/);
    assert.match(entry.body, /楽しかったよ〜/);
    assert.match(entry.body, /夜配信になる可能性/);
    assert.doesNotMatch(entry.body, /16:50/);
    assert.doesNotMatch(entry.body, /6:50/);
    for (const phrase of FORBIDDEN) {
      assert.equal(copy.includes(phrase), false, phrase);
    }
  });

  it("sits between Final STAGE guide and night-thanks on 8/24", () => {
    const ordered = sortNewsByDateDesc(news).map((entry) => entry.id);

    assert.deepEqual(ordered.slice(0, 4), [
      "2026-08-24-campus-girls-final-stage-guide",
      NEWS_ID,
      "2026-08-24-night-thanks-morning-stream",
      "2026-08-23-dragon-cloud",
    ]);
  });
});

describe("2026-08-24 first makeup stream — Latest-only SHOWROOM still", () => {
  it("uses one metadata-free /media/news/ JPEG and never hotlinks SNS media", async () => {
    const photo = item().media;

    assert.equal(photo, morningMakeupShowroomImage);
    assert.equal(photo?.kind, "image");
    assert.equal(photo?.src, PHOTO);
    assert.match(photo.src, /^\/media\/news\//);
    assert.equal(photo.width, 1500);
    assert.equal(photo.height, 691);
    assert.equal(existsSync(PHOTO_FILE), true);
    assert.equal((await stat(PHOTO_FILE)).size, PUBLIC_SIZE);
    assert.equal(await sha256(PHOTO_FILE), PUBLIC_SHA256);

    const metadata = await sharp(PHOTO_FILE).metadata();
    assert.equal(metadata.width, 1500);
    assert.equal(metadata.height, 691);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);

    for (const host of ["pbs.twimg.com", "twimg", "cdninstagram", "http://"]) {
      assert.equal(photo.src.includes(host), false, host);
    }
  });

  it("keeps the owner-provided original ignored and out of git", async () => {
    const relative = "media/original/mily-b24-01-morning-makeup-showroom.jpg";
    const { stdout: ignored } = await run(
      "git",
      ["check-ignore", "-v", "--", relative],
      { cwd: root },
    );
    const { stdout: tracked } = await run("git", ["ls-files", "--", relative], {
      cwd: root,
    });

    assert.match(ignored, /media\/original\/\*/);
    assert.equal(tracked.trim(), "");
    if (existsSync(ORIGINAL)) {
      assert.equal(await sha256(ORIGINAL), ORIGINAL_SHA256);
    }
  });
});

describe("2026-08-24 first makeup stream — Instagram Story still withheld", () => {
  it("publishes no Story derivative on any NEWS surface", () => {
    const entry = item();

    // The standing Story-view screenshot exception (docs/CONTENT-OPS.md) allows
    // an owner-approved still only inside its own /stories/ article and excludes
    // Latest, so this NEWS carries the SHOWROOM lead image and nothing else.
    assert.equal(entry.media, morningMakeupShowroomImage);
    assert.equal("additionalMedia" in entry, false);
    assert.equal(JSON.stringify(entry).includes("b24-02"), false);
    assert.equal(JSON.stringify(entry).includes("instagram-story"), false);
    assert.equal(
      existsSync(path.join(root, "src/data/morningMakeupInstagramStoryImage.ts")),
      false,
    );
  });

  it("keeps every b24-02 derivative out of public/ and git", async () => {
    for (const relative of STORY_WITHHELD_PUBLIC) {
      assert.equal(existsSync(path.join(root, relative)), false);
      const { stdout: tracked } = await run("git", ["ls-files", "--", relative], {
        cwd: root,
      });
      assert.equal(tracked.trim(), "");
    }

    const publicNews = await readdir(path.join(root, "public/media/news"));
    assert.equal(
      publicNews.some((name) => name.includes("b24-02")),
      false,
    );
  });

  it("keeps the Story original ignored and out of git", async () => {
    const relative = "media/original/mily-b24-02-morning-makeup-instagram-story.jpg";
    const { stdout: ignored } = await run(
      "git",
      ["check-ignore", "-v", "--", relative],
      { cwd: root },
    );
    const { stdout: tracked } = await run("git", ["ls-files", "--", relative], {
      cwd: root,
    });

    assert.match(ignored, /media\/original\/\*/);
    assert.equal(tracked.trim(), "");
    if (existsSync(STORY_ORIGINAL)) {
      assert.equal(await sha256(STORY_ORIGINAL), STORY_ORIGINAL_SHA256);
    }
  });

  it("leaves the general Story policy and the NEWS body untouched", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const entry = item();

    assert.match(ops, /例外画像は\n\s*`\/stories\/` の当該記事内だけへ自己ホストし、Latest \/ Galleryへ自動展開しない。/);
    assert.equal(entry.source, X_SOURCE);
    assert.equal(entry.url, INSTAGRAM_PROFILE);
    assert.equal(entry.ctaLabel, "Instagramプロフィールを見る");
    assert.deepEqual(entry.activityIds, ["live-stream"]);
  });
});

describe("2026-08-24 first makeup stream — no /stories/ article", () => {
  it("does not create a /stories/ article or Gallery entry for b24", async () => {
    assert.equal(existsSync(path.join(root, "stories", "2026-08-24-first-makeup-stream")), false);
    assert.equal(
      stories.some((story) => story.slug.includes("makeup")),
      false,
    );
    assert.equal(
      media.some((entry) => entry.id.includes("b24")),
      false,
    );
    assert.equal(
      galleryVideos.some((entry) => entry.id.includes("b24")),
      false,
    );

    const storiesSource = await readFile(path.join(root, "src/data/stories.ts"), "utf8");
    assert.equal(storiesSource.includes(NEWS_ID), false);
    assert.equal(storiesSource.includes("mily-b24"), false);
    assert.equal(existsSync(path.join(root, "src/data/morningMakeupInstagramStoryImage.ts")), false);

    const { stdout: trackedStoryOriginal } = await run(
      "git",
      ["ls-files", "--", "media/original/mily-b24-02-morning-makeup-instagram-story.jpg"],
      { cwd: root },
    );
    assert.equal(trackedStoryOriginal.trim(), "");
  });

  it("stays out of Gallery, highlights, events, and contest data", () => {
    assert.equal(highlights.some((entry) => entry.id.includes("makeup")), false);
    assert.equal(events.length, 0);
    assert.equal(JSON.stringify(contest).includes("makeup"), false);
  });

  it("appears once on the LIVE STREAM Activity page with only the b24-01 lead", () => {
    const liveNews = selectActivityNews("live-stream", news, news.length);
    const radioNews = selectActivityNews("radio", news, news.length);
    const liveMedia = selectActivityMedia("live-stream");

    assert.equal(liveNews.filter((entry) => entry.id === NEWS_ID).length, 1);
    assert.equal(radioNews.filter((entry) => entry.id === NEWS_ID).length, 0);
    assert.equal(liveNews[0]?.id, NEWS_ID);
    // b24-01 is the NEWS lead media, so selectActivityMedia surfaces it here the
    // same way it surfaces every other live-stream NEWS lead (b17-01, b14-01,
    // b13-01). No per-image filter is added; docs/MEDIA.md records this.
    assert.equal(liveMedia[0]?.src, PHOTO);
    assert.ok(
      ["b17-01", "b14-01", "b13-01"].every((id) =>
        liveMedia.some((entry) => String(entry.src).includes(id)),
      ),
      "other NEWS leads should surface the same way",
    );
    assert.equal(
      liveMedia.some((entry) => String(entry.src).includes("b24-02")),
      false,
    );
  });

  it("keeps Portal Feed on the SHOWROOM lead image", () => {
    const feed = createPortalFeed();
    const newsItem = findFeedItem(feed, portalNewsId(NEWS_ID));
    const image = new URL(PHOTO, siteOrigin()).href;

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(newsItem.sourceUrl, X_SOURCE);
    assert.equal(newsItem.image, image);
    assert.equal(newsItem.image.includes("b24-02"), false);
    assert.equal(
      feed.items.some((entry) => entry.id.includes("first-makeup-stream")),
      false,
    );
  });

  it("renders the SHOWROOM lead uncropped and documents the withheld Story still", async () => {
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");

    assert.match(latest, /h-auto w-full max-w-sm/);
    assert.match(latest, /object-contain/);
    assert.doesNotMatch(latest, /<img[\s\S]{0,400}object-cover/);
    assert.doesNotMatch(latest, /newsDisplayMedia/);
    assert.match(docs, /batch b24/);
    assert.match(docs, /Latestのみ/);
    // The batch note must not read as an Activity-page restriction the code breaks.
    assert.match(docs, /Activity ページを除外する\n\s*指定ではない/);
    assert.match(docs, /NEWS代表画像の標準動作である/);
    const b24 = docs.split("## 素材台帳（batch b24")[1] ?? "";
    assert.doesNotMatch(b24, /確認資料のみ/);
    assert.doesNotMatch(b24, /視聴者表示は元画像のまま残し/);
    // b24-02 is withheld: no published path, no crop recipe, no checksum.
    assert.match(b24, /非公開/);
    assert.doesNotMatch(b24, /public\/media\/news\/mily-b24-02/);
    assert.doesNotMatch(b24, /news\/mily-b24-02/);
    assert.match(ops, /27件/);
    assert.match(ops, /初メイク配信/);
    assert.match(ops, /b24-02.*(非公開|掲載しない)|Story画像は掲載していない/);
    assert.doesNotMatch(docs, /16:50/);
    assert.doesNotMatch(ops, /16:50/);
  });
});
