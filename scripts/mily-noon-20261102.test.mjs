import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1102Noon as recap } from "../src/data/streamRecap1102Noon.ts";
import { streamRecap1101Night as night } from "../src/data/streamRecap1101Night.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/2 noon: below the 11/3 night card, above the 11/1 night, partial recording noted, no invented times", () => {
  assert.equal(streamRecaps[6], recap);
  assert.equal(streamRecaps[7], night);
  assert.equal(recap.id, "2026-11-02-noon-showroom");
  assert.equal(recap.dateLabel, "2026.11.02（月）");
  assert.equal(recap.broadcastLabel, "14:45頃〜 約30分");
  assert.equal(recap.timestampBasis, undefined);
  assert.match(recap.transcriptionNote, /正式な終了時刻は確認していません/);
  assert.match(recap.transcriptionNote, /冒頭約8分.*終盤約7分/);
});

test("11/2 noon: 10 real stills and three excerpts from this live only", () => {
  assert.equal(recap.gallery.length, 10);
  assert.ok(recap.gallery.includes(recap.image));
  for (const g of recap.gallery) {
    assert.match(g.src, /^\/media\/live\/mily-b249-\d{2}-20261102-noon-[a-z-]+\.jpg$/);
    assert.equal(g.downloadName, g.src.split("/").pop());
    assert.ok(statSync(new URL("../public" + g.src, import.meta.url)).size > 0);
    assert.match(g.alt, /みりぃ/);
  }
  const clips = recap.highlights.filter(h => h.clip);
  assert.equal(clips.length, 3);
  for (const h of clips) {
    assert.match(h.clip.src, /^\/media\/live-clips\/mily-b249-1[1-3]-20261102-noon-[a-z-]+\.mp4$/);
    assert.equal(h.clip.sourceTimestamp, h.timestamp);
    assert.ok(h.clip.durationSeconds > 0 && h.clip.durationSeconds <= 60);
    assert.ok(statSync(new URL("../public" + h.clip.src, import.meta.url)).size > 0);
    assert.ok(statSync(new URL("../public" + h.clip.poster, import.meta.url)).size > 0);
  }
});

test("11/2 noon: no viewer names, private details, paths, ranking or unconfirmed songs", () => {
  assert.doesNotMatch(text, /あっきー|アッキー|ゆうし|たかちゃん|なおか|ボンズ|リンリン|ナイフ|ちな|たなし|ファイム|夏凪|アディダス|adidas|ATEEZ|drive[.]google|C:\\\\Users|live_id|23634935|\.mkv|\.ts"/);
  assert.equal(recap.songs, undefined);
  assert.deepEqual(recap.goals, []);
  assert.deepEqual(recap.ranking, []);
  assert.match(recap.nextNote, /^配信時点/);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === recap.id);
  assert.equal(ledger.filter(r => r.id === recap.id).length, 1);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
