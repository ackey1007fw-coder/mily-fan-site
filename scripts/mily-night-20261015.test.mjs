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
  assert.deepEqual(data.observed_points.map(p=>[p.stars,p.comments]),[[130,7],[300,31],[510,31],[510,31]]);
  assert.ok(page.includes("冒頭3分の数字を救出"));
  assert.ok(page.includes("22:01:33の一時的なゼロ戻り"));
  assert.equal(data.data_quality.full_playback_or_manual_audio_review,false);
  assert.match(page,/0人ではありません/);
  assert.match(page,/10月15日朝/);
});
test("public artifacts contain no private source paths or viewer records", () => {
  for (const source of [page,raw]) {
    assert.doesNotMatch(source,/chatgpt\.site|drive\.google|@gmail\.com|viewer[_-]?id|user[_-]?id|contributor[_-]?id|[A-Z]:\\Users\\/i);
  }
  for (const key of ["recording_file","recording_path","raw_logs","raw_comments","supporter_names","personal_site_url"]) assert.equal(Object.hasOwn(data,key),false,key);
});
