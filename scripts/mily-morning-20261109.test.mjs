import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1109Morning as recap } from "../src/data/streamRecap1109Morning.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

test("11/9 morning: one independent text recap in descending date order", () => {
  const index = streamRecaps.findIndex(r => r.id === recap.id);
  assert.ok(index >= 0);
  assert.equal(streamRecaps[index + 1].id, "2026-11-08-night-showroom");
  assert.equal(streamRecaps.filter(r => r.id === recap.id).length, 1);
  assert.equal(recap.broadcastLabel, "録画開始6:00頃〜 約36分");
  for (const key of ["image", "gallery", "galleryZip", "songs", "singingExcerpts"]) assert.equal(recap[key], undefined);
  assert.ok(recap.highlights.every(h => !h.clip && !h.socialClip && !h.quote && !h.relatedLinks));
  assert.deepEqual(recap.goals, []);
  assert.deepEqual(recap.ranking, []);
  assert.deepEqual(recap.highlights.map(h => h.timestamp), ["0:15:12", "0:19:34", "0:33:35", "0:35:45"]);
});

test("11/9 morning: uncertain timing and ASR scope are explicit; ledger matches", () => {
  for (const text of ["自動文字起こし", "手動聴取・逐語校正は未実施", "約49秒", "連続性は未確認", "曲名は未確認", "検品が完了するまで保留"]) assert.ok(recap.transcriptionNote.includes(text));
  assert.match(recap.nextNote, /^配信時点では、同日夜の配信時刻は未定/);
  assert.doesNotMatch(JSON.stringify(recap), /23663446|drive\.google|\.mkv|\.mp4|\/Users\/|\/workspace\/|live_id/);
  const ledger = JSON.parse(readFileSync(new URL("../docs/RECAP-VERIFICATION-LEDGER.json", import.meta.url), "utf8"));
  const rows = ledger.filter(r => r.id === recap.id);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].originalNote, recap.transcriptionNote);
  assert.deepEqual(rows[0].display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
