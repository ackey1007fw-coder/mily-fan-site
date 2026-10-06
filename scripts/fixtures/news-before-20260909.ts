export * from "../../src/data/news.ts";
import { news as liveNews } from "../../src/data/news.ts";
// Preserve the historical NEWS snapshot before the October 3 morning recap.
const currentNews = liveNews.filter(({ id }) => id !== "2026-10-06-night-showroom-recap" && id !== "2026-10-06-noon-showroom-recap" && id !== "2026-10-06-morning-showroom-recap" && id !== "2026-10-05-night-showroom-recap" && id !== "2026-10-05-morning-showroom-recap" && id !== "2026-10-05-paton-ex2-day2-guide" && id !== "2026-10-05-car-vote-day-four-x" && id !== "2026-10-04-night-showroom-recap" && id !== "2026-10-04-radio-anniversary-recap" && id !== "2026-10-04-day-showroom-recap" && id !== "2026-10-04-morning-showroom-recap" && id !== "2026-10-04-confirmed-vote-support-video" && id !== "2026-10-04-radio-anniversary-stories" && id !== "2026-10-03-morning-showroom-recap" && id !== "2026-10-03-confirmed-tiktok-campus-makeup");

/** Historical NEWS snapshot before the 2026-09-09 night-stream X announcement. */
export const news = currentNews.filter(
  ({ id }) => id !== "2026-10-02-fourth-round-stream-schedule" &&
    id !== "2026-09-29-record-cafe-mily-collection" &&
    id !== "2026-09-24-tiktok-good-vibes" &&
    id !== "2026-09-22-tiktok-ami-meet" &&
    id !== "2026-09-22-tiktok-ami-meet-story" &&
    id !== "2026-09-22-tiktok-ami-twin-coord" &&
    id !== "2026-09-21-agestock-yokohama" &&
    id !== "2026-09-21-tiktok-ami-tokyo" &&
    id !== "2026-09-20-cold-umbrella-story" &&
    id !== "2026-09-18-kikkake-and-regular-stream" &&
    id !== "2026-09-18-campus-girls-paton-15x-story" &&
    id !== "2026-09-16-miss-circle-fourth-round" &&
    id !== "2026-09-16-tiktok-kossori" &&
    id !== "2026-09-15-night-fanroom-thanks" &&
    id !== "2026-09-15-fanroom-incoming-call-voice" &&
    id !== "2026-09-12-avatar-achievement-story" &&
    id !== "2026-09-13-morning-fanroom-radio-vote" &&
    id !== "2026-09-13-seaside-circle-after-radio-thanks" &&
    id !== "2026-09-13-seaside-circle-solo-theme" &&
    id !== "2026-09-12-ohayo-panda-selfie" &&
    id !== "2026-09-11-miripochi-story" &&
    id !== "2026-09-11-night-stream-thanks-final-day-story" &&
    id !== "2026-09-11-night-fanroom-final-day" &&
    id !== "2026-09-11-morning-fanroom-voice" &&
    id !== "2026-09-09-morning-thanks-night-stream",
);
