import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const recap = read("src/data/streamRecap20261014Asa.ts");
const index = read("src/data/streamRecaps.ts");
const aggregate = JSON.parse(read("public/data-lab/data/mily-morning-20261014-aggregate.json"));

test("October 14 morning recap appears after same-day noon and before October 13 night", () => {
  assert.match(recap, /2026-10-14-morning-showroom/);
  assert.match(recap, /2026\.10\.14（水）/);
  assert.match(recap, /録画開始7:22頃〜 約96分/);
  assert.match(index, /import \{ streamRecap20261014Asa \}/);
  const seq = index.slice(index.indexOf("export const streamRecaps: StreamRecap[]"));
  assert.ok(seq.indexOf("streamRecap20261014Noon,") < seq.indexOf("streamRecap20261014Asa,"));
  assert.ok(seq.indexOf("streamRecap20261014Asa,") < seq.indexOf("streamRecap20261013Night,"));
});
test("numbers refer to the already-published anonymous morning aggregate", () => {
  assert.equal(aggregate.observed_screen.stars, 3476);
  assert.equal(aggregate.observed_screen.total_visits, 278);
  assert.equal(aggregate.observed_screen.comments, 370);
  assert.equal(aggregate.event_partition.this_broadcast_excluded_from_fourth_round_total, true);
  for (const label of ["3,476", "278", "370", "/data-lab/#morning-20261014"]) {
    assert.ok(recap.includes(label), label);
  }
  assert.match(recap, /確定前の参考値/);
  assert.match(recap, /ユニーク人数/);
});
test("source quality and public privacy boundaries remain explicit", () => {
  assert.match(recap, /AUTO_TRANSCRIPT_MATERIAL_NOTE/);
  assert.match(recap, /静止画は掲載していません/);
  assert.match(recap, /goals: \[\]/);
  assert.match(recap, /ranking: \[\]/);
  for (const forbidden of [/drive\.google/i, /chatgpt\.site/i, /(?:viewer|user|recording)[_-]?id/i, /https?:\/\//i, /@gmail/i, /\.mkv/i]) {
    assert.doesNotMatch(recap, forbidden);
  }
  assert.doesNotMatch(recap, /image:\s*\{/);
});
