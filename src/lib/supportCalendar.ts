import { type ActivityId } from "../data/activities.ts";
import { type Contest } from "../data/contest.ts";
import {
  isDateOnly,
  isValidEventTimestamp,
  type FanEvent,
} from "../data/events.ts";
import { links } from "../data/links.ts";
import { radioProgram } from "../data/radio.ts";
import {
  isValidSupportEventSchedule,
  type SupportEvent,
  type SupportEventSchedule,
} from "../data/supportEvents.ts";
import { isValidSlot, type StreamSlot } from "../data/streamSchedule.ts";

export type ScheduleOrigin =
  | "contest"
  | "support-event"
  | "fan-event"
  | "showroom-schedule"
  | "radio-program";

/** UIが必要とする最小の時間的意味。保存せず各domain adapterで導出する。 */
export type ScheduleTiming = "period" | "instant" | "start";

export type ScheduleItem = {
  key: string;
  /** 開始日（Asia/Tokyo、YYYY-MM-DD） */
  date: string;
  startTime: string | null;
  endTime: string | null;
  /**
   * 終了日（Asia/Tokyo、YYYY-MM-DD）。
   * 確認済みの終了日または終了日時がある項目だけに入る。終了が未確認なら `null` のままにし、
   * 開始時刻から終了日時を推測しない（SHOWROOM個別枠は常に `null`）。
   */
  endDate: string | null;
  allDay: boolean;
  span: { start: string; end: string } | null;
  timing: ScheduleTiming;
  activityId: ActivityId | null;
  title: string;
  note?: string;
  origin: ScheduleOrigin;
  source?: string;
  cta?: { label: string; url: string };
};

export type PendingSupportItem = {
  key: string;
  activityId: ActivityId;
  title: string;
  reason: "date-pending";
  source: string;
  cta?: { label: string; url: string };
};

export type DisplayStatus =
  | "live"
  | "upcoming"
  | "ended"
  | "date-pending";

export type ScheduleAvailability = "loading" | "ok" | "unavailable";

export type SupportCalendarResult = {
  days: { date: string; items: ScheduleItem[] }[];
  pending: PendingSupportItem[];
  availability: {
    showroomSchedule: ScheduleAvailability;
  };
};

const tokyoPartsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function tokyoParts(value: number): {
  date: string;
  time: string;
} {
  const parts = tokyoPartsFormatter.formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    time: `${part("hour")}:${part("minute")}`,
  };
}

function startOfTokyoDay(date: string): number {
  return Date.parse(`${date}T00:00:00+09:00`);
}

function addCalendarDays(date: string, days: number): string {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const day = Number(date.slice(8, 10));
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
}

function scheduledParts(value: string, allDay: boolean): {
  date: string;
  time: string | null;
} {
  if (allDay) return { date: value, time: null };
  const parts = tokyoParts(Date.parse(value));
  return { date: parts.date, time: parts.time };
}

export function displayStatus(
  schedule: SupportEventSchedule,
  now: number,
): DisplayStatus {
  if (schedule.state === "date-pending") return "date-pending";
  if (!isValidSupportEventSchedule(schedule)) {
    throw new Error("Invalid support event schedule");
  }

  if (schedule.state === "confirmed-period") {
    const start = schedule.allDay
      ? startOfTokyoDay(schedule.start)
      : Date.parse(schedule.start);
    const end = schedule.allDay
      ? startOfTokyoDay(addCalendarDays(schedule.end, 1)) - 1
      : Date.parse(schedule.end);
    if (now < start) return "upcoming";
    if (now <= end) return "live";
    return "ended";
  }

  if (schedule.allDay) {
    const start = startOfTokyoDay(schedule.at);
    if (now < start) return "upcoming";
    return now < startOfTokyoDay(addCalendarDays(schedule.at, 1))
      ? "live"
      : "ended";
  }

  return now < Date.parse(schedule.at) ? "upcoming" : "ended";
}

export function liveSupportEvents(
  items: SupportEvent[],
  now: number,
): SupportEvent[] {
  return items.filter((item) => displayStatus(item.schedule, now) === "live");
}

