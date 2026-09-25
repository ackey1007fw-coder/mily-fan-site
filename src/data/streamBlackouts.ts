import { isValidDateOnly } from "./events.ts";

/** 配信内の「NG時間」。確定した配信枠ではなく、StreamSlotへ変換しない。 */
export type ClockRange = readonly [start: string, end: string];
export type StreamBlackoutDay = {
  date: string;
  ng: readonly ClockRange[];
};

export const streamBlackoutSource = {
  verifiedAt: "2026-09-26",
  label: "配信内掲示「配信NG時間」（提供画像を確認）",
  // 元投稿の恒久URL・掲示時刻は未確認。受領日を発表日時と混同しない。
  publishedAt: null,
  periodLabel: "9/26（土）〜10/2（金）",
} as const;

export const streamBlackoutDays: readonly StreamBlackoutDay[] = [
  { date: "2026-09-26", ng: [["09:30", "19:00"]] },
  { date: "2026-09-27", ng: [["06:40", "22:30"]] },
  { date: "2026-09-28", ng: [["06:40", "17:00"]] },
  { date: "2026-09-29", ng: [["06:40", "14:00"]] },
  { date: "2026-09-30", ng: [["10:40", "14:30"]] },
  { date: "2026-10-01", ng: [["06:40", "14:00"], ["16:30", "22:30"]] },
  { date: "2026-10-02", ng: [["06:40", "21:00"]] },
];

export const STREAM_BLACKOUT_CAUTION =
  "NG時間外は配信予定ではありません。NG終了時刻ちょうどに始まるという意味でもありません。実際の配信時刻は本人の最新の告知をご確認ください。";

function minutes(value: string): number {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value) && value !== "24:00") {
    throw new Error(`Invalid clock time: ${value}`);
  }
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function clock(value: number): string {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

/** 一日の補集合のみを算出。睡眠等を考慮した「配信可能性」の予測ではない。 */
export function outsideNgRanges(ng: readonly ClockRange[]): ClockRange[] {
  const ranges = ng.map(([start, end]) => {
    const a = minutes(start);
    const b = minutes(end);
    if (a >= b) throw new Error("NG range must end after its start on the same day");
    return [a, b] as const;
  }).sort((a, b) => a[0] - b[0]);
  const outside: ClockRange[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (cursor < start) outside.push([clock(cursor), clock(start)]);
    cursor = Math.max(cursor, end);
  }
  if (cursor < 1440) outside.push([clock(cursor), "24:00"]);
  return outside;
}

/** 対象日がないことを「終日配信できる」と解釈しない。 */
export function blackoutDay(date: string): StreamBlackoutDay | null {
  if (!isValidDateOnly(date)) return null;
  return streamBlackoutDays.find((day) => day.date === date) ?? null;
}

export function blackoutPeriodState(today: string): "before" | "active" | "ended" {
  if (!isValidDateOnly(today)) throw new Error("Invalid JST calendar date");
  if (today < streamBlackoutDays[0].date) return "before";
  if (today > streamBlackoutDays[streamBlackoutDays.length - 1].date) return "ended";
  return "active";
}

export function formatClockRange([start, end]: ClockRange): string {
  return `${start.replace(/^0/, "")}〜${end.replace(/^0/, "")}`;
}
