import assert from "node:assert/strict";
import test from "node:test";
import { streamRecap20260916Asa, streamRecaps } from "../src/data/streamRecaps.ts";

test("9/16朝配信を登録し、日時を維持する", () => {
  assert.ok(streamRecaps.includes(streamRecap20260916Asa));
  assert.equal(streamRecap20260916Asa.date, "2026-09-16");
  assert.equal(streamRecap20260916Asa.broadcastLabel, "7:31頃〜 約94分");
});

test("9/16朝配信は確認済み実フレーム10枚を掲載する", () => {
  assert.equal(streamRecap20260916Asa.gallery?.length, 10);
  assert.equal(streamRecap20260916Asa.image, streamRecap20260916Asa.gallery?.[5]);
  assert.equal(streamRecap20260916Asa.galleryZip?.src, "/media/live/mily-b125-morning-stills.zip");
});

test("未確認の音声由来情報を補わない", () => {
  assert.equal(streamRecap20260916Asa.songs, undefined);
  assert.deepEqual(streamRecap20260916Asa.goals, []);
  assert.deepEqual(streamRecap20260916Asa.ranking, []);
  assert.equal(streamRecap20260916Asa.nextNote, "");
});