export function adaptContestSchedule(contest: Contest): {
  items: ScheduleItem[];
  pending: PendingSupportItem[];
} {
  const phase = contest.currentPhase;
  if (!phase) return { items: [], pending: [] };
  const cta = { label: contest.entryNumber, url: contest.entryUrl };
  if (phase.start === null || phase.end === null) {
    return {
      items: [],
      pending: [
        {
          key: "contest:current-phase",
          activityId: "miss-circle",
          title: phase.name,
          reason: "date-pending",
          source: phase.source,
          cta,
        },
      ],
    };
  }

  return {
    items: [
      {
        key: "contest:current-phase",
        date: phase.start,
        startTime: null,
        endTime: null,
        endDate: phase.end,
        allDay: true,
        span: { start: phase.start, end: phase.end },
        timing: "period",
        activityId: "miss-circle",
        title: phase.name,
        origin: "contest",
        source: phase.source,
        cta,
      },
    ],
    pending: [],
  };
}

export function adaptSupportEvents(items: SupportEvent[]): {
  items: ScheduleItem[];
  pending: PendingSupportItem[];
} {
  const scheduled: ScheduleItem[] = [];
  const pending: PendingSupportItem[] = [];

  for (const item of items) {
    const link = item.ctaLinkId
      ? links.find(({ id }) => id === item.ctaLinkId)
      : undefined;
    const cta = link ? { label: link.label, url: link.url } : undefined;
    if (item.schedule.state === "date-pending") {
      pending.push({
        key: `support-event:${item.id}`,
        activityId: item.activityId,
        title: item.title,
        reason: "date-pending",
        source: item.source,
        ...(cta ? { cta } : {}),
      });
      continue;
    }

    const rawStart =
      item.schedule.state === "confirmed-period"
        ? item.schedule.start
        : item.schedule.at;
    const start = scheduledParts(rawStart, item.schedule.allDay);
    const end =
      item.schedule.state === "confirmed-period"
        ? scheduledParts(item.schedule.end, item.schedule.allDay)
        : null;
    scheduled.push({
      key: `support-event:${item.id}`,
      date: start.date,
      startTime: start.time,
      endTime: end?.time ?? null,
      endDate: end?.date ?? null,
      allDay: item.schedule.allDay,
      span:
        item.schedule.state === "confirmed-period"
          ? { start: item.schedule.start, end: item.schedule.end }
          : null,
      timing:
        item.schedule.state === "confirmed-instant" ? "instant" : "period",
      activityId: item.activityId,
      title: item.title,
      ...(item.note ? { note: item.note } : {}),
      origin: "support-event",
      source: item.source,
      ...(cta ? { cta } : {}),
    });
  }
  return { items: scheduled, pending };
}

export function adaptFanEvents(items: FanEvent[]): ScheduleItem[] {
  return items.flatMap((item) => {
    if (
      !isValidEventTimestamp(item.startAt) ||
      (item.endAt !== undefined && !isValidEventTimestamp(item.endAt))
    ) {
      return [];
    }
    const startDateOnly = isDateOnly(item.startAt);
    const start = scheduledParts(item.startAt, startDateOnly);
    const endDateOnly = item.endAt !== undefined && isDateOnly(item.endAt);
    const end = item.endAt
      ? scheduledParts(item.endAt, endDateOnly)
      : null;
    return [
      {
        key: `fan-event:${item.id}`,
        date: start.date,
        startTime: start.time,
        endTime: end?.time ?? null,
        endDate: end?.date ?? null,
        // FanEventの日付だけが確認済みでも、終日開催が確認されたことにはしない。
        allDay: false,
        span: item.endAt ? { start: item.startAt, end: item.endAt } : null,
        timing: item.endAt ? "period" : "start",
        activityId: null,
        title: item.title,
        ...(item.notes || item.venue
          ? { note: [item.venue, item.notes].filter(Boolean).join(" / ") }
          : {}),
        origin: "fan-event" as const,
        source: item.source,
        ...(item.url ? { cta: { label: "詳細", url: item.url } } : {}),
      },
    ];
  });
}

export function adaptStreamSlots(slots: StreamSlot[]): ScheduleItem[] {
  return slots.filter(isValidSlot).map((slot) => ({
    key: `showroom-schedule:${slot.date}T${slot.time}`,
    date: slot.date,
    startTime: slot.time,
    endTime: null,
    endDate: null,
    allDay: false,
    span: null,
    timing: "start",
    activityId: "live-stream",
    title: "SHOWROOM配信予定",
    ...(slot.note ? { note: slot.note } : {}),
    origin: "showroom-schedule",
  }));
}

