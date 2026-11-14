import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  NOVEMBER_07_ANNOUNCED_AT,
  NOVEMBER_07_SCHEDULE_X_URL,
  november07StreamSlots,
} from '../src/data/nov07Plan.ts';
import { upcomingNov07Slots, withNov07Plan } from '../src/lib/nov07Plan.ts';
import { nextSupportEventBoundary } from '../src/lib/useSupportEventClock.ts';
import { news, sortNewsByDateDesc } from '../src/data/news.ts';
import { missCircleSemifinalWebVoteLink } from '../src/data/links.ts';
import { adaptStreamSlots } from '../src/lib/supportCalendar.ts';
import { resolveNewsLinks } from '../src/lib/newsLinks.ts';
import { supportEvents } from '../src/data/supportEvents.ts';

const at = (date, time) => Date.parse(`${date}T${time}+09:00`);

test('November 7 slots stay hidden until the X post and expire at announced JST ends', () => {
  assert.equal(NOVEMBER_07_SCHEDULE_X_URL, 'https://x.com/Mily_chan36/status/2118721115514384479');
  assert.equal(NOVEMBER_07_ANNOUNCED_AT, '2026-11-07T00:04:00+09:00');
  assert.deepEqual(
    november07StreamSlots.map((slot) => [slot.date, slot.time, slot.endTime]),
    [['2026-11-07', '07:00', '08:00'], ['2026-11-07', '21:00', '21:59']],
  );
  assert.deepEqual(upcomingNov07Slots(at('2026-11-06', '23:59:59')), []);
  assert.deepEqual(upcomingNov07Slots(at('2026-11-07', '00:03:59')), []);
  assert.deepEqual(upcomingNov07Slots(at('2026-11-07', '00:04:00')).map((slot) => slot.time), ['07:00', '21:00']);
  assert.deepEqual(upcomingNov07Slots(at('2026-11-07', '08:00:00')).map((slot) => slot.time), ['21:00']);
  assert.deepEqual(upcomingNov07Slots(at('2026-11-07', '21:58:59')).map((slot) => slot.time), ['21:00']);
  assert.deepEqual(upcomingNov07Slots(at('2026-11-07', '21:59:00')), []);
  assert.equal(nextSupportEventBoundary(at('2026-11-07', '06:59:00')), at('2026-11-07', '07:00:00'));
  assert.equal(nextSupportEventBoundary(at('2026-11-07', '07:59:00')), at('2026-11-07', '08:00:00'));
  assert.equal(nextSupportEventBoundary(at('2026-11-07', '20:59:00')), at('2026-11-07', '21:00:00'));
  assert.equal(nextSupportEventBoundary(at('2026-11-07', '21:58:00')), at('2026-11-07', '21:59:00'));
});

test('calendar overlays the announced 11/7 windows and drops a stale 21:30 registration', () => {
  const calendar = {
    days: [{
      date: '2026-11-07',
      items: adaptStreamSlots([
        { date: '2026-11-07', time: '21:30', note: 'SHOWROOM登録予定' },
      ]),
    }],
    pending: [],
    availability: { showroomSchedule: 'ok' },
  };
  assert.equal(withNov07Plan(calendar, at('2026-11-07', '00:03:00')), calendar);
  const result = withNov07Plan(calendar, at('2026-11-07', '04:00:00'));
  assert.equal(calendar.days[0].items.length, 1, 'input is not mutated');
  assert.deepEqual(result.days[0].items.map((item) => item.startTime), ['07:00', '21:00']);
  assert.equal(result.days[0].items.find((item) => item.startTime === '21:00').endTime, '21:59');
  assert.equal(result.days[0].items.find((item) => item.startTime === '21:00').title, 'SHOWROOM最終枠（本人告知の予定）');
  assert.ok(result.days[0].items.every((item) => item.source === NOVEMBER_07_SCHEDULE_X_URL));
  assert.equal(result.days[0].items.filter((item) => item.startTime === '21:30').length, 0);
});

test('11/7 NEWS is the sourced Latest lead without scraped media or a changed WEB deadline', async () => {
  const items = news.filter((item) => item.id === '2026-11-07-x-showroom-sr-final-schedule');
  assert.equal(items.length, 1);
  const item = items[0];
  assert.equal(item.date, '2026-11-07');
  assert.equal(item.sameDayOrder, 4);
  assert.deepEqual(item.activityIds, ['live-stream', 'miss-circle']);
  assert.equal(item.source, NOVEMBER_07_SCHEDULE_X_URL);
  // Latest lead as of 2026-11-07 (newer NEWS items have since taken the lead).
  assert.equal(sortNewsByDateDesc(news.filter((entry) => entry.date <= '2026-11-07'))[0], item);
  assert.match(item.title, /7:00/);
  assert.match(item.title, /21:00/);
  assert.match(item.body, /みりぽち10日目/);
  assert.match(item.body, /SR審査の最終日は11月7日/);
  assert.match(item.body, /7:00〜8:00/);
  assert.match(item.body, /21:00〜21:59（最終枠）/);
  assert.match(item.body, /投票で選ばれた衣装/);
  assert.match(item.body, /みりぃルーム/);
  assert.match(item.body, /WEB投票の期限（11月8日23:59 JST）/);
  assert.match(item.body, /写真は転載せず/);
  assert.match(item.body, /告知予定/);
  assert.match(item.body, /配信記録ではありません/);
  assert.doesNotMatch(item.body, /公認|本人運営|21:30〜22:30/);
  assert.doesNotMatch(`${item.title}\n${item.body}`, /このサイトは公式|公式ファンサイト/);
  assert.equal(item.media, undefined);
  assert.equal(item.xEmbed, undefined);
  assert.equal(item.relatedUrl, '/support/');
  const published = [item.title, item.body, item.source, item.sourceLabel].join('\n');
  assert.doesNotMatch(published, /pbs\.twimg\.com|twimg\.com|video\.twimg/);
  const vote = supportEvents.find((event) => event.id === 'miss-circle-2026-semifinal-web-vote');
  assert.equal(vote.schedule.end, '2026-11-08T23:59:59.999+09:00');
  const urlsAt = (now) => resolveNewsLinks(item, now).additionalCtas?.map((cta) => cta.url) ?? [];
  const during = Date.parse('2026-11-07T12:00:00+09:00');
  assert.deepEqual(urlsAt(during), [
    'https://2026.misscircle.jp/entry/734',
    missCircleSemifinalWebVoteLink.url,
  ]);
  assert.deepEqual(urlsAt(Date.parse('2026-11-08T23:59:59.999+09:00') + 1), [
    'https://2026.misscircle.jp/entry/734',
  ]);
  const { verifyNews } = await import('./content-invariants.mjs');
  assert.deepEqual(verifyNews(items), []);
});
