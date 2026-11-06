import type { StreamSlot } from "./streamSchedule.ts";

export const NOVEMBER_07_SCHEDULE_X_URL =
  "https://x.com/Mily_chan36/status/2118721115514384479";
export const NOVEMBER_07_ANNOUNCED_AT = "2026-11-07T00:04:00+09:00";

/** 2026-11-07 00:04 JST の本人X。実配信記録とは別。 */
export const november07StreamSlots: StreamSlot[] = [
  { date: "2026-11-07", time: "07:00", endTime: "08:00", note: "本人X告知" },
  {
    date: "2026-11-07",
    time: "21:00",
    endTime: "21:59",
    note: "本人X告知・最終枠。投票で選ばれた衣装",
  },
];
