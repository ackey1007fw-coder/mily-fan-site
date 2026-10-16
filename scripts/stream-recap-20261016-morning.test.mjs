import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { streamRecap20261016Asa as recap } from "../src/data/streamRecap20261016Asa.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const lab = JSON.parse(read("public/data-lab/data/mily-morning-20261016-aggregate.json"));

test("October 16 has one independent recap before the preserved October 15 and 14 reports", () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(recap.dateLabel, "2026.10.16（金）");
  assert.equal(recap.broadcastLabel, "録画開始6:35頃〜 約56分");
  assert.deepEqual(streamRecaps.slice(0, 6).map(x => x.id), [
    "2026-10-16-morning-showroom", "2026-10-15-night-showroom",
    "2026-10-15-morning-showroom", "2026-10-14-night-showroom",
    "2026-10-14-noon-showroom", "2026-10-14-morning-showroom",
  ]);
  assert.equal(streamRecaps.filter(x => x.id === recap.id).length, 1);
});

test("the article links to existing measurements without duplicating or declaring final counters", () => {
  assert.equal(lab.live_id, 23559940);
  assert.equal(lab.observed_screen.confirmed_final, false);
  assert.equal(lab.recording.complete_coverage_confirmed, false);
  assert.ok(recap.highlights.some(x => x.relatedLinks?.some(link => link.url === "/data-lab/#morning-20261016")));
  const packet = JSON.stringify(recap);
  assert.doesNotMatch(packet, /3,643|3643|\b247\b|\b338\b/);
  assert.match(recap.transcriptionNote, /配信終了時の最終値は未確定/);
  assert.match(recap.transcriptionNote, /完全収録は未確定/);
  assert.match(recap.transcriptionNote, /四次審査集計には加えていません/);
});

test("ASR summaries retain their source limitations and do not invent songs, quotes or exact schedules", () => {
  assert.match(recap.summary, /出会い|セミファイナル/);
  assert.match(recap.transcriptionNote, /全編の手動聴取は行っておらず/);
  assert.match(recap.transcriptionNote, /厳密な同期は未確認/);
  assert.ok(recap.highlights.every(x => x.quote === undefined));
  assert.equal(recap.songs, undefined);
  assert.deepEqual(recap.goals, []);
  assert.match(recap.ranking[0], /^配信中にランキング/);
  assert.match(recap.nextNote, /配信時点では/);
  assert.doesNotMatch(recap.nextNote, /\d{1,2}時/);
  for (const items of [recap.highlights, recap.timeline]) {
    const seconds = items.map(x => x.timestamp.split(":").reduce((a, n) => a * 60 + Number(n), 0));
    assert.deepEqual(seconds, [...seconds].sort((a, b) => a - b));
    assert.ok(seconds.every(n => n < lab.recording.media_duration_seconds));
  }
});

test("the approved real frame is complete, decodable, metadata-free and displayed once", async () => {
  assert.equal(recap.gallery, undefined);
  assert.ok(recap.image);
  const bytes = readFileSync(new URL("../public" + recap.image.src, import.meta.url));
  const meta = await sharp(bytes).metadata();
  assert.equal(meta.width, recap.image.width);
  assert.equal(meta.height, recap.image.height);
  assert.equal(meta.format, "jpeg");
  assert.equal(meta.exif, undefined);
  assert.equal(meta.xmp, undefined);
  await sharp(bytes).raw().toBuffer();
  assert.equal(recap.image.downloadName, recap.image.src.split("/").at(-1));
  assert.match(recap.image.caption, /^0:05:50｜付箋を見せてスクショタイム/);
  assert.equal(meta.width, 640);
  assert.equal(meta.height, 360);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), "936b6c038cdab6fc52533073d2fef9afe20dae1515e1c94d6708b143debdc77e");
});

test("the verification ledger matches the article and excludes private sources and audience records", () => {
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const entry = ledger.find(x => x.id === recap.id);
  assert.equal(entry.originalNote, recap.transcriptionNote);
  assert.equal(entry.source, recap.sourceLabel);
  assert.deepEqual(entry.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
  assert.equal(ledger.filter(x => x.id === recap.id).length, 1);
  assert.match(entry.processingNote, /付箋.*文字|付箋.*表示名/);
  assert.doesNotMatch(recap.transcriptionNote, /画角外|顔の生成|補正/);
  for (const pattern of [/chatgpt\.site/i, /drive\.google/i, /@gmail/i, /\.mkv/i, /viewer[_-]?id/i, /comment[_-]?text/i, /C:\\/i, /https?:\/\//i]) {
    assert.doesNotMatch(JSON.stringify(recap), pattern);
  }
});
