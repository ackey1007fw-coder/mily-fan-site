import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { DAILY_STREAM_ENTRIES, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
import { injectVercelWebAnalytics } from "../src/lib/vercelWebAnalytics.ts";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-lab/data/mily-morning-20261025-aggregate.json"));
const recap = streamRecaps.find((item) => item.id === "2026-10-25-morning-showroom");

test("10/25 morning: exact room/live ID and chronological card without unapproved media", () => {
  assert.ok(recap);
  assert.equal(streamRecaps.filter(item => item.id === recap.id).length, 1);
  assert.ok(streamRecaps.indexOf(recap) < streamRecaps.findIndex(item => item.date < recap.date));
  assert.equal(recap.dateLabel, "2026.10.25（日）");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.match(recap.broadcastLabel, /録画開始5:37頃〜 約63分/);
  assert.match(recap.summary, /メイク/);
  assert.equal(recap.gallery.length, 6);
  assert.equal(recap.image, recap.gallery[1]);
  assert.equal(recap.highlights.length, 7);
  assert.deepEqual(recap.ranking, []);
  assert.match(recap.transcriptionNote, /全編の手動聴取/);
  assert.equal(data.roomId, 573253);
  assert.equal(data.liveId, 23598624);
  assert.equal(data.dateJst, "2026-10-25");
  assert.equal(data.format, "video");
  assert.equal(data.recording.ffmpegExitCode, 0);
  assert.equal(data.recording.durationSeconds, 3773.772);
  assert.equal(data.recording.bytes, 401521084);
  assert.equal(data.recording.fullContinuityVerified, false);
  assert.equal(data.asr.processedChunks, 189);
  assert.equal(data.asr.verbatimAccuracyVerified, false);
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.timingComparisonEligible, false);
});

test("10/25 morning: save nonfinal nine metrics; graph only observed and monotonic times", () => {
  assert.deepEqual(data.metrics, {
    stars: 3767, visits: 665, comments: 553, firstVisits: 16,
    repeatVisits: 35, newFollows: 1, otherFree: 111,
    star100People: 35, recommendedCommentPeople: 58
  });
  assert.equal(data.lastValidOnline.atJst, "2026-10-25T06:40:46.523+09:00");
  assert.equal(data.lastValidOnline.confirmedFinal, false);
  assert.equal(data.quality.totalTimelineRows, 916);
  assert.equal(data.quality.savedNumericObservations, 865);
  assert.equal(data.quality.incompleteNineRows, 51);
  assert.equal(data.quality.selectedTimedObservations, 13);
  assert.equal(data.quality.endConfirmed, false);
  assert.equal(data.observations.length, 13);
  for (const [metric, value] of [["stars",3767],["visits",665],["comments",553]]) {
    assert.equal(lastObservedValue(data,metric,data.dateJst),value);
    const points = observationPoints(data,metric,data.dateJst);
    assert.equal(points.length,13);
    for(let i=1;i<points.length;i++){
      assert.ok(points[i].time > points[i-1].time);
      assert.ok(points[i].value >= points[i-1].value);
    }
  }
  assert.deepEqual(DAILY_STREAM_ENTRIES.find((entry) => entry.date === "2026-10-25" && entry.slot === "morning"), {
    date:"2026-10-25",slot:"morning",file:"mily-morning-20261025-aggregate.json",
    section:"morning-20261025",report:"/data-lab/reports/20261025-morning/"
  });
});

test("10/25 morning: link report, preserve prior day, metadata and privacy", () => {
  const report = read("data-lab/reports/20261025-morning/index.html");
  const home = read("data-lab/index.html");
  const vite = read("vite.config.ts");
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  assert.equal(ledger.find(item => item.id === recap.id)?.source, recap.sourceLabel);
  assert.match(report,/62分53.772秒/);
  assert.match(report,/189処理チャンク/);
  assert.match(report,/3,767/);
  assert.match(report,/6:40:46/);
  assert.match(report,/13観測点/);
  assert.match(report,/noindex,nofollow,noarchive/);
  assert.ok(injectVercelWebAnalytics(report).includes('<script defer src="/mily-analytics-loader.js"></script>'));
  assert.ok(home.includes('id="morning-20261025"'));
  assert.ok(home.indexOf('id="morning-20261025"') < home.indexOf('id="noon-20261024"'));
  assert.ok(home.includes("/activities/live/#recap-" + recap.id));
  assert.ok(vite.includes("__DATA_LAB_20261025_MORNING_CANONICAL__"));
  assert.ok(vite.includes('dataLabMorning20261025: "data-lab/reports/20261025-morning/index.html"'));
  assert.doesNotMatch(report + JSON.stringify(data) + JSON.stringify(recap), /drive[.]google[.]com|@gmail[.]com|chatgpt[.]site|C:\\Users|viewer[_-]?id|contributor[_-]?id|live-transcript[.]txt|ui-raw[.]jsonl/i);
  const priorIds = ["2026-10-24-noon-showroom", "2026-10-24-morning-radio"];
  assert.deepEqual(streamRecaps.filter(item => priorIds.includes(item.id)).map(item => item.id), priorIds);
});
