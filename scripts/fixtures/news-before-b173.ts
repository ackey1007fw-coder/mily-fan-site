export * from "../../src/data/news.ts";
import { news as currentNews } from "../../src/data/news.ts";

/** Historical assertions written before the September 29 record-café post. */
export const news = currentNews.filter(
  ({ id }) => id !== "2026-10-01-mixch-kossori" && id !== "2026-09-29-record-cafe-mily-collection",
);
