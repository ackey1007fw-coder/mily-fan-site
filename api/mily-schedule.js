// api/mily-schedule.js
// 配信予定の自動取得（Vercel Serverless Function）。
//
// この関数は毎回 ENTRY 734 の公開ページを起点に自動解決する:
//   1. https://2026.misscircle.jp/entry/734 を取得し、本人ページであることを
//      検証（"734" と みりぃ / 三橋 / Mily の表記を確認）
//   2. ページ内（動的ページの埋め込みJSON含む）から SHOWROOM リンクを抽出
//   3. room_url_key → SHOWROOM room/status API で数値 room_id を解決し、
//      ルーム名の人物整合性を検証
//   4. https://marquez.age.co.jp/schedule/<room_id>.json を取得・正規化
//
// room ID をコードに直書きしない。環境変数は「自動解決が失敗したときの
// 任意フォールバック」であり、必須の手入力値ではない:
//   MILY_SCHEDULE_URL     … 確認済み schedule JSON の完全URL（明示上書き）
//   MILY_SHOWROOM_ROOM_ID … 自動解決不能時のみ使われる room ID
//
// どの段階で失敗しても ok:false / slots:[] を返すだけでサイトは壊れない。
// フロント側は手入力リスト（src/data/streamSchedule.ts）にフォールバックする。

const ENTRY_URL = "https://2026.misscircle.jp/entry/734";
const SHOWROOM_STATUS_API =
  "https://www.showroom-live.com/api/room/status?room_url_key=";
const AGE_SCHEDULE_BASE = "https://marquez.age.co.jp/schedule/";
const FETCH_TIMEOUT_MS = 8000;
const RESOLVE_TTL_MS = 6 * 60 * 60 * 1000;

const USER_AGENT =
  "Mozilla/5.0 (compatible; MilyFanSite/1.0; +https://mily-fan-site.vercel.app)";

// 直近の解決結果（room ID など）をプロセス内で保持し、上流への負荷を抑える。
let resolvedCache = null;

async function fetchWithTimeout(url, init = {}) {
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

/** JSON 埋め込みの \/ エスケープも戻して URL を拾えるようにする。 */
function unescapeJsonSlashes(html) {
  return html.replaceAll("\\/", "/");
}

/** ENTRY 734 のページ本文が本人のものかを軽く検証する。 */
export function looksLikeEntryPage(html) {
  if (typeof html !== "string" || html.length === 0) return false;
  if (!html.includes("734")) return false;
  return /みりぃ|三橋|mily/i.test(html);
}

/** SHOWROOM の room_url_key 候補をページから抽出する。 */
export function extractShowroomKeys(html) {
  const text = unescapeJsonSlashes(String(html ?? ""));
  const keys = new Set();
  for (const match of text.matchAll(
    /showroom-live\.com\/r\/([A-Za-z0-9_-]+)/g,
  )) {
    keys.add(match[1]);
  }
  for (const match of text.matchAll(/room_url_key=([A-Za-z0-9_-]+)/g)) {
    keys.add(match[1]);
  }
  return [...keys];
}

/** ページに掲載されている SNS リンクを抽出する（報告・確認用）。 */
export function extractSnsLinks(html) {
  const text = unescapeJsonSlashes(String(html ?? ""));
  const found = new Set();
  const re =
    /https:\/\/(?:x\.com|twitter\.com|(?:www\.)?instagram\.com|(?:www\.)?tiktok\.com|(?:www\.)?showroom-live\.com)\/[A-Za-z0-9_@./-]+/g;
  for (const match of text.matchAll(re)) {
    found.add(match[0].replace(/[.,)]+$/, ""));
  }
  return [...found];
}

/** SHOWROOM ルーム名が本人のものかを検証する。 */
export function roomNameMatchesMily(roomName) {
  return typeof roomName === "string" && /みりぃ|三橋|mily/i.test(roomName);
}

