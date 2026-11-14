import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1103Night as recap } from "../src/data/streamRecap1103Night.ts";
import { streamRecap1102Noon as noon } from "../src/data/streamRecap1102Noon.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/3 night: below the 11/4 morning card, above the 11/2 noon, recording-relative timestamps", () => {
  assert.equal(streamRecaps[10], recap);
  assert.equal(streamRecaps[11], noon);
  assert.equal(recap.id, "2026-11-03-night-showroom");
  assert.equal(recap.dateLabel, "2026.11.03（火）");
  assert.equal(recap.broadcastLabel, "22:31頃〜 約60分");
  assert.equal(recap.timestampBasis, undefined);
  assert.match(recap.transcriptionNote, /正式な終了時刻は確認していません/);
  assert.match(recap.transcriptionNote, /歌唱場面の動画は掲載していません/);
});

test("11/3 night: 10 real stills and one talk excerpt from this live only (no singing video)", () => {
  assert.equal(recap.gallery.length, 10);
  assert.ok(recap.gallery.includes(recap.image));
  for (const g of recap.gallery) {
    assert.match(g.src, /^\/media\/live\/mily-b251-\d{2}-20261103-night-[a-z-]+\.jpg$/);
    assert.equal(g.downloadName, g.src.split("/").pop());
    assert.ok(statSync(new URL("../public" + g.src, import.meta.url)).size > 0);
    assert.match(g.alt, /みりぃ/);
  }
  const clips = recap.highlights.filter(h => h.clip);
  assert.equal(clips.length, 1);
  for (const h of clips) {
    assert.match(h.clip.src, /^\/media\/live-clips\/mily-b251-58-20261103-night-[a-z-]+\.mp4$/);
    assert.equal(h.clip.sourceTimestamp, h.timestamp);
    assert.ok(h.clip.durationSeconds > 0 && h.clip.durationSeconds <= 60);
    assert.ok(statSync(new URL("../public" + h.clip.src, import.meta.url)).size > 0);
    assert.ok(statSync(new URL("../public" + h.clip.poster, import.meta.url)).size > 0);
  }
  assert.equal(recap.songs, undefined);
  assert.equal(recap.singingExcerpts, undefined);
});

test("11/3 night: no viewer names, private details, paths or raw numbers", () => {
  assert.doesNotMatch(text, /あっきー|アッキー|とくぞー|徳|ゴリメロ|なおか|那丘|ナオカ|ヘッポコ|ジャンク|マコト|まこと|リンリン|ちゃんぎ|チャンギ|いと〜|伊藤|ひぐ|クリア|ケンシュ|夏凪|里季|教員|先生|drive[.]google|C:\\\\Users|live_id|23641251|\.mkv|\.ts"/);
  assert.deepEqual(recap.goals, []);
  assert.match(recap.nextNote, /^配信時点/);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === recap.id);
  assert.equal(ledger.filter(r => r.id === recap.id).length, 1);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
