import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { streamRecap20261015Night as recap } from "../src/data/streamRecap20261015Night.ts";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const nightLab = JSON.parse(read("public/data-lab/data/mily-night-20261015-aggregate.json"));

test("October 15 night LIVE STREAM appears exactly once between October 16 and October 15 morning", () => {
  assert.equal(recap.id, "2026-10-15-night-showroom");
  assert.equal(recap.date, "2026-10-15");
  assert.equal(recap.dateLabel, "2026.10.15（木）");
  assert.equal(recap.theme, "夜の四次審査突破と感謝");
  assert.equal(recap.broadcastLabel, "録画開始21:59頃〜 約82分");
  assert.equal(recap.platformLabel, "SHOWROOM");
  assert.deepEqual(streamRecaps.slice(0, 5).map(item => item.id), [
    "2026-10-16-morning-showroom",
    "2026-10-15-night-showroom",
    "2026-10-15-morning-showroom",
    "2026-10-14-night-showroom",
    "2026-10-14-noon-showroom",
  ]);
  assert.equal(streamRecaps.filter(x => x.id === recap.id).length, 1);
});

test("recap summarizes actual ASR topics without inventing lyrics, quotes, rankings or people", () => {
  assert.match(recap.summary, /四次審査|セミファイナル/);
  assert.match(recap.summary, /ラジオ|感謝/);
  assert.equal(recap.highlights.length, 8);
  assert.equal(recap.timeline.length, 12);
  assert.deepEqual(recap.goals, []);
  assert.equal(recap.songs, undefined);
  assert.equal(recap.gallery.length, 2);
  assert.equal(recap.image, recap.gallery[1]);
  assert.ok(recap.highlights.every(h => h.quote === undefined));
  assert.equal(recap.ranking.length, 1);
  assert.match(recap.ranking[0], /^配信中にランキングを読み上げました/);
  assert.match(recap.nextNote, /^配信時点では/);
  assert.match(recap.nextNote, /翌10月16日朝6時半頃/);
  for (const group of [recap.highlights, recap.timeline]) {
    const times = group.map(x => x.timestamp.split(":").reduce((acc, n) => acc * 60 + Number(n), 0));
    assert.deepEqual(times, [...times].sort((a,b)=>a-b));
    assert.ok(times.every(x => x < nightLab.recording.media_duration_seconds));
  }
});

test("night data lab link is exact and capture/online-counter uncertainty is respected", () => {
  assert.equal(nightLab.live_id, 23558451);
  assert.equal(nightLab.observed_screen.stars, 510);
  assert.equal(nightLab.observed_screen.comments, 31);
  assert.equal(nightLab.observed_screen.total_visits, null);
  assert.equal(nightLab.observed_screen.confirmed_final, false);
  assert.equal(nightLab.recording.complete_coverage_confirmed, false);
  assert.ok(recap.highlights.some(h=>h.relatedLinks?.some(link=>link.url==="/data-lab/#night-20261015")));
  assert.ok(recap.highlights.some(h=>h.relatedLinks?.some(link=>link.url==="/activities/live/#recap-2026-10-16-morning-showroom")));
  assert.match(recap.transcriptionNote, /自動文字起こし247処理チャンク/);
  assert.match(recap.transcriptionNote, /全編の手動聴取|全編手動聴取/);
  assert.match(recap.transcriptionNote, /約82分15秒/);
  assert.match(recap.transcriptionNote, /22:03:19のきら星510・コメント31/);
  assert.match(recap.transcriptionNote, /総訪問と配信終了時の数値は未取得/);
  assert.match(recap.transcriptionNote, /四次審査ポイントには加算していません/);
});

test("verification ledger records exactly the recap and protects photos and private source material", () => {
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  assert.deepEqual(ledger.slice(0, 3).map(item => item.id), [
    "2026-10-16-morning-showroom",
    "2026-10-15-night-showroom",
    "2026-10-15-morning-showroom",
  ]);
  const entry = ledger.find(x=>x.id===recap.id);
  assert.ok(entry);
  assert.equal(entry.verifiedAt, "2026-10-16");
  assert.equal(entry.source, recap.sourceLabel);
  assert.equal(entry.originalNote, recap.transcriptionNote);
  assert.deepEqual(entry.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
  assert.equal(ledger.filter(x=>x.id===recap.id).length, 1);
  assert.match(entry.processingNote, /実写真掲載を明示承認/);
  assert.match(recap.transcriptionNote, /実フレーム2枚/);
  const serial = JSON.stringify(recap);
  for (const re of [/chatgpt\.site/i, /drive\.google/i, /@gmail/i, /[A-Z]:\\Users\\/i,
    /viewer[_-]?id/i, /comment[_-]?text/i, /\.mkv/i, /https?:\/\//i]) {
    assert.doesNotMatch(serial, re);
  }
});
