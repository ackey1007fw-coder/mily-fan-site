export * from "../../src/data/news.ts";
import { news as liveNews } from "../../src/data/news.ts";
// Preserve the historical NEWS snapshot before the October 3 morning recap.
const currentNews = liveNews.filter(({ id }) => id !== "2026-10-04-morning-showroom-recap" && id !== "2026-10-04-confirmed-vote-support-video" && id !== "2026-10-04-radio-anniversary-stories" && id !== "2026-10-03-morning-showroom-recap" && id !== "2026-10-03-confirmed-tiktok-campus-makeup");

/** Keep historical Activity-media assertions before the October 2 poster. */
export const news = currentNews.filter(({id}) => id !== "2026-10-02-fourth-round-stream-schedule");
