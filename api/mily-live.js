// api/mily-live.js
// SHOWROOM の実ライブ判定専用エンドポイント。
//
// schedule（分単位でよい）と live（数十秒で更新したい）はキャッシュ要件が
// 違うので /api/mily-schedule とは分けている。
//
// live.state は3値:
//   "live"    … status API の is_live === true
//   "offline" … status API が明確に false を返した
//   "unknown" … 取得失敗 / 不正JSON / 型不一致 / 本人 room 不一致
// **unknown を offline にも live にも変換しない。**

import {
  fetchNextLive,
  fetchShowroomStatus,
  resolveMilyRoom,
} from "../server/mily-showroom.js";

export function buildLivePayload({ room, live, next, now = Date.now() }) {
  return {
    ok: Boolean(room?.roomId),
    roomUrl: room?.roomUrl ?? null,
    live: {
      state: live?.state ?? "unknown",
      liveId: live?.liveId ?? null,
      startedAt: live?.startedAt ?? null,
      observedAt: new Date(now).toISOString(),
    },
    next: {
      state: next?.state ?? "unknown",
      at: next?.at ?? null,
    },
  };
}

export async function getLiveStatus(env = process.env) {
  const room = await resolveMilyRoom(env).catch(() => null);
  if (!room) {
    return buildLivePayload({
      room: null,
      live: { state: "unknown", liveId: null, startedAt: null },
      next: { state: "unknown", at: null },
    });
  }
  const [live, next] = await Promise.all([
    fetchShowroomStatus(room),
    fetchNextLive(room),
  ]);
  return buildLivePayload({ room, live, next });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=12,stale-while-revalidate=12");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ ok: false, error: "method not allowed" });
  }
  try {
    return res.status(200).json(await getLiveStatus());
  } catch {
    return res.status(200).json(
      buildLivePayload({
        room: null,
        live: { state: "unknown", liveId: null, startedAt: null },
        next: { state: "unknown", at: null },
      }),
    );
  }
}
