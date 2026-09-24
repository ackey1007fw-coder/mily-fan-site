import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { media } from "../src/data/media.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";
import { verifyNews } from "./content-invariants.mjs";

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
  it("adds one text-only NEWS card at the front and quotes the post", () => {
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
    assert.equal(entry.media, undefined);
    assert.equal(entry.additionalMedia, undefined);
    assert.equal(entry.message?.label, "みりぃのX");
    assert.equal(entry.message?.text, MESSAGE);
    assert.match(entry.body, /視聴者の名前と順位/);
    assert.match(entry.body, /9月24日夜/);
    assert.doesNotMatch(entry.body, /あっきー|天宮|Hiro|ちゃんきー/);
    assert.equal(JSON.stringify(entry).includes("pbs.twimg.com"), false);
    assert.equal(JSON.stringify(entry).includes("video.twimg.com"), false);
    assert.equal(
      galleryVideos.some((video) => JSON.stringify(video).includes("2103255202749198794")),
      false,
    );
    assert.equal(
      media.some((asset) => JSON.stringify(asset).includes("2103255202749198794")),
      false,
    );
    assert.deepEqual(verifyNews([entry]), []);
  });
});
