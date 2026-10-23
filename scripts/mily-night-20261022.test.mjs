import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { streamRecaps } from '../src/data/streamRecaps.ts';
import { DAILY_STREAM_ENTRIES, observationPoints, lastObservedValue } from '../public/data-lab/assets/daily-archive-core.js';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const data=JSON.parse(read('public/data-lab/data/mily-night-20261022-aggregate.json'));
const media=JSON.parse(read('scripts/mily-night-20261022-media.json'));
const night=streamRecaps.find(r=>r.id==='2026-10-22-night-showroom');
test('October 22 night and morning are separate, ordered recaps with independent source limits',()=>{
 assert.deepEqual(streamRecaps.slice(1,3).map(r=>r.id),['2026-10-22-night-showroom','2026-10-22-morning-showroom']);
 assert.equal(data.liveId,23588035);assert.equal(data.recording.durationSeconds,5726.763);
 assert.equal(data.recording.startProcessingJst,'2026-10-22T21:02:40+09:00');assert.equal(data.recording.endProcessingJst,'2026-10-22T22:39:20+09:00');
 assert.match(night.transcriptionNote,/音声の手動聴取・全文の逐語校正は未実施/);
 assert.match(streamRecaps[2].transcriptionNote,/24分55.124秒/);
 assert.equal(streamRecaps[2].gallery,undefined);
});
test('unknown night counters never become measured zero or timing-comparison evidence',()=>{
 assert.equal(Object.keys(data.metrics).length,9);assert.ok(Object.values(data.metrics).every(x=>x===null));
 assert.equal(data.quality.numericEvidenceStatus,'unverified');assert.equal(data.quality.savedNumericObservations,null);
 assert.deepEqual(data.observations,[]);assert.equal(data.lastValidOnline,null);
 assert.equal(data.timingComparisonEligible,false);assert.equal(data.completeCoverageConfirmed,false);
 for(const metric of ['stars','visits','comments']){assert.equal(lastObservedValue(data,metric,data.dateJst),null);assert.deepEqual(observationPoints(data,metric,data.dateJst),[]);}
 const entry=DAILY_STREAM_ENTRIES.filter(e=>e.date==='2026-10-22');assert.deepEqual(entry.map(e=>e.slot),['night','morning']);
});
test('all ten real stills and three original-sound short clips match the reviewed media manifest',()=>{
 assert.equal(night.gallery.length,10);assert.ok(night.gallery.includes(night.image));
 const clips=night.highlights.filter(h=>h.clip).map(h=>h.clip);assert.equal(clips.length,3);
 assert.deepEqual(clips.map(c=>c.durationSeconds),[18.2,10.8,11]);
 assert.equal(new Set([...night.gallery.map(i=>i.src),...clips.map(c=>c.src)]).size,13);
 for(const file of media.files){const bytes=readFileSync(new URL('../public/media/live/'+file.name,import.meta.url));assert.equal(bytes.length,file.bytes,file.name);assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256,file.name);}
 for(const im of night.gallery){assert.equal(im.width,640);assert.equal(im.height,360);assert.match(im.caption,/録画内/);assert.ok(im.downloadName);}
 for(const clip of clips){assert.equal(clip.width,720);assert.equal(clip.height,1280);assert.match(clip.poster,/-cover\.jpg$/);}
 assert.ok(night.songs.every(s=>!s.clip&&!s.approvedClips));
});
test('night report has complete canonical and archive links and excludes private source material',()=>{
 const page=read('data-lab/reports/20261022-night/index.html');const home=read('data-lab/index.html');const config=read('vite.config.ts');
 assert.match(page,/95分26.763秒/);assert.match(page,/9指標とも未確認/);assert.doesNotMatch(page,/<svg|<polyline|<canvas/);
 assert.match(page,/<\/body>\n<\/html>/);assert.match(page,/noindex,nofollow,noarchive/);
 assert.ok(config.includes('__DATA_LAB_20261022_NIGHT_CANONICAL__'));assert.ok(config.includes('dataLabNight20261022: "data-lab/reports/20261022-night/index.html"'));
 assert.ok(home.indexOf('id="night-20261022"')<home.indexOf('id="morning-20261022"'));
 assert.ok(home.includes('/activities/live/#recap-'+night.id));
 assert.doesNotMatch(page+JSON.stringify(data)+JSON.stringify(night),/drive\.google\.com|@gmail\.com|chatgpt\.site|C:\\Users|viewer[_-]?id|contributor[_-]?id|live-transcript\.txt|ui-raw\.jsonl/i);
});
