import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1109Morning as recap } from "../src/data/streamRecap1109Morning.ts";
import { buildRankingNote } from "../src/data/streamRecapRules.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

test("11/9 morning: one recap, reviewed stills and talk-only clips with original audio", () => {
  assert.equal(streamRecaps.find(r => r.id === recap.id), recap);
  assert.equal(streamRecaps.filter(r => r.id === recap.id).length, 1);
  assert.equal(recap.broadcastLabel, "録画開始6:00頃〜 約36分");
  for (const key of ["songs", "singingExcerpts"]) assert.equal(recap[key], undefined);
  assert.equal(recap.gallery.length, 10);
  assert.equal(recap.image, recap.gallery[9]);
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
    ["mily-b258-11-20261109-morning-dream-talk.mp4", 12],
    ["mily-b258-12-20261109-morning-final-hopes.mp4", 26],
    ["mily-b258-13-20261109-morning-closing-talk.mp4", 22],
  ]);
  for (const clip of clips) {
    assert.equal(clip.width, 640);
    assert.equal(clip.height, 360);
    assert.ok(existsSync(new URL(`../public${clip.src}`, import.meta.url)));
    assert.ok(existsSync(new URL(`../public${clip.poster}`, import.meta.url)));
  }
  assert.ok(recap.highlights.every(h => !h.socialClip && !h.quote && !h.relatedLinks));
  assert.deepEqual(recap.goals, []);
  assert.deepEqual(recap.ranking, [buildRankingNote(9, 1)]);
  assert.deepEqual(recap.highlights.map(h => h.timestamp), ["0:03:03", "0:08:06", "0:13:00", "0:19:14", "0:21:36", "0:22:06", "0:35:45"]);
});

test("11/9 morning: ASR limits stay explicit, no viewer names, ledger matches", () => {
  for (const text of ["自動文字起こし", "手動聴取・逐語校正は未実施", "約36分", "短尺は原音付きで、歌唱のない雑談部分"]) assert.ok(recap.transcriptionNote.includes(text));
  assert.match(recap.nextNote, /^配信時点では、次回の配信は未定で/);
  assert.doesNotMatch(JSON.stringify(recap), /23629|drive\.google|\.mkv|\/Users\/|\/workspace\/|live_id|チャンキー|ラッキーセブ|キサラギ|カチオ|ニードーネン|こぶとぱぱたん|マツノ|トクゾー|やすぴー/);
  const ledger = JSON.parse(readFileSync(new URL("../docs/RECAP-VERIFICATION-LEDGER.json", import.meta.url), "utf8"));
  const rows = ledger.filter(r => r.id === recap.id);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].originalNote, recap.transcriptionNote);
  assert.deepEqual(rows[0].display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});
