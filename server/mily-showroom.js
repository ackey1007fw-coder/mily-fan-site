// server/mily-showroom.js
//
// SHOWROOM 関連の共有モジュール（api/ 配下ではないので Function 化されない）。
//   - resolveMilyRoom()      … ENTRY 734 起点で本人 room を一意に解決
//   - fetchShowroomStatus()  … 実ライブ判定（status API の is_live のみ）
//   - fetchNextLive()        … 次回配信予定（予定専用）
//
// 安全設計:
//   - room ID を実装の固定値にしない。毎回 ENTRY 734 から解決する。
//   - 候補は「最初の一致で即採用」しない。全候補を本人確認し、
//     一意に本人 room と判定できたときだけ採用する（複数一致は不採用）。
//   - 本人確認済みの成功結果だけを長めにキャッシュする。
//     未解決・HTTP 失敗はキャッシュしない（次回すぐ再試行できる）。
//   - MILY_SHOWROOM_ROOM_ID の fallback も profile で本人確認してから使う。
//   - is_live 以外（current_live_started_at / started_at / live_id /
//     is_onlive 等）から LIVE を推測しない。next_live と AGE schedule は予定専用。

export const ENTRY_URL = "https://2026.misscircle.jp/entry/734";
export const SHOWROOM_STATUS_API = "https://www.showroom-live.com/api/room/status";
export const SHOWROOM_PROFILE_API = "https://www.showroom-live.com/api/room/profile";
export const SHOWROOM_NEXT_LIVE_API =
  "https://www.showroom-live.com/api/room/next_live";
export const FETCH_TIMEOUT_MS = 8000;

/** 本人確認できた room だけをこの時間キャッシュする。 */
export const ROOM_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const USER_AGENT =
  "Mozilla/5.0 (compatible; MilyFanSite/1.0; +https://mily-fan-site.vercel.app)";

// 本人確認済みの解決結果のみを保持する（失敗はここに入れない）。
let roomCache = null;

/** テスト用: キャッシュを空にする。 */
export function resetRoomCache() {
  roomCache = null;
}

export async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, ...init.headers },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJson(url) {
  const res = await fetchWithTimeout(url, { headers: { Accept: "application/json" } });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

/** JSON 埋め込みの \/ エスケープも戻して URL を拾えるようにする。 */
function unescapeJsonSlashes(html) {
  return String(html ?? "").replaceAll("\\/", "/");
}

/** ENTRY 734 のページ本文が本人のものかを軽く検証する。 */
export function looksLikeEntryPage(html) {
  if (typeof html !== "string" || html.length === 0) return false;
  if (!html.includes("734")) return false;
  return /みりぃ|三橋|mily/i.test(html);
}

/** SHOWROOM の room_url_key 候補をページから抽出する。 */
export function extractShowroomKeys(html) {
  const text = unescapeJsonSlashes(html);
  const keys = new Set();
  for (const match of text.matchAll(/showroom-live\.com\/r\/([A-Za-z0-9_-]+)/g)) {
    if (match[1] !== "room") keys.add(match[1]);
  }
  for (const match of text.matchAll(/room_url_key=([A-Za-z0-9_-]+)/g)) {
    keys.add(match[1]);
  }
  return [...keys];
}

/** SHOWROOM の数値 room_id 候補をページから抽出する。 */
export function extractShowroomRoomIds(html) {
  const text = unescapeJsonSlashes(html);
  const ids = new Set();
  for (const match of text.matchAll(/room_id=(\d{1,12})/g)) {
    ids.add(Number(match[1]));
  }
  return [...ids];
}

/** ページ掲載の SNS リンク（他エントラント混入を避けるため mily 名義のみ）。 */
export function extractSnsLinks(html) {
  const text = unescapeJsonSlashes(html);
  const found = new Set();
  const re =
    /https:\/\/(?:x\.com|twitter\.com|(?:www\.)?instagram\.com|(?:www\.)?tiktok\.com|(?:www\.)?showroom-live\.com)\/[A-Za-z0-9_@.\/?=&%-]+/g;
  for (const match of text.matchAll(re)) {
    found.add(match[0].replace(/[.,)]+$/, ""));
  }
  return [...found];
}

export function filterMilyLinks(links) {
  return (Array.isArray(links) ? links : []).filter((url) => /mily/i.test(url));
}

/** SHOWROOM ルーム名が本人のものかを検証する。 */
export function roomNameMatchesMily(roomName) {
  return typeof roomName === "string" && /みりぃ|三橋|mily/i.test(roomName);
}

/** 候補群から本人 room を一意に決める。曖昧なら null。 */
export function pickUniqueRoom(candidates) {
  const byRoomId = new Map();
  for (const candidate of candidates) {
    if (!candidate) continue;
    const roomId = Number(candidate.roomId);
    if (!Number.isInteger(roomId) || roomId <= 0) continue;
    if (!roomNameMatchesMily(candidate.roomName)) continue;
    // 同じ room が key 経由と id 経由の両方で来ても1件として数える
    if (!byRoomId.has(roomId)) byRoomId.set(roomId, { ...candidate, roomId });
  }
  if (byRoomId.size !== 1) return null;
  const room = [...byRoomId.values()][0];
  return {
    roomId: room.roomId,
    roomUrlKey: room.roomUrlKey ?? null,
    roomUrl: room.roomUrlKey
      ? `https://www.showroom-live.com/r/${room.roomUrlKey}`
      : `https://www.showroom-live.com/room/profile?room_id=${room.roomId}`,
    roomName: room.roomName,
  };
}

