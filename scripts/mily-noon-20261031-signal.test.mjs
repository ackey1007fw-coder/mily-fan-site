import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
import { streamRecap1031Noon as recap } from "../src/data/streamRecap1031Noon.ts";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-lab/data/mily-noon-20261031-aggregate.json"));
const report = read("data-lab/reports/20261031-noon/index.html");
const index = read("data-lab/index.html");
const vite = read("vite.config.ts");

test("10/31 noon is one separate entry, newest first, without touching earlier days", () => {
  const entries = DAILY_STREAM_ENTRIES.filter((e) => e.date === "2026-10-31");
  assert.equal(entries.length, 1);
  assert.equal(entries[0].slot, "noon");
  assert.equal(entries[0].report, "/data-lab/reports/20261031-noon/");
  const dates = groupByBroadcastDate().map((g) => g.date);
  assert.equal(dates[0], "2026-10-31");
  assert.equal(DAILY_STREAM_ENTRIES.filter((e) => e.date === "2026-10-30").length, 3);
});

test("only the last valid star display is kept; it is not a confirmed final", () => {
  assert.equal(data.roomId, 573253);
  assert.equal(data.liveId, 23626331);
  assert.equal(data.session, "noon");
  assert.equal(data.metrics.stars, 2751);
  assert.equal(data.lastValidOnline.atJst, "2026-10-31T15:21:26.341+09:00");
  assert.equal(data.lastValidOnline.confirmedFinal, false);
  assert.equal(Object.keys(data.metrics).length, 9);
  for (const [k, v] of Object.entries(data.metrics)) if (k !== "stars") assert.equal(v, null, k);
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.timingComparisonEligible, false);
  assert.equal(data.quality.verified_final, false);
  assert.equal(data.quality.end_confirmed, false);
  assert.equal(data.quality.source_event_counts_verified, false);
  assert.equal(data.quality.summedAcrossDisconnect, false);
  assert.deepEqual(data.quality.gaps.map((g) => [g.startJst, g.endJst]), [["2026-10-31T14:53:08.485+09:00", "2026-10-31T14:57:00.945+09:00"]]);
  assert.equal(data.observations.length, 0);
  assert.equal(lastObservedValue(data, "stars", data.dateJst), 2751);
  assert.equal(lastObservedValue(data, "visits", data.dateJst), null);
  assert.deepEqual(observationPoints(data, "stars", data.dateJst), []);
  assert.equal(data.partialViewerMemo, undefined);
});

test("report shows reservations and no fabricated chart", () => {
  assert.match(report, /2,751/);
  assert.match(report, /15:21:26/);
  assert.match(report, /14:53:08〜14:57:00/);
  assert.match(report, /確定合計ではありません/);
  assert.match(report, /未取得/);
  assert.doesNotMatch(report, /<svg|<polyline|<canvas/);
  assert.match(report, /noindex,nofollow,noarchive/);
  assert.ok(!/https?:\/\//.test(report.replace(/http-equiv="Content-Security-Policy"[^>]*>/g, "")));
  assert.doesNotMatch(report + JSON.stringify(data), /drive\.google\.com|@gmail\.com|chatgpt\.site|C:\\Users|viewer[_-]?id|contributor[_-]?id|\.jsonl/i);
});

test("lab home, routes and LIVE recap stay consistent", () => {
  assert.ok(index.indexOf('id="noon-20261031"') < index.indexOf('id="night-20261030"'));
  assert.match(index, /href="#noon-20261031">10\/31 昼/);
  assert.ok(vite.includes("__DATA_LAB_20261031_NOON_CANONICAL__"));
  assert.ok(vite.includes('dataLabNoon_20261031: "data-lab/reports/20261031-noon/index.html"'));
  assert.match(recap.transcriptionNote, /最後の有効表示が2,751（15:21:26）/);
  assert.match(recap.transcriptionNote, /確定合計やイベントのポイントではありません/);
  assert.equal(recap.metrics, undefined);
});
