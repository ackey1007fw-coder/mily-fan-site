import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {streamRecaps} from '../src/data/streamRecaps.ts';
const manifest=JSON.parse(readFileSync(new URL('./stream-singing-20261020-21.json',import.meta.url),'utf8'));
const expected=[
 ['night-round','2026-10-20-night-showroom',1,991,991,'0:16:31'],
 ['night-cheeks','2026-10-20-night-showroom',1,1112,1112,'0:18:32'],
 ['morning-peace','2026-10-21-morning-showroom',2,1062,3015.082,'0:50:15'],
];
test('three singing excerpts have exact source identity, original timing and public-short scope',()=>{
 assert.equal(manifest.clips.length,3);
 assert.deepEqual(manifest.clips.map(c=>[c.id,c.recapId,c.sourcePart,c.partSeconds,c.sourceSeconds,c.sourceTimestamp]),expected);
 for(const c of manifest.clips){
  assert.equal(c.kind,'singing');assert.equal(c.youtubePrivacyStatus,'public');
  assert.deepEqual([c.width,c.height,c.durationSeconds],[720,1280,28]);
  const recap=streamRecaps.find(r=>r.id===c.recapId);assert.ok(recap);
  const matches=recap.highlights.filter(h=>h.clip?.src===c.video.src);assert.equal(matches.length,1);
  const h=matches[0];assert.equal(h.timestamp,c.sourceTimestamp);assert.equal(h.clip.sourceTimestamp,c.sourceTimestamp);
  assert.equal(h.clip.poster,c.poster.src);assert.equal(h.clip.durationSeconds,28);
  assert.ok(recap.timeline.some(t=>t.timestamp===h.timestamp&&t.label===h.title));
  assert.match(recap.transcriptionNote,/歌唱短尺/);assert.match(recap.transcriptionNote,/手動通し聴取は未実施/);
  for(const role of ['video','poster']){
   assert.match(c[role].src,/^\/media\/live-clips\/mily-b235-0[123]-2026102[01]-(night|morning)-singing-/);
   const bytes=readFileSync(new URL('../public'+c[role].src,import.meta.url));
   assert.equal(bytes.length,c[role].bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),c[role].sha256);
  }
 }
 assert.equal(new Set(manifest.clips.flatMap(c=>[c.video.src,c.poster.src])).size,6);
});
test('singing additions retain existing talk clips, photographs and distinct stream cards',()=>{
 for(const [id,count] of [['2026-10-20-night-showroom',3],['2026-10-21-morning-showroom',2]]){
  const r=streamRecaps.find(x=>x.id===id);assert.equal(r.highlights.filter(h=>h.clip).length,count);
  assert.equal(r.highlights.filter(h=>h.clip?.src.endsWith('-talk.mp4')).length,1);assert.equal(r.gallery.length,5);
  const stamps=r.highlights.map(h=>h.timestamp.split(':').reduce((n,x)=>n*60+Number(x),0));
  assert.deepEqual(stamps,[...stamps].sort((a,b)=>a-b));
 }
});
