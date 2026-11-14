import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1113Night2 as recap } from "../src/data/streamRecap1113Night2.ts";
import { streamRecap20261113Night as slot1 } from "../src/data/streamRecap20261113Night.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

test("11/13 night slot 2: one recap ahead of slot 1, reviewed stills, no songs section", () => {
  assert.equal(streamRecaps.find(r => r.id === recap.id), recap);
  assert.equal(streamRecaps.filter(r => r.id === recap.id).length, 1);
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps[1], slot1);
  assert.equal(recap.broadcastLabel, "22:01頃〜 約82分");
  for (const key of ["songs", "singingExcerpts"]) assert.equal(recap[key], undefined);
  assert.equal(recap.gallery.length, 10);
  assert.equal(recap.image, recap.gallery[5]);
  assert.equal(new Set(recap.gallery.map(image => image.src)).size, 10);
  for (const image of recap.gallery) {
    assert.equal(image.width, 640);
    assert.equal(image.height, 360);
    assert.match(image.alt, /みりぃ/);
    assert.match(image.caption, /^\d:\d{2}:\d{2}｜/);
    assert.equal(image.src.split("/").at(-1), image.downloadName);
    assert.ok(existsSync(new URL(`../public${image.src}`, import.meta.url)));
  }
  assert.ok(existsSync(new URL(`../public${recap.galleryZip.src}`, import.meta.url)));
  const clips = recap.highlights.filter(h => h.clip);
  assert.equal(clips.length, 2);
  assert.deepEqual(clips.map(c => [c.clip.src.split("/").at(-1), c.clip.durationSeconds]), [
    ["mily-b264-11-20261113-night2-motto.mp4", 23.7],
    ["mily-b264-12-20261113-night2-gift-replies.mp4", 18.5],
  ]);
  for (const h of clips) {
    assert.equal(h.clip.width, 640);
    assert.equal(h.clip.height, 360);
    assert.ok(existsSync(new URL(`../public${h.clip.src}`, import.meta.url)));
    assert.ok(existsSync(new URL(`../public${h.clip.poster}`, import.meta.url)));
  }
  assert.ok(recap.highlights.every(h => !h.socialClip && !h.quote && !h.relatedLinks));
  assert.deepEqual(recap.goals, []);
  assert.equal(recap.ranking.length, 1);
  assert.ok(recap.ranking[0].includes("13位から1位まで"));
  assert.ok(recap.ranking[0].includes("ランキングを読み上げました"));
  assert.deepEqual(recap.highlights.map(h => h.timestamp), ["0:00:30", "0:14:30", "0:20:30", "0:38:15", "0:44:42", "0:57:22", "1:00:15", "1:14:15"]);
});

test("11/13 night slot 2: limits stay explicit, no internal identifiers, ledger matches", () => {
  for (const text of ["自動文字起こし", "82分03秒", "22時24分で停止", "確定値ではありません", "途中まで歌った場面で"]) assert.ok(recap.transcriptionNote.includes(text));
  assert.ok(recap.nextNote.includes("翌朝4時30分"));
  assert.ok(recap.nextNote.includes("5時30分"));
  assert.doesNotMatch(JSON.stringify(recap), /drive\.google|\.mkv|\/Users\/|\/workspace\/|live_id/);
  const ledger = JSON.parse(readFileSync(new URL("../docs/RECAP-VERIFICATION-LEDGER.json", import.meta.url), "utf8"));
  const rows = ledger.filter(r => r.id === recap.id);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].originalNote, recap.transcriptionNote);
  assert.deepEqual(rows[0].display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
