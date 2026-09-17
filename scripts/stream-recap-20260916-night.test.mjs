import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { streamRecap20260916Yoru as recap, streamRecap20260916Asa, streamRecaps } from "../src/data/streamRecaps.ts";

test("September 16 night is registered once immediately before its morning", () => {
  assert.equal(streamRecaps.filter(({ id }) => id === recap.id).length, 1);
  const index = streamRecaps.indexOf(recap);
  assert.ok(index >= 0);
  assert.equal(streamRecaps[index + 1], streamRecap20260916Asa);
  assert.equal(recap.date, "2026-09-16");
  assert.equal(recap.broadcastLabel, "22:01頃〜 約102分");
});
test("September 16 night discloses the recorded range and automatic transcription limits", () => {
  assert.match(recap.transcriptionNote, /6144\.746秒/);
  assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
  assert.match(recap.transcriptionNote, /全編.*保証しません/);
  assert.match(recap.transcriptionNote, /329区間/);
  assert.ok(recap.timeline.every(({ timestamp }) => timestamp.split(":").reduce((a, b) => a * 60 + Number(b), 0) <= 6144.746));
});
test("September 16 night retains only confirmed figures and historical scheduling", () => {
  assert.deepEqual(recap.ranking, ["配信中に、13位から1位までランキングを読み上げました。個人名は掲載していません。"]);
  assert.deepEqual(recap.goals, [{ item: "フォロワー", target: "300人", statusThen: "270人を喜ぶ" }]);
  assert.match(recap.nextNote, /配信時点では、翌9月17日/);
  assert.match(recap.nextNote, /時刻は未定/);
  assert.equal(recap.songs, undefined);
  assert.doesNotMatch(JSON.stringify(recap), /drive\.google|docs\.google|room_id|live_id|\.mkv|[\\/]Users[\\/]|承認待ち|準備中|https?:\/\//i);
});

const approvedStillHashes = [
  "3a0dac1bb0568a2e914d85b14fb5b0b5f49c5100d2c3078a87a438ddd2436568",
  "774572ef541e44c8510952e8be4af506c22529769ab0defe3d7fa2ed003b3c74",
  "437393d6d85623fe7ee278e49144115476e95f3ba1bf3b294d381faa132c2107",
  "195f1a413d3fb1d780083e804593cf04192043821d3ad49ebd40af941265994c",
  "b46c69154b5cfb4108be0783e7b1ec8a5789ff1e779d1c43c6b43251586b8d91",
  "9e0d778deb4803d1b48eeb32858720c666b1f5b995f0c62c2ee063550eafeb27",
  "bf605979a15a57eb1a721c5efc50a25e2c0bf2e3019c720f974f7273841e3f4c",
  "8ce076f35a253680ee32c70543db39f06bdb1da8dcdb1ac54f88c26bd10b8c78",
  "199616dc7f7b2a426848c7e37d5d6786b3a674ce1de292f57e5da42986b53bac",
  "52da16c571561649ac906902de7dafcd0c91eea4d0234e67e9943f58c3d9a665",
];
const approvedStillTimes = ["0:09:39", "0:23:00", "0:33:38", "0:44:20", "1:01:41", "1:13:58", "1:29:40", "1:33:40", "1:37:40", "1:42:08"];

test("September 16 night publishes the ten owner-approved recording frames", async () => {
  assert.equal(recap.gallery?.length, 10);
  assert.equal(recap.image, recap.gallery?.[4]);
  assert.equal(recap.galleryZip?.src, "/media/live/mily-b127-night-stills.zip");
  for (const [index, image] of (recap.gallery ?? []).entries()) {
    assert.equal(image.src, `/media/live/mily-b127-${String(index + 1).padStart(2, "0")}-night.jpg`);
    assert.equal(image.width, 640);
    assert.equal(image.height, 360);
    assert.ok(image.caption?.startsWith(approvedStillTimes[index]));
    const bytes = await readFile(new URL(`../public${image.src}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), approvedStillHashes[index]);
  }
  assert.match(recap.transcriptionNote, /実フレーム10枚/);
});
