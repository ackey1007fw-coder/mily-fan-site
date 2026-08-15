// api/mily-schedule.js
// 配信予定の自動取得（Vercel Serverless Function）。
//
// room 解決は server/mily-showroom.js に集約し、api/mily-live.js と共有する。
// **room ID をコードに直書きしない・推測しない。**
// AGE / Marquez の schedule JSON は「予定」専用で、ライブ判定には使わない
// （実ライブ判定は /api/mily-live）。
//
// MILY_SCHEDULE_URL を設定した場合のみ、確認済み URL で明示上書きできる。
// どの段階で失敗しても ok:false / slots:[] を返すだけでサイトは壊れない。
import { fetchWithTimeout, resolveMilyRoom } from "../server/mily-showroom.js";

// 既存の import 元（scripts/probe-schedule.mjs, scripts/watch-public-sources.mjs,
// 既存テスト）を壊さないための再エクスポート。
export {
  extractShowroomKeys,
  extractShowroomRoomIds,
  extractSnsLinks,
  filterMilyLinks,
  looksLikeEntryPage,
  roomNameMatchesMily,
} from "../server/mily-showroom.js";

const AGE_SCHEDULE_BASE = "https://marquez.age.co.jp/schedule/";

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

    // 本人確認済みの room 解決（env fallback の本人確認も共有モジュール側で行う）
    let resolved = null;
    try {
      resolved = await resolveMilyRoom(env);
    } catch {
      resolved = null;
    }

    const roomId = resolved?.roomId ?? null;
    const mode = resolved?.source ?? "unresolved";

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
