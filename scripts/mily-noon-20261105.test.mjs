import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1105Noon as recap } from "../src/data/streamRecap1105Noon.ts";
import { streamRecap1105Morning as morning } from "../src/data/streamRecap1105Morning.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/5 noon: below 11/8 night and above 11/5 morning, recording-relative timestamps", () => {
  assert.equal(streamRecaps[5], recap);
  assert.equal(streamRecaps[6], morning);
  assert.equal(recap.id, "2026-11-05-noon-showroom");
  assert.equal(recap.broadcastLabel, "14:45頃〜 約31分");
  assert.equal(recap.timestampBasis, undefined);
  assert.match(text, /\/data-lab\/reports\/20261105-noon\//);
});

test("11/5 noon: 10 real stills plus one magazine page made only from them, no clips, one song", () => {
  assert.equal(recap.gallery.length, 11);
  assert.equal(recap.gallery[0], recap.image);
  for (const g of recap.gallery.slice(1)) {
    assert.match(g.src, /^\/media\/live\/mily-b256-\d{2}-20261105-noon-[a-z0-9-]+\.jpg$/);
    assert.equal(g.downloadName, g.src.split("/").pop());
    assert.ok(statSync(new URL("../public" + g.src, import.meta.url)).size > 0);
    assert.match(g.alt, /みりぃ/);
  }
  assert.equal(recap.image.src, "/media/live/mily-b256-00-20261105-noon-magazine-collage.jpg");
  assert.equal(recap.image.width, 1280); assert.equal(recap.image.height, 720);
  assert.ok(statSync(new URL("../public" + recap.image.src, import.meta.url)).size > 0);
  assert.equal(recap.highlights.filter(h => h.clip).length, 0);
  assert.equal(recap.songs.length, 1); assert.equal(recap.songs[0].title, "高嶺の花子さん");
});

test("11/5 noon: no viewer names, private details, paths or raw ids", () => {
  assert.doesNotMatch(text, /アッキー|あっきー|ちゃま|キサラギ|クニヨシ|こぶた|イヌズキ|夏凪|里季|教員|先生|大学|会議|drive[.]google|C:\\\\Users|live_id|23646534|23647558|ゼミ|通学|\.mkv|private\//);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === recap.id);
  assert.equal(ledger.filter(r => r.id === recap.id).length, 1);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
