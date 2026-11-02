import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
import { DAILY_STREAM_ENTRIES, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
import { injectVercelWebAnalytics } from "../src/lib/vercelWebAnalytics.ts";

const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const data = JSON.parse(read("public/data-lab/data/mily-noon-20261029-aggregate.json"));
const recap = streamRecaps.find(item => item.id === "2026-10-29-noon-showroom");
const oldRecap = streamRecaps.find(item => item.id === "2026-10-28-morning-showroom");

test("10/29 noon: only its own nonfinal screen values and correct archive order", () => {
 assert.ok(recap);assert.ok(streamRecaps.indexOf(recap)>=0);
 assert.equal(streamRecaps.filter(x=>x.id===recap.id).length,1);
 assert.equal(streamRecaps[streamRecaps.indexOf(recap)+1],oldRecap);
 assert.equal(recap.broadcastLabel,"録画開始14:47頃〜 約29分");
 assert.equal(recap.timestampBasis,undefined, "The new clip indices use recording offsets, not ASR-clock time");
 assert.equal(recap.gallery?.length,6);assert.equal(recap.image,recap.gallery?.[1]);assert.equal(recap.songs,undefined);
 assert.equal(recap.highlights.filter(x=>x.clip).length,3);
 assert.equal(recap.ranking.length,0);assert.equal(recap.timeline.length,0);
 assert.match(recap.transcriptionNote,/自動文字起こし88処理区間/);
 assert.match(recap.transcriptionNote,/録画先頭からの目安/);
 assert.match(recap.transcriptionNote,/速報ASRの日本時間との厳密な同期や正式な配信開始・終了時刻は確認していません/);
 assert.match(recap.transcriptionNote,/承認済みの短い抜粋のみ掲載しています/);
 assert.match(recap.transcriptionNote,/原音の全編手動聴取・逐語校正は未実施/);
 assert.equal(data.roomId,573253);assert.equal(data.liveId,23617260);
 assert.equal(data.dateJst,"2026-10-29");assert.equal(data.session,"noon");
 assert.equal(data.finalServiceValueVerified,false);assert.equal(data.completeCoverageConfirmed,false);
 assert.equal(data.timingComparisonEligible,false);assert.equal(data.lastValidOnline.confirmedFinal,false);
 assert.equal(data.lastValidOnline.uiProgressAtJst,"2026-10-29T15:16:40.151+09:00");
 assert.equal(data.lastValidOnline.atJst,"2026-10-29T15:18:08.320+09:00");
 assert.deepEqual(data.metrics,{stars:4724,visits:215,comments:174,firstVisits:10,repeatVisits:8,newFollows:0,otherFree:20,star100People:42,recommendedCommentPeople:30});
 assert.equal(data.quality.numericTimelineRows,486);
 assert.equal(data.quality.completeNineMetricRows,416);assert.equal(data.quality.partialNineMetricRows,70);
 assert.equal(data.quality.collectorReceived,606);assert.equal(data.quality.collectorSaved,606);
 assert.equal(data.quality.rawComplete,false);assert.equal(data.quality.domDiscarded,5424);
 assert.equal(data.quality.gapsOverTwentySeconds,2);
 assert.equal(data.quality.endObservedAtJst,"2026-10-29T15:28:38.736+09:00");
 assert.equal(data.observations.length,8);
 assert.equal(data.recap.publishedStills,6);
 assert.equal(data.recap.publishedTalkClips,3);
 const stars=observationPoints(data,"stars",data.dateJst);
 assert.equal(stars.length,8);
 assert.deepEqual(stars.map(p=>p.value),[100,520,822,1661,3531,4061,4543,4724]);
 assert.equal(stars.at(-1).value-stars[0].value,4624);
 assert.equal(Math.max(...stars.slice(1).map((x,i)=>x.value-stars[i].value)),1870);
 assert.equal(observationPoints(data,"visits",data.dateJst).length,0);
 assert.equal(observationPoints(data,"comments",data.dateJst).length,0);
 for(const [key,value] of [["stars",4724],["visits",215],["comments",174]])assert.equal(lastObservedValue(data,key,data.dateJst),value);
 assert.deepEqual(DAILY_STREAM_ENTRIES.find(e=>e.date==="2026-10-29"&&e.slot==="noon"),{date:"2026-10-29",slot:"noon",file:"mily-noon-20261029-aggregate.json",section:"noon-20261029",report:"/data-lab/reports/20261029-noon/"});
 assert.equal(DAILY_STREAM_ENTRIES.filter(e=>e.date==="2026-10-29").length,1);
 assert.equal(DAILY_STREAM_ENTRIES.filter(e=>e.date==="2026-10-28"&&e.slot==="morning").length,1);
});
test("10/29 noon: report, provenance, noindex and privacy boundaries",()=>{
 const report=read("data-lab/reports/20261029-noon/index.html");
 const home=read("data-lab/index.html");
 const vite=read("vite.config.ts");
 const ledger=JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
 assert.equal(ledger.filter(item=>item.id===recap.id).length,1);
 const record=ledger.find(item=>item.id===recap.id);
 assert.equal(record.source,recap.sourceLabel);
 assert.equal(record.originalNote,recap.transcriptionNote);
 assert.equal(record.verifiedAt,recap.verifiedAt);
 assert.deepEqual(record.display,recapSourceDisclosure(recap.sourceLabel,recap.transcriptionNote));
 assert.match(report,/4,724/);assert.match(report,/215/);assert.match(report,/174/);
 assert.match(report,/DOM破棄5,424/);assert.match(report,/raw_complete=false/);
 assert.match(report,/noindex,nofollow,noarchive/);
 assert.equal((injectVercelWebAnalytics(report).match(/src="\/mily-analytics-loader.js"/g)??[]).length,1);
 assert.match(vite,/__DATA_LAB_20261029_NOON_CANONICAL__/);
 assert.match(vite,/dataLabNoon20261029: "data-lab\/reports\/20261029-noon\/index.html"/);
 assert.ok(home.indexOf('id="noon-20261029"')<home.indexOf('id="morning-20261028"'));
 assert.ok(home.includes("/activities/live/#recap-"+recap.id));
 const publicText=report+JSON.stringify(data)+JSON.stringify(recap);
 assert.doesNotMatch(publicText,/drive[.]google[.]com|@gmail[.]com|chatgpt[.]site|viewer[_-]?id|contributor[_-]?id|live-transcript[.]txt|ui-raw[.]jsonl|C:\\\\Users/i);
 assert.doesNotMatch(report,/<img|<video|<audio/);
});


test("10/29 noon: six real photos, three original-audio clips, and matching posters", () => {
 const gallery=recap.gallery;
 assert.ok(gallery);
 assert.equal(gallery.length,6);
 assert.equal(new Set(gallery.map(x=>x.src)).size,6);
 assert.equal(recap.image,gallery[1]);
 assert.ok(gallery.every(x=>x.width===640&&x.height===360&&x.caption&&x.downloadName&&x.alt.includes("みりぃ")));
 const clips=recap.highlights.map(x=>x.clip).filter(Boolean);
 assert.deepEqual(clips.map(x=>[x.sourceTimestamp,x.durationSeconds]),[
   ["0:06:38",16],["0:17:05",17],["0:28:36",18]
 ]);
 assert.ok(clips.every(x=>x.width===640&&x.height===360&&x.src.endsWith(".mp4")&&x.poster.endsWith(".jpg")));
 assert.deepEqual(gallery.map(x=>x.src.slice("/media/live/".length)),["mily-b241-01-20261029-noon-hands-pose.jpg","mily-b241-02-20261029-noon-smile.jpg","mily-b241-03-20261029-noon-joy.jpg","mily-b241-04-20261029-noon-point.jpg","mily-b241-05-20261029-noon-side-smile.jpg","mily-b241-06-20261029-noon-soft-smile.jpg"]);
 const records=[["mily-b241-01-20261029-noon-hands-pose.jpg","f3c968f4703a8f1e177d375c1e163caa77e74df3c9bdf264a63670035e5ef08d"],["mily-b241-02-20261029-noon-smile.jpg","414ddce3b8d70ca3866b65d8026a324ed07c9a9b9958b243fbef744692638c32"],["mily-b241-03-20261029-noon-joy.jpg","a06429afe7ef79cd6ee57f993918d099f069707eaa30b68a921e0f85f60fa904"],["mily-b241-04-20261029-noon-point.jpg","ec005443bd3042a256293da667ef5ce0455b1eafd26650fb731489f9f8ee1060"],["mily-b241-05-20261029-noon-side-smile.jpg","03dd0db6cd041893cef28543fc2faadb6345c5bec5888f6aeae116be807dac25"],["mily-b241-06-20261029-noon-soft-smile.jpg","2a0c33c4573d8afb13dd14f85070c22a9c8eb4f8315b93d17ba01edeff202452"],["mily-b241-07-20261029-noon-final-talk.mp4","cb049a3da28566e3050fdcda2addfc36b28d77779839429f50eccb62806344f0"],["mily-b241-07-20261029-noon-final-talk-cover.jpg","d53f57ef5282e55a7eb760e60d44e706341026a536549ef40a9dfb464623c980"],["mily-b241-08-20261029-noon-together-talk.mp4","b74a8e3c8acd255cd0763c6705483fd0c0eefa2f46190682ca3502466076e475"],["mily-b241-08-20261029-noon-together-talk-cover.jpg","15a3a92ef994479ba8c26e393310b62e2717fd6c581888850458e2fb67d37279"],["mily-b241-09-20261029-noon-thanks-talk.mp4","759d3c27a53c927e90981ac89a1ced1358545f27c99ee03d74380dd4625c9c42"],["mily-b241-09-20261029-noon-thanks-talk-cover.jpg","1c961643e15dcb72d8fbb2f858c698253af0ba67d5616b74616f43c43d5fb72b"]];
 for(const [filename, expectedHash] of records){
   const root=filename.endsWith(".mp4") ? "../public/media/live-clips/" : "../public/media/live/";
   const bytes=readFileSync(new URL(root+filename,import.meta.url));
   const hash=createHash("sha256").update(bytes).digest("hex");
   assert.equal(hash,expectedHash,filename+" must match the selected original derivative");
   if(filename.endsWith(".jpg")){
     assert.equal(bytes[0],0xff);
     assert.equal(bytes[1],0xd8);
   }else{
     assert.equal(bytes.toString("ascii",4,8),"ftyp",filename+" must be MP4");
   }
 }
 assert.ok(recap.transcriptionNote.includes("短尺3本"));
 assert.ok(recap.transcriptionNote.includes("静止画は当日の保存録画の実フレーム6枚"));
 assert.ok(!JSON.stringify(recap).includes("歌詞"));
});
