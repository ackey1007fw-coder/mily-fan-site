import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { DAILY_STREAM_ENTRIES, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-lab/data/mily-morning-20261024-aggregate.json"));
const recap = streamRecaps.find((r) => r.id === "2026-10-24-morning-radio");

test("2026-10-24 radio recap is chronological and remains SHOWROOM, not FM", () => {
  assert.ok(recap);
  assert.equal(streamRecaps.filter(item => item.id === recap.id).length, 1);
  assert.ok(streamRecaps.indexOf(recap) < streamRecaps.findIndex(item => item.date < recap.date));
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

test("2026-10-24 saved nine online counters are nonfinal and keep observed times", () => {
  assert.equal(data.roomId, 573253);
  assert.equal(data.liveId, 23594458);
  assert.equal(data.format, "radio");
  assert.equal(data.recording.durationSeconds, 5606.255);
  assert.equal(data.recording.bytes, 64393668);
  assert.equal(data.recording.ffmpegExitCode, 0);
  assert.equal(data.recording.fullContinuityVerified, false);
  assert.equal(data.asr.processedChunks, 281);
  assert.equal(data.asr.verbatimAccuracyVerified, false);
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.timingComparisonEligible, false);
  assert.equal(data.quality.numericEvidenceStatus, "observed_last_valid_nonfinal");
  assert.equal(data.quality.totalTimelineRows, 1125);
  assert.equal(data.quality.savedNumericObservations, 1018);
  assert.equal(data.quality.incompleteNineRows, 54);
  assert.equal(data.quality.regressionFlaggedRows, 53);
  assert.equal(data.quality.endConfirmed, false);
  assert.deepEqual(data.metrics, {
    stars: 4718, visits: 423, comments: 703, firstVisits: 14,
    repeatVisits: 22, newFollows: 1, otherFree: 283,
    star100People: 43, recommendedCommentPeople: 40
  });
  assert.equal(data.lastValidOnline.atJst, "2026-10-24T08:40:12.776+09:00");
  assert.equal(data.lastValidOnline.confirmedFinal, false);
  assert.equal(data.observations.length, 19);
  assert.equal(data.observations.at(-1).stars, 4718);
  assert.equal(data.observations.at(-1).visits, 423);
  assert.equal(data.observations.at(-1).comments, 703);
  for (const [metric, expected] of [["stars", 4718], ["visits", 423], ["comments", 703]]) {
    assert.equal(lastObservedValue(data, metric, data.dateJst), expected);
    const observed = observationPoints(data, metric, data.dateJst);
    assert.equal(observed.length, 19);
    for (let index = 1; index < observed.length; index++) {
      assert.ok(observed[index].time > observed[index - 1].time);
      assert.ok(observed[index].value >= observed[index - 1].value);
    }
  }
  assert.match(recap.transcriptionNote, /8:40:12/);
  assert.deepEqual(DAILY_STREAM_ENTRIES.find((entry) => entry.date === "2026-10-24" && entry.slot === "morning"), {
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
  assert.equal(ledger.find(item => item.id === recap.id)?.source, recap.sourceLabel);
  assert.match(report, /93分26.255秒/);
  assert.match(report, /281区間/);
  assert.match(report, /4,718/);
  assert.match(report, /8:40:12/);
  assert.match(home, /LAST VALID SCREEN 08:40 JST/);
  assert.match(report, /noindex,nofollow,noarchive/);
  assert.ok(home.includes('id="morning-20261024"'));
  assert.ok(home.indexOf('id="morning-20261024"') < home.indexOf('id="morning-20261023"'));
  assert.ok(home.includes("/activities/live/#recap-" + recap.id));
  assert.ok(vite.includes("__DATA_LAB_20261024_MORNING_CANONICAL__"));
  assert.ok(vite.includes('dataLabMorning20261024: "data-lab/reports/20261024-morning/index.html"'));
  assert.doesNotMatch(report + JSON.stringify(data) + JSON.stringify(recap), /drive[.]google[.]com|@gmail[.]com|chatgpt[.]site|viewer[_-]?id|contributor[_-]?id|live-transcript[.]txt|ui-raw[.]jsonl/i);
});
