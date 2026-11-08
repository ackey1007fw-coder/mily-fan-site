import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap20261108Night as recap } from "../src/data/streamRecap20261108Night.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

test("11/8 night: one text-only recap, newest first, no unverified media or songs", () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps.filter(r => r.id === recap.id).length, 1);
  assert.equal(streamRecaps[1].id, "2026-11-05-noon-showroom");
  assert.equal(recap.broadcastLabel, "録画開始22:32頃〜 約60分");
  for (const key of ["image", "gallery", "galleryZip", "songs", "singingExcerpts"]) assert.equal(recap[key], undefined);
  assert.ok(recap.highlights.every(h => !h.clip && !h.socialClip && !h.quote && !h.relatedLinks));
  assert.deepEqual(recap.goals, []);
  assert.deepEqual(recap.ranking, []);
  assert.deepEqual(recap.highlights.map(h => h.timestamp), ["0:03:00", "0:10:20", "0:34:40", "0:53:20", "0:57:14"]);
});

test("11/8 night: ASR and timing limits remain explicit and ledger matches", () => {
  for (const text of ["自動文字起こし", "手動聴取・逐語校正は未実施", "約51秒", "連続性は未確認", "曲名は未確認", "掲載承認が済むまで保留"]) assert.ok(recap.transcriptionNote.includes(text));
  assert.match(recap.nextNote, /^配信時点では、翌11月9日6:00〜6:30/);
  assert.doesNotMatch(JSON.stringify(recap), /23662416|drive\.google|\.mkv|\.mp4|\/Users\/|\/workspace\/|live_id/);
  const ledger = JSON.parse(readFileSync(new URL("../docs/RECAP-VERIFICATION-LEDGER.json", import.meta.url), "utf8"));
  const rows = ledger.filter(r => r.id === recap.id);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].originalNote, recap.transcriptionNote);
  assert.deepEqual(rows[0].display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
