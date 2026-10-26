import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { DAILY_STREAM_ENTRIES, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
import { injectVercelWebAnalytics } from "../src/lib/vercelWebAnalytics.ts";

const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-lab/data/mily-noon-20261024-aggregate.json"));
const recap = streamRecaps.find(x => x.id === "2026-10-24-noon-showroom");

test("10/24 noon: distinguish last valid online reference from confirmed offline", () => {
  assert.ok(recap);
  assert.equal(streamRecaps[1], recap);
  assert.equal(recap.dateLabel, "2026.10.24（土）");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.equal(recap.broadcastLabel, "画面観測14:45〜16:01（配信開始未確認）");
  assert.doesNotMatch(recap.broadcastLabel, /約\d+分|頃〜/);
  assert.equal(recap.gallery, undefined);
  assert.equal(recap.image, undefined);
  assert.deepEqual(recap.highlights, []);
  assert.deepEqual(recap.ranking, []);
  assert.match(recap.transcriptionNote, /未照合/);
  assert.equal(data.roomId, 573253);
  assert.equal(data.liveId, 23595513);
  assert.equal(data.dateJst, "2026-10-24");
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.completeCoverageConfirmed, false);
  assert.equal(data.timingComparisonEligible, false);
  assert.equal(data.quality.totalTimelineRows, 934);
  assert.equal(data.quality.savedNumericObservations, 913);
  assert.equal(data.quality.incompleteNineRows, 21);
  assert.equal(data.quality.regressionFlaggedRows, 0);
  assert.equal(data.quality.endConfirmed, true);
  assert.equal(data.quality.endObservedAtJst, "2026-10-24T16:01:25.618+09:00");
  assert.equal(data.lastValidOnline.atJst, "2026-10-24T16:01:00.811+09:00");
  assert.equal(data.lastValidOnline.confirmedFinal, false);
  assert.deepEqual(data.metrics, {"stars":3904,"visits":391,"comments":461,"firstVisits":11,"repeatVisits":19,"newFollows":1,"otherFree":65,"star100People":36,"recommendedCommentPeople":30});
  for (const [metric, expected] of [["stars",3904],["visits",391],["comments",461]]) {
    assert.equal(lastObservedValue(data,metric,data.dateJst),expected);
    const points=observationPoints(data,metric,data.dateJst);
    assert.equal(points.length,16);
    for(let i=1;i<points.length;i++){
      assert.ok(points[i].time>points[i-1].time);
      assert.ok(points[i].value>=points[i-1].value);
    }
  }
  assert.deepEqual(DAILY_STREAM_ENTRIES.find((entry) => entry.date === "2026-10-24" && entry.slot === "noon"), {
    date:"2026-10-24",slot:"noon",file:"mily-noon-20261024-aggregate.json",
    section:"noon-20261024",report:"/data-lab/reports/20261024-noon/"
  });
  const noonIndex = DAILY_STREAM_ENTRIES.findIndex((entry) => entry.date === "2026-10-24" && entry.slot === "noon");
  assert.equal(DAILY_STREAM_ENTRIES[noonIndex + 1].slot, "morning", "Within 10/24, noon still precedes morning");
});

test("10/24 noon: public lab report and preview entry are anonymous",()=>{
  const report=read("data-lab/reports/20261024-noon/index.html");
  const home=read("data-lab/index.html");
  const vite=read("vite.config.ts");
  const ledger=JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  assert.equal(ledger[1].id, recap.id);
  assert.equal(ledger[2].id, "2026-10-24-morning-radio");
  assert.match(report,/3,904/);
  assert.match(report,/391/);
  assert.match(report,/461/);
  assert.match(report,/16:01:00/);
  assert.match(report,/未照合/);
  assert.match(report,/noindex,nofollow,noarchive/);
  assert.match(injectVercelWebAnalytics(report), /<script defer src="\/mily-analytics-loader.js"><\/script>/);
  assert.ok(home.indexOf('id="noon-20261024"')<home.indexOf('id="morning-20261024"'));
  assert.ok(home.includes("/activities/live/#recap-"+recap.id));
  assert.ok(vite.includes("__DATA_LAB_20261024_NOON_CANONICAL__"));
  assert.ok(vite.includes('dataLabNoon20261024: "data-lab/reports/20261024-noon/index.html"'));
  assert.doesNotMatch(report+JSON.stringify(data)+JSON.stringify(recap),/drive[.]google[.]com|@gmail[.]com|chatgpt[.]site|viewer[_-]?id|contributor[_-]?id|live-transcript[.]txt|ui-raw[.]jsonl/i);
});
