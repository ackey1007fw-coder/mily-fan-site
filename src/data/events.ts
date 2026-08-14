/**
 * Events are year-agnostic. Add future years in this same list.
 * Only include appearances that have a confirmed public source.
 */
export type EventKind = "appearance" | "stream" | "event" | "other";

export type FanEvent = {
  id: string;
  title: string;
  /** ISO 8601 date (`YYYY-MM-DD`) or datetime. */
  startAt: string;
  endAt?: string;
  timezone: "Asia/Tokyo";
  kind: EventKind;
  venue?: string;
  url?: string;
  source?: string;
  notes?: string;
};

export const events: FanEvent[] = [];

export function eventYear(event: FanEvent): number {
  const year = Number.parseInt(event.startAt.slice(0, 4), 10);
  if (Number.isNaN(year)) {
    throw new Error(`Event "${event.id}" has an invalid startAt: ${event.startAt}`);
  }
  return year;
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
      events: [...yearEvents].sort((a, b) => a.startAt.localeCompare(b.startAt)),
    }));
}

export function isUpcomingEvent(event: FanEvent, now = new Date()): boolean {
  const end = event.endAt ?? event.startAt;
  return new Date(`${end}T23:59:59+09:00`).getTime() >= now.getTime();
}
