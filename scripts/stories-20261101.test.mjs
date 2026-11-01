import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import { news } from "../src/data/news.ts";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { storiesNov01 } from "../src/data/storiesNov01.ts";

const root = new URL("../", import.meta.url);
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const expected = {
  "mily-b245-01-radio-dance-story": ["75c5b49ef002cbe8aef757cf656355015c138e9a8e55217f732584aae6750bcc", "11ac232d742629a30339a4fe0cac2fb324f983c2c2cbf013a2c6ebd956507762"],
  "mily-b245-02-radio-studio-trio-story": ["70d3d4b05a8d586f1ee9e2deee8586af8a441fb34aa3d2a0c773cbe043243c7d", "291e8a21b80854dbe1ea83111cdf630c1971395b72d4944782ed57bf296970ab"],
  "mily-b245-03-maid-bunny-vote-day4-story": ["9f624e4e24ace06af1f5663ad79e0055737c2472a18a58ce8b38e5ac964b74cd", "25d4e80fa47f1ee65fbe6b8a1d9063b8e2ad297a811c557540afdce6a68e7f5b"],
};
const radio = news.find((n) => n.id === "2026-11-01-radio-theme-talk-stories");
const maid = news.find((n) => n.id === "2026-11-01-maid-bunny-vote-day4-story");

test("two confirmed-on NEWS items with non-link Story labels and unverified upload dates", () => {
  for (const item of [radio, maid]) {
    assert.ok(item);
    assert.equal(item.date, "2026-11-01");
    assert.equal(item.dateBasis, "confirmed-on");
    assert.equal(item.source, undefined);
    assert.equal(item.sourceLabel, "Instagram Story（11月1日確認・投稿日未確認）");
    assert.match(item.body, /音声なし/);
    assert.match(item.body, /元の投稿日・撮影日/);
    assert.doesNotMatch(item.body, /師匠|まめ|drive\.google|instagram\.com\/stories/);
    assert.equal(news.filter((n) => n.id === item.id).length, 1);
  }
  assert.deepEqual(radio.activityIds, ["radio"]);
  assert.deepEqual(maid.activityIds, ["miss-circle"]);
  assert.equal(maid.relatedUrl, "/support/");
  assert.match(maid.body, /11月8日23:59/);
  assert.match(maid.body, /11月7日21:59/);
});
test("NEWS and Gallery share the same three Story videos once each", () => {
  assert.deepEqual([radio.media, ...radio.additionalMedia, maid.media], storiesNov01);
  for (const v of storiesNov01) assert.equal(galleryVideos.filter((g) => g.id === v.id).length, 1);
});
function boxes(buffer, from = 0, to = buffer.length) {
  const output = [];
  for (let i = from; i + 8 <= to;) {
    const size = buffer.readUInt32BE(i), type = buffer.toString("ascii", i + 4, i + 8);
    assert.ok(size >= 8 && i + size <= to, `valid ${type} box`);
    output.push({ type, offset: i });
    if (["moov", "trak", "mdia"].includes(type)) output.push(...boxes(buffer, i + 8, i + size));
    if (type === "hdlr") output.at(-1).handler = buffer.toString("ascii", i + 16, i + 20);
    i += size;
  }
  return output;
}
test("public MP4s and real-frame posters match reviewed bytes; video-only with faststart", () => {
  for (const v of storiesNov01) {
    assert.equal(v.width, 720);
    assert.equal(v.height, 1280);
    assert.equal(v.sourceDate, null);
    assert.equal(v.receivedDate, "2026-11-01");
    const [mp4, jpg] = expected[v.id];
    const bytes = fs.readFileSync(new URL(`public${v.src}`, root));
    assert.equal(hash(bytes), mp4);
    assert.equal(hash(fs.readFileSync(new URL(`public${v.poster}`, root))), jpg);
    const b = boxes(bytes);
    assert.deepEqual(b.filter((x) => x.type === "hdlr").map((x) => x.handler), ["vide"]);
    assert.ok(b.find((x) => x.type === "moov").offset < b.find((x) => x.type === "mdat").offset);
  }
});
