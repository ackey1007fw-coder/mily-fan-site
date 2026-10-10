import assert from 'node:assert/strict';
import { test } from 'node:test';
import { october11StreamSchedule, OCTOBER_11_SCHEDULE_X_URL } from '../src/data/fourthRoundStreamSchedule.ts';
import { upcomingSlots, streamSchedule } from '../src/data/streamSchedule.ts';
import { toStreamScheduleView } from '../src/lib/useStreamSchedule.ts';
import { withShowroomNext } from '../src/lib/showroomSchedule.ts';
import { withConfirmedAnnouncedEndTime } from '../src/lib/announcedStreamDetails.ts';
import { nextSupportEventBoundary } from '../src/lib/useSupportEventClock.ts';
import { news, sortNewsByDateDesc } from '../src/data/news.ts';
import { resolveNewsLinks } from '../src/lib/newsLinks.ts';
import { verifyNews } from './content-invariants.mjs';

const at = time => Date.parse(`2026-10-11T${time}+09:00`);
const roomUrl = 'https://www.showroom-live.com/r/circle2026_0734';

test('October 11 announced windows expire at their JST ends and retain planned starts', () => {
  assert.deepEqual(october11StreamSchedule.map(s => [s.time, s.endTime]), [['05:30', '06:30'], ['21:00', '22:00']]);
  for (const [time, expected] of [['05:29:59', ['05:30', '21:00']], ['06:29:59', ['05:30', '21:00']], ['06:30:00', ['21:00']], ['07:04:23', ['21:00']], ['21:59:59', ['21:00']], ['22:00:00', []]]) {
    assert.deepEqual(upcomingSlots(october11StreamSchedule, [], at(time)).map(s => s.time), expected);
  }
  for (const slot of october11StreamSchedule) assert.equal(streamSchedule.filter(s => s.date === slot.date && s.time === slot.time).length, 1);
  assert.equal(nextSupportEventBoundary(at('06:29:59')), at('06:30:00'));
  assert.equal(nextSupportEventBoundary(at('21:59:59')), at('22:00:00'));
});

test('matching official and SHOWROOM next starts gain the sourced end; deleted or changed starts do not revive', () => {
  const now = at('07:04:23');
  const fetched = { availability: 'ok', roomUrl, slots: [{ date: '2026-10-11', time: '05:30' }, { date: '2026-10-11', time: '21:00' }] };
  const view = toStreamScheduleView(fetched, streamSchedule, now);
  assert.deepEqual(view.slots.map(s => [s.time, s.endTime]), [['21:00', '22:00']]);
  assert.equal(fetched.slots[1].endTime, undefined, 'API input is immutable');
  const live = { state: 'offline', roomUrl, startedAt: null, observedAt: new Date(now).toISOString(), next: { state: 'scheduled', at: '2026-10-11T12:00:00.000Z' } };
  assert.equal(withShowroomNext(view, live, now).slots[0].endTime, '22:00');
  assert.equal(toStreamScheduleView(fetched, streamSchedule, at('22:00:00')).slots.length, 0);
  assert.deepEqual(toStreamScheduleView({ ...fetched, slots: [] }, streamSchedule, now).slots, []);
  const changed = { date: '2026-10-11', time: '21:30' };
  assert.equal(withConfirmedAnnouncedEndTime(changed), changed);
  assert.deepEqual(toStreamScheduleView({ ...fetched, slots: [changed] }, streamSchedule, now).slots, [changed]);
  const updatedEnd = { date: '2026-10-11', time: '21:00', endTime: '21:45' };
  assert.equal(withConfirmedAnnouncedEndTime(updatedEnd), updatedEnd);
  assert.equal(withShowroomNext(view, { ...live, next: { state: 'scheduled', at: '2026-10-11T12:30:00.000Z' } }, now).slots[0].endTime, undefined);
});

test('October 11 NEWS uniquely links the supplied X and Support with no actual-start claim', () => {
  assert.equal(OCTOBER_11_SCHEDULE_X_URL, 'https://x.com/Mily_chan36/status/2108935333199188393');
  const items = news.filter(n => n.source === OCTOBER_11_SCHEDULE_X_URL);
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.dateBasis, 'confirmed-on');
  assert.equal(sortNewsByDateDesc(news)[0], item);
  assert.match(item.body, /朝5:30〜6:30/);
  assert.match(item.body, /夜21:00〜22:00/);
  assert.match(item.body, /配信記録ではありません/);
  assert.doesNotMatch(item.body, /5:34|配信しました|配信中です/);
  assert.equal(resolveNewsLinks(item, at('07:04:23')).cta.url, '/support/');
  assert.deepEqual(verifyNews(items), []);
});
