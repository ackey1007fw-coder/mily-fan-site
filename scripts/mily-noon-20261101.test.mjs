import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1101Noon as recap } from "../src/data/streamRecap1101Noon.ts";
import { streamRecap1101Morning as morning } from "../src/data/streamRecap1101Morning.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/1 noon: below the same-day night card, above the same-day morning, recording-relative timestamps", () => {
  // The same-day night card (later slot) sits above the noon card.
  assert.equal(streamRecaps[0].id, "2026-11-01-night-showroom");
  assert.equal(streamRecaps[1], recap);
  assert.equal(streamRecaps[2], morning);
  assert.equal(recap.id, "2026-11-01-noon-showroom");
  assert.equal(recap.dateLabel, "2026.11.01（日）");
  assert.equal(recap.broadcastLabel, "14:45頃〜 約30分");
  assert.equal(recap.timestampBasis, undefined);
  assert.match(recap.transcriptionNote, /正式な終了時刻は確認していません/);
});

test("11/1 noon: 10 real stills and three talk excerpts from this live only", () => {
  assert.equal(recap.gallery.length, 10);
  assert.ok(recap.gallery.includes(recap.image));
  for (const g of recap.gallery) {
    assert.match(g.src, /^\/media\/live\/mily-b247-\d{2}-20261101-noon-[a-z-]+\.jpg$/);
    assert.equal(g.downloadName, g.src.split("/").pop());
    assert.ok(statSync(new URL("../public" + g.src, import.meta.url)).size > 0);
    assert.match(g.alt, /みりぃ/);
  }
  const clips = recap.highlights.filter(h => h.clip);
  assert.equal(clips.length, 3);
  for (const h of clips) {
    assert.match(h.clip.src, /^\/media\/live-clips\/mily-b247-1[1-3]-20261101-noon-[a-z-]+\.mp4$/);
    assert.equal(h.clip.sourceTimestamp, h.timestamp);
    assert.ok(h.clip.durationSeconds > 0 && h.clip.durationSeconds <= 60);
    assert.ok(statSync(new URL("../public" + h.clip.src, import.meta.url)).size > 0);
    assert.ok(statSync(new URL("../public" + h.clip.poster, import.meta.url)).size > 0);
  }
});

test("11/1 noon: no viewer names, private details, paths or unconfirmed songs", () => {
  assert.doesNotMatch(text, /あっきー|アッキー|あっき|バイト|焼肉|母|同級生|カラコン|drive[.]google|C:\\\\Users|live_id|23630916|\.mkv/);
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
