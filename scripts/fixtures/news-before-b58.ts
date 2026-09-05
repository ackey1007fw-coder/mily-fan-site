export * from "../../src/data/news.ts";
import { news as currentNews } from "../../src/data/news.ts";

/** Historical NEWS snapshot before the owner-dated b58 TikTok addition. */
export const news = currentNews.filter(
  ({ id }) =>
    id !== "2026-09-05-tiktok-radio-portrait" &&
    id !== "2026-09-05-morning-stream-thanks",
);
