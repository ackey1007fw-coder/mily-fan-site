import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1109Night as recap } from "../src/data/streamRecap1109Night.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

test("11/9 night: one recap, reviewed stills and talk-only clips with original audio", () => {
  assert.equal(streamRecaps.find(r => r.id === recap.id), recap);
  assert.equal(streamRecaps.filter(r => r.id === recap.id).length, 1);
  assert.equal(streamRecaps[0], recap);
  assert.equal(recap.broadcastLabel, "録画開始22:30頃〜 約71分");
  for (const key of ["songs", "singingExcerpts"]) assert.equal(recap[key], undefined);
  assert.equal(recap.gallery.length, 10);
  assert.equal(recap.image, recap.gallery[9]);
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
    ["mily-b260-11-20261109-night-emotion-talk.mp4", 26.9],
    ["mily-b260-12-20261109-night-bonzu-origin.mp4", 22.1],
    ["mily-b260-13-20261109-night-goodbye.mp4", 19.5],
    ["mily-b260-14-20261109-night-last-goodbye.mp4", 13.3],
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
  assert.deepEqual(recap.highlights.map(h => h.timestamp), ["0:02:45", "0:07:07", "0:20:47", "0:34:27", "0:46:06", "0:59:27", "1:10:35", "1:11:04"]);
});

test("11/9 night: ASR limits stay explicit, no internal identifiers, ledger matches", () => {
  for (const text of ["自動文字起こし", "手動聴取・逐語校正は未実施", "71分16.914秒", "約66秒異なります", "全区間の連続性は未確認", "短尺は原音付きで、歌唱のない雑談部分"]) assert.ok(recap.transcriptionNote.includes(text));
  assert.ok(recap.nextNote.includes("翌朝6時から6時半に配信すると案内していました"));
  assert.doesNotMatch(JSON.stringify(recap), /drive\.google|\.mkv|\/Users\/|\/workspace\/|live_id/);
  const ledger = JSON.parse(readFileSync(new URL("../docs/RECAP-VERIFICATION-LEDGER.json", import.meta.url), "utf8"));
  const rows = ledger.filter(r => r.id === recap.id);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].originalNote, recap.transcriptionNote);
  assert.deepEqual(rows[0].display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
