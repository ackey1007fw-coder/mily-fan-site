import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { lastObservedValue, observationPoints, DAILY_STREAM_ENTRIES } from '../public/data-lab/assets/daily-archive-core.js';
const read = p => readFileSync(p, 'utf8');
for (const [slot, day, live, values, progress] of [
  ['night','20261025',23602065,[5,8,239,670,0,3022,251,29,25],'2026-10-26T01:14:21.167+09:00'],
  ['night','20261026',23605926,[3,2,110,629,0,2720,121,26,19],'2026-10-26T23:58:45.277+09:00'],
  ['morning','20261027',23607190,[9,16,354,305,0,2560,110,23,34],'2026-10-27T06:35:02.975+09:00'],
]) test(`${day} ${slot}: third-party snapshot preserves nine fields and time semantics`, () => {
  const file = `mily-${slot}-${day}-aggregate.json`;
  const d = JSON.parse(read(`public/data-lab/data/${file}`));
  const s = d.referenceSnapshot;
  assert.equal(d.liveId, live);
  assert.deepEqual(Object.values(s.metrics), values);
  assert.equal(s.lastScreenProgressAtJst, progress);
  assert.ok(Date.parse(s.savedObservedAtJst) > Date.parse(progress));
  assert.equal(s.verified_final, false);
  assert.equal(d.finalServiceValueVerified, false);
  assert.equal(d.timingComparisonEligible, false);
  assert.deepEqual(d.observations, []);
  assert.match(s.note, /第三者SHOWROOM Emulator/);
  assert.match(s.note, /確定終値ではありません/);
  assert.equal(d.asrSupplement.manualAudioListeningVerified, false);
  assert.equal(d.asrSupplement.ptsSyncVerified, false);
  for (const k of ['stars','visits','comments']) {
    assert.equal(lastObservedValue(d,k,d.dateJst),s.metrics[k]);
    assert.deepEqual(observationPoints(d,k,d.dateJst),[]);
  }
  assert.equal(DAILY_STREAM_ENTRIES.filter(e=>e.file===file).length,1);
  const html=read(`data-lab/reports/${day}-${slot}/index.html`);
  assert.match(html,/原音の手動聴取・逐語校正/);
  assert.match(html,/映像PTSの同期/);
  assert.match(html,/noindex,nofollow,noarchive/);
  assert.doesNotMatch(html+JSON.stringify(d),/drive\.google|\.jsonl|C:\\Users|<video|<audio/);
});
test('thank-you report retains owner-authorized thanks and exact small real photo',()=>{
  const h=read('data-lab/reports/20261025-night/index.html');
  for(const phrase of ['感謝を形にして届ける準備','コメントと日々の訪問を覚えている','あっきーへのお礼','目標を言葉に','長い夜の締め']) assert.ok(h.includes(phrase));
  const bytes=readFileSync('public/media/live/mily-b239-01-night-thanks-face-safe.jpg');
  assert.equal(bytes.length,3000);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),'d1d7ab9bfaeff6694ae1bf4da681275357b4f787e3ba93c3052b373761ad9cee');
  assert.match(h,/width="130" height="200"/);
  const d=JSON.parse(read('public/data-lab/data/mily-night-20261026-aggregate.json'));
  assert.equal(d.partialViewerMemo.displayNearMemoEnd,435);
  assert.equal(d.partialViewerMemo.comparableToVisitsMetric,false);
  assert.equal(d.referenceSnapshot.metrics.visits,110);
  assert.equal(d.asrSupplement.recordsReadByReporter,1039);
});
