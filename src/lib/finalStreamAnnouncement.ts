import { finalDayStreamSlots, OCTOBER_12_FINAL_STREAM_SOURCE } from "../data/fourthRoundStreamSchedule.ts";
import { slotStartMs, slotEndMs, upcomingSlots, type StreamSlot } from "../data/streamSchedule.ts";
import { adaptStreamSlots, type SupportCalendarResult } from "./supportCalendar.ts";
import type { StreamScheduleView } from "./useStreamSchedule.ts";

/** 開始が一致する登録枠だけに、出典のある終了予定を補足。変更・削除された枠は復活させない。 */
export function withFinalStreamAnnouncedEnd(view: StreamScheduleView, now: number): StreamScheduleView {
  const announced = finalDayStreamSlots[0];
  const slots = view.slots.map(slot => slot.date === announced.date && slot.time === announced.time && !slot.endTime
    ? { ...slot, endTime: announced.endTime, note: [slot.note, "終了予定21:59は10月12日朝の本人案内に基づきます。開始が少し早まる可能性があります。"].filter(Boolean).join(" / ") }
    : slot);
  return { ...view, slots: upcomingSlots([], slots, now) };
}

/** 独立した本人告知。API成功0件を公式登録予定へ読み替えない。 */
export function finalStreamAnnouncement(view: StreamScheduleView, now: number): StreamSlot | null {
  const announced = finalDayStreamSlots[0];
  const end = slotEndMs(announced)!;
  if (now < Date.parse(`${announced.date}T00:00:00+09:00`) || now >= end) return null;
  const candidates = view.availability === "ok"
    ? view.slots.filter(slot => slot.date === announced.date && slotStartMs(slot) < end)
    : [];
  const registered = candidates[candidates.length - 1];
  if (!registered) return { ...announced, note: `${announced.note} 本人告知の予定で、実配信の記録ではありません。` };
  return {
    ...registered,
    ...(registered.time === announced.time && !registered.endTime ? { endTime: announced.endTime } : {}),
    note: [registered.note, registered.time === announced.time
      ? registered.endTime ? "朝の本人案内と開始が一致しています。登録予定の時刻を表示しています。" : "朝の本人案内と開始が一致しています。終了21:59は本人案内に基づく予定です。"
      : "最新の登録予定を優先しています。朝の本人案内は21:00開始予定でした。"].filter(Boolean).join(" / "),
  };
}

/** 登録枠・fallbackがあれば追加せず、同日の二重表示を避ける。 */
export function withFinalStreamAnnouncement(calendar: SupportCalendarResult, view: StreamScheduleView, now: number): SupportCalendarResult {
  const slot = finalStreamAnnouncement(view, now);
  if (!slot) return calendar;
  const day = calendar.days.find(day => day.date === slot.date);
  if (day?.items.some(item => item.origin === "showroom-schedule")) return calendar;
  const item = {
    ...adaptStreamSlots([slot])[0],
    title: "SHOWROOM最終枠（本人告知の予定）",
    source: OCTOBER_12_FINAL_STREAM_SOURCE,
  };
  const days = day
    ? calendar.days.map(current => current === day ? { ...day, items: [...day.items, item].sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? "")) } : current)
    : [...calendar.days, { date: slot.date, items: [item] }].sort((a, b) => a.date.localeCompare(b.date));
  return { ...calendar, days };
}
