import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url),"utf8");
const page=read("data-lab/index.html"),raw=read("public/data-lab/data/mily-night-20261014-aggregate.json"),data=JSON.parse(raw);
test("October 14 night is separate from noon/morning and fourth-round",()=>{
  for(const id of ["night-20261014","noon-20261014","morning-20261014","final-night","naoka-update","roster"])assert.ok(page.includes('id="'+id+'"'),id);
  assert.ok(page.includes('href="#night-20261014"'));
  assert.ok(page.includes("23554271"));
  assert.equal(data.live_id,23554271);
  assert.equal(data.event_partition.this_broadcast_excluded_from_fourth_round_total,true);
  assert.equal(data.event_partition.new_event_identity,"unconfirmed");
});
test("No fabricated missing counter values or fictional highlights",()=>{
  for(const k of ["stars","total_visits","comments","first_visits","second_visits","star100_supporters"])assert.equal(data.observed_screen[k],null,k);
  assert.equal(data.last_valid_online_screen_at_jst,null);
  assert.equal(data.recording.exists,true);
  assert.equal(data.recording.complete_coverage_confirmed,false);
  assert.match(page,/未取得/);
  assert.match(page,/0個という意味ではありません/);
  assert.match(page,/トーク内容の聞き取りや盛り上がりの場面は引き続き未検品/);
});
test("Public night packet contains no private Site, logs, viewer identities, or recording path",()=>{
  for(const s of [page,raw])assert.doesNotMatch(s,/chatgpt\.site|drive\.google|@gmail\.com|viewer[_-]?id|user[_-]?id|contributor[_-]?id/ig);
  for(const key of ["recording_file","file_path","raw_gifts","comment_text","supporter_names"])assert.ok(!raw.includes('"'+key+'"'));
});
