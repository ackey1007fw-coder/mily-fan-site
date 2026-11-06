import {
  NOVEMBER_07_ANNOUNCED_AT,
  NOVEMBER_07_SCHEDULE_X_URL,
  november07StreamSlots,
} from "../data/nov07Plan.ts";
import { upcomingSlots } from "../data/streamSchedule.ts";
import { adaptStreamSlots, type SupportCalendarResult } from "./supportCalendar.ts";

export function upcomingNov07Slots(now: number) {
  return now < Date.parse(NOVEMBER_07_ANNOUNCED_AT)
    ? []
    : upcomingSlots(november07StreamSlots, [], now);
}

/** 本人告知を登録予定とは別に表示。同日の旧21:30登録が残っていれば置き換える。 */
export function withNov07Plan(
  calendar: SupportCalendarResult,
  now: number,
): SupportCalendarResult {
  if (now < Date.parse(NOVEMBER_07_ANNOUNCED_AT)) return calendar;
  const announced = adaptStreamSlots(november07StreamSlots).map((item) => ({
    ...item,
    title:
      item.startTime === "21:00"
        ? "SHOWROOM最終枠（本人告知の予定）"
        : "SHOWROOM配信（本人告知の予定）",
    source: NOVEMBER_07_SCHEDULE_X_URL,
  }));
  const keys = new Set(announced.map((item) => item.key));
  keys.add("showroom-schedule:2026-11-07T21:30");
  const day = calendar.days.find((item) => item.date === "2026-11-07");
  const items = [
    ...(day?.items ?? []).filter((item) => !keys.has(item.key)),
    ...announced,
  ].sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
  const days = [
    ...calendar.days.filter((item) => item.date !== "2026-11-07"),
    { date: "2026-11-07", items },
  ].sort((a, b) => a.date.localeCompare(b.date));
  return { ...calendar, days };
}
