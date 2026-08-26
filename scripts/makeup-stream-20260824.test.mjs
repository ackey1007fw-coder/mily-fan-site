import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { morningMakeupShowroomImage } from "../src/data/morningMakeupShowroomImage.ts";
import { morningMakeupInstagramStoryImage } from "../src/data/morningMakeupInstagramStoryImage.ts";
import { contest } from "../src/data/contest.ts";
import { events } from "../src/data/events.ts";
import { news, newsDisplayMedia, sortNewsByDateDesc } from "../src/data/news.ts";
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
const STORY_PHOTO = "/media/news/mily-b24-02-morning-makeup-instagram-story.jpg";
const STORY_PHOTO_FILE = path.join(root, "public", STORY_PHOTO.slice(1));
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
const STORY_PUBLIC_SIZE = 757_164;
const STORY_PUBLIC_SHA256 =
  "9951d602cc4028c252fea7c26339481618cfdddeb35c469a050918001d78d4c7";
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
  const extraAlts = (entry.additionalMedia ?? [])
    .map((media) => media.alt ?? "")
    .join("\n");
  return `${entry.title}\n${entry.body}\n${entry.message?.text ?? ""}\n${entry.media?.alt ?? ""}\n${extraAlts}`;
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
    assert.equal(news.length, 37);
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
    assert.deepEqual(ordered.slice(0, 14), [
      "2026-08-26-girlsaward-showroom-6th",
      "2026-08-26-paton-vote-stories",
      "2026-08-26-instagram-followers-400",
      "2026-08-26-morning-stream-thanks",
      "2026-08-26-girl-award-event-fanroom",
      "2026-08-26-mixch-15x-day",
      "2026-08-26-stream-1000",
      "2026-08-25-mixch-confidence-message",
      "2026-08-25-motivation",
      "2026-08-24-seasidecircle-yes-tokyo",
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

describe("2026-08-24 first makeup stream — owner-approved Story still", () => {
  it("adds the unmodified Story composition as the NEWS card's second image", async () => {
    const entry = item();
    const displayed = newsDisplayMedia(entry);

    assert.equal(entry.media, morningMakeupShowroomImage);
    assert.deepEqual(entry.additionalMedia, [morningMakeupInstagramStoryImage]);
    assert.deepEqual(displayed, [
      morningMakeupShowroomImage,
      morningMakeupInstagramStoryImage,
    ]);
    assert.equal(morningMakeupInstagramStoryImage.kind, "image");
    assert.equal(morningMakeupInstagramStoryImage.src, STORY_PHOTO);
    assert.equal(morningMakeupInstagramStoryImage.width, 1500);
    assert.equal(morningMakeupInstagramStoryImage.height, 2667);
    assert.equal(
      morningMakeupInstagramStoryImage.alt,
      "初メイク配信について理由と朝配信への感謝を伝える三橋莉子さんのInstagram Story",
    );
    assert.equal("sourceUrl" in morningMakeupInstagramStoryImage, false);
    assert.doesNotMatch(JSON.stringify(morningMakeupInstagramStoryImage), /instagram\.com/);
    assert.equal(
      existsSync(path.join(root, "src/data/morningMakeupInstagramStoryImage.ts")),
      true,
    );
    assert.equal(existsSync(STORY_PHOTO_FILE), true);
    assert.equal((await stat(STORY_PHOTO_FILE)).size, STORY_PUBLIC_SIZE);
    assert.equal(await sha256(STORY_PHOTO_FILE), STORY_PUBLIC_SHA256);

    const metadata = await sharp(STORY_PHOTO_FILE).metadata();
    assert.equal(metadata.width, 1500);
    assert.equal(metadata.height, 2667);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
    assert.equal(metadata.chromaSubsampling, "4:4:4");
    assert.equal(metadata.isProgressive, true);
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

  it("records the owner-approved surface exception without inventing a source URL", async () => {
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");
    const entry = item();

    assert.match(ops, /デフォルトでは非掲載/);
    assert.match(ops, /その素材と掲載面についてオーナーが明示承認/);
    assert.match(ops, /Latest \/ NEWS \/ Gallery \/ `\/stories\/` 等/);
    assert.match(ops, /`\/stories\/` 記事の作成を必須条件にしない/);
    assert.match(ops, /承認を別素材・別掲載面へ自動流用しない/);
    assert.doesNotMatch(ops, /`\/stories\/` の当該記事内だけへ自己ホスト/);
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
    assert.equal(existsSync(path.join(root, "src/data/morningMakeupInstagramStoryImage.ts")), true);

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
    assert.equal(liveNews[0]?.id, "2026-08-26-girlsaward-showroom-6th");
    assert.equal(liveNews[1]?.id, "2026-08-26-morning-stream-thanks");
    assert.equal(liveNews[2]?.id, "2026-08-26-girl-award-event-fanroom");
    assert.equal(liveNews[3]?.id, "2026-08-26-stream-1000");
    assert.equal(liveNews[4]?.id, "2026-08-25-motivation");
    assert.equal(liveNews[5]?.id, NEWS_ID);
    // b24-01 is the NEWS lead media, so selectActivityMedia surfaces it here the
    // same way it surfaces every other live-stream NEWS lead (b17-01, b14-01,
    // b13-01). No per-image filter is added; docs/MEDIA.md records this.
    assert.equal(
      liveMedia[0]?.src,
      "/media/news/mily-b28-01-girlsaward-showroom-6th.jpg",
    );
    assert.equal(
      liveMedia[1]?.src,
      "/media/news/mily-b27-03-morning-stream-thanks.jpg",
    );
    assert.equal(liveMedia[2]?.src, PHOTO);
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

  it("renders both stills uncropped and documents the approved NEWS-only surface", async () => {
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const docs = await readFile(path.join(root, "docs/MEDIA.md"), "utf8");
    const ops = await readFile(path.join(root, "docs/CONTENT-OPS.md"), "utf8");

    assert.match(latest, /h-auto w-full max-w-sm/);
    assert.match(latest, /object-contain/);
    assert.doesNotMatch(latest, /<img[\s\S]{0,400}object-cover/);
    assert.match(latest, /newsDisplayMedia\(item\)/);
    assert.match(docs, /batch b24/);
    assert.match(docs, /その素材と掲載面についてオーナーが\r?\n\s*明示承認/);
    assert.match(docs, /Latest \/ NEWS \/ Gallery \/ `\/stories\/` 等/);
    assert.match(docs, /NEWS代表画像の標準動作である/);
    const b24 = docs.split("## 素材台帳（batch b24")[1] ?? "";
    assert.doesNotMatch(b24, /確認資料のみ/);
    assert.doesNotMatch(b24, /視聴者表示は元画像のまま残し/);
    assert.match(b24, /b24-02/);
    assert.match(b24, /NEWSカードの2枚目/);
    assert.doesNotMatch(b24, /Latestのみ/);
    assert.match(b24, /HOME Latest \/ `\/news\/` \/ Portal Feed/);
    assert.match(b24, /`\/activities\/live\/` の「関連するメディア」/);
    assert.match(b24, /公開用のmetadata除去以外は無改変/);
    assert.match(b24, /crop・mask・scale・rotate・アップスケール・縦横比変更なし/);
    assert.match(b24, /Gallery・`\/stories\/` には追加しない/);
    assert.match(ops, /37件/);
    assert.match(ops, /初メイク配信/);
    assert.match(ops, /b24-02.*2枚目/);
    assert.doesNotMatch(docs, /16:50/);
    assert.doesNotMatch(ops, /16:50/);
  });
});
