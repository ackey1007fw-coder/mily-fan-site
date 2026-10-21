import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { METRICS, PHASES, timestamp, intervalPhase, median, relativeChange, buildDataset, explore } from '../public/data-lab/assets/timing-core.mjs';
import { generate, serialized, INPUTS } from './build-stream-timing.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=path=>readFileSync(resolve(root,path),'utf8');
const fixture=(id,date='2026-10-15',rate=1,hour=6,parts=2)=>({id,date,slot:'morning',windows:Array.from({length:parts},(_,i)=>{const from=Date.parse(`${date}T${String(hour).padStart(2,'0')}:00:00+09:00`)+i*300000;return {from:new Date(from).toISOString(),to:new Date(from+300000).toISOString(),phase:'after',delta:{comments:rate*5,stars:rate*5,visits:rate*5}};})});
const pack=(...sessions)=>({schema:'mily-stream-timing-v1',sessions});
const aggregate=(points,extra={})=>({path:'/data-lab/data/synthetic.json',sha256:'0'.repeat(64),data:{dateJst:'2026-10-15',session:'morning',liveId:1,counters:{observations:points},...extra}});
const points=(values,key='comments')=>values.map((value,i)=>({atJst:`2026-10-15T06:${String(i*5).padStart(2,'0')}:00+09:00`,[key]:value}));

