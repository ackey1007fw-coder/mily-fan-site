import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {summarizeWeek,renderWeek} from './mily-week-progress.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const data=JSON.parse(read('public/data-lab/data/semifinal-talent-seven-days-20261015-21.json'));
const page=read('data-lab/progress/index.html'), s=summarizeWeek(data);
const copy=()=>structuredClone(data);
test('seven days: predetermined contiguous dates and all 35 IDs preserve missing values',()=>{
 assert.deepEqual(data.days.map(d=>d.date),Array.from({length:7},(_,i)=>`2026-10-${15+i}`));
 assert.equal(data.roster.length,35);assert.equal(data.days.reduce((a,d)=>a+d.rankingRecords,0),1671);
 assert.equal(data.days.reduce((a,d)=>a+d.sources.length,0),21);
 assert.deepEqual(s.days.map(d=>d.listedCount),[26,25,25,22,23,25,23]);
 assert.equal(s.complete.length,16);assert.equal(s.excluded.length,19);
 const fixed=data.roster.filter(r=>data.days.every(d=>d.participants.find(x=>x.roomId===r.roomId).points!==null));
 assert.deepEqual(s.complete.map(r=>r.entry).sort((a,b)=>a-b),fixed.map(r=>r.entry).sort((a,b)=>a-b));
 assert.ok(s.excluded.every(r=>r.total===null&&r.observedDays<7));
});
test('seven days: independent arithmetic matches the full dated snapshot',()=>{
 assert.deepEqual(s.days.map(d=>d.milyPoints),[12693,10909,23763,23006,15159,20997,30020]);
 assert.equal(s.mily.total,136547);assert.equal(s.completeRank,6);
 assert.equal(s.completeMedian,67975.5);assert.equal(s.ratioToCompleteMedian,2.01);
 assert.deepEqual(s.fixedDailyMedians,[7381.5,9778.5,8550.5,10845.5,8507.5,10463.5,13882]);
 assert.equal(s.aboveFixedMedianDays,7);
 for(const r of s.complete)assert.equal(r.total,r.points.reduce((a,b)=>a+b,0));
 assert.deepEqual(s.days.map(d=>d.withinListedRank),[6,7,5,5,8,5,4]);
});
test('seven days: new Oct21 read agrees with previously published immutable comparison',()=>{
 const old=JSON.parse(read('public/data-lab/data/semifinal-talent-daily-20261021.json'));
 const rows=data.days.at(-1).participants;
 for(const r of old.listedParticipants)assert.equal(rows.find(x=>x.roomId===r.roomId).points,r.points);
 for(const r of old.unlistedParticipants)assert.equal(rows.find(x=>x.roomId===r.roomId).points,null);
 assert.equal((page.match(/data-daily-peer-entry=/g)||[]).length,23);
 assert.equal((page.match(/data-peer-rank=/g)||[]).length,9);
});
test('seven days: report exactly reproduces source-driven HTML and all chart scales',()=>{
 assert.ok(page.includes(renderWeek(data)));
 assert.equal((page.match(/data-week-day=/g)||[]).length,7);
 assert.equal((page.match(/data-week-table-date=/g)||[]).length,7);
 assert.equal((page.match(/data-week-peer=/g)||[]).length,16);
 const section=renderWeek(data);
 const widths=[...section.matchAll(/class="week-fill(?: week-median)?" style="width:([\d.]+)%"/g)].map(m=>Number(m[1]));
 assert.equal(widths.length,14);
 s.days.forEach((d,i)=>{
  assert.ok(Math.abs(widths[2*i]-d.milyPoints/40000*100)<1e-7);
  assert.ok(Math.abs(widths[2*i+1]-s.fixedDailyMedians[i]/40000*100)<1e-7);
 });
 assert.ok(page.includes('href="#week-20261015-21"'));
 assert.ok(page.indexOf('id="week-20261015-21"')<page.indexOf('id="daily-peers-20261021"'));
});
test('seven days: missing one day never becomes zero or a complete total',()=>{
 const d=copy();d.days[0].participants.find(r=>r.entry===734).points=null;
 const r=summarizeWeek(d);assert.equal(r.mily.observedDays,6);assert.equal(r.mily.total,null);assert.equal(r.completeRank,null);
 assert.ok(r.excluded.some(x=>x.entry===734));assert.throws(()=>renderWeek(d));
});
test('seven days: a valid zero is retained and ties use equal competition ranks',()=>{
 const d=copy();d.days[0].participants.find(r=>r.entry===734).points=0;
 const r=summarizeWeek(d);assert.equal(r.mily.observedDays,7);assert.equal(r.mily.total,136547-12693);
 assert.equal(r.days[0].milyPoints,0);assert.ok(r.complete.some(x=>x.entry===734));
 const tied=copy();for(const day of tied.days)day.participants.find(r=>r.entry===585).points=day.participants.find(r=>r.entry===734).points;
 const t=summarizeWeek(tied);assert.equal(t.completeRank,1+t.complete.filter(x=>x.total>t.mily.total).length);
});
test('seven days: malformed, duplicate, wrong date and incomplete pages are rejected',()=>{
 for(const bad of [true,-1,'30020',NaN,Infinity]){const d=copy();d.days[0].participants[0].points=bad;assert.throws(()=>summarizeWeek(d));}
 for(const change of [d=>d.days[1].date=d.days[0].date,d=>d.days[0].participants[0].roomId=d.days[0].participants[1].roomId,d=>d.days[0].sources.at(-1).nextPage=4,d=>d.days[0].sources[0].url=d.days[1].sources[0].url,d=>d.days[0].paginationComplete=false]){
  const d=copy();change(d);assert.throws(()=>summarizeWeek(d));
 }
});
test('seven days: metric, cohort, exposure and privacy limitations remain visible',()=>{
 for(const key of ['isContestRank','isOfficialWeeklyRanking','dailyBoundaryTimeVerified','isLivePopularityIndex','equalBroadcastDuration','campaignEffectMeasured','unlistedMeansZero','missingMorningCountersRecovered'])assert.equal(data.boundaries[key],false);
 assert.equal(data.boundaries.allSemifinalistsRank,null);assert.equal(data.automaticRefresh,false);
 for(const phrase of ['固定16ルーム','未掲載を0とせず','16ルームの結果をセミファイナル全体へ一般化しません','配信時間をそろえた効率比較ではありません','順位低下を示すものではありません','日間集計の境界時刻は未確認'])assert.ok(page.includes(phrase),phrase);
 const text=page+JSON.stringify(data);
 assert.doesNotMatch(text,/@gmail\.com|drive\.google\.com|chatgpt\.site|C:\\Users|viewer[_-]?id|contributor[_-]?id|本人は焦|完璧主義|\uFFFD/);
 assert.ok(data.days.every(d=>d.participants.every(r=>!('name' in r)&&!('room_name' in r))));
 assert.match(page,/noindex,nofollow,noarchive/);assert.match(page,/^<\/body>$/m);
});
