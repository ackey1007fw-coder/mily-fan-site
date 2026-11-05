import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1104Noon as recap } from "../src/data/streamRecap1104Noon.ts";
import { streamRecap1104Morning as night } from "../src/data/streamRecap1104Morning.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/4 noon: below the 11/4 night card, above the 11/4 morning, recording-relative timestamps", () => {
  assert.equal(streamRecaps[3], recap);
  assert.equal(streamRecaps[4], night);
  assert.equal(recap.id, "2026-11-04-noon-showroom");
  assert.equal(recap.dateLabel, "2026.11.04（水）");
  assert.equal(recap.broadcastLabel, "14:45頃〜 約20分");
  assert.equal(recap.timestampBasis, undefined);
  assert.match(recap.transcriptionNote, /正式な終了時刻は確認していません/);
  assert.match(recap.transcriptionNote, /歌唱場面の動画は掲載していません/);
});

test("11/4 noon: 10 real stills , no clips from this live only (no singing video)", () => {
  assert.equal(recap.gallery.length, 10);
  assert.ok(recap.gallery.includes(recap.image));
  for (const g of recap.gallery) {
    assert.match(g.src, /^\/media\/live\/mily-b253-\d{2}-20261104-noon-[a-z-]+\.jpg$/);
    assert.equal(g.downloadName, g.src.split("/").pop());
    assert.ok(statSync(new URL("../public" + g.src, import.meta.url)).size > 0);
    assert.match(g.alt, /みりぃ/);
  }
  assert.equal(recap.highlights.filter(h => h.clip).length, 0);
  assert.equal(recap.songs, undefined);
  assert.equal(recap.singingExcerpts, undefined);
});

test("11/4 noon: no viewer names, private details, paths or raw numbers", () => {
  assert.doesNotMatch(text, /あっきー|アッキー|とくぞー|ダニー|ダニ|ちゃま|チャマ|フランク|みはな|ミハナ|見派な|タコ|たかちゃん|タカちゃん|へっぽこ|ゴリメロ|ネネ|みきみき|こぶた|小豚|キサラギ|ゆうひ|ゆう子|ニコニコ|みのる|いと〜|イトー|伊藤|ネズミ|ねずみ|青猫|マコ|まこ|クッキー|夏凪|里季|教員|先生|大学|1限|会議|drive[.]google|C:\\\\Users|live_id|23643335|\.mkv|\.ts"/);
  assert.deepEqual(recap.goals, []);
  assert.equal(recap.nextNote, "");
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === recap.id);
  assert.equal(ledger.filter(r => r.id === recap.id).length, 1);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
