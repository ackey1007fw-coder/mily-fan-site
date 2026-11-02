import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const signal = JSON.parse(read("public/data-lab/data/mily-morning-20261102-aggregate.json"));
const report = read("data-lab/reports/20261102-morning/index.html");
const labIndex = read("data-lab/index.html");
const csv = read("public/data-lab/data/mily-morning-20261102-observations.csv").trim().split("\n");

test("20261102-morning SIGNAL: separate entry, 10 partial observations, not a final", () => {
  const entries = DAILY_STREAM_ENTRIES.filter(e => e.date === "2026-11-02" && e.slot === "morning");
  assert.equal(entries.length, 1);
  assert.equal(signal.liveId, 23634120);
  assert.equal(signal.session, "morning");
  assert.equal(signal.observations.length, 10);
  assert.equal(csv.length, 11);
  assert.deepEqual(signal.metrics, {"stars": 2383, "visits": 268, "comments": 131, "firstVisits": 4, "repeatVisits": 7, "newFollows": 0, "otherFree": 0, "star100People": 22, "recommendedCommentPeople": 23});
  assert.equal(signal.lastValidOnline.atJst, "2026-11-02T06:21:33+09:00");
  assert.equal(signal.lastValidOnline.confirmedFinal, false);
  assert.equal(signal.finalServiceValueVerified, false);
  assert.equal(signal.completeCoverageConfirmed, false);
  assert.equal(signal.timingComparisonEligible, false);
  assert.equal(signal.quality.gaps.length, 3);
  assert.equal(lastObservedValue(signal, "stars", signal.dateJst), signal.metrics.stars);
  assert.equal(observationPoints(signal, "stars", signal.dateJst).length, 10);
  for (const o of signal.observations) assert.equal(Object.keys(o).length, 10);
  assert.equal(groupByBroadcastDate()[0].date, "2026-11-02");
  assert.equal(signal.recap, undefined);
  assert.doesNotMatch(report, /activities\/live/);
});

test("20261102-morning SIGNAL: report, lab home and routes stay consistent and anonymous", () => {
  assert.match(report, /途中の参考値で、確定合計ではありません/);
  assert.match(report, /6:21:33以降/);
  assert.match(report, /noindex,nofollow,noarchive/);
  assert.ok(labIndex.indexOf('id="morning-20261102"') < labIndex.indexOf('id="night-20261101"'));
  assert.match(labIndex, /href="#morning-20261102">11\/2 朝/);
  const vite = read("vite.config.ts");
  assert.ok(vite.includes("__DATA_LAB_20261102_MORNING_CANONICAL__"));
  assert.ok(vite.includes('dataLabMorning_20261102: "data-lab/reports/20261102-morning/index.html"'));
  assert.ok(!/https?:\/\//.test(report.replace(/http-equiv="Content-Security-Policy"[^>]*>/g, "")));
  assert.doesNotMatch(report + JSON.stringify(signal), /viewer_count|viewerCount"|drive\.google|C:\\\\Users|\.jsonl|\.mkv|あっきー|アッキー|夏凪/i);
});
