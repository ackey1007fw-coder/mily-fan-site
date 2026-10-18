import assert from 'node:assert/strict';
import { test } from 'node:test';
import { finalDayStreamSlots, OCTOBER_12_FINAL_STREAM_SOURCE } from '../src/data/fourthRoundStreamSchedule.ts';
import { streamSchedule, upcomingSlots } from '../src/data/streamSchedule.ts';
import { finalStreamAnnouncement, withFinalStreamAnnouncedEnd, withFinalStreamAnnouncement } from '../src/lib/finalStreamAnnouncement.ts';
import { toStreamScheduleView } from '../src/lib/useStreamSchedule.ts';
import { nextSupportEventBoundary } from '../src/lib/useSupportEventClock.ts';
import { adaptStreamSlots } from '../src/lib/supportCalendar.ts';

const at = time => Date.parse(`2026-10-12T${time}+09:00`);
const view = (slots = [], availability = 'ok') => ({ slots, manualSlots: [], roomUrl: null, availability });
const calendar = { days: [], pending: [], availability: { showroomSchedule: 'ok' } };

test('final-day announcement has one sourced planned window and expires at 21:59 JST', () => {
  assert.deepEqual(finalDayStreamSlots.map(s => [s.date, s.time, s.endTime]), [['2026-10-12', '21:00', '21:59']]);
  const [slot] = finalDayStreamSlots;
  assert.match(slot.note, /早まる可能性/);
  assert.equal(streamSchedule.filter(s => s.date === slot.date && s.time === slot.time).length, 1);
  assert.match(OCTOBER_12_FINAL_STREAM_SOURCE, /recap-2026-10-12-asa-showroom$/);
  for (const time of ['09:24:14', '20:55:00', '21:00:00', '21:58:59']) assert.ok(finalStreamAnnouncement(view(), at(time)));
  for (const time of ['21:59:00', '22:00:00', '23:59:00']) {
    assert.equal(finalStreamAnnouncement(view(), at(time)), null);
    assert.equal(upcomingSlots(finalDayStreamSlots, [], at(time)).length, 0);
  }
  assert.equal(finalStreamAnnouncement(view(), Date.parse('2026-10-11T23:59:59+09:00')), null);
  assert.equal(nextSupportEventBoundary(at('21:58:59')), at('21:59:00'));
});

test('API empty stays empty; only exact matching starts gain the announced end', () => {
  const now = at('09:24:14');
  const fetched = toStreamScheduleView({ slots: [], roomUrl: null, availability: 'ok' }, streamSchedule, now);
  assert.deepEqual(withFinalStreamAnnouncedEnd(fetched, now).slots, []);
  assert.equal(finalStreamAnnouncement(fetched, now).time, '21:00');
  const matched = withFinalStreamAnnouncedEnd(view([{ date: '2026-10-12', time: '21:00' }]), now);
  assert.equal(matched.slots[0].endTime, '21:59');
  assert.match(matched.slots[0].note, /本人案内/);
  assert.equal(withFinalStreamAnnouncedEnd(matched, at('21:59:00')).slots.length, 0);
  const changed = view([{ date: '2026-10-12', time: '20:55' }]);
  assert.deepEqual(withFinalStreamAnnouncedEnd(changed, now).slots, changed.slots);
  assert.equal(finalStreamAnnouncement(changed, now).time, '20:55');
  assert.equal(finalStreamAnnouncement(changed, now).endTime, undefined);
  const ownEnd = view([{ date: '2026-10-12', time: '21:00', endTime: '21:45' }]);
  assert.deepEqual(withFinalStreamAnnouncedEnd(ownEnd, now).slots, ownEnd.slots);
});

test('calendar shows the independent announcement on empty API and never duplicates a registered or fallback slot', () => {
  const now = at('09:24:14');
  for (const availability of ['ok', 'loading', 'unavailable']) {
    const result = withFinalStreamAnnouncement(calendar, view([], availability), now);
    assert.equal(result.days[0].items.length, 1);
    assert.match(result.days[0].items[0].title, /本人告知/);
    assert.equal(result.days[0].items[0].source, OCTOBER_12_FINAL_STREAM_SOURCE);
    assert.equal(calendar.days.length, 0);
  }
  for (const time of ['21:00', '20:55']) {
    const slots = [{ date: '2026-10-12', time }];
    const registered = { ...calendar, days: [{ date: '2026-10-12', items: adaptStreamSlots(slots) }] };
    assert.equal(withFinalStreamAnnouncement(registered, view(slots), now), registered);
  }
  assert.equal(withFinalStreamAnnouncement(calendar, view(), at('21:59:00')), calendar);
});
