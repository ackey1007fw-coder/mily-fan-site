import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue} from "../public/data-lab/assets/daily-archive-core.js";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
for(const [date,slot,id,points,rows,stars,visits,comments,missing,endConfirmed] of [
  ["2026-10-31","noon",23626331,183,491,2751,142,252,19,false],
  ["2026-11-01","morning",23629786,21,23,2453,121,143,0,false],
  ["2026-11-02","night",23636506,20,21,3853,118,551,0,false],
  ["2026-11-03","morning",23638183,42,43,3643,321,260,0,false],
]) test(`${date} ${slot}: screen progress, CSV, report, missing data and end evidence agree`,()=>{
  const day=date.replaceAll("-","");
  const stem=`mily-${slot}-${day}`;
  const data=JSON.parse(read(`public/data-lab/data/${stem}-aggregate.json`));
  const csv=read(`public/data-lab/data/${stem}-observations.csv`).trim().split(/\r?\n/);
  const report=read(`data-lab/reports/${day}-${slot}/index.html`);
  assert.equal(data.liveId,id);assert.equal(data.roomId,573253);
  assert.equal(data.observations.length,points);assert.equal(csv.length,points+1);
  assert.equal(data.quality.savedSampleRows ?? data.quality.savedRows,rows);
  if(data.quality.reacquiredRows!==undefined) assert.equal(data.quality.reacquiredRows,data.quality.validRows-points);
  assert.equal(data.quality.end_confirmed ?? false,endConfirmed);
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
    assert.ok(report.includes(o.atJst.slice(11,19)));
    if(i)assert.ok(Date.parse(o.atJst)>Date.parse(data.observations[i-1].atJst));
  }
  assert.match(report,/noindex,nofollow,noarchive/);
  assert.match(report,/確定合計ではありません/);
  assert.doesNotMatch(report+JSON.stringify(data),/\.jsonl|C:\\\\Users|writer_pid|capture_epoch|viewer[_-]?id|comment_text|access_token|drive\.google/i);
  const entries=DAILY_STREAM_ENTRIES.filter(e=>e.date===date&&e.slot===slot);
  assert.equal(entries.length,1);assert.equal(entries[0].file,stem+"-aggregate.json");
  assert.ok(read("vite.config.ts").includes(`data-lab/reports/${day}-${slot}/index.html`));
});
test("verified handoff keeps one UI series, conservative end flags, and separate event points",()=>{
  for(const [stem,count,sha] of [["mily-night-20261102",20,"0c1ef926559ba2f694298676dae7d62ebe0750f07808aaec2b934aac4215aebc"],["mily-morning-20261103",42,"defb123611e6c88063fb0aadfb27f1dbbf863cd96ec972276987d8e794f20ee0"]]){
    const d=JSON.parse(read(`public/data-lab/data/${stem}-aggregate.json`));
    const csv=readFileSync(new URL(`../public/data-lab/data/${stem}-observations.csv`,import.meta.url));
    assert.equal(createHash("sha256").update(csv).digest("hex"),sha);
    assert.equal(d.observations.length,count);
    assert.equal(d.quality.sourceReconciliation.otherSeriesMerged,false);
    assert.equal(d.quality.end_confirmed,false);
    assert.equal(d.sourceIntegrity.allManifestEntriesVerified,true);
    assert.doesNotMatch(JSON.stringify(d),/\/workspace\/|\.private|viewnum\.csv|uniqueCommenters|giftPointsEst/);
  }
  const morning=JSON.parse(read("public/data-lab/data/mily-morning-20261103-aggregate.json"));
  const event=morning.eventPointObservations;
  assert.equal(event.end.point-event.start.point,24246);
  assert.equal(event.pointDifference,24246);
  assert.equal(event.start.rank,3);assert.equal(event.end.rank,3);
  assert.equal(morning.metrics.stars,3643);
  assert.equal(morning.metrics.comments,260);
  assert.equal(morning.quality.reportedEndEvidence.rawNotificationsIncluded,false);
});
test("latest archive and gateway use November 3; latest missing values do not reuse older readings",()=>{
  assert.ok(groupByBroadcastDate().some(g=>g.date==="2026-11-03"));
  assert.match(read("data-lab/index.html"),/href="\/data-lab\/reports\/(20261107-night|20261107-morning|20261106-night|20261106-noon|20261106-morning|20261105-night|20261105-noon|20261105-morning|20261104-night|20261104-noon|20261104-morning|20261103-(night|noon|morning))\/">最新の配信レポート/);
  assert.equal(lastObservedValue({lastValidOnline:{visits:null},observations:[{atJst:"2026-11-02T22:00:00+09:00",visits:100}]},"visits","2026-11-02"),null);
});
