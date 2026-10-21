import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REPORTS,render} from './build-live-observation-reports.mjs';
import {generate} from './build-stream-timing.mjs';
import {streamRecaps} from '../src/data/streamRecaps.ts';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const inputs=REPORTS.map(c=>({c,d:JSON.parse(read('public/data-lab/data/mily-'+c.slot+'-'+c.date+'-aggregate.json'))}));
test('both recaps retain date order, their own recordings and an explicit review scope',()=>{
 const ids=['2026-10-21-morning-showroom','2026-10-20-night-showroom','2026-10-20-morning-showroom'];
 assert.deepEqual(streamRecaps.filter(r=>ids.includes(r.id)).map(r=>r.id),ids);
 for(const {c,d} of inputs){
  const recap=streamRecaps.find(r=>r.id===c.recap);assert.ok(recap);
  assert.equal(streamRecaps.filter(r=>r.id===c.recap).length,1);
  assert.equal(d.recording.partMetadata.length,2);
  assert.equal(d.recording.mediaDurationSecondsTotal,Math.round(d.recording.partMetadata.reduce((n,p)=>n+p.mediaDurationSeconds,0)*1000)/1000);
  assert.equal(d.recording.asrProcessedChunksTotal,d.recording.partMetadata.reduce((n,p)=>n+p.asrProcessedChunks,0));
  assert.match(recap.transcriptionNote,/原音の手動聴取・動画の視聴は行っていません/);
  assert.match(recap.transcriptionNote,/連続収録を保証しません/);
  assert.match(recap.transcriptionNote,/通信エラー/);
  assert.ok(recap.highlights.some(h=>h.relatedLinks?.some(l=>l.url==='/data-lab/reports/'+c.date+'-'+c.slot+'/')));
  for(const point of [...recap.highlights,...recap.timeline])assert.ok(point.timestamp.split(':').reduce((n,v)=>n*60+Number(v),0)<d.recording.mediaDurationSecondsTotal);
  for(const key of ['galleryZip','songs'])assert.equal(recap[key],undefined);
  assert.equal(recap.gallery.length,5);assert.ok(recap.gallery.includes(recap.image));
  assert.equal(recap.highlights.filter(h=>h.clip).length,1);
 }
 assert.equal(streamRecaps.find(r=>r.id==='2026-10-21-morning-showroom').ranking.length,0);assert.equal(streamRecaps.find(r=>r.id==='2026-10-20-night-showroom').ranking.length,1);
});
test('two sessions retain separate identities, all nine checkpoint values and observed gaps',()=>{
 const expectations=[
  {id:23578225,rows:2566,accepted:2449,points:207,gaps:4,last:'21:26:36.457',values:[7087,856,1170,46,33,5,859,60,67]},
  {id:23581008,rows:1869,accepted:1592,points:155,gaps:6,last:'08:07:32.736',values:[11214,1882,972,93,81,4,90,98,152]}
 ];
 for(let i=0;i<inputs.length;i++){
  const {d}=inputs[i],x=expectations[i],v=d.lastValidOnline;
  assert.equal(d.liveId,x.id);assert.equal(d.counters.rowsRead,x.rows);assert.equal(d.counters.acceptedRows,x.accepted);
  assert.equal(d.observations.length,x.points);assert.equal(d.counters.gaps.length,x.gaps);
  assert.ok(v.atJst.includes(x.last));
  assert.deepEqual(['stars','visits','comments','firstVisits','repeatVisits','newFollows','otherFree','star100People','recommendedCommentPeople'].map(k=>v[k]),x.values);
  assert.equal(d.counters.acceptedRows+d.counters.excludedBeforeCheckpoint+d.counters.rowsAfterLastUsable,d.counters.rowsRead);
  assert.deepEqual(d.observations.at(-1),v);assert.equal(d.finalServiceValueVerified,false);assert.equal(d.completeCoverageConfirmed,false);
  assert.ok(Date.parse(d.endConfirmation.atJst)>Date.parse(v.atJst));
  assert.equal(d.segments.reduce((sum,g)=>sum+g.rows,0),x.accepted);
  assert.ok(d.observations.every((p,j)=>j===0||Date.parse(p.atJst)>Date.parse(d.observations[j-1].atJst)));
  for(const g of d.counters.gaps)assert.ok(!d.observations.some(p=>Date.parse(p.atJst)>Date.parse(g.fromJst)&&Date.parse(p.atJst)<Date.parse(g.toJst)));
 }
});
test('morning stopped display and source-file persistence remain distinct from stale health',()=>{
 const night=inputs[0].d,morning=inputs[1].d;
 assert.ok(morning.lastValidOnline.uiProgressAtJst.includes('08:06:04.237'));
 assert.equal(morning.counters.rowsAfterLastUsable,153);
 assert.equal(morning.collectionQuality.browserFrames.storedRecords,3055);
 assert.equal(night.collectionQuality.browserFrames.storedRecords,2844);
 assert.equal(morning.collectionQuality.httpResponses.storedRecords,293);
 assert.equal(night.collectionQuality.httpResponses.storedRecords,397);
 assert.equal(night.collectionQuality.dom.droppedFragments,null);
 assert.equal(morning.collectionQuality.dom.droppedFragments,554111);
});
test('new timing windows never cross a documented gap or the final usable checkpoint',()=>{
 const dataset=generate();
 for(const {d} of inputs){
  const session=dataset.sessions.find(s=>s.id===d.liveId);assert.ok(session.windows.length>0);
  for(const w of session.windows){
   assert.ok(Date.parse(w.to)<=Date.parse(d.lastValidOnline.atJst));
   for(const g of d.counters.gaps)assert.ok(!(Date.parse(w.from)<Date.parse(g.toJst)&&Date.parse(w.to)>Date.parse(g.fromJst)));
  }
 }
});
test('static pages reproduce checked JSON and preserve the visible uncertainty and public boundary',()=>{
 for(const {c,d} of inputs){
  const page=read('data-lab/reports/'+c.date+'-'+c.slot+'/index.html');
  assert.equal(page,render(d,c));assert.match(page,/noindex,nofollow,noarchive/);
  assert.match(page,/最後の利用可能/);assert.match(page,/未取得を0にしません/);
  assert.match(page,/公式ギフト数・ポイント・確定最終値は未検証/);
  assert.equal((page.match(/<circle /g)||[]).length,d.observations.length*3);
  assert.match(page,new RegExp('/activities/live/#recap-'+c.recap));
  const publicText=page+JSON.stringify(d);
  assert.doesNotMatch(publicText,/chatgpt\.site|drive\.google\.com|[A-Z]:\\Users\\|viewer[_-]?id|user[_-]?id|comment_text|access_token|\.private|transcript\.jsonl/);
  assert.equal(d.recording.parts,2);assert.equal(d.recording.fullContinuityVerified,false);
 }
});
