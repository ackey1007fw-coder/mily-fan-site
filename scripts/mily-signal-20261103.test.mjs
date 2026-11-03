import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue} from "../public/data-lab/assets/daily-archive-core.js";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
for(const [date,slot,id,points,rows,stars,visits,comments,missing,endConfirmed] of [
  ["2026-10-31","noon",23626331,183,491,2751,142,252,19,false],
  ["2026-11-01","morning",23629786,195,505,3397,293,265,22,true],
  ["2026-11-02","night",23636506,229,813,4053,null,355,77,true],
  ["2026-11-03","morning",23638183,215,530,3643,321,264,12,true],
]) test(`${date} ${slot}: screen progress, CSV, report, missing data and end evidence agree`,()=>{
  const day=date.replaceAll("-","");
  const stem=`mily-${slot}-${day}`;
  const data=JSON.parse(read(`public/data-lab/data/${stem}-aggregate.json`));
  const csv=read(`public/data-lab/data/${stem}-observations.csv`).trim().split(/\r?\n/);
  const report=read(`data-lab/reports/${day}-${slot}/index.html`);
  assert.equal(data.liveId,id);assert.equal(data.roomId,573253);
  assert.equal(data.observations.length,points);assert.equal(csv.length,points+1);
  assert.equal(data.quality.savedSampleRows ?? data.quality.savedRows,rows);
  assert.equal(data.quality.reacquiredRows,data.quality.validRows-points);
  assert.equal(data.quality.end_confirmed,endConfirmed);
  assert.equal(data.quality.verified_final,false);
  assert.equal(data.finalServiceValueVerified,false);
  assert.equal(data.completeCoverageConfirmed,false);
  assert.equal(data.timingComparisonEligible,false);
  assert.deepEqual([data.metrics.stars,data.metrics.visits,data.metrics.comments],[stars,visits,comments]);
  assert.equal(data.observations.filter(o=>o.visits===null).length,missing);
  assert.equal(lastObservedValue(data,"visits",date),visits);
  assert.equal(observationPoints(data,"visits",date).length,points-missing);
  assert.equal(data.lastValidOnline.atJst,data.observations.at(-1).atJst);
  assert.equal(new Set(data.observations.map(o=>o.atJst)).size,points);
  for(const [i,o] of data.observations.entries()){
    assert.equal(Object.keys(o).length,10);
    assert.deepEqual(csv[i+1].split(","),Object.values(o).map(v=>v===null?"":String(v)));
    assert.ok(report.includes(`<th scope="row">${o.atJst.slice(11,23)}</th>`));
    if(i)assert.ok(Date.parse(o.atJst)>Date.parse(data.observations[i-1].atJst));
  }
  assert.match(report,/noindex,nofollow,noarchive/);
  assert.match(report,/確定合計ではありません/);
  assert.doesNotMatch(report+JSON.stringify(data),/\.jsonl|C:\\\\Users|writer_pid|capture_epoch|viewer[_-]?id|comment_text|access_token|drive\.google/i);
  const entries=DAILY_STREAM_ENTRIES.filter(e=>e.date===date&&e.slot===slot);
  assert.equal(entries.length,1);assert.equal(entries[0].file,stem+"-aggregate.json");
  assert.ok(read("vite.config.ts").includes(`data-lab/reports/${day}-${slot}/index.html`));
});
test("latest archive and gateway use November 3; latest missing values do not reuse older readings",()=>{
  assert.equal(groupByBroadcastDate()[0].date,"2026-11-03");
  assert.match(read("data-lab/index.html"),/href="\/data-lab\/reports\/20261103-morning\/">最新の配信レポート/);
  assert.equal(lastObservedValue({lastValidOnline:{visits:null},observations:[{atJst:"2026-11-02T22:00:00+09:00",visits:100}]},"visits","2026-11-02"),null);
});
