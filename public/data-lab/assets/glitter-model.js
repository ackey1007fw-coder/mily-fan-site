// Shared, side-effect-free definitions for the public reader and progress screen.
export const GLITTER_RULES = Object.freeze({ dailyMin: 4000, weeklyMin: 40000, suggestedWeekly: 42000 });
export const REFRESH_MS = 300000;
export const STALE_MS = 600000;
const DAY = 86400000, JST = 32400000;
export const nonnegativeInt = x => typeof x === 'number' && Number.isSafeInteger(x) && x >= 0;
export function tokyoPeriods(now = Date.now()) {
  if (!Number.isFinite(now)) throw new TypeError('Valid clock required');
  const local = new Date(now + JST);
  const today = local.toISOString().slice(0, 10);
  const weekday = (local.getUTCDay() + 6) % 7;
  const midnight = Date.parse(today + 'T00:00:00+09:00');
  const date = ms => new Date(ms + JST).toISOString().slice(0, 10);
  return { today, weekStart: date(midnight - weekday * DAY), weekEnd: date(midnight + (6 - weekday) * DAY), daysRemaining: 7 - weekday, nextDayAt: midnight + DAY };
}
export function currentObservation(payload, kind, now = Date.now()) {
  if (payload?.schemaVersion !== 1 || payload?.genre?.id !== 103 || !nonnegativeInt(payload.roomId) || payload.roomId === 0) return null;
  const item = payload[kind], period = tokyoPeriods(now);
  if (!['weekly', 'daily'].includes(kind) || item?.state !== 'ok') return null;
  const start = kind === 'weekly' ? period.weekStart : period.today;
  const end = kind === 'weekly' ? period.weekEnd : period.today;
  const at = typeof item.observedAt === 'string' ? Date.parse(item.observedAt) : NaN;
  if (item.periodStart !== start || item.periodEnd !== end || !Number.isFinite(at) || now - at >= STALE_MS || at - now > 60000) return null;
  if (at < Date.parse(start + 'T00:00:00+09:00') || !nonnegativeInt(item.points) || !nonnegativeInt(item.rank) || item.rank < 1) return null;
  if (!nonnegativeInt(item.listedCount) || item.listedCount < item.rank) return null;
  return item;
}
export function planProgress(payload, now = Date.now(), remainingStreams = null, target = GLITTER_RULES.weeklyMin) {
  const period = tokyoPeriods(now), weekly = currentObservation(payload, 'weekly', now), daily = currentObservation(payload, 'daily', now);
  const chosen = [40000, 42000].includes(target) ? target : 40000;
  const remaining = weekly ? Math.max(0, chosen - weekly.points) : null;
  return { ...period, weekly, daily, target: chosen,
    remaining, remainingToMinimum: weekly ? Math.max(0, GLITTER_RULES.weeklyMin - weekly.points) : null,
    remainingToSuggested: weekly ? Math.max(0, GLITTER_RULES.suggestedWeekly - weekly.points) : null,
    dailyAverage: remaining === null ? null : Math.ceil(remaining / period.daysRemaining),
    perStream: remaining !== null && nonnegativeInt(remainingStreams) && remainingStreams >= 1 && remainingStreams <= 99 ? Math.ceil(remaining / remainingStreams) : null,
    dailyRemaining: daily ? Math.max(0, GLITTER_RULES.dailyMin - daily.points) : null,
    percent: weekly ? Math.min(100, weekly.points / GLITTER_RULES.weeklyMin * 100) : null };
}
