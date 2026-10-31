import assert from 'node:assert/strict';
import { test } from 'node:test';
import { upcomingOct31Slots, withOct31Plan } from '../src/lib/oct31Plan.ts';
import { nextSupportEventBoundary } from '../src/lib/useSupportEventClock.ts';
import { news } from '../src/data/news.ts';
import { adaptStreamSlots } from '../src/lib/supportCalendar.ts';
const at = t => Date.parse(`2026-10-31T${t}:00+09:00`);

test('the canceled early slot never returns and each announced slot expires at its confirmed end', () => {
  assert.deepEqual(upcomingOct31Slots(at('05:31')), []);
  assert.deepEqual(upcomingOct31Slots(at('05:32')).map(s => s.time), ['07:00','14:45','21:00']);
  assert.deepEqual(upcomingOct31Slots(at('07:30')).map(s => s.time), ['14:45','21:00']);
  assert.deepEqual(upcomingOct31Slots(at('15:15')).map(s => s.time), ['21:00']);
  assert.deepEqual(upcomingOct31Slots(at('21:50')), []);
  assert.equal(nextSupportEventBoundary(at('15:14')), at('15:15'));
});

test('calendar keeps the noon announcement even when SHOWROOM only registers night, without duplicate night', () => {
  const calendar = { days:[{date:'2026-10-31', items:adaptStreamSlots([{date:'2026-10-31',time:'21:00',note:'SHOWROOM登録予定'}])}],pending:[],availability:{showroomSchedule:'ok'}};
  const result = withOct31Plan(calendar, at('11:00'));
  assert.equal(calendar.days[0].items.length, 1);
  assert.equal(result.days[0].items.length, 3);
  assert.equal(result.days[0].items.filter(i => i.startTime === '21:00').length, 1);
  assert.equal(result.days[0].items.find(i => i.startTime === '14:45').endTime, '15:15');
  assert.ok(result.days[0].items.every(i => i.source.includes('room_id=573253') && i.title.includes('本人告知')));
  assert.equal(withOct31Plan(calendar, at('05:00')), calendar);
});

test('NEWS keeps the owner announcement and gratitude separate from verified live timing or footage', () => {
  const items = news.filter(n => n.id === '2026-10-31-fanroom-stream-update');
  assert.equal(items.length, 1);
  assert.equal(items[0].date, '2026-10-31');
  assert.equal(items[0].sameDayOrder, 811);
  assert.match(items[0].body, /14:45〜15:15/);
  assert.match(items[0].body, /正確な実施時刻は未確認/);
  assert.equal(items[0].media, undefined);
});
