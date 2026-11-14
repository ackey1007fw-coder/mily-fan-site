import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {groupByBroadcastDate, observationPoints, lastObservedValue} from "../public/data-lab/assets/daily-archive-core.js";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const data=JSON.parse(read("public/data-lab/data/mily-morning-20261114-aggregate.json"));
const report=read("data-lab/reports/20261114-morning/index.html");
const csv=read("public/data-lab/data/mily-morning-20261114-observations.csv");
test("2026-11-14 morning: last valid UI display is a mid-stream reference; event pt is a recorded difference",()=>{
  assert.equal(data.liveId,23683757);assert.equal(data.roomId,573253);
  assert.equal(data.dateJst,"2026-11-14");assert.equal(data.session,"morning");
  assert.equal(data.finalServiceValueVerified,false);assert.equal(data.quality.verified_final,false);assert.equal(data.quality.end_confirmed,false);
  assert.equal(data.lastValidOnline.confirmedFinal,false);
  assert.deepEqual({...data.metrics},{stars:11964,visits:1301,comments:982,firstVisits:98,repeatVisits:16,newFollows:12,otherFree:765,star100People:100,recommendedCommentPeople:295});
  assert.equal(data.observations.length,7);
  assert.equal(lastObservedValue(data,"stars","2026-11-14"),11964);
  assert.equal(observationPoints(data,"stars","2026-11-14").length,7);
  assert.equal(data.quality.interpolated,false);assert.equal(data.quality.zeroFilled,false);
  assert.ok(data.observations.every(o=>o.stars>0),"post-end reset rows are excluded");
  const ev=data.eventPointObservations;
  assert.equal(ev.eventActive,true);assert.equal(ev.start.point,212630);assert.equal(ev.end.point,236539);assert.equal(ev.pointDifference,23909);
  assert.equal(ev.start.rank,3);assert.equal(ev.end.rank,2);
  assert.equal(data.commentLog.entries,1121);assert.equal(data.commentLog.anonymousPosterCount,438);
  assert.equal(csv.trim().split("\n").length,8);
  assert.match(ev.note,/04:30〜04:54/);assert.match(ev.note,/補間・逆算なし/);
  assert.ok(!("gap_to_upper" in ev.start) && !("gap_to_lower" in ev.end));
});
test("2026-11-14 morning: report and JSON keep viewers anonymous and wiring is in place",()=>{
  const all=report+JSON.stringify(data)+csv;
  assert.doesNotMatch(all,/\/workspace\/|\.jsonl|user_id|avatar|viewer[_-]?id|comment_text|access_token|drive\.google|uniqueCommenters|giftPointsEst|gap_to_upper|gap_to_lower|bcsvr|SREmu|那丘|なおか/i);
  assert.match(report,/noindex,nofollow,noarchive/);
  assert.match(report,/確定合計ではありません/);assert.match(report,/途中参考値/);assert.match(report,/\+23,909pt/);
  assert.match(report,/05:58:40/);assert.match(report,/04:30〜04:54は未記録/);
  for(const o of data.observations) assert.ok(report.includes(o.atJst.slice(11,19)));
  assert.deepEqual(groupByBroadcastDate().find(g=>g.date==="2026-11-14").entries.map(x=>x.slot),["noon","morning"]);
  assert.ok(read("vite.config.ts").includes("data-lab/reports/20261114-morning/index.html"));
  assert.match(read("data-lab/index.html"),/href="\/data-lab\/reports\/(20261114-noon|20261114-morning)\/">最新の配信レポート/);
  assert.match(read("public/data-lab/assets/daily-archive-core.js"),/morning: "朝"/);
});
test("2026-11-14 morning: owner-selected stream stills are wired into the report",()=>{
  assert.match(report,/この配信の写真/);
  assert.match(report,/実フレームです/);
  assert.match(report,/生成や顔の加工はしていません/);
  assert.match(report,/録画のない05:32:09〜05:41:57の区間の写真はありません/);
  const wired=[
    "mily-b266-16-20261114-morning-cat-paws-gentle-smile.jpg",
    "mily-b266-09-20261114-morning-song-cat-paw-pose.jpg",
    "mily-b266-01-20261114-morning-cat-paws-forward-smile.jpg",
    "mily-b266-02-20261114-morning-cat-ear-big-laugh.jpg",
    "mily-b266-15-20261114-morning-pointing-smile.jpg",
    "mily-b266-03-20261114-morning-cat-paws-to-camera.jpg",
    "mily-b266-17-20261114-morning-cat-paws-big-smile.jpg",
    "mily-b266-18-20261114-morning-cat-paws-cheeks.jpg",
    "mily-b266-05-20261114-morning-goodbye-both-hands-wave.jpg",
    "mily-b266-06-20261114-morning-goodbye-final-pose.jpg",
  ];
  for(const name of wired) assert.ok(report.includes("/media/live/"+name),name);
  assert.equal((report.match(/\/media\/live\/mily-b266-/g)||[]).length,10);
  const section=report.slice(report.indexOf('id="stream-media"'));
  assert.ok(section.indexOf("mily-b266-16-")<section.indexOf("mily-b266-09-"),"lead visual is still 16");
  for(const name of [
    "mily-b266-04-20261114-morning-laugh-raised-hands.jpg",
    "mily-b266-07-20261114-morning-talk-smile.jpg",
    "mily-b266-08-20261114-morning-cat-ear-talk-smile.jpg",
    "mily-b266-10-20261114-morning-cat-ear-bright-smile.jpg",
  ]) assert.ok(!report.includes(name),"unselected still stays unwired: "+name);
  assert.doesNotMatch(report,/pbs\.twimg\.com|drive\.google|user_id|\/workspace\//);
});
test("2026-11-14 morning: only audio-checked clips are wired; read-out and unverified clips stay out",()=>{
  assert.match(report,/短い映像（原音つき）/);
  assert.match(report,/名前や順位の読み上げ区間を含まないことを確かめた2本だけ/);
  for(const name of [
    "mily-b266-11-20261114-morning-clip-cat-ear-talk-paws.mp4",
    "mily-b266-11-20261114-morning-clip-cat-ear-talk-paws-poster.jpg",
    "mily-b266-12-20261114-morning-clip-goodbye-both-hands-wave.mp4",
    "mily-b266-12-20261114-morning-clip-goodbye-both-hands-wave-poster.jpg",
  ]) assert.ok(report.includes("/media/live-clips/"+name),name);
  assert.equal((report.match(/<video/g)||[]).length,2);
  for(const prefix of ["mily-b266-13-","mily-b266-14-"])
    assert.ok(!report.includes(prefix),"unwired clip stays out: "+prefix);
});
