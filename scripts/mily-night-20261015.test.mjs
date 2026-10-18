import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const page = read("data-lab/index.html");
const raw = read("public/data-lab/data/mily-night-20261015-aggregate.json");
const data = JSON.parse(raw);

test("new night section is first and archive history preserved", () => {
  for (const id of ["night-20261015", "morning-20261015", "night-20261014", "noon-20261014", "morning-20261014", "final-night", "naoka-update", "roster"]) {
    assert.ok(page.includes('id="' + id + '"'), id);
  }
  assert.ok(page.indexOf('id="night-20261015"') < page.indexOf('id="morning-20261015"'));
  assert.ok(page.includes('href="#night-20261015"'));
  assert.match(page, /noindex,nofollow,noarchive/);
});
test("night recording details are verified but not conflated with actual air times", () => {
  assert.equal(data.live_id,23558451);
  assert.equal(data.recording.recorder_saved,true);
  assert.equal(data.recording.ffmpeg_exit_code,0);
  assert.equal(data.recording.size_bytes,597999981);
  assert.equal(data.recording.media_duration_seconds,4935.031);
  assert.deepEqual([data.recording.video.codec,data.recording.video.width,data.recording.video.height,data.recording.audio.codec],["h264",640,360,"aac"]);
  assert.equal(data.recording.complete_coverage_confirmed,false);
  assert.equal(data.recording.full_content_reviewed,false);
  assert.equal(data.recording_processing_window_jst.not_equal_to_confirmed_broadcast_start_end,true);
  assert.match(page,/21:59:58〜23:23:20/);
  assert.match(page,/82分15秒/);
});
test("unobserved online counters remain unknown, not fabricated", () => {
  assert.equal(data.event_partition.this_broadcast_excluded_from_fourth_round_total,true);
  assert.equal(data.event_partition.new_event_identity,"unconfirmed");
  assert.equal(data.event_partition.semifinal_event_points_not_inferred,true);
  assert.equal(data.observed_screen.stars,510);
  assert.equal(data.observed_screen.comments,31);
  assert.equal(data.observed_screen.confirmed_final,false);
  assert.equal(data.observed_screen.observed_at_jst,"2026-10-15T22:03:19.379+09:00");
  for (const key of ["total_visits","first_visits","second_visits","star100_supporters"]) assert.equal(data.observed_screen[key],null);
  assert.equal(data.last_valid_online_screen_at_jst,"2026-10-15T22:03:19.379+09:00");
  assert.equal(data.data_quality.online_counter_observations,16);
  assert.equal(data.data_quality.full_broadcast_counter_coverage,false);
  assert.equal(data.data_quality.ui_transient_zero_excluded,true);
  assert.equal(data.data_quality.ui_initial_unverified_excluded,true);
  assert.deepEqual(data.observed_points.map(p=>[p.stars,p.comments]),[[130,7],[160,7],[300,31],[310,31],[310,31],[310,31],[410,31],[510,31],[510,31],[510,31],[510,31]]);
  assert.equal(data.data_quality.verified_displayed_observations,11);
  assert.equal(data.data_quality.excluded_initial_unverified_observations + data.data_quality.excluded_transient_zero_observations + data.observed_points.length,16);
  assert.ok(page.includes("3分間の観測を救出"));
  assert.ok(page.includes("22:01:33の一時的なゼロ戻り"));
  assert.equal(data.data_quality.full_playback_or_manual_audio_review,false);
  assert.match(page,/0人ではありません/);
  assert.match(page,/10月15日朝/);
});
test("all accepted observations match the table and proportional chart axes", () => {
  const section = page.split('id="night-20261015"')[1].split('</section>')[0];
  assert.doesNotMatch(section,/約82分の配信|間は未観測/);
  assert.match(section,/約82分の保存録画/);
  assert.match(section,/22:03:19以後は未取得/);
  const dots = [...section.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)"[^>]*><title>([^<]+)<\/title><\/circle>/g)];
  const rows = [...section.matchAll(/<tr><th scope="row">([^<]+)<\/th><td>(\d+)<\/td><td>(\d+)<\/td><\/tr>/g)];
  assert.equal(dots.length,data.observed_points.length);
  assert.equal(rows.length,data.observed_points.length);
  assert.doesNotMatch(section,/<polyline|<path/);
  const ticks = [...section.matchAll(/<text x="([\d.]+)" y="176"[^>]*>(22:\d\d)<\/text>/g)];
  assert.equal(ticks.length,3);
  const xScale=(+ticks[1][1] - +ticks[0][1])/60000;
  const epoch=Date.parse(`2026-10-15T${ticks[0][2]}:00+09:00`);
  data.observed_points.forEach((point,i) => {
    const time=point.observed_at_jst.slice(11,19);
    assert.deepEqual(rows[i].slice(1),[time,String(point.stars),String(point.comments)]);
    assert.equal(dots[i][3],`${time} きら星${point.stars} コメント${point.comments}`);
    assert.ok(Math.abs(+dots[i][1]-(+ticks[0][1]+(Date.parse(point.observed_at_jst)-epoch)*xScale))<0.01,"Clock labels and sample positions must use the same time scale");
    assert.ok(Math.abs(+dots[i][2]-(150-point.stars/5))<0.01,"Value positions must match 0/300/600 axis labels");
  });
});
test("public artifacts contain no private source paths or viewer records", () => {
  for (const source of [page,raw]) {
    assert.doesNotMatch(source,/chatgpt\.site|drive\.google|@gmail\.com|viewer[_-]?id|user[_-]?id|contributor[_-]?id|[A-Z]:\\Users\\/i);
  }
  for (const key of ["recording_file","recording_path","raw_logs","raw_comments","supporter_names","personal_site_url"]) assert.equal(Object.hasOwn(data,key),false,key);
});
