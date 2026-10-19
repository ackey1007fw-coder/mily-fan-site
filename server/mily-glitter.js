import { resolveMilyRoom, roomNameMatchesMily } from './mily-showroom.js';
import { tokyoPeriods, nonnegativeInt } from '../public/data-lab/assets/glitter-model.js';
export const RANKING_URL = 'https://www.showroom-live.com/ranking';
const BASE = 'https://www.showroom-live.com/api/genre_ranking';
const PAGE_SIZE = 20, MAX_PAGES = 10;
export async function fetchRankingJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: 'error', headers: { Accept: 'application/json' } });
    return response.ok ? await response.json() : null;
  } catch { return null; } finally { clearTimeout(timer); }
}
function emptyPeriod(kind, period, state = 'unavailable', observedAt = null) {
  return { state, periodStart: kind === 'weekly' ? period.weekStart : period.today,
    periodEnd: kind === 'weekly' ? period.weekEnd : period.today, observedAt,
    points: null, rank: null, listedCount: null, nextRank: null, nextRankPoints: null,
    gapToNextRank: null, cutoffRank: null, rankCondition: 'unverified' };
}
export async function readGenrePeriod(room, kind, period, { fetchJson = fetchRankingJson, clock = Date.now } = {}) {
  const fallback = () => emptyPeriod(kind, period);
  if (!room || !nonnegativeInt(room.roomId) || room.roomId < 1 || !roomNameMatchesMily(room.roomName, room.roomUrlKey) || !['daily', 'weekly'].includes(kind)) return fallback();
  const startTime = clock();
  const date = (kind === 'weekly' ? period.weekStart : period.today).replaceAll('-', '');
  let page = 1, total = null;
  const seenPages = new Set(), rows = [], ids = new Set(), orders = new Set();
  for (let attempt = 0; attempt < MAX_PAGES && clock() - startTime < 15000; attempt++) {
    if (seenPages.has(page)) return fallback();
    seenPages.add(page);
    const data = await fetchJson(BASE + '/103/' + kind + '/' + date + '?page=' + page + '&count=' + PAGE_SIZE).catch(() => null);
    if (!data || !Array.isArray(data.genre_ranking) || data.genre_ranking.length > PAGE_SIZE || !nonnegativeInt(data.total_count)) return fallback();
    if (total !== null && total !== data.total_count) return fallback();
    total = data.total_count;
    for (const row of data.genre_ranking) {
      const id = row?.room?.room_id;
      if (!nonnegativeInt(id) || id < 1 || ids.has(id) || !nonnegativeInt(row.order_no) || row.order_no < 1 || orders.has(row.order_no) || !nonnegativeInt(row.rank) || row.rank < 1 || row.rank > total || !nonnegativeInt(row.point)) return fallback();
      const previous = rows.at(-1);
      if (previous && (row.order_no <= previous.order_no || row.point > previous.point || row.rank < previous.rank)) return fallback();
      ids.add(id); orders.add(row.order_no); rows.push(row);
    }
    if (rows.length > total) return fallback();
    const own = rows.find(row => row.room.room_id === room.roomId);
    const at = new Date(clock()).toISOString();
    const current = tokyoPeriods(clock());
    // A request crossing midnight must not publish the old day as today's result.
    if (current.today !== period.today) return fallback();
    if (own) {
      if (!roomNameMatchesMily(own.room.room_name, own.room.room_url_key)) return fallback();
      const above = rows.filter(row => row.rank < own.rank).at(-1);
      return { ...emptyPeriod(kind, period, 'ok', at), points: own.point, rank: own.rank, listedCount: total,
        nextRank: above?.rank ?? null, nextRankPoints: above?.point ?? null,
        gapToNextRank: above ? Math.max(0, above.point - own.point) : null };
    }
    if (data.next_page === null || data.next_page === 0) {
      return rows.length === total ? { ...emptyPeriod(kind, period, 'not-listed', at), listedCount: total } : fallback();
    }
    if (!nonnegativeInt(data.next_page) || data.next_page <= page || data.genre_ranking.length === 0) return fallback();
    page = data.next_page;
  }
  return fallback(); // Search budget exhaustion is not proof of absence.
}
export async function getGlitterProgress(env = process.env, { resolveRoom = resolveMilyRoom, fetchJson = fetchRankingJson, clock = Date.now } = {}) {
  const period = tokyoPeriods(clock());
  const blank = { schemaVersion: 1, genre: { id: 103, name: 'タレント' }, roomId: null,
    sourceUrl: RANKING_URL, generatedAt: new Date(clock()).toISOString(),
    weekly: emptyPeriod('weekly', period), daily: emptyPeriod('daily', period) };
  const [room, genres] = await Promise.all([
    resolveRoom(env).catch(() => null), fetchJson(BASE + '/room_genre').catch(() => null),
  ]);
  if (!room || !roomNameMatchesMily(room.roomName, room.roomUrlKey) || !Array.isArray(genres?.room_genre) || !genres.room_genre.some(g => g.genre_id === 103 && g.name === 'talent')) return blank;
  const [weekly, daily] = await Promise.all(['weekly', 'daily'].map(kind => readGenrePeriod(room, kind, period, { fetchJson, clock })));
  return { ...blank, roomId: room.roomId, generatedAt: new Date(clock()).toISOString(), weekly, daily };
}
