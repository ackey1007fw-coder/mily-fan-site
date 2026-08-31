export * from "../../src/data/news.ts";
import { news as currentNews } from "../../src/data/news.ts";

const laterNewsIds = new Set([
  "2026-08-31-morning-stream-thanks",
  "2026-08-31-paton-15x-day",
  "2026-08-31-showroom-wake-me",
  "2026-08-30-consecutive-stream-30",
  "2026-08-30-paton-rank-3",
  "2026-08-30-campus-girls-hold-second-story",
  "2026-08-30-morning-showroom-0600",
  "2026-08-30-mixch-final-day",
  "2026-08-29-paton-vote-day-5-story",
  "2026-08-28-night-showroom-story",
  "2026-08-29-paton-vote-day-4-story",
  "2026-08-29-showroom-live-third-round",
  "2026-08-29-showroom-radio-1440",
]);

/** Historical view used by pre-b41 / pre-8/29 SHOWROOM regression tests. */
export const news = currentNews.filter(({ id }) => !laterNewsIds.has(id));
