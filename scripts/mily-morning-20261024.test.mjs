import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { DAILY_STREAM_ENTRIES, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-lab/data/mily-morning-20261024-aggregate.json"));
const recap = streamRecaps.find((r) => r.id === "2026-10-24-morning-radio");

test("2026-10-24 radio recap is newest and remains SHOWROOM, not FM", () => {
  assert.ok(recap);
  assert.equal(streamRecaps[0], recap);
  assert.equal(recap.dateLabel, "2026.10.24（土）");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.match(recap.broadcastLabel, /録画開始7:09頃〜 約93分/);
  assert.match(recap.summary, /ラジオ形式/);
  assert.equal(recap.gallery, undefined);
  assert.equal(recap.image, undefined);
  assert.equal(recap.highlights.length, 7);
  assert.equal(recap.ranking.length, 1);
  assert.match(recap.transcriptionNote, /自動文字起こし/);
  assert.match(recap.transcriptionNote, /全編の手動聴取/);
});

test("2026-10-24 measured recording facts and unknown counters stay separate", () => {
  assert.equal(data.roomId, 573253);
  assert.equal(data.liveId, 23594458);
  assert.equal(data.format, "radio");
  assert.equal(data.recording.durationSeconds, 5606.255);
  assert.equal(data.recording.bytes, 64393668);
  assert.equal(data.recording.ffmpegExitCode, 0);
  assert.equal(data.recording.fullContinuityVerified, false);
  assert.equal(data.asr.processedChunks, 281);
  assert.equal(data.asr.verbatimAccuracyVerified, false);
  assert.equal(data.quality.numericEvidenceStatus, "unverified");
  assert.equal(Object.keys(data.metrics).length, 9);
  assert.ok(Object.values(data.metrics).every((v) => v === null));
  assert.deepEqual(data.observations, []);
  assert.equal(data.timingComparisonEligible, false);
  for (const metric of ["stars", "visits", "comments"]) {
    assert.equal(lastObservedValue(data, metric, data.dateJst), null);
    assert.deepEqual(observationPoints(data, metric, data.dateJst), []);
  }
  assert.deepEqual(DAILY_STREAM_ENTRIES[0], {
    date: "2026-10-24", slot: "morning",
    file: "mily-morning-20261024-aggregate.json",
    section: "morning-20261024", report: "/data-lab/reports/20261024-morning/"
  });
});

test("10/24 lab report links and safety remain intact", () => {
  const report = read("data-lab/reports/20261024-morning/index.html");
  const home = read("data-lab/index.html");
  const vite = read("vite.config.ts");
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  assert.equal(ledger[0].id, recap.id);
  assert.match(report, /93分26.255秒/);
  assert.match(report, /281区間/);
  assert.match(report, /noindex,nofollow,noarchive/);
  assert.ok(home.includes('id="morning-20261024"'));
  assert.ok(home.indexOf('id="morning-20261024"') < home.indexOf('id="morning-20261023"'));
  assert.ok(home.includes("/activities/live/#recap-" + recap.id));
  assert.ok(vite.includes("__DATA_LAB_20261024_MORNING_CANONICAL__"));
  assert.ok(vite.includes('dataLabMorning20261024: "data-lab/reports/20261024-morning/index.html"'));
  assert.doesNotMatch(report + JSON.stringify(data) + JSON.stringify(recap), /drive[.]google[.]com|@gmail[.]com|chatgpt[.]site|viewer[_-]?id|contributor[_-]?id|live-transcript[.]txt|ui-raw[.]jsonl/i);
});
