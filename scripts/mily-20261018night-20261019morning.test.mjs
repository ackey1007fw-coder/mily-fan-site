import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../"+path, import.meta.url),"utf8");
const night = JSON.parse(read("public/data-lab/data/mily-night-20261018-aggregate.json"));
const morning = JSON.parse(read("public/data-lab/data/mily-morning-20261019-aggregate.json"));
const home=read("data-lab/index.html"); const vite=read("vite.config.ts");
const nightHtml=read("data-lab/reports/20261018-night/index.html");
const morningHtml=read("data-lab/reports/20261019-morning/index.html");
const keys=["stars","visits","comments","firstVisits","repeatVisits","newFollows","otherFree","star100People","recommendedCommentPeople"];
test("10/18 night nine verified screen metrics, NOT official end score",()=>{
 assert.equal(night.schema,"mily-anonymous-live-observations-v1");assert.equal(night.nonOfficial,true);assert.equal(night.roomId,573253);assert.equal(night.liveId,23571625);assert.equal(night.dateJst,"2026-10-18");assert.equal(night.session,"night");
 assert.deepEqual(keys.map(k=>night.lastValidOnline[k]),[2080,77,457,0,1,1,200,19,17]);
 assert.equal(night.lastValidOnline.atJst,"2026-10-19T00:07:08.712+09:00");assert.equal(night.finalServiceValueVerified,false);
 assert.equal(night.recording.saved,true);assert.equal(night.recording.ffmpegExitCode,0);assert.equal(night.recording.fullContinuityVerified,false);
 assert.equal(night.quality.websocket.receivedFrames,729);assert.equal(night.quality.websocket.persistedFrames,729);
 assert.equal(night.quality.visibleDom.droppedObserverFragments,25744);assert.equal(night.quality.visibleDom.notLostCommentCount,true);
 assert.equal(night.quality.httpRelay.pendingAtEnd,44);assert.equal(night.quality.httpRelay.writeError,"EPERM");assert.equal(night.quality.dataCoverageComplete,false);
 assert.equal(night.observations.length,0);assert.match(night.eventName,/未確認/);
});
test("10/19 morning is partial, invalid visit and no false final zero",()=>{
 assert.equal(morning.schema,night.schema);assert.equal(morning.roomId,573253);assert.equal(morning.liveId,23572405);assert.equal(morning.dateJst,"2026-10-19");assert.equal(morning.session,"morning");
 assert.equal(morning.lastValidOnline,null);assert.equal(morning.finalServiceValueVerified,false);
 assert.equal(morning.earlyPartialObservation.atJst,"2026-10-19T05:53:00.196+09:00");
 assert.equal(morning.earlyPartialObservation.stars,0);assert.equal(morning.earlyPartialObservation.visits,null);assert.equal(morning.earlyPartialObservation.comments,0);
 assert.equal(morning.earlyPartialObservation.metricsComplete,false);assert.equal(morning.earlyPartialObservation.isFinal,false);
 assert.equal(morning.quality.collectorChildExitCode,79);assert.equal(morning.quality.endConfirmed,false);assert.equal(morning.quality.manualAttentionRequired,true);
 assert.equal(morning.recording.saved,true);assert.equal(morning.recording.fullContinuityVerified,false);assert.equal(morning.recording.ffmpegExitCode,0);assert.equal(morning.asr.processedChunksAtCheck,32);assert.equal(morning.asr.finished,false);assert.equal(morning.quality.dataCoverageComplete,false);
 assert.equal(morning.quality.websocket.receivedFrames,5);assert.equal(morning.quality.websocket.persistedFrames,5);
 assert.equal(morning.observations.length,0);
});
test("home, report routes, canonical and publication boundaries",()=>{
 assert.ok(home.indexOf('id="morning-20261019"') < home.indexOf('id="night-20261018"'));
 assert.ok(home.indexOf('id="night-20261018"') < home.indexOf('id="morning-20261018"'));
 for(const id of ["morning-20261019","night-20261018","morning-20261018","night-20261017"]){assert.ok(home.includes('id="'+id+'"'));}
 assert.match(home,/reports\/20261019-morning/);assert.match(home,/reports\/20261018-night/);
 for(const [h,s] of [[nightHtml,"20261018_NIGHT"],[morningHtml,"20261019_MORNING"]]){
  assert.match(h,/noindex,nofollow,noarchive/);assert.match(h,/非公式/);assert.match(h,/__DATA_LAB_OG_IMAGE__/);assert.ok(h.includes("__DATA_LAB_"+s+"_CANONICAL__"));assert.match(h,/四次審査/);assert.match(h,/コメント本文/);
 }
 assert.match(morningHtml,/最終集計：未確定/);assert.match(morningHtml,/0を配信終了値/);
 assert.match(nightHtml,/2,080/);assert.match(nightHtml,/25,744/);
 for(const route of ["dataLabNight20261018", "dataLabMorning20261019"]){assert.ok(vite.includes(route));}
 for(const x of ["__DATA_LAB_20261018_NIGHT_CANONICAL__","__DATA_LAB_20261019_MORNING_CANONICAL__"]){assert.ok(vite.includes(x));}
 const published=[home,nightHtml,morningHtml,JSON.stringify(night),JSON.stringify(morning)];
 for(const sourceText of published){
  const lowered=sourceText.toLowerCase();
  for(const needle of ["chatgpt.site","drive.google.com","@gmail.com","viewer_id","viewer-id","user_id","user-id","comment_text","browser-received-events","counter-timeline.private","normal-browser-relays.private"]){
   assert.ok(!lowered.includes(needle),"Sensitive content in publishable source: "+needle);
  }
  assert.doesNotMatch(sourceText,/[a-z]:\\users\\/i);
 }
});
