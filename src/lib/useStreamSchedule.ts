import { useEffect, useState } from "react";
import {
  streamSchedule,
  upcomingSlots,
  type StreamSlot,
} from "../data/streamSchedule.ts";
import type { ScheduleAvailability } from "./supportCalendar.ts";

/**
 * /api/mily-schedule の取得を1か所に集約するフック。
 * - モジュールスコープで共有し、複数コンポーネントで使っても取得は1回
 * - 成功結果は 5 分 TTL でキャッシュ。**失敗はキャッシュしない**ので、
 *   初回失敗のあとも次の利用時に再試行できる
 * - roomUrl は SHOWROOM ドメインのURLだけを通す
 * - 予定は毎分 poll する必要がないため、ライブ状態
 *   （useMilyRealtimeStatus）とは別系統にしている
 */

/**
 * `/api/mily-schedule` のresponse contract。
 * room解決や上流取得に失敗しても endpoint は HTTP 200 のまま
 * `{ ok: false, slots: [] }` を返す仕様なので、payloadの `ok` を契約に含める。
 */
type ScheduleResponse = {
  ok?: boolean;
  slots?: StreamSlot[];
  source?: { roomUrl?: string | null };
};

export type StreamScheduleSnapshot = {
  slots: StreamSlot[];
  roomUrl: string | null;
  availability: ScheduleAvailability;
};

type ScheduleFetchResponse = {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
};

type ScheduleFetcher = (input: string) => Promise<ScheduleFetchResponse>;

type FetchedSchedule = Omit<StreamScheduleSnapshot, "availability">;

const EMPTY: FetchedSchedule = { slots: [], roomUrl: null };
export const INITIAL_STREAM_SCHEDULE_STATE: StreamScheduleSnapshot = {
  ...EMPTY,
  availability: "loading",
};
const SCHEDULE_TTL_MS = 5 * 60 * 1000;

function parseScheduleResponse(data: unknown): FetchedSchedule {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid schedule response");
  }
  const response = data as ScheduleResponse;
  // HTTP 200 でも ok:true 以外は失敗。成功として扱わずキャッシュもしない。
  if (response.ok !== true) {
    throw new Error("Schedule payload reported failure");
  }
  if (!Array.isArray(response.slots)) {
    throw new Error("Invalid schedule slots");
  }
  const url = response.source?.roomUrl;
  return {
    slots: response.slots,
    roomUrl:
      typeof url === "string" &&
      url.startsWith("https://www.showroom-live.com/")
        ? url
        : null,
  };
}

export function createStreamScheduleLoader(options?: {
  fetcher?: ScheduleFetcher;
  now?: () => number;
}): () => Promise<StreamScheduleSnapshot> {
  const fetcher = options?.fetcher ?? fetch;
  const now = options?.now ?? Date.now;
  let cached: { at: number; value: FetchedSchedule } | null = null;
  let inFlight: Promise<StreamScheduleSnapshot> | null = null;

  return function loadSchedule(): Promise<StreamScheduleSnapshot> {
    if (cached && now() - cached.at < SCHEDULE_TTL_MS) {
      return Promise.resolve({ ...cached.value, availability: "ok" });
    }
    if (inFlight) return inFlight;

    inFlight = fetcher("/api/mily-schedule")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const value = parseScheduleResponse(data);
        // 成功だけキャッシュする
        cached = { at: now(), value };
        return { ...value, availability: "ok" as const };
      })
      .catch(() => ({ ...EMPTY, availability: "unavailable" as const }))
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  };
}

const loadStreamSchedule = createStreamScheduleLoader();

export type StreamScheduleView = {
  /** 手入力fallback＋API由来のmerge済み配信枠（既存呼び出し側の契約） */
  slots: StreamSlot[];
  /**
   * `src/data/streamSchedule.ts` の確認済み手入力fallbackだけ。
   * API取得の成否と無関係に確認済みなので、失敗時も表示側で残せる。
   */
  manualSlots: StreamSlot[];
  roomUrl: string | null;
  availability: ScheduleAvailability;
};

export function useStreamSchedule(): StreamScheduleView {
  const [fetched, setFetched] = useState<StreamScheduleSnapshot>(
    INITIAL_STREAM_SCHEDULE_STATE,
  );

  useEffect(() => {
    let active = true;
    loadStreamSchedule().then((result) => {
      if (active) setFetched(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return {
    slots: upcomingSlots(streamSchedule, fetched.slots),
    manualSlots: upcomingSlots(streamSchedule, []),
    roomUrl: fetched.roomUrl,
    availability: fetched.availability,
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
 * 予定由来の状態なので「開始時刻を過ぎています」という表現に留める。
 * 実ライブ（ただいまSHOWROOMで配信中）は /api/mily-live のみが根拠。
 */
export type SlotStatus = "past-start" | "today" | "upcoming";

export function slotStatus(slot: StreamSlot, now: number = Date.now()): SlotStatus {
  if (slotStart(slot).getTime() <= now) return "past-start";
  if (slot.date === todayKey()) return "today";
  return "upcoming";
}
