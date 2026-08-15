// api/mily-schedule.js
// 配信予定の自動取得（Vercel Serverless Function）。
//
// ENTRY 734 ページがどの配信予定データを参照しているか（SHOWROOM room ID /
// schedule JSON endpoint）は、まだ実ページで確認できていない。
// 推測で room ID を埋め込まないため、取得元は環境変数でのみ有効化する:
//
//   MILY_SCHEDULE_URL        … 確認済みの schedule JSON の完全URL（最優先）
//   MILY_SHOWROOM_ROOM_ID    … AGE schedule API の room ID
//                              (https://marquez.age.co.jp/schedule/<ID>.json)
//
// どちらも未設定の間は ok:false / slots:[] を返すだけで、サイトは壊れない。
// フロント側は手入力リスト（src/data/streamSchedule.ts）にフォールバックする。

function resolveScheduleUrl() {
  const direct = process.env.MILY_SCHEDULE_URL;
  if (direct && /^https:\/\//.test(direct)) return direct;
  const roomId = process.env.MILY_SHOWROOM_ROOM_ID;
  if (roomId && /^\d+$/.test(roomId)) {
    return `https://marquez.age.co.jp/schedule/${roomId}.json`;
  }
  return null;
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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=180,stale-while-revalidate=600");
  if (req.method === "OPTIONS") return res.status(200).end();

  const scheduleUrl = resolveScheduleUrl();
  if (!scheduleUrl) {
    return res
      .status(200)
      .json({ ok: false, slots: [], reason: "schedule source not configured" });
  }

  try {
    const r = await fetch(scheduleUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MilyFanSite/1.0; +https://mily-fan-site.vercel.app)",
        Accept: "application/json",
      },
    });
    if (!r.ok) {
      return res
        .status(200)
        .json({ ok: false, slots: [], reason: `HTTP ${r.status}` });
    }
    const slots = normalizeSchedule(await r.json());
    return res.status(200).json({ ok: true, slots, source: "schedule-json" });
  } catch (err) {
    return res.status(200).json({ ok: false, slots: [], reason: err.message });
  }
}
