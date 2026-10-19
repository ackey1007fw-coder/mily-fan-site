import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GLITTER_RULES, tokyoPeriods, currentObservation, planProgress, STALE_MS } from '../public/data-lab/assets/glitter-model.js';
import { readGenrePeriod, getGlitterProgress } from '../server/mily-glitter.js';
import handler from '../api/mily-glitter.js';
import { SHOW_GLITTER } from '../src/lib/showGlitter.ts';
const now = Date.parse('2026-10-19T09:33:49+09:00');
const clock = () => now, periods = tokyoPeriods(now);
const room = { roomId: 573253, roomName: '三橋莉子（みりぃ）', roomUrlKey: 'circle2026_0734' };
const row = (rank, point, id = rank + 100) => ({order_no: rank, rank, point, room: {room_id:id, room_name:id === room.roomId ? room.roomName : 'other performer',room_url_key:id === room.roomId ? room.roomUrlKey : 'other'}, is_ranked:true, is_bonus_eligible:true});
const rows = () => Array.from({length:20},(_,i)=>row(i+1,i<17?10000-i*100:i===17?7089:6000-i, i===17?room.roomId:i+100));
const fetchPage = async () => ({next_page:2,total_count:83,genre_ranking:rows()});
async function fixture() { const weekly = await readGenrePeriod(room,'weekly',periods,{fetchJson:fetchPage,clock}); const daily = await readGenrePeriod(room,'daily',periods,{fetchJson:fetchPage,clock}); return {schemaVersion:1,genre:{id:103,name:'タレント'},roomId:room.roomId,weekly,daily}; }
test('current rules match the existing Support guide',()=>{for(const key of ['dailyMin','weeklyMin','suggestedWeekly']) assert.equal(GLITTER_RULES[key],SHOW_GLITTER[key]);});
test('Tokyo week is Monday to Sunday, including year and UTC boundaries',()=>{
 assert.deepEqual([periods.weekStart,periods.weekEnd,periods.daysRemaining],['2026-10-19','2026-10-25',7]);
 assert.equal(tokyoPeriods(Date.parse('2026-10-21T12:00:00+09:00')).daysRemaining,5);
 assert.equal(tokyoPeriods(Date.parse('2026-10-25T23:59:59+09:00')).daysRemaining,1);
 assert.equal(tokyoPeriods(Date.parse('2026-10-25T15:00:00Z')).weekStart,'2026-10-26');
 assert.equal(tokyoPeriods(Date.parse('2027-01-01T00:00:00+09:00')).weekStart,'2026-12-28');
});
test('official own points, rank and next-rank difference are sanitized',async()=>{
 const p=await fixture();assert.equal(p.weekly.points,7089);assert.equal(p.weekly.rank,18);assert.equal(p.weekly.nextRank,17);assert.equal(p.weekly.gapToNextRank,1311);
 assert.equal(p.weekly.cutoffRank,null);assert.equal(p.weekly.rankCondition,'unverified');assert.ok(!JSON.stringify(p).includes('other performer'));assert.ok(!JSON.stringify(p).includes('is_bonus_eligible'));
});
test('remaining points, days, per-stream and suggested target are separate',async()=>{
 const p=await fixture(),v=planProgress(p,now,12);assert.equal(v.remainingToMinimum,32911);assert.equal(v.dailyAverage,4702);assert.equal(v.perStream,2743);assert.equal(v.dailyRemaining,0);assert.equal(v.remainingToSuggested,34911);
 assert.equal(planProgress(p,now,12,42000).perStream,2910);
 for(const n of [null,0,-1,1.5,100,NaN,'12'])assert.equal(planProgress(p,now,n).perStream,null);
});
test('unavailable is not zero; genuinely observed zero is accepted',async()=>{
 const p=await fixture();p.weekly.points=0;assert.equal(planProgress(p,now).remainingToMinimum,40000);
 p.weekly.points=null;assert.equal(planProgress(p,now).remainingToMinimum,null);
 p.weekly.points='7089';assert.equal(planProgress(p,now).remainingToMinimum,null);
 p.weekly.points=-1;assert.equal(planProgress(p,now).remainingToMinimum,null);
});
test('expired, future, wrong week and wrong day cannot appear current',async()=>{
 const p=await fixture();assert.equal(currentObservation(p,'weekly',now+STALE_MS),null);
 assert.equal(currentObservation(p,'weekly',now-60001),null);
 p.weekly.periodStart='2026-10-12';assert.equal(currentObservation(p,'weekly',now),null);
 p.daily.periodStart='2026-10-18';assert.equal(currentObservation(p,'daily',now),null);
});
test('Monday reset rejects the preceding Sunday even while still fresh',async()=>{
 const p=await fixture();p.weekly.periodStart='2026-10-12';p.weekly.periodEnd='2026-10-18';p.weekly.observedAt='2026-10-18T23:59:30+09:00';assert.equal(currentObservation(p,'weekly',Date.parse('2026-10-19T00:00:30+09:00')),null);
});
test('daily failure does not erase valid weekly points',async()=>{const p=await fixture();p.daily.state='unavailable';p.daily.points=null;const v=planProgress(p,now);assert.equal(v.remainingToMinimum,32911);assert.equal(v.dailyRemaining,null);});
test('bounded pagination follows next_page and finds a later own row',async()=>{
 const pages=[];const f=async url=>{const n=Number(new URL(url).searchParams.get('page'));pages.push(n);return n===1?{next_page:2,total_count:3,genre_ranking:[row(1,9000),row(2,8000)]}:{next_page:null,total_count:3,genre_ranking:[row(3,7089,room.roomId)]};};
 const p=await readGenrePeriod(room,'weekly',periods,{fetchJson:f,clock});assert.equal(p.points,7089);assert.deepEqual(pages,[1,2]);assert.equal(p.gapToNextRank,911);
});
test('only a complete terminal listing can establish not-listed, never zero',async()=>{
 const p=await readGenrePeriod(room,'weekly',periods,{clock,fetchJson:async()=>({next_page:null,total_count:1,genre_ranking:[row(1,9000)]})});assert.equal(p.state,'not-listed');assert.equal(p.points,null);
 const q=await readGenrePeriod(room,'weekly',periods,{clock,fetchJson:async()=>({next_page:null,total_count:2,genre_ranking:[row(1,9000)]})});assert.equal(q.state,'unavailable');
});
test('schema errors, duplicates, reversed scores and pagination loops fail closed',async()=>{
 for(const data of [null,{}, {next_page:null,total_count:2,genre_ranking:[row(1,9000),row(1,9000)]},{next_page:null,total_count:2,genre_ranking:[row(1,100),row(2,7089,room.roomId)]},{next_page:1,total_count:83,genre_ranking:[row(1,9000)]}]){
  const p=await readGenrePeriod(room,'weekly',periods,{clock,fetchJson:async()=>data});assert.equal(p.state,'unavailable');assert.equal(p.points,null);
 }
});
test('identity mismatch and request crossing midnight are not published',async()=>{
 const bad=rows();bad[17].room.room_name='not the requested person';assert.equal((await readGenrePeriod(room,'weekly',periods,{clock,fetchJson:async()=>({next_page:2,total_count:83,genre_ranking:bad})})).state,'unavailable');
 let time=now;const p=await readGenrePeriod(room,'weekly',periods,{clock:()=>time,fetchJson:async()=>{time=Date.parse('2026-10-20T00:00:00+09:00');return fetchPage();}});assert.equal(p.state,'unavailable');
});
test('wrong genre, failed resolver and schema drift produce missing values',async()=>{
 for(const resolveRoom of [async()=>null,async()=>room]){const p=await getGlitterProgress({}, {resolveRoom,fetchJson:async()=>({room_genre:{}}),clock});assert.equal(p.roomId,null);assert.equal(p.weekly.points,null);}
});
test('private details and arbitrary query sources are not API output',async()=>{
 const p=await getGlitterProgress({}, {resolveRoom:async()=>room,fetchJson:async url=>url.endsWith('room_genre')?{room_genre:[{genre_id:103,name:'talent'}]}:fetchPage(),clock});assert.equal(p.roomId,room.roomId);assert.equal(p.weekly.points,7089);
 const raw=JSON.stringify(p);for(const key of ['glitter_image','room_name','sns','is_bonus_eligible','other performer'])assert.ok(!raw.includes(key));
 const headers={};let status;const res={setHeader(k,v){headers[k]=v;},status(n){status=n;return this;},json(v){return v;},end(){}};await handler({method:'POST',query:{url:'https://invalid.example'}},res);assert.equal(status,405);await handler({method:'OPTIONS'},res);assert.equal(status,204);
});
test('Lab and Support links, Vite route, noindex and CSP are preserved',()=>{
 const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
 for(const p of ['data-lab/index.html','src/components/ShowGlitterGuide.tsx'])assert.ok(read(p).includes('/data-lab/glitter/'));
 const h=read('data-lab/glitter/index.html');assert.match(h,/noindex,nofollow,noarchive/);assert.match(h,/順位条件の自動判定は未対応/);assert.match(h,/connect-src 'self'/);assert.ok(read('vite.config.ts').includes('data-lab/glitter/index.html'));
 assert.ok(!read('server/mily-glitter.js').includes('573253'));assert.ok(!read('server/mily-glitter.js').includes('is_ranked'));
});
