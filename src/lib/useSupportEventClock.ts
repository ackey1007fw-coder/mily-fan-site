import { useSyncExternalStore } from "react";
import { contest } from "../data/contest.ts";
import { patonFifteenXBonusSchedule } from "../data/patonVoteBonus.ts";
import {
  supportEvents,
  type SupportEventSchedule,
} from "../data/supportEvents.ts";
import { tokyoDateKey } from "./monthCalendar.ts";
import { nextDisplayStatusBoundary } from "./supportCalendar.ts";

const MAX_TIMEOUT_MS = 2_147_483_647;
const listeners = new Set<() => void>();
let currentNow = Date.now();
let timer: number | null = null;

export function voteStartDayBoundary(
  schedule: SupportEventSchedule,
  now: number,
): number | null {
  if (schedule.state !== "confirmed-period" || schedule.allDay) return null;
  const startDay = Date.parse(
    `${tokyoDateKey(Date.parse(schedule.start))}T00:00:00+09:00`,
  );
  return startDay > now ? startDay : null;
}

export function nextSupportEventBoundary(now: number): number | null {
  if (!Number.isFinite(now)) {
    throw new Error("now must be a finite timestamp");
  }

  const contestPhase = contest.currentPhase;
  const voteStartDayBoundaries = supportEvents.flatMap(({ kind, schedule }) => {
    if (kind !== "vote") return [];
    const startDay = voteStartDayBoundary(schedule, now);
    return startDay === null ? [] : [startDay];
  });
  const contestEndBoundary =
    contestPhase?.start && contestPhase.end
      ? nextDisplayStatusBoundary(
          {
            state: "confirmed-period",
            start: contestPhase.start,
            end: contestPhase.end,
            allDay: true,
            timezone: "Asia/Tokyo",
          },
          Math.max(
            now,
            Date.parse(`${contestPhase.start}T00:00:00+09:00`),
          ),
        )
      : null;
  const boundaries = [
    ...voteStartDayBoundaries,
    ...supportEvents.map(({ schedule }) =>
      nextDisplayStatusBoundary(schedule, now),
    ),
    nextDisplayStatusBoundary(patonFifteenXBonusSchedule, now),
    contestEndBoundary,
  ].filter((value): value is number => value !== null && value > now);
  return boundaries.length > 0 ? Math.min(...boundaries) : null;
}

function scheduleBoundary(): void {
  if (timer !== null) window.clearTimeout(timer);
  const boundary = nextSupportEventBoundary(currentNow);
  timer =
    boundary === null
      ? null
      : window.setTimeout(
          refreshClock,
          Math.min(MAX_TIMEOUT_MS, Math.max(0, boundary - currentNow)),
        );
}

function refreshClock(): void {
  currentNow = Date.now();
  scheduleBoundary();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) {
    currentNow = Date.now();
    window.addEventListener("focus", refreshClock);
    document.addEventListener("visibilitychange", refreshClock);
    scheduleBoundary();
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
      window.removeEventListener("focus", refreshClock);
      document.removeEventListener("visibilitychange", refreshClock);
    }
  };
}

function getSnapshot(): number {
  return currentNow;
}

/**
 * SupportEvent の開始・終了境界で全subscriberを再renderする共有clock。
 * timerとglobal listenerは1組だけ持ち、sleep復帰時も現在時刻へ追従する。
 */
export function useSupportEventClock(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
