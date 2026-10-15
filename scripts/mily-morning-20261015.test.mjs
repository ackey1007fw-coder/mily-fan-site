import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const page = read("data-lab/index.html");
const raw = read("public/data-lab/data/mily-morning-20261015-aggregate.json");
const data = JSON.parse(raw);

test("October 15 morning section coexists with older streams and fourth-round archive", () => {
  for (const id of ["morning-20261015","night-20261014","noon-20261014","morning-20261014","final-night","naoka-update","forecast","roster","sources"]) {
    assert.ok(page.includes('id="' + id + '"'), id);
  }
  assert.ok(page.indexOf('id="morning-20261015"') < page.indexOf('id="night-20261014"'), "newest first");
  assert.ok(page.includes('href="#morning-20261015"'));
  for (const v of ["2,755","187","195","2,745","1,732","1,620","＋745","＋565"]) assert.ok(page.includes(v), v);
  assert.match(page, /noindex,nofollow,noarchive/);
  assert.equal(data.live_id,23555653);
  assert.equal(data.event_partition.this_broadcast_excluded_from_fourth_round_total,true);
  assert.equal(data.event_partition.analysis_cutoff_jst,"2026-10-12T22:00:00+09:00");
  assert.equal(data.event_partition.new_event_identity,"unconfirmed");
});

test("latest online screen is retained without claiming final values or unique visitors", () => {
  assert.deepEqual([data.observed_screen.stars,data.observed_screen.total_visits,data.observed_screen.comments],[2755,187,195]);
  assert.deepEqual([data.observed_screen.first_visits,data.observed_screen.second_visits,data.observed_screen.other_free],[4,7,40]);
  assert.equal(data.observed_screen.last_valid_online_observed_at_jst,"2026-10-15T06:31:08.545+09:00");
  assert.equal(data.observed_screen.confirmed_final,false);
  assert.equal(data.data_quality.stream_end_confirmed,false);
  assert.equal(data.data_quality.disconnect_count,3);
  assert.equal(data.data_quality.online_counter_observations,156);
  assert.equal(data.data_quality.participant_unique_count,null);
  assert.match(page,/配信終了時の確定値ではありません/);
  assert.match(page,/未観測/);
});

test("five-minute points and fair 27-minute comparison are grounded and not interpolated", () => {
  const p=data.five_minute_window_endpoints;
  assert.equal(p.length,7);
  assert.equal(p[0].visits,null);
  assert.deepEqual([p.at(-1).stars,p.at(-1).visits,p.at(-1).comments],[2755,187,195]);
  for(const key of ["stars","comments"])assert.ok(p.every((v,i)=>i===0||v[key]>=p[i-1][key]),key);
  assert.equal(p[1].stars-p[0].stars,745);
  assert.equal(p[4].stars-p[3].stars,565);
  assert.deepEqual(data.observed_windows_of_interest.map(x=>x.delta),[745,565]);
  const observations=data.same_elapsed_comparison.observations;
  assert.deepEqual(observations.map(x=>[x.stars,x.total_visits,x.comments]),[[1732,146,184],[1620,90,113],[2745,187,195]]);
  assert.ok(observations.every(x=>x.elapsed_from_screen_label_seconds_approx>=1630&&x.elapsed_from_screen_label_seconds_approx<=1650));
  assert.match(page,/約27分/);
  assert.match(page,/点で表示/);
});

test("public snapshot excludes private sources and individual viewer data",()=>{
  for(const content of [page,raw]){
    assert.doesNotMatch(content,/chatgpt\.site|drive\.google|@gmail\.com|viewer[_-]?id|user[_-]?id|contributor[_-]?id|https?:\/\/[^"' ]*private/i);
  }
  for(const key of ["raw_logs","raw_comments","gift_log","comment_text","recording_file","supporter_names","viewer_id","user_id"])assert.ok(!Object.hasOwn(data,key),key);
  assert.equal(data.privacy.includes("anonymous"),true);
});
