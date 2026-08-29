export * from "../../src/data/news.ts";
import { news as currentNews } from "../../src/data/news.ts";

const batch41NewsIds = new Set([
  "2026-08-28-night-showroom-story",
  "2026-08-29-paton-vote-day-4-story",
]);

/** Historical view used by pre-b41 regression tests. */
export const news = currentNews.filter(({ id }) => !batch41NewsIds.has(id));
