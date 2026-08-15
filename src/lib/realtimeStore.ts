/**
 * ポーリングの共通部品（React 非依存 = そのままテストできる）。
 *
 * - 前回の取得が終わってから次を予約する（setInterval の無条件連打をしない）
 * - 同時に複数の取得を走らせない
 * - 画面が隠れている間は止め、visible / focus / online 復帰で即取得
 * - 購読者が0になったら止める
 */
export type PollStoreOptions<T> = {
  fetcher: () => Promise<T>;
  intervalMs: number;
  /** 取得失敗時に前回値を捨てるか（ライブ状態は捨てたい） */
  clearOnError?: boolean;
};

export type PollStore<T> = {
  getSnapshot: () => T | null;
  subscribe: (listener: () => void) => () => void;
  /** 手動更新（テスト・即時取得用）。 */
  refresh: () => Promise<void>;
};

type Timers = {
  setTimeout: (handler: () => void, ms: number) => number;
  clearTimeout: (id: number) => void;
};

const defaultTimers: Timers = {
  setTimeout: (handler, ms) => globalThis.setTimeout(handler, ms) as unknown as number,
  clearTimeout: (id) => globalThis.clearTimeout(id),
};

export function createPollStore<T>(
  options: PollStoreOptions<T>,
  timers: Timers = defaultTimers,
): PollStore<T> {
  let value: T | null = null;
  let inFlight: Promise<void> | null = null;
  let timerId: number | null = null;
  const listeners = new Set<() => void>();

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const clearTimer = () => {
    if (timerId !== null) {
      timers.clearTimeout(timerId);
      timerId = null;
    }
  };

  const isHidden = () =>
    typeof document !== "undefined" && document.visibilityState === "hidden";

  const scheduleNext = () => {
    clearTimer();
    if (listeners.size === 0 || isHidden()) return;
    timerId = timers.setTimeout(() => {
      void refresh();
    }, options.intervalMs);
  };

  const refresh = (): Promise<void> => {
    // 重複 fetch 禁止: 進行中があればそれを共有する
    if (inFlight) return inFlight;
    inFlight = options
      .fetcher()
      .then((next) => {
        value = next;
        notify();
      })
      .catch(() => {
        if (options.clearOnError) {
          value = null;
          notify();
        }
      })
      .finally(() => {
        inFlight = null;
        scheduleNext();
      });
    return inFlight;
  };

  const onWake = () => {
    if (listeners.size === 0) return;
    if (isHidden()) {
      clearTimer();
      return;
    }
    void refresh();
  };

  const bindWindowEvents = () => {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("focus", onWake);
    window.addEventListener("online", onWake);
    document.addEventListener("visibilitychange", onWake);
    return () => {
      window.removeEventListener("focus", onWake);
      window.removeEventListener("online", onWake);
      document.removeEventListener("visibilitychange", onWake);
    };
  };

  let unbind: (() => void) | null = null;

  return {
    getSnapshot: () => value,
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) {
        unbind = bindWindowEvents();
        void refresh();
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
    refresh,
  };
}

/** observedAt がこの時間より古い LIVE 情報は unknown に失効させる。 */
export const LIVE_STALE_MS = 90_000;

export function isObservationStale(
  observedAt: string | null | undefined,
  now: number = Date.now(),
  staleMs: number = LIVE_STALE_MS,
): boolean {
  if (typeof observedAt !== "string") return true;
  const parsed = Date.parse(observedAt);
  if (Number.isNaN(parsed)) return true;
  return now - parsed >= staleMs;
}

/** /api/mily-live のレスポンス。 */
export type LivePayload = {
  ok?: boolean;
  roomUrl?: string | null;
  live?: {
    state?: "live" | "offline" | "unknown";
    liveId?: number | null;
    startedAt?: string | null;
    observedAt?: string | null;
  };
  next?: { state?: "scheduled" | "none" | "unknown"; at?: string | null };
};

export type LiveView = {
  state: "live" | "offline" | "unknown";
  startedAt: string | null;
  observedAt: string | null;
  roomUrl: string | null;
  next: { state: "scheduled" | "none" | "unknown"; at: string | null };
};

/** payload を、失効を考慮した表示用の形にする。 */
export function toLiveView(
  payload: LivePayload | null,
  now: number = Date.now(),
): LiveView {
  const observedAt = payload?.live?.observedAt ?? null;
  const stale = isObservationStale(observedAt, now);
  const rawState = payload?.live?.state ?? "unknown";
  return {
    // 観測が古ければ live / offline を名乗らせない
    state: stale ? "unknown" : rawState,
    startedAt: payload?.live?.startedAt ?? null,
    observedAt,
    roomUrl: payload?.roomUrl ?? null,
    next: {
      state: payload?.next?.state ?? "unknown",
      at: payload?.next?.at ?? null,
    },
  };
}
