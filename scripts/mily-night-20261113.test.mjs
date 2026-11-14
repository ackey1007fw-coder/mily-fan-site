import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap20261113Night as recap } from "../src/data/streamRecap20261113Night.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

test("11/13 night slot 1: one recap, reviewed stills and talk-only clips with original audio", () => {
  assert.equal(streamRecaps.find(r => r.id === recap.id), recap);
  assert.equal(streamRecaps.filter(r => r.id === recap.id).length, 1);
  assert.equal(streamRecaps[1], recap);
  assert.equal(recap.broadcastLabel, "20:45頃〜 約64分");
  for (const key of ["songs", "singingExcerpts"]) assert.equal(recap[key], undefined);
  assert.equal(recap.gallery.length, 10);
  assert.equal(recap.image, recap.gallery[8]);
  assert.equal(new Set(recap.gallery.map(image => image.src)).size, 10);
  for (const image of recap.gallery) {
    assert.equal(image.width, 640);
    assert.equal(image.height, 360);
    assert.match(image.alt, /みりぃ/);
    assert.match(image.caption, /^\d:\d{2}:\d{2}｜/);
    assert.equal(image.src.split("/").at(-1), image.downloadName);
    assert.ok(existsSync(new URL(`../public${image.src}`, import.meta.url)));
  }
  const clips = recap.highlights.filter(h => h.clip).map(h => h.clip);
  assert.deepEqual(clips.map(c => [c.src.split("/").at(-1), c.durationSeconds]), [
    ["mily-b263-11-20261113-night-more-power-left.mp4", 21.9],
    ["mily-b263-12-20261113-night-hope-remains.mp4", 13.3],
  ]);
  for (const clip of clips) {
    assert.equal(clip.width, 640);
    assert.equal(clip.height, 360);
    assert.ok(existsSync(new URL(`../public${clip.src}`, import.meta.url)));
    assert.ok(existsSync(new URL(`../public${clip.poster}`, import.meta.url)));
  }
  assert.ok(recap.highlights.every(h => !h.socialClip && !h.quote && !h.relatedLinks));
  assert.deepEqual(recap.goals, []);
  assert.deepEqual(recap.ranking, []);
  assert.deepEqual(recap.highlights.map(h => h.timestamp), ["0:00:35", "0:20:00", "0:39:00", "0:45:30", "0:46:50", "0:58:56", "0:59:59", "1:03:00"]);
});

test("11/13 night slot 1: limits stay explicit, no internal identifiers, ledger matches", () => {
  for (const text of ["自動文字起こし", "真っ黒", "63分31秒", "約70秒異なります", "コメント記録の時計時刻から換算した目安", "ルーム表示の値で、確定値ではありません"]) assert.ok(recap.transcriptionNote.includes(text));
  assert.ok(recap.nextNote.includes("ファイナル審査（11月26日〜12月6日）"));
  assert.ok(recap.nextNote.includes("12月12日の表彰式"));
  assert.doesNotMatch(JSON.stringify(recap), /drive\.google|\.mkv|\/Users\/|\/workspace\/|live_id/);
  const ledger = JSON.parse(readFileSync(new URL("../docs/RECAP-VERIFICATION-LEDGER.json", import.meta.url), "utf8"));
  const rows = ledger.filter(r => r.id === recap.id);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].originalNote, recap.transcriptionNote);
  assert.deepEqual(rows[0].display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
