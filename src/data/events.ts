/**
 * Events are year-agnostic. Add future years in this same list.
 * Only include appearances that have a confirmed public source.
 */
export type EventKind = "appearance" | "stream" | "event" | "other";

export type FanEvent = {
  id: string;
  title: string;
  /**
   * Date-only: `YYYY-MM-DD`
   * Datetime: `YYYY-MM-DDTHH:mm:ss+09:00`
   */
  startAt: string;
  endAt?: string;
  timezone: "Asia/Tokyo";
  kind: EventKind;
  venue?: string;
  url?: string;
  source: string;
  notes?: string;
};

export const events: FanEvent[] = [];

export const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
export const DATETIME_RE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

export function isDateOnly(value: string): boolean {
  return DATE_ONLY_RE.test(value);
}

export function isDateTime(value: string): boolean {
  return DATETIME_RE.test(value);
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function isValidDateOnly(value: string): boolean {
  if (!DATE_ONLY_RE.test(value)) return false;

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const utc = new Date(Date.UTC(year, month - 1, day));

  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  );
}

function civilTimeFromParsed(parsed: Date, offset: string) {
  if (offset === "Z") {
    return {
      year: parsed.getUTCFullYear(),
      month: parsed.getUTCMonth() + 1,
      day: parsed.getUTCDate(),
      hour: parsed.getUTCHours(),
      minute: parsed.getUTCMinutes(),
      second: parsed.getUTCSeconds(),
    };
  }

  const sign = offset.startsWith("-") ? -1 : 1;
  const offsetMinutes =
    sign *
    (Number(offset.slice(1, 3)) * 60 + Number(offset.slice(4, 6)));
  const shifted = new Date(parsed.getTime() + offsetMinutes * 60 * 1000);

  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
  };
}

export function isValidDateTime(value: string): boolean {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
  );
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const offset = match[7];

  if (hour > 23 || minute > 59 || second > 59) return false;
  if (offset !== "Z") {
    const offsetHour = Number(offset.slice(1, 3));
    const offsetMinute = Number(offset.slice(4, 6));
    if (offsetHour > 14 || offsetMinute > 59) return false;
  }

  if (!isValidDateOnly(`${match[1]}-${match[2]}-${match[3]}`)) return false;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;

  const civil = civilTimeFromParsed(parsed, offset);
  return (
    civil.year === year &&
    civil.month === month &&
    civil.day === day &&
    civil.hour === hour &&
    civil.minute === minute &&
    civil.second === second &&
    pad2(civil.month) === match[2] &&
    pad2(civil.day) === match[3] &&
    pad2(civil.hour) === match[4] &&
    pad2(civil.minute) === match[5] &&
    pad2(civil.second) === match[6]
  );
}

export function isValidEventTimestamp(value: string): boolean {
  return isValidDateOnly(value) || isValidDateTime(value);
}

const TOKYO_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
});

export function tokyoCalendarYear(instant: Date): number {
  const year = Number.parseInt(TOKYO_YEAR_FORMATTER.format(instant), 10);
  if (!Number.isInteger(year)) {
    throw new Error(`Unable to resolve Asia/Tokyo year for ${instant.toISOString()}`);
  }
  return year;
}

export function parseEventStartInstant(value: string): Date {
  if (isValidDateOnly(value)) {
    return new Date(`${value}T00:00:00+09:00`);
  }

  if (isValidDateTime(value)) {
    return new Date(value);
  }

  throw new Error(`Invalid event timestamp: ${value}`);
}

export function parseEventEndInstant(value: string): Date {
  if (isValidDateOnly(value)) {
    return new Date(`${value}T23:59:59+09:00`);
  }

  if (isValidDateTime(value)) {
    return new Date(value);
  }

  throw new Error(`Invalid event timestamp: ${value}`);
}

export function parseEventInstant(value: string): Date {
  return parseEventEndInstant(value);
}

export function eventYear(event: FanEvent): number {
  return tokyoCalendarYear(parseEventStartInstant(event.startAt));
}

export function groupEventsByYear(
  items: FanEvent[],
): { year: number; events: FanEvent[] }[] {
  const grouped = new Map<number, FanEvent[]>();

  for (const item of items) {
    const year = eventYear(item);
    const bucket = grouped.get(year);
    if (bucket) {
      bucket.push(item);
    } else {
      grouped.set(year, [item]);
    }
  }

  return [...grouped.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, yearEvents]) => ({
      year,
      events: [...yearEvents].sort(
        (a, b) =>
          parseEventStartInstant(a.startAt).getTime() -
          parseEventStartInstant(b.startAt).getTime(),
      ),
    }));
}

export function isUpcomingEvent(event: FanEvent, now = new Date()): boolean {
  const end = event.endAt ?? event.startAt;
  return parseEventInstant(end).getTime() >= now.getTime();
}
