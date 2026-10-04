export * from "../../src/data/news.ts";
import { news as liveNews } from "../../src/data/news.ts";
// Preserve the historical NEWS snapshot before the October 3 morning recap.
const currentNews = liveNews.filter(({ id }) => id !== "2026-10-04-radio-anniversary-recap" && id !== "2026-10-04-confirmed-vote-support-video" && id !== "2026-10-04-radio-anniversary-stories" && id !== "2026-10-03-morning-showroom-recap" && id !== "2026-10-03-confirmed-tiktok-campus-makeup");

/** Historical assertions written before the September 29 record-café post. */
export const news = currentNews.filter(
  ({ id }) => id !== "2026-10-02-fourth-round-stream-schedule" && id !== "2026-10-01-mixch-kossori" && id !== "2026-09-29-record-cafe-mily-collection",
);
