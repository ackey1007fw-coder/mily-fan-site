import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {groupByBroadcastDate, observationPoints, lastObservedValue} from "../public/data-lab/assets/daily-archive-core.js";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const data=JSON.parse(read("public/data-lab/data/mily-morning-20261118-aggregate.json"));
const report=read("data-lab/reports/20261118-morning/index.html");
const csv=read("public/data-lab/data/mily-morning-20261118-observations.csv");
test("2026-11-18 morning: API comment log aggregates only; event pt is room-display and public-API observation, not an official final",()=>{
  assert.equal(data.liveId,23700631);assert.equal(data.roomId,573253);
  assert.equal(data.dateJst,"2026-11-18");assert.equal(data.session,"morning");
  assert.equal(data.finalServiceValueVerified,false);assert.equal(data.quality.verified_final,false);assert.equal(data.quality.end_confirmed,false);
  assert.equal(data.lastValidOnline,null);
  assert.deepEqual({...data.metrics},{stars:null,visits:null,comments:null,firstVisits:null,repeatVisits:null,newFollows:null,otherFree:null,star100People:null,recommendedCommentPeople:null});
  assert.equal(data.observations.length,6);
  assert.equal(lastObservedValue(data,"comments","2026-11-18"),271);
  assert.equal(observationPoints(data,"comments","2026-11-18").length,6);
  assert.equal(observationPoints(data,"stars","2026-11-18").length,0);
  assert.equal(data.quality.interpolated,false);assert.equal(data.quality.zeroFilled,false);
  assert.equal(data.quality.rawCommentLogRows,285);assert.equal(data.quality.systemAnnouncementRows,0);assert.equal(data.quality.refetchDuplicateRows,5);assert.equal(data.quality.viewerCommentRows,280);
  const ev=data.eventPointObservations;
  assert.equal(ev.eventActive,true);
  assert.equal(ev.start.point,7683);assert.equal(ev.start.rank,4);
  assert.equal(ev.end.point,12644);assert.equal(ev.end.rank,4);
  assert.equal(ev.pointDifference,4961);
  assert.equal(ev.lastKnownBeforeFrame.point,7683);assert.equal(ev.lastKnownBeforeFrame.rank,4);
  assert.equal(ev.afterFrameObservation.point,12693);assert.equal(ev.afterFrameObservation.rank,4);
  assert.match(ev.note,/公式確定値ではありません/);
  assert.equal(data.commentLog.entries,285);assert.equal(data.commentLog.viewerEntries,280);assert.equal(data.commentLog.anonymousPosterCount,34);
  assert.equal(data.giftLog.entries,16);assert.equal(data.giftLog.totalItems,70);
  assert.equal(csv.trim().split("\n").length,7);
});
test("2026-11-18 morning: report and JSON keep viewers anonymous and wiring is in place",()=>{
  const all=report+JSON.stringify(data)+csv;
  assert.doesNotMatch(all,/\/workspace\/|\.jsonl|user_id|avatar_id|viewer[_-]?id|comment_text|access_token|drive\.google|uniqueCommenters|giftPointsEst|gap_to_upper|gap_to_lower|bcsvr|SREmu|那丘|なおか/i);
  assert.match(report,/noindex,nofollow,noarchive/);
  assert.match(report,/公式確定値ではありません/);assert.match(report,/12,644pt/);assert.match(report,/12,693pt/);
  assert.match(report,/欠測はありません/);
  for(const o of data.observations) assert.ok(report.includes(o.atJst.slice(11,19)));
  assert.deepEqual(groupByBroadcastDate().find(g=>g.date==="2026-11-18").entries.map(x=>x.slot),["morning"]);
  assert.ok(read("vite.config.ts").includes("data-lab/reports/20261118-morning/index.html"));
  assert.match(read("data-lab/index.html"),/href="\/data-lab\/reports\/20261118-morning\/">最新の配信レポート/);
  assert.match(read("public/data-lab/assets/daily-archive-core.js"),/morning: "朝"/);
});
test("2026-11-18 morning: stream stills (b270) are wired into the report",()=>{
  assert.match(report,/この配信の写真/);
  assert.match(report,/実フレームです/);
  assert.match(report,/生成や顔の加工はしていません/);
  assert.match(report,/オーナー確認のうえ掲載しています/);
  const wired=[
    "mily-b270-05-20261118-morning-compact-smile.jpg",
    "mily-b270-01-20261118-morning-opening-big-smile.jpg",
    "mily-b270-02-20261118-morning-smile.jpg",
    "mily-b270-03-20261118-morning-bangs-hands.jpg",
    "mily-b270-04-20261118-morning-big-smile.jpg",
    "mily-b270-06-20261118-morning-mascara-smile.jpg",
    "mily-b270-07-20261118-morning-hands-open-smile.jpg",
    "mily-b270-08-20261118-morning-close-smile.jpg",
    "mily-b270-09-20261118-morning-closing-smile.jpg",
    "mily-b270-10-20261118-morning-peace-smile.jpg",
  ];
  for(const name of wired) assert.ok(report.includes("/media/live/"+name),name);
  assert.equal((report.match(/\/media\/live\/mily-b270-/g)||[]).length,10);
  const section=report.slice(report.indexOf('id="stream-media"'));
  assert.ok(section.indexOf("mily-b270-05-")<section.indexOf("mily-b270-01-"),"lead visual is still 05");
  assert.ok(!report.includes("/media/live-clips/"),"no clips wired into this report");
  assert.doesNotMatch(report,/pbs\.twimg\.com|drive\.google|user_id|\/workspace\//);
});
