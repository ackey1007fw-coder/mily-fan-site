import type { StreamSlot } from "./streamSchedule.ts";

export const OCTOBER_31_FANROOM_URL = "https://www.showroom-live.com/room/fan_club?room_id=573253";
export const OCTOBER_31_ANNOUNCED_AT = "2026-10-31T05:32:00+09:00";
/** 本人FR 89323301。早朝きっかけ枠は取りやめ。実施記録とは分離する。 */
export const october31StreamSlots: StreamSlot[] = [
  { date: "2026-10-31", time: "07:00", endTime: "07:30", note: "通常配信（本人告知）" },
  { date: "2026-10-31", time: "14:45", endTime: "15:15", note: "通常配信・早朝枠から変更（本人告知）" },
  { date: "2026-10-31", time: "21:00", endTime: "21:50", note: "通常配信・ハロウィンの仮装予定（08:08本人告知）" },
];
