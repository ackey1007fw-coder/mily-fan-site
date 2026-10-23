import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { DAILY_STREAM_ENTRIES, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
const read=(path)=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const data=JSON.parse(read("public/data-lab/data/mily-morning-20261023-aggregate.json"));
const morning=streamRecaps.find((r)=>r.id==="2026-10-23-morning-showroom");
test("2026-10-23 morning is a separate newest LIVE STREAM recap",()=>{
 assert.ok(morning);
 assert.equal(streamRecaps[0],morning);
 assert.equal(morning.dateLabel,"2026.10.23（金）");
 assert.match(morning.broadcastLabel,/録画開始6:30頃〜 約52分/);
 assert.equal(morning.gallery,undefined);
 assert.equal(morning.image,undefined);
 assert.equal(morning.ranking.length,1);
 assert.match(morning.transcriptionNote,/自動文字起こし/);
 assert.match(morning.transcriptionNote,/全編の手動聴取/);
});
test("verified recording and ASR metadata are separate from unverified counters",()=>{
 assert.equal(data.liveId,23590004);assert.equal(data.roomId,573253);
 assert.equal(data.recording.durationSeconds,3148.245);
 assert.equal(data.recording.bytes,389320809);
 assert.equal(data.recording.ffmpegExitCode,0);
 assert.equal(data.asr.processedChunks,157);
 assert.equal(data.quality.numericEvidenceStatus,"unverified");
 assert.equal(data.quality.savedNumericObservations,null);
 assert.deepEqual(data.observations,[]);
 assert.equal(Object.keys(data.metrics).length,9);
 assert.ok(Object.values(data.metrics).every(v=>v===null));
 assert.equal(data.timingComparisonEligible,false);
 for(const metric of ["stars","visits","comments"]){
  assert.equal(lastObservedValue(data,metric,data.dateJst),null);
  assert.deepEqual(observationPoints(data,metric,data.dateJst),[]);
 }
 const entry=DAILY_STREAM_ENTRIES[0];
 assert.deepEqual({date:entry.date,slot:entry.slot,section:entry.section},{date:"2026-10-23",slot:"morning",section:"morning-20261023"});
});
test("lab report is indexed, noindex, truthful and never exposes private sources",()=>{
 const report=read("data-lab/reports/20261023-morning/index.html");
 const home=read("data-lab/index.html");
 const vite=read("vite.config.ts");
 assert.match(report,/52分28.245秒/);
 assert.match(report,/157処理チャンク/);
 assert.match(report,/9指標/);
 assert.match(report,/noindex,nofollow,noarchive/);
 assert.ok(home.includes('id="morning-20261023"'));
 assert.ok(home.indexOf('id="morning-20261023"')<home.indexOf('id="night-20261022"'));
 assert.ok(home.includes("/activities/live/#recap-"+morning.id));
 assert.ok(vite.includes("__DATA_LAB_20261023_MORNING_CANONICAL__"));
 assert.ok(vite.includes('dataLabMorning20261023: "data-lab/reports/20261023-morning/index.html"'));
 assert.doesNotMatch(report+JSON.stringify(data)+JSON.stringify(morning),/drive\.google\.com|@gmail\.com|chatgpt\.site|C:\\Users|viewer[_-]?id|contributor[_-]?id|live-transcript\.txt|ui-raw\.jsonl/i);
});
