import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-lab/data/mily-morning2-20261030-aggregate.json"));
const id = "2026-10-30-morning2-showroom";
const recap = streamRecaps.find(r => r.id === id);
const report = read("data-lab/reports/20261030-morning2/index.html");

test("morning2: source identity, nulls, unique observations and partial totals", () => {
  assert.equal(data.liveId, 23620643); assert.equal(data.roomId, 573253);
  assert.equal(data.session, "morning2"); assert.equal(data.dateJst, "2026-10-30");
  assert.equal(data.observations.length, 40); assert.equal(new Set(data.observations.map(p => p.atJst)).size, 40);
  assert.equal(data.observations[0].atJst, "2026-10-30T06:02:03.360+09:00");
  assert.equal(data.observations[0].visits, null);
  assert.equal(data.lastValidOnline.atJst, "2026-10-30T06:08:50.943+09:00");
  assert.deepEqual(data.metrics, { stars: 961, visits: 37, comments: 50, firstVisits: 1, repeatVisits: 0, newFollows: 0, otherFree: 60, star100People: 9, recommendedCommentPeople: 9 });
  for (const key of ["finalServiceValueVerified", "completeCoverageConfirmed", "timingComparisonEligible"]) assert.equal(data[key], false);
  assert.equal(data.quality.endConfirmed, false); assert.equal(data.lastValidOnline.confirmedFinal, false);
  assert.equal(data.quality.numericTimelineRows, 63); assert.equal(data.quality.duplicateProgressRowsNotSummed, 23);
  assert.equal(data.recording.nonzeroSavedFragments, 6); assert.equal(data.recording.durationSeconds, null);
  assert.equal(data.recording.completeCoverageConfirmed, false); assert.equal(data.recording.allFragmentsExitedNormally, false);
  for (const metric of ["stars", "visits", "comments"]) {
    const points = observationPoints(data, metric, data.dateJst);
    assert.equal(points.length, data.observations.filter(p => p[metric] !== null).length);
    assert.equal(lastObservedValue(data, metric, data.dateJst), data.metrics[metric]);
    assert.ok(points.slice(1).every((p, i) => p.time > points[i].time && p.value >= points[i].value));
    const circles = [...report.matchAll(/<circle data-series="([^"]+)" data-at="([^"]+)" data-value="(\d+)"/g)].filter(match => match[1] === metric);
    assert.deepEqual(circles.map(match => [match[2], Number(match[3])]), data.observations.filter(p => p[metric] !== null).map(p => [p.atJst, p[metric]]));
  }
  const csv = read("public/data-lab/data/mily-morning2-20261030-observations.csv").trimEnd().split("\n");
  assert.equal(csv.length, 41); const keys = csv[0].split(",");
  csv.slice(1).forEach((line,i) => line.split(",").forEach((cell,j) => assert.equal(cell, data.observations[i][keys[j]] === null ? "" : String(data.observations[i][keys[j]]))));
});

test("morning2: distinct recap and archive slots, original morning-one evidence preserved", () => {
  assert.ok(recap); assert.equal(streamRecaps.filter(r => r.id === id).length, 1);
  const first = streamRecaps.find(r => r.id === "2026-10-30-morning1-showroom"); assert.ok(first);
  assert.ok(streamRecaps.indexOf(recap) < streamRecaps.indexOf(first));
  assert.equal(recap.timestampBasis, "asr-clock"); assert.equal(recap.highlights.length, 2);
  assert.match(recap.transcriptionNote, /冒頭100秒/); assert.match(recap.transcriptionNote, /原音の手動聴取・逐語校正・映像との同期は未確認/);
  assert.ok(recap.highlights.every(h => !h.quote && !h.clip && !h.socialClip));
  assert.equal(recap.image, undefined); assert.equal(recap.gallery, undefined);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json")).find(r => r.id === id);
  assert.equal(ledger.originalNote, recap.transcriptionNote);
  assert.deepEqual(ledger.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
  const day = groupByBroadcastDate().find(g => g.date === "2026-10-30");
  assert.deepEqual(day.entries.map(e => e.slot), ["morning2", "morning1"]);
  assert.equal(DAILY_STREAM_ENTRIES.filter(e => e.file === "mily-morning2-20261030-aggregate.json").length, 1);
  const old = JSON.parse(read("public/data-lab/data/mily-morning1-20261030-aggregate.json"));
  assert.equal(old.observations.length, 100); assert.equal(old.liveId, 23620568); assert.equal(old.metrics.stars, 1898);
});

test("morning2: static charts, privacy and no invented finished video", () => {
  assert.equal((report.match(/<svg /g) || []).length, 3);
  assert.doesNotMatch(report, /<polyline|<path|<video|<audio|<img/);
  assert.match(report, /961は最終結果ではありません/); assert.match(report, /数値の終了確認は未成立/);
  assert.match(report, /写真・短尺は未掲載/); assert.match(report, /noindex,nofollow,noarchive/);
  assert.doesNotMatch(report + JSON.stringify(data) + JSON.stringify(recap), /drive[.]google[.]com|@gmail[.]com|chatgpt[.]site|viewer[_-]?id|contributor[_-]?id|live-transcript[.]txt|ui-raw[.]jsonl/i);
  assert.match(read("vite.config.ts"), /__DATA_LAB_20261030_MORNING2_CANONICAL__/);
  assert.match(read("vite.config.ts"), /reports\/20261030-morning2\/index.html/);
});
