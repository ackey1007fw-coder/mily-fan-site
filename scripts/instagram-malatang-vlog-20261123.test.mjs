import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { malatangVlogReelVideo } from "../src/data/malatangVlogReelVideo.ts";
import { news } from "../src/data/news.ts";

test("malatang vlog NEWS and reel video share the confirmed details", () => {
  const item = news.find(({ id }) => id === "2026-11-23-instagram-malatang-vlog");
  assert.ok(item);
  assert.equal(news[3], item);
  assert.equal(item.date, "2026-11-23");
  assert.equal(item.title, "休日Vlog👗💖 麻辣湯はいつなんどきも食べたいのよ");
  assert.equal(item.media, malatangVlogReelVideo);
  assert.equal(item.source, "https://www.instagram.com/reel/DgFTKOTzQyJ/");
  assert.equal(item.sourceLabel, "みりぃ本人のInstagramリールを見る（11月23日）");
  assert.match(item.body, /楊國福の麻辣湯/);
  assert.match(item.body, /私の命の日記/);
  assert.deepEqual(item.xEmbed, {
    postId: "2124832680739319820",
    sourceUrl: "https://x.com/Mily_chan36/status/2124832680739319820",
    alt: "休日Vlogの編集を頑張ったことを伝え、Instagramリールへのリンクを添えたみりぃのX投稿",
  });
  assert.deepEqual(malatangVlogReelVideo, {
    id: "mily-b278-01-malatang-vlog", kind: "video",
    alt: "楊國福の麻辣湯を食べるみりぃの休日Vlog動画（Instagramリール、音声なし）",
    src: "/media/gallery/mily-b278-01-malatang-vlog.mp4",
    poster: "/media/gallery/mily-b278-01-malatang-vlog-poster.jpg",
    width: 720, height: 1280, provenance: "owner-provided",
    sourceLabel: "Instagram リール", sourceDate: "2026-11-23", published: true,
  });
});

test("public media matches the provided files", async () => {
  for (const [src, bytes, hash] of [
    [malatangVlogReelVideo.src, 8415513, "0351fce898f40a74bf8ff7c8f0f32d33e21b6d7e0ead7527d4399d1fd126a7b1"],
    [malatangVlogReelVideo.poster, 83502, "ffd1caa5e39ca59f6621434ef63bc64cf73d8f97454d8734ab771b31e84ea738"],
  ]) {
    const data = await readFile(new URL(`../public${src}`, import.meta.url));
    assert.equal(data.length, bytes);
    assert.equal(createHash("sha256").update(data).digest("hex"), hash);
  }
});
