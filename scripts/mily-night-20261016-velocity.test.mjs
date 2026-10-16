import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const h=read("data-lab/index.html");
const j=read("public/data-lab/data/mily-night-20261016-aggregate.json");
const d=JSON.parse(j), v=d.comment_velocity;
const section=h.split('id="night-20261016"')[1].split("</section>")[0];
const clock=t=>t.slice(11,16);
test("comment rates use actual UI elapsed seconds and saved cumulative differences",()=>{
 assert.equal(d.live_id,23562541);
 assert.equal(v.unit,"comments per minute");
 assert.equal(v.coverage_complete,false);
 assert.equal(v.windows.length,8);
 const p=d.five_minute_window_endpoints;
 v.windows.forEach((x,i)=>{
  assert.equal(x.from,p[i].observed_at_jst);
  assert.equal(x.to,p[i+1].observed_at_jst);
  assert.equal(x.duration_seconds,p[i+1].elapsed_seconds-p[i].elapsed_seconds);
  assert.equal(x.added_comments,p[i+1].comments-p[i].comments);
  assert.equal(x.per_minute,+(x.added_comments*60/x.duration_seconds).toFixed(2));
 });
 assert.deepEqual(v.windows.map(x=>x.per_minute),[6.87,10.84,4.8,7.02,7.22,7.42,5.62,10.22]);
});
test("overall mean and last 12-second gap are not passed off as regular windows",()=>{
 const p=d.five_minute_window_endpoints;
 assert.deepEqual(v.overall,{from:p[0].observed_at_jst,to:p.at(-1).observed_at_jst,
 duration_seconds:2286,added_comments:280,per_minute:7.35});
 assert.deepEqual(v.short_end_gap,{seconds:12,added_comments:1,excluded_from_chart:true});
 assert.equal(d.observed_screen.confirmed_final,false);
 assert.equal(d.event_partition.this_broadcast_excluded_from_fourth_round_total,true);
});
test("HTML chart, table and labels all agree with the anonymized speed source",()=>{
 assert.ok(section.includes('id="night-20261016-comment-velocity"'));
 assert.match(section,/時間帯別・コメント分速/);
 const rects=[...section.matchAll(/class="velocity-bar"[^>]+><title>([^<]+)<\/title><\/rect>/g)];
 const rows=[...section.matchAll(/<tr class="velocity-row"><th scope="row">([^<]+)<\/th><td>(\d+)<\/td><td>(\d+)秒<\/td><td>([\d.]+)件\/分<\/td><\/tr>/g)];
 assert.equal(rects.length,8);assert.equal(rows.length,8);
 v.windows.forEach((x,i)=>{
  assert.equal(rects[i][1],clock(x.from)+"〜"+clock(x.to)+"："+x.per_minute.toFixed(2)+"件/分");
  assert.deepEqual(rows[i].slice(1),[clock(x.from)+"〜"+clock(x.to),String(x.added_comments),String(x.duration_seconds),x.per_minute.toFixed(2)]);
 });
 assert.match(section,/最後の12秒/);
 assert.match(section,/区間平均/);
 assert.match(section,/欠測は0として補いません/);
 assert.match(h,/noindex,nofollow,noarchive/);
});
test("new public output has no individual messages or private source references",()=>{
 const out=[section,j].join(String.fromCharCode(10));
 assert.doesNotMatch(out,/drive\.google|chatgpt\.site|@gmail\.com|[A-Z]:\\Users\\|raw[_-]?comments|viewer[_-]?id|comment[_-]?text/i);
 assert.equal(d.data_quality.participant_unique_count,null);
});
