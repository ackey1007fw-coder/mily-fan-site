import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = p => readFileSync(new URL("../" + p, import.meta.url),"utf8");
const page=read("data-lab/index.html"),css=read("public/data-lab/assets/styles.css"),raw=read("public/data-lab/data/mily-noon-20261014-aggregate.json"),noon=JSON.parse(raw),morning=JSON.parse(read("public/data-lab/data/mily-morning-20261014-aggregate.json"));
test("noon update coexists with all previous Mily SIGNAL sections",()=>{
  for(const anchor of ['id="noon-20261014"','id="morning-20261014"','id="final-night"','id="naoka-update"','id="now"','id="forecast"','id="roster"','href="#noon-20261014"','href="#morning-20261014"'])assert.ok(page.includes(anchor),anchor);
  for(const v of ["3,866","350","416","35","＋607","＋47","＋31"])assert.ok(page.includes(v),v);
  assert.match(page,/23552113/);assert.match(page,/23551572/);assert.match(page,/noindex,nofollow,noarchive/);
  assert.match(css,/\.noon-update\{/);assert.match(css,/@media\(max-width:720px\)/);assert.match(css,/@media\(max-width:960px\)\{\.noon-update \.pred-grid/);
  assert.match(page,/2026\.10\.12 四次審査の記録 ＋ 2026\.10\.14 朝の観測/);
});
test("noon stats are accurate, separated from contest and same-day morning",()=>{
  assert.equal(noon.live_id,23552113);assert.equal(noon.event_partition.analysis_cutoff_jst,"2026-10-12T22:00:00+09:00");
  assert.equal(noon.event_partition.this_broadcast_excluded_from_fourth_round_total,true);
  assert.equal(noon.event_partition.new_event_identity,"unconfirmed");
  assert.equal(noon.recording_processing_window_jst.not_equal_to_confirmed_broadcast_start_end,true);
  for(const [k,v] of Object.entries({stars:3866,total_visits:350,comments:416,first_visits:35,second_visits:29}))assert.equal(noon.observed_screen[k],v);
  assert.equal(noon.same_day_morning.live_id,23551572);
  for(const key of ["stars","total_visits","comments","first_visits"])assert.equal(noon.same_day_morning[key],morning.observed_screen[key]);
  assert.match(page,/約82秒の遅れ/);assert.match(page,/単純比較は控えます/);
});
test("noon 5-minute observed endpoints preserve the peaks without interpolation",()=>{
  const p=noon.five_minute_window_endpoints;assert.equal(p.length,20);
  assert.deepEqual(p.at(-1),{window_end_observed_at_jst:"14:04:47.806",stars:3866,visits:350,comments:416});
  for(const key of ["stars","visits","comments"])assert.ok(p.every((x,i)=>i===0||x[key]>=p[i-1][key]),key);
  assert.equal(p[13].stars-p[12].stars,607);
  assert.equal(p[14].visits-p[13].visits,47);
  assert.equal(p[17].comments-p[16].comments,31);
  assert.deepEqual(noon.peaks.map(p=>p.delta),[607,47,31]);
  assert.match(page,/点で掲載/);assert.match(page,/線でつなぎません/);
});
test("noon public assets contain no private links, user logs or named supporters",()=>{
  for(const str of [page,raw])assert.doesNotMatch(str,/chatgpt\.site|drive\.google|@gmail\.com|viewer[_-]?id|user[_-]?id|contributor[_-]?id|recording[_-]?id/i);
  for(const key of ["comment_text","gift_log","raw_comments","recording_file","supporter_names"])assert.ok(!raw.includes('"'+key+'"'),key);
});
