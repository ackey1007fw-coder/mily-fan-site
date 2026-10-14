import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecap20261014Night } from "../src/data/streamRecap20261014Night.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";
const read = (path) => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
test("night recording is a separate, clearly unverified recap and newest", () => {
  const recap = streamRecap20261014Night;
  assert.equal(recap.id, "2026-10-14-night-showroom");
  assert.equal(recap.date,"2026-10-14");
  assert.equal(streamRecaps[0],recap);
  assert.equal(streamRecaps[1].id,"2026-10-14-noon-showroom");
  assert.equal(streamRecaps[2].id,"2026-10-14-morning-showroom");
  assert.equal(streamRecaps[3].id,"2026-10-13-night-showroom");
  assert.ok(recap.summary.includes("確認できていない"));
  assert.equal(recap.image,undefined);
  assert.equal(recap.gallery,undefined);
  assert.deepEqual(recap.goals,[]);
  assert.deepEqual(recap.ranking,[]);
  assert.ok(recap.transcriptionNote.includes("音声の聞き取り"));
});
test("night public report and ledger do not reveal private raw data or fabricate stars", () => {
  const recap = JSON.stringify(streamRecap20261014Night);
  for(const forbidden of [/chatgpt\.site/i,/drive\.google/i,/@gmail/i,/\.mkv/i,/viewer[_-]?id/i,/comment_text/i,/gift_log/i,/new_event_id/i]) assert.doesNotMatch(recap,forbidden);
  assert.ok(recap.includes("未取得"));
  assert.ok(!recap.includes("3,866"));
  assert.ok(ledger.some(x=>x.id==="2026-10-14-night-showroom" && x.originalNote.includes("未取得")));
});
