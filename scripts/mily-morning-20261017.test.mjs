import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const data = JSON.parse(read("public/data-lab/data/mily-morning-20261017-aggregate.json"));
const home = read("data-lab/index.html");
const page = read("data-lab/reports/20261017-morning/index.html");
const js = read("public/data-lab/assets/morning-20261017.js");
const css = read("public/data-lab/assets/morning-20261017.css");
const vite = read("vite.config.ts");
const allPoints = data.segments.flatMap(s=>s.five_minute_window_endpoints);

test("Oct 17 live identifier and last verified on-screen readings stay separate from final values",()=>{
 assert.equal(data.room_id,573253);
 assert.equal(data.live_id,23564059);
 assert.equal(data.slot,"morning");
 assert.equal(data.date_jst,"2026-10-17");
 assert.deepEqual([data.observed_screen.stars,data.observed_screen.total_visits,data.observed_screen.comments],[11662,2667,1590]);
 assert.equal(data.observed_screen.last_valid_online_observed_at_jst,"2026-10-17T09:38:12.436+09:00");
 assert.equal(data.observed_screen.confirmed_final,false);
 assert.equal(data.data_quality.official_broadcast_end_confirmed,false);
 assert.equal(data.data_quality.ui_offline_end_confirmed,false);
 assert.equal(data.event_partition.excluded_from_fourth_round_total,true);
 assert.equal(data.event_partition.new_event_id,"unconfirmed");
 assert.equal(data.event_partition.not_official_semifinal_points,true);
});
test("source counts and observed segments are complete and strictly monotone",()=>{
 assert.equal(data.data_quality.online_counter_timeline_rows,548);
 assert.equal(data.data_quality.valid_online_observations,515);
 assert.equal(data.data_quality.excluded_or_incomplete_rows,33);
 assert.deepEqual(data.segments.map(s=>s.count),[58,457]);
 assert.deepEqual(data.segments.map(s=>s.five_minute_window_endpoints.length),[4,18]);
 assert.equal(allPoints.length,22);
 assert.deepEqual([allPoints[0].stars,allPoints[0].total_visits,allPoints[0].comments],[230,36,25]);
 assert.deepEqual([allPoints[3].stars,allPoints[3].total_visits,allPoints[3].comments],[1155,91,107]);
 assert.deepEqual([allPoints[4].stars,allPoints[4].total_visits,allPoints[4].comments],[8383,1797,1053]);
 assert.deepEqual([allPoints.at(-1).stars,allPoints.at(-1).total_visits,allPoints.at(-1).comments],[11662,2667,1590]);
 for(const segment of data.segments){
  const points=segment.five_minute_window_endpoints;
  for(let i=1;i<points.length;i++){
   assert.ok(Date.parse(points[i].observed_at_jst)>Date.parse(points[i-1].observed_at_jst));
   for(const key of ["stars","total_visits","comments"])assert.ok(points[i][key]>=points[i-1][key],key);
  }
 }
});
test("unobserved two-hour interval is not treated as zero or a valid time-series velocity",()=>{
 const gap=data.gap;
 assert.equal(gap.start_jst,"2026-10-17T06:16:18.381+09:00");
 assert.equal(gap.end_jst,"2026-10-17T08:19:04.003+09:00");
 assert.equal(gap.elapsed_seconds,7365.622);
 assert.equal(Date.parse(gap.end_jst)-Date.parse(gap.start_jst),7365622);
 assert.deepEqual(gap.cumulative_endpoint_difference,{stars:7228,total_visits:1706,comments:946});
 assert.equal(gap.per_minute_series_available,false);
 assert.equal(gap.missing_data_are_not_zero,true);
 assert.equal(data.data_quality.missing_minute_data_not_estimated,true);
 for(const source of [home,page])assert.match(source,/123分/);
 assert.match(page,/点と点を線でつながず/);
 assert.doesNotMatch(js,/createElementNS\([^,]*,\s*["'](?:polyline|path)["']/);
});
test("saved video metadata is kept separate from confirmed broadcast end",()=>{
 assert.equal(data.recording.saved,true);
 assert.equal(data.recording.ffmpeg_exit_code,0);
 assert.equal(data.recording.size_bytes,1609036086);
 assert.equal(data.recording.complete_coverage_confirmed,false);
 assert.equal(data.recording.media_duration_seconds,null);
 assert.equal(data.recording_processing_window_jst.not_official_broadcast_start_end,true);
 assert.match(page,/録画の保存とカウンターの保存は別/);
});
test("new accessible report is linked from MILY SIGNAL without removing old archives",()=>{
 assert.match(home,/id="morning-20261017"/);
 assert.ok(home.indexOf('id="morning-20261017"')<home.indexOf('id="night-20261016"'));
 for(const id of ["night-20261016","morning-20261016","morning-20261015","final-night"])assert.ok(home.includes('id="'+id+'"'),id);
 assert.match(home,/href="\/data-lab\/reports\/20261017-morning\/"/);
 assert.match(home,/href="#morning-20261017"/);
 assert.match(vite,/dataLabMorning20261017: "data-lab\/reports\/20261017-morning\/index.html"/);
 assert.match(page,/noindex,nofollow,noarchive/);
 assert.match(page,/aria-label="グラフに表示する指標"/);
 assert.match(page,/aria-pressed="true"/);
 assert.match(page,/id="a17-table-body"/);
 assert.match(js,/aria-pressed/);
 assert.match(css,/@media\(max-width:720px\)/);
});
test("public report stays anonymized and avoids raw system or viewer details",()=>{
 for(const source of [JSON.stringify(data),home.slice(home.indexOf('id="morning-20261017"'),home.indexOf('id="night-20261016"')),page,js,css]){
  assert.doesNotMatch(source,/chatgpt\.site|drive\.google\.com|@[a-z0-9.-]+\.com|[A-Z]:\\Users\\|viewer[_-]?id|user[_-]?id|contributor[_-]?id|comment_text|live-transcript\.txt|\.partial\.mkv/i);
 }
 assert.match(data.privacy,/No viewer IDs/);
});
