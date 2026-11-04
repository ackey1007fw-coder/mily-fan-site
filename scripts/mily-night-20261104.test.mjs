import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1104Night as recap } from "../src/data/streamRecap1104Night.ts";
import { streamRecap1104Noon as noon } from "../src/data/streamRecap1104Noon.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/4 night: newest card above the 11/4 noon, recording-relative timestamps", () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps[1], noon);
  assert.equal(recap.id, "2026-11-04-night-showroom");
  assert.equal(recap.broadcastLabel, "20:50頃〜 約61分");
  assert.equal(recap.timestampBasis, undefined);
  assert.match(text, /\/data-lab\/reports\/20261104-night\//);
});

test("11/4 night: 10 real stills, no clips", () => {
  assert.equal(recap.gallery.length, 10);
  assert.ok(recap.gallery.includes(recap.image));
  for (const g of recap.gallery) {
    assert.match(g.src, /^\/media\/live\/mily-b254-\d{2}-20261104-night-[a-z0-9-]+\.jpg$/);
    assert.equal(g.downloadName, g.src.split("/").pop());
    assert.ok(statSync(new URL("../public" + g.src, import.meta.url)).size > 0);
    assert.match(g.alt, /みりぃ/);
  }
  assert.equal(recap.highlights.filter(h => h.clip).length, 0);
  assert.equal(recap.songs, undefined);
});

test("11/4 night: no viewer names, private details, paths or raw ids", () => {
  assert.doesNotMatch(text, /アッキー|とくぞー|ダニー|ちゃま|フランク|みはな|夏凪|里季|教員|先生|大学|会議|drive[.]google|C:\\\\Users|live_id|23644591|\.mkv|private\//);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === recap.id);
  assert.equal(ledger.filter(r => r.id === recap.id).length, 1);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
