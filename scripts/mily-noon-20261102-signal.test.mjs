import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const signal = JSON.parse(read("public/data-lab/data/mily-noon-20261102-aggregate.json"));
const report = read("data-lab/reports/20261102-noon/index.html");
const labIndex = read("data-lab/index.html");
const csv = read("public/data-lab/data/mily-noon-20261102-observations.csv").trim().split("\n");

test("20261102-noon SIGNAL: separate entry above the same-day morning, 40 observations, not a final", () => {
  const entries = DAILY_STREAM_ENTRIES.filter(e => e.date === "2026-11-02");
  assert.deepEqual(entries.map(e => e.slot), ["noon", "morning"]);
  const day = groupByBroadcastDate()[0];
  assert.equal(day.date, "2026-11-02");
  assert.deepEqual(day.entries.map(e => e.slot), ["noon", "morning"]);
  assert.equal(signal.liveId, 23634935);
  assert.equal(signal.session, "noon");
  assert.equal(signal.observations.length, 40);
  assert.equal(csv.length, 41);
  assert.deepEqual(signal.metrics, {"stars": 3360, "visits": 330, "comments": 186, "firstVisits": 14, "repeatVisits": 16, "newFollows": 1, "otherFree": 472, "star100People": 32, "recommendedCommentPeople": 34});
  assert.equal(signal.lastValidOnline.atJst, "2026-11-02T15:15:19+09:00");
  assert.equal(signal.lastValidOnline.confirmedFinal, false);
  assert.equal(signal.finalServiceValueVerified, false);
  assert.equal(signal.completeCoverageConfirmed, false);
  assert.equal(signal.timingComparisonEligible, false);
  assert.equal(signal.quality.gaps.length, 2);
  assert.equal(lastObservedValue(signal, "stars", signal.dateJst), signal.metrics.stars);
  assert.equal(observationPoints(signal, "stars", signal.dateJst).length, 40);
  for (const o of signal.observations) assert.equal(Object.keys(o).length, 10);
  for (let i = 1; i < signal.observations.length; i++) assert.ok(signal.observations[i].stars >= signal.observations[i - 1].stars);
  assert.equal(signal.recap.liveRecapUrl, "/activities/live/#recap-2026-11-02-noon-showroom");
});

test("20261102-noon SIGNAL: report, lab home and routes stay consistent and anonymous", () => {
  assert.match(report, /終了直前の参考値で、確定合計ではありません/);
  assert.match(report, /15:08:27〜15:11:18/);
  assert.match(report, /noindex,nofollow,noarchive/);
  for (const o of signal.observations) assert.ok(report.includes(`<td>${o.stars.toLocaleString("en-US")}</td>`));
  assert.ok(labIndex.indexOf('id="noon-20261102"') < labIndex.indexOf('id="morning-20261102"'));
  assert.match(labIndex, /href="#noon-20261102">11\/2 昼/);
  const vite = read("vite.config.ts");
  assert.ok(vite.includes("__DATA_LAB_20261102_NOON_CANONICAL__"));
  assert.ok(vite.includes('dataLabNoon_20261102: "data-lab/reports/20261102-noon/index.html"'));
  assert.ok(!/https?:\/\//.test(report.replace(/http-equiv="Content-Security-Policy"[^>]*>/g, "")));
  assert.doesNotMatch(report + JSON.stringify(signal), /viewer_count|viewerCount"|drive\.google|C:\\\\Users|\.jsonl|\.mkv|あっきー|アッキー|夏凪/i);
});
