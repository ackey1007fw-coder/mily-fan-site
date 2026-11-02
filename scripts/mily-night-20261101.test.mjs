import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1101Night as recap } from "../src/data/streamRecap1101Night.ts";
import { streamRecap1101Noon as noon } from "../src/data/streamRecap1101Noon.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/1 night: newest card above the same-day noon, recording-relative timestamps", () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps[1], noon);
  assert.equal(recap.id, "2026-11-01-night-showroom");
  assert.equal(recap.dateLabel, "2026.11.01（日）");
  assert.equal(recap.broadcastLabel, "22:31頃〜 約60分");
  assert.equal(recap.timestampBasis, undefined);
  assert.match(recap.transcriptionNote, /正式な終了時刻は確認していません/);
});

test("11/1 night: 10 real stills and three talk excerpts from this live only", () => {
  assert.equal(recap.gallery.length, 10);
  assert.ok(recap.gallery.includes(recap.image));
  for (const g of recap.gallery) {
    assert.match(g.src, /^\/media\/live\/mily-b248-\d{2}-20261101-night-[a-z-]+\.jpg$/);
    assert.equal(g.downloadName, g.src.split("/").pop());
    assert.ok(statSync(new URL("../public" + g.src, import.meta.url)).size > 0);
    assert.match(g.alt, /みりぃ/);
  }
  const clips = recap.highlights.filter(h => h.clip);
  assert.equal(clips.length, 3);
  for (const h of clips) {
    assert.match(h.clip.src, /^\/media\/live-clips\/mily-b248-1[1-3]-20261101-night-[a-z-]+\.mp4$/);
    assert.equal(h.clip.sourceTimestamp, h.timestamp);
    assert.ok(h.clip.durationSeconds > 0 && h.clip.durationSeconds <= 60);
    assert.ok(statSync(new URL("../public" + h.clip.src, import.meta.url)).size > 0);
    assert.ok(statSync(new URL("../public" + h.clip.poster, import.meta.url)).size > 0);
  }
});

test("11/1 night: no viewer names, private details, paths or unconfirmed songs", () => {
  assert.doesNotMatch(text, /あっきー|アッキー|あっき|バイト|アルバイト|バス|切符|キップ|パス|母|家族|大学|学祭|カラコン|ジョーマローン|夏凪|drive[.]google|C:\\\\Users|live_id|23633097|\.mkv/);
  assert.equal(recap.songs, undefined);
  assert.deepEqual(recap.goals, []);
  assert.match(recap.ranking[0], /13位から1位まで/);
  assert.match(recap.nextNote, /^配信時点では/);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === recap.id);
  assert.equal(ledger.filter(r => r.id === recap.id).length, 1);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
