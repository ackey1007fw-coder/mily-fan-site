import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue} from "../public/data-lab/assets/daily-archive-core.js";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const data=JSON.parse(read("public/data-lab/data/mily-noon-20261103-aggregate.json"));
const report=read("data-lab/reports/20261103-noon/index.html");
test("2026-11-03 noon: API record is end-confirmed, UI counters stay null (not zero)",()=>{
  assert.equal(data.liveId,23639251);assert.equal(data.roomId,573253);
  assert.equal(data.dateJst,"2026-11-03");assert.equal(data.session,"noon");
  for(const k of Object.keys(data.metrics)) assert.equal(data.metrics[k],null);
  assert.equal(data.observations.length,0);
  for(const m of ["stars","visits","comments"]){
    assert.equal(lastObservedValue(data,m,"2026-11-03"),null);
    assert.equal(observationPoints(data,m,"2026-11-03").length,0);
  }
  const a=data.apiRecord;
  assert.equal(a.end_confirmed,true);assert.equal(data.finalServiceValueVerified,false);assert.equal(data.quality.verified_final,false);
  assert.equal(a.liveStartedAtJst,"2026-11-03T14:45:33+09:00");assert.equal(a.liveEndDetectedAtJst,"2026-11-03T15:16:55+09:00");
  assert.equal(a.uncapturedStart.seconds,35);
  assert.equal(a.eventPoints.end.point-a.eventPoints.start.point,14022);assert.equal(a.eventPoints.pointDifference,14022);
  assert.equal(a.eventPoints.start.rank,3);assert.equal(a.eventPoints.end.rank,3);
  assert.equal(a.commentLogEntries,187);assert.equal(a.giftLogEntries,137);
  assert.equal(a.viewNum.field,"view_num");assert.equal(a.viewNum.meaning,"未確認");
  assert.equal(a.viewNum.observations.length,36);assert.equal(a.viewNum.lastObserved.value,516);
  const v=a.viewNum.observations;
  for(let i=1;i<v.length;i++){assert.ok(Date.parse(v[i].atJst)>Date.parse(v[i-1].atJst));assert.ok(v[i].view_num>=v[i-1].view_num);}
  assert.ok(v.every(o=>o.view_num>0),"post-end zero is not adopted");
  assert.equal(data.quality.interpolated,false);assert.equal(data.quality.zeroFilled,false);
  assert.equal(data.quality.sourceReconciliation.otherSeriesMerged,false);
});
test("2026-11-03 noon: report and JSON keep viewers anonymous and labels honest",()=>{
  const all=report+JSON.stringify(data);
  assert.doesNotMatch(all,/\/workspace\/|\.jsonl|user_id|avatar|viewer[_-]?id|comment_text|access_token|drive\.google|uniqueCommenters|giftPointsEst|gap_to_upper|gap_to_lower|視聴数|視聴者数は/i);
  assert.match(report,/noindex,nofollow,noarchive/);
  assert.match(report,/確定合計ではありません/);
  assert.match(report,/未取得/);assert.match(report,/view_num/);assert.match(report,/\+14,022/);
  for(const o of data.apiRecord.viewNum.observations) assert.ok(report.includes(o.atJst.slice(11,19)));
  const e=DAILY_STREAM_ENTRIES.filter(x=>x.date==="2026-11-03");
  assert.deepEqual(groupByBroadcastDate().find(g=>g.date==="2026-11-03").entries.map(x=>x.slot),["night","noon","morning"]);
  assert.equal(e.length,3);
  assert.ok(read("vite.config.ts").includes("data-lab/reports/20261103-noon/index.html"));
  assert.match(read("data-lab/index.html"),/href="\/data-lab\/reports\/(20261112-night|20261111-night|20261111-evening|20261111-afternoon|20261111-morning|20261110-night|20261110-morning|20261107-night|20261107-morning|20261106-night|20261106-noon|20261106-morning|20261105-night|20261105-noon|20261105-morning|20261104-night|20261104-noon|20261104-morning|20261103-(night|noon))\/">最新の配信レポート/);
});
