import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1031Noon as recap } from "../src/data/streamRecap1031Noon.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("10/31 noon: separate recap ordered after the earlier dates, with memo clock not invented offsets", () => {
  assert.equal(recap.id, "2026-10-31-noon-showroom");
  assert.equal(recap.dateLabel, "2026.10.31（土）");
  assert.equal(streamRecaps.filter(r => r.id === recap.id).length, 1);
  assert.ok(streamRecaps.indexOf(recap) < streamRecaps.findIndex(r => r.id === "2026-10-30-night-showroom"));
  assert.equal(recap.timestampBasis, "memo-clock");
  assert.equal(recap.broadcastLabel, "14:45頃〜 約37分");
  assert.deepEqual(recap.timeline, []);
  assert.match(recap.transcriptionNote, /中断を含む時計上の幅/);
  assert.match(recap.transcriptionNote, /録画内の経過時刻ではありません/);
  assert.match(recap.transcriptionNote, /15:21〜22頃終了/);
});
test("10/31 noon: observations remain five display references, not metrics or final results", () => {
  const h = recap.highlights.find(h => h.title === "人数表示の参考メモ");
  assert.ok(h);
  assert.match(h.body, /14:47に47、15:00頃161、15:04頃306、15:10頃450、15:21頃600/);
  assert.match(h.body, /計測定義は未確認/);
  assert.match(h.body, /実人数・総訪問数・確定終値とは区別/);
  assert.match(recap.transcriptionNote, /ポイント数の確定値は未確認で掲載していません/);
  assert.equal(recap.metrics, undefined);
});
test("10/31 noon: gratitude and aspiration, without invented outcomes, songs or media", () => {
  assert.match(text, /100キラへのありがとう/);
  assert.match(text, /通過結果の発表ではありません/);
  assert.equal(recap.songs, undefined);
  assert.match(recap.transcriptionNote, /歌の実演・曲名は確認できておらず/);
  assert.equal(recap.image, undefined);
  assert.equal(recap.gallery, undefined);
  assert.deepEqual(recap.ranking, []);
  assert.ok(recap.highlights.every(h => !h.clip && !h.socialClip && !h.quote));
  assert.doesNotMatch(text, /21:55|5分押し|５分押し|5分遅|instagram[.]com|youtu[.]be|drive[.]google[.]com|@gmail[.]com|C:\\Users/i);
});
test("10/31 noon: historical night announcement and honest source disclosure are retained", () => {
  assert.match(recap.nextNote, /^配信時点では、夜枠を21:00〜21:50/);
  assert.match(recap.nextNote, /ハロウィンコスプレ予定/);
  assert.match(recap.nextNote, /【後報】同日15:52の本人ファンルーム告知で21:05〜21:50へ変更/);
  assert.match(recap.sourceLabel, /オーナーによる提供視聴メモ・保存ASR参照/);
  assert.match(recap.transcriptionNote, /原音の手動聴取・全編映像の再確認・逐語校正は未実施/);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === recap.id);
  assert.equal(ledger.filter(r => r.id === recap.id).length, 1);
  assert.equal(record.source, recap.sourceLabel);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.equal(record.verifiedAt, recap.verifiedAt);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
  assert.ok(recap.theme.length <= 16 && recap.summary.length <= 140 && recap.nextNote.length <= 120);
  assert.ok(recap.highlights.length <= 8);
  for (const h of recap.highlights) assert.ok(h.title.length <= 20 && h.body.length <= 100);
});
