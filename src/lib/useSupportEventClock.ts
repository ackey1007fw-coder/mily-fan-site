import { useSyncExternalStore } from "react";
import { patonFifteenXBonusSchedule } from "../data/patonVoteBonus.ts";
import { supportEvents } from "../data/supportEvents.ts";
import { nextDisplayStatusBoundary } from "./supportCalendar.ts";

const MAX_TIMEOUT_MS = 2_147_483_647;
const listeners = new Set<() => void>();
let currentNow = Date.now();
let timer: number | null = null;

export function nextSupportEventBoundary(now: number): number | null {
  if (!Number.isFinite(now)) {
    throw new Error("now must be a finite timestamp");
  }

  const boundaries = [
    ...supportEvents.map(({ schedule }) =>
      nextDisplayStatusBoundary(schedule, now),
    ),
    nextDisplayStatusBoundary(patonFifteenXBonusSchedule, now),
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
