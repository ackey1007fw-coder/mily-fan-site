import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-lab/data/mily-night-20261026-aggregate.json"));
const report = read("data-lab/reports/20261026-night/index.html");
const index = read("data-lab/index.html");
const vite = read("vite.config.ts");

test("10/26 night remains a unique entry without duplicating prior days", () => {
  const entries = DAILY_STREAM_ENTRIES.filter((e) => e.date === "2026-10-26");
  assert.equal(entries.length, 1);
  assert.equal(entries[0].slot, "night");
  assert.equal(entries[0].file, "mily-night-20261026-aggregate.json");
  assert.equal(entries[0].report, "/data-lab/reports/20261026-night/");
  const dates = groupByBroadcastDate().map((group) => group.date);
  assert.ok(dates.includes("2026-10-28"), "The prior Oct 28 entry remains");
  assert.ok(dates.indexOf("2026-10-28") < dates.indexOf("2026-10-26"), "Chronological order remains intact");
  assert.ok(DAILY_STREAM_ENTRIES.some((e) => e.date === "2026-10-25"));
  assert.ok(DAILY_STREAM_ENTRIES.some((e) => e.date === "2026-10-22"));
});

test("separate preliminary viewer memo is not the official nine counter series or confirmed final", () => {
  assert.equal(data.dateJst, "2026-10-26");
  assert.equal(data.session, "night");
  assert.equal(data.liveId, 23605926);
  assert.equal(data.roomId, 573253);
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.quality.endConfirmed, false);
  assert.equal(data.quality.numericEvidenceStatus, "unverified");
  assert.equal(data.quality.savedNumericObservations, null);
  assert.equal(data.partialViewerMemo.displayAtStart, 18);
  assert.equal(data.partialViewerMemo.displayNearMemoEnd, 435);
  assert.equal(data.partialViewerMemo.confirmedFinal, false);
  assert.equal(data.partialViewerMemo.comparableToVisitsMetric, false);
  assert.equal(data.partialViewerMemo.continuousSeriesVerified, false);
  assert.equal(data.observations.length, 0);
  assert.equal(data.lastValidOnline, null);
  assert.equal(Object.keys(data.metrics).length, 9);
  assert.ok(Object.values(data.metrics).every((value) => value === null));
  assert.equal(data.timingComparisonEligible, false);
  for (const metric of ["stars", "visits", "comments"]) {
    assert.equal(lastObservedValue(data, metric, data.dateJst), data.referenceSnapshot.metrics[metric]);
    assert.equal(data.referenceSnapshot.verified_final, false);
    assert.deepEqual(observationPoints(data, metric, data.dateJst), []);
  }
});

test("partial coverage and non-verbatim topics prevent false completion claims", () => {
  assert.equal(data.recording.saved, true);
  assert.equal(data.recording.metadataRecordRead, true);
  assert.equal(data.recording.processingStartedAtJst, "2026-10-26T22:30:24+09:00");
  assert.equal(data.recording.processingEndedAtJst, "2026-10-26T23:59:35+09:00");
  assert.equal(data.recording.metadataProbed, false);
  assert.equal(data.recording.actualFileDecodeVerified, false);
  assert.equal(data.recording.fullContinuityVerified, false);
  assert.equal(data.asr.status, "unverified");
  assert.equal(data.recap.endTimeVerified, false);
  assert.equal(data.recap.fullBroadcastSingingVerified, false);
  assert.equal(data.recap.approximateJstTopics.length, 7);
  assert.match(data.measurementNote, /総訪問表示/);
  assert.match(report, /23:50頃/);
  assert.match(report, /未確認/);
  assert.match(report, /18.*435/);
  assert.match(report, /全編/);
  assert.doesNotMatch(report, /<svg|<polyline|<canvas/);
});

test("data lab route, day navigation, robots and privacy rules persist", () => {
  assert.match(index, /id="night-20261026"/);
  assert.ok(index.indexOf('id="night-20261026"') < index.indexOf('id="morning-20261025"'));
  assert.match(index, /href="#night-20261026">10\/26/);
  assert.ok(vite.includes('__DATA_LAB_20261026_NIGHT_CANONICAL__'));
  assert.ok(vite.includes('dataLabNight20261026: "data-lab/reports/20261026-night/index.html"'));
  assert.match(report, /noindex,nofollow,noarchive/);
  assert.match(report, /<\/body>\s*<\/html>/);
  assert.ok(!/https?:\/\//.test(report.replace(/http-equiv="Content-Security-Policy"[^>]*>/g, "")));
  assert.doesNotMatch(report + jsonWithoutNumbers(), /drive\.google\.com|@gmail\.com|chatgpt\.site|C:\\Users|viewer[_-]?id|contributor[_-]?id|transcript\.txt|\.jsonl/i);
});
function jsonWithoutNumbers() { return JSON.stringify(data); }
