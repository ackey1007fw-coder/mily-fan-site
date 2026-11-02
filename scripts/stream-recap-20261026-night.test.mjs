import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

const recap = streamRecaps.find(item => item.id === "2026-10-26-night-showroom");
test("10/26 night has one chronological recap with memo clock times, without invented recording offsets", () => {
  assert.equal(streamRecaps.filter(item => item.id === recap.id).length, 1);
  assert.ok(streamRecaps.indexOf(recap) < streamRecaps.findIndex(item => item.date < recap.date));
  assert.equal(recap.dateLabel, "2026.10.26（月）");
  assert.equal(recap.timestampBasis, "memo-clock");
  assert.equal(recap.broadcastLabel, "視聴メモ22:30頃〜（終了未確認）");
  assert.deepEqual(recap.highlights.map(item => item.timestamp), ["22:30頃", "22:37頃", "22:47頃", "22:57頃", "23:08頃", "23:18頃", "終盤（メモ範囲内）"]);
  assert.deepEqual(recap.timeline, []);
});
test("partial memo disclosure preserves missing original audio, counters and unknown end", () => {
  const disclosure = recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote);
  assert.match(disclosure.material, /視聴メモ.*非逐語.*暫定/);
  assert.match(disclosure.verification.join(""), /映像本体.*直接照合できず/);
  assert.match(disclosure.verification.join(""), /実尺・連続性・正式な配信開始終了は未確認/);
  assert.match(disclosure.verification.join(""), /手動聴取・逐語校正は未実施/);
  assert.match(disclosure.verification.join(""), /23:50以降/);
  assert.ok(recap.highlights.every(item => !item.quote && !item.clip && !item.socialClip));
  assert.equal(recap.songs, undefined);
  assert.equal(recap.image, undefined);
  assert.deepEqual(recap.goals, []);
  assert.deepEqual(recap.ranking, []);
  assert.equal(recap.nextNote, "");
  assert.doesNotMatch(JSON.stringify(recap), /18→435|435|5:50|23:50終了|約80分|\.mkv|drive\.google/);
});
test("the lab link targets the shared card and missing metrics remain null", () => {
  const data = JSON.parse(readFileSync("public/data-lab/data/mily-night-20261026-aggregate.json", "utf8"));
  assert.equal(data.recap.liveRecapUrl, `/activities/live/#recap-${recap.id}`);
  assert.ok(Object.values(data.metrics).every(value => value === null));
  assert.deepEqual(data.observations, []);
  assert.equal(data.timingComparisonEligible, false);
  const report = readFileSync("data-lab/reports/20261026-night/index.html", "utf8");
  assert.ok(report.includes(`href="${data.recap.liveRecapUrl}"`));
});
