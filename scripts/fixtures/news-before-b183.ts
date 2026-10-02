export * from "../../src/data/news.ts";
import { news as currentNews } from "../../src/data/news.ts";

/** Keep historical Activity-media assertions before the October 2 poster. */
export const news = currentNews.filter(({id}) => id !== "2026-10-02-fourth-round-stream-schedule");
