import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const signal = JSON.parse(read("public/data-lab/data/mily-night-20261101-aggregate.json"));
const report = read("data-lab/reports/20261101-night/index.html");
const labIndex = read("data-lab/index.html");
const csv = read("public/data-lab/data/mily-night-20261101-observations.csv").trim().split("\n");

test("20261101-night SIGNAL: separate entry, 11 partial observations, not a final", () => {
  const entries = DAILY_STREAM_ENTRIES.filter(e => e.date === "2026-11-01" && e.slot === "night");
  assert.equal(entries.length, 1);
  assert.equal(signal.liveId, 23633097);
  assert.equal(signal.session, "night");
  assert.equal(signal.observations.length, 11);
  assert.equal(csv.length, 12);
  assert.deepEqual(signal.metrics, {"stars": 2641, "visits": 78, "comments": 195, "firstVisits": 4, "repeatVisits": 1, "newFollows": 0, "otherFree": 1180, "star100People": 25, "recommendedCommentPeople": 25});
  assert.equal(signal.lastValidOnline.atJst, "2026-11-01T22:58:31+09:00");
  assert.equal(signal.lastValidOnline.confirmedFinal, false);
  assert.equal(signal.finalServiceValueVerified, false);
  assert.equal(signal.completeCoverageConfirmed, false);
  assert.equal(signal.timingComparisonEligible, false);
  assert.equal(signal.quality.gaps.length, 2);
  assert.equal(lastObservedValue(signal, "stars", signal.dateJst), signal.metrics.stars);
  assert.equal(observationPoints(signal, "stars", signal.dateJst).length, 11);
  for (const o of signal.observations) assert.equal(Object.keys(o).length, 10);
  assert.equal(signal.recap.liveRecapUrl, "/activities/live/#recap-2026-11-01-night-showroom");
});

test("20261101-night SIGNAL: report, lab home and routes stay consistent and anonymous", () => {
  assert.match(report, /途中の参考値で、確定合計ではありません/);
  assert.match(report, /22:58:31以降/);
  assert.match(report, /noindex,nofollow,noarchive/);
  assert.ok(labIndex.indexOf('id="night-20261101"') < labIndex.indexOf('id="noon-20261101"'));
  assert.match(labIndex, /href="#night-20261101">11\/1 夜/);
  const vite = read("vite.config.ts");
  assert.ok(vite.includes("__DATA_LAB_20261101_NIGHT_CANONICAL__"));
  assert.ok(vite.includes('dataLabNight_20261101: "data-lab/reports/20261101-night/index.html"'));
  assert.ok(!/https?:\/\//.test(report.replace(/http-equiv="Content-Security-Policy"[^>]*>/g, "")));
  assert.doesNotMatch(report + JSON.stringify(signal), /viewer_count|viewerCount"|drive\.google|C:\\\\Users|\.jsonl|\.mkv|あっきー|アッキー|夏凪/i);
});
