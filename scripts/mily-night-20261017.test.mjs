import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const data = JSON.parse(read("public/data-lab/data/mily-night-20261017-aggregate.json"));
const morning = JSON.parse(read("public/data-lab/data/mily-morning-20261017-aggregate.json"));
const home=read("data-lab/index.html");
const page=read("data-lab/reports/20261017-night/index.html");
const js=read("public/data-lab/assets/night-20261017.js");
const css=read("public/data-lab/assets/night-20261017.css");
const vite=read("vite.config.ts");
const pts=data.counters.observations;
const velocities=data.commentVelocity.intervals;

test("10/17 night is the independent session and not an official final score",()=>{
 assert.equal(data.schema,"mily-anonymous-live-observations-v1");
 assert.equal(data.roomId,573253);
 assert.equal(data.liveId,23567037);
 assert.equal(data.dateJst,"2026-10-17");
 assert.equal(data.session,"night");
 assert.equal(data.nonOfficial,true);
 assert.deepEqual([data.lastValidOnline.stars,data.lastValidOnline.visits,data.lastValidOnline.comments],[2970,90,453]);
 assert.equal(data.lastValidOnline.atJst,"2026-10-17T23:20:00.307+09:00");
 assert.equal(data.comparison.morningLiveId,23564059);
 assert.equal(morning.live_id,23564059);
 assert.equal(morning.observed_screen.stars,11662);
 assert.equal(data.quality.uiEnd.state,"confirmed_three_offline_screens");
 assert.match(data.measurementNote,/公式確定値/);
 assert.match(data.eventName,/未確認/);
 assert.match(page,/四次審査とは別集計|四次審査の累計や公式ptへ加算しません/);
});

test("629 saved timeline rows, 595 verified readings and 50 actual chronological sampled values",()=>{
 assert.equal(data.counters.totalRows,629);
 assert.equal(data.counters.validRows,595);
 assert.equal(data.counters.invalidReasons.session_unverified,8);
 assert.equal(data.counters.invalidReasons.major_counter_missing,26);
 assert.equal(629-595,34);
 assert.equal(pts.length,50);
 assert.deepEqual([pts[0].stars,pts[0].visits,pts[0].comments],[520,20,16]);
 assert.equal(pts[0].atJst,"2026-10-17T22:32:25.524+09:00");
 assert.deepEqual([pts[49].stars,pts[49].visits,pts[49].comments],[2970,90,453]);
 assert.deepEqual(pts[49],data.lastValidOnline);
 assert.equal(data.counters.discontinuities.length,0);
 for(let i=0;i<pts.length;i++){
  assert.ok(Number.isFinite(Date.parse(pts[i].atJst)));
  for(const k of ["stars","visits","comments","firstVisits","repeatVisits","newFollows","otherFree","star100People","recommendedCommentPeople"]){
   assert.ok(Number.isSafeInteger(pts[i][k])&&pts[i][k]>=0,k+" "+i);
  }
  if(i>0){
   assert.ok(Date.parse(pts[i].atJst)>Date.parse(pts[i-1].atJst));
   for(const k of ["stars","visits","comments"])assert.ok(pts[i][k]>=pts[i-1][k],k+" "+i);
  }
 }
});

test("comment pace uses real adjacent endpoints only and never WS/DOM counts",()=>{
 assert.equal(velocities.length,9);
 for(const v of velocities){
  const seconds=(Date.parse(v.toJst)-Date.parse(v.fromJst))/1000;
  assert.ok(seconds>=220&&seconds<=380);
  assert.ok(v.samplingPoints>=5);
  assert.ok(Math.abs(v.minutes-seconds/60)<.001);
  assert.ok(Math.abs(v.observedAveragePerMinute-v.commentsIncrease/(seconds/60))<.01);
  assert.ok(Number.isInteger(v.commentsIncrease)&&v.commentsIncrease>=0);
  assert.ok(v.observedAveragePerMinute>=0);
 }
 assert.deepEqual([velocities.at(-1).commentsIncrease,velocities.at(-1).observedAveragePerMinute],[54,13.17]);
 assert.match(data.commentVelocity.definition,/差分/);
 assert.match(page,/DOM変化断片数やWebSocketフレーム数をコメント数へ換算しません/);
 assert.doesNotMatch(js,/createElementNS\([^,]*,\s*["'](?:path|polyline)["']/);
});

test("quality labels are differentiated rather than implying full coverage",()=>{
 assert.equal(data.quality.recording.state,"confirmed_saved");
 assert.equal(data.quality.recording.fullContinuityVerified,false);
 assert.equal(data.quality.asr.processedChunks,147);
 assert.equal(data.quality.asr.verbatimAccuracyVerified,false);
 assert.equal(data.quality.websocket.framesReceived,854);
 assert.equal(data.quality.websocket.framesSaved,854);
 assert.equal(data.quality.websocket.completeSourceEventCoverageVerified,false);
 assert.equal(data.quality.visibleDom.observerDroppedFragments,38042);
 assert.equal(data.quality.httpRelay.responsesObserved,115);
 assert.equal(data.quality.httpRelay.responsesPersisted,10);
 assert.equal(data.quality.httpRelay.queuedNotPersisted,80);
 assert.equal(data.quality.httpRelay.droppedRecords,25);
 assert.equal(data.quality.httpRelay.writerError,"EPERM");
 assert.match(page,/可視DOMイベントは完全保存ではありません/);
 assert.match(page,/失われたコメントの数ではありません/);
 assert.match(page,/22:32:08/);
 assert.match(home,/38,042/);
});

test("home and accessible report routes preserve previous Oct 17 morning page",()=>{
 assert.ok(home.indexOf('id="night-20261017"')>=0);
 assert.ok(home.indexOf('id="night-20261017"')<home.indexOf('id="morning-20261017"'));
 assert.match(home,/href="#night-20261017"/);
 assert.match(home,/href="\/data-lab\/reports\/20261017-night\/"/);
 assert.match(vite,/dataLabNight20261017: "data-lab\/reports\/20261017-night\/index.html"/);
 assert.match(page,/noindex,nofollow,noarchive/);
 assert.match(page,/aria-label="グラフに表示する指標"/);
 assert.match(page,/data-n17-metric="stars" aria-pressed="true"/);
 assert.match(page,/id="n17-table-body"/);
 assert.match(page,/id="n17-velocity-bars"/);
 assert.match(page,/id="n17-velocity-table"/);
 assert.match(js,/aria-pressed/);
 assert.doesNotMatch(js,/\.at\s*\(/);
 assert.match(css,/@media\(max-width:720px\)/);
 assert.match(page,/\/data-lab\/reports\/20261017-morning\//);
 for(const id of ["morning-20261017","night-20261016","morning-20261016","final-night"])assert.ok(home.includes('id="'+id+'"'),id);
});

test("new published bytes contain no viewer, comment body, raw session or private paths",()=>{
 for(const src of [JSON.stringify(data),page,js,css,home.slice(home.indexOf('id="night-20261017"'),home.indexOf('id="night-20261016"'))]){
  assert.doesNotMatch(src,/chatgpt\.site|drive\.google\.com|@[a-z0-9.-]+\.com|[A-Z]:\\Users\\|viewer[_-]?id|user[_-]?id|contributor[_-]?id|comment_text|\btranscript\.jsonl\b|browser-received-events|counter-timeline\.private|normal-browser-relays/i);
 }
 assert.match(page,/非公式ファン制作/);
});
