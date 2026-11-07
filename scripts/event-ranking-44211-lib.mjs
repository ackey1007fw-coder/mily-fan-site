/**
 * SHOWROOM event_id 44211 の公開 room_list を読み、順位・ルーム名・pt だけ残す。
 * 誕生日・居住地・画像・SNS・本文などの余分な個人情報は捨てる。
 * ネットワークは持たない。呼び出し側が fetch を渡す。
 */
import { roomNameMatchesMily } from '../server/mily-showroom.js';

export const EVENT_ID = 44211;
export const EVENT_URL = 'https://www.showroom-live.com/event/circle2026_sf';
export const EVENT_TITLE = '【ミスサー枠】SDGs推進 TGC しずおか 2027 出演オーディション';
export const ROOM_LIST_URL = 'https://www.showroom-live.com/api/event/room_list?event_id=44211';
export const HISTORY_RELATIVE = 'public/data-lab/data/event-44211-ranking-history.json';
export const MAX_PAGES = 4;
export const PAGE_TIMEOUT_MS = 8000;

const ROOM_FIELDS = ['rank', 'point', 'room_name', 'room_url_key'];

export function rankingUrl(page = 1) {
  if (!Number.isInteger(page) || page < 1) return null;
  return page === 1 ? ROOM_LIST_URL : `${ROOM_LIST_URL}&p=${page}`;
}

export function nonnegativeInt(value) {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function sanitizeRoom(row) {
  if (!row || typeof row !== 'object') return null;
  const rank = Number(row.rank);
  const point = Number(row.point);
  const room_name = typeof row.room_name === 'string' ? row.room_name.replace(/\s+/g, ' ').trim() : '';
  const room_url_key = typeof row.room_url_key === 'string' ? row.room_url_key.trim() : '';
  if (!nonnegativeInt(rank) || rank < 1 || !nonnegativeInt(point) || !room_name) return null;
  if (room_name.length > 120 || room_url_key.length > 80) return null;
  return {
    rank,
    point,
    room_name,
    ...(room_url_key ? { room_url_key } : {}),
  };
}

export function assertNoPrivateFields(record) {
  const raw = JSON.stringify(record);
  const forbidden = [
    'birthday', 'birth_year', 'birth_month', 'birth_mday', 'performer_hometown',
    'youtube_id', 'twitter_text', 'follower_num', 'room_description',
    'performer_description', 'welcome_comment', 'image_l', 'image_m', 'image_s',
    'banner_image_url', 'account_id', 'organizer_id',
  ];
  return forbidden.every((key) => !raw.includes(`"${key}"`));
}

export function summarizeRooms(rooms) {
  if (!Array.isArray(rooms) || rooms.length === 0) return null;
  const ordered = [...rooms].sort((a, b) => a.rank - b.rank);
  const matched = ordered.filter((row) => roomNameMatchesMily(row.room_name, row.room_url_key || null));
  if (matched.length !== 1) {
    return {
      mily: null,
      above: null,
      below: null,
      first: ordered[0] ? publicContestant(ordered[0]) : null,
      identity: matched.length === 0 ? 'none' : 'ambiguous',
      gapToAbove: null,
      gapToBelow: null,
    };
  }
  const milyRow = matched[0];
  const aboveRow = ordered.find((row) => row.rank === milyRow.rank - 1) || null;
  const belowRow = ordered.find((row) => row.rank === milyRow.rank + 1) || null;
  const mily = { rank: milyRow.rank, point: milyRow.point, displayName: 'みりぃ', roomUrlKey: milyRow.room_url_key || null };
  const above = aboveRow ? publicContestant(aboveRow) : null;
  const below = belowRow ? publicContestant(belowRow) : null;
  return {
    mily,
    above,
    below,
    first: publicContestant(ordered[0]),
    identity: 'unique',
    gapToAbove: above ? above.point - mily.point : null,
    gapToBelow: below ? mily.point - below.point : null,
  };
}

function publicContestant(row) {
  return { rank: row.rank, point: row.point, displayName: row.room_name, roomUrlKey: row.room_url_key || null };
}

export function tokyoTimestamp(now = Date.now()) {
  if (!Number.isFinite(now)) return null;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(now));
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}+09:00`;
}

export function emptyHistory() {
  return {
    schemaVersion: 1,
    eventId: EVENT_ID,
    eventUrl: EVENT_URL,
    eventTitle: EVENT_TITLE,
    phase: 'semifinal',
    disclaimer: '非公式ファン制作の公開ランキング読取。公式の最終結果ではない。個人の私的情報・DM・視聴者名は含まない。',
    observations: [],
  };
}

export function buildObservation({ rooms, observedAtJst, source, totalEntries }) {
  const summary = summarizeRooms(rooms);
  if (!summary) return null;
  const observation = {
    observedAtJst,
    source,
    totalEntries: nonnegativeInt(totalEntries) ? totalEntries : rooms.length,
    ...summary,
    rooms: rooms.map((row) => {
      const clean = {};
      for (const key of ROOM_FIELDS) {
        if (row[key] !== undefined) clean[key] = row[key];
      }
      return clean;
    }),
  };
  return assertNoPrivateFields(observation) ? observation : null;
}

export function appendObservation(history, observation) {
  const base = history && history.schemaVersion === 1 && history.eventId === EVENT_ID
    ? history
    : emptyHistory();
  const observations = Array.isArray(base.observations) ? [...base.observations] : [];
  const duplicate = observations.some((item) => (
    item?.observedAtJst === observation.observedAtJst
    && item?.mily?.rank === observation.mily?.rank
    && item?.mily?.point === observation.mily?.point
  ));
  if (duplicate) return { history: base, appended: false };
  observations.push(observation);
  return {
    history: { ...base, eventId: EVENT_ID, eventUrl: EVENT_URL, eventTitle: EVENT_TITLE, observations },
    appended: true,
  };
}

export async function readAllRankingPages(fetchJson) {
  const rooms = [];
  let totalEntries = null;
  let next = 1;
  for (let i = 0; i < MAX_PAGES; i += 1) {
    const url = rankingUrl(next);
    const data = await fetchJson(url);
    if (!data || !Array.isArray(data.list) || data.list.length === 0) {
      return { ok: false, reason: 'empty-page', rooms, totalEntries };
    }
    if (totalEntries === null) {
      if (!nonnegativeInt(data.total_entries) || data.total_entries < 1) {
        return { ok: false, reason: 'bad-total', rooms, totalEntries };
      }
      totalEntries = data.total_entries;
    } else if (data.total_entries !== totalEntries) {
      return { ok: false, reason: 'total-changed', rooms, totalEntries };
    }
    for (const row of data.list) {
      const clean = sanitizeRoom(row);
      if (!clean) return { ok: false, reason: 'unsanitary-row', rooms, totalEntries };
      if (rooms.some((item) => item.rank === clean.rank || (item.room_url_key && item.room_url_key === clean.room_url_key))) {
        return { ok: false, reason: 'duplicate', rooms, totalEntries };
      }
      rooms.push(clean);
    }
    if (!data.next_page) break;
    if (!nonnegativeInt(data.next_page) || data.next_page !== next + 1) {
      return { ok: false, reason: 'bad-next-page', rooms, totalEntries };
    }
    next = data.next_page;
  }
  if (rooms.length === 0) return { ok: false, reason: 'no-rows', rooms, totalEntries };
  return { ok: true, rooms, totalEntries };
}
