import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
import { DAILY_STREAM_ENTRIES, SLOT_LABELS, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-lab/data/mily-morning1-20261030-aggregate.json"));
const id = "2026-10-30-morning1-showroom";
const recap = streamRecaps.find(r => r.id === id);

test("10/30 morning1: isolated identity, 100 unique progress timestamps, and nonfinal values", () => {
  assert.equal(data.liveId, 23620568); assert.equal(data.roomId, 573253);
  assert.equal(data.session, "morning1"); assert.equal(data.dateJst, "2026-10-30");
  assert.equal(data.observations.length, 100);
  assert.equal(new Set(data.observations.map(p => p.atJst)).size, 100);
  assert.equal(data.lastValidOnline.atJst, "2026-10-30T05:17:50.969+09:00");
  assert.deepEqual(data.metrics, { stars: 1898, visits: 129, comments: 77, firstVisits: 9, repeatVisits: 6, newFollows: 1, otherFree: 10, star100People: 18, recommendedCommentPeople: 21 });
  assert.equal(data.finalServiceValueVerified, false); assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.timingComparisonEligible, false); assert.equal(data.lastValidOnline.confirmedFinal, false);
  assert.equal(data.quality.endConfirmed, false); assert.equal(data.quality.numericTimelineRows, 194);
  assert.equal(data.quality.freshRows, 189); assert.equal(data.quality.duplicateProgressRowsNotSummed, 89);
  assert.equal(data.observations[0].visits, null);
  for (const [metric, value] of [["stars", 1898], ["visits", 129], ["comments", 77]]) {
    assert.equal(lastObservedValue(data, metric, data.dateJst), value);
    const points = observationPoints(data, metric, data.dateJst);
    assert.equal(points.length, data.observations.filter(p => p[metric] !== null).length);
    assert.ok(points.every(p => p.time <= Date.parse(data.lastValidOnline.atJst)));
    assert.ok(points.slice(1).every((p, i) => p.time > points[i].time && p.value >= points[i].value));
  }
  assert.deepEqual(data.selectedObservations.map(p => p.stars), [0, 813, 1066, 1598, 1898]);
  const csv = read("public/data-lab/data/mily-morning1-20261030-observations.csv").trimEnd().split("\n");
  assert.equal(csv.length, 101);
  const keys = csv[0].split(",");
  csv.slice(1).forEach((line, i) => line.split(",").forEach((cell, j) => assert.equal(cell, data.observations[i][keys[j]] === null ? "" : String(data.observations[i][keys[j]]))));
});

test("10/30 morning1: ASR-only recap, archive navigation, and exact disclosure ledger", () => {
  assert.ok(recap); assert.equal(streamRecaps.filter(r => r.id === id).length, 1);
  assert.equal(recap.timestampBasis, "asr-clock"); assert.equal(recap.highlights.length, 4);
  assert.equal(recap.gallery, undefined); assert.equal(recap.image, undefined); assert.equal(recap.songs, undefined);
  assert.ok(recap.highlights.every(h => !h.clip && !h.socialClip && !h.quote));
  assert.match(recap.transcriptionNote, /冒頭・終盤/); assert.match(recap.transcriptionNote, /原音の手動聴取・逐語校正は未実施/);
  assert.equal(recap.ranking.length, 0); assert.equal(recap.timeline.length, 0);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === id);
  assert.ok(record); assert.equal(record.source, recap.sourceLabel);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
  const entry = DAILY_STREAM_ENTRIES.find(e => e.date === "2026-10-30" && e.slot === "morning1");
  assert.ok(entry); assert.equal(entry.report, "/data-lab/reports/20261030-morning1/");
  assert.match(SLOT_LABELS.morning1, /朝1枠目/);
  const home = read("data-lab/index.html");
  assert.ok(home.indexOf('id="morning1-20261030"') < home.indexOf('id="noon-20261029"'));
});

test("10/30 morning1: privacy, missing-tail disclosure, and build entry", () => {
  const report = read("data-lab/reports/20261030-morning1/index.html");
  const js = read("public/data-lab/assets/morning1-20261030.js");
  const vite = read("vite.config.ts");
  assert.match(report, /noindex,nofollow,noarchive/);
  assert.match(report, /1,898は最終結果ではありません/);
  assert.match(report, /数値の終了確認は未成立/);
  assert.match(report, /原音の手動聴取・逐語校正は未実施/);
  assert.match(report, /機能の切替条件を確認したものではありません/);
  assert.match(vite, /__DATA_LAB_20261030_MORNING1_CANONICAL__/);
  assert.match(vite, /data-lab\/reports\/20261030-morning1\/index.html/);
  assert.match(js, /value === null/); assert.doesNotMatch(js, /createElementNS\([^\n]*["'](?:polyline|path)["']/);
  assert.doesNotMatch(report + JSON.stringify(data) + JSON.stringify(recap), /drive[.]google[.]com|@gmail[.]com|chatgpt[.]site|viewer[_-]?id|contributor[_-]?id|live-transcript[.]txt|ui-raw[.]jsonl|C:\\\\Users/i);
  assert.doesNotMatch(report, /<img|<video|<audio/);
});
