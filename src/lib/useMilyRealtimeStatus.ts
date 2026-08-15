import { useSyncExternalStore } from "react";
import type { RadioStatus } from "../data/radio";
import {
  createPollStore,
  toLiveView,
  type LivePayload,
  type LiveView,
} from "./realtimeStore";

export type { LivePayload, LiveView };
export { toLiveView };

/**
 * リアルタイム状態の取得を1系統に集約するフック。
 * ActivityBanner と TodayDashboard が別々に poll しないよう、
 * モジュールスコープの store を共有する。
 */
const LIVE_POLL_MS = 60_000;
const RADIO_POLL_MS = 180_000;

const CLIENT_TIMEOUT_MS = 8000;

/** 8秒のクライアント timeout。unmount 時の abort signal とも連動させる。 */
async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const timeout = new AbortController();
  const timer = window.setTimeout(() => timeout.abort(), CLIENT_TIMEOUT_MS);
  const onAbort = () => timeout.abort();
  signal.addEventListener("abort", onAbort);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: timeout.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // body 読了までを timeout の対象にする
    return (await res.json()) as T;
  } finally {
    window.clearTimeout(timer);
    signal.removeEventListener("abort", onAbort);
  }
}

// 取得失敗時はライブ状態を捨てる（古い「配信中」を残さない）
const liveStore = createPollStore<LivePayload>({
  fetcher: (signal) => fetchJson<LivePayload>("/api/mily-live", signal),
  intervalMs: LIVE_POLL_MS,
  clearOnError: true,
});

const radioStore = createPollStore<RadioStatus>({
  fetcher: (signal) => fetchJson<RadioStatus>("/api/mily-radio-status", signal),
  intervalMs: RADIO_POLL_MS,
});

export function useMilyRealtimeStatus(): {
  live: LiveView;
  radio: RadioStatus | null;
} {
  const livePayload = useSyncExternalStore(
    liveStore.subscribe,
    liveStore.getSnapshot,
    () => null,
  );
  const radio = useSyncExternalStore(
    radioStore.subscribe,
    radioStore.getSnapshot,
    () => null,
  );

  return { live: toLiveView(livePayload), radio };
}
