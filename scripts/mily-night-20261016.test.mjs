import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const html = read("data-lab/index.html");
const raw = read("public/data-lab/data/mily-night-20261016-aggregate.json");
const night = JSON.parse(raw);
const section = html.split('id="night-20261016"')[1]?.split("</section>")[0];

test("October 16 night remains linked beneath newer October 17, without replacing historical sections", () => {
  assert.ok(section, "October 16 night section");
  for (const id of ["night-20261016","morning-20261016","night-20261015","morning-20261015","night-20261014","noon-20261014","final-night","now","roster"]) {
    assert.ok(html.includes('id="' + id + '"'), id);
  }
  assert.ok(html.indexOf('id="night-20261016"') < html.indexOf('id="morning-20261016"'));
  assert.match(html, /<nav class="nav"[^>]*><a href="#morning-20261017">10\/17朝<\/a><a href="#night-20261016">10\/16夜<\/a>/);
  assert.match(html,/noindex,nofollow,noarchive/);
  assert.equal(night.live_id,23562541);
  assert.equal(night.event_partition.analysis_cutoff_jst,"2026-10-12T22:00:00+09:00");
  assert.equal(night.event_partition.this_broadcast_excluded_from_fourth_round_total,true);
  assert.equal(night.event_partition.new_event_identity,"unconfirmed");
  assert.equal(night.event_partition.not_official_semifinal_event_points,true);
});

test("recorded processing and last valid online screen are separate from stream-end totals", () => {
  assert.equal(night.recording.saved,true);
  assert.equal(night.recording.ffmpeg_exit_code,0);
  assert.equal(night.recording.size_bytes,503594174);
  assert.equal(night.recording.media_duration_seconds,null);
  assert.equal(night.recording.complete_coverage_confirmed,false);
  assert.equal(night.recording.full_content_reviewed,false);
  assert.equal(night.recording_processing_window_jst.start,"2026-10-16T21:49:18+09:00");
  assert.equal(night.recording_processing_window_jst.end,"2026-10-16T22:57:33+09:00");
  assert.equal(night.recording_processing_window_jst.not_equal_to_confirmed_broadcast_start_end,true);
  assert.deepEqual([night.observed_screen.stars,night.observed_screen.total_visits,night.observed_screen.comments],[2858,68,329]);
  assert.deepEqual([night.observed_screen.recommended_commenter_count,night.observed_screen.star_100_contributor_count],[13,28]);
  assert.equal(night.observed_screen.last_valid_online_observed_at_jst,"2026-10-16T22:33:37.623+09:00");
  assert.equal(night.observed_screen.confirmed_final,false);
  assert.equal(night.data_quality.counter_end_confirmed,false);
  assert.equal(night.data_quality.capture_coverage_complete,false);
  assert.match(section,/配信終了時の確定値ではありません/);
  assert.match(section,/22:33:37/);
});

test("source quality excludes incomplete rows and never confuses the independent collector", () => {
  assert.equal(night.data_quality.online_counter_timeline_rows,251);
  assert.equal(night.data_quality.valid_online_observations,224);
  assert.equal(night.data_quality.excluded_or_incomplete_rows,27);
  assert.equal(night.data_quality.online_counter_timeline_rows,night.data_quality.valid_online_observations+night.data_quality.excluded_or_incomplete_rows);
  assert.equal(night.data_quality.older_dom_collector_observations,197);
  assert.equal(night.data_quality.older_dom_collector_disconnect_count,2);
  assert.equal(night.data_quality.older_dom_collector_end_confirmed,false);
  assert.equal(night.data_quality.participant_unique_count,null);
  assert.match(section,/251行のうち有効条件を満たす224行/);
});

test("anonymous SVG points and table correspond to each saved source reading, without interpolation", () => {
  const points=night.five_minute_window_endpoints;
  assert.equal(points.length,10);
  assert.deepEqual(points.map(p=>p.comments),[49,83,137,161,196,232,269,297,328,329]);
  assert.deepEqual([points.at(-1).stars,points.at(-1).total_visits,points.at(-1).comments],[2858,68,329]);
  for(let i=1;i<points.length;i++) {
    assert.ok(points[i].elapsed_seconds>points[i-1].elapsed_seconds);
    for(const key of ["stars","total_visits","comments"])assert.ok(points[i][key]>=points[i-1][key],key);
  }
  const circles=[...section.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="4.4" fill="#a1edd7"><title>([^<]+)<\/title><\/circle>/g)];
  const rows=[...section.matchAll(/<tr><th scope="row">(\d\d:\d\d:\d\d)<\/th><td>(\d+:\d\d)<\/td><td>(\d+)<\/td><td>([\d,]+)<\/td><td>(\d+)<\/td><\/tr>/g)];
  assert.equal(circles.length,points.length);
  assert.equal(rows.length,points.length);
  assert.doesNotMatch(section,/<polyline|<path d=/);
  points.forEach((p,i)=>{
    const t=p.observed_at_jst.slice(11,19);
    const elapsed=Math.floor(p.elapsed_seconds/60)+":"+String(p.elapsed_seconds%60).padStart(2,"0");
    assert.deepEqual(rows[i].slice(1),[t,elapsed,String(p.comments),p.stars.toLocaleString("en-US"),String(p.total_visits)]);
    assert.ok(Math.abs(Number(circles[i][1])-(38+550*p.elapsed_seconds/2591))<0.011);
    assert.ok(Math.abs(Number(circles[i][2])-(150-115*p.comments/350))<0.011);
    assert.equal(circles[i][3],t+"・コメント"+p.comments+"件／きら星"+p.stars+"／総訪問表示"+p.total_visits);
  });
});

test("43-minute comparison is faithful but does not assert audience departure or exact unique commenters", () => {
  const a=night.same_elapsed_morning_night_comparison.entries;
  assert.deepEqual(a.map(x=>x.live_id),[23559940,23562541]);
  assert.deepEqual(a.map(x=>[x.elapsed_seconds,x.stars,x.total_visits,x.comments,x.recommended_commenter_count]),
    [[2585,3293,202,273,29],[2579,2838,68,328,13]]);
  assert.equal(night.same_elapsed_morning_night_comparison.comment_count_difference_night_minus_morning,55);
  assert.equal(night.same_elapsed_morning_night_comparison.comment_difference_percent_approx,20.1);
  assert.match(section,/全投稿者数とは限りません/);
  assert.match(section,/ここから断定できません/);
  assert.match(section,/時間帯と視聴条件の異なる/);
});

test("private conversation and viewer records are outside every new public artifact",()=>{
  const docs=read("docs/DATA-LAB.md");
  assert.match(docs,/2026-10-16 夜配信/);
  for(const s of [section,raw]) {
    assert.doesNotMatch(s,/chatgpt\.site|drive\.google|@gmail\.com|viewer[_-]?id|comment[_-]?text|contributor[_-]?id|[A-Z]:\\Users\\/i);
  }
  for (const k of ["raw_comments","raw_logs","private_messages","dm_screenshots","recording_path","recording_file","viewer_ids","supporter_names","local_path"]) {
    assert.equal(Object.hasOwn(night,k),false,k);
  }
  assert.match(night.metric_caveat,/NOT proven to count all unique commenters/);
  assert.match(night.privacy,/no real names/);
});
