import type { StreamSlot } from "./streamSchedule.ts";

export const FOURTH_ROUND_SCHEDULE_X_URL = "https://x.com/mily_chan36/status/2106033785867555040";
export const OCTOBER_8_SCHEDULE_X_URL = "https://x.com/Mily_chan36/status/2107858042541023674";
export const FOURTH_ROUND_SCHEDULE_IMAGE = "/media/news/mily-b183-01-fourth-round-stream-schedule.jpg";

/** 本人の10月2日告知画像と10月8日00:38のX告知。すべて2026年・JST。実配信記録とは別。 */
export const fourthRoundStreamSchedule: StreamSlot[] = [
  { date: "2026-10-03", time: "06:30", endTime: "07:30" },
  { date: "2026-10-03", time: "21:40", endTime: "22:40" },
  { date: "2026-10-04", time: "05:50", endTime: "06:30", note: "きっかけ（本人画像の表記）" },
  { date: "2026-10-04", time: "14:45", endTime: "15:15" },
  { date: "2026-10-04", time: "22:30", endTime: "23:20" },
  { date: "2026-10-05", time: "06:00", endTime: "06:40" },
  { date: "2026-10-05", time: "21:30", endTime: "22:50" },
  { date: "2026-10-06", time: "05:30", endTime: "06:30" },
  { date: "2026-10-06", time: "14:45", endTime: "15:15" },
  { date: "2026-10-06", time: "22:00", endTime: "22:30" },
  { date: "2026-10-07", time: "06:40", endTime: "07:20", note: "きっかけ（本人画像の表記）" },
  { date: "2026-10-07", time: "12:30", endTime: "13:00" },
  { date: "2026-10-07", time: "21:40", endTime: "22:30" },
  { date: "2026-10-08", time: "14:40", endTime: "15:20", note: "10月8日の本人X告知・1.2倍DAY" },
  { date: "2026-10-08", time: "21:30", endTime: "22:10", note: "10月8日の本人X告知・1.2倍DAY" },
];

export const fourthRoundSchedulePhoto = {
  id: "mily-b183-01", kind: "photo" as const,
  basePath: "/media/gallery/mily-b183-01-fourth-round-stream-schedule",
  widths: [480, 960, 1600] as const, width: 1536, height: 1024,
  alt: "ミスサークルコンテスト2026四次審査、10月3日から7日の配信予定13枠。3日と8日は1.2倍DAY、キラキラ星大募集と記された本人告知画像",
  caption: "10月2日の本人Xで案内された前半の配信予定。時刻はJST、予定変更は本人の最新案内をご確認ください。",
  provenance: "sns-post" as const, sourceUrl: FOURTH_ROUND_SCHEDULE_X_URL,
  sourceDate: "2026-10-02", credit: null, aspect: "1536 / 1024", published: true,
};

export const fourthRoundScheduleNewsImage = {
  kind: "image" as const, src: FOURTH_ROUND_SCHEDULE_IMAGE,
  fullSizeSrc: FOURTH_ROUND_SCHEDULE_IMAGE,
  srcSet: [480, 960, 1600].map(w => `${fourthRoundSchedulePhoto.basePath}-${w}.jpg ${Math.min(w, 1536)}w`).join(", "),
  webpSrcSet: [480, 960, 1600].map(w => `${fourthRoundSchedulePhoto.basePath}-${w}.webp ${Math.min(w, 1536)}w`).join(", "),
  sizes: "(max-width: 768px) calc(100vw - 72px), 696px",
  width: 1536, height: 1024, alt: fourthRoundSchedulePhoto.alt,
};
