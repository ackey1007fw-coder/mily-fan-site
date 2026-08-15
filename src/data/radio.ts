/**
 * FM湘南マジックウェイブ「湘南シーサイドサークル」の確認済み事実と、
 * 放送日・時間帯の判定。Asia/Tokyo 固定。
 *
 * スタッフページに Mily（ミリー）の担当番組として記載があることは確認済み。
 * ただし「毎週必ず本人が3時間出演している」とは断定しない。
 * 時間帯だけを根拠に本人出演中とは判定しない。
 *
 * How to use: docs/CONTENT-OPS.md
 */

export const RADIO_TIMEZONE = "Asia/Tokyo" as const;

export const radioProgram = {
  programName: "湘南シーサイドサークル",
  /** JS weekday: 0 = Sunday */
  weekday: 0,
  scheduledStart: "10:00",
  scheduledEnd: "13:00",
  listenUrl: "https://fm-smw.jp/radio",
  nowOnAirSourceUrl: "https://fm-smw.jp/",
  programUrl:
    "https://fm-smw.jp/program/%E3%80%8E-%E6%B9%98%E5%8D%97%E3%82%B7%E3%83%BC%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B5%E3%83%BC%E3%82%AF%E3%83%AB-%E3%80%8F%E3%80%80%EF%BC%83ssc",
  staffUrl: "https://fm-smw.jp/staff",
  timetableUrl: "https://fm-smw.jp/time-table",
} as const;

export type RadioProgram = typeof radioProgram;

/**
 * NOW ON AIR の確認結果。
 * - true: トップページの NOW ON AIR 番組名が明確に一致
 * - false: 取得でき、別番組または NOT ON AIR と読めた
 * - null: 取得失敗・HTML変更・曖昧（unavailable）
 */
export type OnAirConfirmed = true | false | null;

export type RadioStatus = {
  ok: boolean;
  programName: string;
  todayScheduled: boolean;
  scheduledStart: string;
  scheduledEnd: string;
  inScheduledWindow: boolean;
  onAirConfirmed: OnAirConfirmed;
  /** 時間帯や NOW ON AIR だけでは本人出演を確定しない。現状は常に null。 */
  milyAppearanceConfirmed: null;
  listenUrl: string;
  sourceUrl: string;
  updatedAt: string;
};

export type TokyoClock = {
  weekday: number;
  hour: number;
  minute: number;
};

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const tokyoClockFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: RADIO_TIMEZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function partValue(parts: Intl.DateTimeFormatPart[], type: string): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

/** Asia/Tokyo の曜日（0=日）と時分。 */
export function tokyoClock(now: Date | number = Date.now()): TokyoClock {
  const parts = tokyoClockFmt.formatToParts(new Date(now));
  const weekdayName = partValue(parts, "weekday");
  const weekday = WEEKDAY_INDEX[weekdayName];
  const hour = Number(partValue(parts, "hour"));
  const minute = Number(partValue(parts, "minute"));
  if (
    weekday === undefined ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute)
  ) {
    throw new Error("failed to read Asia/Tokyo clock");
  }
  return { weekday, hour, minute };
}

export function minutesFromMidnight(clock: { hour: number; minute: number }): number {
  return clock.hour * 60 + clock.minute;
}

export function parseHm(value: string): number {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) throw new Error(`invalid HH:mm: ${value}`);
  return Number(match[1]) * 60 + Number(match[2]);
}

/** 今日が番組の放送日か（日曜）。出演確定ではない。 */
export function isBroadcastDay(now: Date | number = Date.now()): boolean {
  return tokyoClock(now).weekday === radioProgram.weekday;
}

/**
 * 今日の放送時間帯か。[start, end) — 10:00 を含み 13:00 は含まない。
 * 出演確定ではない。
 */
export function isInScheduledWindow(now: Date | number = Date.now()): boolean {
  const clock = tokyoClock(now);
  if (clock.weekday !== radioProgram.weekday) return false;
  const current = minutesFromMidnight(clock);
  return (
    current >= parseHm(radioProgram.scheduledStart) &&
    current < parseHm(radioProgram.scheduledEnd)
  );
}

/** 装飾・空白・＃SSC を除いて番組名が明確に一致するか。 */
export function programNameMatches(raw: string | null | undefined): boolean {
  if (typeof raw !== "string") return false;
  const compact = raw
    .normalize("NFKC")
    .replace(/[『』「」【】\[\]]/g, "")
    .replace(/[#＃]\s*SSC\b/gi, "")
    .replace(/\s+/g, "");
  return compact === radioProgram.programName;
}

export function scheduledFlags(now: Date | number = Date.now()): {
  todayScheduled: boolean;
  inScheduledWindow: boolean;
} {
  return {
    todayScheduled: isBroadcastDay(now),
    inScheduledWindow: isInScheduledWindow(now),
  };
}
