import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { streamRecap20261029Night as recap } from '../src/data/streamRecap20261029Night.ts';
import { streamRecaps } from '../src/data/streamRecaps.ts';
import { DAILY_STREAM_ENTRIES, observationPoints } from '../public/data-lab/assets/daily-archive-core.js';
import { recapSourceDisclosure } from '../src/lib/recapSourceDisclosure.ts';
const read = p => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const data = JSON.parse(read('public/data-lab/data/mily-night-20261029-aggregate.json'));
const html = read('data-lab/reports/20261029-night/index.html');
const ledger = JSON.parse(read('docs/RECAP-VERIFICATION-LEDGER.json'));

test('night episode is unique and separate from the noon episode', () => {
  assert.equal(streamRecaps[0], recap);
  assert.equal(streamRecaps.filter(x => x.id === recap.id).length, 1);
  assert.equal(streamRecaps[1].id, '2026-10-29-noon-showroom');
  assert.equal(data.liveId, 23619613);
  assert.equal(data.dateJst, '2026-10-29');
  assert.equal(data.session, 'night');
});
test('206 unique ordered UI times, not stale save times or repeated sums', () => {
  assert.equal(data.observations.length, 206);
  assert.equal(new Set(data.observations.map(x => x.atJst)).size, 206);
  const first = data.observations[0], last = data.observations.at(-1);
  assert.equal(first.atJst, '2026-10-29T23:02:28.288+09:00');
  assert.equal(last.atJst, '2026-10-29T23:57:09.074+09:00');
  assert.equal(last.stars, 3984);
  for (let i = 1; i < data.observations.length; i++) {
    assert.ok(Date.parse(data.observations[i].atJst) > Date.parse(data.observations[i-1].atJst));
    for (const key of ['stars', 'otherFree', 'star100People']) assert.ok(data.observations[i][key] >= data.observations[i-1][key]);
  }
});
test('unusable visits, comments and follows never become performance zeros', () => {
  for (const key of ['visits', 'comments', 'newFollows']) {
    assert.equal(data.metrics[key], null);
    assert.equal(data.lastValidOnline[key], null);
    assert.ok(data.unusableMetrics[key]);
    assert.ok(data.observations.every(x => !(key in x)));
  }
  assert.equal(observationPoints(data, 'visits', data.dateJst).length, 0);
  assert.equal(observationPoints(data, 'comments', data.dateJst).length, 0);
  assert.equal(observationPoints(data, 'stars', data.dateJst).length, 206);
});
test('all six usable metrics remain qualified screen references', () => {
  assert.equal(data.metrics.stars, 3984);
  assert.equal(data.metrics.otherFree, 2320);
  assert.equal(data.metrics.star100People, 38);
  assert.equal(data.metrics.firstVisits, 9);
  assert.equal(data.metrics.repeatVisits, 7);
  assert.equal(data.metrics.recommendedCommentPeople, 19);
  assert.equal(data.finalServiceValueVerified, false);
  assert.equal(data.timingComparisonEligible, false);
  assert.equal(data.quality.rawComplete, false);
});
test('13 actual sampled times and 12 differences are exact and unequal in duration', () => {
  assert.equal(data.selectedObservations.length, 13);
  assert.equal(data.sampleIntervals.length, 12);
  for (let i=0; i<12; i++) {
    const a=data.selectedObservations[i],b=data.selectedObservations[i+1],d=data.sampleIntervals[i];
    assert.equal(d.starsIncrease, b.stars-a.stars);
    assert.equal(d.seconds, (Date.parse(b.atJst)-Date.parse(a.atJst))/1000);
  }
  assert.deepEqual(data.sampleIntervals.map(x=>x.starsIncrease), [600,700,200,300,690,313,190,280,20,490,100,101]);
  assert.ok(new Set(data.sampleIntervals.map(x=>x.seconds)).size > 1);
});
test('every chart point and increment agrees with source data; no interpolating paths', () => {
  assert.equal((html.match(/<svg\b/g)||[]).length,4);
  assert.doesNotMatch(html, /<(?:polyline|path)\b/);
  for(const key of ['stars','star100People','otherFree']) {
    assert.equal((html.match(new RegExp(`data-series="${key}"`,'g'))||[]).length,206);
    for(const p of data.observations) assert.ok(html.includes(`data-series="${key}" data-at="${p.atJst}" data-value="${p[key]}"`));
  }
  assert.equal((html.match(/data-increase=/g)||[]).length,12);
});
test('freshness policy and pipeline quantities are separately recorded', () => {
  const q=data.quality;
  assert.equal(q.numericTimelineRows,811);
  assert.equal(q.freshRows+q.staleRowsExcluded,811);
  assert.equal(q.freshRows-q.duplicateProgressRowsNotSummed,206);
  assert.equal(q.freshnessThresholdSeconds,30);
  assert.equal(q.collectorReceived,2407);
  assert.equal(q.collectorSaved,2407);
  assert.equal(q.domDiscarded,1878);
  assert.equal(q.uiProgressIntervalsOverThirtySeconds,30);
  assert.equal(q.maxUiProgressIntervalSeconds,168.159);
  assert.equal(q.continuousRecoveryVerified,false);
  assert.match(q.intervalCaveat,/通信断/);
});
test('anonymous CSV is lossless to the public observations and has no names', () => {
  const lines=read('public/data-lab/data/mily-night-20261029-observations.csv').trim().split(/\r?\n/);
  const header=lines.shift().split(',');
  assert.deepEqual(header,['atJst','stars','otherFree','star100People','firstVisits','repeatVisits','recommendedCommentPeople']);
  assert.equal(lines.length,206);
  lines.forEach((line,i)=>assert.deepEqual(line.split(','),header.map(k=>String(data.observations[i][k]))));
});
test('LIVE source basis and next-day midnight are explicit; no unreviewed assets or quotes', () => {
  assert.equal(recap.timestampBasis,'asr-clock');
  assert.match(recap.transcriptionNote,/翌10月30日/);
  assert.match(recap.transcriptionNote,/冒頭・終盤/);
  assert.match(recap.transcriptionNote,/未確認/);
  assert.equal(recap.image,undefined);
  assert.equal(recap.gallery,undefined);
  assert.equal(recap.songs,undefined);
  assert.ok(recap.highlights.every(h=>!h.clip&&!h.quote));
  assert.equal(data.recap.publishedStills,0);
  assert.equal(data.recap.publishedTalkClips,0);
  const item=ledger.find(x=>x.id===recap.id);
  assert.equal(item.originalNote,recap.transcriptionNote);
  assert.deepEqual(item.display,recapSourceDisclosure(recap.sourceLabel,recap.transcriptionNote));
});
test('daily registry, fallback, canonical and Vite build input reach this report', () => {
  const entry=DAILY_STREAM_ENTRIES.find(x=>x.date==='2026-10-29'&&x.slot==='night');
  assert.equal(entry.report,'/data-lab/reports/20261029-night/');
  assert.equal(DAILY_STREAM_ENTRIES.filter(x=>x.date==='2026-10-29').length,2);
  assert.match(read('data-lab/index.html'),/id="night-20261029"/);
  assert.match(read('vite.config.ts'),/dataLabNight20261029: "data-lab\/reports\/20261029-night\/index.html"/);
  assert.match(read('vite.config.ts'),/__DATA_LAB_20261029_NIGHT_CANONICAL__/);
  assert.match(html,/noindex,nofollow,noarchive/);
  assert.equal((html.match(/<svg[^>]+role="img"/g)||[]).length,4);
});
test('public surfaces do not contain private endpoints, storage paths or raw viewer identities', () => {
  const text=JSON.stringify(data)+html+read('src/data/streamRecap20261029Night.ts');
  assert.doesNotMatch(text,/C:\\Users|AppData|MilyPrivateCollection|slack\.com|app\.notion\.com|delivery_token|writer_pid|viewer_name|transcript\.jsonl|\.mkv/);
});

test('night recap satisfies shared presentation limits without inventing a midnight offset', () => {
  assert.ok(recap.theme.startsWith('夜'));
  assert.ok(recap.theme.length <= 16);
  assert.ok(recap.summary.length <= 140);
  assert.match(recap.broadcastLabel, /^録画開始23:02頃〜 約59分$/);
  for (const h of recap.highlights) {
    assert.match(h.timestamp, /^(?:[01]?\d|2[0-3]):[0-5]\d頃$/);
    assert.ok(h.title.length <= 20);
    assert.ok(h.body.length <= 100);
  }
  assert.match(recap.transcriptionNote, /映像との同期や正式な配信開始・終了時刻は確認していません/);
});
