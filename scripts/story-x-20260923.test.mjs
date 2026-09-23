import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { it } from "node:test";
import { galleryVideos } from "../src/data/galleryVideos.ts";
import { news, sortNewsByDateDesc } from "../src/data/news.ts";

const xUrl = "https://x.com/Mily_chan36/status/2102557553435836694";
const [x, morningStory, patonStory] = sortNewsByDateDesc(news).slice(0, 3);

it("archives the X post and both Stories without turning the evening plan into a current schedule", () => {
  assert.deepEqual(
    [x.id, morningStory.id, patonStory.id],
    [
      "2026-09-23-morning-commute-x",
      "2026-09-23-morning-commute-story",
      "2026-09-23-paton-thanks-story",
    ],
  );
  assert.equal(x.source, xUrl);
  assert.match(x.body, /投稿時点の予定/);
  assert.equal(morningStory.source, undefined);
  assert.equal(morningStory.sourceLabel, "Instagram Story");
  assert.equal(patonStory.media, undefined);
  assert.doesNotMatch(patonStory.body, /10,350|8,649|2,550|タカちゃん|ヒゲおやじ/);
});

it("shares each owner-provided video with Gallery and keeps original metadata out of public files", async () => {
  for (const item of [x.media, morningStory.media]) {
    assert.equal(galleryVideos.filter((video) => video === item).length, 1);
    assert.equal(item.width, 512);
    assert.equal(item.height, 910);
    const video = await readFile(new URL(`../public${item.src}`, import.meta.url));
    const poster = await readFile(new URL(`../public${item.poster}`, import.meta.url));
    assert.ok(video.indexOf("moov") > 0 && video.indexOf("moov") < video.indexOf("mdat"));
    assert.equal(poster.readUInt16BE(0), 0xffd8);
    assert.ok(!video.includes(Buffer.from("Core Media")));
  }
});
