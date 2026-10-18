import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const page = read("data-lab/index.html");
const css = read("public/data-lab/assets/styles.css");
const raw = read("public/data-lab/data/mily-morning-20261014-aggregate.json");
const data = JSON.parse(raw);

test("October 14 section is within the existing MILY SIGNAL site and prior sections remain", () => {
  assert.match(page, /id="morning-20261014"/);
  assert.match(page, /href="#morning-20261014"/);
  for (const old of ['id="naoka-update"', 'id="final-night"', 'id="now"', 'id="forecast"', 'id="roster"']) {
    assert.ok(page.includes(old), old);
  }
  assert.match(page, /3,476/);
  assert.match(page, /278/);
  assert.match(page, /370/);
  assert.match(page, /約96分/);
  assert.match(page, /<svg[^>]+role="img"/);
  assert.match(css, /\.morning-kpis\{/);
  assert.match(css, /@media\(max-width:800px\)/);
});
test("the new event is not mixed with October 12 contest and cannot be read as official gifts", () => {
  assert.equal(data.date_jst,"2026-10-14");
  assert.equal(data.event_partition.this_broadcast_excluded_from_fourth_round_total,true);
  assert.equal(data.event_partition.new_event_identity,"unconfirmed");
  assert.equal(data.event_partition.analysis_cutoff_jst,"2026-10-12T22:00:00+09:00");
  assert.ok(!Object.hasOwn(data.event_partition,"fourth_round_ended_jst"));
  assert.match(css,/\.morning-table\{table-layout:fixed;max-width:100%;min-width:0\}/);
  assert.match(page,/2026\.10\.12 四次審査の記録 ＋ 2026\.10\.14 朝の観測/);
  assert.equal(data.observed_screen.stars,3476);
  assert.equal(data.observed_screen.total_visits,278);
  assert.equal(data.observed_screen.comments,370);
  assert.equal(data.observed_screen.first_visits,8);
  assert.equal(data.previous_morning.stars,2034);
  assert.equal(data.previous_morning.total_visits,215);
  assert.equal(data.previous_morning.comments,263);
  assert.equal(data.early_approx_37min_observation.stars,1750);
  assert.match(page, /四次審査合計には加えていません/);
  assert.match(page, /ユニーク視聴者数ではなく/);
  assert.equal(data.five_minute_window_endpoints.length,20);
  assert.deepEqual(data.five_minute_window_endpoints.at(-1),{window_start_jst:"08:55",stars:3476,visits:278,comments:370});
  for (const k of ["stars","comments"]) assert.ok(data.five_minute_window_endpoints.every((x,i,a)=>i===0 || x[k]>=a[i-1][k]),"monotonic "+k);
  const n=data.five_minute_window_endpoints;
  assert.equal(n.find(x=>x.window_start_jst==="07:30").stars-n.find(x=>x.window_start_jst==="07:25").stars,400);
  assert.equal(n.find(x=>x.window_start_jst==="08:05").stars-n.find(x=>x.window_start_jst==="08:00").stars,400);
});
test("only anonymized aggregates are publishable in October 14 materials",()=>{
  const parts=[page,raw];
  for (const part of parts) {
    assert.doesNotMatch(part,/chatgpt\.site|drive\.google|@gmail\.com|viewer[_-]?id|user[_-]?id|contributor[_-]?id|recording[_-]?id|https?:\/\/[^"']*private/i);
  }
  const serialized = JSON.stringify(data);
  for (const forbidden of ["user_id","viewer_id","comment_text","gift_log","recording_file","supporter_names"]) {
    assert.ok(!serialized.includes(forbidden),forbidden);
  }
  assert.ok(!page.includes('href="/data-lab/reports/20261014-morning/"'),"No missing report link");
});
