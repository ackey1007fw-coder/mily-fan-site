import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { streamRecaps } from '../src/data/streamRecaps.ts';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const data=JSON.parse(read('public/data-lab/data/mily-morning-20261020-aggregate.json'));
test('October 20 observations retain missing tails, exact time basis and source boundaries',()=>{
 assert.equal(data.liveId,23576663);assert.equal(data.dateJst,'2026-10-20');assert.equal(data.finalServiceValueVerified,false);assert.equal(data.quality.endConfirmed,false);assert.equal(data.quality.dataCoverageComplete,false);
 assert.equal(data.quality.rowsTotal,data.quality.completeAccepted+data.quality.partialRows+data.quality.excludedFlagsOrSession);
 assert.equal(data.observations.length,35);assert.deepEqual(data.observations.at(-1),data.lastValidOnline);
 for(let i=1;i<data.observations.length;i++){assert.ok(Date.parse(data.observations[i].atJst)>Date.parse(data.observations[i-1].atJst));for(const key of ['stars','visits','comments'])assert.ok(data.observations[i][key]>=data.observations[i-1][key]);}
 const first=data.observations[0],last=data.lastValidOnline;assert.equal(data.observedWindow.commentIncrement,last.comments-first.comments);
 assert.equal(data.observedWindow.commentDisplayPerMinute,Math.round((last.comments-first.comments)/((Date.parse(last.atJst)-Date.parse(first.atJst))/60000)*100)/100);
 assert.equal(data.observedWindow.isWholeSessionAverage,false);assert.ok(Date.parse(last.atJst)<Date.parse(data.asr.transcribedThroughJst));
 assert.doesNotMatch(JSON.stringify(data),/capture_epoch|writer_pid|viewer_id|AppData|drive\.google|chatgpt\.site|transcript\.jsonl/);
});
test('October 20 morning recap remains unique, qualified and linked from the lab without unapproved media',()=>{
 const recap=streamRecaps.find(r=>r.id==='2026-10-20-morning-showroom');assert.ok(recap);assert.equal(streamRecaps.filter(r=>r.id===recap.id).length,1);assert.equal(recap.gallery,undefined);assert.equal(recap.image,undefined);assert.equal(recap.galleryZip,undefined);
 assert.match(recap.transcriptionNote,/最終集計は未確認/);assert.ok(recap.highlights.some(h=>h.relatedLinks?.some(l=>l.url==='/data-lab/reports/20261020-morning/')));for(const point of [...recap.highlights,...recap.timeline])assert.ok(point.timestamp.split(':').reduce((n,t)=>n*60+Number(t),0)<data.recording.durationSeconds);
 const report=read('data-lab/reports/20261020-morning/index.html');assert.match(report,/noindex,nofollow,noarchive/);assert.match(report,/最終値は未確認/);assert.equal((report.match(/<circle /g)||[]).length,105);assert.match(read('data-lab/index.html'),/reports\/20261020-morning\//);
 assert.match(report,/#recap-2026-10-20-morning-showroom/);
});
