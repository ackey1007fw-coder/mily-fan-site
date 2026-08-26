/**
 * Asia/Tokyo の civil date が変わったときに購読者へ通知する store。
 *
 * `/support/` の月間カレンダーは `today` を描画時の `Date.now()` から
 * 一度だけ決めていると、タブを開いたまま JST 0:00 を跨いでも再描画されない。
 * 放送枠時計（日曜 10:00 / 13:00）では毎日の日付境界をカバーできないので、
 * 次の JST 0:00 で通知し、focus / visibilitychange でも取りこぼしを拾う。
 *
 * React 非依存なのでそのままテストできる。
 */
import { msUntilNextTokyoMidnight, tokyoDateKey } from "./monthCalendar.ts";

export type TokyoNowClock = {
  getSnapshot: () => number;
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

export function createTokyoNowStore(timers: Timers = defaultTimers): TokyoNowClock {
  let snapshot = timers.now();
  let timerId: number | null = null;
  const listeners = new Set<() => void>();

  const clearTimer = () => {
    if (timerId !== null) {
      timers.clearTimeout(timerId);
      timerId = null;
    }
  };

  const notify = () => {
    for (const listener of listeners) listener();
  };

  /** 現在時刻で civil date を再評価する。日付が変わっていれば通知する。 */
  const reevaluate = () => {
    const next = timers.now();
    if (tokyoDateKey(next) === tokyoDateKey(snapshot)) return;
    snapshot = next;
    notify();
  };

  const scheduleMidnight = () => {
    clearTimer();
    if (listeners.size === 0) return;
    const delay = msUntilNextTokyoMidnight(timers.now());
    timerId = timers.setTimeout(() => {
      timerId = null;
      reevaluate();
      scheduleMidnight();
    }, delay);
  };

  // タブが隠れている間に 0:00 をまたいだ場合の取りこぼしを防ぐ
  const onWake = () => {
    reevaluate();
    scheduleMidnight();
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
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) {
        unbind = bindWindowEvents();
        reevaluate();
        scheduleMidnight();
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
