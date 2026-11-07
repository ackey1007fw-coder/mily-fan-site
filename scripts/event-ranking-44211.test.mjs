import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  EVENT_44211_SNAPSHOT,
  event44211Gaps,
  formatEventPoints,
  formatPointDelta,
} from '../public/data-lab/assets/event-44211-snapshot.js';
import {
  EVENT_ID,
  ROOM_LIST_URL,
  appendObservation,
  assertNoPrivateFields,
  buildObservation,
  rankingUrl,
  readAllRankingPages,
  sanitizeRoom,
  summarizeRooms,
  tokyoTimestamp,
} from './event-ranking-44211-lib.mjs';
import { recordEventRanking } from './fetch-event-ranking-44211.mjs';

const html = readFileSync(new URL('../data-lab/glitter/index.html', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('../.github/workflows/event-ranking-44211.yml', import.meta.url), 'utf8');
const history = JSON.parse(readFileSync(new URL('../public/data-lab/data/event-44211-ranking-history.json', import.meta.url), 'utf8'));
const fetchScript = readFileSync(new URL('./fetch-event-ranking-44211.mjs', import.meta.url), 'utf8');
const lib = readFileSync(new URL('./event-ranking-44211-lib.mjs', import.meta.url), 'utf8');

const rawRow = (rank, point, name, extra = {}) => ({
  rank,
  point,
  room_name: name,
  room_url_key: extra.room_url_key || `room-${rank}`,
  birthday: 63385200,
  birth_year: 1972,
  performer_hometown: 'secret-city',
  youtube_id: 'abc',
  twitter_text: 'private note',
  follower_num: 999,
  room_description: 'do not store',
  image_l: 'https://example.test/face.png',
  account_id: 12,
});

test('frozen 04:25 JST snapshot keeps mily 9th and gaps to 8th and 10th', () => {
  assert.equal(EVENT_44211_SNAPSHOT.eventId, 44211);
  assert.equal(EVENT_44211_SNAPSHOT.eventUrl, 'https://www.showroom-live.com/event/circle2026_sf');
  assert.equal(EVENT_44211_SNAPSHOT.phase, 'semifinal');
  assert.equal(EVENT_44211_SNAPSHOT.observedAtJst, '2026-11-08T04:25:00+09:00');
  assert.equal(EVENT_44211_SNAPSHOT.notOfficialFinal, true);
  assert.equal(EVENT_44211_SNAPSHOT.mily.rank, 9);
  assert.equal(EVENT_44211_SNAPSHOT.mily.point, 3696180);
  assert.equal(EVENT_44211_SNAPSHOT.above.displayName, '高乘美空');
  assert.equal(EVENT_44211_SNAPSHOT.below.displayName, '辻本祐佳');
  assert.equal(EVENT_44211_SNAPSHOT.first.displayName, '陣ノ内柚来');
  const gaps = event44211Gaps();
  assert.equal(gaps.toAbove, 724409);
  assert.equal(gaps.toBelow, 18015);
  assert.equal(gaps.toFirst, 6031463);
  assert.equal(formatEventPoints(3696180), '3,696,180');
  assert.equal(formatPointDelta(724409), '+724,409');
  assert.equal(formatPointDelta(-18015), '−18,015');
  assert.equal(formatPointDelta(0), '—');
  assert.equal(tokyoTimestamp(Date.parse('2026-11-08T04:25:00+09:00')), '2026-11-08T04:25:00+09:00');
});

test('page copy stays fan-facing, unofficial, and separate from glitter pt', () => {
  assert.match(html, /id="event-44211"/);
  assert.match(html, /circle2026_sf/);
  assert.match(html, /event_id 44211/);
  assert.match(html, /2026年11月8日 4:25/);
  assert.match(html, /公式の最終発表ではなく/);
  assert.match(html, /きら星カウンターやClassic金グリッターのptとは混ぜません/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /DM|ダイレクトメッセージ|住所|電話/);
});

test('history seed matches the published snapshot and strips private fields', () => {
  assert.equal(history.eventId, EVENT_ID);
  assert.equal(history.observations[0].observedAtJst, '2026-11-08T04:25:00+09:00');
  assert.equal(history.observations[0].mily.point, 3696180);
  assert.equal(history.observations[0].gapToAbove, 724409);
  assert.equal(history.observations[0].gapToBelow, 18015);
  assert.ok(assertNoPrivateFields(history));
  assert.doesNotMatch(JSON.stringify(history), /birthday|follower_num|youtube_id|room_description/);
});

test('sanitize keeps rank/name/point only and pagination uses p=', () => {
  assert.equal(rankingUrl(1), ROOM_LIST_URL);
  assert.equal(rankingUrl(2), `${ROOM_LIST_URL}&p=2`);
  const clean = sanitizeRoom(rawRow(9, 3696180, '三橋莉子🍅✨(みりぃ)#ミスサー', { room_url_key: 'circle2026_0734' }));
  assert.deepEqual(clean, {
    rank: 9,
    point: 3696180,
    room_name: '三橋莉子🍅✨(みりぃ)#ミスサー',
    room_url_key: 'circle2026_0734',
  });
  assert.equal(sanitizeRoom({ rank: 9, point: -1, room_name: 'みりぃ' }), null);
});

test('mily identity uses room name, neighbors supply gaps, ambiguous matches are dropped', () => {
  const rooms = [
    { rank: 1, point: 9727643, room_name: '陣ノ内柚来', room_url_key: 'circle2026_1400' },
    { rank: 8, point: 4420589, room_name: '高乘美空', room_url_key: 'circle2026_0439' },
    { rank: 9, point: 3696180, room_name: '三橋莉子（みりぃ）', room_url_key: 'circle2026_0734' },
    { rank: 10, point: 3678165, room_name: '辻本祐佳', room_url_key: 'circle2026_0095' },
  ];
  const summary = summarizeRooms(rooms);
  assert.equal(summary.identity, 'unique');
  assert.equal(summary.mily.displayName, 'みりぃ');
  assert.equal(summary.gapToAbove, 724409);
  assert.equal(summary.gapToBelow, 18015);
  const ambiguous = summarizeRooms([
    ...rooms,
    { rank: 11, point: 1, room_name: '三橋莉子', room_url_key: 'circle2026_9999' },
  ]);
  assert.equal(ambiguous.identity, 'ambiguous');
  assert.equal(ambiguous.mily, null);
});

test('page reader follows next_page via p= and refuses private leftovers', async () => {
  const pages = {
    1: {
      current_page: 1,
      next_page: 2,
      total_entries: 4,
      list: [
        rawRow(1, 9727643, '陣ノ内柚来', { room_url_key: 'circle2026_1400' }),
        rawRow(8, 4420589, '高乘美空', { room_url_key: 'circle2026_0439' }),
        rawRow(9, 3696180, '三橋莉子（みりぃ）', { room_url_key: 'circle2026_0734' }),
      ],
    },
    2: {
      current_page: 2,
      next_page: null,
      total_entries: 4,
      list: [rawRow(10, 3678165, '辻本祐佳', { room_url_key: 'circle2026_0095' })],
    },
  };
  const seen = [];
  const fetched = await readAllRankingPages(async (url) => {
    seen.push(url);
    if (url === rankingUrl(1)) return pages[1];
    if (url === rankingUrl(2)) return pages[2];
    return null;
  });
  assert.deepEqual(seen, [rankingUrl(1), rankingUrl(2)]);
  assert.equal(fetched.ok, true);
  assert.equal(fetched.rooms.length, 4);
  const observation = buildObservation({
    rooms: fetched.rooms,
    observedAtJst: '2026-11-08T04:25:00+09:00',
    source: 'test',
    totalEntries: fetched.totalEntries,
  });
  assert.equal(observation.mily.rank, 9);
  assert.ok(assertNoPrivateFields(observation));
  assert.doesNotMatch(JSON.stringify(observation), /secret-city|birthday|face\.png/);
});

test('append is exactly-once per same timestamp and mily score', () => {
  const later = '2026-11-08T05:00:00+09:00';
  const observation = buildObservation({
    rooms: [
      { rank: 8, point: 4420589, room_name: '高乘美空', room_url_key: 'a' },
      { rank: 9, point: 3696180, room_name: '三橋莉子（みりぃ）', room_url_key: 'circle2026_0734' },
      { rank: 10, point: 3678165, room_name: '辻本祐佳', room_url_key: 'b' },
    ],
    observedAtJst: later,
    source: 'test',
    totalEntries: 3,
  });
  const first = appendObservation(history, observation);
  assert.equal(first.appended, true);
  assert.equal(first.history.observations.length, 2);
  const second = appendObservation(first.history, observation);
  assert.equal(second.appended, false);
  const sameScoreEarlier = appendObservation(history, {
    ...observation,
    observedAtJst: '2026-11-08T04:25:00+09:00',
  });
  assert.equal(sameScoreEarlier.appended, false);
});

test('dry-run fetch records without writing, and workflow has no paid schedule', async () => {
  const result = await recordEventRanking({
    dryRun: true,
    clock: () => Date.parse('2026-11-08T05:00:00+09:00'),
    fetchPage: async (url) => {
      assert.equal(url, ROOM_LIST_URL);
      return {
        current_page: 1,
        next_page: null,
        total_entries: 3,
        list: [
          rawRow(8, 4420589, '高乘美空'),
          rawRow(9, 3696180, '三橋莉子（みりぃ）', { room_url_key: 'circle2026_0734' }),
          rawRow(10, 3678165, '辻本祐佳'),
        ],
      };
    },
  });
  assert.equal(result.ok, true);
  assert.equal(result.dryRun, true);
  assert.equal(result.appended, true);
  const after = JSON.parse(readFileSync(new URL('../public/data-lab/data/event-44211-ranking-history.json', import.meta.url), 'utf8'));
  assert.equal(after.observations.length, 1);
  assert.match(workflow, /workflow_dispatch/);
  assert.doesNotMatch(workflow, /schedule:/);
  assert.doesNotMatch(workflow, /cron:/);
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /--dry-run/);
  assert.doesNotMatch(workflow, /git commit|git push|contents: write/);
  assert.doesNotMatch(fetchScript, /573253/);
  assert.doesNotMatch(lib, /573253/);
});
