import { getGlitterProgress } from '../server/mily-glitter.js';
import { tokyoPeriods } from '../public/data-lab/assets/glitter-model.js';
let cache = null, inflight = null;
export async function cachedProgress(now = Date.now()) {
  const day = tokyoPeriods(now).today;
  if (cache?.day === day && now < cache.expires) return cache.payload;
  if (inflight?.day === day) return inflight.promise;
  const promise = getGlitterProgress().then(payload => {
    const seconds = payload.weekly.state === 'ok' && payload.daily.state === 'ok' ? 300 : 30;
    const at = Date.now();
    if (tokyoPeriods(at).today === day) cache = { day, expires: Math.min(at + seconds * 1000, tokyoPeriods(at).nextDayAt), payload };
    return payload;
  }).finally(() => { if (inflight?.promise === promise) inflight = null; });
  inflight = { day, promise };
  return promise;
}
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Allow', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });
  try {
    const payload = await cachedProgress();
    const now = Date.now();
    const complete = payload.weekly.state === 'ok' && payload.daily.state === 'ok';
    const oldest = Math.min(Date.parse(payload.weekly.observedAt), Date.parse(payload.daily.observedAt));
    const ttl = complete && Number.isFinite(oldest) ? Math.max(0, Math.min(300, Math.floor((oldest + 300000 - now) / 1000))) : 30;
    const untilMidnight = Math.max(0, Math.floor((tokyoPeriods(now).nextDayAt - now) / 1000));
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=' + Math.min(ttl, untilMidnight) + ', must-revalidate');
    return res.status(200).json(payload);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ schemaVersion: 1, error: 'ranking unavailable' });
  }
}
