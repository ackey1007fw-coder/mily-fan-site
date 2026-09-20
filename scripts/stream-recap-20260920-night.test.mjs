import test from "node:test";
import assert from "node:assert/strict";
import {
  streamRecaps,
  streamRecap20260920Night,
  streamRecap20260920Day,
} from "../src/data/streamRecaps.ts";

test("9/20深夜レポートを同日の最新枠として1件だけ掲載する", () => {
  const recap = streamRecap20260920Night;
  assert.equal(streamRecaps.filter((r) => r.id === recap.id).length, 1);
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps[1], streamRecap20260920Day);
  assert.equal(recap.date, "2026-09-20");
  assert.equal(recap.broadcastLabel, "23:51頃〜 約83分");
});

test("9/20深夜は実フレーム10枚とZIPだけを公開する", () => {
  const recap = streamRecap20260920Night;
  assert.equal(recap.gallery?.length, 10);
  assert.equal(recap.galleryZip?.src, "/media/live/mily-b137-night-stills.zip");
  assert.ok(recap.gallery?.every((image) => image.width === 640 && image.height === 360));
  assert.ok(recap.gallery?.every((image) => image.src.startsWith("/media/live/mily-b137-")));
  assert.ok(recap.gallery?.includes(recap.image));
});
test("9/20深夜は確認できない歌唱を追加せず公開境界を守る", () => {
  const recap = streamRecap20260920Night;
  assert.equal(recap.songs, undefined);
  const publicText = JSON.stringify(recap);
  assert.doesNotMatch(publicText, /live\d{6,}|PL[A-Za-z0-9_-]{10,}|C:\\\\Users\\\\/);
  assert.match(recap.transcriptionNote, /1,935区間/);
  assert.match(recap.transcriptionNote, /全編の手動聴取・逐語校正ではありません/);
  assert.match(recap.transcriptionNote, /13位から1位/);
});

test("9/20深夜のランキングと翌朝案内を過去時制で残す", () => {
  const recap = streamRecap20260920Night;
  assert.equal(recap.ranking.length, 1);
  assert.match(recap.ranking[0], /13位/);
  assert.match(recap.ranking[0], /1位/);
  assert.match(recap.nextNote, /配信時点/);
  assert.match(recap.nextNote, /翌朝/);
  assert.match(recap.nextNote, /時間は未定/);
});
