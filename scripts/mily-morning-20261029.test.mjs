import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DAILY_STREAM_ENTRIES,observationPoints,lastObservedValue,groupByBroadcastDate} from '../public/data-lab/assets/daily-archive-core.js';
const read=p=>readFileSync(p,'utf8');
const d=JSON.parse(read('public/data-lab/data/mily-morning-20261029-aggregate.json'));
const report=read('data-lab/reports/20261029-morning/index.html');
test('Oct 29 morning identity, nine references and non-final boundary are fixed',()=>{
 assert.equal(d.roomId,573253);assert.equal(d.liveId,23616187);assert.equal(d.dateJst,'2026-10-29');assert.equal(d.session,'morning');
 assert.deepEqual(d.metrics,{stars:4665,visits:649,comments:319,firstVisits:21,repeatVisits:25,newFollows:2,otherFree:6170,star100People:43,recommendedCommentPeople:48});
 assert.equal(d.lastValidOnline.atJst,'2026-10-29T06:32:47.154+09:00');
 assert.equal(d.lastValidOnline.savedObservedAtJst,d.lastValidOnline.atJst);
 assert.equal(d.lastValidOnline.confirmedFinal,false);assert.equal(d.finalServiceValueVerified,false);assert.equal(d.completeCoverageConfirmed,false);
 assert.equal(d.timingComparisonEligible,false);assert.equal(d.eventName,null);assert.equal(d.eventPoints,null);
 assert.equal(d.quality.endConfirmed,true);assert.equal(d.quality.endConfirmation.confirmedAtJst,'2026-10-29T06:44:34.260+09:00');assert.equal(d.quality.endConfirmation.offlineObservedAtJst.length,3);assert.equal(d.quality.rawDetailComplete,false);
 assert.equal(d.recording.saved,true);assert.equal(d.recording.fullContinuityVerified,false);
});
test('selected points never advance beyond real screen progress or fill null visits',()=>{
 assert.equal(d.observations.length,36);assert.equal(d.quality.timelineRowsAtSnapshot,433);assert.equal(d.quality.uniqueFreshScreenTimes,225);
 assert.equal(d.quality.freshRowsAccepted,304);assert.equal(d.quality.staleResavesExcluded,true);
 assert.equal(d.observations[0].stars,120);assert.equal(d.observations[0].visits,null);
 for(let i=0;i<d.observations.length;i++){
  const r=d.observations[i];assert.ok(Date.parse(r.atJst)<=Date.parse(d.lastValidOnline.atJst));
  const age=Date.parse(r.savedObservedAtJst)-Date.parse(r.atJst);assert.ok(age>=0&&age<=30000);
  if(i){assert.ok(r.atJst>d.observations[i-1].atJst);assert.ok(r.stars>=d.observations[i-1].stars);}
 }
 assert.equal(d.quality.initialVisitsMissing.firstNumericAtJst,'2026-10-29T06:01:57.063+09:00');
 assert.equal(d.quality.initialVisitsMissing.backfilled,false);
 for(const metric of ['stars','visits','comments']){
  const p=observationPoints(d,metric,d.dateJst);assert.ok(p.length>=2);assert.equal(p.at(-1).value,d.metrics[metric]);
  assert.equal(lastObservedValue(d,metric,d.dateJst),d.metrics[metric]);
 }
 assert.ok(observationPoints(d,'visits',d.dateJst).every(p=>p.time>=Date.parse(d.quality.initialVisitsMissing.firstNumericAtJst)));
});
test('endpoint differences and gaps do not imply missing gifts or cross-gap rates',()=>{
 assert.deepEqual(d.analysisEndpoints.map(r=>r.stars),[120,994,2068,2640,3390,4041,4524,4665]);
 assert.deepEqual(d.endpointDifferences.map(r=>r.starsIncrease),[874,1074,572,750,651,483,141]);
 assert.equal(d.analysis.observedIncrease,4545);assert.equal(d.analysis.largestSelectedInterval.starsIncrease,1074);
 assert.equal(d.analysis.shareOfLastDisplayBefore0610Percent,44.3);assert.equal(d.analysis.shareOfLastDisplayBefore0620Percent,72.7);
 assert.deepEqual(d.endpointDifferences.map(r=>r.containsObservationGap),[false,false,true,false,false,true,false]);
 for(let i=0;i<d.endpointDifferences.length;i++){
  const x=d.endpointDifferences[i],a=d.analysisEndpoints[i],b=d.analysisEndpoints[i+1];
  assert.equal(x.starsIncrease,b.stars-a.stars);assert.equal(x.elapsedSeconds,(Date.parse(b.atJst)-Date.parse(a.atJst))/1000);assert.equal(x.ratePublished,false);
 }
 assert.deepEqual(d.quality.observationGapsOver30Seconds.map(g=>g.seconds),[43.002,41.164]);
 assert.equal(d.endpointDifferences.at(-1).elapsedSeconds,167.821);
});
test('report and daily registration retain boundaries and existing fallback',()=>{
 const entries=DAILY_STREAM_ENTRIES.filter(e=>e.date==='2026-10-29'&&e.slot==='morning');assert.equal(entries.length,1);
 assert.equal(groupByBroadcastDate()[0].date,'2026-10-29');assert.equal(entries[0].report,'/data-lab/reports/20261029-morning/');
 assert.match(report,/noindex,nofollow,noarchive/);assert.match(report,/__DATA_LAB_20261029_MORNING_CANONICAL__/);
 assert.equal((report.match(/class="observed-star"/g)||[]).length,8);assert.equal((report.match(/class="observation-gap"/g)||[]).length,2);
 assert.doesNotMatch(report,/<polyline|<video|<audio|<img/);assert.match(report,/公式最終値/);assert.match(report,/6:32:47/);assert.match(report,/全イベントの取得は未検証/);
 assert.match(report,/\n<\/body>\n/);
 const lab=read('data-lab/index.html');assert.equal((lab.match(/id="morning-20261029"/g)||[]).length,1);
 assert.ok(lab.indexOf('id="morning-20261029"')<lab.indexOf('id="morning-20261028"'));
 assert.match(lab,/<nav id="daily-fallback-links"[^>]*><a href="#morning-20261028">10\/28<\/a>/);
 const vite=read('vite.config.ts');assert.match(vite,/dataLabMorning20261029/);assert.match(vite,/reports\/20261029-morning/);
});
test('public additions do not leak source records, viewer identities or private locations',()=>{
 const pub=JSON.stringify(d)+report;
 assert.doesNotMatch(pub,/C:\\|AppData|\.jsonl|@gmail|viewer[_-]?id|contributor[_-]?id|capture_epoch|writer_pid|drive\.google|chatgpt\.site|あっきー/);
 const runner=read('scripts/data-lab.browser.mjs');assert.match(runner,/checkMorning20261029\(page, baseUrl, output, engine, width\)/);
});