export function normalizeSlot(item) {
  const date = item && typeof item.start_date === "string" ? item.start_date : null;
  const hour = Number(item?.start_hour);
  const minute = Number(item?.start_minute);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return {
    date,
    time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}

export function normalizeSchedule(data) {
  if (!Array.isArray(data)) return [];
  const seen = new Set();
  return data
    .map(normalizeSlot)
    .filter(Boolean)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .filter((slot) => {
      const key = `${slot.date}T${slot.time}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}

/** ENTRY 734 ページから room を自動解決する。失敗時は null。 */
async function resolveFromEntryPage() {
  if (resolvedCache && Date.now() - resolvedCache.at < RESOLVE_TTL_MS) {
    return resolvedCache.value;
  }

  const page = await fetchWithTimeout(ENTRY_URL, {
    headers: { Accept: "text/html" },
  });
  if (!page.ok) return null;
  const html = await page.text();
  if (!looksLikeEntryPage(html)) return null;

  const sns = extractSnsLinks(html);
  const keys = extractShowroomKeys(html);

  for (const key of keys) {
    const statusRes = await fetchWithTimeout(
      `${SHOWROOM_STATUS_API}${encodeURIComponent(key)}`,
      { headers: { Accept: "application/json" } },
    );
    if (!statusRes.ok) continue;
    const status = await statusRes.json().catch(() => null);
    const roomId = Number(status?.room_id);
    if (!Number.isInteger(roomId) || roomId <= 0) continue;
    if (!roomNameMatchesMily(status?.room_name)) continue;

    const value = {
      roomUrlKey: key,
      roomUrl: `https://www.showroom-live.com/r/${key}`,
      roomId,
      roomName: status.room_name,
      sns,
    };
    resolvedCache = { at: Date.now(), value };
    return value;
  }

  // SNS だけでも報告できるよう、room 不明でも sns は返す
  const value = { roomUrlKey: null, roomUrl: null, roomId: null, roomName: null, sns };
  resolvedCache = { at: Date.now(), value };
  return value;
}

async function fetchSlots(scheduleUrl) {
  const r = await fetchWithTimeout(scheduleUrl, {
    headers: { Accept: "application/json" },
  });
  if (!r.ok) return { ok: false, reason: `HTTP ${r.status}`, slots: [] };
  const data = await r.json().catch(() => null);
  return { ok: true, slots: normalizeSchedule(data) };
}

/**
 * 解決チェーン全体を実行してレスポンス形のオブジェクトを返す。
 * handler（Vercel）と scripts/probe-schedule.mjs（CI検証）の両方から使う。
 */
export async function resolveAndFetchSchedule(env = process.env) {
  try {
    // 明示上書き（確認済みURLがある場合のみ運用者が設定する）
    const directUrl = env.MILY_SCHEDULE_URL;
    if (directUrl && /^https:\/\//.test(directUrl)) {
      const result = await fetchSlots(directUrl);
      return {
        ...result,
        source: { mode: "explicit-url", scheduleUrl: directUrl },
      };
    }

    // 自動解決（ENTRY 734 ページ起点）
    let resolved = null;
    try {
      resolved = await resolveFromEntryPage();
    } catch {
      resolved = null;
    }

    let roomId = resolved?.roomId ?? null;
    let mode = "entry-page";

    // 自動解決不能時のみ optional fallback を使う
    if (!roomId) {
      const fallbackId = env.MILY_SHOWROOM_ROOM_ID;
      if (fallbackId && /^\d+$/.test(fallbackId)) {
        roomId = Number(fallbackId);
        mode = "env-fallback";
      }
    }

    if (!roomId) {
      return {
        ok: false,
        slots: [],
        reason: "room not resolved",
        source: { mode: "unresolved", sns: resolved?.sns ?? [] },
      };
    }

    const scheduleUrl = `${AGE_SCHEDULE_BASE}${roomId}.json`;
    const result = await fetchSlots(scheduleUrl);
    return {
      ...result,
      source: {
        mode,
        scheduleUrl,
        roomId,
        roomUrlKey: resolved?.roomUrlKey ?? null,
        roomUrl: resolved?.roomUrl ?? null,
        roomName: resolved?.roomName ?? null,
        sns: resolved?.sns ?? [],
      },
    };
  } catch (err) {
    return { ok: false, slots: [], reason: err.message };
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=180,stale-while-revalidate=600");
  if (req.method === "OPTIONS") return res.status(200).end();
  const payload = await resolveAndFetchSchedule();
  return res.status(200).json(payload);
}
