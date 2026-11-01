import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const signal = JSON.parse(read("public/data-lab/data/mily-noon-20261101-aggregate.json"));
const report = read("data-lab/reports/20261101-noon/index.html");
const labIndex = read("data-lab/index.html");
const csv = read("public/data-lab/data/mily-noon-20261101-observations.csv").trim().split("\n");

test("11/1 noon SIGNAL: separate entry above the same-day morning, 10 partial observations, not a final", () => {
  const entries = DAILY_STREAM_ENTRIES.filter(e => e.date === "2026-11-01");
  assert.deepEqual(entries.map(e => e.slot), ["noon", "morning"]);
  const day = groupByBroadcastDate()[0];
  assert.equal(day.date, "2026-11-01");
  assert.deepEqual(day.entries.map(e => e.slot), ["noon", "morning"]);
  assert.equal(signal.liveId, 23630916);
  assert.equal(signal.session, "noon");
  assert.equal(signal.observations.length, 10);
  assert.equal(csv.length, 11);
  assert.deepEqual(signal.metrics, { stars: 1248, visits: 45, comments: 67, firstVisits: 2, repeatVisits: 0, newFollows: 0, otherFree: 60, star100People: 11, recommendedCommentPeople: 11 });
  assert.equal(signal.lastValidOnline.atJst, "2026-11-01T14:56:56+09:00");
  assert.equal(signal.lastValidOnline.confirmedFinal, false);
  assert.equal(signal.finalServiceValueVerified, false);
  assert.equal(signal.completeCoverageConfirmed, false);
  assert.equal(signal.timingComparisonEligible, false);
  assert.equal(signal.quality.gaps.length, 2);
  assert.equal(lastObservedValue(signal, "stars", signal.dateJst), 1248);
  assert.equal(observationPoints(signal, "stars", signal.dateJst).length, 10);
  for (const o of signal.observations) assert.equal(Object.keys(o).length, 10);
});

test("11/1 noon SIGNAL: report, lab home and routes stay consistent and anonymous", () => {
  assert.match(report, /途中の参考値で、確定合計ではありません/);
  assert.match(report, /14:56:56以降/);
  assert.match(report, /noindex,nofollow,noarchive/);
  assert.ok(labIndex.indexOf('id="noon-20261101"') < labIndex.indexOf('id="morning-20261101"'));
  assert.match(labIndex, /href="#noon-20261101">11\/1 昼/);
  const vite = read("vite.config.ts");
  assert.ok(vite.includes("__DATA_LAB_20261101_NOON_CANONICAL__"));
  assert.ok(vite.includes('dataLabNoon_20261101: "data-lab/reports/20261101-noon/index.html"'));
  assert.ok(!/https?:\/\//.test(report.replace(/http-equiv="Content-Security-Policy"[^>]*>/g, "")));
  assert.doesNotMatch(report + JSON.stringify(signal), /viewer_count|viewerCount"|drive\.google|C:\\\\Users|\.jsonl|あっきー|アッキー/i);
});
