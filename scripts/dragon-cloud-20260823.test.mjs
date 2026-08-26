import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { describe, it } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { events } from "../src/data/events.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import {
  defaultSrc,
  featuredPhoto,
  media,
  srcSetFor,
  visibleMedia,
} from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { createPortalFeed } from "../src/data/portalFeed.ts";
import { stories } from "../src/data/stories.ts";
import {
  assertPortalNewsFollowsSort,
  findFeedItem,
  portalNewsId,
} from "./portal-feed-order.mjs";
import { verifyMedia, verifyNews } from "./content-invariants.mjs";
import {
  DRIVE_HOST_PATTERN,
  findDriveIds,
} from "./scan-tracked-text.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "https://www.instagram.com/p/DcYbkvOk4Te/";
const NEWS_ID = "2026-08-23-dragon-cloud";
const NEWS_PHOTO = "/media/news/mily-b20-02-dragon-cloud-close.jpg";
const IDS = ["mily-b20-01", "mily-b20-02", "mily-b20-03"];
const SLUGS = ["skytree-upward", "dragon-cloud-close", "dragon-cloud-city"];
const SIZES = {
  "mily-b20-01": {
    480: [480, 361],
    960: [960, 724],
    1600: [1600, 1206],
  },
  "mily-b20-02": {
    480: [480, 360],
    960: [960, 720],
    1600: [1600, 1200],
  },
  "mily-b20-03": {
    480: [480, 360],
    960: [960, 720],
    1600: [1600, 1200],
  },
};

function newsItem() {
  return news.find((item) => item.id === NEWS_ID);
}

function galleryItems() {
  return IDS.map((id) => media.find((item) => item.id === id));
}

