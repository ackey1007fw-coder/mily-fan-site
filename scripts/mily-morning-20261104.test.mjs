import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1104Morning as recap } from "../src/data/streamRecap1104Morning.ts";
import { streamRecap1103Night as night } from "../src/data/streamRecap1103Night.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/4 morning: below the 11/4 noon card, above the 11/3 night, recording-relative timestamps", () => {
  assert.equal(streamRecaps[9], recap);
  assert.equal(streamRecaps[10], night);
  assert.equal(recap.id, "2026-11-04-morning-showroom");
  assert.equal(recap.dateLabel, "2026.11.04（水）");
  assert.equal(recap.broadcastLabel, "6:41頃〜 約35分");
  assert.equal(recap.timestampBasis, undefined);
  assert.match(recap.transcriptionNote, /正式な終了時刻は確認していません/);
  assert.match(recap.transcriptionNote, /歌唱場面の動画は掲載していません/);
});

test("11/4 morning: 10 real stills and three talk excerpts from this live only (no singing video)", () => {
  assert.equal(recap.gallery.length, 10);
  assert.ok(recap.gallery.includes(recap.image));
  for (const g of recap.gallery) {
    assert.match(g.src, /^\/media\/live\/mily-b252-\d{2}-20261104-morning-[a-z-]+\.jpg$/);
    assert.equal(g.downloadName, g.src.split("/").pop());
    assert.ok(statSync(new URL("../public" + g.src, import.meta.url)).size > 0);
    assert.match(g.alt, /みりぃ/);
  }
  const clips = recap.highlights.filter(h => h.clip);
  assert.equal(clips.length, 3);
  for (const h of clips) {
    assert.match(h.clip.src, /^\/media\/live-clips\/mily-b252-6[4-6]-20261104-morning-[a-z-]+\.mp4$/);
    assert.doesNotMatch(h.clip.src, /nyan|punk|song/);
    assert.equal(h.clip.sourceTimestamp, h.timestamp);
    assert.ok(h.clip.durationSeconds > 0 && h.clip.durationSeconds <= 60);
    assert.ok(statSync(new URL("../public" + h.clip.src, import.meta.url)).size > 0);
    assert.ok(statSync(new URL("../public" + h.clip.poster, import.meta.url)).size > 0);
  }
  assert.equal(recap.songs, undefined);
  assert.equal(recap.singingExcerpts, undefined);
});

test("11/4 morning: no viewer names, private details, paths or raw numbers", () => {
  assert.doesNotMatch(text, /あっきー|アッキー|とくぞー|ダニー|ダニ|ちゃま|チャマ|フランク|こぶた|小豚|キサラギ|ゆうひ|ゆう子|ニコニコ|みのる|いと〜|イトー|伊藤|ネズミ|ねずみ|青猫|マコ|まこ|クッキー|夏凪|里季|教員|先生|大学|1限|会議|drive[.]google|C:\\\\Users|live_id|23642484|\.mkv|\.ts"/);
  assert.deepEqual(recap.goals, []);
  assert.match(recap.nextNote, /^配信時点/);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === recap.id);
  assert.equal(ledger.filter(r => r.id === recap.id).length, 1);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
