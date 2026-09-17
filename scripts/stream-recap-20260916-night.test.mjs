import assert from "node:assert/strict";
import { test } from "node:test";
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
