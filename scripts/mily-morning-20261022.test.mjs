import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAILY_STREAM_ENTRIES, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-lab/data/mily-morning-20261022-aggregate.json"));
const facts = JSON.parse(read("public/data-lab/data/halloween-20261022-source-facts.json"));
const page = read("data-lab/reports/20261022-morning/index.html");
const progress = read("data-lab/progress/index.html");
test("October 22: source-matched recording and ASR are not false complete coverage", () => {
 assert.equal(data.liveId, 23585463); assert.equal(data.roomId, 573253); assert.equal(data.dateJst, "2026-10-22");
 assert.equal(data.recording.saved, true); assert.equal(data.recording.durationSeconds, 1495.124); assert.equal(data.recording.bytes, 17158878);
 assert.equal(data.recording.startProcessingJst, "2026-10-22T06:00:19+09:00");
 assert.equal(data.recording.endProcessingJst, "2026-10-22T06:26:03+09:00");
 assert.equal(data.asr.status, "finished"); assert.equal(data.asr.processedChunks, 75);
 for (const key of ["actualFileDecodeVerified", "fullContinuityVerified"]) assert.equal(data.recording[key], false);
 assert.equal(data.asr.manualAudioListeningVerified, false); assert.equal(data.asr.verbatimAccuracyVerified, false);
});
test("October 22: no numeric observations means unknown, not zero-valued performance", () => {
 assert.equal(data.lastValidOnline, null); assert.deepEqual(data.observations, []);
 assert.equal(Object.keys(data.metrics).length, 9); assert.ok(Object.values(data.metrics).every(v => v === null));
 assert.equal(data.quality.savedNumericObservations, 0); assert.equal(data.quality.minuteChecks, 25);
 assert.equal(data.quality.minuteChecksWithSavedCounters, 0); assert.equal(data.quality.navigationFailureRecords, 9);
 assert.equal(data.timingComparisonEligible, false); assert.equal(data.finalServiceValueVerified, false);
 for (const metric of ["stars", "visits", "comments"]) {
  assert.equal(lastObservedValue(data, metric, data.dateJst), null);
  assert.deepEqual(observationPoints(data, metric, data.dateJst), []);
  assert.ok(page.includes(`data-metric="${metric}">未取得</strong>`));
 }
 assert.match(page, /未取得は、応援が0という意味ではありません/);
 assert.doesNotMatch(page, /<svg|<polyline|<canvas/);
});
test("October 22: archive links and canonical input are complete without losing prior dates", () => {
 const entry = DAILY_STREAM_ENTRIES.find(x => x.date === "2026-10-22");
 assert.equal(entry.file, "mily-morning-20261022-aggregate.json");
 assert.equal(entry.report, "/data-lab/reports/20261022-morning/");
 assert.equal(DAILY_STREAM_ENTRIES.filter(x => x.date === "2026-10-22").length, 1);
 const home = read("data-lab/index.html"), config = read("vite.config.ts");
 assert.ok(home.indexOf('id="morning-20261022"') < home.indexOf('id="morning-20261021"'));
 assert.ok(home.includes(entry.report)); assert.ok(config.includes('dataLabMorning20261022: "data-lab/reports/20261022-morning/index.html"'));
 assert.ok(config.includes('__DATA_LAB_20261022_MORNING_CANONICAL__'));
 assert.match(page, /noindex,nofollow,noarchive/); assert.match(page, /24分55.124秒/);
 assert.match(page, /原音の手動聴取・逐語校正は未実施/);
});
test("Halloween: eligibility and boost apply to their stated scopes, not invented rival effects", () => {
 assert.equal(facts.sourceUrl, "https://lp.showroom-live.com/halloween2026/");
 assert.equal(facts.sourceType, "official-public-page");
 assert.equal(facts.startsAtJst, "2026-10-21T15:00:00+09:00");
 assert.equal(facts.endsAtJst, "2026-11-01T23:59:00+09:00"); assert.equal(facts.style, "Classic");
 assert.equal(facts.kikkakeEligibility.campaign, "Green以上またはグレード対象外");
 assert.equal(facts.boostAppliesTo, "ハロウィン2026ブーストランキングのみ");
 assert.match(facts.sourceSha256, /^[a-f0-9]{64}$/);
 assert.match(progress, /id="campaign-20261021"/); assert.ok(progress.includes(facts.sourceUrl));
 assert.match(progress, /本人の現在の利用可否や再利用間隔の解除を確認したものではありません/);
 assert.match(progress, /直近のイベント効果・ライバル比較は、まだ未検証/);
 assert.match(progress, /未取得を0として順位付けしません/);
});
test("Published additions exclude raw transcripts, identifiers and non-public destinations", () => {
 const text = page + progress + JSON.stringify(data) + JSON.stringify(facts);
 assert.doesNotMatch(text, /drive\.google\.com|@gmail\.com|chatgpt\.site|C:\\Users|viewer[_-]?id|contributor[_-]?id|live-transcript\.txt|ui-raw\.jsonl|本人は焦|完璧主義/i);
 for (const m of text.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(m[0], /rel="noopener noreferrer"/);
});

test("October 22: analytics injection and mobile no-JS navigation remain available", () => {
 assert.match(page, /^<\/body>$/m);
 const home = read("data-lab/index.html");
 const fallback = home.match(/id="daily-fallback-links"[\s\S]*?<\/nav>/)?.[0];
 assert.ok(fallback);
 assert.match(fallback, /href="#morning-20261022">10\/22<\/a>/);
 assert.ok(fallback.indexOf("morning-20261022") < fallback.indexOf("morning-20261021"));
});
