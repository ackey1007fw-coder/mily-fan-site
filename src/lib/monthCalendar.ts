import { isValidDateOnly } from "../data/events.ts";
import type {
  ScheduleItem,
  SupportCalendarResult,
} from "./supportCalendar.ts";

export type MonthGridCell = {
  date: string | null;
  day: number | null;
};

export type ScheduleCategory = {
  id: "miss-circle" | "campus-girls" | "showroom" | "live" | "radio" | "event";
  label: string;
  compactLabel: string;
};

const tokyoDatePartsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function parseMonthKey(monthKey: string): { year: number; month: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(monthKey);
  if (!match) throw new Error(`Invalid month key: ${monthKey}`);

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month key: ${monthKey}`);
  }
  return { year, month };
}

function addCivilDays(date: string, days: number): string {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return `${next.getUTCFullYear()}-${pad2(next.getUTCMonth() + 1)}-${pad2(next.getUTCDate())}`;
}

/** `now` をAsia/Tokyoのcivil dateへ変換する。ブラウザのlocal timezoneは使わない。 */
export function tokyoDateKey(now: number): string {
  if (!Number.isFinite(now)) throw new Error("now must be a finite timestamp");
  const parts = tokyoDatePartsFormatter.formatToParts(new Date(now));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function tokyoMonthKey(now: number): string {
  return tokyoDateKey(now).slice(0, 7);
}

/** 年跨ぎを含め、JST civil monthのkeyを前後へ移動する。 */
export function shiftMonthKey(monthKey: string, offset: number): string {
  if (!Number.isInteger(offset)) throw new Error("offset must be an integer");
  const { year, month } = parseMonthKey(monthKey);
  const shifted = new Date(Date.UTC(year, month - 1 + offset, 1));
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}`;
}

/** 月曜始まりの7列grid。月外はselectableな日付を作らずnull cellにする。 */
export function buildMonthGrid(monthKey: string): MonthGridCell[] {
  const { year, month } = parseMonthKey(monthKey);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const leadingCells = (firstWeekday + 6) % 7;
  const cellCount = Math.ceil((leadingCells + daysInMonth) / 7) * 7;

  return Array.from({ length: cellCount }, (_, index) => {
    const day = index - leadingCells + 1;
    if (day < 1 || day > daysInMonth) return { date: null, day: null };
    return {
      date: `${year}-${pad2(month)}-${pad2(day)}`,
      day,
    };
  });
}

/**
 * AgendaのScheduleItemを、月間表示のためだけに各civil dateへ索引化する。
 * 元itemはcloneもmutationもせず、期間中の各bucketから同じobjectを参照する。
 */
export function expandScheduleItemsByDate(
  days: SupportCalendarResult["days"],
): Map<string, ScheduleItem[]> {
  const result = new Map<string, ScheduleItem[]>();

  for (const day of days) {
    for (const item of day.items) {
      if (!isValidDateOnly(item.date)) continue;
      const endDate =
        item.endDate !== null &&
        isValidDateOnly(item.endDate) &&
        item.endDate >= item.date
          ? item.endDate
          : item.date;

      for (
        let date = item.date;
        date <= endDate;
        date = addCivilDays(date, 1)
      ) {
        const bucket = result.get(date);
        if (bucket) bucket.push(item);
        else result.set(date, [item]);
      }
    }
  }

  return result;
}

/** activity identityとoriginだけから、月セル用の文字labelを導出する。 */
export function scheduleCategory(item: ScheduleItem): ScheduleCategory {
  if (item.activityId === "miss-circle") {
    return { id: "miss-circle", label: "MISS CIRCLE", compactLabel: "MISS" };
  }
  if (item.activityId === "campus-girls") {
    return {
      id: "campus-girls",
      label: "CAMPUS GIRLS",
      compactLabel: "CAMPUS",
    };
  }
  if (item.origin === "showroom-schedule") {
    return { id: "showroom", label: "SHOWROOM", compactLabel: "SHOW" };
  }
  if (item.activityId === "live-stream") {
    return { id: "live", label: "LIVE", compactLabel: "LIVE" };
  }
  if (item.activityId === "radio") {
    return { id: "radio", label: "RADIO", compactLabel: "RADIO" };
  }
  return { id: "event", label: "EVENT", compactLabel: "EVENT" };
}
