import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {streamRecaps} from "../src/data/streamRecaps.ts";
import {recapSourceDisclosure} from "../src/lib/recapSourceDisclosure.ts";
import {DAILY_STREAM_ENTRIES,observationPoints,lastObservedValue} from "../public/data-lab/assets/daily-archive-core.js";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const d=JSON.parse(read("public/data-lab/data/mily-night-20261030-aggregate.json"));
const report=read("data-lab/reports/20261030-night/index.html");
const recap=streamRecaps.find(r=>r.id==="2026-10-30-night-showroom");
test("10/30 night: eight deduplicated points from nine fresh UI rows, no invented tail",()=>{
 assert.equal(d.liveId,23623900);assert.equal(d.roomId,573253);assert.equal(d.session,"night");
 assert.equal(d.observations.length,8);assert.equal(new Set(d.observations.map(o=>o.atJst)).size,8);
 assert.equal(d.quality.numericTimelineRows,9);assert.equal(d.quality.duplicateProgressRowsNotSummed,1);
 assert.equal(d.quality.completeNineMetricRows,1);assert.equal(d.quality.partialNineMetricRows,8);
 assert.equal(d.lastValidOnline.atJst,"2026-10-30T22:33:29.730+09:00");
 assert.deepEqual(d.metrics,{stars:300,visits:24,comments:20,firstVisits:0,repeatVisits:0,newFollows:0,otherFree:120,star100People:3,recommendedCommentPeople:1});
 for(const key of ["finalServiceValueVerified","completeCoverageConfirmed","timingComparisonEligible"])assert.equal(d[key],false);
 assert.equal(d.lastValidOnline.confirmedFinal,false);assert.equal(d.quality.endConfirmed,false);
 assert.equal(d.observations.filter(p=>p.visits!==null).length,1);
 assert.deepEqual(d.observations.map(p=>p.stars),[0,0,100,100,200,200,200,300]);
 for(const key of ["stars","visits","comments"]){const pts=observationPoints(d,key,d.dateJst);assert.equal(pts.length,d.observations.filter(p=>p[key]!==null).length);assert.equal(lastObservedValue(d,key,d.dateJst),d.metrics[key]);}
 const csv=read("public/data-lab/data/mily-night-20261030-observations.csv").trimEnd().split("\n");assert.equal(csv.length,9);const cols=csv[0].split(",");
 csv.slice(1).forEach((l,i)=>l.split(",").forEach((v,j)=>assert.equal(v,d.observations[i][cols[j]]===null?"":String(d.observations[i][cols[j]]))));
});
test("10/30 night: all three static SVGs match observations exactly",()=>{
 assert.equal((report.match(/<svg /g)||[]).length,3);assert.doesNotMatch(report,/<(?:path|polyline|img|video|audio)\b/);
 for(const key of ["stars","visits","comments"]){const actual=[...report.matchAll(new RegExp('<circle data-series="'+key+'" data-at="([^"]+)" data-value="([^"]+)"','g'))].map(m=>[m[1],Number(m[2])]);assert.deepEqual(actual,d.observations.filter(o=>o[key]!==null).map(o=>[o.atJst,o[key]]));}
 assert.match(report,/300は最終結果ではありません/);assert.match(report,/初期化時の0/);assert.match(report,/保存9行/);assert.match(report,/配信終了時刻ではありません/);assert.match(report,/noindex,nofollow,noarchive/);
});
test("10/30 night: recap is limited to still inspection, no fabricated speech or approved media",()=>{
 assert.ok(recap);assert.match(recap.transcriptionNote,/22:33:29時点/);assert.equal(streamRecaps[0].id,recap.id);assert.equal(recap.highlights.length,1);
 assert.equal(recap.highlights[0].timestamp,"0:00:14");assert.equal(recap.image,undefined);assert.equal(recap.gallery,undefined);assert.equal(recap.songs,undefined);
 assert.equal(recap.timeline.length,0);assert.equal(recap.ranking.length,0);assert.match(recap.transcriptionNote,/発話内容の要約ではありません/);assert.match(recap.transcriptionNote,/原音の手動聴取・発話内容・全編の映像確認は未実施/);
 const record=JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json")).find(r=>r.id===recap.id);assert.equal(record.originalNote,recap.transcriptionNote);assert.deepEqual(record.display,recapSourceDisclosure(recap.sourceLabel,recap.transcriptionNote));
 assert.deepEqual(DAILY_STREAM_ENTRIES.filter(e=>e.date==="2026-10-30").map(e=>e.slot),["night","morning2","morning1"]);
 const home=read("data-lab/index.html");assert.ok(home.indexOf('id="night-20261030"')<home.indexOf('id="morning2-20261030"'));
 assert.match(read("vite.config.ts"),/__DATA_LAB_20261030_NIGHT_CANONICAL__/);
 assert.doesNotMatch(report+JSON.stringify(d)+JSON.stringify(recap),/drive[.]google[.]com|@gmail[.]com|chatgpt[.]site|viewer[_-]?id|contributor[_-]?id|ui-raw[.]jsonl|C:\\Users/i);
});
