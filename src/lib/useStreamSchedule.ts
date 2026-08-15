import { useEffect, useState } from "react";
import {
  streamSchedule,
  upcomingSlots,
  type StreamSlot,
} from "../data/streamSchedule";

/**
 * /api/mily-schedule の取得を1か所に集約するフック。
 * - モジュールスコープで共有し、複数コンポーネントで使っても取得は1回
 * - 成功結果は 5 分 TTL でキャッシュ。**失敗はキャッシュしない**ので、
 *   初回失敗のあとも次の利用時に再試行できる
 * - roomUrl は SHOWROOM ドメインのURLだけを通す
 * - 予定は毎分 poll する必要がないため、ライブ状態
 *   （useMilyRealtimeStatus）とは別系統にしている
 */
type ScheduleResponse = {
  slots?: StreamSlot[];
  source?: { roomUrl?: string | null };
};

type FetchedSchedule = {
  slots: StreamSlot[];
  roomUrl: string | null;
};

const EMPTY: FetchedSchedule = { slots: [], roomUrl: null };
const SCHEDULE_TTL_MS = 5 * 60 * 1000;

let cached: { at: number; value: FetchedSchedule } | null = null;
let inFlight: Promise<FetchedSchedule> | null = null;

function fetchSchedule(): Promise<FetchedSchedule> {
  if (cached && Date.now() - cached.at < SCHEDULE_TTL_MS) {
    return Promise.resolve(cached.value);
  }
  if (inFlight) return inFlight;

  inFlight = fetch("/api/mily-schedule")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data: ScheduleResponse | null) => {
      const slots = Array.isArray(data?.slots) ? data.slots : [];
      const url = data?.source?.roomUrl;
      const roomUrl =
        typeof url === "string" &&
        url.startsWith("https://www.showroom-live.com/")
          ? url
          : null;
      const value = { slots, roomUrl };
      // 成功だけキャッシュする
      cached = { at: Date.now(), value };
      return value;
    })
    .catch(() => EMPTY)
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function useStreamSchedule(): {
  slots: StreamSlot[];
  roomUrl: string | null;
} {
  const [fetched, setFetched] = useState<FetchedSchedule>(EMPTY);

  useEffect(() => {
    let active = true;
    fetchSchedule().then((result) => {
      if (active) setFetched(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return {
    slots: upcomingSlots(streamSchedule, fetched.slots),
    roomUrl: fetched.roomUrl,
  };
}

const dateFmt = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  month: "numeric",
  day: "numeric",
  weekday: "short",
});

export function slotStart(slot: StreamSlot): Date {
  return new Date(`${slot.date}T${slot.time}:00+09:00`);
}

export function formatSlotDate(slot: StreamSlot): string {
  return dateFmt.format(slotStart(slot));
}

/** JSTの今日（YYYY-MM-DD） */
export function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(
    new Date(),
  );
}

/**
 * 配信枠の状態。実際のライブ状態は取得していないため、
 * 「配信中の時間帯」（開始〜約3時間）という控えめな表現に留める。
 */
export type SlotStatus = "live-window" | "today" | "upcoming";

export function slotStatus(slot: StreamSlot, now: number = Date.now()): SlotStatus {
  if (slotStart(slot).getTime() <= now) return "live-window";
  if (slot.date === todayKey()) return "today";
  return "upcoming";
}
