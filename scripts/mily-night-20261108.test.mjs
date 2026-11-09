import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap20261108Night as recap } from "../src/data/streamRecap20261108Night.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

test("11/8 night: one recap, reviewed stills only; no unreviewed audio or muted substitute", () => {
  assert.equal(streamRecaps.find(r => r.id === recap.id), recap);
  assert.equal(streamRecaps.filter(r => r.id === recap.id).length, 1);
  assert.equal(recap.broadcastLabel, "録画開始22:32頃〜 約60分");
  for (const key of ["songs", "singingExcerpts"]) assert.equal(recap[key], undefined);
  assert.equal(recap.gallery.length, 10);
  assert.equal(recap.image, recap.gallery[8]);
  assert.equal(new Set(recap.gallery.map(image => image.src)).size, 10);
  for (const image of recap.gallery) {
    assert.equal(image.width, 640);
    assert.equal(image.height, 360);
    assert.match(image.alt, /みりぃ/);
    assert.match(image.caption, /^0:\d{2}:\d{2}｜/);
    assert.equal(image.src.split("/").at(-1), image.downloadName);
    assert.ok(existsSync(new URL(`../public${image.src}`, import.meta.url)));
  }
  const clips = recap.highlights.filter(h => h.clip).map(h => h.clip);
  assert.deepEqual(clips.map(c => [c.src.split("/").at(-1), c.durationSeconds]), [
    ["mily-b259-11-20261108-night-photo-call.mp4", 17],
    ["mily-b259-12-20261108-night-closing-thanks.mp4", 22],
  ]);
  for (const clip of clips) {
    assert.equal(clip.width, 640);
    assert.equal(clip.height, 360);
    assert.ok(existsSync(new URL(`../public${clip.src}`, import.meta.url)));
    assert.ok(existsSync(new URL(`../public${clip.poster}`, import.meta.url)));
  }
  assert.equal(existsSync(new URL("../public/media/live-clips/mily-b257-11-20261108-night-cat-paws-muted.mp4", import.meta.url)), false);
  assert.ok(recap.highlights.every(h => !h.socialClip && !h.quote && !h.relatedLinks));
  assert.deepEqual(recap.goals, []);
  assert.deepEqual(recap.ranking, []);
  assert.deepEqual(recap.highlights.map(h => h.timestamp), ["0:03:00", "0:10:20", "0:35:13", "0:53:25", "0:57:25"]);
});

test("11/8 night: ASR and timing limits remain explicit and ledger matches", () => {
  for (const text of ["自動文字起こし", "手動聴取・逐語校正は未実施", "約51秒", "連続性は未確認", "曲名は未確認", "掲載範囲は原音の文字起こしで照合しています"]) assert.ok(recap.transcriptionNote.includes(text));
  assert.match(recap.nextNote, /^配信時点では、翌11月9日6:00〜6:30/);
  assert.doesNotMatch(JSON.stringify(recap), /23662416|drive\.google|\.mkv|\/Users\/|\/workspace\/|live_id/);
  const ledger = JSON.parse(readFileSync(new URL("../docs/RECAP-VERIFICATION-LEDGER.json", import.meta.url), "utf8"));
  const rows = ledger.filter(r => r.id === recap.id);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].originalNote, recap.transcriptionNote);
  assert.deepEqual(rows[0].display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
