import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1101Morning as recap } from "../src/data/streamRecap1101Morning.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/1 morning: newest card, recording-relative timestamps, no invented end time", () => {
  // The 11/2 noon card and the same-day noon and night cards (later slots) sit above the morning card.
  assert.equal(streamRecaps[3], recap);
  assert.equal(streamRecaps[1].date, "2026-11-01");
  assert.equal(recap.id, "2026-11-01-morning-showroom");
  assert.equal(recap.dateLabel, "2026.11.01（日）");
  assert.equal(recap.broadcastLabel, "6:06頃〜 約30分");
  assert.equal(recap.timestampBasis, undefined);
  assert.match(recap.transcriptionNote, /正式な終了時刻は確認していません/);
});

test("11/1 morning: 11 real stills and one greeting excerpt from this live only", () => {
  assert.equal(recap.gallery.length, 11);
  assert.ok(recap.gallery.includes(recap.image));
  for (const g of recap.gallery) {
    assert.match(g.src, /^\/media\/live\/mily-b243-\d{2}-20261101-morning-[a-z-]+\.jpg$/);
    assert.equal(g.downloadName, g.src.split("/").pop());
    assert.ok(statSync(new URL("../public" + g.src, import.meta.url)).size > 0);
    assert.match(g.alt, /みりぃ/);
  }
  const clips = recap.highlights.filter(h => h.clip);
  assert.equal(clips.length, 1);
  assert.ok(statSync(new URL("../public" + clips[0].clip.src, import.meta.url)).size > 0);
  assert.ok(statSync(new URL("../public" + clips[0].clip.poster, import.meta.url)).size > 0);
});

test("11/1 morning: no viewer names, private paths or unconfirmed songs", () => {
  assert.doesNotMatch(text, /あっきー|アッキー|青猫|あお猫|クニ|二度|にどねー|drive[.]google|C:\\\\Users|live_id|23629786|\.mkv/);
  assert.equal(recap.songs, undefined);
  assert.match(recap.highlights.at(-1).body, /曲名は確認できていません/);
  assert.match(recap.nextNote, /^配信時点では/);
  const ledger = JSON.parse(read("docs/RECAP-VERIFICATION-LEDGER.json"));
  const record = ledger.find(r => r.id === recap.id);
  assert.equal(ledger.filter(r => r.id === recap.id).length, 1);
  assert.equal(record.originalNote, recap.transcriptionNote);
  assert.deepEqual(record.display, recapSourceDisclosure(recap.sourceLabel, recap.transcriptionNote));
});

import { DAILY_STREAM_ENTRIES, groupByBroadcastDate, observationPoints, lastObservedValue } from "../public/data-lab/assets/daily-archive-core.js";
const signal = JSON.parse(read("public/data-lab/data/mily-morning-20261101-aggregate.json"));
const report = read("data-lab/reports/20261101-morning/index.html");
const labIndex = read("data-lab/index.html");
const csv = read("public/data-lab/data/mily-morning-20261101-observations.csv").trim().split("\n");

test("11/1 morning SIGNAL: recovered 195 screen observations, not a final", () => {
  const entries = DAILY_STREAM_ENTRIES.filter(e => e.date === "2026-11-01" && e.slot === "morning");
  assert.equal(entries.length, 1);
  assert.ok(groupByBroadcastDate().some(d => d.date === "2026-11-01"));
  assert.equal(signal.liveId, 23629786);
  assert.equal(signal.observations.length, 195);
  assert.equal(csv.length, 196);
  assert.deepEqual(signal.metrics, { stars: 3397, visits: 293, comments: 265, firstVisits: 5, repeatVisits: 11, newFollows: 1, otherFree: 761, star100People: 31, recommendedCommentPeople: 33 });
  assert.equal(signal.lastValidOnline.atJst, "2026-11-01T06:36:43.974+09:00");
  assert.equal(signal.lastValidOnline.confirmedFinal, false);
  assert.equal(signal.finalServiceValueVerified, false);
  assert.equal(signal.completeCoverageConfirmed, false);
  assert.equal(signal.timingComparisonEligible, false);
  assert.equal(signal.quality.excludedRegressionFlagRows, 28);
  assert.equal(signal.quality.end_confirmed, true);
  assert.equal(lastObservedValue(signal, "stars", signal.dateJst), 3397);
  assert.equal(observationPoints(signal, "stars", signal.dateJst).length, 195);
  assert.equal(observationPoints(signal, "visits", signal.dateJst).length, 173);
  for (const o of signal.observations) assert.equal(Object.keys(o).length, 10);
});

test("11/1 morning SIGNAL: report, lab home and routes stay consistent and anonymous", () => {
  assert.match(report, /最後の画面参考値で、確定合計ではありません/);
  assert.match(report, /06:36:43.974/);
  assert.match(report, /noindex,nofollow,noarchive/);
  assert.ok(labIndex.indexOf('id="morning-20261101"') < labIndex.indexOf('id="noon-20261031"'));
  assert.match(labIndex, /href="#morning-20261101">11\/1 朝/);
  const vite = read("vite.config.ts");
  assert.ok(vite.includes("__DATA_LAB_20261101_MORNING_CANONICAL__"));
  assert.ok(vite.includes('dataLabMorning_20261101: "data-lab/reports/20261101-morning/index.html"'));
  assert.ok(!/https?:\/\//.test(report.replace(/http-equiv="Content-Security-Policy"[^>]*>/g, "")));
  assert.doesNotMatch(report + JSON.stringify(signal), /viewer_count|viewerCount"|drive\.google|C:\\\\Users|\.jsonl|あっきー|アッキー/i);
});