function publicPath(relativePath) {
  return path.join(root, "public", relativePath.replace(/^\//, ""));
}

describe("2026-08-23 dragon-cloud Instagram post — NEWS", () => {
  it("adds one source-backed Latest item without a duplicate url or contest tags", () => {
    const item = newsItem();
    const matches = news.filter((entry) => entry.id === NEWS_ID);

    assert.ok(item);
    assert.equal(matches.length, 1);
    assert.deepEqual(verifyNews(news), []);
    assert.equal(item.date, "2026-08-23");
    assert.equal(item.sameDayOrder, 5);
    assert.equal(item.activityIds, undefined);
    assert.equal(item.source, SOURCE);
    assert.equal(item.sourceLabel, "Instagramの投稿を見る");
    assert.equal(item.url, undefined);
    assert.equal(item.message, undefined);
    assert.equal(item.ctaLabel, undefined);
    assert.equal(news.length, 37);

    const ordered = sortNewsByDateDesc(news);
    assert.equal(ordered[0].id, "2026-08-26-girlsaward-showroom-6th");
    assert.equal(ordered[1].id, "2026-08-26-paton-vote-stories");
    assert.equal(ordered[2].id, "2026-08-26-instagram-followers-400");
    assert.equal(ordered[3].id, "2026-08-26-morning-stream-thanks");
    assert.equal(ordered[4].id, "2026-08-26-girl-award-event-fanroom");
    assert.equal(ordered[5].id, "2026-08-26-mixch-15x-day");
    assert.equal(ordered[6].id, "2026-08-26-stream-1000");
    assert.equal(ordered[7].id, "2026-08-25-mixch-confidence-message");
    assert.equal(ordered[8].id, "2026-08-25-motivation");
    assert.equal(ordered[9].id, "2026-08-24-seasidecircle-yes-tokyo");
    assert.equal(ordered[10].id, "2026-08-24-campus-girls-final-stage-guide");
    assert.equal(ordered[11].id, "2026-08-24-makeup-stream");
    assert.equal(ordered[12].id, "2026-08-24-night-thanks-morning-stream");
    assert.equal(ordered[13].id, NEWS_ID);
    assert.equal(ordered[14].id, "2026-08-23-seaside-circle-musical-special");
    assert.equal(ordered[15].id, "2026-08-23-morning-showroom-fanroom");
    assert.equal(ordered[16].id, "2026-08-23-early-showroom-fanroom");
    assert.equal(ordered[17].id, "2026-08-23-earthquake-showroom-fanroom");
  });

  it("summarizes only details stated in the supplied post", () => {
    const item = newsItem();
    const text = `${item.title}${item.body}`;

    for (const phrase of [
      "友達",
      "将来",
      "龍",
      "雲",
      "次のステージに進む準備が整った",
      "運気が大きく上がる",
      "いいことはちょっと信じてみる",
    ]) {
      assert.ok(text.includes(phrase), phrase);
    }
    assert.match(item.body, /らしい/);

    for (const phrase of [
      "東京スカイツリー",
      "スカイツリー",
      "Sky Bar",
      "スカイバー",
      "運気が上がった",
      "次のステージに進んだ",
      "ミスサー",
      "キャンガル",
      "ミスコン",
      "公式",
      "公認",
    ]) {
      assert.equal(text.includes(phrase), false, phrase);
    }
    assert.doesNotMatch(text, /\d{1,2}:\d{2}/);
  });

  it("uses the metadata-free b20-02 derivative as the self-hosted representative", async () => {
    const image = newsItem().media;

    assert.ok(image);
    assert.equal(image.kind, "image");
    assert.equal(image.src, NEWS_PHOTO);
    assert.equal(image.width, 1600);
    assert.equal(image.height, 1200);
    assert.equal(image.alt, "青空に龍のようにも見える白い雲が広がる様子");

    const metadata = await sharp(publicPath(NEWS_PHOTO)).metadata();
    assert.equal(metadata.width, image.width);
    assert.equal(metadata.height, image.height);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
    assert.equal(metadata.orientation, undefined);

    const galleryRepresentative = publicPath(
      "/media/gallery/mily-b20-02-dragon-cloud-close-1600.jpg",
    );
    assert.deepEqual(
      await readFile(publicPath(NEWS_PHOTO)),
      await readFile(galleryRepresentative),
    );
  });

  it("flows into Portal Feed with the local NEWS image and Instagram source", () => {
    const feed = createPortalFeed({ now: new Date("2026-08-23T13:00:00+09:00") });
    const item = findFeedItem(feed, portalNewsId(NEWS_ID));

    assertPortalNewsFollowsSort(feed, news);
    assert.equal(item.sourceUrl, SOURCE);
    assert.ok(item.image?.endsWith(NEWS_PHOTO));
  });
});

describe("2026-08-23 dragon-cloud Instagram post — Gallery", () => {
  it("publishes exactly three owner-provided landscape items with confirmed source data", () => {
    const items = galleryItems();

    assert.deepEqual(verifyMedia(media), []);
    assert.equal(items.length, 3);
    assert.equal(items.every(Boolean), true);
    for (const item of items) {
      assert.equal(item.kind, "photo");
      assert.equal(item.provenance, "owner-provided");
      assert.equal(item.sourceUrl, SOURCE);
      assert.equal(item.sourceDate, "2026-08-23");
      assert.equal(item.credit, null);
      assert.equal(item.published, true);
      assert.equal(item.aspect, undefined);
      assert.deepEqual(item.widths, [480, 960, 1600]);
      assert.equal(visibleMedia(media).includes(item), true);
      assert.notEqual(item.featured, true);
    }
    assert.equal(items[0].width, 1600);
    assert.equal(items[0].height, 1206);
    assert.equal(items[1].width, 1600);
    assert.equal(items[1].height, 1200);
    assert.equal(items[2].width, 1600);
    assert.equal(items[2].height, 1200);
    assert.equal(featuredPhoto(media)?.id, "mily-b01-03");
  });

  it("uses local b20 paths and situation-based alt text", () => {
    const items = galleryItems();
    const expectedAlt = [
      "青空を背景に足元付近から見上げた東京スカイツリー",
      "青空に龍のようにも見える白い雲が広がる様子",
      "街並みの上に広がる青空と、龍のようにも見える白い雲",
    ];

    items.forEach((item, index) => {
      assert.equal(item.basePath, `/media/gallery/mily-b20-0${index + 1}-${SLUGS[index]}`);
      assert.equal(item.alt, expectedAlt[index]);
      assert.match(defaultSrc(item), /^\/media\/gallery\/mily-b20-/);
      for (const format of ["jpg", "webp"]) {
        assert.equal(srcSetFor(item, format).includes("http"), false);
      }
      for (const phrase of ["かわいい", "可愛い", "美人", "ビジュ", "美しい"]) {
        assert.equal(item.alt.includes(phrase), false, `${item.id}: ${phrase}`);
      }
    });
  });

  it("ships all 18 uncropped derivatives without private metadata or upscaling", async () => {
    for (const item of galleryItems()) {
      for (const requestedWidth of item.widths) {
        for (const format of ["jpg", "webp"]) {
          const file = publicPath(`${item.basePath}-${requestedWidth}.${format}`);
          assert.equal(existsSync(file), true, file);
          const metadata = await sharp(file).metadata();
          const [expectedWidth, expectedHeight] = SIZES[item.id][requestedWidth];

          assert.equal(metadata.width, expectedWidth, file);
          assert.equal(metadata.height, expectedHeight, file);
          assert.equal(metadata.exif, undefined, file);
          assert.equal(metadata.iptc, undefined, file);
          assert.equal(metadata.xmp, undefined, file);
          assert.equal(metadata.icc, undefined, file);
          assert.equal(metadata.orientation, undefined, file);
        }
      }
    }
  });

  it("adds only the expected 18 Gallery derivatives and one NEWS image", async () => {
    const files = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b20"));

    assert.equal(files.length, 19);
    assert.equal(files.filter((file) => file.startsWith("media/gallery/")).length, 18);
    assert.deepEqual(
      files.filter((file) => file.startsWith("media/news/")),
      ["media/news/mily-b20-02-dragon-cloud-close.jpg"],
    );
  });

  it("keeps all three untouched originals out of git", async () => {
    const { stdout } = await run("git", ["ls-files"], {
      cwd: root,
      maxBuffer: 1024 * 1024 * 16,
    });
    const tracked = stdout.split("\n").filter(Boolean);

    assert.equal(tracked.some((file) => file.startsWith("media/original/mily-b20")), false);
  });
});

describe("2026-08-23 dragon-cloud Instagram post — scope boundaries", () => {
  it("does not add b20 content to stories, highlights, events, contest, or Gallery videos", async () => {
    assert.equal(stories.some((item) => JSON.stringify(item).includes("dragon-cloud")), false);
    assert.equal(highlights.some((item) => JSON.stringify(item).includes("dragon-cloud")), false);
    assert.equal(events.some((item) => JSON.stringify(item).includes("dragon-cloud")), false);
    assert.equal(galleryVideos.some((item) => JSON.stringify(item).includes("mily-b20")), false);

    for (const file of [
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/events.ts",
      "src/data/galleryVideos.ts",
      "src/data/contest.ts",
      "src/data/streamSchedule.ts",
      "src/data/radio.ts",
      "src/data/profile.ts",
      "src/data/socials.ts",
    ]) {
      const source = await readFile(path.join(root, file), "utf8");
      assert.doesNotMatch(source, /dragon-cloud|mily-b20|DcYbkvOk4Te/);
    }
  });

  it("keeps the existing responsive NEWS and Gallery rendering contracts", async () => {
    const latest = await readFile(path.join(root, "src/components/Latest.tsx"), "utf8");
    const gallery = await readFile(path.join(root, "src/components/Gallery.tsx"), "utf8");

    assert.match(latest, /h-auto w-full max-w-sm/);
    assert.match(latest, /object-contain/);
    assert.match(gallery, /item\.aspect \? \{ aspectRatio: item\.aspect \} : \{\}/);
    assert.match(gallery, /sm:grid-cols-2/);
  });

  it("keeps Drive handoff details out of tracked publication records", async () => {
    const published = JSON.stringify({
      news: newsItem(),
      gallery: galleryItems(),
    });

    assert.doesNotMatch(published, DRIVE_HOST_PATTERN);
    assert.deepEqual(findDriveIds(published), []);

    for (const relative of [
      "src/data/news.ts",
      "src/data/media.ts",
      "docs/CONTENT-OPS.md",
      "docs/MEDIA.md",
    ]) {
      const source = await readFile(path.join(root, relative), "utf8");
      assert.doesNotMatch(source, DRIVE_HOST_PATTERN, relative);
    }
  });
});
