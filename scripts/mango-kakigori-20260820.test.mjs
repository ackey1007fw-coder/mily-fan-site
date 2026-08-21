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
import { verifyMedia, verifyNews } from "./content-invariants.mjs";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "https://www.instagram.com/p/DcQqmIwk1_l/";
const NEWS_ID = "2026-08-20-mango-kakigori";
const NEWS_PHOTO = "/media/news/mily-b10-05-mango-kakigori-front.jpg";
const IDS = [
  "mily-b10-01",
  "mily-b10-02",
  "mily-b10-03",
  "mily-b10-04",
  "mily-b10-05",
];
const SLUGS = [
  "mango-kakigori-closeup",
  "mango-kakigori-spoon",
  "mango-kakigori-looking-down",
  "mango-kakigori-expression",
  "mango-kakigori-front",
];

function newsItem() {
  return news.find((item) => item.id === NEWS_ID);
}

function galleryItems() {
  return IDS.map((id) => media.find((item) => item.id === id));
}

function publicPath(relativePath) {
  return path.join(root, "public", relativePath.replace(/^\//, ""));
}

describe("2026-08-20 mango kakigori Instagram post — NEWS", () => {
  it("adds one source-backed Latest item without a duplicate url", () => {
    const item = newsItem();

    assert.ok(item);
    assert.deepEqual(verifyNews(news), []);
    assert.equal(item.date, "2026-08-20");
    assert.equal(item.source, SOURCE);
    assert.equal(item.sourceLabel, "Instagramの投稿を見る");
    assert.equal(item.url, undefined);
    const ordered = sortNewsByDateDesc(news);
    assert.equal(ordered[0].id, "2026-08-21-after-afternoon-ganda");
    assert.equal(ordered[1].id, "2026-08-21-afternoon-showroom-fanroom");
    assert.equal(ordered[2].id, "2026-08-21-event-story-next-slot");
    assert.equal(ordered[3].id, "2026-08-21-morning-ohayo-story");
    assert.equal(ordered[4].id, "2026-08-21-morning-showroom-runway");
    assert.equal(ordered[5].id, NEWS_ID);
  });

  it("summarizes only details stated in the supplied post", () => {
    const item = newsItem();

    for (const phrase of ["今年初", "マンゴー", "ヨーグルト", "はちみつ", "コムハニー"]) {
      assert.ok(item.body.includes(phrase), phrase);
    }
    for (const phrase of [
      "かわいすぎる",
      "可愛すぎる",
      "ビジュ最高",
      "神ビジュ",
      "今後の活動",
      "次回",
      "予定",
    ]) {
      assert.equal(`${item.title}${item.body}`.includes(phrase), false, phrase);
    }
  });

  it("uses the metadata-free b10-05 derivative as the self-hosted representative", async () => {
    const image = newsItem().media;

    assert.ok(image);
    assert.equal(image.kind, "image");
    assert.equal(image.src, NEWS_PHOTO);
    assert.equal(image.width, 960);
    assert.equal(image.height, 1280);
    assert.equal(
      image.alt,
      "マンゴーかき氷を前にスプーンを持ってカメラを見るみりぃ",
    );

    const metadata = await sharp(publicPath(NEWS_PHOTO)).metadata();
    assert.equal(metadata.width, image.width);
    assert.equal(metadata.height, image.height);
    assert.equal(metadata.exif, undefined);
    assert.equal(metadata.iptc, undefined);
    assert.equal(metadata.xmp, undefined);
    assert.equal(metadata.icc, undefined);
    assert.equal(metadata.orientation, undefined);

    const galleryRepresentative = publicPath(
      "/media/gallery/mily-b10-05-mango-kakigori-front-1600.jpg",
    );
    assert.deepEqual(
      await readFile(publicPath(NEWS_PHOTO)),
      await readFile(galleryRepresentative),
    );
  });

  it("flows into Portal Feed with the local NEWS image and Instagram source", () => {
    const feed = createPortalFeed({ now: new Date("2026-08-20T18:00:00+09:00") });
    const item = feed.items.find((entry) => entry.id === `mily:news:${NEWS_ID}`);

    assert.ok(item);
    assert.equal(item.sourceUrl, SOURCE);
    assert.ok(item.image?.endsWith(NEWS_PHOTO));
    assert.equal(feed.items[0].id, "mily:news:2026-08-21-after-afternoon-ganda");
    assert.equal(feed.items[1].id, "mily:news:2026-08-21-afternoon-showroom-fanroom");
    assert.equal(feed.items[2].id, "mily:news:2026-08-21-event-story-next-slot");
    assert.equal(feed.items[3].id, "mily:news:2026-08-21-morning-ohayo-story");
    assert.equal(feed.items[4].id, "mily:news:2026-08-21-morning-showroom-runway");
    assert.equal(feed.items[5].id, item.id);
  });
});

describe("2026-08-20 mango kakigori Instagram post — Gallery", () => {
  it("publishes exactly five owner-provided portrait items with confirmed source data", () => {
    const items = galleryItems();

    assert.deepEqual(verifyMedia(media), []);
    assert.equal(items.length, 5);
    assert.equal(items.every(Boolean), true);
    for (const item of items) {
      assert.equal(item.kind, "photo");
      assert.equal(item.provenance, "owner-provided");
      assert.equal(item.sourceUrl, SOURCE);
      assert.equal(item.sourceDate, "2026-08-20");
      assert.equal(item.credit, null);
      assert.equal(item.published, true);
      assert.equal(item.width, 960);
      assert.equal(item.height, 1280);
      assert.equal(item.aspect, "960 / 1280");
      assert.deepEqual(item.widths, [480, 960, 1600]);
      assert.equal(visibleMedia(media).includes(item), true);
      assert.notEqual(item.featured, true);
    }
    assert.equal(featuredPhoto(media)?.id, "mily-b01-03");
  });

  it("uses local b10 paths and situation-based alt text", () => {
    const items = galleryItems();
    const expectedAlt = [
      "マンゴーをのせたかき氷のクローズアップ",
      "スプーンを手にマンゴーかき氷を見つめるみりぃ",
      "マンゴーかき氷を前に目を閉じるみりぃ",
      "マンゴーかき氷を前にスプーンを持つみりぃ",
      "マンゴーかき氷を前にスプーンを持ってカメラを見るみりぃ",
    ];

    items.forEach((item, index) => {
      assert.equal(item.basePath, `/media/gallery/mily-b10-0${index + 1}-${SLUGS[index]}`);
      assert.equal(item.alt, expectedAlt[index]);
      assert.match(defaultSrc(item), /^\/media\/gallery\/mily-b10-/);
      for (const format of ["jpg", "webp"]) {
        assert.equal(srcSetFor(item, format).includes("http"), false);
      }
      for (const phrase of ["かわいい", "可愛い", "美人", "ビジュ", "美しい"]) {
        assert.equal(item.alt.includes(phrase), false, `${item.id}: ${phrase}`);
      }
    });
  });

  it("ships all 30 uncropped derivatives without private metadata or upscaling", async () => {
    for (const item of galleryItems()) {
      for (const requestedWidth of item.widths) {
        for (const format of ["jpg", "webp"]) {
          const file = publicPath(`${item.basePath}-${requestedWidth}.${format}`);
          assert.equal(existsSync(file), true, file);
          const metadata = await sharp(file).metadata();
          const expectedWidth = Math.min(requestedWidth, 960);

          assert.equal(metadata.width, expectedWidth, file);
          assert.equal(metadata.height, Math.round((expectedWidth * 1280) / 960), file);
          assert.equal(metadata.exif, undefined, file);
          assert.equal(metadata.iptc, undefined, file);
          assert.equal(metadata.xmp, undefined, file);
          assert.equal(metadata.icc, undefined, file);
          assert.equal(metadata.orientation, undefined, file);
        }
      }
    }
  });

  it("adds only the expected 30 Gallery derivatives and one NEWS image", async () => {
    const files = (await readdir(path.join(root, "public"), { recursive: true }))
      .map((file) => String(file).replaceAll("\\", "/"))
      .filter((file) => file.includes("mily-b10"));

    assert.equal(files.length, 31);
    assert.equal(files.filter((file) => file.startsWith("media/gallery/")).length, 30);
    assert.deepEqual(
      files.filter((file) => file.startsWith("media/news/")),
      ["media/news/mily-b10-05-mango-kakigori-front.jpg"],
    );
  });

  it("keeps all five untouched originals out of git", async () => {
    const { stdout } = await run("git", ["ls-files"], {
      cwd: root,
      maxBuffer: 1024 * 1024 * 16,
    });
    const tracked = stdout.split("\n").filter(Boolean);

    assert.equal(tracked.some((file) => file.startsWith("media/original/mily-b10")), false);
  });
});

describe("2026-08-20 mango kakigori Instagram post — scope boundaries", () => {
  it("does not add b10 content to stories, highlights, events, or Gallery videos", async () => {
    assert.equal(stories.some((item) => JSON.stringify(item).includes("mango-kakigori")), false);
    assert.equal(highlights.some((item) => JSON.stringify(item).includes("mango-kakigori")), false);
    assert.equal(events.some((item) => JSON.stringify(item).includes("mango-kakigori")), false);
    assert.equal(galleryVideos.some((item) => JSON.stringify(item).includes("mily-b10")), false);

    for (const file of [
      "src/data/stories.ts",
      "src/data/highlights.ts",
      "src/data/events.ts",
      "src/data/galleryVideos.ts",
    ]) {
      const source = await readFile(path.join(root, file), "utf8");
      assert.doesNotMatch(source, /mango-kakigori|mily-b10/);
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
});
