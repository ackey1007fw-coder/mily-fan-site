import { useSyncExternalStore } from "react";
import { createTokyoNowStore } from "./tokyoNowStore";

const tokyoNowStore = createTokyoNowStore();

/** `/support/` のカレンダーが JST 日付境界で再描画されるための現在時刻。 */
export function useTokyoNow(): number {
  return useSyncExternalStore(
    tokyoNowStore.subscribe,
    tokyoNowStore.getSnapshot,
    tokyoNowStore.getSnapshot,
  );
}
