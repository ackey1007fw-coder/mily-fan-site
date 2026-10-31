import { OCTOBER_31_ANNOUNCED_AT, OCTOBER_31_FANROOM_URL, october31StreamSlots } from "../data/oct31Plan.ts";
import { upcomingSlots } from "../data/streamSchedule.ts";
import { adaptStreamSlots, type SupportCalendarResult } from "./supportCalendar.ts";

export function upcomingOct31Slots(now: number) {
  return now < Date.parse(OCTOBER_31_ANNOUNCED_AT) ? [] : upcomingSlots(october31StreamSlots, [], now);
}

/** 本人告知を登録予定とは別に表示。同じ開始と、変更済みの旧21:00枠を置き換える。 */
export function withOct31Plan(calendar: SupportCalendarResult, now: number): SupportCalendarResult {
  if (now < Date.parse(OCTOBER_31_ANNOUNCED_AT)) return calendar;
  const announced = adaptStreamSlots(october31StreamSlots).map(item => ({
    ...item,
    title: "SHOWROOM通常配信（本人告知の予定）",
    source: OCTOBER_31_FANROOM_URL,
  }));
  const keys = new Set(announced.map(item => item.key));
  keys.add("showroom-schedule:2026-10-31T21:00"); // 15:52本人告知で21:05へ変更済み
  const day = calendar.days.find(item => item.date === "2026-10-31");
  const items = [...(day?.items ?? []).filter(item => !keys.has(item.key)), ...announced]
    .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
  const days = [...calendar.days.filter(item => item.date !== "2026-10-31"), { date: "2026-10-31", items }]
    .sort((a, b) => a.date.localeCompare(b.date));
  return { ...calendar, days };
}
