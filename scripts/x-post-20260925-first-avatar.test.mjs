import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { firstAvatarDistributionImages } from "../src/data/firstAvatarDistributionImages.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-09-25-first-avatar-distribution-x";
const SOURCE = "https://x.com/Mily_chan36/status/2103255202749198794";
const MESSAGE =
  "朝から配信に来てくれた皆様ありがとう╰(*´︶`*)╯♡\n" +
  "\n" +
  "昨日の夜の初アバ配布の様子をお届け🎀🩵\n" +
  "たーくさんの方に着替えてもらえて幸せです。\n" +
  "\n" +
  "みりぃさん、これからも頑張るどー‼️";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-25 X 初アバター配布の様子", () => {
  it("quotes the post and shows both screenshots on the NEWS card only", () => {
    const entry = item();
    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(sortNewsByDateDesc(news)[0], entry);
    assert.equal(entry.date, "2026-09-25");
    assert.equal(entry.sameDayOrder, undefined);
    assert.equal(entry.activityIds, undefined);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "みりぃのX投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.media, firstAvatarDistributionImages.point);
    assert.deepEqual(entry.additionalMedia, [firstAvatarDistributionImages.heart]);
    assert.equal(entry.message?.label, "みりぃのX");
    assert.equal(entry.message?.text, MESSAGE);
    assert.match(entry.body, /配信画面2枚/);
    assert.match(entry.body, /書き写していません/);
    assert.match(entry.body, /9月24日夜/);
    assert.doesNotMatch(entry.body, /あっきー|天宮|Hiro|ちゃんきー/);
    assert.doesNotMatch(entry.media.alt, /あっきー|天宮|Hiro|ちゃんきー/);
    assert.doesNotMatch(entry.additionalMedia[0].alt, /あっきー|天宮|Hiro|ちゃんきー/);
    const serialized = JSON.stringify(entry);
    assert.equal(serialized.includes("pbs.twimg.com"), false);
    assert.equal(serialized.includes("video.twimg.com"), false);
    assert.equal(
      galleryVideos.some((video) => JSON.stringify(video).includes("b160")),
      false,
    );
    assert.equal(media.some((asset) => JSON.stringify(asset).includes("b160")), false);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("ships the two self-hosted JPEGs without metadata or resizing", async () => {
    const expected = [
      [firstAvatarDistributionImages.point, 811, 1238, 168485, "0ab03ef2a033873445a12986014a135a7480398e07c9bbabef88e128492adec2"],
      [firstAvatarDistributionImages.heart, 809, 1246, 231782, "b2bd1ce66df2e67df121c81c1003dcd2c2fecb90681c69f4c5981bb0e379ce1c"],
    ];
    const sharp = (await import("sharp")).default;
    for (const [image, width, height, size, sha] of expected) {
      const file = path.join(root, "public", image.src);
      const bytes = await readFile(file);
      assert.equal(bytes.length, size, image.src);
      assert.equal(createHash("sha256").update(bytes).digest("hex"), sha, image.src);
      assert.equal(bytes.includes(Buffer.from("ICC_PROFILE")), false, image.src);
      const meta = await sharp(file).metadata();
      assert.equal(meta.format, "jpeg");
      assert.equal(meta.width, width, image.src);
      assert.equal(meta.height, height, image.src);
      assert.equal(meta.exif, undefined, image.src);
      assert.equal(meta.iptc, undefined, image.src);
      assert.equal(meta.xmp, undefined, image.src);
      assert.equal(meta.icc, undefined, image.src);
    }
  });
});
