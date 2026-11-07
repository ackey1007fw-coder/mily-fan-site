/**
 * SHOWROOM event_id 44211 の公開ランキングを1回読み、履歴JSONへ追記する。
 * 手動実行 / workflow_dispatch 用。定期課金の schedule は付けない。
 *
 *   node scripts/fetch-event-ranking-44211.mjs
 *   node scripts/fetch-event-ranking-44211.mjs --dry-run
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  EVENT_ID,
  HISTORY_RELATIVE,
  PAGE_TIMEOUT_MS,
  appendObservation,
  buildObservation,
  emptyHistory,
  readAllRankingPages,
  tokyoTimestamp,
} from './event-ranking-44211-lib.mjs';

const USER_AGENT = 'Mozilla/5.0 (compatible; MilyFanSite/1.0; +https://mily-fan-site.vercel.app)';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const historyPath = resolve(root, HISTORY_RELATIVE);

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PAGE_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'error',
      headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function loadHistory() {
  try {
    const raw = JSON.parse(await readFile(historyPath, 'utf8'));
    if (raw?.schemaVersion !== 1 || raw.eventId !== EVENT_ID) return emptyHistory();
    return raw;
  } catch {
    return emptyHistory();
  }
}

export async function recordEventRanking({
  fetchPage = fetchJson,
  clock = Date.now,
  dryRun = false,
  source = 'manual-fetch',
} = {}) {
  const pages = await readAllRankingPages(fetchPage);
  if (!pages.ok) {
    return { ok: false, reason: pages.reason, observation: null, appended: false };
  }
  const observation = buildObservation({
    rooms: pages.rooms,
    observedAtJst: tokyoTimestamp(clock()),
    source,
    totalEntries: pages.totalEntries,
  });
  if (!observation) return { ok: false, reason: 'unsanitary-observation', observation: null, appended: false };
  const current = await loadHistory();
  const next = appendObservation(current, observation);
  if (!dryRun && next.appended) {
    await mkdir(dirname(historyPath), { recursive: true });
    await writeFile(historyPath, `${JSON.stringify(next.history, null, 2)}\n`);
  }
  return { ok: true, observation, appended: next.appended, dryRun, historyPath };
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isCli) {
  const dryRun = process.argv.includes('--dry-run');
  const result = await recordEventRanking({ dryRun });
  if (!result.ok) {
    console.error(`event 44211 ranking fetch failed: ${result.reason}`);
    process.exitCode = 1;
  } else {
    const mily = result.observation.mily;
    console.log(JSON.stringify({
      ok: true,
      dryRun,
      appended: result.appended,
      observedAtJst: result.observation.observedAtJst,
      identity: result.observation.identity,
      milyRank: mily?.rank ?? null,
      milyPoint: mily?.point ?? null,
      gapToAbove: result.observation.gapToAbove,
      gapToBelow: result.observation.gapToBelow,
      rooms: result.observation.rooms.length,
    }, null, 2));
  }
}
