import assert from "node:assert/strict";
import test from "node:test";
import { streamRecap20260920Asa as recap, streamRecaps } from "../src/data/streamRecaps.ts";

test("9/20朝配信を実素材つきで掲載する", () => {
  assert.equal(streamRecaps.find((item) => item.id === recap.id), recap);
  assert.equal(recap.date, "2026-09-20");
  assert.equal(recap.broadcastLabel, "5:30頃〜 約113分");
  assert.equal(recap.gallery.length, 10);
  assert.ok(recap.gallery.includes(recap.image));
  assert.match(recap.galleryZip.src, /mily-b134-morning-stills\.zip$/);
  assert.equal(recap.songs.length, 1);
  assert.equal(recap.songs[0].title, "weeeek");
  assert.equal(recap.songs[0].artist, "NEWS");
  assert.equal(recap.songs[0].clip, undefined);
});

test("公開SNSへは本人トークだけを4媒体へ案内し、歌唱動画を混ぜない", () => {
  const row = recap.highlights.find(x => x.socialClip);
  assert.ok(row);
  assert.equal(row.timestamp, "1:30:32");
  assert.equal(row.clip, undefined);
  assert.equal(row.socialClip.durationSeconds, 16.1);
  assert.deepEqual(row.socialClip.links.map(x => x.platform), ["youtube", "tiktok", "instagram", "x"]);
  assert.equal(row.socialClip.links.length, 4);
  assert.doesNotMatch(JSON.stringify(recap), /1NNS7mXlBDE|live23450098|mily_showroom_2026/);
});
