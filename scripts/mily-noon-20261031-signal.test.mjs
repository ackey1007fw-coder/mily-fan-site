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
  assert.deepEqual(data.metrics, { stars: 2751, visits: 142, comments: 252, firstVisits: 4, repeatVisits: 5, newFollows: 0, otherFree: 190, star100People: 27, recommendedCommentPeople: 21 });
  for (const k of Object.keys(data.metrics)) assert.equal(data.lastValidOnline[k], data.metrics[k], k);
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.timingComparisonEligible, false);
  assert.equal(data.quality.verified_final, false);
  assert.equal(data.quality.end_confirmed, false);
  assert.equal(data.quality.source_event_counts_verified, false);
  assert.equal(data.quality.summedAcrossDisconnect, false);
  assert.deepEqual(data.quality.gaps.map((g) => [g.startJst, g.endJst]), [["2026-10-31T14:53:08.485+09:00", "2026-10-31T14:57:00.945+09:00"]]);
  assert.equal(data.observations.length, 183);
  assert.equal(data.quality.publishedObservationPoints, 183);
  assert.equal(lastObservedValue(data, "stars", data.dateJst), 2751);
  assert.equal(lastObservedValue(data, "visits", data.dateJst), 142);
  assert.equal(lastObservedValue(data, "comments", data.dateJst), 252);
  assert.match(data.measurementNote, /ユニーク視聴者数ではない/);
  assert.equal(observationPoints(data, "stars", data.dateJst).length, 183);
  assert.equal(observationPoints(data, "visits", data.dateJst).length, 164);
  assert.equal(observationPoints(data, "comments", data.dateJst).length, 183);
  assert.equal(data.partialViewerMemo, undefined);
});

test("183 anonymous timestamped points: measured only, nulls kept, gap not filled", () => {
  const obs = data.observations;
  const keys = ["atJst", "stars", "visits", "comments", "firstVisits", "repeatVisits", "newFollows", "otherFree", "star100People", "recommendedCommentPeople"];
  for (const o of obs) assert.deepEqual(Object.keys(o).sort(), [...keys].sort());
  const times = obs.map((o) => Date.parse(o.atJst));
  assert.equal(new Set(times).size, 183);
  for (let i = 1; i < times.length; i += 1) assert.ok(times[i] > times[i - 1]);
  assert.equal(obs[0].atJst, "2026-10-31T14:45:41.600+09:00");
  assert.equal(obs.at(-1).atJst, data.lastValidOnline.atJst);
  for (const k of Object.keys(data.metrics)) assert.equal(obs.at(-1)[k], data.metrics[k], k);
  assert.equal(obs.filter((o) => o.visits === null).length, 19);
  for (const o of obs) for (const k of keys.slice(1)) if (k !== "visits") assert.ok(Number.isInteger(o[k]) && o[k] >= 0, k);
  for (let i = 1; i < obs.length; i += 1) assert.ok(obs[i].stars >= obs[i - 1].stars);
  const gs = Date.parse("2026-10-31T14:53:08.485+09:00"), ge = Date.parse("2026-10-31T14:57:00.945+09:00");
  assert.equal(times.filter((t) => t > gs && t < ge).length, 0);
  const csv = read("public/data-lab/data/mily-noon-20261031-observations.csv").trim().split("\n");
  assert.equal(csv.length, 184);
  assert.equal(csv[0], keys.join(","));
  csv.slice(1).forEach((line, i) => assert.equal(line, keys.map((k) => obs[i][k] === null ? "" : String(obs[i][k])).join(",")));
});

test("report shows reservations and an unconnected point chart", () => {
  assert.match(report, /2,751/);
  assert.match(report, /15:21:26/);
  assert.match(report, /14:53:08〜14:57:00/);
  assert.match(report, /確定合計ではありません/);
  assert.match(report, /未取得/);
  assert.match(report, /ユニーク視聴者数ではありません/);
  assert.match(report, /142/);
  assert.match(report, /252/);
  assert.doesNotMatch(report, /<polyline|<canvas/);
  assert.match(report, /id="observation-charts"/);
  assert.match(report, /src="\/data-lab\/assets\/noon-20261031\.js"/);
  assert.match(report, /183点の匿名CSV/);
  const js = read("public/data-lab/assets/noon-20261031.js");
  assert.doesNotMatch(js, /polyline|"path"|lineTo/);
  assert.match(js, /if \(value === null\) continue;/);
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