/** epoch（秒 / ミリ秒のどちらでも）を ISO 文字列にする。読めなければ null。 */
export function normalizeEpochToIso(value) {
  const epoch = typeof value === "string" ? Number(value) : value;
  if (typeof epoch !== "number" || !Number.isFinite(epoch) || epoch <= 0) return null;
  // 1e12 未満は秒とみなす（2001-09-09 以降のミリ秒は 1e12 を超える）
  const ms = epoch < 1e12 ? epoch * 1000 : epoch;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getUTCFullYear();
  if (year < 2000 || year > 2100) return null;
  return date.toISOString();
}

async function verifyByKey(key) {
  const status = await fetchJson(
    `${SHOWROOM_STATUS_API}?room_url_key=${encodeURIComponent(key)}`,
  );
  if (!status) return null;
  return {
    roomId: Number(status.room_id),
    roomName: status.room_name,
    roomUrlKey: key,
  };
}

async function verifyById(roomId) {
  const profile = await fetchJson(`${SHOWROOM_PROFILE_API}?room_id=${roomId}`);
  if (!profile) return null;
  return {
    roomId,
    roomName: profile.room_name,
    roomUrlKey:
      typeof profile.room_url_key === "string" ? profile.room_url_key : null,
  };
}

/**
 * ENTRY 734 ページから本人 SHOWROOM room を解決する。
 * @returns {{roomId, roomUrlKey, roomUrl, roomName, sns, source}|null}
 *   本人確認できなければ null（推測しない）。
 */
export async function resolveMilyRoom(env = process.env) {
  if (roomCache && Date.now() - roomCache.at < ROOM_CACHE_TTL_MS) {
    return roomCache.value;
  }

  let sns = [];
  const candidates = [];

  try {
    const page = await fetchWithTimeout(ENTRY_URL, { headers: { Accept: "text/html" } });
    if (page.ok) {
      const html = await page.text();
      if (looksLikeEntryPage(html)) {
        sns = filterMilyLinks(extractSnsLinks(html));
        // 最初の一致で打ち切らず、全候補を本人確認する
        for (const key of extractShowroomKeys(html)) {
          candidates.push(await verifyByKey(key).catch(() => null));
        }
        for (const roomId of extractShowroomRoomIds(html).slice(0, 10)) {
          candidates.push(await verifyById(roomId).catch(() => null));
        }
      }
    }
  } catch {
    // 取得失敗はキャッシュしない
  }

  const room = pickUniqueRoom(candidates);
  if (room) {
    const value = { ...room, sns, source: "entry-page" };
    roomCache = { at: Date.now(), value };
    return value;
  }

  // 自動解決できないときだけ optional fallback。これも profile で本人確認する。
  const fallbackId = env?.MILY_SHOWROOM_ROOM_ID;
  if (fallbackId && /^\d+$/.test(String(fallbackId))) {
    const verified = await verifyById(Number(fallbackId)).catch(() => null);
    const picked = pickUniqueRoom([verified]);
    if (picked) {
      const value = { ...picked, sns, source: "env-fallback" };
      roomCache = { at: Date.now(), value };
      return value;
    }
  }

  // 未解決・失敗はキャッシュしない
  return null;
}

/**
 * 実ライブ判定。**status API の is_live === true のみ**を live とする。
 * @returns {{state: "live"|"offline"|"unknown", liveId: number|null, startedAt: string|null}}
 */
export function readLiveState(status) {
  if (!status || typeof status !== "object") {
    return { state: "unknown", liveId: null, startedAt: null };
  }
  const isLive = status.is_live;
  if (isLive === true || isLive === 1) {
    const liveId = Number(status.live_id);
    return {
      state: "live",
      liveId: Number.isInteger(liveId) && liveId > 0 ? liveId : null,
      startedAt: normalizeEpochToIso(status.started_at ?? status.current_live_started_at),
    };
  }
  if (isLive === false || isLive === 0) {
    return { state: "offline", liveId: null, startedAt: null };
  }
  // is_live が無い / 型が違う → 推測しない
  return { state: "unknown", liveId: null, startedAt: null };
}

/** 本人確認済み room の実ライブ状態を取得する。失敗は unknown。 */
export async function fetchShowroomStatus(room) {
  if (!room?.roomId) return { state: "unknown", liveId: null, startedAt: null };
  const query = room.roomUrlKey
    ? `?room_url_key=${encodeURIComponent(room.roomUrlKey)}`
    : `?room_id=${room.roomId}`;
  try {
    const status = await fetchJson(`${SHOWROOM_STATUS_API}${query}`);
    if (!status) return { state: "unknown", liveId: null, startedAt: null };
    // 別 room の応答を live 判定に使わない
    const returnedId = Number(status.room_id);
    if (Number.isInteger(returnedId) && returnedId > 0 && returnedId !== room.roomId) {
      return { state: "unknown", liveId: null, startedAt: null };
    }
    return readLiveState(status);
  } catch {
    return { state: "unknown", liveId: null, startedAt: null };
  }
}

/** next_live から次回予定を取得する（予定専用）。 */
export function readNextLive(data) {
  if (!data || typeof data !== "object") return { state: "unknown", at: null };
  const raw = data.epoch ?? data.next_live_start_at ?? data.started_at ?? null;
  if (raw === null || raw === undefined) return { state: "none", at: null };
  const at = normalizeEpochToIso(raw);
  return at ? { state: "scheduled", at } : { state: "unknown", at: null };
}

export async function fetchNextLive(room) {
  if (!room?.roomId) return { state: "unknown", at: null };
  try {
    const data = await fetchJson(`${SHOWROOM_NEXT_LIVE_API}?room_id=${room.roomId}`);
    if (!data) return { state: "unknown", at: null };
    return readNextLive(data);
  } catch {
    return { state: "unknown", at: null };
  }
}
