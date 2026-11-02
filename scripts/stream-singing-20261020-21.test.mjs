import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {streamRecaps} from '../src/data/streamRecaps.ts';
import {buildUnidentifiedSingingClips} from '../src/lib/streamSongClips.ts';
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
  const matches=(recap.singingExcerpts??[]).filter(v=>v.src===c.video.src);assert.equal(matches.length,1);
  const clip=matches[0];assert.equal(clip.id,c.id);assert.equal(clip.sourceTimestamp,c.sourceTimestamp);
  assert.equal(clip.poster,c.poster.src);assert.equal(clip.durationSeconds,28);
  assert.ok(recap.timeline.some(t=>t.timestamp===c.sourceTimestamp&&t.label===clip.title));
  assert.ok(!recap.highlights.some(h=>h.clip?.src===c.video.src),'singing must not appear as a talk clip');
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
 for(const [id,count] of [['2026-10-20-night-showroom',2],['2026-10-21-morning-showroom',1]]){
  const r=streamRecaps.find(x=>x.id===id);assert.equal(r.singingExcerpts?.length,count);
  assert.equal(r.highlights.filter(h=>h.clip).length,1);
  assert.equal(r.highlights.filter(h=>h.clip?.src.endsWith('-talk.mp4')).length,1);assert.equal(r.gallery.length,5);
  const stamps=r.highlights.map(h=>h.timestamp.split(':').reduce((n,x)=>n*60+Number(x),0));
  assert.deepEqual(stamps,[...stamps].sort((a,b)=>a-b));
 }
});

test('unidentified song clips appear in the dedicated LIVE SONG CLIPS collection without invented music titles',()=>{
 const known=buildUnidentifiedSingingClips(streamRecaps);
 for (const item of manifest.clips) {
  const e=known.find(x=>x.clip.src===item.video.src);
  assert.ok(e,item.id);
  assert.equal(e.recapId,item.recapId);
  assert.equal(e.clip.sourceTimestamp,item.sourceTimestamp);
 }
 assert.equal(new Set(known.map(x=>x.clip.id)).size,known.length);
 assert.ok(readFileSync('src/ActivitiesPage.tsx','utf8').includes('recap.singingExcerpts'));
 assert.ok(readFileSync('src/SongClipsPage.tsx','utf8').includes('unidentifiedClips.map'));
});
