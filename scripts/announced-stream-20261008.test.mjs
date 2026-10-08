import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fourthRoundStreamSchedule, OCTOBER_8_SCHEDULE_X_URL } from '../src/data/fourthRoundStreamSchedule.ts';
import { upcomingSlots, streamSchedule } from '../src/data/streamSchedule.ts';

const today = fourthRoundStreamSchedule.filter(slot => slot.date === '2026-10-08');

test('October 8 slots preserve only the two requested X-announced windows', () => {
  assert.equal(OCTOBER_8_SCHEDULE_X_URL, 'https://x.com/Mily_chan36/status/2107858042541023674');
  assert.deepEqual(today.map(slot => [slot.time, slot.endTime]), [['14:40', '15:20'], ['21:30', '22:10']]);
  for (const slot of today) {
    assert.match(slot.note, /本人X告知/);
    assert.match(slot.note, /1\.2倍DAY/);
    assert.equal(streamSchedule.filter(item => item.date === slot.date && item.time === slot.time).length, 1);
  }
});

test('October 8 slots expire exactly at their announced JST ends', () => {
  for (const [time, expected] of [
    ['12:57:00', ['14:40', '21:30']],
    ['15:19:59', ['14:40', '21:30']],
    ['15:20:00', ['21:30']],
    ['22:09:59', ['21:30']],
    ['22:10:00', []],
  ]) {
    assert.deepEqual(upcomingSlots(today, [], Date.parse(`2026-10-08T${time}+09:00`)).map(slot => slot.time), expected);
  }
});

test('October 8 NEWS has one source-linked announcement and no stream-result assertion', async () => {
  const { news, sortNewsByDateDesc } = await import('../src/data/news.ts');
  const items = news.filter(item => item.source === OCTOBER_8_SCHEDULE_X_URL);
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.date, '2026-10-08');
  assert.equal(sortNewsByDateDesc(news.filter(entry => entry.date < item.date || entry.id === item.id))[0], item);
  assert.match(item.body, /14:40〜15:20/);
  assert.match(item.body, /21:30〜22:10/);
  assert.match(item.body, /告知予定/);
  assert.match(item.body, /配信記録ではありません/);
  assert.doesNotMatch(item.body, /5:50|6:30|配信しました|配信中です/);
  assert.equal(item.relatedUrl, '/support/');
  assert.equal(item.media, undefined);
  const { verifyNews } = await import('./content-invariants.mjs');
  assert.deepEqual(verifyNews(items), []);
});
