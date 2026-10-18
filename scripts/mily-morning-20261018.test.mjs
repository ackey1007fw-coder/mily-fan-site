import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const data=JSON.parse(read("public/data-lab/data/mily-morning-20261018-aggregate.json"));
const night=JSON.parse(read("public/data-lab/data/mily-night-20261017-aggregate.json"));
const home=read("data-lab/index.html");
const page=read("data-lab/reports/20261018-morning/index.html");
const script=read("public/data-lab/assets/morning-20261018.js");
const vite=read("vite.config.ts");
const docs=read("docs/DATA-LAB.md");
const ms=s=>Date.parse(s);
test("two broadcasts have distinct IDs and no invented official scores",()=>{
 assert.equal(data.schema,"mily-anonymous-live-observations-v1");
 assert.equal(data.roomId,573253);
 assert.equal(data.liveId,23568147);
 assert.equal(data.dateJst,"2026-10-18");
 assert.equal(data.session,"morning");
 assert.equal(data.nonOfficial,true);
 assert.equal(night.liveId,23567037);
 assert.equal(night.dateJst,"2026-10-17");
 assert.equal(night.session,"night");
 assert.match(data.eventName,/未確認/);
 assert.match(data.measurementNote,/公式確定値/);
 assert.deepEqual([data.lastValidOnline.stars,data.lastValidOnline.visits,data.lastValidOnline.comments],[9887,1603,961]);
 assert.deepEqual([night.lastValidOnline.stars,night.lastValidOnline.visits,night.lastValidOnline.comments],[2970,90,453]);
 assert.match(page,/四次審査のポイントと混ぜず/);
});
test("906 source rows checked, 812 eligible and 39 separated sampled observations",()=>{
 assert.equal(data.counters.totalRows,906);
 assert.equal(data.counters.validRows,812);
 assert.equal(data.counters.excludedRows,94);
 assert.equal(data.counters.incompleteNine,82);
 assert.equal(data.counters.sessionUnverified,8);
 assert.equal(data.counters.regressionUnverified,20);
 const arr=data.counters.observations;
 assert.equal(arr.length,39);
 assert.deepEqual(arr.at(-1),data.lastValidOnline);
 for(let i=0;i<arr.length;i++){
  assert.ok(Number.isFinite(ms(arr[i].atJst)));
  for(const k of ["stars","visits","comments","firstVisits","repeatVisits","newFollows","otherFree","star100People","recommendedCommentPeople"]){
   assert.ok(Number.isSafeInteger(arr[i][k])&&arr[i][k]>=0,k+" / "+i);
  }
  if(i){assert.ok(ms(arr[i].atJst)>ms(arr[i-1].atJst));
    for(const k of ["stars","visits","comments"])assert.ok(arr[i][k]>=arr[i-1][k],k);}
 }
 assert.match(page,/39点/);
 assert.doesNotMatch(script,/createElementNS\s*\([^)]*["'](?:path|polyline)["']/);
});
test("gaps stay explicit and observed comment pace never bridges a gap",()=>{
 const gaps=data.counters.gaps;
 assert.equal(gaps.length,5);
 assert.ok(gaps.some(g=>g.seconds>1300&&g.seconds<1400));
 for(const g of gaps){assert.ok(g.seconds>30);assert.ok(ms(g.toJst)>ms(g.fromJst));}
 const speeds=data.commentVelocity.intervals;
 assert.equal(speeds.length,12);
 for(const s of speeds){
  assert.ok(s.minutes>=3.16&&s.minutes<=5.2);
  assert.ok(s.commentsIncrease>=0);
  assert.ok(Math.abs(s.minutes-(ms(s.toJst)-ms(s.fromJst))/60000)<0.002);
  assert.ok(Math.abs(s.observedAveragePerMinute-s.commentsIncrease/s.minutes)<.06);
  assert.ok(!gaps.some(g=>ms(g.fromJst)<ms(s.toJst)&&ms(g.toJst)>ms(s.fromJst)));
 }
 assert.equal(data.manualEvidence.visits,null);
 assert.equal(data.manualEvidence.stars,4471);
 assert.equal(data.manualEvidence.comments,363);
 assert.match(page,/空白/);
});
test("quality evidence is labelled as incomplete and never official",()=>{
 assert.equal(data.recording.saved,true);
 assert.equal(data.recording.bytes,850089863);
 assert.equal(data.recording.ffmpegExitCode,0);
 assert.equal(data.recording.durationSeconds,6785.92);
 assert.equal(data.recording.fullContinuityVerified,false);
 assert.equal(data.asr.processedChunks,339);
 assert.equal(data.asr.verbatimAccuracyVerified,false);
 assert.equal(data.quality.uiEnd.state,"confirmed_three_offline_screens");
 assert.equal(data.quality.uiEnd.finalServiceValueVerified,false);
 assert.deepEqual([data.quality.websocket.framesReceived,data.quality.websocket.framesSaved],[1132,1132]);
 assert.equal(data.quality.websocket.completeSourceCoverageVerified,false);
 assert.equal(data.quality.visibleDom.totalKnownDroppedFragments,113143);
 assert.equal(data.quality.visibleDom.notLostCommentsCount,true);
 assert.equal(data.quality.httpRelay.laterContinuityConfirmed,false);
 assert.equal(data.quality.dataCoverageComplete,false);
 assert.match(page,/113,143/);
 assert.match(page,/公式/);
});
test("route and share metadata follow the common site helpers",()=>{
 assert.match(page,/noindex,nofollow,noarchive/);
 assert.match(page,/rel="canonical" href="__DATA_LAB_20261018_MORNING_CANONICAL__"/);
 assert.match(page,/property="og:url" content="__DATA_LAB_20261018_MORNING_CANONICAL__"/);
 assert.match(page,/property="og:image" content="__DATA_LAB_OG_IMAGE__"/);
 assert.doesNotMatch(page,/https:\/\/mily-fan-site\.vercel\.app/);
 assert.match(vite,/dataLabMorning20261018: "data-lab\/reports\/20261018-morning\/index.html"/);
 assert.match(vite,/"__DATA_LAB_20261018_MORNING_CANONICAL__"/);
 assert.ok(home.indexOf('id="morning-20261018"')<home.indexOf('id="night-20261017"'));
 assert.match(home,/href="#morning-20261018"/);
 assert.match(home,/href="\/data-lab\/reports\/20261018-morning\/"/);
 assert.match(docs,/2026-10-18 朝配信/);
});
test("new files are anonymous and do not expose personal logs or archive links",()=>{
 for(const s of [JSON.stringify(data),page,script]){
  assert.doesNotMatch(s,/chatgpt\.site|drive\.google\.com|[A-Z]:\\Users\\|@[a-z0-9.-]+\.com|viewer[_-]?id|user[_-]?id|contributor[_-]?id|comment_text|transcript\.jsonl|browser-received-events|normal-browser-relays\.private/i);
 }
 assert.match(page,/非公式/);
 assert.doesNotMatch(page,/アイドル本人が感動|本人は喜んでいる/);
});

test("gap boundary partial evidence is separately displayed without false zeros",()=>{
 const edges=data.counters.gapBoundaryObservations;
 assert.equal(edges.length,10);
 assert.equal(data.quality.partialBoundaryKnown,9);
 assert.equal(data.quality.partialBoundaryTotal,10);
 assert.match(data.counters.boundaryPolicy,/逆行未検証/);
 assert.deepEqual([edges[0].stars,edges[0].visits,edges[0].comments],[null,null,null]);
 assert.deepEqual([edges[5].stars,edges[5].visits,edges[5].comments],[5118,null,435]);
 assert.deepEqual([edges[9].stars,edges[9].visits,edges[9].comments],[7177,null,674]);
 for(let i=0;i<edges.length;i++){
   const p=edges[i],g=data.counters.gaps[Math.floor(i/2)];
   assert.equal(p.gapIndex,Math.floor(i/2));
   assert.equal(p.side,i%2===0?"before":"after");
   assert.equal(ms(p.atJst),ms(i%2===0?g.fromJst:g.toJst));
   assert.equal(p.safeForVelocity,false);
   for(const key of ["stars","visits","comments"])assert.ok(p[key]===null||Number.isSafeInteger(p[key]));
 }
 assert.match(page,/id="m18-boundary-table"/);
 assert.match(page,/9項目が揃わない/);
 assert.match(script,/gapBoundaryObservations\.forEach/);
 assert.match(script,/stroke-dasharray/);
 assert.match(script,/partialBoundaryTotal/);
});
test("mobile page navigation uses native accessible details disclosure below 1024px",()=>{
 assert.match(page,/<details class="mobile-nav">/);
 assert.match(page,/<summary aria-label="関連するページを開く">/);
 assert.match(page,/<nav aria-label="モバイル向け関連ページ">/);
 assert.match(page,/@media\(max-width:1023px\)/);
 assert.match(page,/\.top-inner>\.nav\{display:none\}/);
 assert.match(page,/\.mobile-nav\{display:block/);
 assert.match(page,/:focus-visible/);
});
test("all nine anonymized end-screen metrics are compared as separate screen displays",()=>{
 const n=data.comparison.nightLastValidOnline,m=data.lastValidOnline;
 assert.deepEqual([n.stars,n.visits,n.comments,n.firstVisits,n.repeatVisits,n.newFollows,n.otherFree,n.star100People,n.recommendedCommentPeople],
 [2970,90,453,0,0,1,20,27,20]);
 assert.deepEqual([m.stars,m.visits,m.comments,m.firstVisits,m.repeatVisits,m.newFollows,m.otherFree,m.star100People,m.recommendedCommentPeople],
 [9887,1603,961,105,64,7,885,86,151]);
 assert.match(page,/id="m18-nine-metrics"/);
 assert.match(script,/function nineMetrics/);
 assert.match(page,/合計数の大小だけで応援や盛り上がりの優劣は決められません/);
});