function monthStartDate(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

function monthEndDate(date: string): string {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7));
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${date.slice(0, 7)}-${String(lastDay).padStart(2, "0")}`;
}

function radioSlotsBetween(startDate: string, endDate: string): ScheduleItem[] {
  const items: ScheduleItem[] = [];
  for (let date = startDate; date <= endDate; date = addCalendarDays(date, 1)) {
    const [year, month, day] = date.split("-").map(Number);
    if (new Date(Date.UTC(year, month - 1, day)).getUTCDay() !== radioProgram.weekday) {
      continue;
    }
    items.push({
      key: `radio-program:${date}`,
      date,
      startTime: radioProgram.scheduledStart,
      endTime: radioProgram.scheduledEnd,
      endDate: date,
      allDay: false,
      span: null,
      timing: "period",
      activityId: "radio",
      title: radioProgram.programName,
      note: "番組枠です。みりぃ本人の出演時間とは限りません。",
      origin: "radio-program",
      source: radioProgram.programUrl,
      cta: { label: "ラジオを聴く", url: radioProgram.listenUrl },
    });
  }
  return items;
}

/**
 * ナビ可能な月（当月頭〜翌月末、および他の確認済み予定が伸びる月）に
 * 同じ番組枠を展開する。新しい外部事実は追加しない。
 */
function adaptRadioProgramForCalendar(
  now: number,
  daysAhead: number,
  otherItems: ScheduleItem[],
): ScheduleItem[] {
  const today = tokyoParts(now).date;
  let startDate = monthStartDate(today);
  let endDate = addCalendarDays(today, daysAhead);
  for (const item of otherItems) {
    const itemStart = monthStartDate(item.date);
    const itemEnd = monthEndDate(item.endDate ?? item.date);
    if (itemStart < startDate) startDate = itemStart;
    if (itemEnd > endDate) endDate = itemEnd;
  }
  return radioSlotsBetween(startDate, endDate);
}

export function adaptRadioProgram(
  now: number,
  daysAhead: number,
): ScheduleItem[] {
  const today = tokyoParts(now).date;
  return radioSlotsBetween(
    monthStartDate(today),
    addCalendarDays(today, daysAhead),
  );
}

const tokyoShortDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  month: "numeric",
  day: "numeric",
});

/** JSTの `YYYY-MM-DD` を `8/25` 形式にする（表示用）。 */
export function formatShortTokyoDate(date: string): string {
  return tokyoShortDateFormatter.format(new Date(`${date}T00:00:00+09:00`));
}

/**
 * 終了日の表示用format。開始日とJST年が異なるときだけ `2027/1/1` のように年を付け、
 * 同一年は従来どおり `8/25` の短い表示を維持する。
 * 引数はどちらもJST civil dateの `YYYY-MM-DD`（`ScheduleItem.date` / `endDate`）なので、
 * 年の比較はUTCを経由せずJST基準になる。
 */
export function formatShortTokyoEndDate(
  startDate: string,
  endDate: string,
): string {
  const short = formatShortTokyoDate(endDate);
  return startDate.slice(0, 4) === endDate.slice(0, 4)
    ? short
    : `${endDate.slice(0, 4)}/${short}`;
}

/**
 * 開始日と終了日が異なる（日をまたぐ）時刻付き項目か。
 * 終了日が確認済みなら、終了時刻が未確認でも日跨ぎとして扱う。
 * 終了日自体が未確認のSHOWROOM個別枠は常に false になる。
 */
export function isCrossDayTimedItem(item: ScheduleItem): boolean {
  return (
    !item.allDay &&
    item.startTime !== null &&
    item.endDate !== null &&
    item.endDate !== item.date
  );
}

/**
 * 開始時刻を推測せず、確認済みの日付範囲を示す項目か。
 * 終了時刻だけ確認済みの場合も含む（その終了時刻は捨てずに併記する）。
 */
export function isTimeUnconfirmedDateSpan(item: ScheduleItem): boolean {
  return (
    !item.allDay &&
    item.startTime === null &&
    item.endDate !== null &&
    item.endDate !== item.date
  );
}

/**
 * agenda cardの時刻表示。
 * 日跨ぎは日付headingだけでは終了日が分からないため、終了側に日付を添える。
 * 開始時刻が未確認でも、確認済みの終了時刻は表示から落とさない。
 */
export function scheduleTimeLabel(item: ScheduleItem): string {
  if (item.allDay) return item.timing === "instant" ? "日付指定" : "終日";
  if (item.startTime === null) {
    // 確認済みの終了時刻だけを示す。開始時刻（00:00等）は生成しない。
    if (item.endTime !== null && item.endDate !== null) {
      return item.endDate === item.date
        ? `時刻未確認 / ${item.endTime} 終了`
        : `時刻未確認 / ${formatShortTokyoEndDate(item.date, item.endDate)} ${item.endTime} 終了`;
    }
    return "時刻未確認";
  }
  // 締切・結果発表等の「時点」をinterval開始へ読み替えない。
  if (item.timing === "instant") return item.startTime;
  if (isCrossDayTimedItem(item) && item.endDate !== null) {
    return item.endTime === null
      ? `${item.startTime}〜${formatShortTokyoEndDate(item.date, item.endDate)}`
      : `${item.startTime}〜${formatShortTokyoEndDate(item.date, item.endDate)} ${item.endTime}`;
  }
  if (item.endTime === null) return `${item.startTime} 開始`;
  return `${item.startTime}〜${item.endTime}`;
}

function compareScheduleItems(a: ScheduleItem, b: ScheduleItem): number {
  return (
    a.date.localeCompare(b.date) ||
    (a.startTime ?? "").localeCompare(b.startTime ?? "") ||
    a.key.localeCompare(b.key)
  );
}

/**
 * SHOWROOM個別枠のownershipを分ける。
 * - `manualStreamSlots`（`src/data/streamSchedule.ts` の確認済み手入力fallback）は
 *   APIの成否と無関係に確認済みなので、`loading` / `unavailable` でも残す。
 * - API由来の枠は取得に成功した（`ok`）ときだけ使う。
 * `streamSlots` は手入力＋API由来のmerge済みなので、`ok` のときはそのまま採用する。
 */
function selectStreamSlots(
  streamSlots: StreamSlot[],
  manualStreamSlots: StreamSlot[],
  availability: ScheduleAvailability,
): StreamSlot[] {
  return availability === "ok" ? streamSlots : manualStreamSlots;
}

export function buildSupportCalendar(input: {
  contest: Contest;
  supportEvents: SupportEvent[];
  fanEvents: FanEvent[];
  /** 手入力fallback＋API由来のmerge済み配信枠 */
  streamSlots: StreamSlot[];
  /** 確認済み手入力fallbackだけの配信枠。API失敗時もCalendarに残る */
  manualStreamSlots?: StreamSlot[];
  streamAvailability?: ScheduleAvailability;
  includeRadio: boolean;
  now: number;
  daysAhead: number;
}): SupportCalendarResult {
  if (!Number.isFinite(input.now)) throw new Error("now must be a finite timestamp");
  if (!Number.isInteger(input.daysAhead) || input.daysAhead < 0) {
    throw new Error("daysAhead must be a non-negative integer");
  }

  const streamAvailability = input.streamAvailability ?? "ok";
  const streamSlots = selectStreamSlots(
    input.streamSlots,
    input.manualStreamSlots ?? [],
    streamAvailability,
  );
  const contestResult = adaptContestSchedule(input.contest);
  const supportResult = adaptSupportEvents(input.supportEvents);
  const datedItems = [
    ...contestResult.items,
    ...supportResult.items,
    ...adaptFanEvents(input.fanEvents),
    ...adaptStreamSlots(streamSlots),
  ];
  const scheduled = [
    ...datedItems,
    ...(input.includeRadio
      ? adaptRadioProgramForCalendar(input.now, input.daysAhead, datedItems)
      : []),
  ].sort(compareScheduleItems);

  const dayMap = new Map<string, ScheduleItem[]>();
  for (const item of scheduled) {
    const bucket = dayMap.get(item.date);
    if (bucket) bucket.push(item);
    else dayMap.set(item.date, [item]);
  }

  return {
    days: [...dayMap.entries()].map(([date, items]) => ({ date, items })),
    pending: [...contestResult.pending, ...supportResult.pending],
    availability: { showroomSchedule: streamAvailability },
  };
}