test('strict timestamps reject missing, malformed and impossible calendar times',()=>{
 for(const x of [null,undefined,0,'06:00','2026-02-30T06:00:00+09:00','2026-10-15T25:00:00+09:00','2026-10-15T06:00:00','2026-10-15T06:00:00+08:00'])assert.equal(timestamp(x),null);
 assert.equal(timestamp('2026-10-15T06:00:00+09:00'),timestamp('2026-10-14T21:00:00Z'));
});
test('phase boundaries are half-open and cannot mix final-night afterparty',()=>{
 assert.equal(intervalPhase('2026-10-12T21:55:00+09:00','2026-10-12T22:00:00+09:00'),'fourth');
 assert.equal(intervalPhase('2026-10-12T22:00:00+09:00','2026-10-12T22:05:00+09:00'),'afterFinal');
 assert.equal(intervalPhase('2026-10-12T21:59:00+09:00','2026-10-12T22:01:00+09:00'),null);
 assert.equal(intervalPhase('2026-10-12T23:59:00+09:00','2026-10-13T00:01:00+09:00'),null);
});
test('median retains real zero but not null, strings or infinities',()=>{
 assert.equal(median([null,undefined,NaN,Infinity,'4',-1]),null);
 assert.equal(median([0,null,10]),5);assert.equal(median([1,2,10000]),2);
});
test('relative difference has an explicit nonzero denominator',()=>{
 assert.equal(relativeChange(5,0),null);assert.equal(relativeChange(null,5),null);assert.equal(relativeChange(0,5),-100);assert.ok(Math.abs(relativeChange(12,10)-20)<1e-10);
});
test('one stream produces one vote regardless of observation count or length',()=>{
 const r=explore(pack(fixture(1,'2026-10-15',1,6,2),fixture(2,'2026-10-16',9,6,10)));
 assert.equal(r.hours[6].n,2);assert.equal(r.hours[6].value,5);assert.equal(r.hours[6].minutes,60);
});
test('one exceptional gift stream cannot dominate a three-stream median',()=>{
 const r=explore(pack(fixture(1,'2026-10-15',1),fixture(2,'2026-10-16',2),fixture(3,'2026-10-17',10000)),{metric:'stars'});
 assert.equal(r.hours[6].value,2);assert.equal(r.hours[6].max,10000);
});
test('two-stream median reports the wide range, not false robustness',()=>{
 const r=explore(pack(fixture(1,'2026-10-15',1),fixture(2,'2026-10-16',9999)));
 assert.equal(r.hours[6].value,5000);assert.equal(r.hours[6].evidence,'少数データ・参考');assert.equal(r.hours[6].min,1);
});
test('one observation day is exploratory and never ranked as a repeated candidate',()=>{
 const r=explore(pack(fixture(1)));assert.equal(r.candidates.length,0);assert.equal(r.exploratory[0].n,1);
 const two=explore(pack(fixture(1),fixture(2)));assert.equal(two.hours[6].n,2);assert.equal(two.candidates.length,0);
});
test('under-ten-minute streams do not inflate bin sample size',()=>{
 const r=explore(pack(fixture(1,'2026-10-15',99,6,1),fixture(2,'2026-10-16',1)));
 assert.equal(r.hours[6].n,1);assert.equal(r.hours[6].excludedShortStreams,1);assert.equal(r.hours[6].value,1);
});
test('weekday uses Japanese clock date even for UTC input',()=>{
 const r=explore(pack(fixture(1,'2026-10-17',1),fixture(2,'2026-10-18',3)),{day:'weekend'});
 assert.equal(r.hours[6].n,2);assert.equal(r.cells.find(x=>x.weekday===0&&x.hour===6).value,3);
 assert.equal(explore(pack(fixture(1,'2026-10-17')),{day:'weekday'}).baselineN,0);
});
test('empty and unknown schemas fail closed without fabricated results',()=>{
 assert.equal(explore(pack()).hours[6].value,null);assert.equal(explore(pack()).baseline,null);
 assert.throws(()=>explore({schema:'wrong',sessions:[]}));assert.throws(()=>explore(pack(),{metric:'paid'}));assert.throws(()=>explore(pack(),{phase:'all'}));
});
test('duplicate stream IDs are rejected',()=>assert.throws(()=>explore(pack(fixture(1),fixture(1)))));
test('duplicate and overlapping windows cannot double-count a stream',()=>{
 const s=fixture(1);s.windows.push({...s.windows[0]});const r=explore(pack(s));assert.equal(r.hours[6].minutes,10);assert.equal(r.hours[6].value,1);
});
test('hour boundary window is excluded rather than allocated or interpolated',()=>{
 const s=fixture(1);s.windows.push({from:'2026-10-15T06:59:00+09:00',to:'2026-10-15T07:01:00+09:00',delta:{comments:1000}});
 const r=explore(pack(s));assert.equal(r.boundaryExcluded,1);assert.equal(r.hours[6].value,1);assert.equal(r.hours[7].value,null);
});
test('invalid, backwards, overlong and negative-delta windows are excluded',()=>{
 const s=fixture(1);s.windows.push({from:'2026-10-15T06:30:00+09:00',to:'2026-10-15T06:25:00+09:00',delta:{comments:900}},{from:'2026-10-15T06:15:00+09:00',to:'2026-10-15T06:35:00+09:00',delta:{comments:900}},{from:'2026-10-15T06:35:00+09:00',to:'2026-10-15T06:40:00+09:00',delta:{comments:-2}});
 assert.equal(explore(pack(s)).hours[6].value,1);
});
test('null metric remains missing while measured zero is visible',()=>{
 const s=fixture(1);for(const w of s.windows){w.delta.stars=null;w.delta.visits=0;}
 assert.equal(explore(pack(s),{metric:'stars'}).hours[6].value,null);assert.equal(explore(pack(s),{metric:'visits'}).hours[6].value,0);
});
test('aggregate source regression and first recovery are not counted as growth',()=>{
 const d=buildDataset([aggregate(points([100,90,105,110,115]))]);
 assert.equal(d.exclusions.counter_regression,1);assert.equal(d.exclusions.regression_recovery,1);
 assert.deepEqual(d.sessions[0].windows.map(w=>w.delta.comments),[5,5]);
});
test('null endpoints do not backfill counters',()=>{
 const d=buildDataset([aggregate(points([0,null,10,15,20]))]);assert.deepEqual(d.sessions[0].windows.map(w=>w.delta.comments),[5,5]);
});
test('known source gaps are never bridged',()=>{
 const p=points([0,5,10,15]);const d=buildDataset([aggregate(p,{counters:{observations:p,gaps:[{fromJst:p[1].atJst,toJst:p[2].atJst}]}})]);
 assert.equal(d.exclusions.known_gap,1);assert.equal(d.sessions[0].windows.length,2);
});
test('bucket labels without observation timestamps are not guessed',()=>{
 const d=buildDataset([aggregate([{window_start_jst:'06:00',stars:0},{window_start_jst:'06:05',stars:500}])]);assert.equal(d.sessions[0].windows.length,0);
});
test('same public source used twice cannot inflate observations',()=>{
 const src=aggregate(points([0,5,10]));const d=buildDataset([src,src]);assert.equal(d.sessions.length,1);assert.equal(d.sessions[0].windows.length,2);
});
test('snapshot is deterministically regenerated from the exact public sources',()=>{
 assert.equal(INPUTS.length,13);assert.equal(read('public/data-lab/data/mily-stream-timing.json'),serialized());
 const d=generate();assert.equal(d.sessions.length,20);assert.equal(d.sources.length,13);
 for(const s of d.sources)assert.match(s.sha256,/^[a-f0-9]{64}$/);
 assert.equal(d.nonOfficial,true);assert.equal(d.fullCoverage,false);assert.equal(d.paidGifts.available,false);assert.equal(d.congestion.available,false);
});
test('existing through-Oct18 reference results remain unchanged after adding two sessions',()=>{
 const d=generate(); d.sessions=d.sessions.filter(s=>![23578225,23581008].includes(s.id));
 const c=explore(d),s=explore(d,{metric:'stars'}),v=explore(d,{metric:'visits'});
 assert.equal(c.hours[6].n,5);assert.equal(c.hours[22].n,3);assert.equal(c.hours[23].n,2);
 assert.ok(Math.abs(c.hours[6].value-7.634342763098676)<1e-9);
 assert.ok(Math.abs(s.hours[6].value-84.67659078617046)<1e-9);assert.equal(s.hours[6].n,4);
 assert.ok(Math.abs(v.hours[6].value-6.023332076601433)<1e-9);assert.equal(v.hours[8].n,1);
 assert.ok(!v.candidates.some(x=>x.hour===8));
});
test('fourth-round observations cannot leak into after-event candidates',()=>{
 const d=generate();for(const phase of Object.keys(PHASES)){const r=explore(d,{phase});for(const c of r.candidates)for(const id of c.streamIds)assert.ok(d.sessions.find(s=>s.id===id).windows.some(w=>intervalPhase(w.from,w.to)===phase));}
 const legacy={...d,sessions:d.sessions.filter(s=>![23578225,23581008].includes(s.id))};
 assert.equal(explore(legacy,{metric:'otherFree'}).candidates.length,0);
});
test('public output is aggregate-only and does not expose private sources',()=>{
 for(const path of ['public/data-lab/data/mily-stream-timing.json','public/data-lab/assets/timing.js','public/data-lab/assets/timing-core.mjs','data-lab/stream-timing/index.html'])assert.doesNotMatch(read(path),/chatgpt\.site|drive\.google\.com|[A-Z]:\\Users\\|viewer[_-]?id|user[_-]?id|comment_text|access_token|transcript\.jsonl|counter-timeline\.private/i);
});
test('UI has accessible controls, explicit uncertainty, derived metadata and no dynamic HTML injection',()=>{
 const page=read('data-lab/stream-timing/index.html'),js=read('public/data-lab/assets/timing.js'),vite=read('vite.config.ts');
 assert.match(page,/noindex,nofollow,noarchive/);assert.match(page,/__DATA_LAB_TIMING_CANONICAL__/);assert.match(vite,/dataLabTiming: "data-lab\/stream-timing\/index.html"/);
 assert.match(page,/最適|開始時刻/);assert.match(page,/信頼区間ではありません/);assert.match(page,/10分換算/);assert.match(page,/有料ギフト/);
 assert.match(page,/aria-live="polite"/);assert.match(page,/aria-pressed="true"/);assert.match(page,/id="timing-error"/);
 for(const k of Object.keys(METRICS))assert.ok(page.includes(`data-metric="${k}"`));
 assert.doesNotMatch(js,/innerHTML|insertAdjacentHTML|eval\s*\(|new Function/);assert.match(read('data-lab/index.html'),/href="\/data-lab\/stream-timing\/"/);
});
