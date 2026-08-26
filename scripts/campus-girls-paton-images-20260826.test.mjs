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
import {
  campusGirlsPatonPageImage,
  campusGirlsPatonPortraitImage,
} from "../src/data/campusGirlsPatonImages.ts";
import { campusGirlsFinalStageFlyerImage } from "../src/data/campusGirlsFinalStageFlyer.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { highlights } from "../src/data/highlights.ts";
import { media } from "../src/data/media.ts";
import { news, newsDisplayMedia } from "../src/data/news.ts";
import { stories } from "../src/data/stories.ts";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-08-24-campus-girls-final-stage-guide";

const assets = [
  {
    image: campusGirlsPatonPortraitImage,
    original: "media/original/mily-b26-01-campus-girls-paton-portrait.jpg",
    originalBytes: 169_620,
    originalSha256:
      "f4de1375ec64a14ee588f6c318db7f29595b9a05828b8b44b1e918d215293e68",
    publicBytes: 252_786,
    publicSha256:
      "41c126c6ed3c9813f980f3412235a74c72f83d1fba2ebb14e290180eac8820d9",
  },
  {
    image: campusGirlsPatonPageImage,
    original: "media/original/mily-b26-02-campus-girls-paton-page.jpg",
    originalBytes: 161_230,
    originalSha256:
      "cea4996ed01d7f9a8ee8f4b75aa0748f990c0234bb0fcaced4ee08ec24cfc8f5",
    publicBytes: 227_538,
    publicSha256:
      "07347b7e45576de3da564178c5f97cbd98f36e2021f2cf9673b8bc85559af4cd",
  },
];

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

describe("2026-08-26 CAMPUS GIRLS Paton NEWS images", () => {
  it("uses the clean portrait as lead and the Paton page as the second image", () => {
    const item = news.find(({ id }) => id === NEWS_ID);

    assert.ok(item);
    assert.equal(item.media, campusGirlsPatonPortraitImage);
    assert.deepEqual(item.additionalMedia, [
      campusGirlsPatonPageImage,
      campusGirlsFinalStageFlyerImage,
    ]);
    assert.deepEqual(newsDisplayMedia(item), [
      campusGirlsPatonPortraitImage,
      campusGirlsPatonPageImage,
      campusGirlsFinalStageFlyerImage,
    ]);
    assert.equal(campusGirlsPatonPortraitImage.width, 1090);
    assert.equal(campusGirlsPatonPortraitImage.height, 1090);
    assert.equal(campusGirlsPatonPageImage.width, 928);
    assert.equal(campusGirlsPatonPageImage.height, 1280);
    assert.match(campusGirlsPatonPortraitImage.alt, /花束/);
    assert.match(campusGirlsPatonPageImage.alt, /Paton/);
  });

  it("publishes metadata-free JPEGs without cropping, scaling, or hotlinking", async () => {
    for (const asset of assets) {
      const publicFile = path.join(root, "public", asset.image.src.slice(1));

      assert.equal(existsSync(publicFile), true);
      assert.equal((await stat(publicFile)).size, asset.publicBytes);
      assert.equal(await sha256(publicFile), asset.publicSha256);
      assert.match(asset.image.src, /^\/media\/news\/mily-b26-/);
      assert.equal(asset.image.src.includes("paton.jp"), false);
      assert.equal(asset.image.src.includes("twimg"), false);

      const metadata = await sharp(publicFile).metadata();
      assert.equal(metadata.width, asset.image.width);
      assert.equal(metadata.height, asset.image.height);
      assert.equal(metadata.exif, undefined);
      assert.equal(metadata.iptc, undefined);
      assert.equal(metadata.xmp, undefined);
      assert.equal(metadata.icc, undefined);
      assert.equal(metadata.chromaSubsampling, "4:4:4");
      assert.equal(metadata.isProgressive, true);
    }
  });

  it("keeps both owner-provided originals unchanged, ignored, and out of git", async () => {
    const localOriginals = assets.filter((asset) =>
      existsSync(path.join(root, asset.original)),
    );

    assert.ok(
      localOriginals.length === 0 || localOriginals.length === assets.length,
      "local originals must be either wholly absent (CI) or wholly present",
    );

    for (const asset of assets) {
      const originalFile = path.join(root, asset.original);
      const { stdout: ignored } = await run(
        "git",
        ["check-ignore", "-v", "--", asset.original],
        { cwd: root },
      );
      const { stdout: tracked } = await run(
        "git",
        ["ls-files", "--", asset.original],
        { cwd: root },
      );

      assert.match(ignored, /media\/original\/\*/);
      assert.equal(tracked.trim(), "");

      if (existsSync(originalFile)) {
        assert.equal((await stat(originalFile)).size, asset.originalBytes);
        assert.equal(await sha256(originalFile), asset.originalSha256);
      }
    }
  });

  it("keeps the two assets out of Gallery, Story, videos, and highlights", () => {
    const serialized = [media, galleryVideos, stories, highlights].map((value) =>
      JSON.stringify(value),
    );

    for (const content of serialized) {
      assert.equal(content.includes("mily-b26"), false);
    }
  });
});
