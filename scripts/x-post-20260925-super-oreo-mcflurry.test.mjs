import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { superOreoMcflurryImage } from "../src/data/superOreoMcflurryImage.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { verifyNews } from "./content-invariants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_ID = "2026-09-25-super-oreo-mcflurry-x";
const SOURCE = "https://x.com/Mily_chan36/status/2103415595043852403";
const MESSAGE =
  "こんなに“超オレオ”を全うしてるフルーリーある？\n" +
  "君は“マックフルーリー超オレオ”の鏡だ🪞✨";

function item() {
  return news.find((entry) => entry.id === NEWS_ID);
}

describe("2026-09-25 X マックフルーリー超オレオ", () => {
  it("quotes the post and shows the photo on the NEWS card only", () => {
    const entry = item();
    assert.ok(entry);
    assert.equal(news.filter((candidate) => candidate.id === NEWS_ID).length, 1);
    assert.equal(news.filter((candidate) => candidate.source === SOURCE).length, 1);
    assert.equal(sortNewsByDateDesc(news)[0], entry);
    assert.equal(entry.date, "2026-09-25");
    assert.equal(entry.sameDayOrder, 20);
    assert.equal(entry.activityIds, undefined);
    assert.equal(entry.source, SOURCE);
    assert.equal(entry.sourceLabel, "みりぃのX投稿を見る");
    assert.equal(entry.url, undefined);
    assert.equal(entry.relatedUrl, undefined);
    assert.equal(entry.media, superOreoMcflurryImage);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.message?.label, "みりぃのX");
    assert.equal(entry.message?.text, MESSAGE);
    assert.match(entry.body, /マックフルーリー超オレオ/);
    assert.equal(entry.body, "9月25日18:25、みりぃがXで、テーブルの上のマックフルーリー超オレオの写真とともに投稿しました。");
    assert.equal(entry.media.alt, "木目のテーブルに置かれたマックフルーリー超オレオのカップ。アイスの上に砕いたオレオが乗っている");
    assert.doesNotMatch(entry.body + entry.media.alt, /手元|左手|ネイル|白い服|相手|人物|スプーン/);
    assert.doesNotMatch(entry.body, /あっきー|天宮|Hiro|ちゃんきー/);
    assert.doesNotMatch(entry.media.alt, /あっきー|天宮|Hiro|ちゃんきー/);
    const serialized = JSON.stringify(entry);
    assert.equal(serialized.includes("pbs.twimg.com"), false);
    assert.equal(serialized.includes("video.twimg.com"), false);
    assert.equal(
      galleryVideos.some((video) => JSON.stringify(video).includes("b162")),
      false,
    );
    assert.equal(media.some((asset) => JSON.stringify(asset).includes("b162")), false);
    assert.deepEqual(verifyNews([entry]), []);
  });

  it("ships the self-hosted JPEG without metadata or resizing", async () => {
    const file = path.join(root, "public", superOreoMcflurryImage.src);
    const bytes = await readFile(file);
    assert.equal(bytes.length, 316658, superOreoMcflurryImage.src);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), "59d352e1f5a7355652b787e74e5b75a3cc5a92f129384dbc13840ead39809c29", superOreoMcflurryImage.src);
    assert.equal(bytes.includes(Buffer.from("ICC_PROFILE")), false, superOreoMcflurryImage.src);
    const sharp = (await import("sharp")).default;
    const meta = await sharp(file).metadata();
    assert.equal(meta.format, "jpeg");
    assert.equal(meta.width, 1536);
    assert.equal(meta.height, 2048);
    assert.equal(meta.exif, undefined);
    assert.equal(meta.iptc, undefined);
    assert.equal(meta.xmp, undefined);
    assert.equal(meta.icc, undefined);
  });
});
