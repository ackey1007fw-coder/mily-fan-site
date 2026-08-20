import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import { verifyNews } from "./content-invariants.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const NEWS_ID = "2026-08-20-morning-message";
const SOURCE = "https://x.com/mily_chan36/status/2090242507586322892";
const PHOTO = "/media/news/mily-b08-01-do-what-you-can-morning.jpg";
const PHOTO_FILE = path.join(root, "public", PHOTO.slice(1));
/** Owner-provided post text, kept verbatim including its line breaks. */
const MESSAGE = [
  "おはよう‼︎🌞",
  "今日も自分のできることを無理せず。",
  "私もみんなと一緒に頑張るね🙂‍↕️",
  "#ミスサー #ミスサークルコンテスト #ミスサー2026 #ミスサークルコンテスト2026 #ミスサークル2026",
].join("\n");

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

async function trackedFiles() {
  const { stdout } = await run("git", ["ls-files"], {
    cwd: root,
    maxBuffer: 1024 * 1024 * 16,
  });
  return stdout.split("\n").filter(Boolean);
}

describe("2026-08-20 morning X post — Latest entry", () => {
  it("exists with the confirmed date and passes the shared news invariants", () => {
    const entry = item();

    assert.ok(entry);
    assert.equal(entry.date, "2026-08-20");
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("cites the 本人X投稿 as its primary source", () => {
    const entry = item();

    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "Xの投稿を見る");
    // 出典と別ページがないので url / ctaLabel は付けない
    assert.equal(entry.url, undefined);
    assert.equal(entry.ctaLabel, undefined);
  });

  it("keeps the post text verbatim, line breaks included", () => {
    const entry = item();

    assert.equal(entry.message?.label, "みりぃの投稿");
    assert.equal(entry.message?.text, MESSAGE);
    assert.equal(entry.message.text.split("\n").length, 4);
    assert.match(entry.message.text, /^おはよう‼︎🌞\n/);
    assert.match(entry.message.text, /今日も自分のできることを無理せず。/);
    assert.match(entry.message.text, /私もみんなと一緒に頑張るね/);
    assert.match(entry.message.text, /#ミスサークル2026$/);
  });

  it("summarises only what 本人 wrote", () => {
    const entry = item();

    assert.match(entry.title, /無理せず/);
    assert.match(entry.body, /8月20日の朝/);
    assert.match(entry.body, /自分のできることを無理せず/);
    assert.match(entry.body, /みんなと一緒に頑張る/);

    // 本人が書いていない心理・性格・決意・数値・ファンの感想を足さない
    for (const phrase of [
      "前向き", "決意", "決心", "覚悟", "余裕", "自信", "強い",
      "順位", "得票", "票数", "いいね", "リポスト", "RP", "閲覧",
      "フォロワー", "ファイナル", "グランプリ", "女子アナ",
      "公式", "公認",
    ]) {
      assert.equal(entry.title.includes(phrase), false, phrase);
      assert.equal(entry.body.includes(phrase), false, phrase);
      assert.equal(entry.message.text.includes(phrase), false, phrase);
      assert.equal(entry.media.alt.includes(phrase), false, phrase);
    }
  });
});

describe("2026-08-20 morning X post — self-hosted photo", () => {
  it("serves the photo from a local /media/news/ path, never an X image URL", () => {
    const photo = item().media;

    assert.ok(photo);
    assert.equal(photo.kind, "image");
    assert.equal(photo.src, PHOTO);
    assert.match(photo.src, /^\/media\/news\//);
    assert.equal(existsSync(PHOTO_FILE), true);

    // 外部SNS画像のhotlinkをしない
    for (const host of ["pbs.twimg.com", "twimg", "x.com", "twitter.com", "cdninstagram", "http"]) {
      assert.equal(photo.src.includes(host), false, host);
    }
  });

  it("records the real intrinsic size and carries no privacy metadata", async () => {
    const photo = item().media;
    const meta = await sharp(PHOTO_FILE).metadata();

    assert.equal(meta.format, "jpeg");
    assert.equal(photo.width, meta.width);
    assert.equal(photo.height, meta.height);
    assert.equal(meta.width, 1538);
    assert.equal(meta.height, 2048);

    // EXIF / GPS / IPTC / XMP は公開ファイルに残っていない
    assert.equal(meta.exif, undefined);
    assert.equal(meta.iptc, undefined);
    assert.equal(meta.xmp, undefined);
    assert.equal(meta.orientation, undefined);

    const bytes = await readFile(PHOTO_FILE);
    assert.equal(bytes[0], 0xff);
    assert.equal(bytes[1], 0xd8);
  });

  it("describes the situation without judging appearance", () => {
    const alt = item().media.alt;

    assert.equal(alt, "室内の鏡の前でスマートフォンを持って撮影するみりぃ");
    for (const phrase of ["かわいい", "可愛い", "美人", "綺麗", "きれい", "美しい", "スタイル"]) {
      assert.equal(alt.includes(phrase), false, phrase);
    }
  });

  it("publishes exactly one b08 file and keeps the original out of git", async () => {
    const publicFiles = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"));

    assert.deepEqual(
      publicFiles.filter((file) => file.includes("mily-b08")).sort(),
      ["media/news/mily-b08-01-do-what-you-can-morning.jpg"],
    );

    for (const file of await trackedFiles()) {
      assert.equal(file.startsWith("media/original/mily-b08"), false, file);
      if (!file.includes("mily-b08")) continue;
      assert.equal(file, "public/media/news/mily-b08-01-do-what-you-can-morning.jpg");
    }
  });
});

describe("2026-08-20 morning X post — stays Latest-only", () => {
  it("is not added to Gallery, the video archive, or /stories/", async () => {
    const storiesSource = await readFile(path.join(root, "src/data/stories.ts"), "utf8");
    const mediaSource = await readFile(path.join(root, "src/data/media.ts"), "utf8");

    assert.equal(media.some((entry) => entry.basePath.includes("mily-b08")), false);
    assert.equal(
      media.some((entry) => entry.basePath.includes("do-what-you-can-morning")),
      false,
    );
    assert.doesNotMatch(mediaSource, /mily-b08|do-what-you-can-morning/);
    assert.equal(galleryVideos.some((entry) => entry.src.includes("mily-b08")), false);
    assert.equal(stories.some((story) => story.slug.includes("do-what-you-can")), false);
    assert.doesNotMatch(storiesSource, /mily-b08|do-what-you-can-morning|2026-08-20-morning-message/);
    assert.equal(existsSync(path.join(root, "stories/2026-08-20-morning-message")), false);
  });

  it("leads the same day above the 8/20 morning Story without deleting it", () => {
    const ordered = sortNewsByDateDesc(news).map((entry) => entry.id);

    // 10:00頃の本人X投稿 → 朝のInstagram Story の順（同日ソートは既存の id 昇順仕様のまま）
    assert.equal(ordered[0], NEWS_ID);
    assert.equal(ordered[1], "2026-08-20-morning-story");
    assert.ok(news.some((entry) => entry.id === "2026-08-20-morning-story"));
  });

  it("keeps every 8/19 and earlier Latest entry", () => {
    for (const id of [
      "2026-08-19-second-round-result",
      "2026-08-19-well-rested-morning",
      "2026-08-18-evening-radio",
      "2026-08-18-morning-update",
      "2026-08-17-morning-story",
      "2026-08-02-21st-birthday",
    ]) {
      assert.ok(news.some((entry) => entry.id === id), id);
    }
    assert.equal(news.length, 8);
  });
});

describe("2026-08-20 morning X post — Portal Feed", () => {
  it("flows through the existing Portal Feed logic with the self-hosted photo", () => {
    const feed = createPortalFeed({ now: new Date("2026-08-20T12:00:00+09:00") });
    const entry = feed.items.find((candidate) => candidate.id === `mily:news:${NEWS_ID}`);

    assert.ok(entry);
    assert.equal(entry.type, "news");
    assert.equal(entry.publishedAt, "2026-08-20T00:00:00+09:00");
    assert.equal(entry.sourceUrl, SOURCE);
    assert.equal(feed.items[0].id, entry.id);

    // image は自己ホスト画像。サイト origin 上で PHOTO を指す
    assert.ok(entry.image);
    assert.ok(entry.image.endsWith(PHOTO));
    assert.equal(entry.image.includes("twimg"), false);
  });

  it("adds no per-post Portal Feed data of its own", async () => {
    const portalSource = await readFile(path.join(root, "src/data/portalFeed.ts"), "utf8");

    assert.doesNotMatch(portalSource, /2026-08-20-morning-message|mily-b08/);
  });
});

describe("2026-08-20 morning X post — responsive rendering", () => {
  it("renders the photo uncropped and cannot overflow horizontally", async () => {
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const image = latest.match(/<img[\s\S]*?\/>/);

    assert.ok(image);
    const tag = image[0];
    // 縦横比を保ったまま、幅は親に収まる。トリミングしない
    assert.match(tag, /object-contain/);
    assert.doesNotMatch(tag, /object-cover/);
    assert.match(tag, /\bw-full\b/);
    assert.match(tag, /\bh-auto\b/);
    assert.match(tag, /max-w-sm/);
    // 固定px幅は横スクロールの原因になるので使わない
    assert.doesNotMatch(tag, /className="[^"]*\bw-\[\d+px\]/);
    // 長い本文・ハッシュタグ行が枠外へはみ出さない
    assert.match(latest, /whitespace-pre-line break-words/);
  });
});
