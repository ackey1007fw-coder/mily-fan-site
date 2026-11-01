import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { streamRecaps } from "../src/data/streamRecaps.ts";
import { streamRecap1101Morning as recap } from "../src/data/streamRecap1101Morning.ts";
import { recapSourceDisclosure } from "../src/lib/recapSourceDisclosure.ts";
const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const text = JSON.stringify(recap);

test("11/1 morning: newest card, recording-relative timestamps, no invented end time", () => {
  // The same-day noon card (later slot) sits above the morning card.
  assert.equal(streamRecaps[1], recap);
  assert.equal(streamRecaps[0].date, "2026-11-01");
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

test("11/1 morning SIGNAL: newest separate entry with 21 partial observations, not a final", () => {
  const entries = DAILY_STREAM_ENTRIES.filter(e => e.date === "2026-11-01" && e.slot === "morning");
  assert.equal(entries.length, 1);
  assert.ok(groupByBroadcastDate().some(d => d.date === "2026-11-01"));
  assert.equal(signal.liveId, 23629786);
  assert.equal(signal.observations.length, 21);
  assert.equal(csv.length, 22);
  assert.deepEqual(signal.metrics, { stars: 2453, visits: 121, comments: 143, firstVisits: 2, repeatVisits: 2, newFollows: 0, otherFree: 711, star100People: 22, recommendedCommentPeople: 16 });
  assert.equal(signal.lastValidOnline.atJst, "2026-11-01T06:21:58+09:00");
  assert.equal(signal.lastValidOnline.confirmedFinal, false);
  assert.equal(signal.finalServiceValueVerified, false);
  assert.equal(signal.completeCoverageConfirmed, false);
  assert.equal(signal.timingComparisonEligible, false);
  assert.equal(signal.quality.gaps.length, 3);
  assert.equal(lastObservedValue(signal, "stars", signal.dateJst), 2453);
  assert.equal(observationPoints(signal, "stars", signal.dateJst).length, 21);
  for (const o of signal.observations) assert.equal(Object.keys(o).length, 10);
});

test("11/1 morning SIGNAL: report, lab home and routes stay consistent and anonymous", () => {
  assert.match(report, /途中の参考値で、確定合計ではありません/);
  assert.match(report, /6:21:58以降/);
  assert.match(report, /noindex,nofollow,noarchive/);
  assert.ok(labIndex.indexOf('id="morning-20261101"') < labIndex.indexOf('id="noon-20261031"'));
  assert.match(labIndex, /href="#morning-20261101">11\/1 朝/);
  const vite = read("vite.config.ts");
  assert.ok(vite.includes("__DATA_LAB_20261101_MORNING_CANONICAL__"));
  assert.ok(vite.includes('dataLabMorning_20261101: "data-lab/reports/20261101-morning/index.html"'));
  assert.ok(!/https?:\/\//.test(report.replace(/http-equiv="Content-Security-Policy"[^>]*>/g, "")));
  assert.doesNotMatch(report + JSON.stringify(signal), /viewer_count|viewerCount"|drive\.google|C:\\\\Users|\.jsonl|あっきー|アッキー/i);
});
