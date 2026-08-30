/**
 * 番組の放送枠フェーズを「時刻から」再評価するための store。
 *
 * 放送枠（日曜 10:00-13:00 JST）は shared/radio-program.js が持つ確定事実なので、
 * 外部 API のレスポンスに保存された古い値へ依存する必要がない。
 * ここでは **10:00 / 13:00 の境界ちょうどで購読者へ通知**し、
 * API の成否と関係なく PROGRAM_TODAY → PROGRAM_WINDOW → IDLE を遷移させる。
 *
 * React 非依存なのでそのままテストできる。
 */
import {
  msUntilNextPhaseChange,
  schedulePhase,
  type SchedulePhase,
} from "../../shared/radio-program.js";

export type ScheduleClock = {
  getSnapshot: () => SchedulePhase;
  subscribe: (listener: () => void) => () => void;
};

type Timers = {
  setTimeout: (handler: () => void, ms: number) => number;
  clearTimeout: (id: number) => void;
  now: () => number;
};

const defaultTimers: Timers = {
  setTimeout: (handler, ms) => globalThis.setTimeout(handler, ms) as unknown as number,
  clearTimeout: (id) => globalThis.clearTimeout(id),
  now: () => Date.now(),
};

export function createSchedulePhaseStore(timers: Timers = defaultTimers): ScheduleClock {
  let phase: SchedulePhase = safePhase(timers.now());
  let timerId: number | null = null;
  const listeners = new Set<() => void>();

  function safePhase(now: number): SchedulePhase {
    try {
      return schedulePhase(now);
    } catch {
      // Asia/Tokyo が読めない環境では放送枠を主張しない
      return "idle";
    }
  }

  const clearTimer = () => {
    if (timerId !== null) {
      timers.clearTimeout(timerId);
      timerId = null;
    }
  };

  /** 現在時刻で再評価する。変化していれば通知する。 */
  const reevaluate = () => {
    const next = safePhase(timers.now());
    if (next !== phase) {
      phase = next;
      for (const listener of listeners) listener();
    }
  };

  const scheduleBoundary = () => {
    clearTimer();
    if (listeners.size === 0) return;
    let delay: number;
    try {
      delay = msUntilNextPhaseChange(timers.now());
    } catch {
      return;
    }
    timerId = timers.setTimeout(() => {
      timerId = null;
      reevaluate();
      scheduleBoundary();
    }, delay);
  };

  // タブが隠れている間に境界をまたいだ場合の取りこぼしを防ぐ
  const onWake = () => {
    reevaluate();
    scheduleBoundary();
  };

  let unbind: (() => void) | null = null;

  const bindWindowEvents = () => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("focus", onWake);
    document.addEventListener("visibilitychange", onWake);
    return () => {
      window.removeEventListener("focus", onWake);
      document.removeEventListener("visibilitychange", onWake);
    };
  };

  return {
    getSnapshot: () => phase,
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) {
        unbind = bindWindowEvents();
        reevaluate();
        scheduleBoundary();
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          clearTimer();
          unbind?.();
          unbind = null;
        }
      };
    },
  };
}

/** API通信なしで放送枠の境界を共有する、クライアント共通の時計。 */
export const schedulePhaseStore = createSchedulePhaseStore();
