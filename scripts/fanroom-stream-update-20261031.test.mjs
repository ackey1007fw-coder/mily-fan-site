import assert from 'node:assert/strict';
import { test } from 'node:test';
import { upcomingOct31Slots, withOct31Plan } from '../src/lib/oct31Plan.ts';
import { nextSupportEventBoundary } from '../src/lib/useSupportEventClock.ts';
import { news } from '../src/data/news.ts';
import { adaptStreamSlots } from '../src/lib/supportCalendar.ts';
const at = t => Date.parse(`2026-10-31T${t}:00+09:00`);

test('the canceled early slot never returns and each announced slot expires at its confirmed end', () => {
  assert.deepEqual(upcomingOct31Slots(at('05:31')), []);
  assert.deepEqual(upcomingOct31Slots(at('05:32')).map(s => s.time), ['07:00','14:45','21:05']);
  assert.deepEqual(upcomingOct31Slots(at('07:30')).map(s => s.time), ['14:45','21:05']);
  assert.deepEqual(upcomingOct31Slots(at('15:15')).map(s => s.time), ['21:05']);
  assert.deepEqual(upcomingOct31Slots(at('21:50')), []);
  assert.equal(nextSupportEventBoundary(at('15:14')), at('15:15'));
  assert.equal(nextSupportEventBoundary(at('21:04')), at('21:05'));
  assert.equal(nextSupportEventBoundary(at('21:49')), at('21:50'));
});

test('calendar keeps the noon announcement even when SHOWROOM only registers night, without duplicate night', () => {
  const calendar = { days:[{date:'2026-10-31', items:adaptStreamSlots([{date:'2026-10-31',time:'21:00',note:'SHOWROOM登録予定'}])}],pending:[],availability:{showroomSchedule:'ok'}};
  const result = withOct31Plan(calendar, at('11:00'));
  assert.equal(calendar.days[0].items.length, 1);
  assert.equal(result.days[0].items.length, 3);
  assert.equal(result.days[0].items.filter(i => i.startTime === '21:00').length, 0);
  assert.equal(result.days[0].items.filter(i => i.startTime === '21:05').length, 1);
  assert.equal(result.days[0].items.find(i => i.startTime === '14:45').endTime, '15:15');
  assert.ok(result.days[0].items.every(i => i.source.includes('room_id=573253') && i.title.includes('本人告知')));
  assert.equal(withOct31Plan(calendar, at('05:00')), calendar);
});

test('NEWS keeps the owner announcement and gratitude separate from verified live timing or footage', () => {
  const items = news.filter(n => n.id === '2026-10-31-fanroom-stream-update');
  assert.equal(items.length, 1);
  assert.equal(items[0].date, '2026-10-31');
  assert.equal(items[0].sameDayOrder, 1552);
  assert.match(items[0].title, /21:05/);
  assert.match(items[0].body, /15:52更新.*21:05〜21:50/);
  assert.match(items[0].body, /当時は.*21:00〜21:50.*案内していました/);
  assert.match(items[0].body, /14:45〜15:15/);
  assert.match(items[0].body, /正確な実施時刻は未確認/);
  assert.equal(items[0].media, undefined);
});

test('updated night replaces stale and matching registrations while retaining unrelated slots and dates', () => {
  const calendar = { days:[
    {date:'2026-10-31', items:adaptStreamSlots([
      {date:'2026-10-31',time:'21:00'}, {date:'2026-10-31',time:'21:05'}, {date:'2026-10-31',time:'22:30'},
    ])},
    {date:'2026-11-01', items:adaptStreamSlots([{date:'2026-11-01',time:'21:00'}])},
  ], pending:[], availability:{showroomSchedule:'ok'}};
  const result = withOct31Plan(calendar, at('20:00'));
  assert.deepEqual(result.days[0].items.map(i => i.startTime), ['07:00','14:45','21:05','22:30']);
  assert.equal(result.days[0].items.find(i => i.startTime === '21:05').endTime, '21:50');
  assert.deepEqual(result.days[1], calendar.days[1]);
  assert.equal(calendar.days[0].items[0].startTime, '21:00', 'input is not mutated');
});
